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
        function LLR(root, parentNode, rotateVis = true) {

            console.log('LLR');
            console.log("the root of LLR is " + root.key);

            let R = root;
            let A = root.left;
            chunker.add('t2 = left(t6)');
            let D = A.right;
            chunker.add('t4 = right(t2)');

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
                    vis.graph.layoutBST(g, true);

                    // remove edge after layout to perform the middle step
                    // if (d !== null) vis.graph.removeEdge(r, d);
                },
                [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, G.key, rotateVis]
            );

            // chunker.add('t6.left = t4',
            //     // reconnect the edge between t6 and t4
            //     (vis, r, d) => {
            //         if (d !== null) vis.graph.addEdge(r, d);
            //     },
            //     [t6.key, t4 ? t4.key : null]
            // )

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

            chunker.add('return t2');
            return temp;
        }

        // Right-Right Rotation (RRR) to balance the AVL tree
        function RRR(root, parentNode, rotateVis = true) {
            console.log('RRR');
            console.log("the root of RRR is " + root.key);

            let R = root;
            let A = root.right;
            chunker.add('t6 = right(t2)');
            let D = A.left;
            chunker.add('t4 = left(t6)');
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
                    vis.graph.layoutBST(g, true);

                    // remove edge after layout to perform the middle step
                    // if (d !== null) vis.graph.removeEdge(r, d);
                },
                [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, G.key, rotateVis]
            );

            // chunker.add('t2.right = t4',
            //     // reconnect the edge between t2 and t4
            //     (vis, r, d) => {
            //         if (d !== null) vis.graph.addEdge(r, d);
            //     },
            //     [t2.key, t4 ? t4.key : null]
            // )

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
            chunker.add('return t6');
            return temp;
        }

        // Left-Right Rotation (LRR) to balance the AVL tree
        function LRR(root, parentNode) {
            chunker.add('left(t) <- leftRotate(left(t));');
            root.left = RRR(root.left, root, false);
            chunker.add('return rightRotate(t) after leftRotate');
            return LLR(root, parentNode);
        }

        // Right-Left Rotation (RLR) to balance the AVL tree
        function RLR(root, parentNode) {
            chunker.add('right(t) <- rightRotate(right(t));');
            root.right = LLR(root.right, root, false);
            chunker.add('return leftRotate(t) after rightRotate');
            return RRR(root, parentNode);
        }

        // Function to insert a key into the AVL tree and balance the tree if needed
        function insert(root, key, currIndex, parentNode = null, depth = 0) {

            if (root === null) {
                chunker.add('if t = Empty', (vis) => null, [], depth);
                // Initialize the AVL tree with the first key
                let root = new AVLNode(key);
                chunker.add('n = new Node',
                    (vis, r, p, index) => {
                        if (index > 0) vis.array.deselect(index - 1);
                        vis.array.select(index);
                        vis.graph.addNode(r, r, 1);
                        if (p !== null) {
                            vis.graph.addEdge(p, r);
                        }
                        vis.graph.select(r, p);
                        if (index === 0) vis.graph.layoutBST(r, true);
                    },
                    [key, parentNode ? parentNode.key : null, currIndex],
                    depth
                );
                chunker.add('return n',
                    (vis, r, p) => {
                        vis.graph.resetVisitAndSelect(r, p);
                    },
                    [key, parentNode ? parentNode.key : null],
                    depth
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
                depth
            );

            if (key < root.key) {
                // Ref insertLeft
                chunker.add('left(t) <- AVLT_Insert(left(t), k)', (vis) => null, [], depth);
                insert(root.left, key, currIndex, root, depth + 1);
            } else if (key > root.key) {
                chunker.add('else if k > root(t).key', (vis) => null, [], depth);
                // Ref insertRight
                chunker.add('right(t) <- AVLT_Insert(right(t), k)', (vis) => null, [], depth);
                insert(root.right, key, currIndex, root, depth + 1);
            } else {
                // Key already exists in the tree
                chunker.add('else k = root(t).key',
                    (vis) => {
                        vis.graph.clear();
                    },
                    undefined,
                    depth
                );
                chunker.add('return t, no change', (vis) => null, [], depth);
                return root;
            }

            updateHeight(root);

            // get balance factor of the root
            const leftHeight = root.left ? root.left.height : 0;
            const rightHeight = root.right ? root.right.height : 0;

            chunker.add('balance = left(t).height - right(t).height', (vis) => null, [], depth);

            const balance = leftHeight - rightHeight;
            // console.log(key, parentNode, tree[parentNode].left);
            chunker.add('if balance > 1 && k < left(t).key', (vis) => null, [], depth);
            if (balance > 1 && key < root.left.key) {
                chunker.add('return rightRotate(t)', (vis) => null, [], depth);
                // console.log("LLR");
                root = LLR(root, parentNode);
            } else if (balance < -1 && key > root.right.key) {
                chunker.add('if balance < -1 && k > right(t).key', (vis) => null, [], depth);
                chunker.add('return leftRotate(t)', (vis) => null, [], depth);
                // console.log("RRR");
                root = RRR(root, parentNode);
            } else if (balance > 1 && key > root.left.key) {
                chunker.add('if balance > 1 && k > left(t).key', (vis) => null, [], depth);
                // console.log("LRR");
                root = LRR(root, parentNode);
            } else if (balance < -1 && key < root.right.key) {
                chunker.add('if balance < -1 && k < right(t).key', (vis) => null, [], depth);
                // console.log("RLR");
                root = RLR(root, parentNode);
            }

            chunker.add('return t',
                (vis, r, p) => {
                    vis.graph.resetVisitAndSelect(r, p);
                },
                [root.key, parentNode ? parentNode.key : null],
                depth
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
            },
            [nodes],
            0
        );

        chunker.add('for each k in keys', (vis) => null, [], 0);
        let globalRoot = null;

        for (let i = 0; i < nodes.length; i++) {
            globalRoot = insert(globalRoot, nodes[i], i);
            chunker.add('for each k in keys', (vis) => null, [], 0);
        }

        return globalRoot;
    }
};