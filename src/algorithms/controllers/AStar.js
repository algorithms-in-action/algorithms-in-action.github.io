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

  

  run(chunker, { matrix, startNode, endNode}) {
    // String Variables used in displaying algo
    const algNameStr = 'aStar';
    const dashStr = '-';
    const minStr = 'Min'; 
    const nStr = 'n';
    const infinityStr = '∞';
    const lessThanStr = '<';
    const notLessThanStr = '≮';

    const numVertices = matrix.length;
    const E = [...matrix];
    const minCosts = [];
    const parents = [];
    const nodes = [];  
    const finalCosts = [];  
    const heuristics = [];
    const calculatedHeuristics = [];
    const start = startNode - 1; 
    const end = endNode - 1;
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

    //Change this to the function for calculating heuristic distances
    const calculateHDistance = () => {
      return 0;
    }

    for (let i = 0; i < numVertices; i++) {
        calculatedHeuristics[i] = calculateHDistance();
    }

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
    heuristics.push('h(i)');
    finalCosts.push('Final Cost');
     
    // Initialize the table
    for (let i = 0; i < numVertices; i += 1) {
      nodes[i + 1] = i + 1;
      heuristics.push(calculatedHeuristics[i]);
      minCosts.push(dashStr);
      parents.push(0); 
      finalCosts.push(dashStr);
    }

    chunker.add(
      5,
      (vis, v) => {
        vis.array.set(v, algNameStr);
      },
      [[nodes,heuristics, parents, minCosts,finalCosts], 0]
    );


    for (let i = 0; i < numVertices; i += 1) {
      minCosts[i + 1] = (Infinity);
    }

    chunker.add(
      6,
      (vis, v) => {
        vis.array.set(v, algNameStr);
      },
      [[nodes,heuristics, parents, minCosts,finalCosts],0]
    );
    
  
    // Cost[s] <- 0
    cost[start] = 0;
    minCosts[start + 1] = 0; 
    chunker.add(
      7,
      (vis, v, w) => {
        vis.array.set(v, algNameStr);
        vis.array.assignVariable(minStr, 2, w + 1);


        vis.array.select(3, w + 1);
      },
      [[nodes,heuristics, parents, minCosts,finalCosts], start]
    );

    
    // Nodes <- PQ containing all nodes 
    chunker.add(8);

    let currentVertex = null;
    while (visited.size < numVertices) { 
      // while Nodes not Empty 
      
      
      findMinimum(); 
      
      chunker.add( 
        2,
        (vis, v, w, x, a, b) => {
          // visit1(x,y,2) highlights the edge xy,and nodes x and y
          // in the 2nd color 
          // leave1(x,y,2) removes the highlight on nodes x, y and 
          // edge xy(placed by the visit1 function in the 2nd color)
          if (x[0] != null) {
            vis.graph.removeEdgeColor(x[0], x[1]); 

            
            
            // restore the original color of the edge
            if(a[x[0]] != null && v[4][x[0]+1] == dashStr)
            {
              vis.graph.removeEdgeColor(a[x[0]], x[0]);
              vis.graph.colorEdge(a[x[0]], x[0], 3);
            }

            if(a[x[1]] != null && v[4][x[1]+1] == dashStr)
            {
              vis.graph.removeEdgeColor(a[x[1]], x[1]);
              vis.graph.colorEdge(a[x[1]], x[1], 3);
            }

            if(v[4][x[0]+1] != dashStr)
            {
              vis.graph.removeEdgeColor(a[x[0]], x[0]);
              vis.graph.colorEdge(a[x[0]], x[0], 1);
            }

            if(v[4][x[1]+1] != dashStr)
            {
              vis.graph.removeEdgeColor(a[x[1]], x[1]);
              vis.graph.colorEdge(a[x[1]], x[1], 1);
            }



            //vis.graph.leave1(x[0], x[1], 2);
            /*vis.graph.removeEdgeColor(a[x[0]], x[0]);
            vis.graph.removeEdgeColor(a[x[1]], x[1]);
            vis.graph.colorEdge(a[x[0]], x[0], 3);
            vis.graph.colorEdge(a[x[1]], x[1], 3);*/
          }
          vis.array.set(v, algNameStr);
          if (w != null) {
            
            vis.array.assignVariable(minStr, 2, w + 1); 
            if (b != null){
              vis.array.assignVariable(nStr, 2, b + 1);
            }

            vis.array.select(3, w + 1); 
          } 

          // color the finalized cells in green
          for(let i = 0; i < v[4].length - 1; i ++){
                
            if (v[4][i + 1] != dashStr)
            {
              vis.array.select(0, i + 1, 0, i + 1, '1');
            }
          }
        },
        [[nodes,heuristics, parents, minCosts,finalCosts], miniIndex, last, prev, currentVertex]
      );

      // Find the unvisited vertex with the smallest cost
      
      currentVertex = null; 
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
            vis.graph.removeEdgeColor(y, x);
            vis.graph.colorNode(y, 1);
            vis.graph.colorEdge(y, x, 1);
            //vis.graph.deselect(y, x); 
            //vis.graph.select(y, y);
            //vis.graph.visit1(y, x, 1); 
            //vis.graph.leave1(x, x, 1); 
            //vis.graph.leave1(y, y, 1);
          }
          vis.graph.colorNode(x, 1);
          //vis.graph.select(x, x);
          vis.array.set(v, algNameStr);

          if (w != null) {
            
            
            vis.array.assignVariable(minStr, 2, w + 1); 
            
            
            
            
            vis.array.select(3, w + 1); 
          }

          if(x != null){
            vis.array.assignVariable(nStr, 2, x + 1);
          }
          
          
          //color all finalized nodes in the array in green
          for(let i = 0; i < v[4].length - 1; i ++){
                
            if (v[4][i + 1] != dashStr)
            {
              vis.array.select(0, i + 1, 0, i + 1, '1');
            }
          }

        },
        [[nodes,heuristics, parents, minCosts,finalCosts], miniIndex, 
            currentVertex, prev[currentVertex]]
      );
      
      // If we can't find a reachable vertex, exit 
      // if is_end_node(n) or Cost[n] = infinity 
      chunker.add(10);
      if (currentVertex === null || currentVertex === end || 
        cost[currentVertex] === Infinity) {
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
            (vis, v, w, z, a, b, c) => {
              if (z[0] != null) { 
                vis.graph.removeEdgeColor(z[0], z[1]);
                //vis.graph.leave1(z[0], z[1], 2); 
                if(a[z[0]] != null && v[4][z[0]+1] == dashStr)
                {
                  vis.graph.removeEdgeColor(a[z[0]], z[0]);
                  vis.graph.colorEdge(a[z[0]], z[0], 3);
                }

                if(a[z[1]] != null && v[4][z[1]+1] == dashStr)
                {
                  vis.graph.removeEdgeColor(a[z[1]], z[1]);
                  vis.graph.colorEdge(a[z[1]], z[1], 3);
                }

                if(v[4][z[0]+1] != dashStr)
                {
                  vis.graph.removeEdgeColor(a[z[0]], z[0]);
                  vis.graph.colorEdge(a[z[0]], z[0], 1);
                }

                if(v[4][z[1]+1] != dashStr)
                {
                  vis.graph.removeEdgeColor(a[z[1]], z[1]);
                  vis.graph.colorEdge(a[z[1]], z[1], 1);
                }
              } 

              
              vis.graph.colorEdge(b, c, 2);
              vis.array.set(v, algNameStr);
              if (w != null) {
                vis.array.assignVariable(minStr, 2, w + 1); 
                vis.array.assignVariable(nStr, 2, b + 1);
                vis.array.select(3, w + 1); 
                
              }

              //color all finalized nodes in the array in green
              for(let i = 0; i < v[4].length - 1; i ++){
                
                if (v[4][i + 1] != dashStr)
                {
                  vis.array.select(0, i + 1, 0, i + 1, '1');
                }
              }
            },
            [[nodes,heuristics, parents, minCosts,finalCosts], miniIndex, last, prev, currentVertex,
            m]
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
                vis.array.assignVariable(minStr, 2, w + 1); 
                vis.array.assignVariable(nStr, 2, x + 1);
                vis.array.select(3, w + 1);
                
              }  

              //color all finalized nodes in the array in green
              for(let i = 0; i < v[4].length - 1; i ++){
                
                if (v[4][i + 1] != dashStr)
                {
                  vis.array.select(0, i + 1, 0, i + 1, '1');
                }
              }
              
              //vis.graph.visit1(x, y, 2);
              //vis.graph.leave1(x, x, 2);
              //vis.graph.leave1(y, y, 2);
            },
            [[nodes,heuristics, parents, minCosts,finalCosts], miniIndex,
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
              (vis, v, w, x) => {
                vis.array.set(v, algNameStr);
                if (w != null) {
                  vis.array.assignVariable(minStr, 2, w + 1); 
                  vis.array.assignVariable(nStr, 2, x + 1);
                  vis.array.select(3, w + 1);
                  
                } 

                //color all finalized nodes in the array in green
                for(let i = 0; i < v[4].length - 1; i ++){
                
                  if (v[4][i + 1] != dashStr)
                  {
                    vis.array.select(0, i + 1, 0, i + 1, '1');
                  }
                }
              },
              [[nodes,heuristics, parents, minCosts,finalCosts], miniIndex, currentVertex]
            );

            // UpdateCost(Nodes,m,Cost[m])
            findMinimum();
            chunker.add(
              13,
              (vis, v, w, x) => {
                vis.array.set(v, algNameStr);
                vis.array.assignVariable(minStr, 2, w + 1); 
                vis.array.assignVariable(nStr, 2, x + 1);
                
                //color all finalized nodes in the array in green
                for(let i = 0; i < v[4].length - 1; i ++){
                
                  if (v[4][i + 1] != dashStr)
                  {
                    vis.array.select(0, i + 1, 0, i + 1, '1');
                  }
                }
                vis.array.select(3, w + 1);
              },
              [[nodes,heuristics, parents, minCosts,finalCosts], miniIndex, currentVertex]
            );

            // Parent[m] <- n
            parents[m + 1] = currentVertex + 1;
            const lastParent = prev[m];
            prev[m] = currentVertex;   
          
            // findMinimum();
            chunker.add(
              14,
              (vis, v, w, x, y, z, z1) => {
                vis.graph.removeEdgeColor(z1, y);
                
                //vis.graph.leave1(z1, y, 2);
          
                vis.array.set(v, algNameStr);
                vis.array.assignVariable(minStr, 2, w + 1); 
                vis.array.assignVariable(nStr, 2, z1 + 1);
                vis.array.select(3, w + 1);
                
                //color all finalized nodes in the array in green
                for(let i = 0; i < v[4].length - 1; i ++){
                
                  if (v[4][i + 1] != dashStr)
                  {
                    vis.array.select(0, i + 1, 0, i + 1, '1');
                  }
                }
            
                vis.graph.removeNodeColor(x);
                vis.graph.colorEdge(x, y, 3);
                vis.graph.colorNode(x, 1);
                //vis.graph.deselect(x, x);
                //vis.graph.select(x, y);  
                
                // disconnect from the previous parent
                if (z != null) {
                  
                  // vis.graph.visit(y,[z]);
                  
                  vis.graph.removeEdgeColor(z, y);
                  //vis.graph.deselect(z, y);

                  vis.graph.colorNode(z, 1);
                  //vis.graph.select(z, z);
                }
              },
              [[nodes,heuristics, parents, minCosts,finalCosts], miniIndex,
                  prev[m], m, lastParent, currentVertex]
            );
          } 
        }
      }
    }
  }, 

  
};
