/**
 * This file contains the AVL Tree Insertion algorithm,
 * alongside the visualisation code.
 *
 * The AVL Tree Insertion algorithm is used to insert new keys into an AVL tree.
 * It uses Array1DTracer to visualise the keys to be inserted and GraphTracer to visualise the AVL tree.
 * 
 * The AVL Tree Insertion algorithm is implemented using the following steps:
 * 1. Create a new node with the key to be inserted.
 * 2. If the tree is empty, set the new node as the root of the tree.
 * 3. Comapre the key to be inserted with the current node's key, 
 *    and recursively insert the key into the left or right subtree.
 * 4. Update the height of the root node based on the heights of its children.
 * 5. Check the balance factor of the root node.
 * 6. If unbalanced, perform rotations to balance the tree.
 * 7. Return the root node of the tree.
 */

import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import { areExpanded } from './collapseChunkPlugin';

// checks if either recursive call is expanded
export function isRecursionExpanded() {
  return areExpanded(['insertLeft']) || areExpanded(['insertRight']);
}

export default {
    initVisualisers() {
        return {
            // array: {
            //     instance: new Array1DTracer('array', null, 'Keys to insert', { arrayItemMagnitudes: true }),
            //     order: 0,
            // },
            graph: {
                instance: new GraphTracer('avl', null, 'AVL tree'),
                order: 1,
            },
        };
    },

    /**
   *
   * @param {object} chunker object to handle the execution of visualisation
   * @param {array} nodes array of numbers needs to be inserted
   */
    run(chunker, { nodes }) {
        if (nodes.length === 0) return;

        // AVL Node class
        class AVLNode {
            constructor(key) {
                this.key = key;
                this.left = null;
                this.right = null;
                this.height = 1;
            }
        }

        // Function to update the height of a node based on its children's heights
        function updateHeight(root) {
            if (root !== null) {
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
        * 
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
	if (rX > cX)  // reverse direction of deltaX
            deltaX1 = -deltaX1;
        pos1.rX = (0.6*rX + 0.4*cX) - 0.4*deltaX1;
        pos1.cX = (0.6*rX + 0.4*cX) + 0.6*deltaX1;
        return pos1;
        }

        // We apply the following char notations in our rotation code.
        // It helps code reusability and readability.
        // XXX might be good to change some of these (RR+RL added
        // later); note that P is not necessarilty the *global* root, R
        // can stand for root and right.
        // tNum / charNotation
        //
        //       P/G (Global root /Parent)     P/G
        //        |                             |
        //       6/R                           2/R
        //      /   \     Right Rotation      /   \
        //     2/A   7/RR - - - - - - - >    1/RL  6/A
        //    /   \       < - - - - - - -         /   \
        //   1    4/D      Left Rotation        4/D    7

        const nodeSize = 85; // size of the node in the graph

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

            // assign the root as t6 in the pseudocode
            chunker.add('rightRotate(t6)',
                (vis, r, rl, rll) => {
                    // show tid of t6 on the graph
                    vis.graph.updateTID(r, 't6');

                    // cancel highlighting of the edges (r->rl, rl->rll)
                    // they were highlighted when the case was detected
                    vis.graph.resetVisitAndSelect(rl, r);
                    if (rll) {
                        vis.graph.resetVisitAndSelect(rll, rl);
                    }
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
                    if (rotate) vis.graph.visit(t2, p);

                    vis.graph.removeEdge(t6, t2);

                    if (t4 !== null) {
                        vis.graph.removeEdge(t2, t4);
                    }

                    if (rotate) vis.graph.resetVisitAndSelect(t6, null);

                    vis.graph.addEdge(t2, t6);

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
                    console.log(g, p, t2, t6);
                    vis.graph.updateTID(t2, 't2');
                    if (p !== null) {
                        vis.graph.removeEdge(p, t6);
                        vis.graph.addEdge(p, t2);
                    }
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

            // assign the root as t2 in the pseudocode
            chunker.add('leftRotate(t2)',
                (vis, r, rr, rrr) => {
                    // show tid of t2 on the graph
                    vis.graph.updateTID(r, 't2');

                    // cancel highlighting of the edges (r->rr, rr->rrr)
                    vis.graph.resetVisitAndSelect(rr, r);
                    if (rrr) {
                        vis.graph.resetVisitAndSelect(rrr, rr);
                    }

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
                    if (rotate) vis.graph.visit(t2, p);

                    vis.graph.removeEdge(t2, t6);

                    if (t4 !== null) {
                        vis.graph.removeEdge(t6, t4);
                    }

                    if (rotate) vis.graph.resetVisitAndSelect(t2, null);

                    vis.graph.addEdge(t6, t2);
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

        let popAfterReturnFlag = false;

        /**
         * Insert a key into the AVL tree recursively
         * 
         * The traversal is done in a top-down manner, 
         * and the height of the nodes are updated bottom-up with balancing.
         * 
         * @param {AVLNode} root the root node of the AVL tree
         * @param {int} key the key to be inserted
         * @param {int} currIndex the index of the key in the array
         * @param {AVLNode} parentNode the parent node of the root node
         * @param {int} depth the recursive depth of this action
         * @returns {AVLNode} the new root node after the insertion
         */
        function insert(root, key, currIndex, parentNode = null, depth = 1) {

            // visualise the basic information of the insertion
            chunker.add('AVLT_Insert(t, k)',
                (vis, k, d, index, r, p, rr) => {
                    if (popAfterReturnFlag) {
                        vis.graph.popRectStack();
                        popAfterReturnFlag = false;
                    }
                    
                    if (d === 1) {
                        // highlight the node in the array
                        // vis.array.depatch(index - 1);
                        // vis.array.patch(index);
                    }
                    if (rr) {
                        // highlight the edge between the parent and the root node
                        vis.graph.visit(rr, p);
                    }
                    // print the function name and the key to be inserted
                    vis.graph.setFunctionName("Inserting:");
                    vis.graph.setFunctionInsertText(` ${k} `);
                    
                    // Only add rectangles when recursion is expanded
                    if (isRecursionExpanded()) {
                        if (rr) {
                            // Create a new nested rectangle
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
                            vis.graph.updateHeight(k, 1);
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

            // if the tree is empty, create a new node as the root
            if (root === null) {
                chunker.add('if t = Empty', (vis) => null, [], depth);

                // Initialize the AVL tree with the first key
                let root = new AVLNode(key);

                // chunker.add('create new node',
                chunker.add('return n',
                    (vis, r, p) => {
                        // Pop the "Empty" rectangle
                        vis.graph.popRectStack();
                        vis.graph.setPauseLayout(false);
                        vis.graph.addNode(r, r);
                        vis.graph.updateHeight(r, 1);
                        if (p !== null) {
                            vis.graph.addEdge(p, r);
                            vis.graph.addNodeToRectStack(r, p);
                        }
                        vis.graph.rectangle_size();
                        popAfterReturnFlag = true;
                        // vis.graph.select(r, p);
                        ////  vis.graph.resetVisitAndSelect(r, p);
                    },
                    [key, parentNode ? parentNode.key : null],
                    depth
                );

                // clear all highlighting before actual returning
/*
                chunker.add('return n',
                    (vis, r, p) => {
                        vis.graph.resetVisitAndSelect(r, p);
                    },
                    [key, parentNode ? parentNode.key : null],
                    depth
                );
*/

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


            chunker.add('if k < root(t).key', (vis) => { }, [], depth);

            if (key < root.key) {
                chunker.add('prepare for the left recursive call', (vis) => null, [], depth);

                // Recursively insert the key into the left subtree
                insert(root.left, key, currIndex, root, depth + 1);

                // restore the function information after the recursive call
                chunker.add('left(t) <- AVLT_Insert(left(t), k)',
                    (vis, k, r) => {
                        vis.graph.setFunctionName("Inserting:");
                        vis.graph.setFunctionInsertText(` ${k} `);
                        if (popAfterReturnFlag) {
                            vis.graph.popRectStack();
                            popAfterReturnFlag = false;
                        }
                    },
                    [key, root ? `...${root.key}...` : "Empty"],
                    depth);

            } else if (key > root.key) {
                chunker.add('else if k > root(t).key', (vis) => null, [], depth);
                chunker.add('prepare for the right recursive call', (vis) => null, [], depth);

                // Recursively insert the key into the right subtree
                insert(root.right, key, currIndex, root, depth + 1);

                // restore the function information after the recursive call
                chunker.add('right(t) <- AVLT_Insert(right(t), k)',
                    (vis, k, r) => {
                        vis.graph.setFunctionName("Inserting:");
                        vis.graph.setFunctionInsertText(` ${k} `);
                        if (popAfterReturnFlag) {
                            vis.graph.popRectStack();
                            popAfterReturnFlag = false;
                        }
                    },
                    [key, root ? `...${root.key}...` : "Empty"],
                    depth);

            } else {
                // Key already exists in the tree
                chunker.add('else k = root(t).key',
                    (vis) => {
                        vis.graph.clear(); // clear all highlighting
                        popAfterReturnFlag = true;
                    },
                    [],
                    depth
                );
                chunker.add('return t, no change', (vis) => null, [], depth);
                return root;
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
                vis.graph.clearSelect_Circle_Count();
                vis.graph.setSelect_Circle_Count(r);
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
                        vis.graph.setFunctionName(`balanceCase: `);
                        vis.graph.setFunctionInsertText(`LL`);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setSelect_Circle_Count(r);
                        vis.graph.setFunctionNode(`${r}`);
                        // vis.graph.setFunctionBalance(b);

                        // highlight the edge about the case
                        vis.graph.visit(rl, r);
                        if (rll) {
                            vis.graph.visit(rll, rl);
                        }
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
                        vis.graph.setFunctionName(`balanceCase: `);
                        vis.graph.setFunctionName(`Rotation: `);
                        vis.graph.setFunctionInsertText(`RR`);
                        vis.graph.setFunctionNode(`${r}`);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setSelect_Circle_Count(r);
                        // vis.graph.setFunctionBalance(b);

                        // highlight the edge about the case
                        vis.graph.visit(rr, r);
                        if (rrr) {
                            vis.graph.visit(rrr, rr);
                        }
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
                    // vis.graph.clearTID();
                    vis.graph.setFunctionNode(null);
                    vis.graph.setFunctionBalance(null);
                    vis.graph.clearSelect_Circle_Count();
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
                        vis.graph.setFunctionName(`balanceCase: `);
                        vis.graph.setFunctionName(`Rotation: `);
                        vis.graph.setFunctionInsertText(`LR`);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setSelect_Circle_Count(r);
                        vis.graph.setFunctionNode(`${r}`);
                        // vis.graph.setFunctionBalance(b);

                        // highlight the edge about the case
                        vis.graph.visit(rl, r);
                        if (rlr) {
                            vis.graph.visit(rlr, rl);
                        }
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
                        // vis.graph.clearTID();
                        vis.graph.setFunctionNode(null);
                        vis.graph.setFunctionBalance(null);
                        vis.graph.clearSelect_Circle_Count();
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
                        vis.graph.setFunctionName(`balanceCase: `);
                        vis.graph.setFunctionName(`Rotation: `);
                        vis.graph.setFunctionInsertText(`RL`);
                        vis.graph.setFunctionNode(`${r}`);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setSelect_Circle_Count(r);
                        // vis.graph.setFunctionBalance(b);

                        // highlight the edge about the case
                        vis.graph.visit(rr, r);
                        if (rrl) {
                            vis.graph.visit(rrl, rr);
                        }
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
                        // vis.graph.clearTID();
                        vis.graph.setFunctionNode(null);
                        vis.graph.setFunctionBalance(null);
                        vis.graph.clearSelect_Circle_Count();
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

        // initial settings for the visualisation
        chunker.add(
            'Initialise',
            (vis) => {
                vis.graph.isWeighted = true;
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
        chunker.add(
            'AVLT_Insert(t, k)',
            (vis, elements, k, k_p) => {
                // Set initial function information
                vis.graph.setFunctionName("Inserting:");
                vis.graph.setFunctionInsertText(` ${k} `);
                // initialise the tree with the first key with box
                vis.graph.addNode(k, k);
                vis.graph.updateHeight(k, 1);
                vis.graph.layoutAVL(k, true, false);
                if (isRecursionExpanded()) {
                    // Pause the layout then remove the node, keep the rectangle
                    vis.graph.pushRectStack([k], `Depth 1`);
                    vis.graph.pushRectStack([], 'Empty');
                    vis.graph.rectangle_size();
                }
                vis.graph.setPauseLayout(true);
                vis.graph.removeNode(k);

            },
            [nodes, nodes[0], nodes[0].parentNode],
            1
        );

        // empty second chunker
        chunker.add('if t = Empty', (vis) => null, [], 1)

        // Insert the first key into the rectangle
        // chunker.add('create new node',
        chunker.add('return n',
            (vis, k) => {
                vis.graph.popRectStack();
                vis.graph.setPauseLayout(false);
                vis.graph.addNode(k, k);
                vis.graph.updateHeight(k, 1);
                vis.graph.rectangle_size();
                popAfterReturnFlag = true;
            },
            [nodes[0]],
            1
        );

        // chunker.add('return n', (vis) => { }, [], 1);

        // store the global root node
        let globalRoot = new AVLNode(nodes[0]);

        // insert the rest of the keys into the AVL tree
        for (let i = 1; i < nodes.length; i++) {
            globalRoot = insert(globalRoot, nodes[i], i, null, 1);
        }

        // finalise the visualisation; cursor back to top to save having a
        // "Done" extra line of code
        chunker.add('AVLT_Insert(t, k)',
            vis => {
                vis.graph.setFunctionInsertText();
                vis.graph.setFunctionName("Complete");
                vis.graph.setFunctionNode(null);
                vis.graph.setFunctionBalance(null);
                vis.graph.clearSelect_Circle_Count();
                vis.graph.clearRectangles();
            },
            [],
            1
        );
        return globalRoot;
    }
};
