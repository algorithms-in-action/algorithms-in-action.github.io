/**
 * This file contains shared insertion code for both BST and AVL trees
 * and also recursive BST search!
 *
 * May soon contain splay tree code - currently just hacked so we can
 * display splay tree pseudocode XXX FIX this. Best refactor code if
 * possible to avoid duplication of code (we want the animations to be
 * as similar as possible). Other cleaning up might be possible also -
 * some is getter rather complex. Might be best to refactor a bit and
 * have splay tree code in a separate file but use some common code.
 * Splay tree recursion goes two tree levels at a time but uses the
 * same rotation code and left-right/right-left cases are the same as
 * AVL trees.
 *
 * It uses a flag to determine it's AVL insertion or BST insertion.
 * Also now used for recursive search to avoid duplicating the code
 * for visualising recursion; some naming may be misleading. NOTE that
 * naming of blocks and bookmarks in the three different files must be
 * consistent! (or four different files when we add Splay trees!)
 * 
 * The insertion algorithm is implemented using the following steps:
 * 1. If the tree is empty, create new node as the root of the tree and
 *    return.
 * 2. Compare the key to be inserted with the current node's key, 
 *    and recursively insert the key into the left or right subtree.
 * 3. BST: Return the root node DONE.
 * 3. AVL: Update the height of the root node based on the heights of 
 *    its children.
 * 4. Check the balance factor of the root node and rebalance using
 * rotation(s) if needed.
 * 5. Return the root node.
 */ 

import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { areExpanded } from './collapseChunkPlugin';
import SplayTree from './splaytree';
import { insertTree, searchTree } from './treeAlgorithms';
import {
    TreeNode, traversePreOrder, fromFlatTree, createTreeSnapshot, getTreePath,
} from './helpers/treeUtils';
import { getRotationBookmarks, startRotationMovement, advanceRotationMovement, detachRotationEdges, attachRotationTransfer, reconnectRotationParent, finishRotationLayout } from './helpers/rotationAnimationHelpers';

import { clearTreeHighlights, highlightTreePath, centerRotatedRoot, lowerRotatedPivot, showTreeOperation, pushTreeDepthBox, trimTreeDepthBoxes, clearTreePointerLabels } from './helpers/treeOperationHelpers';

// Moving to new color scheme
// XXX Currently code is a bit shit  due to previous use of older color
// scheme interface - worth cleaning up
import {BSTColors as colors} from './BSTColors';

import { getTreeAnimationState, resetTreeAnimationState } from './helpers/treeAnimationState';

// remove any highlighting etc from tree XXX also in AVLTreeSearch.js

const uncolor = (graph, root) => {
    traversePreOrder(root, node => graph.setNodeColor(node.key, undefined));
};


// Global flag for insert/search (set when controller init is run)

// checks if either recursive call is expanded
function isRecursionExpanded(inserting = true, mode = null) {
  const activeMode = mode || (inserting ? 'insertion' : 'search');
  const prefix = activeMode === 'operations' ? `${inserting ? 'insert' : 'search'}_` : '';
  return areExpanded([`${prefix}recurseLeft`], activeMode)
      || areExpanded([`${prefix}recurseRight`], activeMode);
}

// Algorithm-specific metadata stays here, outside the shared structural helpers.
function createAlgorithmNode(key, isAVL) {
    const node = new TreeNode(key);
    if (isAVL) node.height = 1;
    return node;
}

// XXX popAfterReturnFlag seems to be used in a dodgy way, being set
// and tested inside chunks as a global variable, not passed into chunks
// as an argument. Because of the collapseChunkPlugin stuff stepping
// backwards re-executes from the start so it seems to work but is
// fagile (and the initial value of false may not be the initial value
// when re-executing).

// Previously this code used the old colour scheme and had things like
// vis.graph.visit(rl,r) that coloured two nodes plus the edge between
// them, and vis.graph.resetVisitAndSelect(t2, t6) that reset colours.
// To make changing to the new colour interface easier we have
// reproduced a similar interface for the old code.
// XXX best rename now.
// We need some global variables to keep track of what things have been
// coloured - Boo, hiss   XXX would be good to clean this up

// n2 -> n1 is involved in rotation - colour nodes and edge
// (leave newNode as is)
let graph_visit = (graph, n1, n2) => {
  const state = getTreeAnimationState(graph);
  if (n1 !== state.newNode) {
    graph.setNodeColor(n1, colors.ROT_N);
    state.rotNodes.push(n1);
  }
  if (n2 !== state.newNode) {
    graph.setNodeColor(n2, colors.ROT_N);
    state.rotNodes.push(n2);
  }
  graph.setEdgeColor(n2, n1, colors.ROT_E);
  state.rotEdges.push([n2,n1]);
};

// reset colours set above
let graph_reset = (graph, n1, n2) => {
  const state = getTreeAnimationState(graph);
  if (n1 !== state.newNode) {
    graph.setNodeColor(n1, undefined);
  }
  if (n2 !== state.newNode) {
    graph.setNodeColor(n2, undefined);
  }
  graph.setEdgeColor(n2, n1, undefined);
};

// clears all the colouring set above
let graph_clear = (graph) => {
  const state = getTreeAnimationState(graph);
  state.rotNodes.forEach(n => {graph.setNodeColor(n, undefined);});
  state.rotNodes = [];
  state.rotEdges.forEach(n => {graph.setEdgeColor(n[0], n[1], undefined);});
  state.rotEdges = [];
};

// Translate one completed structural rotation into the existing visual stages.
// Snapshots describe the old/new trees; this adapter never changes child pointers.
function addAVLRightRotationChunks(chunker, event) {
    const bookmarks = getRotationBookmarks('right');
    const root = event.rootBefore;
    const temp = event.rootAfter;
    const pivotAfter = temp.right;
    const parentNode = event.parentKey === null ? null : { key: event.parentKey };
    const globalRootKey = event.globalRootKey;
    const depth = event.depth + 1;
    const rotateVis = event.isFinalRotation;
    const R = root;
    const A = root.left;
    const D = A.right;
    const RR = root.right ? root.right.key : null;
    // assign the root as t6 in the pseudocode
    chunker.add(bookmarks.enter,
            (vis, r, rl, rll) => {
                graph_clear(vis.graph);
                // vis.graph.clearSelect_Circle_Count();
                // show tid of t6 on the graph
                vis.graph.updateTID(r, 't6');
    
                // cancel highlighting of the edges (r->rl, rl->rll)
                // they were highlighted when the case was detected
                graph_visit(vis.graph, rl,r);
                // vis.graph.findNode(r).visitedCount = 1;
              
            }, [root.key, root.left.key, root.left.left ? root.left.left.key : null],
            depth
        );

    // assign the left child of the root as t2 in the pseudocode
    chunker.add(bookmarks.identifyNewRoot,
            (vis, tt2, tt6) => {
                vis.graph.updateTID(tt2, 't2');
                startRotationMovement(vis.graph, tt6, tt2);
            },
            [A.key, R.key],
            depth
        );

    // assign the right child of t2 as t4 in the pseudocode
    chunker.add(bookmarks.identifyTransfer,
            (vis, tt6, tt2, tt4) => {
                // show tid of t4 on the graph
                if (tt4) {
                    vis.graph.updateTID(tt4, 't4');
                } else {
                    // if t4 is null, show "t4 is Empty" on the graph
                    vis.graph.setTagInfo('t4 ');
                }
    
                // -- following code is for visualising the rotation step by step --
                // freeze the layout to avoid the nodes moving automatically
                advanceRotationMovement(vis.graph, tt6, tt2, { pauseLayout: true });
            },
            [R.key, A.key, D ? D.key : false],
            depth
        );

    // let t2's right child point to t6
    chunker.add(bookmarks.linkPivot,
            (vis, t6, t2, t4, p, rotate) => {
                graph_reset(vis.graph, t2, t6);
                detachRotationEdges(vis.graph, t6, t2, t4);
    
                if (rotate) graph_reset(vis.graph, t6, null);
    
                vis.graph.addEdge(t2, t6);
                graph_visit(vis.graph, t6, t2);
    
                if (t4 !== null) vis.graph.removeEdge(t6, t4);
                // set the new position of the node(s)
                // - just move (new) root node towards center more.
                // New child and grandchild moved in next chunk -
                // could do them here also but less confusing as is?
                centerRotatedRoot(vis.graph, t2);
            },
            [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, rotateVis],
            depth
        );

    // if t4 is not null, let t6's left child point to t4
    chunker.add(bookmarks.linkTransfer,
            (vis, t6, t6r, t2, t4, p, rotate) => {
                // vis.graph.setMoveRatio(9/10);
                attachRotationTransfer(vis.graph, t6, t4);
                // set the new position of the nodes
                // - just move (new) child node down more
                // plus it's child also (if it has one)
                const deltaY = lowerRotatedPivot(vis.graph, t6);
                if (t6r !== null) {
                    vis.graph.moveNodePosition(t6r, 0, deltaY);
                }
            },
            [R.key, RR, A.key, D ? D.key : null, parentNode ? parentNode.key : null, rotateVis],
            depth
        );

    // update height in the graph, it will overwrite the tid as well
    chunker.add('recompute heights of t6 and t2', (vis, r, h1, t, h2, d, h3) => {
            vis.graph.setTagInfo('');
            vis.graph.updateHeight(r, h1);
            vis.graph.updateHeight(t, h2);
            if (d !== null) vis.graph.updateHeight(d, h3);
        },
            [root.key, pivotAfter.height, temp.key, temp.height, D ? D.key : null, D ? D.height : 0],
            depth,
        );

    // finalise the rotation
    chunker.add(bookmarks.returnRoot,
            (vis, g, p, t2, t6) => {
                // vis.graph.clearTID();
                vis.graph.updateTID(t2, 't2');
                reconnectRotationParent(vis.graph, p, t6, t2);
    
                // vis.graph.clearSelect_Circle_Count();
                graph_clear(vis.graph);
              
                finishRotationLayout(vis.graph, g, false);
                vis.graph.rectangle_size();
            },
            [parentNode ? globalRootKey : temp.key, parentNode ? parentNode.key : null, A.key, R.key],
            depth
        );
}

