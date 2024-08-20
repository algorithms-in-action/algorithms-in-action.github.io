import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import { node } from 'prop-types';
import { chunk } from 'lodash';

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

        // class AVLNode {
        //     constructor(key) {
        //         this.key = key;
        //         this.left = null;
        //         this.right = null;
        //         this.par = null;
        //         this.height = 1;
        //     }
        // }

        const tree = {};

        // Function to update the height of a node based on its children's heights
        function updateHeight(root) {
            if (root !== null) {
                const leftHeight = (tree[root].left !== null) ? tree[tree[root].left].height : 0;
                const rightHeight = (tree[root].right !== null) ? tree[tree[root].right].height : 0;
                tree[root].height = Math.max(leftHeight, rightHeight) + 1;
            }
        }

        // Left-Left Rotation (LLR) to balance the AVL tree
        function LLR(root, globalRoot) {

            console.log('LLR');
            console.log("the root of LLR is " + root);

            let R = root;
            let A = tree[root].left;
            let D = tree[A].right;
            let P = tree[root].par;

            let G = null;
            if(tree[root].par !== null){
                G = globalRoot
            }else{
                G = A;
            }

            console.log("delete edge between " + R + " and " + A);
            console.log("add edge between " + A + " and " + R);
            chunker.add('p <- Empty',
                (vis, r, a, d, p, g) => {
                    if (p !== null) {
                        vis.graph.removeEdge(p, r);
                        vis.graph.addEdge(p, a);
                    }

                    if (d !== null) {
                        vis.graph.removeEdge(a, d);
                        vis.graph.addEdge(r, d);
                    }
                    vis.graph.removeEdge(r, a);
                    vis.graph.addEdge(a, r);
                    vis.graph.layoutBST(g, true);
                },
                [R, A, D, P, G]
            );

            const tmpnode = tree[root].left;
            tree[root].left = tree[tmpnode].right;
            if (tree[tmpnode].right !== null) {
                tree[tree[tmpnode].right].par = root;
            }
            tree[tmpnode].right = root;
            tree[tmpnode].par = tree[root].par;
            tree[root].par = tmpnode;
            if (tree[tmpnode].par !== null) {
                if (root < tree[tmpnode].par) {
                    tree[tree[tmpnode].par].left = tmpnode;
                } else {
                    tree[tree[tmpnode].par].right = tmpnode;
                }
            }
            updateHeight(root);
            updateHeight(tmpnode);
            return tmpnode;
        }

        // Right-Right Rotation (RRR) to balance the AVL tree
        function RRR(root, globalRoot) {
            console.log('RRR');
            console.log("the root of RRR is " + root);

            let R = root;
            let A = tree[root].right;
            let D = tree[A].left;
            let P = tree[root].par;
            let G = null;
            if(tree[root].par !== null){
                G = globalRoot
            }else{
                G = A;
            }
            chunker.add('p <- Empty',
                (vis, r, a, d, p, g) => {
                    if (p !== null) {
                        vis.graph.removeEdge(p, r);
                        vis.graph.addEdge(p, a);
                    }
                    if (d !== null) {
                        vis.graph.removeEdge(a, d);
                        vis.graph.addEdge(r, d);
                    }
                    vis.graph.removeEdge(r, a);
                    vis.graph.addEdge(a, r);
                    vis.graph.layoutBST(g, true);
                },
                [R, A, D, P, G]
            );

            const tmpnode = tree[root].right;
            tree[root].right = tree[tmpnode].left;
            if (tree[tmpnode].left !== null) {
                tree[tree[tmpnode].left].par = root;
            }
            tree[tmpnode].left = root;
            tree[tmpnode].par = tree[root].par;
            tree[root].par = tmpnode;
            if (tree[tmpnode].par !== null) {
                if (root < tree[tmpnode].par) {
                    tree[tree[tmpnode].par].left = tmpnode;
                } else {
                    tree[tree[tmpnode].par].right = tmpnode;
                }
            }
            updateHeight(root);
            updateHeight(tmpnode);
            return tmpnode;
        }

        // Left-Right Rotation (LRR) to balance the AVL tree
        function LRR(root, globalRoot) {
            tree[root].left = RRR(tree[root].left, globalRoot);
            return LLR(root, globalRoot);
        }

        // Right-Left Rotation (RLR) to balance the AVL tree
        function RLR(root, globalRoot) {
            tree[root].right = LLR(tree[root].right, globalRoot);
            return RRR(root, globalRoot);
        }

        // Function to insert a key into the AVL tree and balance the tree if needed
        function insert(root, key, currIndex) {
            // console.log(tree);
            chunker.add('p <- Empty');
            let parentNode = null;
            chunker.add('c <- t');
            let currentNode = root;
            // let newNode = new AVLNode(key);
            let newNode = { left: null, right: null, par: null, height: 1 };

            chunker.add('repeat_1');
            while (currentNode) {
                parentNode = currentNode;

                if (key < currentNode) {
                    chunker.add('if k < c.key');
                    chunker.add('p <- c if k < c.key');
                    chunker.add(
                        'c <- c.left if k < c.key',
                        (vis, r) => {
                            vis.graph.select(r, null);
                        },
                        [currentNode],
                    );
                    // chunker.add('c <- c.left if k < c.key');
                    currentNode = tree[currentNode].left;
                } else if (key > currentNode) {
                    chunker.add('else if k > c.key');
                    chunker.add('p <- c if k > c.key');
                    chunker.add(
                        'c <- c.right if k > c.key',
                        (vis, r) => {
                            vis.graph.select(r, null);
                        },
                        [currentNode],
                    );
                    // chunker.add('c <- c.right if k > c.key');
                    currentNode = tree[currentNode].right;
                } else {
                    // Key already exists in the tree
                    chunker.add('else k == c.key');
                    chunker.add('Exit the function without inserting the duplicate');
                    return root;
                }
            }
            tree[key] = newNode;

            chunker.add('until c is Empty (and p is a leaf node)');

            if (key < parentNode) {
                chunker.add('if k < p.key');
                // chunker.add('p.left <- a new node containing k and height 1');
                chunker.add(
                    'p.left <- a new node containing k and height 1',
                    (vis, e, p, index) => {
                        // Upper array visulization
                        vis.array.deselect(index - 1);
                        vis.array.select(index);

                        // // Lower graph visualization
                        // for (let j = 1; j < visited.length; j++) {
                        //     vis.graph.leave(visited[j], visited[j - 1]);
                        // }
                        // if (nodes[index - 1] !== visited[visited.length - 1]) {
                        // vis.graph.deselect(nodes[index - 1], visited[visited.length - 1]);
                        // }

                        vis.graph.addNode(e);
                        vis.graph.addEdge(p, e);
                        // vis.graph.select(e, p);
                    },
                    [key, parentNode, currIndex],
                );
                tree[parentNode].left = key;
            } else {
                chunker.add('else: k > p.key');
                // chunker.add('p.right <- a new node containing k and height 1');
                chunker.add(
                    'p.right <- a new node containing k and height 1',
                    (vis, e, p, index) => {
                        // Upper array visulization
                        vis.array.deselect(index - 1);
                        vis.array.select(index);

                        vis.graph.addNode(e);
                        vis.graph.addEdge(p, e);
                        // vis.graph.select(e, p);
                    },
                    [key, parentNode, currIndex],
                );
                tree[parentNode].right = key;
            }

            tree[key].par = parentNode;
            chunker.add('c <- p back up');
            chunker.add('repeat_2');
            // Update heights and balance the tree if needed
            // console.log("Before balance");
            // console.log(tree);
            while (parentNode !== null) {
                chunker.add('c.height <- max(Height(c.left), Height(c.right)) + 1');
                updateHeight(parentNode);

                const leftHeight = (tree[parentNode].left !== null) ? tree[tree[parentNode].left].height : 0;
                const rightHeight = (tree[parentNode].right !== null) ? tree[tree[parentNode].right].height : 0;

                chunker.add('balance <- Height(c.left) - Height(c.right)');
                // console.log(key, parentNode, tree[parentNode].left);
                if (Math.abs(leftHeight - rightHeight) === 2) {
                    if (key < parentNode) {
                        chunker.add('if balance > 1');
                        if (key < tree[parentNode].left) {
                            chunker.add('Left Left Case');
                            // console.log("LLR");
                            parentNode = LLR(parentNode, root);
                        } else {
                            chunker.add('Left Right Case');
                            // console.log("LRR");
                            parentNode = LRR(parentNode, root);
                        }
                    } else {
                        chunker.add('else if balance < -1');
                        if (key < tree[parentNode].right) {
                            chunker.add('Right Left Case');
                            // console.log("RLR");
                            parentNode = RLR(parentNode, root);
                        } else {
                            chunker.add('Right Right Case');
                            // console.log("RRR");
                            parentNode = RRR(parentNode, root);
                        }
                    }
                }

                if (currentNode === root) {
                    chunker.add('if c = t');
                    chunker.add('return t');
                    return parentNode;
                }

                chunker.add('c <- Parent of c');
                currentNode = parentNode;
                parentNode = tree[parentNode].par;
            }

            chunker.add('until c is Empty');

            return currentNode;
        }

        // Populate the ArrayTracer using nodes
        chunker.add(
            'if t = Empty',
            (vis, elements) => {
                vis.array.set(elements);
            },
            [nodes],
        );
        chunker.add('if t = Empty', (vis) => {
            vis.array.select(0);
        });

        // Initialize the AVL tree with the first key
        // let root = new AVLNode(nodes[0]);
        let root = nodes[0];
        tree[root] = { left: null, right: null, par: null, height: 1 };

        // new node containing k and height 1
        chunker.add(
            't <- a new node containing k and height 1',
            (vis, r) => {
                vis.graph.addNode(r);
                vis.graph.layoutBST(r, true);
                vis.graph.select(r, null);
            },
            [root],
        );

        for (let i = 1; i < nodes.length; i++) {
            chunker.add('else: AVL_Insert(t, k)');
            root = insert(root, nodes[i], i);
        }

        return tree;
    }
};