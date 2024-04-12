// XXX add support for multiple end nodes?
// XXX see README_graph_search
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

// OMG, colors for array and graph require different types and are
// inconsistent!
// XXX not sure how this interracts with color perception options -
// doesnt seem to work like this
// XXX should do similar for edge colors?
const FRONTIER_COLOR_A = '0';  // Blue
const FRONTIER_COLOR_G = 4;  // Blue
const FINALISED_COLOR_A = '1'; // Green
const FINALISED_COLOR_G = 1; // Green

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

  run(chunker, { edgeValueMatrix, coordsMatrix, endNodes, startNode}) {

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;   
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
    const end = endNodes[0] - 1; 

    let lastNeighbor = null;
    let n = null;

    // DFS(G, s) B1
    chunker.add(
      1,
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(false);
        vis.graph.set(edgeArray, Array.from({ length: edgeValueMatrix.length }, (v, k) => (k + 1)), coordsArray);
        
      },
      [E, coords]
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
        displayedStack = Nodes.toReversed();
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
              (vis, c_n, y, z, c_visited, c_explored) => {
                // removes m if it exists; need to redo colors
                // for green nodes:(
                vis.array.assignVariable('m', 2, undefined); // removes m if there
                //highlight all nodes explored in blue 
                //
                for (let i = 0; i < c_explored.length; i ++){
                  if(c_explored[i] == true){
                    vis.array.select(0,i + 1);
                    
                  }
                }
                //highlight all finalized nodes in green
                for(let i = 0; i < c_visited.length; i++)
                { 
                  if(c_visited[i] == true)
                  { 
                    //vis.array.deselect(0, i + 1);
                    vis.array.select(0, i + 1, 0, i + 1, '1');
                  }
                }  


                // remove the highlight between n
                // and the last visited neighbor
                if((c_n != null) && (y != null)){
                  vis.graph.removeEdgeColor(c_n, y);  
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
              [n, lastNeighbor, parent, visited, explored]
              
              );
            // n <- pop(Nodes) B9
            n = Nodes.pop();  
            displayedStack = Nodes.toReversed();
            chunker.add(
              9,
              (vis, x, y, c_explored, c_visited, c_n) => {
                vis.array.set(x, 'DFS'); 
                
                //add a string "n" below the currently popped out node
                vis.array.assignVariable('n', 2, c_n + 1); 

                //highlight all nodes explored in blue 
                //
                for (let i = 0; i < c_explored.length; i ++){
                  if(c_explored[i] == true){
                    vis.array.select(0,i + 1);
                    
                  }
                }

                //highlight all finalized nodes in green
                for(let i = 0; i < c_visited.length; i++)
                { 
                  if(c_visited[i] == true)
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
            chunker.add(10);
            while (visited[n]) { 

                chunker.add(11);
                // If Node is empty B11
                if (Nodes.length === 0) {
                    // Return B12
                    chunker.add(
                      12,
                      (vis, x, y, z, a, b) => { 
                        //remove the orange highlight from the last neighbour
                        // not needed??
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
                      },
                      [n, lastNeighbor, parent, start, end]
                    );
                    return;
                }
                // n <- pop(Nodes) B13
                n = Nodes.pop();  
                displayedStack = Nodes.toReversed();
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
              // End node found!
            { 
              chunker.add(
                3,
                (vis, x, y, c_parent, a, c_end) => { 
                  //remove the orange highlight from the last neighbour
                  // not needed??
                  if (y != null)
                  {
                    vis.graph.removeEdgeColor(y, x); 
          
                    // recolor in red if it has a parent
                    if(c_parent[y] != null) 
                    {
                      vis.graph.removeEdgeColor(c_parent[y], y);
                      vis.graph.colorEdge(c_parent[y], y , 3);
                    } 
    
                    // recolor in red if it has a child
                    for(let i = 0; i < c_parent.length; i ++){
                      if (c_parent[i] == y){
                        vis.graph.removeEdgeColor(i, y);
                        vis.graph.colorEdge(i, y, 3);
                      }
                    }

                  } 

                  // remove n, add start and end
                  // vis.array.set(x, 'BFS');
                  vis.array.assignVariable('n', 2, undefined);
                  vis.array.assignVariable('end', 2, c_end + 1);
                  vis.array.assignVariable('start', 2, s + 1);
                  // remove color from node numbers
                  for(let i = 0; i < c_parent.length; i++){
                    vis.array.deselect(0, i);
                  }
                  // color the path from the start node to the end node
                  let current = c_end;
                  // + color parent array
                  while((current != a) && (c_parent[current] != null))
                  {
                    vis.array.select(1, current + 1, 1, current + 1, FINALISED_COLOR_A);
                    vis.graph.removeEdgeColor(current, c_parent[current]);
                    vis.graph.colorEdge(current, c_parent[current], 1);
                    current = c_parent[current];
                  }
                },
                [n, lastNeighbor, parent, start, end]
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
                      (vis, c_n, c_m, z, c_parent, c_visited, c_explored) => {
                        //remove the color on Edge connecting the last neighbor 
                        
                        

                        //remove the orange highlight from the edge connecting the last neighbour
                        if (z != null)
                        {
                          vis.graph.removeEdgeColor(c_n, z); 

                          // recolor in red if it has a parent
                          if(c_parent[z] != null) 
                          {
                            vis.graph.removeEdgeColor(c_parent[z], z);
                            vis.graph.colorEdge(c_parent[z], z, 3);
                          }

                          // recolor in red if it has a child
                          for(let i = 0; i < c_parent.length; i ++){
                            if (c_parent[i] == z){
                              vis.graph.removeEdgeColor(i, z);
                              vis.graph.colorEdge(i, z, 3);
                            }
                          }
                
                        } 

                        //highlight the edge connecting the neighbor
                        vis.graph.removeEdgeColor(c_n,c_m);
                        vis.graph.colorEdge(c_n, c_m, 2);

                        // add var m; need to color elements again
                        vis.array.assignVariable('m', 2, c_m + 1);
                        //highlight all nodes explored in blue 
                        //
                        for (let i = 0; i < c_explored.length; i ++){
                          if(c_explored[i] == true){
                            vis.array.select(0,i + 1);
                            
                          }
                        }
                        //highlight all finalized nodes in green
                        for(let i = 0; i < c_visited.length; i++)
                        { 
                          if(c_visited[i] == true)
                          { 
                            //vis.array.deselect(0, i + 1);
                            vis.array.select(0, i + 1, 0, i + 1, '1');
                          }
                        }  

                      },
                      [n, m, lastNeighbor, parent, visited, explored]
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
                        (vis, x, y, z, a, b, c_m, d) => { 
                          vis.array.set(x, 'DFS');
                          //add a string "n" below the currently popped out node
                          vis.array.assignVariable('n', 2, b + 1); 
                          vis.array.assignVariable('m', 2, c_m + 1);
          
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
                          vis.graph.removeEdgeColor(d, c_m);

                          //highlight the edge from n to this neighbor in red
                          vis.graph.removeEdgeColor(b, c_m);
                          vis.graph.colorEdge(b, c_m, 3);
                          
                          
                          vis.array.setList(y); 
                        },
                        [[displayedNodes, displayedParent, displayedVisited], displayedStack, explored, visited, n, m, lastParent]
                      );




                        // Parent[m] = n;
                        // push(Nodes,m) B18
                        Nodes.push(m); 
                        displayedStack = Nodes.toReversed();
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
        //return B5
        chunker.add(
          5,
          (vis, x, y, z, a, b) => { 
            //remove the orange highlight from the last neighbour
            // not needed??
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
          },
          [n, lastNeighbor, parent, start, end]
        );
    };
    /*
    for (let i = 0; i < numVertices; i++) {
        // If not Finalised[m]
        if (!visited[i]) {
            dfs(i);
        }
    }*/ 

    dfs(start); 
   
  }

  
};
