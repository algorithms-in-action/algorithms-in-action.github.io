import { TTFExp } from '../explanations';
import NTreeTracer from '../../components/DataStructures/Graph/NAryTreeTracer/NTreeTracer';

export default {
  explanation: TTFExp,

  initVisualisers({ visualiser }) {

    return {
      tree: {
        instance: visualiser.tree.instance,
        order: 0,
      },
    };
  },

  run(chunker, { visualiser, target }) {
    chunker.add('T234_Search(t, k)', (vis) => {
      console.log(vis.tree.realNodes);
      vis.tree.layout();
    });

  },
};
