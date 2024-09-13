import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import { node } from 'prop-types';
import { chunk, map } from 'lodash';
import { Update } from '@mui/icons-material';

export default {
    initVisualisers() {
        return {

            array: {
                instance: new Array1DTracer('array', null, 'Keys to insert', { arrayItemMagnitudes: true }),
                order: 0,
            },
            graph: {
                instance: new GraphTracer('avl', null, 'AVL tree'),
                order: 1,
            },
        };
    },

    /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be inserted
   */
    run(chunker, { nodes }) {
        if (nodes.length === 0) return;

        class AVLNode {
            constructor(key) {
                this.key = key;
                chunker.add('n.key = k');
                this.left = null;
                chunker.add('n.left = Empty');
                this.right = null;
                chunker.add('n.right = Empty');
                this.height = 1;
                chunker.add('n.height = 1');
            }
        }

        // Function to update the height of a node based on its children's heights
        function updateHeight(root) {
            if (root !== null) {
                const leftHeight = root.left ? root.left.height : 0;
                const rightHeight = root.right ? root.right.height : 0;
                root.height = 1 + Math.max(leftHeight, rightHeight);

                // update height in the graph
                chunker.add('root(t).height = 1 + max(left(t).height, right(t).height)',
                    (vis, r, h) => {
                        vis.graph.updateHeight(r, h);
                    },
                    [root.key, root.height],
                );
            }
        }

        // Left-Left Case (LLR) to balance the AVL tree
        function LLR(root, parentNode, rotateVis = true, tidVis = true) {

            console.log('LLR');
            console.log("the root of LLR is " + root.key);

            let R = root;
            let A = root.left;
            chunker.add('t2 = left(t6)',
                (vis, a, r, b, rr, tid) => {
                    if (tid) {
                        vis.graph.updateTID(r, 't6');
                        vis.graph.updateTID(a, 't2');
                        if (b !== null) vis.graph.updateTID(b, 't1');
                        if (rr !== null) vis.graph.updateTID(rr, 't7');
                        vis.graph.setFunctionName('Rotation: ');
                        vis.graph.setAVLText(`LLR`);
                    }
                },
                [A.key, R.key, A.left ? A.left.key : null, R.right ? R.right.key : null, tidVis]
            );
            let D = A.right;
            if (D) {
                chunker.add('t4 = right(t2)',
                    (vis, d, tid) => {
                        if (tid) {
                            vis.graph.updateTID(d, 't4');
                        }
                    },
                    [D.key, tidVis]
                );
            }

            console.log("the height of R is " + R.height);
            console.log("the height of A is " + A.height);

            let G = null;
            if (parentNode !== null) {
                G = globalRoot;
            } else {
                G = A;
            }

            console.log("delete edge between " + R.key + " and " + A.key);
            console.log("add edge between " + A.key + " and " + R.key);
            chunker.add('t2.right = t6',
                (vis, r, a, d, p, g, rotate) => {
                    if (p !== null) {
                        vis.graph.removeEdge(p, r);
                        vis.graph.addEdge(p, a);
                    }
                    if (rotate) vis.graph.visit(a, p);

                    if (d !== null) {
                        vis.graph.removeEdge(a, d);
                        vis.graph.addEdge(r, d);
                    }

                    vis.graph.removeEdge(r, a);
                    if (rotate) vis.graph.resetVisitAndSelect(r, null);
                    vis.graph.addEdge(a, r);
                    vis.graph.layoutAVL(g, true);

                    // remove edge after layout to perform the middle step
                    if (d !== null) vis.graph.removeEdge(r, d);
                },
                [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, G.key, rotateVis]
            );

            if (D) {
                chunker.add('t6.left = t4',
                    // reconnect the edge between t6 and t4
                    (vis, r, d) => {
                        if (d !== null) vis.graph.addEdge(r, d);
                    },
                    [R.key, D.key]
                )
            }

            const temp = root.left;
            root.left = temp.right;
            temp.right = root;
            chunker.add('recompute heights of t6 and t2');
            updateHeight(root);
            updateHeight(temp);

            if (parentNode !== null) {
                if (temp.key < parentNode.key) {
                    parentNode.left = temp;
                }
                else {
                    parentNode.right = temp;
                }
            }

            chunker.add('return t2',
                (vis, tid) => {
                    if (tid) {
                        vis.graph.clearTID();
                    }
                },
                [tidVis]
            );
            return temp;
        }

        // Right-Right Rotation (RRR) to balance the AVL tree
        function RRR(root, parentNode, rotateVis = true, tidVis = true) {
            console.log('RRR');
            console.log("the root of RRR is " + root.key);

            let R = root;
            let A = root.right;
            chunker.add('t6 = right(t2)',
                (vis, a, r, b, rl, tid) => {
                    if (tid) {
                        vis.graph.updateTID(r, 't2');
                        vis.graph.updateTID(a, 't6');
                        if (b !== null) vis.graph.updateTID(b, 't7');
                        if (rl !== null) vis.graph.updateTID(rl, 't1');
                        vis.graph.setFunctionName('Rotation: ');
                        vis.graph.setAVLText(`RRR`);
                    }
                },
                [A.key, R.key, A.right ? A.right.key : null, R.left ? R.left.key : null, tidVis]
            );
            let D = A.left;
            if (D) {
                chunker.add('t4 = left(t6)',
                    (vis, d, tid) => {
                        if (tid) {
                            vis.graph.updateTID(d, 't4');
                        }
                    },
                    [D.key, tidVis]
                );
            }
            let G = null;
            if (parentNode !== null) {
                G = globalRoot;
            } else {
                G = A;
            }
            chunker.add('t6.left = t2',
                (vis, r, a, d, p, g, rotate) => {
                    if (p !== null) {
                        vis.graph.removeEdge(p, r);
                        vis.graph.addEdge(p, a);
                    }
                    if (rotate) vis.graph.visit(a, p);

                    if (d !== null) {
                        vis.graph.removeEdge(a, d);
                        vis.graph.addEdge(r, d);
                    }

                    vis.graph.removeEdge(r, a);
                    if (rotate) vis.graph.resetVisitAndSelect(r, null);
                    vis.graph.addEdge(a, r);
                    vis.graph.layoutAVL(g, true);

                    // remove edge after layout to perform the middle step
                    if (d !== null) vis.graph.removeEdge(r, d);
                },
                [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, G.key, rotateVis]
            );

            if (D) {
                chunker.add('t2.right = t4',
                    // reconnect the edge between t2 and t4
                    (vis, r, d) => {
                        if (d !== null) vis.graph.addEdge(r, d);
                    },
                    [R.key, D.key]
                )
            }

            const temp = root.right;
            root.right = temp.left;
            temp.left = root;
            chunker.add('recompute heights of t2 and t6');
            updateHeight(root);
            updateHeight(temp);

            if (parentNode !== null) {
                if (temp.key < parentNode.key) {
                    parentNode.left = temp;
                }
                else {
                    parentNode.right = temp;
                }
            }

            console.log("the height of " + root.key + " is " + root.height);
            console.log("the height of " + temp.key + " is " + temp.height);
            chunker.add('return t6',
                (vis, tid) => {
                    if (tid) {
                        vis.graph.clearTID();
                    }
                },
                [tidVis]
            );
            return temp;
        }

        // Left-Right Rotation (LRR) to balance the AVL tree
        function LRR(root, parentNode) {
            let t6 = root;
            let t2 = root.left;
            let t7 = root.right;
            let t1 = t2 ? t2.left : null;
            let t4 = t2 ? t2.right : null;
            let t3 = t4 ? t4.left : null;
            let t5 = t4 ? t4.right : null;
            chunker.add('left(t) <- leftRotate(left(t));',
                (vis, t1, t2, t3, t4, t5, t6, t7) => {
                    if (t6 != null) vis.graph.updateTID(t6, 't6');
                    if (t2 != null) vis.graph.updateTID(t2, 't2');
                    if (t4 != null) vis.graph.updateTID(t4, 't4');
                    if (t1 != null) vis.graph.updateTID(t1, 't1');
                    if (t3 != null) vis.graph.updateTID(t3, 't3');
                    if (t5 != null) vis.graph.updateTID(t5, 't5');
                    if (t7 != null) vis.graph.updateTID(t7, 't7');
                    vis.graph.setFunctionName('Rotation: ');
                    vis.graph.setAVLText(`LRR`);
                },
                [t1 ? t1.key : null, t2 ? t2.key : null, t3 ? t3.key : null, t4 ? t4.key : null,
                t5 ? t5.key : null, t6 ? t6.key : null, t7 ? t7.key : null]
            );
            root.left = RRR(root.left, root, false, false);
            let finalRoot = LLR(root, parentNode, true, false);
            chunker.add('return rightRotate(t) after leftRotate',
                vis => {
                    vis.graph.clearTID();
                }
            );
            return finalRoot;
        }

        // Right-Left Rotation (RLR) to balance the AVL tree
        function RLR(root, parentNode) {
            let t2 = root;
            let t6 = root.right;
            let t1 = root.left;
            let t4 = t6 ? t6.left : null;
            let t7 = t6 ? t6.right : null;
            let t3 = t4 ? t4.left : null;
            let t5 = t4 ? t4.right : null;
            chunker.add('right(t) <- rightRotate(right(t));',
                (vis, t1, t2, t3, t4, t5, t6, t7) => {
                    if (t6 != null) vis.graph.updateTID(t6, 't6');
                    if (t2 != null) vis.graph.updateTID(t2, 't2');
                    if (t4 != null) vis.graph.updateTID(t4, 't4');
                    if (t1 != null) vis.graph.updateTID(t1, 't1');
                    if (t3 != null) vis.graph.updateTID(t3, 't3');
                    if (t5 != null) vis.graph.updateTID(t5, 't5');
                    if (t7 != null) vis.graph.updateTID(t7, 't7');
                    vis.graph.setFunctionName('Rotation: ');
                    vis.graph.setAVLText(`RLR`);
                },
                [t1 ? t1.key : null, t2 ? t2.key : null, t3 ? t3.key : null, t4 ? t4.key : null,
                t5 ? t5.key : null, t6 ? t6.key : null, t7 ? t7.key : null]
            );
            root.right = LLR(root.right, root, false, false);
            let finalRoot = RRR(root, parentNode, true, false);
            chunker.add('return leftRotate(t) after rightRotate',
                vis => {
                    vis.graph.clearTID();
                }
            );
            return finalRoot;
        }

        // Function to insert a key into the AVL tree and balance the tree if needed
        function insert(root, key, currIndex, parentNode = null) {

            if (root === null) {
                chunker.add('if t = Empty');
                // Initialize the AVL tree with the first key
                let root = new AVLNode(key);
                chunker.add('n = new Node',
                    (vis, r, p, index) => {
                        if (index > 0) vis.array.deselect(index - 1);
                        vis.array.select(index);
                        vis.graph.addNode(r, r, 1);
                        vis.graph.setFunctionName("AVLT_Insert");
                        vis.graph.setAVLText("( t , " + key + " )");

                        if (p !== null) {
                            vis.graph.addEdge(p, r);
                        }
                        vis.graph.select(r, p);
                        if (index === 0) vis.graph.layoutAVL(r, true);
                    },
                    [key, parentNode ? parentNode.key : null, currIndex],
                );
                chunker.add('return n',
                    (vis, r, p) => {
                        vis.graph.resetVisitAndSelect(r, p);
                    },
                    [key, parentNode ? parentNode.key : null],
                );
                if (parentNode !== null) {
                    if (key < parentNode.key) {
                        parentNode.left = root;
                    } else {
                        parentNode.right = root;
                    }
                }
                return root;
            }

            chunker.add('if k < root(t).key',
                (vis, r, p) => {
                    vis.graph.visit(r, p);
                },
                [root.key, parentNode ? parentNode.key : null],
            );

            if (key < root.key) {
                // Ref insertLeft
                chunker.add('left(t) <- AVLT_Insert(left(t), k)');
                insert(root.left, key, currIndex, root);
            } else if (key > root.key) {
                chunker.add('else if k > root(t).key');
                // Ref insertRight
                chunker.add('right(t) <- AVLT_Insert(right(t), k)');
                insert(root.right, key, currIndex, root);
            } else {
                // Key already exists in the tree
                chunker.add('else k = root(t).key',
                    (vis) => {
                        vis.graph.clear();
                    }
                );
                chunker.add('return t, no change');
                return root;
            }

            updateHeight(root);

            // get balance factor of the root
            const leftHeight = root.left ? root.left.height : 0;
            const rightHeight = root.right ? root.right.height : 0;

            chunker.add('balance = left(t).height - right(t).height');

            const balance = leftHeight - rightHeight;
            // console.log(key, parentNode, tree[parentNode].left);
            chunker.add('if balance > 1 && k < left(t).key');
            if (balance > 1 && key < root.left.key) {
                chunker.add('return rightRotate(t)');
                // console.log("LLR");
                root = LLR(root, parentNode);
            } else if (balance < -1 && key > root.right.key) {
                chunker.add('if balance < -1 && k > right(t).key');
                chunker.add('return leftRotate(t)');
                // console.log("RRR");
                root = RRR(root, parentNode);
            } else if (balance > 1 && key > root.left.key) {
                chunker.add('if balance > 1 && k > left(t).key');
                // console.log("LRR");
                root = LRR(root, parentNode);
            } else if (balance < -1 && key < root.right.key) {
                chunker.add('if balance < -1 && k < right(t).key');
                // console.log("RLR");
                root = RLR(root, parentNode);
            }

            chunker.add('return t',
                (vis, r, p) => {
                    vis.graph.resetVisitAndSelect(r, p);
                },
                [root.key, parentNode ? parentNode.key : null],
            );
            return root;
        }

        // Populate the ArrayTracer using nodes
        chunker.add(
            't = Empty',
            (vis, elements) => {
                vis.array.set(elements);
                vis.array.select(0);
                vis.graph.isWeighted = true;
                vis.graph.setFunctionName('Tree is Empty');
                vis.graph.setAVLText(``);
            },
            [nodes],
        );

        chunker.add('for each k in keys');
        let globalRoot = null;

        for (let i = 0; i < nodes.length; i++) {
            globalRoot = insert(globalRoot, nodes[i], i);
            chunker.add('for each k in keys');
        }

        chunker.add('done',
            vis => {
                vis.graph.setAVLText();
                vis.graph.setFunctionName("Complete");
            },
            [],
            0
        );

        return globalRoot;
    }
};