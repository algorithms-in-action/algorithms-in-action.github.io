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
                this.par = null;
                this.height = 1;
            }
        }

        // Function to update the height of a node based on its children's heights
        function updateHeight(root) {
            if (root !== null) {
                const leftHeight = (root.left !== null) ? root.left.height : 0;
                const rightHeight = (root.right !== null) ? root.right.height : 0;
                root.height = Math.max(leftHeight, rightHeight) + 1;
            }
        }

        // Left-Left Rotation (LLR) to balance the AVL tree
        function LLR(root) {
            const tmpnode = root.left;
            root.left = tmpnode.right;
            if (tmpnode.right !== null) {
                tmpnode.right.par = root;
            }
            tmpnode.right = root;
            tmpnode.par = root.par;
            root.par = tmpnode;
            if (tmpnode.par !== null) {
                if (root.key < tmpnode.par.key) {
                    tmpnode.par.left = tmpnode;
                } else {
                    tmpnode.par.right = tmpnode;
                }
            }
            updateHeight(root);
            updateHeight(tmpnode);
            return tmpnode;
        }

        // Right-Right Rotation (RRR) to balance the AVL tree
        function RRR(root) {
            const tmpnode = root.right;
            root.right = tmpnode.left;
            if (tmpnode.left !== null) {
                tmpnode.left.par = root;
            }
            tmpnode.left = root;
            tmpnode.par = root.par;
            root.par = tmpnode;
            if (tmpnode.par !== null) {
                if (root.key < tmpnode.par.key) {
                    tmpnode.par.left = tmpnode;
                } else {
                    tmpnode.par.right = tmpnode;
                }
            }
            updateHeight(root);
            updateHeight(tmpnode);
            return tmpnode;
        }

        // Left-Right Rotation (LRR) to balance the AVL tree
        function LRR(root) {
            root.left = RRR(root.left);
            return LLR(root);
        }

        // Right-Left Rotation (RLR) to balance the AVL tree
        function RLR(root) {
            root.right = LLR(root.right);
            return RRR(root);
        }

        // Function to insert a key into the AVL tree and balance the tree if needed
        function insert(root, key) {
            chunker.add('p <- Empty');
            let parentNode = null;
            chunker.add('c <- t');
            let currentNode = root;
            let newNode = new AVLNode(key);

            chunker.add('repeat_1');
            while (currentNode) {
                parentNode = currentNode;

                if (key < currentNode.key) {
                    chunker.add('if k < c.key');
                    chunker.add('p <- c if k < c.key');
                    chunker.add('c <- c.left if k < c.key');
                    currentNode = currentNode.left;
                } else if (key > currentNode.key) {
                    chunker.add('else if k > c.key');
                    chunker.add('p <- c if k > c.key');
                    chunker.add('c <- c.right if k > c.key');
                    currentNode = currentNode.right;
                } else {
                    // Key already exists in the tree
                    chunker.add('else k == c.key');
                    chunker.add('Exit the function without inserting the duplicate');
                    return root;
                }
            }

            chunker.add('until c is Empty (and p is a leaf node)');

            if (key < parentNode.key) {
                chunker.add('if k < p.key');
                chunker.add('p.left <- a new node containing k and height 1');
                parentNode.left = newNode;
            } else {
                chunker.add('else: k > p.key');
                chunker.add('p.right <- a new node containing k and height 1');
                parentNode.right = newNode;
            }

            newNode.par = parentNode;
            chunker.add('c <- p back up');
            chunker.add('repeat_2');
            // Update heights and balance the tree if needed
            while (parentNode !== null) {
                chunker.add('c.height <- max(Height(c.left), Height(c.right)) + 1');
                updateHeight(parentNode);

                const leftHeight = (parentNode.left !== null) ? parentNode.left.height : 0;
                const rightHeight = (parentNode.right !== null) ? parentNode.right.height : 0;

                chunker.add('balance <- Height(c.left) - Height(c.right)');

                if (Math.abs(leftHeight - rightHeight) === 2) {
                    if (key < parentNode.key) {
                        chunker.add('if balance > 1');
                        if (key < parentNode.left.key) {
                            chunker.add('Left Left Case');
                            parentNode = LLR(parentNode);
                        } else {
                            chunker.add('Left Right Case');
                            parentNode = LRR(parentNode);
                        }
                    } else {
                        chunker.add('else if balance < -1');
                        if (key < parentNode.right.key) {
                            chunker.add('Right Left Case');
                            parentNode = RLR(parentNode);
                        } else {
                            chunker.add('Right Right Case');
                            parentNode = RRR(parentNode);
                        }
                    }
                }

                if (currentNode === root) {
                    chunker.add('if c = t');
                    chunker.add('return t');
                    return parentNode;
                }

                chunker.add('c <- Parent of c');
                newNode = parentNode;
                parentNode = parentNode.par;
            }

            chunker.add('until c is Empty');

            return newNode;
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
        let root = new AVLNode(nodes[0]);

        // new node containing k and height 1
        chunker.add(
            't <- a new node containing k and height 1',
            (vis, r) => {
                vis.graph.addNode(r);
                vis.graph.layoutBST(r, true);
                vis.graph.select(r, null);
            },
            [root.key],
        );

        for (let i = 1; i < nodes.length; i++) {
            chunker.add('else: AVL_Insert(t, k)');
            root = insert(root, nodes[i]);
        }

        console.log(root);
        return root;
    }
};