// Translate one completed structural rotation into the existing visual stages.
// Snapshots describe the old/new trees; this adapter never changes child pointers.
function addAVLLeftRotationChunks(chunker, event) {
    const bookmarks = getRotationBookmarks('left');
    const root = event.rootBefore;
    const temp = event.rootAfter;
    const pivotAfter = temp.left;
    const parentNode = event.parentKey === null ? null : { key: event.parentKey };
    const globalRootKey = event.globalRootKey;
    const depth = event.depth + 1;
    const rotateVis = event.isFinalRotation;
    const R = root;
    const A = root.right;
    const D = A.left;
    const RL = root.left ? root.left.key : null;
    // assign the root as t2 in the pseudocode
    chunker.add(bookmarks.enter,
            (vis, r, rr, rrr) => {
    
                graph_clear(vis.graph);
                // vis.graph.clearSelect_Circle_Count();
                // show tid of t2 on the graph
                vis.graph.updateTID(r, 't2');
    
                graph_visit(vis.graph, rr,r);
    
            }, [root.key, root.right.key, root.right.right ? root.right.right.key : null],
            depth
        );

    // assign the right child of the root as t6 in the pseudocode
    chunker.add(bookmarks.identifyNewRoot,
            (vis, tt6, tt2) => {
                vis.graph.updateTID(tt6, 't6');
                startRotationMovement(vis.graph, tt2, tt6);
            },
            [A.key, R.key],
            depth
        );

    // assign the left child of t6 as t4 in the pseudocode
    chunker.add(bookmarks.identifyTransfer,
            (vis, tt2, tt6, tt4) => {
                // show tid of t4 on the graph
                if (tt4) {
                    vis.graph.updateTID(tt4, 't4');
                } else {
                    // if t4 is null, show "t4 is Empty" on the graph
                    vis.graph.setTagInfo('t4 ');
                }
    
                // -- following code is for visualising the rotation step by step --
                // freeze the layout to avoid the nodes moving automatically
                advanceRotationMovement(vis.graph, tt2, tt6, { pauseLayout: true });
            },
            [R.key, A.key, D ? D.key : false],
            depth
        );

    // let t6's left child point to t2
    chunker.add(bookmarks.linkPivot,
            (vis, t2, t6, t4, p, rotate) => {
                // highlight the edge between t6 and t2
                // if (rotate) graph_visit(vis.graph, t2, p);
                graph_reset(vis.graph, t6, t2);
                detachRotationEdges(vis.graph, t2, t6, t4);
    
                if (rotate) graph_reset(vis.graph, t2, null);
    
                vis.graph.addEdge(t6, t2);
                graph_visit(vis.graph, t2, t6);
                // remove edge after layout to perform the middle step
                if (t4 !== null) vis.graph.removeEdge(t2, t4);
                // set the new position of the nodes
                // - just move (new) root node towards center more.
                // New child and grandchild moved in next chunk -
                // could do them here also but less confusing as is?
                centerRotatedRoot(vis.graph, t6);
            },
            [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, rotateVis],
            depth
        );

    // if t4 is not null, let t2's right child point to t4
    chunker.add(bookmarks.linkTransfer,
            // reconnect the edge between t2 and t4
            (vis, t2, t2l, t6, t4, p, rotate) => {
                attachRotationTransfer(vis.graph, t2, t4);
                // set the new position of the nodes
                // - just move (new) child node down more
                // plus it's child also (if it has one)
                const deltaY = lowerRotatedPivot(vis.graph, t2);
                if (t2l !== null) {
                    vis.graph.moveNodePosition(t2l, 0, deltaY);
                }
            },
            [R.key, RL, A.key, D ? D.key : null, parentNode ?  parentNode.key : null, rotateVis],
            depth
            );

    // update height in the graph
    chunker.add('recompute heights of t2 and t6', (vis, r, h1, t, h2, d, h3) => {
            vis.graph.setTagInfo('');
            vis.graph.updateHeight(r, h1);
            vis.graph.updateHeight(t, h2);
            if (d !== null) vis.graph.updateHeight(d, h3);
        },
            [root.key, pivotAfter.height, temp.key, temp.height, D ? D.key : null, D ? D.height : 0],
            depth,
        );

    // finalise the rotation
    chunker.add(bookmarks.returnRoot,
            (vis, g, p, t6, t2) => {
                vis.graph.updateTID(t6, 't6');
                reconnectRotationParent(vis.graph, p, t2, t6);
                // vis.graph.clearSelect_Circle_Count();
                graph_clear(vis.graph);
                finishRotationLayout(vis.graph, g, false);
                vis.graph.rectangle_size();
            },
            [parentNode ? globalRootKey : temp.key, parentNode ? parentNode.key : null, A.key, R.key],
            depth
        );
}


