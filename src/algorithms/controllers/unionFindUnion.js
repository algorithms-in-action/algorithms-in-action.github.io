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

  find(chunker, parentArr, n, name, pathCompression) {
    // chunker.add(`find(${name})`, () => {});
    // eslint-disable-next-line no-loop-func
    const n2 = n;
    chunker.add(`while parent[${name}] != ${name}`, (vis) => {
      vis.array.select(0, n2 - 1);
      vis.array.select(1, n2 - 1);
    });
    // eslint-disable-next-line eqeqeq
    while (parentArr[n - 1] != n) {
      // shorten path from n to root
      // TODO: add path compression at `${name} <- parent[${name}]`
      // console.log(pathCompression);
      if (pathCompression === true) {
        // console.log('path compression on');
      }

      // eslint-disable-next-line no-param-reassign
      n = parentArr[n - 1];
      const n3 = n;
      chunker.add(`${name} <- parent[${name}]`, () => {});
      chunker.add(`while parent[${name}] != ${name}`, (vis) => {
        vis.array.select(0, n3 - 1);
        vis.array.select(1, n3 - 1);
      });
    }
    chunker.add(`return ${name}`, (vis) => {
      // eslint-disable-next-line no-param-reassign
      vis.array.data[0][n - 1].selected1 = true;
    });
    return n;
  },

  union(chunker, parentArray, x, y, pathCompression) {
    const root1 = this.find(chunker, parentArray, x, 'n', pathCompression);
    const root2 = this.find(chunker, parentArray, y, 'm', pathCompression);

    chunker.add('if n == m', () => {});
    if (root1 === root2) {
      chunker.add('return', () => {});
      return;
    }

    // TODO: 'if rank[n] < rank[m]'
    chunker.add('if rank[n] > rank[m]', () => {});

    // TODO: 'swap(n, m)'
    chunker.add('swap(n, m)', () => {});

    // eslint-disable-next-line no-param-reassign
    parentArray[root2 - 1] = root1;
    // update array
    chunker.add('parent[n] = m', (vis, array) => {
      vis.array.set(array);
      vis.array.select(1, root1 - 1);
      vis.array.select(1, root2 - 1);
      // eslint-disable-next-line no-param-reassign
      vis.array.data[1][root1 - 1].selected3 = true;
      // eslint-disable-next-line no-param-reassign
      vis.array.data[1][root2 - 1].selected3 = true;
    },
    [[N_ARRAY, parentArray]]);

    // TODO: 'if rank[n] == rank[m]'
    chunker.add('if rank[n] == rank[m]', (vis) => {
      vis.array.deselect(1, root1 - 1);
      vis.array.deselect(1, root2 - 1);
    });

    // TODO: 'rank[m] <- rank[m] + 1'
    chunker.add('rank[m] <- rank[m] + 1', () => {});
  },

  run(chunker, params) {
    const unionOperations = params.target;

    // initialise parent array
    const parentArray = [...N_ARRAY];

    // setting up the arrays
    chunker.add('union(n, m)', (vis, array) => {
      vis.array.set(array);
    },
    [[N_ARRAY, parentArray]]); // will add a third array for rank here

    // applying union operations
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < unionOperations.length; i++) {
      // eslint-disable-next-line no-undef
      this.union(
        chunker,
        parentArray,
        unionOperations[i][0],
        unionOperations[i][1],
        params.target.name,
      );
    }
  },
};
