// TODO

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
        instance: new GraphTracer('graph', null, 'Graph view'),
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
  

    let i;
    weight = [...E];
    n = vertex;
    for (i = 0; i < n; i += 1) {
      cost[i] = Infinity;
      prev[i] = 0;
      pending[i] = 1;
    }
    pqCost.push('Cost[i]');  // initialize the pq cost
    pqDisplay.push('i'); // initialize the pq display
    prevNode.push('Parent[i]'); // initialize the prev list
    for (i = 0; i < n; i += 1) {
      pq[i] = i;
      pqDisplay[i + 1] = i + 1;
      pqCost.push(Infinity);
      prevNode.push(0);
    }
    pqStart = 0;
    pqCost[1] = cost[0]; // add the minimum cost to pq cost
    miniIndex = 1; // point the mini index in the pq cost
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
    
    
  },
};
