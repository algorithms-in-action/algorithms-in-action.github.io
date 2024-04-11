// XXX add support for multiple end nodes
// XXX see README_graph_search
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
        instance: new Array2DTracer('array', null, 'Parent array, Seen array & Queue'),
        order: 1,
      }, 


    };
  },

  run(chunker, { edgeValueMatrix, coordsMatrix, endNodes, startNode}) {

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
    let n = null

    // BFS(G, s) B1
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
          (vis, x, y, z, a, b) => { 
            vis.array.set(x, 'BFS');
            vis.array.setList(y); 
            
            // select start node in blue
            vis.array.select(0,b + 1);
            vis.graph.colorNode(b, 4);
            },
            [[displayedNodes, displayedParent, displayedVisited], displayedQueue, explored, visited, s, Nodes]
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
        while (Nodes.length > 0) {
          chunker.add(
            2,
            (vis, c_n, y, z, c_visited, c_Nodes) => {
              // removes m if it exists; need to redo node selection etc
              // for green nodes:(
              vis.array.assignVariable('m', 2, undefined); // removes m if there
              // highlight all nodes explored in green in the array
              // and all other seen nodes in blue in the array
              for(let i = 0; i < c_visited.length; i++)
              {
                if(c_visited[i] == true)
                  if(!c_Nodes.includes(i)) {
                    vis.array.select(0, i + 1, 0, i + 1, '1');
                    // console.log(['Green', i+1]);
                  } else {
                    // vis.array.deselect(0, i + 1);
                    vis.array.select(0, i + 1);
                    // console.log(['Blue', i+1]);
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
            [n, lastNeighbor, parent, visited, Nodes]
            
          );

          // n <- dequeue(Nodes) B10
          n = Nodes.shift();  
          displayedQueue.shift();
          chunker.add(
            10,
            (vis, x, y, z, a, b, Nodes) => { 
              //reset
              vis.array.set(x,'BFS');  
              //add a string "n" below the currently popped out node
              vis.array.assignVariable('n', 2, y + 1);
              
              // highlight all finalised nodes in blue
              for (let i = 0; i < a.length; i ++){
                if(a[i] == true && Nodes.includes(i)){
                  vis.array.select(0,i + 1);
                                console.log(['Blue?', i+1]);
                  // vis.array.select(0,i + 1, 0, i + 1, '1');
                  
                }
              }

              // highlight all other seen nodes in green
              for(let i = 0; i < b.length; i++)
              { 
                if(b[i] == true && !Nodes.includes(i))
                { 
                                console.log(['Green?', i+1]);
                  vis.array.select(0, i + 1, 0, i + 1, '1');
                  vis.graph.removeNodeColor(i);  
                  vis.graph.colorNode(i, 1);
                }
              }
              
              //redisplay queue
              vis.array.setList(z);
            },
            [[displayedNodes, displayedParent, displayedVisited], n, displayedQueue, explored, visited, Nodes]
          ); 

          // If is_end_node(n) B11  
          chunker.add(
            11  
          );
          if(n == end)
          { 
            chunker.add(
              3,
            ); 
            // return B3
            chunker.add(
              3,
              (vis, x, y, z, a, b) => { 
                //remove the orange highlight from the last neighbour
                // XXX not needed?
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
                let current = b;
                while((current != a) && (z[current] != null))
                { 
                  vis.graph.removeEdgeColor(current, z[current]);
                  vis.graph.colorEdge(current, z[current], 1); 
                  current = z[current];
                }
              },
              [n, lastNeighbor, parent, start, end]
   
            ) ;
            return;
          }

          // for each node m neighbouring n B4
          for (let m = 0; m < numVertices; m++) {  

            if (E[n][m] != 0) {

              chunker.add(
                4,
                (vis, c_n, c_m, z, a, c_visited, c_Nodes) => {
                  //remove the color on Edge connecting the last neighbor 
                  
                  

                  //remove the orange highlight from the edge connecting the last neighbour
                  if (z != null)
                  {
                    vis.graph.removeEdgeColor(c_n, z); 

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
                  vis.graph.removeEdgeColor(c_n,c_m);
                  vis.graph.colorEdge(c_n, c_m, 2);

                  // add var m; need to color elements again:(
                  vis.array.assignVariable('m', 2, c_m + 1);
                  // highlight all nodes explored in green in the array
                  // and all other seen nodes in blue in the array
                  for(let i = 0; i < c_visited.length; i++)
                  {
                    if(c_visited[i] == true)
                      if(!c_Nodes.includes(i)) {
                        vis.array.select(0, i + 1, 0, i + 1, '1');
                        // console.log(['Green', i+1]);
                      } else {
                        // vis.array.deselect(0, i + 1);
                        vis.array.select(0, i + 1);
                        // console.log(['Blue', i+1]);
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
                                vis.array.select(0, i + 1, 0, i + 1, '1');
                                // console.log(['Green', i+1]);
                              } else {
                                // vis.array.deselect(0, i + 1);
                                vis.array.select(0, i + 1);
                                // console.log(['Blue', i+1]);
                              }
                          }
                          vis.array.setList(y);

                          // color the graph node in blue as seen
                          vis.graph.removeNodeColor(c_m);
                          vis.graph.colorNode(c_m, 4);
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


                          console.log(z);
                          console.log(c);
                          // highlight all nodes explored in green in the array
                          // and all other seen nodes in blue in the array
                          for(let i = 0; i < a.length; i++)
                          {
                            if(z[i] == true || i === c)
                              if(i !==c && !Nodes.includes(i)) {
                                vis.array.select(0, i + 1, 0, i + 1, '1');
                                console.log(['Green', i+1]);
                              } else {
                                // vis.array.deselect(0, i + 1);
                                vis.array.select(0, i + 1);
                                console.log(['Blue', i+1]);
                              }
                          }
                          vis.array.setList(y);
                        
                        //remove the highlight from this neighbour to its last parent
                        vis.graph.removeEdgeColor(d, c);

                        //highlight the edge from n to this neighbor in red
                        vis.graph.removeEdgeColor(b, c);
                        vis.graph.colorEdge(b, c, 3);
                        
                        
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
                            vis.array.select(0, z + 1, 0, z + 1, '1'); 
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
          (vis, x, y, z, a, b) => { 
            //remove the orange highlight from the last neighbour
            // XXX not needed?
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

        ) ;
    }; // End of bfs    


    bfs(start);

  }

};

// green vis.array.select(0, i + 1, 0, i + 1, '1');
// blue vis.array.select(0,i + 1);
// red vis.array.select(0, i + 1, 0, i + 1, '4');
//     for (let i = 0; i < numVertices; i++) { // For each vertex v
//       if (!visited[i]) { // If v is not Seen
//         bfs(i); // Call BFS starting from v
//       }
//     }
//   }
// };
