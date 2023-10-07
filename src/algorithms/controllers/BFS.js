import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

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

  run(chunker, { matrix }) {
    // String Variables used in displaying algo
    const algNameStr = 'dijkstra';
    const dashStr = '-';
    const minStr = 'Min';
    const infinityStr = '∞';
    const lessThanStr = '<';
    const notLessThanStr = '≮';

    const numVertices = matrix.length;
    const E = [...matrix];
    const minCosts = [];
    const parents = [];
    const nodes = [];  
    const finalCosts = [];
    // Create a set to keep track of visited vertices
    const visited = new Set();  
    let miniIndex = 0;  
    let last = [null, null]; // keep track of the last neighbour we visited
    // initialize each element of array Cost to infinity
    const cost = Array(numVertices).fill(Infinity);
      
    const findMinimum = () => {
      let minCost = Infinity;
      miniIndex = null;
      for (let i = numVertices - 1; i >= 0; i--) {
        if (!visited.has(i) && cost[i] <= minCost) {
          minCost = cost[i];
          miniIndex = i;
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

    // initialise each element of array Parent to zero 
    const prev = Array(numVertices).fill(null);  

    nodes.push('i'); // initialize the pq display
    parents.push('Parent[i]');
    minCosts.push('Cost[i] (PQ)'); 
    finalCosts.push('Final Cost');
     
    // Initialize the table
    for (let i = 0; i < numVertices; i += 1) {
      nodes[i + 1] = i + 1;
      minCosts.push(dashStr);
      parents.push(0); 
      finalCosts.push(dashStr);
    }

    chunker.add(
      5,
      (vis, v) => {
        vis.array.set(v, algNameStr);
      },
      [[nodes, parents, minCosts, finalCosts], 0]
    );


    for (let i = 0; i < numVertices; i += 1) {
      minCosts[i + 1] = (Infinity);
    }

    chunker.add(
      6,
      (vis, v) => {
        vis.array.set(v, algNameStr);
      },
      [[nodes, parents, minCosts, finalCosts], 0]
    );
    
  
    // Cost[s] <- 0
    cost[0] = 0;
    minCosts[1] = 0; 
    chunker.add(
      7,
      (vis, v, w) => {
        vis.array.set(v, algNameStr);
        vis.array.select(2, w + 1);
        vis.array.assignVariable(minStr, 2, w + 1);
      },
      [[nodes, parents, minCosts, finalCosts], 0]
    );

    
    // Nodes <- PQ containing all nodes 
    chunker.add(8);


    while (visited.size < numVertices) { 
      // while Nodes not Empty 
      findMinimum(); 
      
      chunker.add( 
        2,
        (vis, v, w, x) => {
          // visit1(x,y,2) highlights the edge xy,and nodes x and y
          // in the 2nd color 
          // leave1(x,y,2) removes the highlight on nodes x, y and 
          // edge xy(placed by the visit1 function in the 2nd color)
          if (x[0] != null) {
            vis.graph.leave1(x[0], x[1], 2);
          }
          vis.array.set(v, algNameStr);
          if (w != null) {
            vis.array.select(2, w + 1); 
            vis.array.assignVariable(minStr, 2, w + 1);
          }
        },
        [[nodes, parents, minCosts, finalCosts], miniIndex, last]
      );

      // Find the unvisited vertex with the smallest cost
      
      let currentVertex = null; 
      findMinimum();
      currentVertex = miniIndex;
      finalCosts[miniIndex + 1] = cost[miniIndex];
      
      // n <- RemoveMin(Nodes)  
      minCosts[currentVertex + 1] = null; 
      visited.add(currentVertex);
      
      // Update the miniIndex
      findMinimum(); 
      chunker.add(
        9,
        (vis, v, w, x, y) => {
          if (y != null) {
            vis.graph.deselect(y, x); 
            vis.graph.select(y, y);
            vis.graph.visit1(y, x, 1); 
            vis.graph.leave1(x, x, 1); 
            vis.graph.leave1(y, y, 1);
          }
          vis.graph.select(x, x);
          vis.array.set(v, algNameStr);

          if (w != null) {
            vis.array.select(2, w + 1);
            vis.array.assignVariable(minStr, 2, w + 1);
          }
        },
        [[nodes, parents, minCosts, finalCosts], miniIndex, 
            currentVertex, prev[currentVertex]]
      );
      
      // If we can't find a reachable vertex, exit 
      // if is_end_node(n) or Cost[n] = infinity 
      chunker.add(10);
      if (currentVertex === null) {
        chunker.add(3);
        // return
        break; 
      }
      // Mark the vertex as visited
      
  
      // Update the cost and prev arrays 
      
      // for each node m neighbouring n
      for (let m = 0; m < numVertices; m++) {
        if (matrix[currentVertex][m] !== 0
            && !visited.has(m)) {  // Skip if no edge exists
          // findMinimum();
          chunker.add(
            4,
            (vis, v, w, z) => {
              if (z[0] != null) {
                vis.graph.leave1(z[0], z[1], 2);
              }
              
              vis.array.set(v, algNameStr);
              if (w != null) {
                vis.array.select(2, w + 1); 
                vis.array.assignVariable(minStr, 2, w + 1);
              }
            },
            [[nodes, parents, minCosts, finalCosts], miniIndex, last]
          );
          
          const newCost = cost[currentVertex] + matrix[currentVertex][m];
          
          // if Cost[n]+weight(n,m)<Cost[m]
          let tempString = minCosts[m + 1];
          if (minCosts[m + 1] === Infinity) {
            tempString = infinityStr;
          }
          if (newCost < cost[m]) {
            minCosts[m + 1] = (`${newCost} ${lessThanStr} ${tempString}`);
          } 
          else {
            minCosts[m + 1] = (`${newCost} ${notLessThanStr} ${tempString}`);
          }
          
          // findMinimum();
          chunker.add(
            11,
            (vis, v, w, x, y) => {
              vis.array.set(v, algNameStr);
              if (w != null) {
                vis.array.select(2, w + 1);
                vis.array.assignVariable(minStr, 2, w + 1);
              } 
              vis.graph.visit1(x, y, 2);
              vis.graph.leave1(x, x, 2);
              vis.graph.leave1(y, y, 2);
            },
            [[nodes, parents, minCosts, finalCosts], miniIndex,
                currentVertex, m]
          ); 
          last = [currentVertex, m];
          minCosts[m + 1] = cost[m];
          
          if (newCost < cost[m]) {
            // Cost[m] <- Cost[n] + weight(n,m)
            cost[m] = newCost; 
            minCosts[m + 1] = newCost;
            // findMinimum();
            chunker.add(
              12,
              (vis, v, w) => {
                vis.array.set(v, algNameStr);
                if (w != null) {
                  vis.array.select(2, w + 1);
                  vis.array.assignVariable(minStr, 2, w + 1);
                }
              },
              [[nodes, parents, minCosts, finalCosts], miniIndex]
            );

            // UpdateCost(Nodes,m,Cost[m])
            findMinimum();
            chunker.add(
              13,
              (vis, v, w) => {
                vis.array.set(v, algNameStr);
                vis.array.assignVariable('Min', 2, w + 1);
           
                vis.array.select(2, w + 1);
              },
              [[nodes, parents, minCosts, finalCosts], miniIndex]
            );

            // Parent[m] <- n
            parents[m + 1] = currentVertex + 1;
            const lastParent = prev[m];
            prev[m] = currentVertex;   
          
            // findMinimum();
            chunker.add(
              14,
              (vis, v, w, x, y, z, z1) => {
                vis.graph.leave1(z1, y, 2);
                
                vis.array.set(v, algNameStr);
                vis.array.assignVariable(minStr, 2, w + 1);
                vis.array.select(2, w + 1);
                vis.graph.deselect(x, x);
                vis.graph.select(x, y);  
                
                // disconnect from the previous parent
                if (z != null) {
                  // vis.graph.visit(y,[z]);
                  vis.graph.deselect(z, y);
                  vis.graph.select(z, z);
                }
              },
              [[nodes, parents, minCosts, finalCosts], miniIndex,
                  prev[m], m, lastParent, currentVertex]
            );
          } 
        }
      }
    }
  },
};


