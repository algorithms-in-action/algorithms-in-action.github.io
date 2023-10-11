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
        instance: new Array2DTracer('array', null, 'Parent array, Finalized array & Stack'),
        order: 1,
      }, 
      

    };
  },

  run1(chunker, { matrix }) {
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
    
    nodes.push('i'); // initialize the pq display
    parents.push('Parent[i]');
    minCosts.push('Cost[i] (PQ)'); 
    finalCosts.push('Final Cost');
    chunker.add(
      1,
      (vis, array, npmf,i) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.set(array, Array.from({ length: matrix.length }, (v, k) => (k + 1)));
        vis.graph.colorEdge(1,2,4);  
        vis.graph.colorEdge(0,1,3);
        vis.graph.colorNode(0,4); 
        vis.graph.colorNode(1,3);
        //vis.graph.removeEdgeColor(1,2);
        vis.array.set([...matrix], 'dfs');
        //vis.graph.setIstc();
        vis.array.setList([1,2,3]); 
        vis.array.select(1,2,1,2,'4'); 
        
        
      },
      [E,[nodes, parents, minCosts, finalCosts], 0]
    ); 
    chunker.add(
      1,
      (vis, array, npmf,i) => {
        vis.graph.removeEdgeColor(1,2);  
        vis.graph.removeNodeColor(1);
       // vis.graph.removeEdgeColor(0,1); 
       vis.array.deselect(1,2);
        
      },
      [E,[nodes, parents, minCosts, finalCosts], 0]
    ); 


    // initialise each element of array Parent to zero 
    const prev = Array(numVertices).fill(null);  

    
     
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

  run(chunker, { matrix, endNode}) {
    const E = [...matrix];
    const numVertices = matrix.length;   
    //The real Finalised array(visited) and Parent array(parent)
    const visited = new Array(numVertices).fill(false); 
    const parent = new Array(numVertices).fill(null);
    const explored = new Array(numVertices).fill(false); 
    
    //The fake ones for display
    const displayedVisited = []; 
    const displayedParent = []; 
    const displayedNodes = []; 
    let displayedStack = [];  
   

    // DFS(G, s) B1
    chunker.add(
      1,
      (vis, array) => {
        vis.graph.directed(false);
        vis.graph.weighted(false);
        vis.graph.set(array, Array.from({ length: matrix.length }, (v, k) => (k + 1)));
        
      },
      [E]
    );  
    

    // initialise each element of array Parent to zero B6  
    displayedParent.push('Parent[i]');  
    displayedVisited.push('Finalised[i]'); 
    displayedNodes.push('i');
    for (let i = 0; i < numVertices; i += 1) {
      displayedParent.push(0); 
      displayedVisited.push(' ');  
      displayedNodes.push(i + 1);
    }
    chunker.add(
      6,
      (vis, x) => { 
        vis.array.set(x, 'dfs');  
      },
      [[displayedNodes, displayedParent, displayedVisited], displayedStack]
    ); 

    // initialise each element of Finalised to  B7
    for (let i = 0; i < numVertices; i += 1) {
      displayedVisited[i + 1] = "false";  
      displayedVisited[i + 1] = endNode;
    }  

    chunker.add(
      7,
      (vis, x) => { 
        vis.array.set(x, 'dfs');  
      },
      [[displayedNodes, displayedParent, displayedVisited]]
    ); 


    
    const dfs = (s) => {
        // Nodes <- stack containing just s B8
        //The real stack
        const Nodes = [s];  
        displayedStack = [];
        displayedStack.push(s+1); 
        explored[s] = true;
        chunker.add(
          8,
          (vis, x, y, z) => { 
            
            vis.array.set(x, 'dfs');  
            vis.array.setList(y);  

            //select the explored node in blue 

            for (let i = 0; i < z.length; i ++){
              if(z[i] == true){
                vis.array.select(0,i + 1);
                vis.graph.colorNode(i, 4);
              }
            } 

           

          },
          [[displayedNodes, displayedParent, displayedVisited], displayedStack, explored]
        );  


        // while Nodes not empty B2
        while (Nodes.length > 0) {
            chunker.add(2);
            // n <- pop(Nodes) B9
            let n = Nodes.pop();  
            displayedStack.pop();
            chunker.add(
              9,
              (vis, x, y, z, a, b) => { 
                vis.array.set(x, 'dfs'); 
                
                //add a string "n" below the currently popped out node
                vis.array.assignVariable('n', 2, b + 1); 
                
                //highlight all nodes explored in blue 
                //
                for (let i = 0; i < z.length; i ++){
                  if(z[i] == true){
                    vis.array.select(0,i + 1);
                    
                  }
                }

                //highlight all finalized nodes in green
                for(let i = 0; i < a.length; i++)
                { 
                  if(a[i] == true)
                  { 
                    //vis.array.deselect(0, i + 1);
                    vis.array.select(0, i + 1, 0, i + 1, '1');
                  }
                }  

                

                vis.array.setList(y); 
              },
              [[displayedNodes, displayedParent, displayedVisited], displayedStack, explored, visited, n]
            );  



            // While Finalised[n] B10 
            while (visited[n]) { 
                chunker.add(10);

                chunker.add(11);
                // If Node is empty B11
                if (Nodes.length === 0) {
                    // Return B12
                    chunker.add(12);
                    return;
                }
                // n <- pop(Nodes) B13
                n = Nodes.pop();  
                displayedStack.pop(); 
                chunker.add(
                  13,
                  (vis, x, y, z, a, b) => { 
                    //reset
                    vis.array.set(x,'dfs');  
                    //add a string "n" below the currently popped out node
                    vis.array.assignVariable('n', 2, y + 1);  
                    
                    //highlight all nodes explored in blue 
                    //
                    for (let i = 0; i < a.length; i ++){
                      if(a[i] == true){
                        vis.array.select(0,i + 1);
                        
                      }
                    }

                    //highlight all finalized nodes in green
                    for(let i = 0; i < b.length; i++)
                    { 
                      if(b[i] == true)
                      { 
                        vis.array.select(0, i + 1, 0, i + 1, '1');  
                      }
                    }                   
                    
                    

                    //redisplay stack
                    vis.array.setList(z);
                  },
                  [[displayedNodes, displayedParent, displayedVisited], n, displayedStack, explored, visited]
                ); 


            }
            // Finalised[n] <- True B14
            visited[n] = true;  
            displayedVisited[n + 1] = "true";   
            explored[n] = false;
            chunker.add(
              14,
              (vis, x, y, z, a, b) => { 
                vis.array.set(x, 'dfs');
                //add a string "n" below the currently popped out node
                vis.array.assignVariable('n', 2, b + 1); 

                //highlight all nodes explored in blue in the array
                //
                for (let i = 0; i < z.length; i ++){
                  if(z[i] == true){
                    vis.array.select(0,i + 1);
                    //vis.graph.colorNode(i, 4);
                  }
                }

                //highlight all finalized nodes in green in the array
                for(let i = 0; i < a.length; i++)
                { 
                  if(a[i] == true)
                  { 
                    vis.array.select(0, i + 1, 0, i + 1, '1');  
                  }
                }  

                //changed the finalized node's highlight color to green in the graph
                vis.graph.removeNodeColor(b); 
                vis.graph.colorNode(b, 1);
                
                vis.array.setList(y); 
              },
              [[displayedNodes, displayedParent, displayedVisited], displayedStack, explored, visited, n]
            );



            // If is_end_node(n) B15
            // NOTE: Assuming there's a function is_end_node to check for an end condition, or you can define your own condition here
            // if (is_end_node(n)) {
            //     return;
            // }
            // for each node m neighbouring n
            for (let m = 0; m < numVertices; m++) {
                if (E[n][m] != 0) {
                    // If not Finalised[m]
                    if (!visited[m]) {
                        // Parent[m]
                        // NOTE: This part is missing. It looks like the pseudocode wants to assign 'n' as the parent of 'm', but it's not clear.
                        // You would need an array to track this if you wish to.
                        // Parent[m] = n;
                        // push(Nodes,m)
                        Nodes.push(m);
                    }
                }
            }
        }
    };

    for (let i = 0; i < numVertices; i++) {
        // If not Finalised[m]
        if (!visited[i]) {
            dfs(i);
        }
    }
}

  
};
