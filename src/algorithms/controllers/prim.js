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
        instance: new GraphTracer('graph', null, 'Graph view', { displayAxis : false }),
        order: 0,
      },
      array: {
        instance: new Array2DTracer('array', null, 'Parent array & Priority Queue'),
        order: 1,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   * 
   */
  run(chunker, { edgeValueMatrix, coordsMatrix, startNode }) {

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];  // Potentially empty.
    const vertex = edgeValueMatrix.length;

    let weight = new Array(edgeValueMatrix.length);
    for (let i = 0; i < weight.length; i += 1) {
      weight[i] = new Array(edgeValueMatrix.length);
    }

    const cost = new Array(edgeValueMatrix.length);
    const pending = new Array(edgeValueMatrix.length);
    const prev = new Array(edgeValueMatrix.length);
    const pq = new Array(edgeValueMatrix.length);
    const pqDisplay = [];
    const prevDisplay = new Array(edgeValueMatrix.length).fill('');
    let pqStart;
    let n;
    let miniIndex;
    let prevIndex;
    const closed = [];
    const pqCost = [];
    const prevNode = [];

    chunker.add(
      1,
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.set(edgeArray, Array.from({ length: edgeValueMatrix.length }, (v, k) => (k + 1)), coordsArray);
      },
      [E, coords]
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
      chunker.add(5);
      let j;
      let w;
      let preIndex;
      for (j = 0; j < n; j += 1) {
        w = weight[i][j];
        if (w > 0 && !prev.includes(j) && pqStart < n && !closed.includes(j)) {
          chunker.add(
            5,
            (vis, n1, n2) => {
              vis.graph.visit0(n1, n2);
            },
            [i, j]
          );
        }
        /*
        * this function would compared the new cost with the pq cost and update the pq cost
        * */
        if (w > 0 && pending[j] && w < cost[j]) {
          // show the comparison between weight(i,j) and cost[j]
          cost[j] = w;
          if (pqCost[j + 1] === Infinity) {
            pqCost[j + 1] = `${cost[j].toString()}<∞`;
          } else if (cost[j] !== null && pqCost[j + 1] != null) {
            pqCost[j + 1] = `${cost[j].toString()}<${pqCost[j + 1].toString()}`;
          }
          chunker.add(
              6,
              (vis, v, u) => {
                vis.array.set(v, 'prim');
                if (v[2][u] != null) {
                  vis.array.select(2, u);
                  vis.array.assignVariable('Min', 2, u);
                }
              },
              [[pqDisplay, prevNode, pqCost], miniIndex]
          );
          
          // update cost[j]
          pqCost[j + 1] = cost[j];
          chunker.add(
              7,
              (vis, v, u) => {
                vis.array.set(v, 'prim');
                if (v[2][u] != null) {
                  vis.array.select(2, u);
                  vis.array.assignVariable('Min', 2, u);
                }
              },
              [[pqDisplay, prevNode, pqCost], miniIndex]
          );

          // show the process of updating PQ
          PqSort();
          prev[j] = i;
          preIndex = miniIndex;
          findMinimum();
          chunker.add(
            8,
            // eslint-disable-next-line no-shadow
            (vis, u, v, w) => {
              vis.array.deselect(2, u);
              if (w[v] !== null) {
                vis.array.select(2, v);
                vis.array.assignVariable('Min', 2, v);
              }
            },
            [preIndex, miniIndex, pqCost]
          ); 

          // update prev[j]
          prevNode[j + 1] = i + 1;
          chunker.add(
            9,
            (vis, u, v) => {
              vis.array.set(u, 'prim');
              vis.array.select(2, v);
              vis.array.assignVariable('Min', 2, v);
            },
            [[pqDisplay, prevNode, pqCost], miniIndex]
          );
        }
      }
    };

    let i;
    weight = [...E];
    n = vertex;
    for (i = 0; i < n; i += 1) {
      cost[i] = Infinity;
      prev[i] = -1;
      pending[i] = 1;
    }
    // XXX  Note: Animation not quite linked to
    // pseudocode properly either with init + reassigning start cost to
    // 0 (probably not worth spending too much time fixing issues such
    // as this  - move to new pseudocode thats more similar to BFS/DFS
    // etc)
    pqCost.push('Cost[i]');  // initialize the pq cost
    pqDisplay.push('i'); // initialize the pq display
    prevNode.push('Parent[i]'); // initialize the prev list
    for (i = 0; i < n; i += 1) {
      pq[i] = i;
      pqDisplay[i + 1] = i + 1;
      pqCost.push(Infinity);
      prevNode.push('-');
    }
    // init start node cost to zero
    // (note cost+pq arrays start at 0 and pqCost starts at 1,
    // just to confuse things?)
    cost[startNode-1] = 0;
    pqCost[startNode] = 0; // add the minimum cost to pq cost
    pq[0] = startNode-1;
    prev[startNode-1] = startNode-1;
    prevNode[startNode] = startNode;
    pq[startNode-1] = 0;
    miniIndex = startNode; // point the mini index in the pq cost
    
    pqStart = 0;
    /* the chunker add select the minimum cost one */
    chunker.add(
        2,
        (vis, v, w) => {
          vis.array.set(v, 'prim');
          vis.array.select(2, w);
          vis.array.assignVariable('Min', 2, w);
        },
        [[pqDisplay, prevNode, pqCost], miniIndex]
    );
    chunker.add(
        3,
        (vis, v, w) => {
          vis.array.set(v, 'prim');
          vis.array.select(2, w);
          vis.array.assignVariable('Min', 2, w);
        },
        [[pqDisplay, prevNode, pqCost], miniIndex]
    );

    while (pqStart < n) {
      i = pq[pqStart];
      prevDisplay[pqStart] = i + 1;
      /* pop the miniIndex one and add it to spinning tree to extend more connections */
      pending[i] = 0;
      pqStart += 1;
      /* change the miniIndex to null */
      pqCost[miniIndex] = null;
      /* get the next minimum value index and select it */
      prevIndex = miniIndex;
      findMinimum();
      chunker.add(
          4,
          (vis, v, w, u, n1, n2, index) => {
            vis.graph.visit0(n1, n2);
            vis.graph.select(n1, n2);
            vis.array.deselect(index);
            vis.array.set(v, 'prim');
            vis.array.deselect(2, u);
            if (u !== w && v[2][w] !== null) {
              vis.array.select(2, w);
              vis.array.assignVariable('Min', 2, w);
            }
          },
          [[pqDisplay, prevNode, pqCost], miniIndex, prevIndex, i, prev[i], miniIndex]
      );

      PqUpdate(i);
      findMinimum();// once update the cost, find the next minimum cost in pq cost and select it

      const newEdges = [];
      for (let j = 0; j < n; j += 1) {
        if (weight[i][j] > 0 && !prev.includes(j) && pqStart < n && !closed.includes(j)) {
          newEdges.push(j);
        }
      }
      if (pq[pqStart]) {
        chunker.add(
          5,
          (vis, n1, n2) => {
            vis.graph.visit0(n1, n2);
          },
          [prev[pq[pqStart]], pq[pqStart]]
        );
      }
      chunker.add(
        5,
        (vis, n1, n2) => {
          vis.graph.allLeave(n1, n2);
          vis.graph.visit0(n1, n1);
        },
        [i, newEdges]
      );
      chunker.add(3);
      closed.push(i);
    }
    // for test
    return prev;
  },
};
