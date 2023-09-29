import { TTFExp } from '../explanations';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';


export default {
    explanation: TTFExp,
  
    initVisualisers() {
      return {
        tree: {
          instance: new NTreeTracer('n-tree', null, 'Tree View'),
          order: 0,
        },
      };
    },

    run(chunker, { nodes }) {
      if (nodes.length === 0) return;
  
      chunker.add(
        '1',
        (vis, elements) => {
          vis.tree.set(elements);
        },
        [nodes],
      );
      },
};