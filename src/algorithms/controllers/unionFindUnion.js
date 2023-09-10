import { UFExp } from '../explanations';
// import GraphTracerRect from '../../components/DataStructures/Graph/GraphTracerRect';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

const N_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default {
  explanation: UFExp,

  initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Array View'),
        order: 0,
      },
      // insert tree here
    };
  },

  find(chunker, parentArr, n, bookmark) {
    // there is a bug here
    chunker.add(bookmark, (vis) => {
      vis.array.select(1, n - 1);
    });

    while (parentArr[n - 1] !== n) {
      // eslint-disable-next-line no-param-reassign
      n = parentArr[n - 1];
    }

    return n;
  },

  union(chunker, parentArray, x, y) {
    const root1 = this.find(chunker, parentArray, x, '2');
    const root2 = this.find(chunker, parentArray, y, '3');

    chunker.add('4', (vis) => {
      vis.array.select(1, root1 - 1);
      vis.array.select(1, root2 - 1); // is there a way to avoid -1 here?
    });

    if (root1 !== root2) {
      // eslint-disable-next-line no-param-reassign
      parentArray[root2 - 1] = root1;

      // update array
      chunker.add(
        '5',
        (vis, array) => {
          vis.array.set(array);
        },
        [[N_ARRAY, parentArray]],
      );
    }
  },

  run(chunker, params) {
    const unionOperations = params.target;

    // initialise parent array
    const parentArray = [...N_ARRAY];

    // setting up the arrays
    chunker.add(
      '1',
      (vis, array) => {
        vis.array.set(array);
      },
      [[N_ARRAY, parentArray]],
    ); // will add a third array for rank here

    // applying union operations
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < unionOperations.length; i++) {
      // eslint-disable-next-line no-undef
      this.union(chunker, parentArray, unionOperations[i][0], unionOperations[i][1]);
    }
  },
};
