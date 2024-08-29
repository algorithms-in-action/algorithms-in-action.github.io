// XXX add support for multiple end nodes?
// XXX see README_graph_search
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
        instance: new Array2DTracer('array', null, 'Parent array, Seen array & Queue'),
        order: 1,
      }, 
    };
  },

  run(chunker, { edgeValueMatrix, coordsMatrix, endNodes, startNode, moveNode}) {

    //Defining queue
    function Queue() {
      this.items = [];
    }

    // Enqueue function to add an item to the end of the queue
    Queue.prototype.enqueue = function(item) {
        this.items.push(item);
    }

    // Dequeue function to remove an item from the front of the queue
    Queue.prototype.dequeue = function() {
        if(this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    // Helper function to check if the queue is empty
    Queue.prototype.isEmpty = function() {
        return this.items.length == 0;
    }

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;   
    //The real Seen array(visited) and Parent array(parent)
    const visited = new Array(numVertices).fill(false); 
    const parent = new Array(numVertices).fill(null);
    const explored = new Array(numVertices).fill(false); 

    //The fake ones for display
    const displayedVisited = []; 
    const displayedParent = []; 
    const displayedNodes = [];
    const seen = [];  
    let displayedQueue = [];

    const start = startNode - 1;
    const end = endNodes[0] - 1; 

    let lastNeighbor = null;
    let n = null;

    // BFS(G, s) B1
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
    displayedVisited.push('Seen[i]'); 
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
        vis.array.set(x, 'BFS');   
      },
      [[displayedNodes, displayedParent, displayedVisited]]
    );

    // initialise each element of Seen to  B7
    for (let i = 0; i < numVertices; i += 1) {
      displayedVisited[i + 1] = "false";  
    }

    chunker.add(
      7,
      (vis, x) => { 
        vis.array.set(x, 'BFS');  
      },
      [[displayedNodes, displayedParent, displayedVisited]]
    );

    const bfs = (s) => {

      const Nodes = [s];      
        // Seen[s] <- True B8
        visited[s] = true;
        displayedVisited[s+1] = "true";
        explored[s] = false;
        seen.push(s);

        chunker.add(
          8,
          (vis, x, y) => { 
            vis.array.set(x, 'BFS');
            vis.array.setList(y); 
            
            // select start node in blue
            vis.array.select(0, s + 1, 0, s + 1, colors.FRONTIER_A);
            vis.graph.colorNode(s, colors.FRONTIER_N);
            },
            [[displayedNodes, displayedParent, displayedVisited], displayedQueue]
        );       

        // Nodes <- queue containing just s B9
        //The real queue
        //const Nodes = [s];  
        explored[s] = true;
        displayedQueue = [];
        displayedQueue.push(s+1);
        chunker.add(
          9,
          (vis, x, y, z, Nodes) => { 
            // Graph and array have been updated above

            vis.array.setList(y);  // updated Queue
          },
          [[displayedNodes, displayedParent, displayedVisited], displayedQueue, explored, Nodes]
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
            (vis, c_n, c_lastNei, c_parent, c_visited, c_Nodes) => {
              // removes m if it exists; need to redo node selection etc
              // for green nodes:
              vis.array.assignVariable('m', 2, undefined); // removes m if there
              // highlight all nodes explored in green in the array
              // and all other seen nodes in blue in the array
              for(let i = 0; i < c_visited.length; i++)
              {
                if(c_visited[i] == true)
                  if(!c_Nodes.includes(i)) {
                    vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
                  } else {
                    // vis.array.deselect(0, i + 1);
                    vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
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
            [n, lastNeighbor, parent, visited, Nodes]
          );
          if (!(Nodes.length > 0))
            break;

          // n <- dequeue(Nodes) B10
          n = Nodes.shift();  
          displayedQueue.shift();
          chunker.add(
            10,
            (vis, x, c_n, z, a, b, c_parent, Nodes) => {
              //reset
              vis.array.set(x,'BFS');  
              //add a string "n" below the currently popped out node
              vis.array.assignVariable('n', 2, c_n + 1);

              // highlight all frontier nodes
              for (let i = 0; i < a.length; i ++){
                if(a[i] == true && Nodes.includes(i)){
                  vis.array.select(0,i + 1, 0, i + 1, colors.FRONTIER_A);
                  // vis.array.select(0,i + 1, 0, i + 1, '1');
                  
                }
              }

              // highlight all other finalised nodes
              for(let i = 0; i < b.length; i++)
              { 
                if(b[i] == true && !Nodes.includes(i))
                { 
                  vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
                  vis.graph.removeNodeColor(i);  
                  vis.graph.colorNode(i, colors.FINALISED_N);
                }
              }

              // finalise edge color to n from parent
              if (c_parent[c_n] !== null) {
                vis.graph.removeEdgeColor(c_n, c_parent[c_n]);
                vis.graph.colorEdge(c_n, c_parent[c_n], colors.FINALISED_E);
              }
              
              //redisplay queue
              vis.array.setList(z);
            },
            [[displayedNodes, displayedParent, displayedVisited], n,
              displayedQueue, explored, visited, parent, Nodes]
          ); 

          // If is_end_node(n) B11  
          chunker.add(
            11  
          );
          if(n == end)
          { 
            // return B3
            chunker.add(
              3,
              (vis, x, y, c_parent, a, c_end) => { 
                //remove the orange highlight from the last neighbour
                // XXX not needed?
                if (y != null)
                {
                  vis.graph.removeEdgeColor(y, x); 
        
                  // recolor in red if it has a parent
                  if(c_parent[y] != null) 
                  {
                    vis.graph.removeEdgeColor(c_parent[y], y);
                    vis.graph.colorEdge(c_parent[y], y , colors.FRONTIER_E);
                  } 
        
                  // recolor in red if it has a child
                  for(let i = 0; i < c_parent.length; i ++){
                    if (c_parent[i] == y){
                      vis.graph.removeEdgeColor(i, y);
                      vis.graph.colorEdge(i, y, colors.FRONTIER_E);
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
                // + color nodes and parent array
                while((current != a) && (c_parent[current] != null))
                { 
                  vis.array.select(0, current + 1, 0, current + 1, colors.SUCCESS_A);
                  vis.array.select(1, current + 1, 1, current + 1, colors.SUCCESS_A);
                  vis.graph.removeEdgeColor(current, c_parent[current]);
                  vis.graph.colorEdge(current, c_parent[current], colors.SUCCESS_E); 
                  current = c_parent[current];
                }
                // also color start node
                vis.array.select(0, start + 1, 0, start + 1, colors.SUCCESS_A);
              },
              [n, lastNeighbor, parent, start, end]
   
            ) ;
            return;
          }

          // for each node m neighbouring n B4
          lastNeighbor = null;
          for (let m = 0; m < numVertices; m++) {  

            if (E[n][m] != 0) {

              chunker.add(
                4,
                (vis, c_n, c_m, c_lastNei, c_parent, c_visited, c_Nodes) => {
                  // remove the highlight between n
                  // and the last visited neighbor
                  if((c_n != null) && (c_lastNei != null)) {
                    vis.graph.removeEdgeColor(c_n, c_lastNei); 
                    if (c_parent[c_n] === c_lastNei)
                      vis.graph.colorEdge(c_n, c_lastNei, colors.FINALISED_E);
                    else if (c_parent[c_lastNei] === c_n)
                      vis.graph.colorEdge(c_n, c_lastNei, colors.FRONTIER_E);
                  } 

                  //highlight the edge connecting the neighbor
                  vis.graph.removeEdgeColor(c_n,c_m);
                  // color 2 = orange doesn't show up well - 4 = green better?
                  vis.graph.colorEdge(c_n, c_m, colors.N_M_E);

                  // add var m; need to color elements again
                  vis.array.assignVariable('m', 2, c_m + 1);
                  // highlight all nodes explored in green in the array
                  // and all other seen nodes in blue in the array
                  for(let i = 0; i < c_visited.length; i++)
                  {
                    if(c_visited[i] == true)
                      if(!c_Nodes.includes(i)) {
                        vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
                      } else {
                        // vis.array.deselect(0, i + 1);
                        vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                      }
                  }
                },
                [n, m, lastNeighbor, parent, visited, Nodes]
              ); 

                  lastNeighbor = m;
                  // If not Seen[m] B12
                  chunker.add(
                    12,
                  );
                  if (!visited[m]) { 

                    // Seen[m] <- True B13
                    visited[m] = true;
                    displayedVisited[m+1] = "true";
                    explored[m] = false;
                    seen.push(m);
                    chunker.add(
                      13,
                      (vis, x, y, c_explored, c_visited, c_n, c_m, c_Nodes) => {
                          vis.array.set(x, 'BFS');
                          //add a string "n" below the currently popped out node
                          vis.array.assignVariable('n', 2, c_n + 1);
                          vis.array.assignVariable('m', 2, c_m + 1);

                          // console.log(c_explored);
                          // console.log(c_m);
                          // highlight all nodes explored in green in the array
                          // and all other seen nodes in blue in the array
                          // Pretend m is in Nodes for colouring purposes
                          // (it's about to be added)
                          for(let i = 0; i < c_visited.length; i++)
                          {
                            if(c_visited[i] == true)
                              if(!(c_Nodes.includes(i) || i === c_m)) {
                                vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
                              } else {
                                // vis.array.deselect(0, i + 1);
                                vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                              }
                          }
                          vis.array.setList(y);

                          // color the graph node in blue as seen
                          vis.graph.removeNodeColor(c_m);
                          vis.graph.colorNode(c_m, colors.FRONTIER_N);
                      },

                      [[displayedNodes, displayedParent, displayedVisited], displayedQueue, explored, visited, n, m, Nodes]
                    );

                    // Parent[m] <- n B14 
                    let lastParent = parent[m];
                    parent[m] = n;
                    displayedParent[m + 1] = n + 1;
                    chunker.add(
                      14,
                      (vis, x, y, z, a, b, c, d, Nodes) => { 
                          vis.array.set(x, 'BFS');
                          //add a string "n" below the currently popped out node
                          vis.array.assignVariable('n', 2, b + 1);
                          vis.array.assignVariable('m', 2, c + 1);

                          // console.log(z);
                          // console.log(c);
                          // highlight all nodes explored in green in the array
                          // and all other seen nodes in blue in the array
                          for(let i = 0; i < a.length; i++)
                          {
                            if(z[i] == true || i === c)
                              if(i !==c && !Nodes.includes(i)) {
                                vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
                              } else {
                                // vis.array.deselect(0, i + 1);
                                vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                              }
                          }
                          vis.array.setList(y);
                        
                        //remove the highlight from this neighbour to its last parent
                        vis.graph.removeEdgeColor(d, c);

                        //highlight the edge from n to this neighbor in red
                        vis.graph.removeEdgeColor(b, c);
                        vis.graph.colorEdge(b, c, colors.FRONTIER_E);
                        
                        
                        // vis.array.set(x, 'BFS');
                        vis.array.setList(x); 
                        vis.array.setList(y); 
                      },
                      [[displayedNodes, displayedParent, displayedVisited], displayedQueue, explored, visited, n, m, lastParent, Nodes]
                    );   
      
                      // enqueue(Nodes,m) B15
                      Nodes.push(m); 
                      displayedQueue.push(m + 1);  
                      explored[m] = true;
                      chunker.add(
                        15,
                        (vis, x, y, z, Nodes) => {
                          vis.array.setList(x);
                          
                          // color the node in green as explored 
                          // if it has not been seen
                          if(y[z] == false && Nodes.includes(z)){
                            vis.array.deselect(0, z + 1);
                            vis.array.select(0, z + 1, 0, z + 1, colors.FINALISED_A); 
                            //vis.graph.removeNodeColor(z);
                            //vis.graph.colorNode(z, 4);
                          }
                          
                        },
                        [displayedQueue, visited, m, Nodes]
                      );
                  }
              }
          }
        }
        // no path found
        //return B5
          chunker.add(
            5,
            (vis, c_n, c_lastNei, c_parent, c_visited, c_Nodes) => {
              // We don't actually need to do anything here if we have a
              // chunk before breaking out of the outer while loop, but
              // it does no harm and we need to fix one edge color at
              // least if we don't use the break coding.
              //
              // removes m if it exists; need to redo node selection etc
              // for green nodes:
              vis.array.assignVariable('m', 2, undefined); // removes m if there
              vis.array.assignVariable('n', 2, undefined); // removes n
              // highlight all nodes explored in green in the array
              // and all other seen nodes in blue in the array
              for(let i = 0; i < c_visited.length; i++)
              {
                if(c_visited[i] == true)
                  if(!c_Nodes.includes(i)) {
                    vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
                  } else {
                    // vis.array.deselect(0, i + 1);
                    vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
                  }
              }

              // remove the highlight between n
              // and the last visited neighbor (XXX not needed?)
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
            [n, lastNeighbor, parent, visited, Nodes]
          );
    }; // End of bfs    

    bfs(start);
  }
};
