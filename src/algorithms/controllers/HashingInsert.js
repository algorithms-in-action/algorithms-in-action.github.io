import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import { HashingExp } from '../explanations';

export default {
  explanation: HashingExp,
  initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Hash Table'),
        order: 1,
      },
    };
  },

  run(chunker, params) {
    chunker.add(
      'Insert',
      (vis, array) => {
        vis.array.set(array, 'Hashing');
      },
    );
  },
};