function addTreeAlgorithmEventChunks(chunker, event, currIndex, mode) {
    const { key, depth, root, globalRootKey, balance } = event;
    const parentNode = event.parentKey === null ? null : { key: event.parentKey };
    const isInsert = event.operation === 'insert';
    const isAVL = event.algorithm === 'avl';
    switch (event.type) {
        case 'call-enter':
            // init global fagl used for colouring
            // visualise the basic information of the insertion
            chunker.add(`Main`,
        (vis, k, d, index, r, p, rr) => {
            if (d === 1) {
                // remove any message about ignoring
                // duplicate keys
                // XXX nicer to have this in the last chunk,
                // along with removing rectangles in AVL
                // (but many chunks can be the last so we do
                // this for now)
                vis.graph.setText('');
            }
            if (getTreeAnimationState(vis.graph).popAfterReturnFlag) { // Not needed here???
                vis.graph.popRectStack();
                vis.graph.setNodeColor(rr, undefined);
                getTreeAnimationState(vis.graph).popAfterReturnFlag = false;
            }
            if (rr !== null && rr !== undefined) {
                // visit from root to root, to just highlight the current node, without highlighting the edge
                // graph_visit(vis.graph, rr, rr);
                vis.graph.setNodeColor(rr, colors.PATH_N);
            }
            // print the function name and the key to be inserted
            showTreeOperation(vis.graph, isInsert ? 'insert' : 'search', k);
            vis.graph.setFunctionInsertText();
            
            // Only add rectangles when recursion is expanded
            if (isRecursionExpanded(isInsert, mode)) {
                if (rr !== null && rr !== undefined) {
                    let nodeIds = vis.graph.getSubtreeNodes(rr);
                    pushTreeDepthBox(vis.graph, nodeIds, d);
                }
                else {
                    // add temporary node
                    vis.graph.addNode(k, k);
                    if (p !== null) {
                        vis.graph.addEdge(p, k);
                    }
                    vis.graph.addNodeToRectStack(k, p);
                    if (isAVL) {
                        vis.graph.updateHeight(k, 1);
                    }
                    // Add a rectangle for the node
                    pushTreeDepthBox(vis.graph, [k], d);
                    // Add a empty rectangle to display "Empty"
                    vis.graph.pushRectStack([], 'Empty');
                    vis.graph.rectangle_size();
                    // Pause the layout then remove the node
                    vis.graph.setPauseLayout(true);
                    vis.graph.removeNode(k);
                }
            }
        },
        [key, depth, currIndex, root ? `...${root.key}...` : "Empty", parentNode ? parentNode.key : null, root ? root.key : null],
        depth
    );
            chunker.add('if t = Empty', (vis) => null, [], depth);
            break;
        case 'search-result':
            if (event.found) {
                chunker.add('if n.key = k',
            (vis, k) => {
                vis.graph.setNodeColor(k, colors.FOUND_N);
            }
            , [key], depth);
                chunker.add('return t',
            (vis, r, p) => {
                getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
                vis.graph.setText('Key found');
                // XXX want to highlight node here (also highlight
                // inserted nodes); remove highlight at end of insert
            },
            [key, parentNode ? parentNode.key : null],
            depth
        );
            } else {
                chunker.add('return NotFound',
            (vis, r, p) => {
                // Pop the "Empty" rectangle
                getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
                vis.graph.setText('Key not found');
            },
            [key, parentNode ? parentNode.key : null],
            depth
        );
            }
            break;
        case 'insertion':
            // Insertion: if the tree is empty, create a new node as the root
            // We pop the Empty rectangle but create a new one around the new
            // node (if it has a parent)
            chunker.add('return n',
            (vis, r, p) => {
                // Pop the "Empty" rectangle
                vis.graph.popRectStack();
                vis.graph.setPauseLayout(false);
                vis.graph.addNode(r, r);
                getTreeAnimationState(vis.graph).newNode = r;
                vis.graph.setNodeColor(r, colors.NEW_N);
                if (isAVL) {
                    vis.graph.updateHeight(r, 1);
                }
                if (p !== null) { // not needed??
                    vis.graph.addEdge(p, r);
                    vis.graph.addNodeToRectStack(r, p);
                    // now pause layout and remove edge (added again next chunk)
                    vis.graph.setPauseLayout(true);
                    vis.graph.removeEdge(p, r);
                }
                vis.graph.rectangle_size();
                getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
            },
            [key, parentNode ? parentNode.key : null],
            depth
        );
            break;
        case 'compare':
            chunker.add('if k < t.key', (vis) => { }, [], depth);
            if (event.comparison > 0) { chunker.add('else if k > root(t).key', (vis) => null, [], depth); }
            break;
        case 'call-before':
            if (event.direction === 'left') { chunker.add('prepare for the left recursive call', (vis) => null, [], depth); }
            else { chunker.add('prepare for the right recursive call', (vis) => null, [], depth); }
            break;
        case 'call-after':
            // restore the function information after the recursive call
            if (event.direction === 'left') { chunker.add(`recursiveCallLeft`,
            (vis, subtree, k, r) => {
                if (!subtree) {
                    // Search (unsuccessful): pop "Empty" rectangle
                    vis.graph.popRectStack();
                    vis.graph.setNodeColor(r.key, undefined);
                } else if (isInsert && subtree.key == k) {
                    // Inserted into child: add edge
                    vis.graph.addEdge(r.key, k);
                }
                vis.graph.setPauseLayout(false);
                vis.graph.setFunctionInsertText();
                if (getTreeAnimationState(vis.graph).popAfterReturnFlag) {
                    vis.graph.popRectStack();
                    if (subtree && subtree.key !== k)
                        vis.graph.setNodeColor(subtree.key, undefined);
                    vis.graph.rectangle_size();
                    getTreeAnimationState(vis.graph).popAfterReturnFlag = false;
                }
                getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
            },
            [root.left, key, root],
            depth); }
            else { chunker.add(`recursiveCallRight`,
            (vis, subtree, k, r) => {
                if (!subtree) {
                    // Search (unsuccessful): pop "Empty" rectangle
                    vis.graph.popRectStack();
                } else if (isInsert && subtree.key == k) {
                    // Inserted into child: add edge
                    vis.graph.addEdge(r.key, k);
                }
                vis.graph.setPauseLayout(false);
                vis.graph.setFunctionInsertText();
                if (getTreeAnimationState(vis.graph).popAfterReturnFlag) {
                    vis.graph.popRectStack();
                    if (subtree && subtree.key !== k)
                        vis.graph.setNodeColor(subtree.key, undefined);
                    vis.graph.rectangle_size();
                    getTreeAnimationState(vis.graph).popAfterReturnFlag = false;
                }
                getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
            },
            [root.right, key, root],
            depth); }
            break;
        case 'duplicate':
            // Key already exists in the tree (insert)
            chunker.add('else if k > root(t).key',
            (vis) => {
                // graph_clear(vis.graph); // clear all highlighting
                vis.graph.setText('Duplicate key - insertion ignored');
                // popAfterReturnFlag = true;
            },
            [],
            depth
        );
            break;
        case 'height-update':
            // update height in the graph
            chunker.add('root(t).height = 1 + max(left(t).height, right(t).height)',
        (vis, r, h) => {
            vis.graph.updateHeight(r, h);
        },
        [root.key, root.height],
        depth
    );
            break;
        case 'balance':
            // update the balance factor in the graph
            chunker.add('switch balanceCase of', (vis, r) => {
        vis.graph.setFunctionNode(`${r}`);
        // vis.graph.clearSelect_Circle_Count();
        // vis.graph.setSelect_Circle_Count(r);
        vis.graph.setFunctionBalance(balance);
    }, [root.key], depth);
            switch (event.balanceCase) {
                case 'LL': chunker.add('perform right rotation to re-balance t',
            (vis, r, b, rl, rll) => {
                // show the rotation type and the node to be rotated
                vis.graph.setFunctionInsertText(` balanceCase: LL`);
                // vis.graph.clearSelect_Circle_Count();
                // vis.graph.setSelect_Circle_Count(r);
                vis.graph.setFunctionNode(`${r}`);

                // highlight edges involved in the rotation case
                graph_clear(vis.graph);
                graph_visit(vis.graph, rl, r);
                graph_visit(vis.graph, rll, rl);

            },
            [root.key, balance, root.left.key, root.left.left ? root.left.left.key : null],
            depth
        ); break;
                case 'RR': chunker.add('perform left rotation to re-balance t',
            (vis, r, b, rr, rrr) => {
                // show the rotation type and the node to be rotated
                vis.graph.setFunctionInsertText(` balanceCase: RR`);
                vis.graph.setFunctionNode(`${r}`);
                // vis.graph.clearSelect_Circle_Count();
                // vis.graph.setSelect_Circle_Count(r);

                // highlight edges involved in the rotation case
                graph_clear(vis.graph);
                graph_visit(vis.graph, rr, r);
                graph_visit(vis.graph, rrr, rr);
            },
            [root.key, balance, root.right.key, root.right.right ? root.right.right.key : null],
            depth
        ); break;
                case 'LR': chunker.add('perform left rotation on the left subtree',
            (vis, r, b, rl, rlr) => {
                // show the rotation type and the node to be rotated
                vis.graph.setFunctionInsertText(` balanceCase: LR`);
                // vis.graph.clearSelect_Circle_Count();
                // vis.graph.setSelect_Circle_Count(r);
                vis.graph.setFunctionNode(`${r}`);
                
                // highlight edges involved in the rotation case
                graph_clear(vis.graph);
                graph_visit(vis.graph, rl, r);
                graph_visit(vis.graph, rlr, rl);
            },
            [root.key, balance, root.left.key, root.left.right ? root.left.right.key : null],
            depth
        ); break;
                case 'RL': chunker.add('perform right rotation on the right subtree',
            (vis, r, b, rr, rrl) => {
                // show the rotation type and the node to be rotated
                vis.graph.setFunctionInsertText(` balanceCase: RL`);
                vis.graph.setFunctionNode(`${r}`);
                // vis.graph.clearSelect_Circle_Count();
                // vis.graph.setSelect_Circle_Count(r);

                // highlight edges involved in the rotation case
                graph_clear(vis.graph);
                graph_visit(vis.graph, rr, r);
                graph_visit(vis.graph, rrl, rr);
            },
            [root.key, balance, root.right.key, root.right.left ? root.right.left.key : null],
            depth
        ); break;
                default: chunker.add('case Balanced', (vis) => null, [], depth); break;
            }
            break;
        case 'rotation':
            if (event.direction === 'right') addAVLRightRotationChunks(chunker, event);
            else addAVLLeftRotationChunks(chunker, event);
            break;
        case 'rotation-link': {
            const depth = event.depth + 1;
            // highlight the rotation in the visualisation
            if (event.direction === 'left') { chunker.add('left(t) <- leftRotate(left(t));',
            (vis, g, r) => {
                vis.graph.updateHeight(r.key, r.height);
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
            }, [(parentNode !== null) ? globalRootKey : root.key, root.left], depth); }
            else { chunker.add('right(t) <- rightRotate(right(t));',
            (vis, g, r) => {
                vis.graph.updateHeight(r.key, r.height);
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
            }, [(parentNode !== null) ? globalRootKey : root.key, root.right], depth); }
            break;
        }
        case 'call-return':
            if (!isInsert || event.created) break;
            if (!isAVL) {
                chunker.add('return t',
            (vis, r, p) => {
                // graph_reset(vis.graph, r, p);
                // popAfterReturnFlag = true;
            },
            [root.key, parentNode ? parentNode.key : null],
            depth
        );
                break;
            }
            switch (event.balanceCase) {
                // clear the function information after the rotation
                // and tidy up the nodes' position
                case 'LL': chunker.add('return rightRotate(t)', (vis, g, r) => {
            vis.graph.setMoveRatio(1);
            vis.graph.updateHeight(r.key, r.height);
            vis.graph.setFunctionNode(null);
            // vis.graph.clearSelect_Circle_Count();
            vis.graph.setFunctionBalance(null);
            // vis.graph.clearSelect_Circle_Count();
            graph_clear(vis.graph);
            vis.graph.setPauseLayout(false);
            vis.graph.layoutAVL(g, true, false);
            vis.graph.rectangle_size();
            getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
        }, [(parentNode !== null) ? globalRootKey : root.key, root], depth); break;
                // clear the function information after the rotation
                // and tidy up the nodes' position
                case 'RR': chunker.add('return leftRotate(t)', (vis, g, r) => {
            vis.graph.setMoveRatio(1);
            vis.graph.updateHeight(r.key, r.height);
            vis.graph.setFunctionNode(null);
            vis.graph.setFunctionBalance(null);
            // vis.graph.clearSelect_Circle_Count();
            graph_clear(vis.graph);
            vis.graph.setPauseLayout(false);
            vis.graph.layoutAVL(g, true, false);
            vis.graph.rectangle_size();
            getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
        }, [(parentNode !== null) ? globalRootKey : root.key, root], depth); break;
                // clear the function information after the rotation
                case 'LR': chunker.add('return rightRotate(t) after leftRotate',
            (vis, g, r) => {
                vis.graph.setMoveRatio(1);
                vis.graph.updateHeight(r.key, r.height);
                vis.graph.setFunctionNode(null);
                vis.graph.setFunctionBalance(null);
                // vis.graph.clearSelect_Circle_Count();
                graph_clear(vis.graph);
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
                getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
            },
            [(parentNode !== null) ? globalRootKey : root.key, root],
            depth); break;
                // clear the function information after the rotation
                case 'RL': chunker.add('return leftRotate(t) after rightRotate',
            (vis, g, r) => {
                vis.graph.setMoveRatio(1);
                vis.graph.updateHeight(r.key, r.height);
                vis.graph.setFunctionNode(null);
                vis.graph.setFunctionBalance(null);
                // vis.graph.clearSelect_Circle_Count();
                graph_clear(vis.graph);
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
                getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
            }, [(parentNode !== null) ? globalRootKey : root.key, root], depth); break;
                default: chunker.add('return t',
            (vis, r, p) => {
                vis.graph.setFunctionNode(null);
                vis.graph.setFunctionBalance(null); // clear balance after return in switch case
                // graph_reset(vis.graph, r, p); // clear all highlighting
                getTreeAnimationState(vis.graph).popAfterReturnFlag = true;
            },
            [root.key, parentNode ? parentNode.key : null],
            depth
        ); break;
            }
            break;
        default:
            throw new Error('Unknown tree algorithm event: ' + event.type);
    }
}

