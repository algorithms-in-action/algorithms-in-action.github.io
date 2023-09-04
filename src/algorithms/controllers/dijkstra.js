// TODO

/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import { chunk } from 'lodash';

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
  run1(chunker, { matrix }) {
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

  run(chunker, { matrix }) {
    const numVertices = matrix.length;
    const INFINITY = Number.MAX_SAFE_INTEGER; 
    const E = [...matrix]  
    const pqCost = [];
    const prevNode = [];
    const pqDisplay = []; 
    // Create a set to keep track of visited vertices
    const visited = new Set();  
    let minVertex = 0; 

    const findMinimum = () =>{
      let minCost = INFINITY; 
      minVertex = null;
      for (let i = numVertices-1; i >= 0; i--) {
        if (!visited.has(i) && cost[i] <= minCost) {
          minCost = cost[i];
          minVertex = i;
        }
      } 
    };

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
    pqDisplay.push('i'); // initialize the pq display
    prevNode.push('Parent[i]');
    pqCost.push('Cost[i]');
    for (let i = 0; i < numVertices; i += 1) {
      pqDisplay[i + 1] = i + 1;
      pqCost.push("-");
      prevNode.push(0);
    }  // initialize the pq cost
    chunker.add(
      5,
      (vis, v) => {
        vis.array.set(v, 'dijkstra');
      },
      [[pqDisplay, prevNode, pqCost], 0]
    );
    
    ///initialize each element of array Cost to infinity
    const cost = Array(numVertices).fill(INFINITY);  
    for (let i = 0; i < numVertices; i += 1) {
      pqCost[i+1] = (Infinity);
    }  
    chunker.add(
      6,
      (vis, v) => {
        vis.array.set(v, 'dijkstra');
       ;
      },
      [[pqDisplay, prevNode, pqCost], 0]
    );
    
  
    ///Cost[s] <- 0
    cost[0] = 0;  
    pqCost[1] = 0; 
    chunker.add(
      7,
      (vis, v, w) => {
        vis.array.set(v, 'dijkstra');
        vis.array.select(2, w+1);
        vis.array.assignVariable('Min', 2, w+1);
      },
      [[pqDisplay, prevNode, pqCost], 0]
    );

    
    /// Nodes <- PQ containing all nodes 
    chunker.add(8);

    
   
    
    while (visited.size < numVertices) { 
      ///while Nodes not Empty 
      findMinimum();
      chunker.add(
        2,
        (vis, v, w) => {
         
          vis.array.set(v, 'dijkstra'); 
          if(w != null){
            vis.array.select(2, w+1); 
            vis.array.assignVariable("Min", 2, w+1);
          }
          
        },
        [[pqDisplay, prevNode, pqCost], minVertex]
      );

      // Find the unvisited vertex with the smallest cost
      
      let currentVertex = null; 
      findMinimum();
      currentVertex = minVertex;
      
      ///n <- RemoveMin(Nodes)  
      pqCost[currentVertex+1] = null; 
      visited.add(currentVertex);
      findMinimum(); 
      chunker.add(
        9,
        (vis, v, w, x,y) => {
      
          vis.graph.select(x, y); 
          
          vis.array.set(v, 'dijkstra'); 

          if(w!=null){
            vis.array.select(2, w+1);
            vis.array.assignVariable("Min", 2, w+1);
          }
          

        },
        [[pqDisplay, prevNode, pqCost], minVertex, currentVertex,prev[currentVertex]]
      );
      
      // If we can't find a reachable vertex, exit 
      /// if is_end_node(n) or Cost[n] = infinity 
      chunker.add(10);
      if (currentVertex === null){
        chunker.add(3);
        /// return
        break; 
      }
      // Mark the vertex as visited
      
  
      // Update the cost and prev arrays 
      
      /// for each node m neighbouting n
      for (let m = 0; m < numVertices; m++) {
        
        if (matrix[currentVertex][m] !== 0 &&
          !visited.has(m)) {  

            
          
          //findMinimum();  
          chunker.add(
            4,
            (vis, v, w) => {
              
              
              vis.array.set(v, 'dijkstra'); 
              if(w != null){
                vis.array.select(2, w+1); 
                vis.array.assignVariable("Min", 2, w+1);
              }
              
            },
            [[pqDisplay, prevNode, pqCost], minVertex]
          );// Skip if no edge exists
          
          const newCost = cost[currentVertex] + matrix[currentVertex][m];
          
          /// if Cost[n]+weight(n,m)<Cost[m]
          let tempString = pqCost[m+1];
          if(pqCost[m+1] === Infinity){
            tempString = "∞";
          }
          if (newCost < cost[m]){
            pqCost[m+1] = (newCost+"<" + tempString);
          } 
          else{
            pqCost[m+1] = (newCost+"!<" + tempString);
          }
          
          //findMinimum();
          chunker.add(
            11,
            (vis, v, w) => {
              
              vis.array.set(v, 'dijkstra');  
              if(w != null){
                vis.array.select(2, w+1); 
                vis.array.assignVariable("Min", 2, w+1);
              }

            },
            [[pqDisplay, prevNode, pqCost], minVertex]
          );
          pqCost[m+1] = cost[m];
          
          if (newCost < cost[m]) {
            
            /// Cost[m] <- Cost[n] + weight(n,m)
            cost[m] = newCost; 
            pqCost[m+1] = newCost;
            //findMinimum();
            chunker.add(
              12,
              (vis, v, w) => {
               
                vis.array.set(v, 'dijkstra'); 
                if(w != null){
                  vis.array.select(2, w+1); 
                  vis.array.assignVariable("Min", 2, w+1);
                }
              },
              [[pqDisplay, prevNode, pqCost], minVertex]
            );

            /// UpdateCost(Nodes,m,Cost[m]) 
            findMinimum();
            chunker.add(
              13,
              (vis, v, w, x) => {
                vis.array.set(v, 'dijkstra'); 
                vis.array.assignVariable("Min", 2, w+1);
           
                vis.array.select(2,w+1); 
                
                
                
              },
              [[pqDisplay, prevNode, pqCost], minVertex]
            );

            
            ///Parent[m] <- n
            prev[m] = currentVertex; 
            prevNode[m+1] = prev[m]+1; 
            //findMinimum();
            chunker.add(
              14,
              (vis, v, w) => {
                vis.array.set(v, 'dijkstra'); 
                vis.array.assignVariable("Min", 2, w+1);
                vis.array.select(2,w+1); 
              },
              [[pqDisplay, prevNode, pqCost], minVertex]
            );
            
          }
        }
      }
    }
  },  

  

};
