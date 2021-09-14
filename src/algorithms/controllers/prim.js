/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
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
    let prevIndex;
    const closed = [];
    const pqCost = [];
    const prevNode = [];


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
    /*
    * find minimum function would loop the pq cost and point to the minimum element
    * */
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
      let preIndex;
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
        /*
        * this function would compared the new cost with the pq cost and update the pq cost
        * */
        if (w > 0 && pending[j] && w < cost[j]) {
          prevNode[j + 1] = i + 1;
          cost[j] = w;
          if (pqCost[j + 1] === Infinity) {
            pqCost[j + 1] = `${cost[j].toString()}<=∞`;
          } else {
            pqCost[j + 1] = `${cost[j].toString()}<=${pqCost[j + 1].toString()}`;
          }
          chunker.add(
              7,
              (vis, v, u) => {
                vis.array.set(v, 'prim');
                if (v[1][u] != null) {
                  vis.array.select(1, u);
                }
              },
              [[pqDisplay, pqCost, prevNode], miniIndex]
          );
          PqSort();
          prev[j] = i;
          // updatePqDisplay();
          pqCost[j + 1] = cost[j];
          preIndex = miniIndex;
          findMinimum();
          if (preIndex !== miniIndex) {
            chunker.add(
                7,
                (vis, u, v) => {
                  vis.array.deselect(1, u);
                  vis.array.select(1, v);
                },
                [preIndex, miniIndex, prevNode]
            );
          }
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
    pqCost.push('Cost');  // initialize the pq cost
    pqDisplay.push('Node'); // initialize the pq display
    prevNode.push('Prev'); // initialize the prev list
    for (i = 0; i < n; i += 1) {
      pq[i] = i;
      pqDisplay[i + 1] = i + 1;
      pqCost.push(Infinity);
      prevNode.push(null);
    }
    pqStart = 0;
    pqCost[1] = cost[0]; // add the minimum cost to pq cost
    miniIndex = 1; // point the mini index in the pq cost
    /* the chunker add select the minimum cost one */
    chunker.add(
        2,
        (vis, v, w) => {
          vis.array.set(v, 'prim');
          vis.array.select(1, w);
        },
        [[pqDisplay, pqCost, prevNode], miniIndex]
    );


    while (pqStart < n) {
      i = pq[pqStart];
      prevDisplay[pqStart] = i + 1;
      /* pop the miniIndex one and add it to spinning tree to extend more connections */
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
      /* change the miniIndex to null */
      pqCost[miniIndex] = null;
      pqDisplay[miniIndex] = null;
      prevNode[miniIndex] = null;
      /* get the next minimum value index and select it */
      prevIndex = miniIndex;
      findMinimum();
      chunker.add(
          5,
          (vis, v, w, u) => {
            vis.array.set(v, 'prim');
            vis.array.deselect(1, u);
            if (u !== w) {
              vis.array.select(1, w);
            }
          },
          [[pqDisplay, pqCost, prevNode], miniIndex, prevIndex]
      );

      PqUpdate(i);
      findMinimum();// once update the cost, find the next minimum cost in pq cost and select it

      chunker.add(
          9,
          (vis, v, w) => {
            vis.array.set(v, 'prim');
            vis.array.select(1, w);
          },
          [[pqDisplay, pqCost, prevNode], miniIndex]
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
