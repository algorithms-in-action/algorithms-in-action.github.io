/**
 * This file contains insertion shared code for both BST and AVL trees.
 * It uses a flag to determine it's AVL insertion or BST insertion.
 * Also now used for recursive insertion to avoid duplicating the code
 * for visualising recursion; some naming may be misleading. NOTE that
 * naming of blocks and bookmarks in the three different files must be
 * consistent!
 * 
 * The insertion algorithm is implemented using the following steps:
 * XXX revise this - NQR
 * 1. Create a new node with the key to be inserted.
 * 2. If the tree is empty, set the new node as the root of the tree.
 * 3. Compare the key to be inserted with the current node's key, 
 *    and recursively insert the key into the left or right subtree.
 * *4. BST: Return the root node.
 * 4. AVL: Update the height of the root node based on the heights of its children.
 * 5. Check the balance factor of the root node.
 * 6. If unbalanced, perform rotations to balance the tree.
 * 7. Return the root node of the tree.
 */ 

import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import { areExpanded } from './collapseChunkPlugin';

// Moving to new color scheme (XXX may be leftovers from older scheme)
import {BSTColors as colors} from './BSTColors';

// Global flag for insert/search (set when controller init is run)
let isInsert = true;

// checks if either recursive call is expanded
function isRecursionExpanded() {
  let mode = (isInsert ? 'insertion' : 'search');
  return areExpanded(['recurseLeft'], mode)
      || areExpanded(['recurseRight'], mode);
}

let globalRoot;
let isAVL = false; // flag for AVLT/BST (needed for height)
// Tree Node class
class TreeNode {
	constructor(key) {
	this.key = key;
	this.left = null;
	this.right = null;
	if (isAVL) {
		this.height = 1;
	}
    }
}

// For search, we extract the tree from the visualiser as a flat mapping
// (associative array) between keys and (keys of roots of) children (if they
// exist/are defined), and separately extract the root. This is (probably)
// the representation used in the initial BST coding and doesn't allow
// duplicate keys (if we change our mind about allowing duplicate keys is
// might be a significant rewrite): It is not the representation used in
// AVL trees and the recursive BST implementation for search, so we need
// to convert the flat representation to the nested/recursive one.
function treeFromFlatTree(root, flatTree) {
    if (flatTree[root.key].left) {
        root.left = new TreeNode(flatTree[root.key].left);
        treeFromFlatTree(root.left, flatTree);
    }
    if (flatTree[root.key].right) {
        root.right = new TreeNode(flatTree[root.key].right);
        treeFromFlatTree(root.right, flatTree);
    }
}

// XXX popAfterReturnFlag seems to be used in a dodgy way, being set
// and tested inside chunks as a global variable, not passed into chunks
// as an argument. Because of the collapseChunkPlugin stuff stepping
// backwards re-executes from the start so it seems to work but is
// fagile (and the initial value of false may not be the initial value
// when re-executing).
let popAfterReturnFlag = false;

/**
 * Insert a key into the tree recursively
 * 
* @param {TreeNode} root the root node of the tree
* @param {int} key the key to be inserted
* @param {int} currIndex the index of the key in the array
* @param {TreeNode} parentNode the parent node of the root node
* @param {int} depth the recursive depth of this action
* @returns {TreeNode} the new root node after the insertion
 */
