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

        console.log('tree:', Object.keys(tree));

        let current = root;
        let parent = null;

        chunker.add('AVL_Search(t, k)');
        // chunker.add('while t not Empty', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
        chunker.add('while t not Empty');

        let ptr = tree;
        parent = current;

        while (ptr) {
            // chunker.add('n = root(t)');
            chunker.add('n = root(t)', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
            let node = current;
            chunker.add('if n.key = k');
            if (node === target) {
                chunker.add('if n.key = k', (vis, c, p) => vis.graph.leave(c, p), [node, parent]);
                chunker.add('return t', (vis, c, p) => vis.graph.select(c, p), [node, parent]);
                // for test
                console.log('success! found the target!');
                return 'success';
            }

            chunker.add('if n.key > k');
            if (target < node) {
                if (tree[node].left !== undefined) {
                    // if current node has left child
                    parent = node;
                    current = tree[node].left;
                    ptr = tree[node];
                    // chunker.add('t <- n.left', (vis, c, p) => vis.graph.visit(c, p), [node, parent]);
                    chunker.add('t <- n.left');
                } else {
                    break;
                }
            } else if (tree[node].right !== undefined) {
                // if current node has right child
                parent = node;
                current = tree[node].right;
                ptr = tree[node];
                // chunker.add('t <- n.right', (vis, c, p) => vis.graph.visit(c, p), [node, parent]);
                chunker.add('t <- n.right');
            } else {
                break;
            }
        }
        // chunker.add('return NotFound');
        // for test
        // chunker.add('return NotFound', (vis, final) => {
        //     console.log('chunker.add called');
        //     const ResultStr = 'NotFound';
        //     console.log('ResultStr:', ResultStr);
        //     console.log('vis:', vis);
        //     console.log('final:', final);
        //     vis.graph.addResult(ResultStr, final);
        //     console.log('vis.graph.addResult called');
        // }, [final]);
        console.log('root:', root);
        chunker.add('return NotFound', (vis) => vis.graph.setText('RESULT NOT FOUND'));
        console.log('fail! target not found!');
        return 'fail';
    },
};