/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('graph', null, 'Prim'),
        order: 0,
      },
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
    let pqStart;
    let n;

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

    const PqUpdate = (i) => {
      let j;
      let w;
      for (j = 0; j < n; j += 1) {
        w = weight[i][j];
        if (w > 0 && !prev.includes(j) && pqStart < n) {
          chunker.add(
            3,
            (vis, n1, n2) => {
              vis.graph.visit(n1, n2);
            },
            [i, j]
          );
          chunker.add(
            3,
            (vis, n1, n2) => {
              vis.graph.leave(n1, n2);
            },
            [i, j]
          );
        }
        if (w > 0 && pending[j] && w < cost[j]) {
          cost[j] = w;
          PqSort();
          prev[j] = i;
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
    for (i = 0; i < n; i += 1) {
      pq[i] = i;
    }
    pqStart = 0;
    while (pqStart < n) {
      i = pq[pqStart];
      chunker.add(
        2,
        (vis, n1, n2) => {
          vis.graph.visit(n1, n2);
        },
        [i, prev[i]]
      );
      pending[i] = 0;
      pqStart += 1;
      PqUpdate(i);
    }
  },
};
