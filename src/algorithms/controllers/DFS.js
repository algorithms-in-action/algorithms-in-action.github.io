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

  run(chunker, { matrix, endNode, startNode}) {

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

    
    const start = startNode - 1;
    const end = endNode - 1; 

    let lastNeighbor = null;
    let n = null;

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

      parent[i] = null;

      displayedParent.push(0); 
      displayedVisited.push(' ');  
      displayedNodes.push(i + 1);
    }
    chunker.add(
      6,
      (vis, x) => { 
        vis.array.set(x, 'DFS');   
        
      },
      [[displayedNodes, displayedParent, displayedVisited]]
    ); 

    // initialise each element of Finalised to  B7
    for (let i = 0; i < numVertices; i += 1) {
      displayedVisited[i + 1] = "false";  

    }  

    chunker.add(
      7,
      (vis, x) => { 
        vis.array.set(x, 'DFS');  
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
            
            vis.array.set(x, 'DFS');  
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
            chunker.add(
              2,
              (vis, x, y, z) => {
                // remove the highlight between n
                // and the last visited neighbor
                if((x != null) && (y != null)){
                  vis.graph.removeEdgeColor(x, y);  
                  // recolor its edge connecting to its parent
                  if(z[y] != null){
                    vis.graph.removeEdgeColor(z[y], y);
                    vis.graph.colorEdge(z[y], y, 3); 
                    
                  }
                  
                } 

                // recolor in red if it has a child
                for(let i = 0; i < z.length; i ++){
                  if (z[i] == y){
                    vis.graph.removeEdgeColor(i, y);
                    vis.graph.colorEdge(i, y, 3);
                  }
                }
                


              },
              [n, lastNeighbor, parent]
              
              );
            // n <- pop(Nodes) B9
            n = Nodes.pop();  
            displayedStack.pop();
            chunker.add(
              9,
              (vis, x, y, z, a, b) => { 
                vis.array.set(x, 'DFS'); 
                
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
                    chunker.add(
                      12,
                    ); 
                    return;
                }
                // n <- pop(Nodes) B13
                n = Nodes.pop();  
                displayedStack.pop(); 
                chunker.add(
                  13,
                  (vis, x, y, z, a, b) => { 
                    //reset
                    vis.array.set(x,'DFS');  
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
                vis.array.set(x, 'DFS');
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
            

            chunker.add(
              15  
            );
            if(n == end)
            { 
              chunker.add(
                3,
              ); 
              // return B3
              return;
            }
            // NOTE: Assuming there's a function is_end_node to check for an end condition, or you can define your own condition here
            // if (is_end_node(n)) {
            //     return;
            // }
            // for each node m neighbouring n B4
            for (let m = 0; m < numVertices; m++) {  
              
              if (E[n][m] != 0) {

                    chunker.add(
                      4,
                      (vis, x, y, z, a) => {
                        //remove the color on Edge connecting the last neighbor 
                        
                        

                        //remove the orange highlight from the edge connecting the last neighbour
                        if (z != null)
                        {
                          vis.graph.removeEdgeColor(x, z); 

                          // recolor in red if it has a parent
                          if(a[z] != null) 
                          {
                            vis.graph.removeEdgeColor(a[z], z);
                            vis.graph.colorEdge(a[z], z, 3);
                          }

                          // recolor in red if it has a child
                          for(let i = 0; i < a.length; i ++){
                            if (a[i] == z){
                              vis.graph.removeEdgeColor(i, z);
                              vis.graph.colorEdge(i, z, 3);
                            }
                          }
                
                        } 

                        //highlight the edge connecting the neighbor
                        vis.graph.removeEdgeColor(x,y);
                        vis.graph.colorEdge(x, y, 2);

                      },
                      [n, m, lastNeighbor, parent]
                    ); 

                    lastNeighbor = m;
                    // If not Finalised[m] B16
                    chunker.add(
                      16,
                    );
                    if (!visited[m]) { 
                       
                        // Parent[m] <- n B17 
                      let lastParent = parent[m];
                      parent[m] = n;
                      displayedParent[m + 1] = n + 1;   
                      chunker.add(
                        17,
                        (vis, x, y, z, a, b, c, d) => { 
                          vis.array.set(x, 'DFS');
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
                          
                          //remove the highlight from this neighbour to its last parent
                          vis.graph.removeEdgeColor(d, c);

                          //highlight the edge from n to this neighbor in red
                          vis.graph.removeEdgeColor(b, c);
                          vis.graph.colorEdge(b, c, 3);
                          
                          
                          vis.array.setList(y); 
                        },
                        [[displayedNodes, displayedParent, displayedVisited], displayedStack, explored, visited, n, m, lastParent]
                      );




                        // Parent[m] = n;
                        // push(Nodes,m) B18
                        Nodes.push(m); 
                        displayedStack.push(m + 1);  
                        explored[m] = true;
                        chunker.add(
                          18,
                          (vis, x, y, z) => {
                            vis.array.setList(x);
                            
                            // color the node in blue as explored 
                            // if it has not been finalized
                            if(y[z] == false){
                              vis.array.deselect(0, z + 1);
                              vis.array.select(0, z + 1); 
                              vis.graph.removeNodeColor(z);
                              vis.graph.colorNode(z, 4);
                            }
                            
                          },
                          [displayedStack, visited, m]
                        );

                    }
                }
            }
        }
    };
    /*
    for (let i = 0; i < numVertices; i++) {
        // If not Finalised[m]
        if (!visited[i]) {
            dfs(i);
        }
    }*/ 

    dfs(start); 
   
    //return B5
    chunker.add(
      5,
      (vis, x, y, z, a, b) => { 
        //remove the orange highlight from the last neighbour
        if (y != null)
        {
          vis.graph.removeEdgeColor(y, x); 

          // recolor in red if it has a parent
          if(z[y] != null) 
          {
            vis.graph.removeEdgeColor(z[y], y);
            vis.graph.colorEdge(z[y], y , 3);
          } 

          // recolor in red if it has a child
          for(let i = 0; i < z.length; i ++){
            if (z[i] == y){
              vis.graph.removeEdgeColor(i, y);
              vis.graph.colorEdge(i, y, 3);
            }
          }
        } 
        // color the path from the start node to the end node
        
        /*vis.graph.removeEdgeColor(a, b);
        vis.graph.colorEdge(a, b, 4); */
        
        let current = b;
        while((current != a) && (z[current] != null))
        { 

          vis.graph.removeEdgeColor(current, z[current]);
          vis.graph.colorEdge(current, z[current], 1); 
          current = z[current];
        }


      },
      [n, lastNeighbor, parent, start, end]
      
    ) 
  }

  
};
