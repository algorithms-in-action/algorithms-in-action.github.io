import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import { HashingExp } from '../explanations';

export default {
  explanation: HashingExp,
  initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Hash Table'),
        order: 0,
      },
    };
  },

  run(chunker) {
    chunker.add(
      'HashInit(T)',
      (vis, array) => {
        vis.array.set(array, 'HashingLP');
        vis.array.hideArrayAtIndex(2);
      },
      [[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]]
    );

    return "Success";
  },
};
