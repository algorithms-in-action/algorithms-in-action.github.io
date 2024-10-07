import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';

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
                this.left = null;
                this.right = null;
                this.height = 1;
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
                (vis, tt2, tt6, tid) => {


                    // // freeze the depth of the tree, from start rotation
                    // vis.graph.layoutAVL(g, true, true);


                    if (tid) {
                        vis.graph.updateTID(tt2, 't2');
                        // if (b !== null) vis.graph.updateTID(b, 't1');
                        // if (rr !== null) vis.graph.updateTID(rr, 't7');
                    }
                    // vis.graph.removeEdge(tt6, tt2);
                    // console.log([tt2, tt6, t]);
                    let pNode = vis.graph.findNode(tt6);
                    let lNode = vis.graph.findNode(tt2);
                    vis.graph.storePrevHeight(pNode.y);
                    let newY = (pNode.y + lNode.y) / 2;
                    vis.graph.setNodePosition(tt6, pNode.x, newY);
                    vis.graph.setNodePosition(tt2, lNode.x, newY);
                },
                [A.key, R.key, tidVis],
                depth
            );
            let D = A.right;
            chunker.add('t4 = right(t2)',
                (vis, tid, tt6, tt2, tt4) => {
                    if (tt4 && tid) {
                        vis.graph.updateTID(tt4, 't4');
                    }else{
                        vis.graph.setTagInfo('t4 ');
                    }
                    let pNode = vis.graph.findNode(tt6);
                    let lNode = vis.graph.findNode(tt2);
                    // let newXp = (pNode.+lNode.y)/2;
                    // let newY = (pNode.y + lNode.y) / 2; // positions reset somewhere???
                    // vis.graph.setNodePosition(tt6, pNode.x, newY);
                    // vis.graph.setNodePosition(tt2, lNode.x, pNode.y);
                    console.log(['x-y 1', lNode.x, lNode.y]);
                    vis.graph.setPauseLayout(true);
                    // let mid = lNode.y - vis.graph.getPrevHeight();
                    vis.graph.setNodePosition(tt2, (lNode.x * 2 + pNode.x) / 3, vis.graph.getPrevHeight());
                    // vis.graph.setNodePosition(tt6, pNode.x, pNode.y);
                    // vis.graph.setNodePosition(tt6, pNode.x, pNode.y + mid);
                },
                [tidVis, R.key, A.key, D ? D.key : false],
                depth
            );

            console.log("the height of R is " + R.height);
            console.log("the height of A is " + A.height);

            console.log("delete edge between " + R.key + " and " + A.key);
            console.log("add edge between " + A.key + " and " + R.key);
            chunker.add('t2.right = t6',
                (vis, t6, t2, t4, p, rotate) => {
                    if (rotate) vis.graph.visit(t2, p);
                    vis.graph.removeEdge(t6, t2);

                    if (t4 !== null) {
                        vis.graph.removeEdge(t2, t4);
                    }

                    if (rotate) vis.graph.resetVisitAndSelect(t6, null);

                    vis.graph.addEdge(t2, t6);
                    // remove edge after layout to perform the middle step
                    if (t4 !== null) vis.graph.removeEdge(t6, t4);
                },
                [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, rotateVis],
                depth
            );

            // if (p !== null) {
            //     vis.graph.removeEdge(p, t6);
            //     vis.graph.addEdge(p, t2);
            // }

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
                (vis, tid, p, t2, t6) => {
                    if (tid) {
                        vis.graph.clearTID();
                        vis.graph.setTagInfo('');
                    }
                    if (p !== null) {
                        vis.graph.removeEdge(p, t6);
                        vis.graph.addEdge(p, t2);
                    }
                },
                [tidVis, parentNode ? parentNode.key : null, A.key, R.key],
                depth
            );

            // chunker.add('return t2',
            //     (vis, g) => {
            //         // de-freeze the depth of the tree, after finish rotation
            //         vis.graph.setPauseLayout(false);
            //         vis.graph.layoutAVL(g, true, false);
            //     },
            //     [G.key],
            //     depth
            // );
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
                (vis, tt6, tt2, tid) => {
                    if (tid) {
                        vis.graph.updateTID(tt6, 't6');
                        // if (b !== null) vis.graph.updateTID(b, 't7');
                        // if (rl !== null) vis.graph.updateTID(rl, 't1');
                    }
                    // vis.graph.removeEdge(tt2, tt6);
                    // console.log([tt2, tt6, t]);
                    let pNode = vis.graph.findNode(tt6);
                    let lNode = vis.graph.findNode(tt2);
                    vis.graph.storePrevHeight(lNode.y);
                    let newY = (pNode.y + lNode.y) / 2;
                    vis.graph.setNodePosition(tt6, pNode.x, newY);
                    vis.graph.setNodePosition(tt2, lNode.x, newY);
                },
                [A.key, R.key, tidVis],
                depth
            );
            let D = A.left;
            chunker.add('t4 = left(t6)',
                (vis, tid, tt2, tt6, tt4) => {
                    if (tt4 && tid) {
                        vis.graph.updateTID(tt4, 't4');
                    }else{
                        vis.graph.setTagInfo('t4 ');
                    }
                    let pNode = vis.graph.findNode(tt6);
                    let lNode = vis.graph.findNode(tt2);
                    // let newXp = (pNode.+lNode.y)/2;
                    // let newY = (pNode.y + lNode.y) / 2; // positions reset somewhere???
                    // vis.graph.setNodePosition(tt6, (lNode.x * 2 + pNode.x) / 3, vis.graph.getPrevHeight());
                    // vis.graph.setNodePosition(tt2, lNode.x, pNode.y);
                    console.log(['x-y 1', lNode.x, lNode.y]);
                    vis.graph.setPauseLayout(true);
                    vis.graph.setNodePosition(tt6, (pNode.x * 2 + lNode.x) / 3, vis.graph.getPrevHeight());
                    // vis.graph.setNodePosition(tt2, pNode.x+15, pNode.y);
                },
                [tidVis, R.key, A.key, D ? D.key : false],
                depth
            );

            chunker.add('t6.left = t2',
                (vis, t2, t6, t4, p, rotate) => {
                    if (rotate) vis.graph.visit(t2, p);
                    vis.graph.removeEdge(t2, t6);

                    if (t4 !== null) {
                        vis.graph.removeEdge(t6, t4);
                    }

                    if (rotate) vis.graph.resetVisitAndSelect(t2, null);

                    vis.graph.addEdge(t6, t2);
                    // remove edge after layout to perform the middle step
                    if (t4 !== null) vis.graph.removeEdge(t2, t4);
                },
                [R.key, A.key, D ? D.key : null, parentNode ? parentNode.key : null, rotateVis],
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
                (vis, tid, p, t6, t2) => {
                    if (tid) {
                        vis.graph.clearTID();
                        vis.graph.setTagInfo('');
                    }
                    if (p !== null) {
                        vis.graph.removeEdge(p, t2);
                        vis.graph.addEdge(p, t6);
                    }
                },
                [tidVis, parentNode ? parentNode.key : null, A.key, R.key],
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
            chunker.add('left(t) <- leftRotate(left(t));',
                (vis, g) => {
                    vis.graph.setPauseLayout(false);
                    vis.graph.layoutAVL(g, true, false);
                }, [(parentNode !== null) ? globalRoot.key : root.key], depth);
            chunker.add('return right rotation on t', (vis) => { }, [], depth);
            return LLR(root, parentNode, depth, true, true);
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
            chunker.add('right(t) <- rightRotate(right(t));',
                (vis, g) => {
                    vis.graph.setPauseLayout(false);
                    vis.graph.layoutAVL(g, true, false);
                }, [(parentNode !== null) ? globalRoot.key : root.key], depth);
            chunker.add('return left rotation on t', (vis) => { }, [], depth);
            return RRR(root, parentNode, depth, true, true);
        }

        // Function to insert a key into the AVL tree and balance the tree if needed
        function insert(root, key, currIndex, parentNode = null, depth = 1) {

            //console.log("the root of insert is " + root.key);

            chunker.add('AVLT_Insert(t, k)',
                (vis, k, d, index, r, p, rr) => {
                    if (d === 1) {
                        vis.array.depatch(index - 1);
                        vis.array.patch(index);
                    }
                    if (rr) {
                        vis.graph.visit(rr, p);
                    }
                    vis.graph.setFunctionName("AVLT_Insert");
                    vis.graph.setFunctionInsertText(`( ${r} , ${k} )`);
                },
                [key, depth, currIndex, root ? `...${root.key}...` : "Empty", parentNode ? parentNode.key : null, root ? root.key : null],
                depth
            );

            if (root === null) {
                chunker.add('if t = Empty', (vis) => null, [], depth);
                chunker.add('create new node',
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
                let root = new AVLNode(key);

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
                (vis) => { },
                [],
                depth
            );

            if (key < root.key) {
                // Ref insertLeft
                chunker.add('prepare for the left recursive call', (vis) => null, [], depth);
                insert(root.left, key, currIndex, root, depth + 1);
                chunker.add('left(t) <- AVLT_Insert(left(t), k)',
                    (vis, k, r) => {
                        vis.graph.setFunctionName("AVLT_Insert");
                        vis.graph.setFunctionInsertText(`( ...${r}... , ${k} )`);
                    },
                    [key, root ? root.key : "Empty"],
                    depth);
            } else if (key > root.key) {
                chunker.add('else if k > root(t).key', (vis) => null, [], depth);
                // Ref insertRight
                chunker.add('prepare for the right recursive call', (vis) => null, [], depth);
                insert(root.right, key, currIndex, root, depth + 1);
                chunker.add('right(t) <- AVLT_Insert(right(t), k)',
                    (vis, k, r) => {
                        vis.graph.setFunctionName("AVLT_Insert");
                        vis.graph.setFunctionInsertText(`( ...${r}... , ${k} )`);
                    },
                    [key, root ? `...${root.key}...` : "Empty"],
                    depth);
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

                // console.log("gr: " + globalRoot);
                // console.log("root: " + root);
                // console.log("parentNode: " + parentNode);
                chunker.add('return rightRotate(t)', (vis, g) => {
                    vis.graph.setFunctionNode(null);
                    vis.graph.clearSelect_Circle_Count();
                    vis.graph.setFunctionBalance(null);
                    vis.graph.setPauseLayout(false);
                    vis.graph.layoutAVL(g, true, false);
                }, [(parentNode !== null) ? globalRoot.key : root.key], depth);
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
                chunker.add('return leftRotate(t)', (vis, g) => {
                    vis.graph.setFunctionNode(null);
                    vis.graph.setFunctionBalance(null);
                    vis.graph.clearSelect_Circle_Count();
                    vis.graph.setPauseLayout(false);
                    vis.graph.layoutAVL(g, true, false);
                }, [(parentNode !== null) ? globalRoot.key : root.key], depth);
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
                chunker.add('return rightRotate(t) after leftRotate',
                    (vis, g) => {
                        vis.graph.setFunctionNode(null);
                        vis.graph.setFunctionBalance(null);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setPauseLayout(false);
                        vis.graph.layoutAVL(g, true, false);
                    },
                    [(parentNode !== null) ? globalRoot.key : root.key],
                    depth);
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
                chunker.add('return leftRotate(t) after rightRotate',
                    (vis, g) => {
                        vis.graph.setFunctionNode(null);
                        vis.graph.setFunctionBalance(null);
                        vis.graph.clearSelect_Circle_Count();
                        vis.graph.setPauseLayout(false);
                        vis.graph.layoutAVL(g, true, false);
                    }, [(parentNode !== null) ? globalRoot.key : root.key], depth);
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
            (vis, k, k_p) => {
                vis.graph.setFunctionName("AVLT_Insert");
                vis.graph.setFunctionInsertText(`( Empty , ${k} )`);
            },
            [nodes[0], nodes[0].parentNode],
            1
        );

        chunker.add('create new node',
            (vis, k) => {
                vis.graph.addNode(k, k, 1);
                vis.graph.layoutAVL(k, true, false);
            },
            [nodes[0]],
            1
        );

        chunker.add('return n',
            (vis) => { }, [], 1
        );

        let globalRoot = new AVLNode(nodes[0]);

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