export function insertOrSearch(chunker, root, key, currIndex, { avl = false, operation = 'insert', mode = null } = {}) {
    const isInsert = operation === 'insert';
    const onEvent = event => addTreeAlgorithmEventChunks(chunker, event, currIndex, mode);
    const result = isInsert
        ? insertTree(root, key, { avl, onEvent })
        : searchTree(root, key, { onEvent });
    chunker.add('Done', (vis, k, r) => {
        // vis.graph.setZoom(0.55);
        // Remove all the recursion rectangles first
        vis.graph.popAllRectStack();
        if (isInsert) {
            vis.graph.setFunctionName(`Inserted: ${k}`);
            vis.graph.setFunctionInsertText();
        }
        vis.graph.setNodeColor(k, undefined);
        vis.graph.setNodeColor(r, undefined);
        // vis.graph.layoutBST(currentRootKey, true);
        // vis.graph.setFunctionName(`Search: ${target}`);
        // vis.graph.setFunctionInsertText();
    }, [key, root === null ? null : root.key], 1);
    return isInsert ? result : (result === null ? 'fail' : 'success');
}



// Get the path from the root to a specific key in the splay tree
// This function traverses the tree and
// records the keys of the nodes along the path to the target key.
export function getSplayTreePath(root, key) {
    return getTreePath(root, key);
}

// Map actual algorithm call entries to the existing animation frame format.
// The algorithm owns case/path decisions; only pseudocode block names live here.
export function getSplayRecursionFrames(events) {
    const frames = [];
    const callers = new Map();
    events.filter(event => event.type === 'call-enter').forEach(event => {
        const caller = callers.get(event.depth - 1);
        frames.push({
            depth: event.depth,
            nodeKeys: [...event.nodeKeys],
            recursionBlock: caller ? `${caller.splayCase}-recurse` : null,
            rootKey: event.rootKey,
            splayCase: event.splayCase,
        });
        callers.set(event.depth, event);
    });
    return frames;
}

function isSplayDepthExpanded(operationType, recursionBlocks = [], mode = 'operations', deletionPhase = 1) {
    const operationBlock = operationType === 'search'
        ? 'search_splay'
        : operationType === 'delete' ? `DelSplay${deletionPhase}` : 'insert_splay';

    return areExpanded([operationBlock, ...recursionBlocks], mode);
}

function getSplayCaseLabel(splayCase, rotationCount) {
    if (rotationCount <= 0) return 'No rotation';
    if (rotationCount === 1 || splayCase === 'LE' || splayCase === 'RE') {
        return `Zig (${splayCase})`;
    }
    if (splayCase === 'LL' || splayCase === 'RR') {
        return `Zig-Zig (${splayCase})`;
    }
    return `Zig-Zag (${splayCase})`;
}

function addSplayDepthBox(graph, frame, operationType, rotationCount, recursionBlocks, mode, deletionPhase) {
    if (!frame || !isSplayDepthExpanded(
        operationType,
        recursionBlocks,
        mode,
        deletionPhase,
    )) return;

    pushTreeDepthBox(graph, frame.nodeKeys, frame.depth, true);
    graph.setFunctionInsertText(
        ` splayCase: ${getSplayCaseLabel(frame.splayCase, rotationCount)}`,
    );
}