function insertOrSearchRec(chunker, root, key, currIndex, parentNode = null, depth = 1) {
    let retVal; // return value

    // Function to update the height of a node based on its children's heights (AVL only)
    function updateHeight(root) {
        if (isAVL && root !== null) {
            const leftHeight = root.left ? root.left.height : 0;
            const rightHeight = root.right ? root.right.height : 0;
            root.height = 1 + Math.max(leftHeight, rightHeight); // pick the maximum height then add 1
        }
    }
    
    /**
    * compute node positions during rotation
    * given x-y coordinates of the root and the child, compute the
    * intermediate position after step 1, step 2, ...
    * coords represented as record with fields rX, rY, cX, cY (root X&Y,
    * child X&Y)
    * Steps 1&2:
    * We keep the edge the same length and rotate it around the point 40%
    * along the edge from the root.  If initially the y coordinate of the
    * root is 1 and the child is zero, after step 1 the root is at 2/3
    * and the child is at 1/2 and after step 2 the root is at 1/3 and the
    * child is at 1.  The x coordinates are computed so as to keep the length
    * of the edge same (magic numbers derived from maths).
    * returns record with new coordinates
    * Further steps:
    * Not coded here but in the next steps the (new) root is moved
    * more towards the center and the (new) child (and it's child?)
    * is moved down.
    * (AVL only)
    */
    function rotateStep(pos0, step) {
        let {rX, rY, cX, cY} = pos0;
        let deltaX = rX - cX;
        let deltaY = rY - cY;
        // edge length = sqrt(deltaX**2 + deltaY**2)
        let deltaX1; // deltaX for new position
        let pos1 = {rX:0, rY:0, cX:0, cY:0};
        if (step === 1) {
            pos1.rY = (2*rY + cY) / 3;
            pos1.cY = (rY + cY) / 2;
            deltaX1 = Math.sqrt((35/36)*deltaY**2 + deltaX**2);
        } else if (step === 2) {
            pos1.rY = (rY + 2*cY) / 3;
            pos1.cY = rY;
            deltaX1 = Math.sqrt((5/9)*deltaY**2 + deltaX**2);
        } else {
            console.log('Invalid rotateStep step ', step);
        }
        if (rX > cX) // reverse direction of deltaX
            deltaX1 = -deltaX1;
        pos1.rX = (0.6*rX + 0.4*cX) - 0.4*deltaX1;
        pos1.cX = (0.6*rX + 0.4*cX) + 0.6*deltaX1;
        return pos1;
    }
    
    // XXX better to rename this rightRotate...
    /**
     * Perform a Left-Left Case Rotation (LLCR) to balance the AVL tree
     * @param {AVLNode} root the root node of the AVL tree
     * @param {AVLNode} parentNode the parent node of the root node
     * @param {int} depth the recursive depth of this action
     * @param {boolean} rotateVis whether to highlight the rotation in the visualisation.
     *                            The default value is true,
     *                            should be set to false when the rotation is the middle step
     * @returns {AVLNode} the new root node after the rotation
     */
    function LLCR(root, parentNode, depth, rotateVis = true) {
        if (!isAVL) return root;
    
        // assign the root as t6 in the pseudocode
        chunker.add('rightRotate(t6)',
            (vis, r, rl, rll) => {
                vis.graph.clear();
                vis.graph.clearSelect_Circle_Count();
                // show tid of t6 on the graph
                vis.graph.updateTID(r, 't6');
    
                // cancel highlighting of the edges (r->rl, rl->rll)
                // they were highlighted when the case was detected
                vis.graph.visit(rl,r);
                vis.graph.findNode(r).visitedCount = 1;
              
            }, [root.key, root.left.key, root.left.left ? root.left.left.key : null],
            depth
        );
    
        let R = root; // if any doubt, refer to the charNotation above
        let A = root.left;
    
        // assign the left child of the root as t2 in the pseudocode
        chunker.add('t2 = left(t6)',
            (vis, tt2, tt6) => {
                // show tid of t2 on the graph
                vis.graph.updateTID(tt2, 't2');
    
                // -- following code is for visualising the rotation step by step --
                // find the position of the nodes in the graph
                let rootNode = vis.graph.findNode(tt6);
                let leafNode = vis.graph.findNode(tt2);
                // store the previous height of the root node
                let pos0 = {rX:rootNode.x, rY:rootNode.y, cX:leafNode.x, cY:leafNode.y};
                vis.graph.setRotPos(pos0);
                let pos = rotateStep(pos0, 1); // compute new position
                vis.graph.setNodePosition(tt6, pos.rX, pos.rY);
                vis.graph.setNodePosition(tt2, pos.cX, pos.cY);
            },
            [A.key, R.key],
            depth
        );
    
        let D = A.right;
        // assign the right child of t2 as t4 in the pseudocode
        chunker.add('t4 = right(t2)',
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
                vis.graph.setPauseLayout(true);
                let pos0 = vis.graph.getRotPos(); // original position
                let pos = rotateStep(pos0, 2); // compute new position
                vis.graph.setNodePosition(tt6, pos.rX, pos.rY);
                vis.graph.setNodePosition(tt2, pos.cX, pos.cY);
            },
            [R.key, A.key, D ? D.key : false],
            depth
        );
    
        // let t2's right child point to t6
        chunker.add('t2.right = t6',
            (vis, t6, t2, t4, p, rotate) => {
                // if (rotate) vis.graph.visit(t2, p);
                vis.graph.resetVisitAndSelect(t2, t6);
                vis.graph.removeEdge(t6, t2);
    
                if (t4 !== null) {
                    vis.graph.removeEdge(t2, t4);
                }
    
                if (rotate) vis.graph.resetVisitAndSelect(t6, null);
    
                vis.graph.addEdge(t2, t6);
                vis.graph.visit(t6, t2);
                vis.graph.findNode(t6).visitedCount = 1;
                vis.graph.findNode(t2).visitedCount = 1;
    
                if (t4 !== null) vis.graph.removeEdge(t6, t4);
                // set the new position of the node(s)
                // - just move (new) root node towards center more.
                // New child and grandchild moved in next chunk -
                // could do them here also but less confusing as is?
                let pos0 = vis.graph.getRotPos(); // original position
                let pos2 = rotateStep(pos0, 2); // previous position
                vis.graph.setNodePosition(t2, (pos0.rX + 3*pos0.cX)/4, pos2.cY);
            },
            [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, rotateVis],
            depth
        );
    
        let RR = (R.right? R.right.key: null);
        // if t4 is not null, let t6's left child point to t4
        // if (D) { // we now animate this step even if t4 is null
        chunker.add('t6.left = t4',
            (vis, t6, t6r, t2, t4, p, rotate) => {
                // vis.graph.setMoveRatio(9/10);
                if (t4 !== null) vis.graph.addEdge(t6, t4);
                // set the new position of the nodes
                // - just move (new) child node down more
                // plus it's child also (if it has one)
                let pos0 = vis.graph.getRotPos(); // original position
                let pos2 = rotateStep(pos0, 2); // position after step 2
                let deltaY = (pos2.rY - pos0.rY) / 3;
                vis.graph.setNodePosition(t6, pos2.rX, pos2.rY + deltaY);
                if (t6r !== null) {
                    vis.graph.moveNodePosition(t6r, 0, deltaY);
                }
            },
            [R.key, RR, A.key, D ? D.key : null, parentNode ? parentNode.key : null, rotateVis],
            depth
        )
    
        // perform the rotation in our objects
        const temp = root.left; // XXX temp = A ???
        root.left = temp.right;
        temp.right = root;
        updateHeight(root);
        updateHeight(temp);
    
        // update height in the graph, it will overwrite the tid as well
        chunker.add('recompute heights of t6 and t2', (vis, r, h1, t, h2, d, h3) => {
            vis.graph.setTagInfo('');
            vis.graph.updateHeight(r, h1);
            vis.graph.updateHeight(t, h2);
            if (d !== null) vis.graph.updateHeight(d, h3);
        },
            [root.key, root.height, temp.key, temp.height, D ? D.key : null, D ? D.height : 0],
            depth,
        );
    
        // update the parent node's child
        if (parentNode !== null) {
            if (temp.key < parentNode.key) {
                parentNode.left = temp;
            }
            else {
                parentNode.right = temp;
            }
        }
    
        // finalise the rotation
        chunker.add('return t2',
            (vis, g, p, t2, t6) => {
                // vis.graph.clearTID();
                vis.graph.updateTID(t2, 't2');
                if (p !== null) {
                    vis.graph.removeEdge(p, t6);
                    vis.graph.addEdge(p, t2);
                }
    
                vis.graph.clearSelect_Circle_Count();
                vis.graph.clear();
              
                vis.graph.setMoveRatio(3/6);
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
            },
            [parentNode ? globalRoot.key : temp.key, parentNode ? parentNode.key : null, A.key, R.key],
            depth
        );
    
        return temp; // new root node after the rotation
    }
    
    
    /**
     * Perform a Right-Right Case Rotation (RRCR) to balance the AVL tree
     * @param {AVLNode} root the root node of the AVL tree
     * @param {AVLNode} parentNode the parent node of the root node
     * @param {int} depth the recursive depth of this action
     * @param {boolean} rotateVis whether to highlight the rotation in the visualisation.
     *                            The default value is true,
     *                            should be set to false when the rotation is the middle step
     * @returns {AVLNode} the new root node after the rotation
     */
    function RRCR(root, parentNode, depth, rotateVis = true) {
        if (!isAVL) return root;
    
        // assign the root as t2 in the pseudocode
        chunker.add('leftRotate(t2)',
            (vis, r, rr, rrr) => {
    
                vis.graph.clear();
                vis.graph.clearSelect_Circle_Count();
                // show tid of t2 on the graph
                vis.graph.updateTID(r, 't2');
    
                vis.graph.visit(rr,r);
                vis.graph.findNode(r).visitedCount = 1;
    
            }, [root.key, root.right.key, root.right.right ? root.right.right.key : null],
            depth
        );
    
        let R = root; // if any doubt, refer to the charNotation above
        let A = root.right;
    
        // assign the right child of the root as t6 in the pseudocode
        chunker.add('t6 = right(t2)',
            (vis, tt6, tt2) => {
                // show tid of t6 on the graph
                vis.graph.updateTID(tt6, 't6');
    
                // -- following code is for visualising the rotation step by step --
                // find the position of the nodes in the graph
                let rootNode = vis.graph.findNode(tt2);
                let leafNode = vis.graph.findNode(tt6);
                // store the previous height of the root node
                let pos0 = {rX:rootNode.x, rY:rootNode.y, cX:leafNode.x, cY:leafNode.y};
                vis.graph.setRotPos(pos0);
                let pos = rotateStep(pos0, 1); // compute new position
                vis.graph.setNodePosition(tt2, pos.rX, pos.rY);
                vis.graph.setNodePosition(tt6, pos.cX, pos.cY);
            },
            [A.key, R.key],
            depth
        );
        let D = A.left;
        // assign the left child of t6 as t4 in the pseudocode
        chunker.add('t4 = left(t6)',
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
                vis.graph.setPauseLayout(true);
                // set the new position of the nodes
                let pos0 = vis.graph.getRotPos(); // original position
                let pos = rotateStep(pos0, 2); // compute new position
                vis.graph.setNodePosition(tt2, pos.rX, pos.rY);
                vis.graph.setNodePosition(tt6, pos.cX, pos.cY);
            },
            [R.key, A.key, D ? D.key : false],
            depth
        );
    
        // let t6's left child point to t2
        chunker.add('t6.left = t2',
            (vis, t2, t6, t4, p, rotate) => {
                // highlight the edge between t6 and t2
                // if (rotate) vis.graph.visit(t2, p);
                vis.graph.resetVisitAndSelect(t6, t2);
                vis.graph.removeEdge(t2, t6);
    
                if (t4 !== null) {
                    vis.graph.removeEdge(t6, t4);
                }
    
                if (rotate) vis.graph.resetVisitAndSelect(t2, null);
    
                vis.graph.addEdge(t6, t2);
                vis.graph.visit(t2, t6);
                vis.graph.findNode(t6).visitedCount = 1;
                vis.graph.findNode(t2).visitedCount = 1;
                // remove edge after layout to perform the middle step
                if (t4 !== null) vis.graph.removeEdge(t2, t4);
                // set the new position of the nodes
                // - just move (new) root node towards center more.
                // New child and grandchild moved in next chunk -
                // could do them here also but less confusing as is?
                let pos0 = vis.graph.getRotPos(); // original position
                let pos2 = rotateStep(pos0, 2); // previous position
                vis.graph.setNodePosition(t6, (pos0.rX + 3*pos0.cX)/4, pos2.cY);
            },
            [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, rotateVis],
            depth
        );
    
        let RL = (R.left? R.left.key: null);
        // if t4 is not null, let t2's right child point to t4
        // if (D) { // we now animate this step even if t4 is null
        chunker.add('t2.right = t4',
            // reconnect the edge between t2 and t4
            (vis, t2, t2l, t6, t4, p, rotate) => {
                if (t4 !== null) vis.graph.addEdge(t2, t4);
                // set the new position of the nodes
                // - just move (new) child node down more
                // plus it's child also (if it has one)
                let pos0 = vis.graph.getRotPos(); // original position
                let pos2 = rotateStep(pos0, 2); // position after step 2
                let deltaY = (pos2.rY - pos0.rY) / 3;
                vis.graph.setNodePosition(t2, pos2.rX, pos2.rY + deltaY);
                if (t2l !== null) {
                    vis.graph.moveNodePosition(t2l, 0, deltaY);
                }
            },
            [R.key, RL, A.key, D ? D.key : null, parentNode ?  parentNode.key : null, rotateVis],
            depth
            )
        // }
    
        // perform the rotation in our objects
        const temp = root.right;
        root.right = temp.left;
        temp.left = root;
        updateHeight(root);
        updateHeight(temp);
    
        // update height in the graph
        chunker.add('recompute heights of t2 and t6', (vis, r, h1, t, h2, d, h3) => {
            vis.graph.setTagInfo('');
            vis.graph.updateHeight(r, h1);
            vis.graph.updateHeight(t, h2);
            if (d !== null) vis.graph.updateHeight(d, h3);
        },
            [root.key, root.height, temp.key, temp.height, D ? D.key : null, D ? D.height : 0],
            depth,
        );
    
        // update the parent node's child
        if (parentNode !== null) {
            if (temp.key < parentNode.key) {
                parentNode.left = temp;
            }
            else {
                parentNode.right = temp;
            }
        }
    
        // finalise the rotation
        chunker.add('return t6',
            (vis, g, p, t6, t2) => {
                // vis.graph.clearTID();
                vis.graph.updateTID(t6, 't6');
                if (p !== null) {
                    vis.graph.removeEdge(p, t2);
                    vis.graph.addEdge(p, t6);
                }
                vis.graph.clearSelect_Circle_Count();
                vis.graph.clear();
                vis.graph.setMoveRatio(3/6);
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
            },
            [parentNode ? globalRoot.key : temp.key, parentNode ? parentNode.key : null, A.key, R.key],
            depth
        );
        return temp; // new root node after the rotation
    }
    
    
    /**
     * Perform a Left-Right Case Rotation (LRCR) to balance the AVL tree
     * 
     * Performs a left rotation on the left child of the root node first,
     * then performs a right rotation on the root node
     * 
     * @param {AVLNode} root the root node of the AVL tree
     * @param {AVLNode} parentNode the parent node of the root node
     * @param {int} depth the recursive depth of this action
     * @returns {AVLNode} the new root node after the rotation
     */
    function LRCR(root, parentNode, depth) {
        if (!isAVL) return root;
        
        // perform left rotation on the left child of the root node
        root.left = RRCR(root.left, root, depth, false);
    
        // highlight the rotation in the visualisation
        chunker.add('left(t) <- leftRotate(left(t));',
            (vis, g, r) => {
                vis.graph.updateHeight(r.key, r.height);
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
            }, [(parentNode !== null) ? globalRoot.key : root.key, root.left], depth);
    
        // chunker.add('return right rotation on t', (vis) => { }, [], depth);
    
        // perform right rotation on the root node
        return LLCR(root, parentNode, depth, true);
    }
    
    /**
     * Perform a Right-Left Case Rotation (RLCR) to balance the AVL tree
     * 
     * Performs a right rotation on the right child of the root node first,
     * then performs a left rotation on the root node
     * 
     * @param {AVLNode} root the root node of the AVL tree
     * @param {AVLNode} parentNode the parent node of the root node
     * @param {int} depth the recursive depth of this action
     * @returns {AVLNode} the new root node after the rotation
     */
    function RLCR(root, parentNode, depth) {
        if (!isAVL) return root;
    
        // perform right rotation on the right child of the root node
        root.right = LLCR(root.right, root, depth, false);
    
        // highlight the rotation in the visualisation
        chunker.add('right(t) <- rightRotate(right(t));',
            (vis, g, r) => {
                vis.graph.updateHeight(r.key, r.height);
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
            }, [(parentNode !== null) ? globalRoot.key : root.key, root.right], depth);
    
    
        // perform left rotation on the root node
        return RRCR(root, parentNode, depth, true);
    }
    
    

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
            if (popAfterReturnFlag) { // Not needed here???
                vis.graph.popRectStack();
                popAfterReturnFlag = false;
            }
            if (rr) {
                // visit from root to root, to just highlight the current node, without highlighting the edge
                // vis.graph.visit(rr, rr);
            }
            // print the function name and the key to be inserted
            if (isInsert)
                vis.graph.setFunctionName(`Insert: ${k}`);
            else
                vis.graph.setFunctionName(`Search: ${k}`);
            vis.graph.setFunctionInsertText();
            
            // Only add rectangles when recursion is expanded
            if (isRecursionExpanded()) {
                if (rr) {
                    let nodeIds = vis.graph.getSubtreeNodes(rr);
                    vis.graph.pushRectStack(nodeIds, `Depth ${d}`);
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
                    vis.graph.pushRectStack([k], `Depth ${d}`);
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

    // Search base cases:
    // if the tree is empty set message
    if (root === null && !isInsert) {
        chunker.add('if t = Empty', (vis) => null, [], depth);
        chunker.add('return NotFound',
            (vis, r, p) => {
                // Pop the "Empty" rectangle
                // vis.graph.popRectStack();
                // vis.graph.setPauseLayout(false);
                // vis.graph.rectangle_size();
                popAfterReturnFlag = true;
                vis.graph.setText('Key not found');
            },
            [key, parentNode ? parentNode.key : null],
            depth
        );
        return 'fail';
    } else if (!isInsert && root.key == key) {
        chunker.add('if n.key = k', (vis) => null, [], depth);
        chunker.add('return t',
            (vis, r, p) => {
                popAfterReturnFlag = true;
                vis.graph.setText('Key found');
                // XXX want to highlight node here (also highlight
                // inserted nodes); remove highlight at end of insert
            },
            [key, parentNode ? parentNode.key : null],
            depth
        );
        return 'success';
    }

    // Insertion: if the tree is empty, create a new node as the root
    // We pop the Empty rectangle but create a new one around the new
    // node (if it has a parent)
    if (root === null && isInsert) {
        chunker.add('if t = Empty', (vis) => null, [], depth);

        // Initialize the AVL tree with the first key
        let root = new TreeNode(key);

        // chunker.add('create new node',
        chunker.add('return n',
            (vis, r, p) => {
                // Pop the "Empty" rectangle
                vis.graph.popRectStack();
                vis.graph.setPauseLayout(false);
                vis.graph.addNode(r, r);
                vis.graph.myColorNode(r, colors.NEW_N);
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
                popAfterReturnFlag = true;
                // vis.graph.select(r, p);
                // vis.graph.resetVisitAndSelect(r, p);
            },
            [key, parentNode ? parentNode.key : null],
            depth
        );

        // update the child of the parent node
        if (parentNode !== null) {
            if (key < parentNode.key) {
                parentNode.left = root;
            } else {
                parentNode.right = root;
            }
        }

        return root;
    }

    chunker.add('if k < t.key', (vis) => { }, [], depth);

    // For search we don't have return at end; instead we return
    // directly from left or right recursive calls and we need to save
    // which one so we cal unwind recursion properly (animation stops
    // twice at recursive calls)
    let searchBookmark;
    if (key < root.key) {
        chunker.add('prepare for the left recursive call', (vis) => null, [], depth);

        // Recursively insert the key into the left subtree
        retVal = insertOrSearchRec(chunker, root.left, key, currIndex, root, depth + 1);

        // restore the function information after the recursive call
        chunker.add(`recursiveCallLeft`,
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
                if (popAfterReturnFlag) {
                    vis.graph.popRectStack();
                    vis.graph.rectangle_size();
                    popAfterReturnFlag = false;
                }
                popAfterReturnFlag = true;
            },
            [root.left, key, root],
            depth);
            searchBookmark = `recursiveCallLeft`;

    } else if (key > root.key) {
        chunker.add('else if k > root(t).key', (vis) => null, [], depth);
        chunker.add('prepare for the right recursive call', (vis) => null, [], depth);

        // Recursively insert the key into the right subtree
        retVal = insertOrSearchRec(chunker, root.right, key, currIndex, root, depth + 1);

        // restore the function information after the recursive call
        chunker.add(`recursiveCallRight`,
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
                if (popAfterReturnFlag) {
                    vis.graph.popRectStack();
                    vis.graph.rectangle_size();
                    popAfterReturnFlag = false;
                }
                popAfterReturnFlag = true;
            },
            [root.right, key, root],
            depth);
            searchBookmark = `recursiveCallRight`;
    } else {
        // Key already exists in the tree (insert)
        chunker.add('else if k > root(t).key',
            (vis) => {
                // vis.graph.clear(); // clear all highlighting
                vis.graph.setText('Duplicate key - insertion ignored');
                // popAfterReturnFlag = true;
            },
            [],
            depth
        );
        // chunker.add('return t, no change', (vis) => null, [], depth);
        // return root;
    }

    // BST Search case: just return XXX ?need clean up
    // BST Insert case: chunk for return statement then return
    // AVL Insert case: fall though to balance/rotations code
    let bookmark;
    if (isInsert) {
       bookmark = 'return t';
       retVal = root
    } else
       return retVal;
    if (!isAVL) {
        // XXX only want this extra chunk for insert
        // (may need to add contents to previous chunk
        chunker.add(bookmark,
            (vis, r, p) => {
                // vis.graph.resetVisitAndSelect(r, p);
                // popAfterReturnFlag = true;
            },
            [root.key, parentNode ? parentNode.key : null],
            depth
        );
        return retVal;
    }

    updateHeight(root);

    // update height in the graph
    chunker.add('root(t).height = 1 + max(left(t).height, right(t).height)',
        (vis, r, h) => {
            vis.graph.updateHeight(r, h);
        },
        [root.key, root.height],
        depth
    );

    // get balance factor of the root
    const leftHeight = root.left ? root.left.height : 0;
    const rightHeight = root.right ? root.right.height : 0;
    const balance = leftHeight - rightHeight;

    // update the balance factor in the graph
    chunker.add('switch balanceCase of', (vis, r) => {
        vis.graph.setFunctionNode(`${r}`);
        // vis.graph.clearSelect_Circle_Count();
        // vis.graph.setSelect_Circle_Count(r);
        vis.graph.setFunctionBalance(balance);
    }, [root.key], depth);

    // the rotation helper functions are deeply nested in the insert function
    // more details can be referred to the QuickSort controller
    // and recursionLevel in ../context/action.js
    let rotateDepth = depth + 1;

    // check the balance factor and perform rotations if necessary
    // chunker.add('if balance > 1 && k < left(t).key', (vis) => null, [], depth);
    if (balance > 1 && key < root.left.key) {
        // detect LL case
        chunker.add('perform right rotation to re-balance t',
            (vis, r, b, rl, rll) => {
                // show the rotation type and the node to be rotated
                vis.graph.setFunctionInsertText(` balanceCase: LL`);
                // vis.graph.clearSelect_Circle_Count();
                // vis.graph.setSelect_Circle_Count(r);
                vis.graph.setFunctionNode(`${r}`);

                // highlight edges involved in the rotation case
                vis.graph.clear();
                vis.graph.findNode(r).visitedCount = 1;
                vis.graph.visit(rl, r);
                vis.graph.visit(rll, rl);

            },
            [root.key, balance, root.left.key, root.left.left ? root.left.left.key : null],
            depth
        );
        root = LLCR(root, parentNode, rotateDepth);

        // clear the function information after the rotation
        // and tidy up the nodes' position
        chunker.add('return rightRotate(t)', (vis, g, r) => {
            vis.graph.setMoveRatio(1);
            vis.graph.updateHeight(r.key, r.height);
            vis.graph.setFunctionNode(null);
            vis.graph.clearSelect_Circle_Count();
            vis.graph.setFunctionBalance(null);
            vis.graph.clearSelect_Circle_Count();
            vis.graph.clear();
            vis.graph.setPauseLayout(false);
            vis.graph.layoutAVL(g, true, false);
            vis.graph.rectangle_size();
            popAfterReturnFlag = true;
        }, [(parentNode !== null) ? globalRoot.key : root.key, root], depth);
    } else if (balance < -1 && key > root.right.key) {
        // chunker.add('if balance < -1 && k > right(t).key', (vis) => null, [], depth);
        // detect RR case
        chunker.add('perform left rotation to re-balance t',
            (vis, r, b, rr, rrr) => {
                // show the rotation type and the node to be rotated
                vis.graph.setFunctionInsertText(` balanceCase: RR`);
                vis.graph.setFunctionNode(`${r}`);
                // vis.graph.clearSelect_Circle_Count();
                // vis.graph.setSelect_Circle_Count(r);

                // highlight edges involved in the rotation case
                vis.graph.clear();
                vis.graph.findNode(r).visitedCount = 1;
                vis.graph.visit(rr, r);
                vis.graph.visit(rrr, rr);
            },
            [root.key, balance, root.right.key, root.right.right ? root.right.right.key : null],
            depth
        );

        root = RRCR(root, parentNode, rotateDepth);

        // clear the function information after the rotation
        // and tidy up the nodes' position
        chunker.add('return leftRotate(t)', (vis, g, r) => {
            vis.graph.setMoveRatio(1);
            vis.graph.updateHeight(r.key, r.height);
            vis.graph.setFunctionNode(null);
            vis.graph.setFunctionBalance(null);
            vis.graph.clearSelect_Circle_Count();
            vis.graph.clear();
            vis.graph.setPauseLayout(false);
            vis.graph.layoutAVL(g, true, false);
            vis.graph.rectangle_size();
            popAfterReturnFlag = true;
        }, [(parentNode !== null) ? globalRoot.key : root.key, root], depth);
    } else if (balance > 1 && key > root.left.key) {
        // chunker.add('if balance > 1 && k > left(t).key', (vis) => null, [], depth);
        // detect LR case
        chunker.add('perform left rotation on the left subtree',
            (vis, r, b, rl, rlr) => {
                // show the rotation type and the node to be rotated
                vis.graph.setFunctionInsertText(` balanceCase: LR`);
                // vis.graph.clearSelect_Circle_Count();
                // vis.graph.setSelect_Circle_Count(r);
                vis.graph.setFunctionNode(`${r}`);
                
                // highlight edges involved in the rotation case
                vis.graph.clear();
                vis.graph.findNode(r).visitedCount = 1;
                vis.graph.visit(rl, r);
                vis.graph.visit(rlr, rl);
            },
            [root.key, balance, root.left.key, root.left.right ? root.left.right.key : null],
            depth
        );

        root = LRCR(root, parentNode, rotateDepth);
        // clear the function information after the rotation
        chunker.add('return rightRotate(t) after leftRotate',
            (vis, g, r) => {
                vis.graph.setMoveRatio(1);
                vis.graph.updateHeight(r.key, r.height);
                vis.graph.setFunctionNode(null);
                vis.graph.setFunctionBalance(null);
                vis.graph.clearSelect_Circle_Count();
                vis.graph.clear();
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
                popAfterReturnFlag = true;
            },
            [(parentNode !== null) ? globalRoot.key : root.key, root],
            depth);
    } else if (balance < -1 && key < root.right.key) {
        // chunker.add('if balance < -1 && k < right(t).key', (vis) => null, [], depth);
        // detect RL case
        chunker.add('perform right rotation on the right subtree',
            (vis, r, b, rr, rrl) => {
                // show the rotation type and the node to be rotated
                vis.graph.setFunctionInsertText(` balanceCase: RL`);
                vis.graph.setFunctionNode(`${r}`);
                // vis.graph.clearSelect_Circle_Count();
                // vis.graph.setSelect_Circle_Count(r);

                // highlight edges involved in the rotation case
                vis.graph.clear();
                vis.graph.findNode(r).visitedCount = 1;
                vis.graph.visit(rr, r);
                vis.graph.visit(rrl, rr);
            },
            [root.key, balance, root.right.key, root.right.left ? root.right.left.key : null],
            depth
        );

        root = RLCR(root, parentNode, rotateDepth);

        // clear the function information after the rotation
        chunker.add('return leftRotate(t) after rightRotate',
            (vis, g, r) => {
                vis.graph.setMoveRatio(1);
                vis.graph.updateHeight(r.key, r.height);
                vis.graph.setFunctionNode(null);
                vis.graph.setFunctionBalance(null);
                vis.graph.clearSelect_Circle_Count();
                vis.graph.clear();
                vis.graph.setPauseLayout(false);
                vis.graph.layoutAVL(g, true, false);
                vis.graph.rectangle_size();
                popAfterReturnFlag = true;
            }, [(parentNode !== null) ? globalRoot.key : root.key, root], depth);
    } else {
        chunker.add('case Balanced', (vis) => null, [], depth);
        chunker.add('return t',
            (vis, r, p) => {
                vis.graph.setFunctionNode(null);
                vis.graph.setFunctionBalance(null); // clear balance after return in switch case
                vis.graph.resetVisitAndSelect(r, p); // clear all highlighting
                popAfterReturnFlag = true;
            },
            [root.key, parentNode ? parentNode.key : null],
            depth
        );
    }
    return root;
}
function insertOrSearch(chunker, root, key, currIndex) {
    let r = insertOrSearchRec(chunker, root, key, currIndex, null, 1);
    chunker.add('Done', (vis, k) => {
        // vis.graph.setZoom(0.55);
        // Remove all the recursion rectangles first
        vis.graph.popAllRectStack();
        if (isInsert) {
            vis.graph.myColorNode(k, undefined);
            vis.graph.setFunctionName(`Inserted: ${k}`);
            vis.graph.setFunctionInsertText();
        }
        // vis.graph.setFunctionName(`Search: ${target}`);
        // vis.graph.setFunctionInsertText();
    }, [key], 1);
    return r;
} 


