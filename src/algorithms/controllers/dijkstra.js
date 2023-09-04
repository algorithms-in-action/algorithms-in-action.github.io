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
    const nodes = [];
    let n;
    let miniIndex;
    const minCosts = [];
    const parents = [];

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
    
    minCosts.push('Cost[i]');  // initialize the cost list
    nodes.push('i'); // initialize the first row of list
    parents.push('Parent[i]'); // initialize the parents list
    for (i = 0; i < n; i += 1) {
      pq[i] = i;
      nodes[i + 1] = i + 1;
      minCosts.push(Infinity);
      parents.push(0);
    }
    
    miniIndex = 1; // point the mini index in the pq cost
    /* the chunker add select the minimum cost one */
    chunker.add(
        2,
        (vis, v, w) => {
          vis.array.set(v, 'dijkstra');
        },
        [[nodes, parents, minCosts], miniIndex]
    );
    
    


  }, 

  run2(chunker, { matrix }) {
    const numVertices = matrix.length;
    const INFINITY = Number.MAX_SAFE_INTEGER; 
    const E = [...matrix] 

    chunker.add(
      1,
      (vis, array) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.set(array, Array.from({ length: matrix.length }, (v, k) => (k + 1)));
      },
      [E]
    );
  
    ///initialise each element of array Parent to zero
    const prev = Array(numVertices).fill(null);
    
    ///initialize each element of array Cost to infinity
    const cost = Array(numVertices).fill(INFINITY); 
    
  
    ///Cost[s] <- 0
    cost[0] = 0; 
    const pqCost = [];
    const prevNode = [];
    const pqDisplay = [];
    
    /// Nodes <- PQ containing all nodes

    // Create a set to keep track of visited vertices
    const visited = new Set(); 
    
   
    
    while (visited.size < numVertices) { 
      ///while Nodes not Empty
      // Find the unvisited vertex with the smallest cost
      let minCost = INFINITY;
      let currentVertex = null;
      for (let i = 0; i < numVertices; i++) {
        if (!visited.has(i) && cost[i] < minCost) {
          minCost = cost[i];
          currentVertex = i;
        }
      } 
      ///n <- RemoveMin(Nodes)
  
      // If we can't find a reachable vertex, exit 
      /// if is_end_node(n) or Cost[n] = infinity
      if (currentVertex === null) {
        ///return
        break; 
      }
      // Mark the vertex as visited
      visited.add(currentVertex);
  
      // Update the cost and prev arrays 
      /// for each node m neighbouting n
      for (let m = 0; m < numVertices; m++) {
        if (matrix[currentVertex][m] !== 0) { // Skip if no edge exists
          const newCost = cost[currentVertex] + matrix[currentVertex][m];
          /// if Cost[n]+weight(n,m)<Cost[m]
          if (newCost < cost[m]) {
            /// Cost[m] <- Cost[n] + weight(n,m)
            cost[m] = newCost; 
            ///UpdateCost(Nodes,m,Cost[m])
            ///Parent[m] <- n
            prev[m] = currentVertex;
          }
        }
      }
    }
  }, 

};