function countSplayRotationsByDepth(events) {
    return events.reduce((counts, event) => {
        if (event.type !== 'rotation') return counts;
        counts[event.depth] = (counts[event.depth] || 0) + 1;
        return counts;
    }, {});
}

function getSplayCaseBookmark(splayCase) {
    return {
        LL: 'left-left',
        LR: 'left-right',
        RR: 'right-right',
        RL: 'right-left',
        LE: 'left-empty',
        RE: 'right-empty',
    }[splayCase] || 'case-empty';
}

function startSplayRotationMovement(graph, pivotKey, newRootKey, direction) {
    const children = graph.getTree()[pivotKey];
    const outerChildKey = direction === 'right' ? children.right : children.left;

    startRotationMovement(graph, pivotKey, newRootKey, { outerChildKey });
    graph.rectangle_size();
}

function centerSplayRotatedRoot(graph, newRootKey) {
    centerRotatedRoot(graph, newRootKey);

    graph.rectangle_size();
}

function lowerSplayRotatedPivot(graph, pivotKey) {
    const pos0 = graph.getRotPos();
    const deltaY = lowerRotatedPivot(graph, pivotKey);

    if (pos0.outerChildKey !== null && pos0.outerChildKey !== undefined) {
        const tree = graph.getTree();

        const move = key => {
            if (key === null || key === undefined) return;

            graph.moveNodePosition(key, 0, deltaY);
            move(tree[key].left);
            move(tree[key].right);
        };

        move(pos0.outerChildKey);
    }

    graph.rectangle_size();
}

// Register the visual stages for one rotation reported by the pure Splay
// Tree. The algorithm event contains only node keys; this helper translates
// them into the same t2/t4/t6 pointer operations used by the AVL animation.
export function addSplayRotationChunk(
    chunker,
    event,
    operationType = 'insert',
    rotationCount = 1,
    renderedRootKey = null,
    includeCaseStep = true,
    mode = 'operations',
    deletionPhase = 1,
) {
    const bookmarks = getRotationBookmarks(event.direction);
    const rotationName = `${event.direction === 'right' ? 'Right' : 'Left'} rotation: ${event.pivotKey}`;
    const caseLabel = getSplayCaseLabel(event.splayCase, rotationCount);
    const rotationDepth = event.depth + 1;

    if (includeCaseStep) {
        chunker.add(
            getSplayCaseBookmark(event.splayCase),
            (vis, rotation) => {
                const graph = vis.graph;

                // When recursive Splay calls return, discard boxes belonging
                // to deeper calls before animating the current rotation.
                trimTreeDepthBoxes(graph, rotation.depth);

                graph.setFunctionName(
                    `${caseLabel}: rotate ${rotation.pivotKey}`,
                );
                if (graph.setFunctionInsertText) {
                    graph.setFunctionInsertText(` splayCase: ${caseLabel}`);
                }
            },
            [event],
            event.depth,
        );
    }

    // Select this case's rotation call before entering the shared primitive.
    // Symmetric cases have distinct bookmarks even when they rotate alike.
    chunker.add(event.bookmark, () => {}, [event], event.depth);

    chunker.add(
        bookmarks.enter,
        (vis, rotation) => {
            const graph = vis.graph;

            graph.setPauseLayout(true);
            clearTreePointerLabels(graph);

            // Remove traversal or previous-rotation colours before showing
            // the current rotation.
            clearTreeHighlights(graph);

            if (graph.updateTID) {
                graph.updateTID(
                    rotation.pivotKey,
                    rotation.direction === 'right' ? 't6' : 't2',
                );
            }
            graph.setNodeColor(rotation.pivotKey, colors.ROT_N);
            graph.setFunctionName(rotationName);
            if (graph.setFunctionInsertText) {
                graph.setFunctionInsertText(` splayCase: ${caseLabel}`);
            }
        },
        [event],
        rotationDepth,
    );

    chunker.add(
        bookmarks.identifyNewRoot,
        (vis, rotation) => {
            const graph = vis.graph;

            if (graph.updateTID) {
                graph.updateTID(
                    rotation.newRootKey,
                    rotation.direction === 'right' ? 't2' : 't6',
                );
            }
            graph.setNodeColor(rotation.newRootKey, colors.ROT_N);
            graph.setEdgeColor(
                rotation.pivotKey,
                rotation.newRootKey,
                colors.ROT_E,
            );

            startSplayRotationMovement(graph, rotation.pivotKey, rotation.newRootKey, rotation.direction);
        },
        [event],
        rotationDepth,
    );

    chunker.add(
        bookmarks.identifyTransfer,
        (vis, rotation) => {
            const graph = vis.graph;

            if (rotation.transferredSubtreeKey !== null) {
                if (graph.updateTID) {
                    graph.updateTID(rotation.transferredSubtreeKey, 't4');
                }
                graph.setNodeColor(
                    rotation.transferredSubtreeKey,
                    colors.ROT_N,
                );
            } else if (graph.setTagInfo) {
                graph.setTagInfo('t4 ');
            }
            advanceRotationMovement(graph, rotation.pivotKey, rotation.newRootKey, { resize: true });
        },
        [event],
        rotationDepth,
    );

    chunker.add(
        bookmarks.linkPivot,
        (vis, rotation) => {
            const graph = vis.graph;
            const {
                pivotKey,
                newRootKey,
                transferredSubtreeKey,
            } = rotation;

            detachRotationEdges(graph, pivotKey, newRootKey, transferredSubtreeKey);
            graph.addEdge(newRootKey, pivotKey);
            graph.setEdgeColor(newRootKey, pivotKey, colors.ROT_E);
            centerSplayRotatedRoot(graph, newRootKey);
        },
        [event],
        rotationDepth,
    );

    chunker.add(
        bookmarks.linkTransfer,
        (vis, rotation) => {
            attachRotationTransfer(vis.graph, rotation.pivotKey, rotation.transferredSubtreeKey, colors.ROT_E);
            lowerSplayRotatedPivot(vis.graph, rotation.pivotKey);
        },
        [event],
        rotationDepth,
    );

    chunker.add(
        bookmarks.returnRoot,
        (vis, rotation, explicitRootKey) => {
            const graph = vis.graph;

            // The caller receives the new subtree root at this point. Update
            // its parent edge only now, matching the rotation pseudocode.
            reconnectRotationParent(graph, rotation.parentKey, rotation.pivotKey, rotation.newRootKey);

            if (graph.setTagInfo) graph.setTagInfo('');
            graph.directed(true);
            finishRotationLayout(graph, explicitRootKey === null ? graph.getRoot() : explicitRootKey);
            if (graph.rectangle_size) graph.rectangle_size();
            graph.setFunctionName(
                isSplayDepthExpanded(operationType, [], mode, deletionPhase)
                    ? `${caseLabel} — ${rotationName}`
                    : rotationName,
            );
            if (graph.setFunctionInsertText) {
                graph.setFunctionInsertText(` splayCase: ${caseLabel}`);
            }
        },
        [event, renderedRootKey],
        rotationDepth,
    );

    // Resume the Splay caller after the rotation has returned its subtree root.
    chunker.add(event.bookmark, () => {}, [event], event.depth);
}

// Register all primitive rotations for one Splay operation. A Zig-Zig or
// Zig-Zag case selects its case once, then reuses two left/right primitives.
// The rendered global root is advanced after each root-level rotation.
export function addSplayRotationChunks(
    chunker,
    events,
    operationType = 'insert',
    initialRenderedRootKey = null,
) {
    const rotationEvents = events.filter(event => event.type === 'rotation');
    const rotationsByDepth = countSplayRotationsByDepth(rotationEvents);
    const shownCaseDepths = new Set();
    let renderedRootKey = initialRenderedRootKey;

    rotationEvents.forEach(event => {
        if (event.parentKey === null) {
            renderedRootKey = event.newRootKey;
        }

        const includeCaseStep = !shownCaseDepths.has(event.depth);
        shownCaseDepths.add(event.depth);
        addSplayRotationChunk(
            chunker,
            event,
            operationType,
            rotationsByDepth[event.depth],
            renderedRootKey,
            includeCaseStep,
        );
    });

    return renderedRootKey;
}

