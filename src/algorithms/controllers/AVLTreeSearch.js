/**
 * This file contains the AVL Tree Search algorithm,
 * alongside the visualisation code.
 *
 * XXX needs a bunch more fixes. Best ignore height and balance, highlight
 * nodes at the right points (done), improve display of t if possible,...
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

        chunker.add('AVL_Search(t, k)', (vis, c, p) => {
            vis.graph.setZoom(0.55);
            // Remove all the recursion rectangles first
            vis.graph.popAllRectStack();
            vis.graph.setFunctionInsertText("(t, " + target + ")");
            vis.graph.setFunctionName("AVL_Search");
            vis.graph.visit(c, p);
        }, [current, parent]);
        if (!tree)
            chunker.add('while t not Empty');

        let ptr = tree;
        parent = current;

        /* eslint-disable no-constant-condition */
        while (true) {
            chunker.add('while t not Empty');

            if (current === undefined || !ptr) // should use null
                break;

            let node = current;
            chunker.add('if n.key = k');
            if (node === target) {
                chunker.add('return t', (vis, c, p) => {
                    vis.graph.leave(c, p);
                    vis.graph.select(c, p);
                    vis.graph.setText('Key found');
                }, [node, parent]);
                return 'success';
            }

            chunker.add('if n.key > k');
            if (target < node) {
                parent = node;
                current = tree[node].left;
                ptr = tree[node];
                if (current !== undefined) {

                    chunker.add('t <- n.left', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
                } else {
                    chunker.add('t <- n.left', (vis) => vis.graph.setText('t = Empty'));
                }
            } else {
                parent = node;
                current = tree[node].right;
                ptr = tree[node];
                // if current node has right child
                if (current !== undefined) {
                    chunker.add('t <- n.right', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
                } else {
                    chunker.add('t <- n.right', (vis) => vis.graph.setText('t = Empty'));
                }
            }
        }

        chunker.add('return NotFound', (vis) => vis.graph.setText('Key not found'));
        return 'fail';
    },
};

