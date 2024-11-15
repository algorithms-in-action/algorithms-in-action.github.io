/**
 * This file contains the AVL Tree Search algorithm,
 * alongside the visualisation code.
 *
 * The AVL Tree Search algorithm is used to find a node.
 * 
 * The search algorithm is based on the tree created by the insertion algorithm. 
 * By accessing the visualized AVL tree, it retrieves the complete tree structure. 
 * The input is a node to be searched for, and the algorithm starts from the root, 
 * traversing down to the child nodes to find the target node.
 */

export default {
    /**
         * For the search algorithm, we use the tree that is created in
         * the insertion algorithm to initialise the visualiser
         * @param {object} visualiser
         */
    initVisualisers({ visualiser }) {
        // clear existing trace, if any
        visualiser.graph.instance.clear();
        return {
            graph: {
                instance: visualiser.graph.instance,
                order: 0,
            },
        };
    },

    /**
     * We use the tree that is created in the insertion algorithm to search
     * @param {object} chunker
     * @param {object} visualiser
     * @param {number} target
     */
    run(chunker, { visualiser, target }) {
        // get whole tree
        const tree = visualiser.graph.instance.getTree();
        let root = visualiser.graph.instance.getRoot();

        let current = root;
        let parent = null;

        chunker.add('AVL_Search(t, k)', (vis) => {
            vis.graph.setFunctionInsertText(" (" + target + ") ");
            vis.graph.setFunctionName("AVL_Search");
        });
        chunker.add('while t not Empty');

        let ptr = tree;
        parent = current;

        while (ptr) {

            chunker.add('n = root(t)', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
            let node = current;
            chunker.add('if n.key = k');
            if (node === target) {
                chunker.add('if n.key = k', (vis, c, p) => vis.graph.leave(c, p), [node, parent]);
                chunker.add('return t', (vis, c, p) => vis.graph.select(c, p), [node, parent]);
                return 'success';
            }

            chunker.add('if n.key > k');
            if (target < node) {
                if (tree[node].left !== undefined) {
                    // if current node has left child
                    parent = node;
                    current = tree[node].left;
                    ptr = tree[node];

                    chunker.add('t <- n.left');
                } else {
                    break;
                }
            } else if (tree[node].right !== undefined) {
                // if current node has right child
                parent = node;
                current = tree[node].right;
                ptr = tree[node];

                chunker.add('t <- n.right');
            } else {
                break;
            }
        }

        chunker.add('return NotFound', (vis) => vis.graph.setText('RESULT NOT FOUND'));
        return 'fail';
    },
};