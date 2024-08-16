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
        // const tree = {
        //     8: {},
        //     30: { left: 8, right: 53 },
        //     53: {},
        //     59: { left: 30, right: 72 },
        //     62: {},
        //     72: { left: 62, right: 73 },
        //     73: { right: 97 },
        //     85: {},
        //     97: { left: 85 },
        // };

        // get the first
        const root = visualiser.graph.instance.getRoot();
        // const root = 59;
        // get the target
        const item = target;

        console.log('test of visualiser', visualiser.graph);
        console.log('tree', tree);
        console.log('root', root);
        console.log('item', item);

        let current = root;
        let parent = null;

        // chunker.add('AVL_Search(t, k)');
        chunker.add('while t not Empty', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
        chunker.add('while t not Empty');
        let ptr = tree;
        parent = current;

        while (ptr) {
            console.log('current', current);
            chunker.add('if t.key = k');
            if (current === item) {
                chunker.add('if t.key = k', (vis, c, p) => vis.graph.leave(c, p), [current, parent]);
                chunker.add('return t', (vis, c, p) => vis.graph.select(c, p), [current, parent]);
                // chunker.add('if t.key = k');
                // chunker.add('return t');
                // for test
                console.log('success! found the target!');
                return 'success';
            }

            chunker.add('if t.key > k');
            if (item < current) {
                if (tree[current].left !== undefined) {
                    // if current node has left child
                    parent = current;
                    current = tree[current].left;
                    ptr = tree[current];
                    chunker.add('t <- t.left', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
                    // chunker.add('t <- t.left');
                } else {
                    break;
                }
            } else if (tree[current].right !== undefined) {
                // if current node has right child
                parent = current;
                current = tree[current].right;
                ptr = tree[current];
                chunker.add('t <- t.right', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
                // chunker.add('t <- t.right');
            } else {
                break;
            }
        }
        chunker.add('return NotFound');
        // for test
        chunker.add('return NotFound', (vis) => vis.graph.setText('RESULT NOT FOUND'));
        // chunker.add('return NotFound');
        console.log('fail! target not found!');
        return 'fail';
    },
};