// Register each call in execution order: caller preparation, callee body,
// then the caller's assignment. Collapsed blocks use these levels to skip
// the entire call, even though the Splay function itself is in Main.
function addSplayCallChunks(
    chunker, events, operationType, key, initialRootKey, mode, deletionPhase = 1,
) {
    const callEntries = events.filter(event => event.type === 'call-enter');
    const callFrames = getSplayRecursionFrames(callEntries);
    const rotationEvents = events.filter(event => event.type === 'rotation');
    const rotationsByDepth = countSplayRotationsByDepth(rotationEvents);
    const recursiveCalls = {
        LL: ['pre-recurseLL', 'recurse-LL'],
        LR: ['pre-recurseLR', 'recurseLR'],
        RR: ['pre-recurseRR', 'recurseRR'],
        RL: ['pre-recurseRL', 'recurse-RL'],
    };
    let renderedRootKey = initialRootKey;

    function resumeCaller(bookmark, depth, frame = null) {
        chunker.add(bookmark, (vis, callerDepth, caller, target) => {
            const graph = vis.graph;
            trimTreeDepthBoxes(graph, callerDepth);
            clearTreePointerLabels(graph, true);
            showTreeOperation(graph, operationType, target);
            graph.setFunctionInsertText(caller
                ? ` splayCase: ${getSplayCaseLabel(caller.splayCase, rotationsByDepth[caller.depth] || 0)}`
                : undefined);
        }, [depth, frame, key], depth);
    }

    function visitCall(index) {
        const frame = callFrames[index];
        const { depth, splayCase } = frame;
        const recursionBlocks = callFrames.slice(0, index + 1)
            .map(call => call.recursionBlock).filter(Boolean);
        const rotationCount = rotationsByDepth[depth] || 0;

        chunker.add('splay-enter', (vis, currentFrame, target, count, blocks) => {
            const graph = vis.graph;
            clearTreePointerLabels(graph);
            showTreeOperation(graph, operationType, target);
            graph.setFunctionInsertText();
            if (currentFrame.nodeKeys.length > 0) {
                addSplayDepthBox(graph, currentFrame, operationType, count, blocks, mode, deletionPhase);
            }
        }, [frame, key, rotationCount, recursionBlocks], depth);

        const path = callEntries[index].pathKeys;
        // Highlight only this call's first two edges, together in one step.
        // Keep call entry and depth-box creation at splay-enter above.
        chunker.add('switchPath', (vis, pathNodes, target) => {
            const graph = vis.graph;
            clearTreeHighlights(graph);
            showTreeOperation(graph, operationType, target);
            highlightTreePath(graph, pathNodes, {
                node: colors.PATH_N,
                edge: colors.PATH_E,
            });
        }, [path, key], depth);
        chunker.add(getSplayCaseBookmark(splayCase), (vis, currentCase, count) => {
            vis.graph.setFunctionInsertText(` splayCase: ${getSplayCaseLabel(currentCase, count)}`);
        }, [splayCase, rotationCount], depth);

        if (index + 1 < callFrames.length) {
            const [prepare, returned] = recursiveCalls[splayCase];
            chunker.add(prepare, () => {}, [], depth);
            visitCall(index + 1);
            resumeCaller(returned, depth, frame);
        }

        if (splayCase === 'E') chunker.add('E-return', () => {}, [], depth);
        rotationEvents.filter(event => event.depth === depth).forEach(event => {
            if (event.parentKey === null) renderedRootKey = event.newRootKey;
            addSplayRotationChunk(
                chunker, event, operationType, rotationCount, renderedRootKey, false, mode, deletionPhase,
            );
        });
        chunker.add('DoneSplay', () => {}, [], depth);
    }

    const deleteBookmark = `Del_splay${deletionPhase}`;
    chunker.add(operationType === 'delete' ? deleteBookmark : `pre-${operationType}-splay`, () => {}, [], 0);
    visitCall(0);
    resumeCaller(operationType === 'delete' ? deleteBookmark : `${operationType}-splay-call`, 0);
}

function addSplayDeletionChunks(chunker, root, key, mode) {
    const initialRootKey = root === null ? null : root.key;
    const events = [];
    const recordEvent = event => events.push(event);
    const result = SplayTree.delete(root, key, recordEvent, recordEvent);
    const firstBranch = events.findIndex(event => event.type === 'deletion');
    const { action, rootKey, rightSubtreeKey } = events[firstBranch];
    const addLabel = (bookmark, label) => {
        chunker.add(bookmark, (vis, text) => {
            vis.graph.setFunctionName(text);
            vis.graph.setFunctionInsertText();
        }, [label], 0);
    };

    if (action === 'empty-tree') {
        addLabel('Del_t_Empty', `Delete: ${key} (tree is empty)`);
        addLabel('Del_return1', 'Tree is empty — no node deleted');
        return result;
    }

    addSplayCallChunks(chunker, events.slice(0, firstBranch), 'delete', key, initialRootKey, mode);
    if (action === 'not-found') {
        chunker.add('Del_not_found', (vis, accessedKey, searchedKey) => {
            const graph = vis.graph;
            clearTreeHighlights(graph);
            graph.setNodeColor(accessedKey, colors.NOT_EQ_N || colors.PATH_N);
            graph.setFunctionName(`Key ${searchedKey} not found — last accessed key ${accessedKey} at root`);
        }, [rootKey, key], 0);
        addLabel('Del_return2', `Key ${key} not found — no node deleted`);
        return result;
    }

    if (action === 'left-empty') {
        chunker.add('Del_left_empty', (vis, deletedKey) => {
            clearTreeHighlights(vis.graph);
            vis.graph.setNodeColor(deletedKey, colors.ROT_N);
            vis.graph.setFunctionName('Left subtree is empty, promote right child');
        }, [key], 0);
        chunker.add('Del_return3', (vis, deletedKey, promotedKey) => {
            const graph = vis.graph;
            graph.setPauseLayout(true);
            graph.removeNode(deletedKey);
            graph.setPauseLayout(false);
            if (promotedKey !== null) {
                graph.layoutBST(promotedKey, true);
                graph.setNodeColor(promotedKey, colors.NEW_N);
            }
            graph.setFunctionName(`Deleted: ${deletedKey}`);
            graph.setFunctionInsertText();
        }, [key, result === null ? null : result.key], 0);
        return result;
    }

    const secondCallEvents = events.slice(firstBranch + 1, -1);
    const leftRootKey = secondCallEvents.find(event => event.type === 'call-enter').rootKey;
    chunker.add('Del_init_temp', (vis, deletedKey, rightKey) => {
        const graph = vis.graph;
        if (rightKey !== null) {
            graph.setPauseLayout(true);
            graph.removeEdge(deletedKey, rightKey);
            graph.setPauseLayout(false);
            if (graph.updateTID) graph.updateTID(rightKey, 'temp');
        }
        graph.setNodeColor(deletedKey, colors.ROT_N);
        graph.setFunctionName(`Save right subtree of ${deletedKey} in temp`);
        graph.setFunctionInsertText();
    }, [key, rightSubtreeKey], 0);
    chunker.add('Del_init_temp', (vis, deletedKey, leftKey) => {
        const graph = vis.graph;
        graph.setPauseLayout(true);
        graph.removeNode(deletedKey);
        graph.setPauseLayout(false);
        graph.layoutBST(leftKey, true);
    }, [key, leftRootKey], 0);
    addSplayCallChunks(chunker, secondCallEvents, 'delete', key, leftRootKey, mode, 2);

    chunker.add('Del_use_temp', (vis, newRootKey, rightKey) => {
        const graph = vis.graph;
        if (rightKey !== null) {
            graph.setPauseLayout(true);
            graph.addEdge(newRootKey, rightKey);
            graph.setPauseLayout(false);
        }
        clearTreePointerLabels(graph);
        graph.setFunctionName('t.right <- temp (attach saved right subtree)');
        graph.setFunctionInsertText();
    }, [result.key, rightSubtreeKey], 0);
    chunker.add('Del_return4', (vis, newRootKey, deletedKey) => {
        const graph = vis.graph;
        trimTreeDepthBoxes(graph, 0);
        clearTreePointerLabels(graph, true);
        clearTreeHighlights(graph);
        graph.directed(true);
        graph.layoutBST(newRootKey, true);
        graph.setFunctionName(`Deleted: ${deletedKey}`);
        graph.setFunctionInsertText();
    }, [result.key, key], 0);
    return result;
}

