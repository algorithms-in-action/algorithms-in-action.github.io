import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import { HashingExp } from '../explanations';


const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const arr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
        vis.array.hideArrayAtIndex(null);
      },
      [[arr1, arr2]]
    );

    return "Success";
  },
};
