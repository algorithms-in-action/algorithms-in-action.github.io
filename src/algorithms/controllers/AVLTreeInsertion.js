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
            constructor(key, depth) {
                this.key = key;
                chunker.add('n.key = k', (vis, k) => { }, [], depth);
                this.left = null;
                chunker.add('n.left = Empty', (vis, k) => { }, [], depth);
                this.right = null;
                chunker.add('n.right = Empty', (vis, k) => { }, [], depth);
                this.height = 1;
                chunker.add('n.height = 1', (vis, k) => { }, [], depth);
            }
        }

        // Function to update the height of a node based on its children's heights
        function updateHeight(root, depth = 1) {
            if (root !== null) {
                const leftHeight = root.left ? root.left.height : 0;
                const rightHeight = root.right ? root.right.height : 0;
                root.height = 1 + Math.max(leftHeight, rightHeight);
            }
        }

        // Left-Left Case (LLR) to balance the AVL tree
        function LLR(root, parentNode, depth, rotateVis = true, tidVis = true) {
            console.log('LLR');
            console.log("the root of LLR is " + root.key);

            chunker.add('rightRotate(t6)',
                (vis, r, tid) => {
                    if (tid) {
                        vis.graph.updateTID(r, 't6');
                    }
                }, [root.key, tidVis], depth
            );

            let R = root;
            let A = root.left;
            chunker.add('t2 = left(t6)',
                (vis, a, r, b, rr, tid) => {
                    if (tid) {
                        vis.graph.updateTID(a, 't2');
                        // if (b !== null) vis.graph.updateTID(b, 't1');
                        // if (rr !== null) vis.graph.updateTID(rr, 't7');
                    }
                },
                [A.key, R.key, A.left ? A.left.key : null, R.right ? R.right.key : null, tidVis],
                depth
            );
            let D = A.right;
            if (D) {
                chunker.add('t4 = right(t2)',
                    (vis, d, tid) => {
                        if (tid) {
                            vis.graph.updateTID(d, 't4');
                        }
                    },
                    [D.key, tidVis],
                    depth
                );
            } else {
                chunker.add('t4 = right(t2)',
                    (vis) => {
                        vis.graph.setTagInfo('t4 ');
                    },
                    [],
                    depth
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
                    // freeze the depth of the tree, from start rotation
                    vis.graph.layoutAVL(g, true, true);
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
                    // remove edge after layout to perform the middle step
                    if (d !== null) vis.graph.removeEdge(r, d);
                },
                [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, G.key, rotateVis],
                depth
            );

            if (D) {
                chunker.add('t6.left = t4',
                    // reconnect the edge between t6 and t4
                    (vis, r, d) => {
                        if (d !== null) vis.graph.addEdge(r, d);
                    },
                    [R.key, D.key],
                    depth
                )
            }

            const temp = root.left;
            root.left = temp.right;
            temp.right = root;
            updateHeight(root, depth);
            updateHeight(temp, depth);
            // update height in the graph
            chunker.add('recompute heights of t6 and t2', (vis, r, h1, t, h2, d, h3) => {
                vis.graph.updateHeight(r, h1);
                vis.graph.updateHeight(t, h2);
                if (d !== null) vis.graph.updateHeight(d, h3);
            },
                [root.key, root.height, temp.key, temp.height, D ? D.key : null, D ? D.height : 0],
                depth,
            );

            if (parentNode !== null) {
                if (temp.key < parentNode.key) {
                    parentNode.left = temp;
                }
                else {
                    parentNode.right = temp;
                }
            }

            chunker.add('return t2',
                (vis, tid, g) => {
                    if (tid) {
                        vis.graph.clearTID();
                        vis.graph.setTagInfo('');
                    }
                    // de-freeze the depth of the tree, after finish rotation
                    vis.graph.layoutAVL(g, true, false);
                },
                [tidVis, G.key],
                depth
            );
            return temp;
        }

        // Right-Right Rotation (RRR) to balance the AVL tree
        function RRR(root, parentNode, depth, rotateVis = true, tidVis = true) {
            // chunker.add('leftRotate(t2)', (vis) => null, [], depth);
            console.log('RRR');
            console.log("the root of RRR is " + root.key);
            chunker.add('leftRotate(t2)', (vis, r, tid) => {
                if (tid) {
                    vis.graph.updateTID(r, 't2');
                }
            }, [root.key, tidVis],
                depth
            );
            let R = root;
            let A = root.right;
            chunker.add('t6 = right(t2)',
                (vis, a, r, b, rl, tid) => {
                    if (tid) {
                        vis.graph.updateTID(a, 't6');
                        // if (b !== null) vis.graph.updateTID(b, 't7');
                        // if (rl !== null) vis.graph.updateTID(rl, 't1');
                    }
                },
                [A.key, R.key, A.right ? A.right.key : null, R.left ? R.left.key : null, tidVis],
                depth
            );
            let D = A.left;
            if (D) {
                chunker.add('t4 = left(t6)',
                    (vis, d, tid) => {
                        if (tid) {
                            vis.graph.updateTID(d, 't4');
                        }
                    },
                    [D.key, tidVis],
                    depth
                );
            } else {
                chunker.add('t4 = left(t6)',
                    (vis) => {
                        vis.graph.setTagInfo('t4 ');
                    },
                    [],
                    depth
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
                    // freeze the depth of the tree, from start rotation
                    vis.graph.layoutAVL(g, true, true);
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
                    // remove edge after layout to perform the middle step
                    if (d !== null) vis.graph.removeEdge(r, d);
                },
                [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, G.key, rotateVis],
                depth
            );

            if (D) {
                chunker.add('t2.right = t4',
                    // reconnect the edge between t2 and t4
                    (vis, r, d) => {
                        if (d !== null) vis.graph.addEdge(r, d);
                    },
                    [R.key, D.key],
                    depth
                )
            }

            const temp = root.right;
            root.right = temp.left;
            temp.left = root;
            updateHeight(root, depth);
            updateHeight(temp, depth);
            // update height in the graph
            chunker.add('recompute heights of t2 and t6', (vis, r, h1, t, h2, d, h3) => {
                vis.graph.updateHeight(r, h1);
                vis.graph.updateHeight(t, h2);
                if (d !== null) vis.graph.updateHeight(d, h3);
            },
                [root.key, root.height, temp.key, temp.height, D ? D.key : null, D ? D.height : 0],
                depth,
            );

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
                (vis, tid, g) => {
                    if (tid) {
                        vis.graph.clearTID();
                        vis.graph.setTagInfo('');
                    }
                    // de-freeze the depth of the tree, after finish rotation
                    vis.graph.layoutAVL(g, true, false);
                },
                [tidVis, G.key],
                depth
            );
            return temp;
        }

        // Left-Right Rotation (LRR) to balance the AVL tree
        function LRR(root, parentNode, depth) {
            // let t6 = root;
            // let t2 = root.left;
            // let t7 = root.right;
            // let t1 = t2 ? t2.left : null;
            // let t4 = t2 ? t2.right : null;
            // let t3 = t4 ? t4.left : null;
            // let t5 = t4 ? t4.right : null;
            // chunker.add('perform left rotation on the left subtree',
            //     (vis, t1, t2, t3, t4, t5, t6, t7) => {
            //         let text = '';
            //         if (t6 != null) { vis.graph.updateTID(t6, 't6') }
            //         else { text += 't6 ' }
            //         if (t2 != null) { vis.graph.updateTID(t2, 't2') }
            //         else { text += 't2 ' }
            //         if (t4 != null) { vis.graph.updateTID(t4, 't4') }
            //         else { text += 't4 ' }
            //         if (t1 != null) { vis.graph.updateTID(t1, 't1') }
            //         else { text += 't1 ' }
            //         if (t3 != null) { vis.graph.updateTID(t3, 't3') }
            //         else { text += 't3 ' }
            //         if (t5 != null) { vis.graph.updateTID(t5, 't5') }
            //         else { text += 't5 ' }
            //         if (t7 != null) { vis.graph.updateTID(t7, 't7') }
            //         else { text += 't7 ' }
            //         console.log("------------------", text);
            //         if (text !== '') {
            //             vis.graph.setTagInfo(text);
            //         }
            //         vis.graph.setFunctionName('Rotation: ');
            //         vis.graph.setFunctionInsertText(`LRR`);
            //     },
            //     [t1 ? t1.key : null, t2 ? t2.key : null, t3 ? t3.key : null, t4 ? t4.key : null,
            //     t5 ? t5.key : null, t6 ? t6.key : null, t7 ? t7.key : null],
            //     depth
            // );
            root.left = RRR(root.left, root, depth, false, true);
            chunker.add('left(t) <- leftRotate(left(t));', (vis) => { }, [], depth);
            chunker.add('return right rotation on t', (vis) => { }, [], depth);
            let finalRoot = LLR(root, parentNode, depth, true, true);
            return finalRoot;
        }

        // Right-Left Rotation (RLR) to balance the AVL tree
        function RLR(root, parentNode, depth) {
            // let t2 = root;
            // let t6 = root.right;
            // let t1 = root.left;
            // let t4 = t6 ? t6.left : null;
            // let t7 = t6 ? t6.right : null;
            // let t3 = t4 ? t4.left : null;
            // let t5 = t4 ? t4.right : null;
            // chunker.add('perform right rotation on the right subtree',
            //     (vis, t1, t2, t3, t4, t5, t6, t7) => {
            //         let text = '';
            //         if (t6 != null) { vis.graph.updateTID(t6, 't6') }
            //         else { text += 't6 ' }
            //         if (t2 != null) { vis.graph.updateTID(t2, 't2') }
            //         else { text += 't2 ' }
            //         if (t4 != null) { vis.graph.updateTID(t4, 't4') }
            //         else { text += 't4 ' }
            //         if (t1 != null) { vis.graph.updateTID(t1, 't1') }
            //         else { text += 't1 ' }
            //         if (t3 != null) { vis.graph.updateTID(t3, 't3') }
            //         else { text += 't3 ' }
            //         if (t5 != null) { vis.graph.updateTID(t5, 't5') }
            //         else { text += 't5 ' }
            //         if (t7 != null) { vis.graph.updateTID(t7, 't7') }
            //         else { text += 't7 ' }
            //         console.log("------------------", text);
            //         if (text !== '') {
            //             vis.graph.setTagInfo(text);
            //         }
            //         vis.graph.setFunctionName('Rotation: ');
            //         vis.graph.setFunctionInsertText(`RLR`);
            //     },
            //     [t1 ? t1.key : null, t2 ? t2.key : null, t3 ? t3.key : null, t4 ? t4.key : null,
            //     t5 ? t5.key : null, t6 ? t6.key : null, t7 ? t7.key : null],
            //     depth
            // );
            root.right = LLR(root.right, root, depth, false, true);
            chunker.add('right(t) <- rightRotate(right(t));', (vis) => { }, [], depth);
            chunker.add('return left rotation on t', (vis) => { }, [], depth);
            let finalRoot = RRR(root, parentNode, depth, true, true);
            return finalRoot;
        }

        // Function to insert a key into the AVL tree and balance the tree if needed
        function insert(root, key, currIndex, parentNode = null, depth = 1) {

            chunker.add('AVLT_Insert(t, k)',
                (vis, k, d, index, r) => {
                    if (d === 1) {
                        vis.array.depatch(index - 1);
                        vis.array.patch(index);
                    }
                    vis.graph.setFunctionName("AVLT_Insert");
                    vis.graph.setFunctionInsertText(`( ...${r}... , ${k} )`);
                },
                [key, depth, currIndex, root ? root.key : "empty"],
                depth
            );

            if (root === null) {
                chunker.add('if t = Empty', (vis) => null, [], depth);
                chunker.add('n = new Node',
                    (vis, r, p, index) => {
                        vis.graph.addNode(r, r, 1);

                        if (p !== null) {
                            vis.graph.addEdge(p, r);
                        }
                        vis.graph.select(r, p);
                    },
                    [key, parentNode ? parentNode.key : null, currIndex],
                    depth
                );
                // Initialize the AVL tree with the first key
                let root = new AVLNode(key, depth);

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
                chunker.add('prepare for the left recursive call', (vis) => null, [], depth);
                chunker.add('left(t) <- AVLT_Insert(left(t), k)', (vis) => null, [], depth);
                insert(root.left, key, currIndex, root, depth + 1);
                chunker.add('left(t) <- AVLT_Insert(left(t), k)', (vis) => null, [], depth);
            } else if (key > root.key) {
                chunker.add('else if k > root(t).key', (vis) => null, [], depth);
                // Ref insertRight
                chunker.add('prepare for the right recursive call', (vis) => null, [], depth);
                chunker.add('right(t) <- AVLT_Insert(right(t), k)', (vis) => null, [], depth);
                insert(root.right, key, currIndex, root, depth + 1);
                chunker.add('right(t) <- AVLT_Insert(right(t), k)', (vis) => null, [], depth);
            } else {
                // Key already exists in the tree
                chunker.add('else k = root(t).key',
                    (vis) => {
                        vis.graph.clear();
                    },
                    [],
                    depth
                );
                chunker.add('return t, no change', (vis) => null, [], depth);
                return root;
            }

            updateHeight(root, depth);

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
            chunker.add('balance = left(t).height - right(t).height', (vis, r) => {
                // vis.graph.setFunctionName(`balance = ${balance}, `);
                // vis.graph.setFunctionInsertText('case ?');
                vis.graph.setFunctionNode(`${r}`);
                vis.graph.clearSelect_Circle_Count();
                vis.graph.setSelect_Circle_Count(r);
                vis.graph.setFunctionBalance(balance);
            }, [root.key], depth);

            let rotateDepth = depth + 1;
            // console.log(key, parentNode, tree[parentNode].left);
            chunker.add('if balance > 1 && k < left(t).key', (vis) => null, [], depth);
            if (balance > 1 && key < root.left.key) {
                // console.log("LLR");
                chunker.add('perform right rotation to re-balance t',
                    (vis, r, b) => {
                        vis.graph.setFunctionName(`Rotaiton: `);
                        vis.graph.setFunctionInsertText(`LL`);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setSelect_Circle_Count(r);
                        vis.graph.setFunctionNode(`${r}`);
                        vis.graph.setFunctionBalance(b);
                    },
                    [root.key, balance],
                    depth
                );
                root = LLR(root, parentNode, rotateDepth);
                chunker.add('return rightRotate(t)', (vis) => {
                    vis.graph.setFunctionNode(null);
                    vis.graph.clearSelect_Circle_Count();
                    vis.graph.setFunctionBalance(null);
                }, [], depth);
            } else if (balance < -1 && key > root.right.key) {
                chunker.add('if balance < -1 && k > right(t).key', (vis) => null, [], depth);
                chunker.add('perform left rotation to re-balance t',
                    (vis, r, b) => {
                        vis.graph.setFunctionName(`Rotaiton: `);
                        vis.graph.setFunctionInsertText(`RR`);
                        vis.graph.setFunctionNode(`${r}`);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setSelect_Circle_Count(r);
                        vis.graph.setFunctionBalance(b);
                    },
                    [root.key, balance],
                    depth
                );
                // console.log("RRR");
                root = RRR(root, parentNode, rotateDepth);
                chunker.add('return leftRotate(t)', (vis) => {
                    vis.graph.setFunctionNode(null);
                    vis.graph.setFunctionBalance(null);
                    vis.graph.clearSelect_Circle_Count();
                }, [], depth);
            } else if (balance > 1 && key > root.left.key) {
                chunker.add('if balance > 1 && k > left(t).key', (vis) => null, [], depth);
                chunker.add('perform left rotation on the left subtree',
                    (vis, r, b) => {
                        vis.graph.setFunctionName(`Rotaiton: `);
                        vis.graph.setFunctionInsertText(`LR`);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setSelect_Circle_Count(r);
                        vis.graph.setFunctionNode(`${r}`);
                        vis.graph.setFunctionBalance(b);
                    },
                    [root.key, balance],
                    depth
                );
                // console.log("LRR");
                root = LRR(root, parentNode, rotateDepth);
                chunker.add('return rightRotate(t) after leftRotate', (vis) => {
                    vis.graph.setFunctionNode(null);
                    vis.graph.setFunctionBalance(null);
                    vis.graph.clearSelect_Circle_Count();
                }, [], depth);
            } else if (balance < -1 && key < root.right.key) {
                chunker.add('if balance < -1 && k < right(t).key', (vis) => null, [], depth);
                // console.log("RLR");
                chunker.add('perform right rotation on the right subtree',
                    (vis, r, b) => {
                        vis.graph.setFunctionName(`Rotaiton: `);
                        vis.graph.setFunctionInsertText(`RL`);
                        vis.graph.setFunctionNode(`${r}`);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setSelect_Circle_Count(r);
                        vis.graph.setFunctionBalance(b);
                    },
                    [root.key, balance],
                    depth
                );
                root = RLR(root, parentNode, rotateDepth);
                chunker.add('return leftRotate(t) after rightRotate', (vis) => {
                    vis.graph.setFunctionNode(null);
                    vis.graph.setFunctionBalance(null);
                    vis.graph.clearSelect_Circle_Count();
                }, [], depth);
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

        // init the tree with the first key
        chunker.add(
            'AVLT_Insert(t, k)',
            (vis, elements) => {
                vis.array.set(elements);
                vis.graph.isWeighted = true;
                vis.graph.setFunctionName('Tree is Empty');
                vis.graph.setFunctionInsertText(``);
                vis.array.patch(0);
            },
            [nodes],
            1
        );

        // Populate the ArrayTracer using nodes
        chunker.add(
            'if t = Empty',
            (vis, k) => {
                vis.graph.setFunctionName("AVLT_Insert");
                vis.graph.setFunctionInsertText(`( ...empty... , ${k} )`);
            },
            [nodes[0]],
            1
        );

        chunker.add('n = new Node',
            (vis, k) => {
                vis.graph.addNode(k, k, 1);
                vis.graph.layoutAVL(k, true, false);
            },
            [nodes[0]],
            1
        );

        let globalRoot = new AVLNode(nodes[0], 1);

        for (let i = 1; i < nodes.length; i++) {
            globalRoot = insert(globalRoot, nodes[i], i, null, 1);
        }

        chunker.add('done',
            vis => {
                vis.graph.setFunctionInsertText();
                vis.graph.setFunctionName("Complete");
                vis.graph.setFunctionNode(null);
                vis.graph.setFunctionBalance(null);
                vis.graph.clearSelect_Circle_Count();
            },
            [],
            1
        );
        return globalRoot;
    }
};