function getSplayInsertionMessage(event) {
    switch (event.action) {
        case 'empty-tree':
            return `Insert ${event.key} into the empty tree`;
        case 'insert-left':
            return `Insert ${event.key} above and left of ${event.rootKey}`;
        case 'insert-right':
            return `Insert ${event.key} above and right of ${event.rootKey}`;
        case 'duplicate':
            return `Duplicate ignored: ${event.key}`;
        default:
            return `Insert: ${event.key}`;
    }
}

// Show the insertion decision at its caller-level condition/comment. Keep
// function-entry bookmarks reserved for the start of each operation.
function addSplayInsertionBranchChunk(chunker, event) {
    const bookmark = {
        'empty-tree': 'insert-test-empty',
        'insert-left': 'insert-test-left',
        'insert-right': 'insert-test-right',
        duplicate: 'insert-duplicate',
    }[event.action];
    chunker.add(
        bookmark,
        (vis, insertion) => {
            const graph = vis.graph;
            clearTreePointerLabels(graph);

            clearTreeHighlights(graph);

            if (insertion.rootKey !== null) {
                const rootColor = insertion.action === 'duplicate'
                    ? colors.FOUND_N
                    : colors.PATH_N;
                graph.setNodeColor(insertion.rootKey, rootColor);
            }

            graph.setFunctionName(getSplayInsertionMessage(insertion));
            graph.setFunctionInsertText();
        },
        [event],
        0,
    );
}

// Ensure three additional steps of animation within splay tree is registered
function addSplayInsertionSteps(chunker, event, leftKey, rightKey) {
    if (event.action !== 'insert-left' && event.action !== 'insert-right') return;

    const bookmark = event.action;
    const detachedKey = event.action === 'insert-left' ? leftKey : rightKey;

    chunker.add(`${bookmark}-save`, (vis, left, right) => {
        const graph = vis.graph;

        clearTreePointerLabels(graph);

        if (left !== null) {
            graph.updateTID(left, 'l');
            graph.setNodeColor(left, colors.PATH_N);
        }

        if (right !== null) {
            graph.updateTID(right, 'r');
            graph.setNodeColor(right, colors.PATH_N);
        }

        graph.rectangle_size();
    }, [leftKey, rightKey], 0);

    chunker.add(`${bookmark}-detach`, (vis, oldRoot, detached) => {
        const graph = vis.graph;

        graph.setPauseLayout(true);

        if (detached !== null) {
            graph.removeEdge(oldRoot, detached);
        }

        graph.rectangle_size();
    }, [event.rootKey, detachedKey], 0);

    chunker.add(`${bookmark}-create`, (vis, insertedKey, left, right) => {
        const graph = vis.graph;

        graph.setPauseLayout(true);
        graph.addNode(insertedKey, insertedKey);

        if (left !== null) {
            graph.addEdge(insertedKey, left);
        }

        if (right !== null) {
            graph.addEdge(insertedKey, right);
        }

        clearTreePointerLabels(graph);

        clearTreeHighlights(graph);

        graph.setNodeColor(insertedKey, colors.NEW_N);
        graph.directed(true);
        graph.setMoveRatio(1);
        graph.setPauseLayout(false);
        graph.layoutAVL(insertedKey, true);
        graph.rectangle_size();
    }, [event.key, leftKey, rightKey], 0);
}

function addSplaySearchSnapshotChunk(chunker, root, target) {
    if (root === null) {
        chunker.add(
            'search-return-not-found',
            (vis, searchedKey) => {
                if (vis.graph.clearRectangles) vis.graph.clearRectangles();
                clearTreePointerLabels(vis.graph);
                vis.graph.setFunctionName(`Not found: ${searchedKey}`);
                vis.graph.setFunctionInsertText();
            },
            [target],
            0,
        );
        return;
    }

    const {
        nodeKeys,
        edges,
        rootKey,
    } = createTreeSnapshot(root);
    const found = rootKey === target;

    chunker.add(
        found ? 'search-return-found' : 'search-return-not-found',
        (vis, keys, treeEdges, snapshotRoot, searchedKey, isFound) => {
            const graph = vis.graph;
            if (graph.clearRectangles) graph.clearRectangles();
            clearTreePointerLabels(graph);

            graph.setPauseLayout(true);
            [...graph.edges].forEach(({ source, target: child }) => {
                graph.removeEdge(source, child);
            });
            keys.forEach(nodeKey => {
                graph.addNode(nodeKey, nodeKey);
                graph.setNodeColor(nodeKey, undefined);
            });
            treeEdges.forEach(([parent, child]) => {
                graph.addEdge(parent, child);
            });

            graph.directed(true);
            graph.setPauseLayout(false);
            graph.root = snapshotRoot;
            graph.rectangle_size();
            graph.setNodeColor(
                searchedKey,
                isFound ? colors.FOUND_N : colors.PATH_N,
            );
            graph.setFunctionName(
                isFound ? `Found: ${searchedKey}` : `Not found: ${searchedKey}`,
            );
            graph.setFunctionInsertText();
        },
        [nodeKeys, edges, rootKey, target, found],
        0,
    );
}