// default is recursive BST insertion 
// If isAVL = true we have recursive AVLT insertion
// If isInsert = true 
export function createTreeInsertionController(isAVLp = false) {
    // const treeType = isAVL ? 'AVL' : 'BST'; // no longer used
    // const functionPrefix = isAVL ? 'AVLT' : 'BST';
    return {
        // visualiser used only for insert
        initVisualisers({ visualiser }) {
            isAVL = isAVLp;
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
        run(chunker, { nodes, visualiser, target }) {
            isInsert = true;
            if (nodes.length === 0) return;

            // initial settings for the visualisation
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

            // initialise the first key insertion
            // We now skip boxes etc even when recursion is expanded and
            // don't highlight new node (otherwise an extra chunk is
            // needed and there are already more than enough for such a
            // conceptually simple case)
            chunker.add(
                `Main`,
                (vis, elements, k) => {
                    // Set initial function information
                    vis.graph.setFunctionName(`Insert: ${k}`);
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
                    // vis.graph.popRectStack();
                    // vis.graph.setPauseLayout(false);
                    vis.graph.addNode(k, k);
                    // vis.graph.myColorNode(k, colors.NEW_N);
                    if (isAVL) {
                        vis.graph.updateHeight(k, 1);
                    }
                    vis.graph.layoutAVL(k, true, false);
                    // vis.graph.rectangle_size();
                    // popAfterReturnFlag = true;
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
            globalRoot = new TreeNode(nodes[0]);

            // insert the rest of the keys into the tree
            // - this builds a recursive tree structure
            // (maybe we could start with the empty tree and get rid
            // of the code for the first node above)
            for (let i = 1; i < nodes.length; i++) {
                globalRoot = insertOrSearch(chunker, globalRoot, nodes[i], i);
            }
            // finalise the visualisation
            chunker.add(`Main`,
                vis => {
                    vis.graph.setFunctionName("Finished");
                    vis.graph.setFunctionInsertText();
                    if (isAVL) {
                        vis.graph.setFunctionNode(null);
                        vis.graph.setFunctionBalance(null);
                        vis.graph.clearSelect_Circle_Count();
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

// If isAVL = true we have recursive AVLT search (not used/tested?)
export function createTreeSearchController(isAVLp = false) {
    // const treeType = isAVL ? 'AVL' : 'BST'; // no longer used
    // const functionPrefix = isAVL ? 'AVLT' : 'BST';
    return {
        // visualiser used only for insert
        initVisualisers({ visualiser }) {
            isAVL = isAVLp;
            // clear existing trace, if any
            visualiser.graph.instance.clear();
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

            isInsert = false;
            // get whole tree from the visualiser
            const flatTree = visualiser.graph.instance.getTree();
            let rootKey = visualiser.graph.instance.getRoot();

            globalRoot = new TreeNode(rootKey);
            treeFromFlatTree(globalRoot, flatTree);

            let current = rootKey;
            let parent = null;

            chunker.add('Main', (vis, c) => {
                // vis.graph.setZoom(0.55);
                // Remove all the recursion rectangles first
                vis.graph.popAllRectStack();
                vis.graph.setPauseLayout(false);
                vis.graph.setFunctionName(`Search: ${target}`);
                vis.graph.setFunctionInsertText();
            }, [current], 1);
            let r = insertOrSearch(chunker, globalRoot, target, 0);
        }
    };
}

export default createTreeInsertionController(false);

export const AVLTreeInsertion = createTreeInsertionController(true);
export const BSTreeSearch = createTreeSearchController(false);

