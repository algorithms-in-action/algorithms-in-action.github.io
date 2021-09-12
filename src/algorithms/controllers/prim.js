/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

// merge test 

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('graph', null, 'Prim'),
        order: 0,
      },
      array: {
        instance: new Array2DTracer('array', null, 'Priority Queue'),
        order: 1,
      },
      prevArray: {
        instance: new Array1DTracer('array', null, 'Prev Array'),
        order: 1,
      }
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   */
  run(chunker, { matrix }) {
    const E = [...matrix];
    const vertex = matrix.length;

    let weight = new Array(matrix.length);
    for (let i = 0; i < weight.length; i += 1) {
      weight[i] = new Array(matrix.length);
    }

    const cost = new Array(matrix.length);
    const pending = new Array(matrix.length);
    const prev = new Array(matrix.length);
    const pq = new Array(matrix.length);
    const pqDisplay = [];
    const prevDisplay = new Array(matrix.length).fill('');
    let pqStart;
    let n;
    let miniIndex;
    const closed = [];
    const pqCost = [];


    chunker.add(
      1,
      (vis, array) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.set(array, Array.from({ length: matrix.length }, (v, k) => (k + 1)));
      },
      [E]
    );

    const PqSort = () => {
      let i;
      let j;
      let v;
      for (i = pqStart; i < n; i += 1) {
        v = pq[i];
        for (j = i - 1; j >= pqStart && cost[v] < cost[pq[j]]; j -= 1) {
          pq[j + 1] = pq[j];
        }
        pq[j + 1] = v;
      }
    };

    // const sortNullRight = () =>  function (a, b) {
    //   if (a === b) {
    //     return 0;
    //   }
    //   if (a === null) {
    //     return 1;
    //   }
    //   if (b === null) {
    //     return -1;
    //   }
    //
    //     return a < b ? -1 : 1;
    // };

    // const updatePqDisplay = () => {
    //   pqDisplay = new Array(matrix.length).fill('');
    //   pqCost = new Array(matrix.length).fill('');
    //   let index = 0;
    //   for (let i = pqStart; i < n; i++) {
    //     if (cost[i] === Infinity) {
    //       break;
    //     }
    //     pqDisplay[index] = pq[i] + 1;
    //     pqCost[index] = cost[pq[i]];
    //     index++;
    //   }
    //   pqCost.sort(sortNullRight);
    // };
    const findMinimum = () => {
        let tmp = Infinity;
      // eslint-disable-next-line no-unused-vars
        for (let c = 1; c < pqCost.length; c++) {
          if (pqCost[c] != null && pqCost[c] < tmp) {
            tmp = pqCost[c];
            miniIndex = c;
          }
        }
    };
    const PqUpdate = (i) => {
      let j;
      let w;
      chunker.add(5);
      for (j = 0; j < n; j += 1) {
        w = weight[i][j];
        chunker.add(6);
        if (w > 0 && !prev.includes(j) && pqStart < n && !closed.includes(j)) {
          chunker.add(7);
          chunker.add(
            8,
            (vis, n1, n2) => {
              vis.graph.visit(n1, n2);
            },
            [i, j]
          );
        }
        if (w > 0 && pending[j] && w < cost[j]) {
          cost[j] = w;
          pqCost[j + 1] = `${cost[j].toString()}<${pqCost[j + 1].toString()}`;
          chunker.add(
              7,
              (vis, v) => {
                vis.array.set(v);
              },
              [[pqDisplay, pqCost]]
          );
          PqSort();
          prev[j] = i;
          // updatePqDisplay();
          pqCost[j + 1] = cost[j];
        }
        if (w > 0 && pending[j] && w > cost[j]) {
          pqCost[j + 1] = `${cost[j].toString()}<${pqCost[j + 1].toString()}`;
          chunker.add(
              7,
              (vis, v) => {
                vis.array.set(v);
              },
              [[pqDisplay, pqCost]]
          );
        }
      }
    };

    let i;
    weight = [...E];
    n = vertex;
    for (i = 0; i < n; i += 1) {
      cost[i] = Infinity;
      prev[i] = 0;
      pending[i] = 1;
    }
    cost[0] = 0;
    pqCost.push('Cost');
    pqDisplay.push('Node');
    for (i = 0; i < n; i += 1) {
      pq[i] = i;
      pqDisplay[i + 1] = i + 1;
      pqCost.push(Infinity);
    }
    pqStart = 0;
    miniIndex = 1;

    pqCost[1] = cost[0];
    // updatePqDisplay();
    chunker.add(
        2,
        (vis, v, u, w) => {
          vis.array.set(v);
          vis.prevArray.set(u);
          vis.array.select(1, w);
        },
        [[pqDisplay, pqCost], prevDisplay, miniIndex]
    );


    while (pqStart < n) {
      i = pq[pqStart];
      prevDisplay[pqStart] = i + 1;
      chunker.add(
        3,
        (vis, n1, n2, index) => {
          vis.graph.visit(n1, n2);
          vis.graph.select(n1, n2);
          vis.array.deselect(index);
        },
        [i, prev[i], miniIndex]
      );
      pending[i] = 0;
      pqStart += 1;

      pqCost[miniIndex] = null;
      pqDisplay[miniIndex] = null;
      // updatePqDisplay();

      chunker.add(
          5,
          (vis, v, u) => {
            vis.array.set(v);
            vis.prevArray.set(u);
            // vis.array.deselect(1, miniIndex);
          },
          [[pqDisplay, pqCost], prevDisplay]
      );

      PqUpdate(i);
      findMinimum();
      // updatePqDisplay();
      chunker.add(
          9,
          // eslint-disable-next-line no-loop-func
          (vis, v, u) => {
            vis.array.set(v);
            vis.prevArray.set(u);
            vis.array.select(1, miniIndex);
          },
          [[pqDisplay, pqCost], prevDisplay]
      );

      const newEdges = [];
      for (let j = 0; j < n; j += 1) {
        if (weight[i][j] > 0 && !prev.includes(j) && pqStart < n && !closed.includes(j)) {
          newEdges.push(j);
        }
      }
      if (pq[pqStart]) {
        chunker.add(
          9,
          (vis, n1, n2) => {
            vis.graph.visit(n1, n2);
          },
          [prev[pq[pqStart]], pq[pqStart]]
        );
      }
      chunker.add(
        9,
        (vis, n1, n2) => {
          vis.graph.allLeave(n1, n2);
        },
        [i, newEdges]
      );
      closed.push(i);
    }
    // for test
    return prev;
  },
};
