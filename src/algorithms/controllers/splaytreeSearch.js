/**
 * Splay Tree Search controller.
 *
 * This controller uses the pure `SplayTree` data-structure (no visual code)
 * to perform a splay on the accessed key and then updates the visualiser
 * to reflect the new tree (accessed node moved to root).
 */

import cloneDeep from 'lodash/cloneDeep';
import SplayTree from './splaytree';
import { fromFlatTree } from './helpers/treeUtils';
import { createTreeInsertionController } from './InsertionSharedCode';

const controller = createTreeInsertionController('splay');

export default {
    initVisualisers({ visualiser }) {
        const graph = cloneDeep(visualiser.graph.instance);
        graph.clear();
        return {
            graph: {
                instance: graph,
                order: 0,
            },
        };
    },

    run(chunker, { visualiser, target }) {
        const graph = visualiser.graph.instance;
        const flatTree = graph.getTree();

        const root = controller.run(chunker, {
            operations: [{ type: 'search', value: target }],
            initialRoot: fromFlatTree(graph.getRoot(), flatTree, SplayTree.newNode),
            mode: 'search',
        });

        return root && root.key === target ? 'success' : 'fail';
    },
};
