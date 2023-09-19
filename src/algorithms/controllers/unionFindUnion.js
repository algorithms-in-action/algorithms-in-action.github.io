/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { UFExp } from '../explanations';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

const N_ARRAY = ["n", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
      vis.array.select(0, n, undefined, undefined, '4');
    });
    chunker.add(`while parent[${name}] != ${name}`, (vis) => {
      vis.array.select(1, n, undefined, undefined, '4');

    });
    if (parentArr[n] != n) {
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
    chunker.add(`while parent[${name}] != ${name}`, () => {
    });
    while (this.notAtRoot(chunker, parentArr, n, name)) {
      const nTempPrev = n;
      chunker.add(`while parent[${name}] != ${name}`, (vis) => {
        vis.array.deselect(0, nTempPrev);
        vis.array.deselect(1, nTempPrev);
        vis.array.select(0, nTempPrev, undefined, undefined, '5');
        vis.array.select(1, nTempPrev, undefined, undefined, '5');

      });

      // TODO: `${name} <- parent[${name}]` (path compression)
      if (pathCompression === true) {
        // console.log('path compression on');
      }

      // 'n <- parent[n]' or 'm <- parent[m]'
      n = parentArr[n];
      const nTemp = n;
      chunker.add(`${name} <- parent[${name}]`, (vis) => {
        vis.array.deselect(0, nTempPrev);
        vis.array.deselect(1, nTempPrev);
        vis.array.select(1, nTempPrev, undefined, undefined, '4');
      });
    }

    // 'return n' or 'return m'
    chunker.add(`return ${name}`, (vis) => {
      vis.array.deselect(0, n);
      vis.array.deselect(1, n);
      vis.array.select(0, n, undefined, undefined, '1');
      vis.array.select(1, n, undefined, undefined, '1');

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
  union(chunker, parentArr, rankArr, n, m, pathCompression) {
    // For rendering the current union caption. 
    chunker.add('union(n, m)', (vis, array) => {
      vis.array.set(array, 'unionFind', ' ');
      vis.array.showKth(`${n} UNION ${m}`);
    }, [[N_ARRAY, parentArr, rankArr]]); // TODO: will add a third array for rank here

    // 'n <- find(n)' and 'm <- find(m)'
    let root1 = this.find(chunker, parentArr, n, 'n', pathCompression);
    let root2 = this.find(chunker, parentArr, m, 'm', pathCompression);
    
    // 'if n == m'
    chunker.add('if n == m', () => {});
    if (root1 === root2) {
      chunker.add('return', () => {});
      return;
    }

    // 'if rank[n] > rank[m]'
    chunker.add('if rank[n] > rank[m]', () => {});
    if (rankArr[root1] > rankArr[root2]) {
      // 'swap(n, m)'
      chunker.add('swap(n, m)', () => {});
      const tempRoot1 = root1;
      root1 = root2;
      root2 = tempRoot1;
    }

    // 'parent[n] = m'
    parentArr[root1] = root2;
    chunker.add('parent[n] = m', (vis, array) => {

      vis.array.set(array, 'unionFind', ' ');
      vis.array.showKth(`${n} UNION ${m}`);
      vis.array.data[1][root1].selected1 = true;
      vis.array.data[1][root2].selected1 = true;
    }, [[N_ARRAY, parentArr, rankArr]]);
    
    // 'if rank[n] == rank[m]'
    chunker.add('if rank[n] == rank[m]', (vis) => {
      vis.array.deselect(1, root1);
      vis.array.deselect(1, root2);
      vis.array.data[2][root1].selected = true;
      vis.array.data[2][root2].selected = true;
    });
    if (rankArr[root1] == rankArr[root2]) {
      // 'rank[m] <- rank[m] + 1'
      rankArr[root2] += 1;
      rankArr[root1] = null;
      chunker.add('rank[m] <- rank[m] + 1', (vis, array) => {
        vis.array.set(array, 'unionFind', ' ');
        vis.array.showKth(`${n} UNION ${m}`);
        vis.array.data[2][root2].selected1 = true;
        vis.array.data[2][root1].selected = false;
      }, [[N_ARRAY, parentArr, rankArr]]);
    }
    else {
      rankArr[root1] = null;
    }
    chunker.add('union(n, m)', (vis, array) => {
      vis.array.set(array, 'unionFind', ' ');
      vis.array.showKth(`${n} UNION ${m}`);
    }, [[N_ARRAY, parentArr, rankArr]]);
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
    const unionOperations = params.target.arg1;
    const pathCompression = params.target.arg2;
        
    // setting up the arrays
    const parentArr = ["Parent[n]",...N_ARRAY.slice(1)];
    const rankArr = ["Rank[n]",...Array(10).fill(0)];

    chunker.add('union(n, m)', (vis, array) => {

      vis.array.set(array, 'unionFind');
    }, [[N_ARRAY, parentArr, rankArr]]);

    // applying union operations
    for (let i = 0; i < unionOperations.length; i++) {
      this.union(
        chunker,
        parentArr,
        rankArr,
        unionOperations[i][0],
        unionOperations[i][1],
        pathCompression,
      );
    }
  },
};