// XXX interface currently uses true/false/'splay' to select a tree type;
// consider replacing it with named options in a future refactor.
// default is recursive BST insertion 
// If isAVL = true we have recursive AVLT insertion
// If isInsert = true 
export function createTreeInsertionController(isAVLp = false) {
    const isSplayController = (isAVLp === 'splay');
    const isAVL = (isAVLp === true);
    // const treeType = isAVL ? 'AVL' : 'BST'; // no longer used
    // const functionPrefix = isAVL ? 'AVLT' : 'BST';
    return {
        // visualiser used only for insert
        initVisualisers({ visualiser }) {
            return {
                graph: {
                    // XXX specialise "Tree" label???
                    instance: new GraphTracer(isAVL ? 'avl' : 'bst', null, `Tree`),
                    order: 1,
                },
             }
        },


        /**
        *
        * @param {object} chunker object to handle the execution of visualisation
        * @param {array} nodes array of numbers needs to be inserted
        */
        // nodes used for insert; visualiser and target used for search
        run(chunker, {
            nodes = [],
            operations,
            visualiser,
            target,
            mode = 'operations',
            initialRoot = null,
        }) {
            const operationList = isSplayController
                ? (
                    Array.isArray(operations)
                        ? operations
                        : nodes.map(value => ({
                            type: 'insert',
                            value,
                        }))
                )
                : nodes;

            if (operationList.length === 0) return;

            // Splay initializes its visualisation at the first operation's
            // entry. Other tree controllers retain their existing setup step.
            if (!isSplayController) {
                chunker.add(
                    'Main',
                    (vis) => {
                        vis.graph.isWeighted = isAVL;
                        vis.graph.setFunctionName('Tree is Empty');
                        vis.graph.setPauseLayout(false);
                        vis.graph.setMoveRatio(1);
                        vis.graph.setSize(1.2);
                        vis.graph.setZoom(0.5);
                    },
                    [],
                    1
                );
            }
            // Splay insertion stays in the pure data structure. Visual updates
            // are connected incrementally after the algorithm call is verified.
            if (isSplayController) {
                let root = initialRoot;

                operationList.forEach((operation, operationIndex) => {
                    const { type, value: key } = operation;

                    if (!Number.isInteger(key)) {
                        throw new Error(
                            `Invalid Splay Tree key: ${String(key)}`,
                        );
                    }

                    if (type !== 'insert' && type !== 'search' && type !== 'delete') {
                        throw new Error(
                            `Unknown Splay Tree operation: ${String(type)}`,
                        );
                    }

                    chunker.add(
                        type === 'search' ? '1' : type === 'delete' ? 'Del' : 'Main',
                        (vis, operationType, currentKey, initialize) => {
                            const graph = vis.graph;
                            if (initialize) {
                                graph.isWeighted = false;
                                graph.setPauseLayout(false);
                                graph.setMoveRatio(1);
                                graph.setSize(1.2);
                                graph.setZoom(0.5);
                            }
                            if (graph.clearRectangles) graph.clearRectangles();
                            clearTreePointerLabels(graph, true);
                            clearTreeHighlights(graph);
                            showTreeOperation(graph, operationType, currentKey);
                            graph.setFunctionInsertText();
                        },
                        [type, key, operationIndex === 0],
                        0,
                    );

                    if (type === 'delete') {
                        root = addSplayDeletionChunks(chunker, root, key, mode);
                        return;
                    }

                    if (type === 'search') {
                        const initialRootKey = root === null ? null : root.key;
                        const algorithmEvents = [];
                        const recordEvent = event => algorithmEvents.push(event);
                        root = SplayTree.search(
                            root,
                            key,
                            recordEvent,
                            recordEvent,
                        );
                        addSplayCallChunks(
                            chunker, algorithmEvents,
                            'search', key, initialRootKey, mode,
                        );
                        addSplaySearchSnapshotChunk(chunker, root, key);
                        return;
                    }

                    const initialRootKey = root === null ? null : root.key;
                    const algorithmEvents = [];
                    const recordEvent = event => algorithmEvents.push(event);
                    root = SplayTree.insert(
                        root,
                        key,
                        recordEvent,
                        recordEvent,
                    );
                    // An empty-tree insertion returns before calling Splay.
                    if (algorithmEvents.some(event => event.type === 'call-enter')) {
                        addSplayCallChunks(
                            chunker, algorithmEvents,
                            'insert', key, initialRootKey, mode,
                        );
                    }
                    algorithmEvents
                        .filter(event => event.type === 'insertion')
                        .forEach(event => {
                            addSplayInsertionBranchChunk(chunker, event);
                            addSplayInsertionSteps(chunker, event, root.left === null ? null : root.left.key, root.right === null ? null : root.right.key);
                        });
                    const insertionEvent = algorithmEvents.find(
                        event => event.type === 'insertion',
                    );

                    const {
                        nodeKeys,
                        edges,
                        rootKey,
                    } = createTreeSnapshot(root);

                    chunker.add(insertionEvent.action === 'empty-tree' ? 'insert-return-empty' : 'insert-return', (vis, snapshotRoot, insertedKey, insertion) => {
                        const graph = vis.graph;

                        if (graph.clearRectangles) graph.clearRectangles();
                        clearTreePointerLabels(graph);

                        if (insertion.action === 'empty-tree') {
                            graph.setPauseLayout(true);
                            graph.addNode(insertedKey, insertedKey);
                            graph.directed(true);
                            graph.setMoveRatio(1);
                            graph.setPauseLayout(false);
                            graph.layoutAVL(snapshotRoot, true);
                        }

                        clearTreeHighlights(graph);

                        graph.root = snapshotRoot;
                        graph.rectangle_size();

                        const rootColor = insertion.action === 'duplicate' ? colors.FOUND_N : colors.NEW_N;

                        graph.setNodeColor(snapshotRoot, rootColor);
                        graph.setFunctionName(insertion.action === 'duplicate' ? getSplayInsertionMessage(insertion) : `Inserted: ${insertedKey}`);
                        graph.setFunctionInsertText();
                    }, [root.key, key, insertionEvent], 0);
                });

                return root;
            }

            // initialise the first key insertion
            // We now skip boxes etc even when recursion is expanded and
            // don't highlight new node (otherwise an extra chunk is
            // needed and there are already more than enough for such a
            // conceptually simple case)
            chunker.add(
                `Main`,
                (vis, elements, k) => {
                    // Set initial function information
                    showTreeOperation(vis.graph, 'insert', k);
                    vis.graph.setFunctionInsertText();
                    // initialise the tree with the first key with box
/*
                    vis.graph.addNode(k, k);
                    if (isAVL) {
                        vis.graph.updateHeight(k, 1);
                    }
                    vis.graph.layoutAVL(k, true, false);
                   
                    if (isRecursionExpanded()) {
                        // Pause the layout then remove the node, keep the rectangle
                        vis.graph.pushRectStack([k], `Depth 1`);
                        vis.graph.pushRectStack([], 'Empty');
                        vis.graph.rectangle_size();
                    }
                    vis.graph.setPauseLayout(true);
                    vis.graph.removeNode(k);
*/
                },
                [nodes, nodes[0], nodes[0].parentNode],
                1
            );

            // empty second chunker
            chunker.add('if t = Empty', (vis) => null, [], 1)

            // Insert the first key into the rectangle
            chunker.add('return n',
                (vis, k) => {
                    vis.graph.addNode(k, k);
                    // vis.graph.layoutBST(root, true);

                    if (isAVL) {
                        vis.graph.updateHeight(k, 1);
                    }
                    vis.graph.layoutAVL(k, true, false);
                },
                [nodes[0]],
                1
            );
            chunker.add(
                `Done`,
                (vis, k) => {
                    vis.graph.setFunctionName(`Inserted: ${k}`);
                    vis.graph.setFunctionInsertText();
                },
                [nodes[0]],
                1
            );

            // store the global root node
            let globalRoot = insertTree(null, nodes[0], { avl: isAVL });

            // insert the rest of the keys into the tree
            // - this builds a recursive tree structure
            // (maybe we could start with the empty tree and get rid
            // of the code for the first node above)
            for (let i = 1; i < nodes.length; i++) {
                globalRoot = insertOrSearch(chunker, globalRoot, nodes[i], i, { avl: isAVL });
            }
            // finalise the visualisation
            chunker.add(`Main`,
                vis => {
                    vis.graph.setFunctionName("Finished");
                    vis.graph.setFunctionInsertText();
                    if (isAVL) {
                        vis.graph.setFunctionNode(null);
                        vis.graph.setFunctionBalance(null);
                        // vis.graph.clearSelect_Circle_Count();
                    }
                    vis.graph.clearRectangles();
                },
                [],
                1
            );
            return globalRoot;
        }
    };
}

// If isAVL = true we have recursive AVLT search (NOT USED/TESTED)
// NOTE: we currently only use this code for BSTRec search
// AVLT search uses iterative BST search
export function createTreeSearchController(isAVLp = false) {
    // const treeType = isAVL ? 'AVL' : 'BST'; // no longer used
    // const functionPrefix = isAVL ? 'AVLT' : 'BST';
    return {
        // visualiser used only for insert
        initVisualisers({ visualiser }) {
            // clear existing trace, if any
            graph_clear(visualiser.graph.instance);
            resetTreeAnimationState(visualiser.graph.instance);
            return {
                graph: {
                    instance: visualiser.graph.instance,
                    order: 0,
                },
            }
        },


        /**
        *
        * @param {object} chunker object to handle the execution of visualisation
        * @param {array} nodes array of numbers needs to be inserted
        */
        // nodes used for insert; visualiser and target used for search
        run(chunker, { visualiser, target }) {

            // get whole tree from the visualiser
            const flatTree = visualiser.graph.instance.getTree();
            let rootKey = visualiser.graph.instance.getRoot();

            const globalRoot = fromFlatTree(rootKey, flatTree, key => createAlgorithmNode(key, isAVLp));

            let current = rootKey;
            let parent = null;

            chunker.add('Main', (vis, c, r) => {
                // vis.graph.setZoom(0.55);
                // Remove all the recursion rectangles first
                vis.graph.popAllRectStack();
                vis.graph.setPauseLayout(false);
                showTreeOperation(vis.graph, 'search', target);
                vis.graph.setFunctionInsertText();
                uncolor(vis.graph, r);
            }, [current, globalRoot], 1);
            let r = insertOrSearch(chunker, globalRoot, target, 0, { operation: 'search' });
        }
    };
}

export default createTreeInsertionController(false);

export const AVLTreeInsertion = createTreeInsertionController(true);
export const BSTreeSearch = createTreeSearchController(false);
