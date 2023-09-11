/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { UFExp } from '../explanations';
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
      // TODO: insert tree here
    };
  },

  /**
   * Populate the chunker with 'while parent[n] != n' or 'while parent[m] != m'.
   * Return true if the number is not at the root, false otherwise.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Array} parentArr The parent array.
   * @param {Number} n The number to find.
   * @param {String} name The variable name of the number to find.
   * @returns {Boolean} Whether the number is not at the root.
   */
  notAtRoot(chunker, parentArr, n, name) {
    chunker.add(`while parent[${name}] != ${name}`, (vis) => {
      vis.array.select(0, n - 1);
    });
    chunker.add(`while parent[${name}] != ${name}`, (vis) => {
      vis.array.select(1, n - 1);
    });
    if (parentArr[n - 1] != n) {
      return true;
    }
    return false;
  },

  /**
   * Populate the chunker with the steps required to do a find operation.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Array} parentArr The parent array.
   * @param {Number} n The number to find.
   * @param {String} name The variable name of the number to find.
   * @param {Boolean} pathCompression Whether to use path compression.
   */
  find(chunker, parentArr, n, name, pathCompression) {
    // 'while parent[n] != n' or 'while parent[m] != m'
    while (this.notAtRoot(chunker, parentArr, n, name)) {
      const nTempPrev = n;

      // TODO: `${name} <- parent[${name}]` (path compression)
      if (pathCompression === true) {
        // console.log('path compression on');
      }

      // 'n <- parent[n]' or 'm <- parent[m]'
      n = parentArr[n - 1];
      const nTemp = n;
      chunker.add(`${name} <- parent[${name}]`, (vis) => {
        vis.array.data[0][nTempPrev - 1].selected2 = true;
        vis.array.data[1][nTempPrev - 1].selected2 = true;
        vis.array.select(0, nTemp - 1);
      });
    }

    // 'return n' or 'return m'
    chunker.add(`return ${name}`, (vis) => {
      vis.array.data[0][n - 1].selected1 = true;
      vis.array.data[1][n - 1].selected1 = true;
    });
    return n;
  },

  /**
   * Populate the chunker with the steps required to do a union operation.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Array} parentArr The parent array.
   * @param {Number} n The first number to union.
   * @param {Number} m The second number to union.
   * @param {Boolean} pathCompression Whether to use path compression.
   */
  union(chunker, parentArr, n, m, pathCompression) {
    // 'n <- find(n)' and 'm <- find(m)'
    const root1 = this.find(chunker, parentArr, n, 'n', pathCompression);
    const root2 = this.find(chunker, parentArr, m, 'm', pathCompression);

    // 'if n == m'
    chunker.add('if n == m', () => {});
    if (root1 === root2) {
      chunker.add('return', () => {});
      return;
    }

    // TODO: 'if rank[n] < rank[m]'
    chunker.add('if rank[n] > rank[m]', () => {});

    // TODO: 'swap(n, m)'
    chunker.add('swap(n, m)', () => {});

    // 'parent[n] = m'
    parentArr[root2 - 1] = root1;
    chunker.add('parent[n] = m', (vis, array) => {
      vis.array.set(array);
      vis.array.data[1][root1 - 1].selected1 = true;
      vis.array.data[1][root2 - 1].selected1 = true;
    }, [[N_ARRAY, parentArr]]);

    // TODO: 'if rank[n] == rank[m]'
    chunker.add('if rank[n] == rank[m]', (vis) => {
      vis.array.deselect(1, root1 - 1);
      vis.array.deselect(1, root2 - 1);
    });

    // TODO: 'rank[m] <- rank[m] + 1'
    chunker.add('rank[m] <- rank[m] + 1', () => {});
  },

  /**
   * Run the algorithm, populating the chunker with the set of union
   * steps.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Object} params The parameters for the algorithm.
   * @param {Array} params.target The set of union operations to perform.
   * @param {Boolean} params.pathCompression Whether to use path compression.
   */
  run(chunker, params) {
    const unionOperations = params.target;

    // setting up the arrays
    const parentArr = [...N_ARRAY];
    chunker.add('union(n, m)', (vis, array) => {
      vis.array.set(array);
    }, [[N_ARRAY, parentArr]]); // TODO: will add a third array for rank here

    // applying union operations
    for (let i = 0; i < unionOperations.length; i++) {
      this.union(
        chunker,
        parentArr,
        unionOperations[i][0],
        unionOperations[i][1],
        params.pathCompression,
      );
    }
  },
};
