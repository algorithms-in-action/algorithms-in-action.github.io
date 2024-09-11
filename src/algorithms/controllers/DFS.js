// XXX add support for multiple end nodes?
// XXX see README_graph_search - this code is a nightmare to maintain
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import {colors} from './graphSearchColours';

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

  run(chunker, { edgeValueMatrix, coordsMatrix, endNodes, startNode, moveNode}) {

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
        vis.graph.moveNodeFn(moveNode);
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
        displayedStack = Nodes.toReversed().map(i => i+1);
        explored[s] = true;
        chunker.add(
          8,
          (vis, x, y, z) => { 
            
            vis.array.set(x, 'DFS');  
            vis.array.setList(y);  

            // select start node in blue
            vis.array.select(0, s + 1, 0, s + 1, colors.FRONTIER_A);
            vis.graph.colorNode(s, colors.FRONTIER_N);
          },
          [[displayedNodes, displayedParent, displayedVisited], displayedStack, explored]
        );  


        // while Nodes not empty B2
        // ?nice to have while true and break out of the
        // loop after the chunk (conditionally) so when the loop exits
        // we have an extra chunk at the start of the loop
        // while (Nodes.length > 0)
        /* eslint-disable no-constant-condition */
        while (true) {
            chunker.add(
              2,
              (vis, c_n, c_lastNei, c_parent, c_visited, c_explored) => {
                // removes m if it exists; need to redo colors
                // for green nodes:
                vis.array.assignVariable('m', 2, undefined); // removes m if there
                //highlight all nodes explored in blue 
                //
                for (let i = 0; i < c_explored.length; i ++){
                  if(c_explored[i] == true){
                    vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                    
                  }
                }
                //highlight all finalized nodes in green
                for(let i = 0; i < c_visited.length; i++)
                { 
                  if(c_visited[i] == true)
                  { 
                    //vis.array.deselect(0, i + 1);
                    vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
                  }
                }  

                // remove the highlight between n
                // and the last visited neighbor
                if((c_n != null) && (c_lastNei != null)) {
                  vis.graph.removeEdgeColor(c_n, c_lastNei);  
                  if((c_n != null) && (c_lastNei != null)){
                    vis.graph.removeEdgeColor(c_n, c_lastNei);  
                    if (c_parent[c_lastNei] === c_n)
                      vis.graph.colorEdge(c_n, c_lastNei, colors.FRONTIER_E);
                    else if (c_parent[c_n] === c_lastNei)
                      vis.graph.colorEdge(c_n, c_lastNei, colors.FINALISED_E);
                  } 
                } 
              },
              [n, lastNeighbor, parent, visited, explored]
              
              );
            if (!(Nodes.length > 0))
              break;

            // n <- pop(Nodes) B9
            n = Nodes.pop();  
            displayedStack = Nodes.toReversed().map(i => i+1);
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
                    vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                    
                  }
                }

                //highlight all finalized nodes in green
                for(let i = 0; i < c_visited.length; i++)
                { 
                  if(c_visited[i] == true)
                  { 
                    //vis.array.deselect(0, i + 1);
                    vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
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
                      (vis, x, a, b) => { 

                        vis.array.set(x, 'DFS');
                        // remove 'n'
                        vis.array.assignVariable('n', 2, undefined); 

                        //highlight all finalized nodes in green in the array
                        for(let i = 0; i < a.length; i++)
                        { 
                          if(a[i] == true)
                          { 
                            vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);  
                          }
                        }  
                      },
                      [[displayedNodes, displayedParent, displayedVisited], visited]
                    );
                    return;
                }
                // n <- pop(Nodes) B13
                n = Nodes.pop();  
                displayedStack = Nodes.toReversed().map(i => i+1);
                chunker.add(
                  13,
                  (vis, x, c_n, z, a, b) => { 
                    //reset
                    vis.array.set(x,'DFS');  
                    //add a string "n" below the currently popped out node
                    vis.array.assignVariable('n', 2, c_n + 1);  
                    
                    //highlight all nodes explored in blue 
                    //
                    for (let i = 0; i < a.length; i ++){
                      if(a[i] == true){
                        vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                        
                      }
                    }

                    //highlight all finalized nodes in green
                    for(let i = 0; i < b.length; i++)
                    { 
                      if(b[i] == true)
                      { 
                        vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);  
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
              (vis, x, y, z, a, c_n, c_parent) => { 
                vis.array.set(x, 'DFS');
                //add a string "n" below the currently popped out node
                vis.array.assignVariable('n', 2, c_n + 1); 

                //highlight all nodes explored in blue in the array
                //
                for (let i = 0; i < z.length; i ++){
                  if(z[i] == true){
                    vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                    //vis.graph.colorNode(i, 4);
                  }
                }

                //highlight all finalized nodes in green in the array
                for(let i = 0; i < a.length; i++)
                { 
                  if(a[i] == true)
                  { 
                    vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);  
                  }
                }  

                //changed the finalized node's highlight color to green in the graph
                vis.graph.removeNodeColor(c_n); 
                vis.graph.colorNode(c_n, 1);
                // finalise edge color to n from parent
                if (c_parent[c_n] !== null) {
                  vis.graph.removeEdgeColor(c_n, c_parent[c_n]);
                  vis.graph.colorEdge(c_n, c_parent[c_n], colors.FINALISED_E);
                }
                
                vis.array.setList(y); 
              },
              [[displayedNodes, displayedParent, displayedVisited],
displayedStack, explored, visited, n, parent]
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
                  // + color nodes and parent array
                  while((current != a) && (c_parent[current] != null))
                  {
                    vis.array.select(0, current + 1, 0, current + 1, colors.SUCCESS_A);
                    vis.array.select(1, current + 1, 1, current + 1, colors.SUCCESS_A);
                    vis.graph.removeEdgeColor(current, c_parent[current]);
                    vis.graph.colorEdge(current, c_parent[current], colors.SUCCESS_E);
                    current = c_parent[current];
                  }
                  // color start node
                  vis.array.select(0, start + 1, 0, start + 1, colors.SUCCESS_A);
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
            lastNeighbor = null;
            for (let m = 0; m < numVertices; m++) {  
              
              if (E[n][m] != 0) {

                    chunker.add(
                      4,
                      (vis, c_n, c_m, c_lastNei, c_parent, c_visited, c_explored) => {
                        // remove the highlight between n
                        // and the last visited neighbor
                        if((c_n != null) && (c_lastNei != null)) {
                          vis.graph.removeEdgeColor(c_n, c_lastNei);  
                          if (c_parent[c_lastNei] === c_n)
                            vis.graph.colorEdge(c_n, c_lastNei, colors.FRONTIER_E);
                          else if (c_parent[c_n] === c_lastNei)
                            vis.graph.colorEdge(c_n, c_lastNei, colors.FINALISED_E);
                        } 

                        //highlight the edge connecting the neighbor
                        vis.graph.removeEdgeColor(c_n,c_m);
                        vis.graph.colorEdge(c_n, c_m, 2);
                        vis.graph.colorEdge(c_n, c_m, colors.N_M_E);

                        // add var m; need to color elements again
                        vis.array.assignVariable('m', 2, c_m + 1);
                        //highlight all nodes explored in blue 
                        //
                        for (let i = 0; i < c_explored.length; i ++){
                          if(c_explored[i] == true){
                            vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                            
                          }
                        }
                        //highlight all finalized nodes in green
                        for(let i = 0; i < c_visited.length; i++)
                        { 
                          if(c_visited[i] == true)
                          { 
                            //vis.array.deselect(0, i + 1);
                            vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
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
                              vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                              //vis.graph.colorNode(i, 4);
                            }
                          }
          
                          //highlight all finalized nodes in green in the array
                          for(let i = 0; i < a.length; i++)
                          { 
                            if(a[i] == true)
                            { 
                              vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);  
                            }
                          }  
                          
                          //remove the highlight from this neighbour to its last parent
                          vis.graph.removeEdgeColor(d, c_m);

                          //highlight the edge from n to this neighbor
                          vis.graph.removeEdgeColor(b, c_m);
                          vis.graph.colorEdge(b, c_m, colors.FRONTIER_E);
                          // change color of this neighbor
                          vis.array.deselect(0, c_m + 1);
                          vis.array.select(0, c_m + 1, 0, c_m + 1, colors.FRONTIER_A);
                          vis.graph.removeNodeColor(c_m);
                          vis.graph.colorNode(c_m, colors.FRONTIER_E);
                          
                          
                          vis.array.setList(y); 
                        },
                        [[displayedNodes, displayedParent, displayedVisited], displayedStack, explored, visited, n, m, lastParent]
                      );




                        // Parent[m] = n;
                        // push(Nodes,m) B18
                        Nodes.push(m); 
                        displayedStack = Nodes.toReversed().map(i =>
i+1);
                        explored[m] = true;
                        chunker.add(
                          18,
                          (vis, x, y, z) => {
                            vis.array.setList(x);
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
          (vis, x, a, b) => { 

            vis.array.set(x, 'DFS');
            // remove 'n'
            vis.array.assignVariable('n', 2, undefined); 

            //highlight all finalized nodes in green in the array
            for(let i = 0; i < a.length; i++)
            { 
              if(a[i] == true)
              { 
                vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);  
              }
            }  
          },
          [[displayedNodes, displayedParent, displayedVisited], visited]
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
