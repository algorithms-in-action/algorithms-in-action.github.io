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
        let visitedList = [null];
        // num -> { height: num, left: num, right: num, parent: num }
        const tree = {};
        const root = nodes[0];
        tree[root] = {
            height: 1,
            left: null,
            right: null,
            parent: null,
        };

        // Helper functions for AVL tree
        const height = (node) => (node ? tree[node].height : 0);
        const updateHeight = (node) => {
            if (node) {
                chunker.add('c.height <- max(Height(c.left), Height(c.right)) + 1');
                tree[node].height = 1 + Math.max(height(tree[node].left), height(tree[node].right));
            }
        };
        const balanceFactor = (node) => {
            chunker.add('balance <- Height(c.left) - Height(c.right)');
            return node ? height(tree[node].left) - height(tree[node].right) : 0;
        };

        const rotateRight = (y) => {
            const x = tree[y].left;
            const T2 = tree[x].right;

            tree[x].right = y;
            tree[y].left = T2;

            updateHeight(y);
            updateHeight(x);

            return x;
        };

        const rotateLeft = (x) => {
            const y = tree[x].right;
            const T2 = tree[y].left;

            tree[y].left = x;
            tree[x].right = T2;

            updateHeight(x);
            updateHeight(y);

            return y;
        };

        const balance = (node) => {
            updateHeight(node);
            const balance = balanceFactor(node);
            if (balance > 1) {
                chunker.add('if balance > 1');
                if (balanceFactor(tree[node].left) < 0) {
                    chunker.add('Left Right Case');
                    chunker.add('Left Right left rotation');
                    tree[node].left = rotateLeft(tree[node].left);
                    chunker.add('Left Right right rotation');
                    return rotateRight(node);
                } else {
                    chunker.add('Left Left Case');
                    chunker.add('Left Left right rotation');
                    return rotateRight(node);
                }
            }
            if (balance < -1) {
                chunker.add('else if balance < -1');
                if (balanceFactor(tree[node].right) > 0) {
                    chunker.add('Right Left Case');
                    chunker.add('Right Left right rotation');
                    tree[node].right = rotateRight(tree[node].right);
                    chunker.add('Right Left left rotation');
                    return rotateLeft(node);
                } else {
                    chunker.add('Right Right Case');
                    chunker.add('Right Right left rotation');
                    return rotateLeft(node);
                }
            }
            return node;
        };

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
            // get into Traverse part
            chunker.add('p <- Empty');
            // chunker.add(
            //     'c <- t',
            //     (vis, index, visited) => {
            //         vis.array.deselect(index - 1);
            //         vis.array.select(index);
            //         for (let j = 1; j < visited.length; j++) {
            //             vis.graph.leave(visited[j], visited[j - 1]);
            //         }
            //         if (nodes[index - 1] !== visited[visited.length - 1]) {
            //             vis.graph.deselect(nodes[index - 1], visited[visited.length - 1]);
            //         }
            //     },
            //     [i, visitedList],
            // );
            visitedList = [null];
            const element = nodes[i];
            chunker.add('repeat_1');
            let parent = null;
            let current = root;
            while (current) {
                visitedList.push(parent);
                if (element < current) {
                    chunker.add('if k < c.key');
                    chunker.add('p <- c if k < c.key');
                    parent = current;
                    chunker.add('c <- c.left if k < c.key');
                    current = tree[current].left;
                } else if (element > parent) {
                    chunker.add('else if k > c.key');
                    chunker.add('p <- c if k > c.key');
                    parent = current;
                    chunker.add('c <- c.right if k > c.key');
                    current = tree[current].right;
                } else {
                    // Duplicate keys NOT ALLOWED!
                    chunker.add('Exit the function without inserting the duplicate');
                    break;
                }
            }
            // loop ends
            chunker.add('until c is Empty (and p is a leaf node)');

            // insert n as p's child, p = parent
            if (element < parent) {
                // insert n as p's left child
                chunker.add('if k < p.key');
                tree[parent].left = element;
                tree[element] = {
                    height: 1,
                    left: null,
                    right: null,
                    parent: parent,
                };
                // chunker.add(
                //     'p.left <- a new node containing k and height 1',
                //     (vis, e, p) => {
                //         vis.graph.addNode(e);
                //         vis.graph.addEdge(p, e);
                //         vis.graph.select(e, p);
                //     },
                //     [element, parent],
                // );
            } else {
                // insert n as p's right child
                chunker.add('else: k > p.key');
                tree[parent].right = element;
                tree[element] = {
                    height: 1,
                    left: null,
                    right: null,
                    parent: parent,
                };
                // chunker.add(
                //     'p.right <- a new node containing k and height 1',
                //     (vis, e, p) => {
                //         vis.graph.addNode(e);
                //         vis.graph.addEdge(p, e);
                //         vis.graph.select(e, p);
                //     },
                //     [element, parent],
                // );
            }
            // Balance the tree
            current = parent;
            chunker.add('c <- p back up');
            chunker.add('repeat_2');
            while (current !== null) {
                current = balance(current);
                current = tree[current].parent;
            }
        }
        console.log(tree);
        return tree;
    }
};