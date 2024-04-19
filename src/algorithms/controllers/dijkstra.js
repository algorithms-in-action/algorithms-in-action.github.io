// XXX termination when there is no end node needs fixing
// XXX add extra highlighting of code etc for UpdateNodes, like BFS
// XXX add support for multiple end nodes
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import {colors} from './graphSearchColours';

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('graph', null, 'Graph view', { displayAxis : false }),
        order: 0,
      },
      array: {
        instance: new Array2DTracer('array', null, 'Parent array & Priority Queue'),
        order: 1,
      },
    };
  },

  run(chunker, { edgeValueMatrix, coordsMatrix, /*matrix,*/ startNode, endNodes}) {
    // String Variables used in displaying algo
    const algNameStr = 'dijkstra';
    const dashStr = '-';
    const minStr = 'Min'; 
    const nStr = 'n';
    const mStr = 'm';
    const infinityStr = '∞';
    const lessThanStr = '<';
    const notLessThanStr = '≮';

    const numVertices = edgeValueMatrix ? edgeValueMatrix.length : 0;
    const E = Array.isArray(edgeValueMatrix) ? [...edgeValueMatrix] : [];
    const coords = Array.isArray(coordsMatrix) ? [...coordsMatrix] : [];

    const minCosts = [];
    const parents = [];
    const nodes = [];  
    const finalCosts = []; 
    const start = startNode - 1; 
    const end = endNodes[0] - 1;
    // Create a set to keep track of visited vertices
    const visited = new Set();  
    let miniIndex = start;  
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

    // If the node cost is a number, the node is in the PQ but not Infinity
    // (can be null, Infinity or some expression for comparison) - used
    // for checking if a node is in the frontier
    const isNumber = (value) =>
    {
       return typeof value === 'number' && isFinite(value);
    }

    // refresh display.  Ideally one would think we could do incremental
    // changes but there are all kinds of subtelties like what triggers
    // re-rendering, some selected colors vanishing with some apparently
    // unrelated operations, etc.  For sanity, and to avoid code thats
    // duplicated countless times, we put lots of it here. And we name
    // the parameters something more readable than x,y,z,z1,a,b,c etc...
    // c_nodes_etc: 2D array with node number, parents etc
    // c_Min: miniIndex
    // c_cV: currentVertex
    // c_m: m (neighbour of currentVertex)
    const refresh = (vis, c_nodes_etc, c_Min, c_cV, c_m) => {
      vis.array.set(c_nodes_etc, algNameStr);
      // set n, m, Min as required
      let c_m1 = (c_m === null? null: c_m+1);
      let c_cV1 = (c_cV === null? null: c_cV+1);
      let c_Min1 = (c_Min === null? null: c_Min+1);
      vis.array.assignVariable(nStr, 2, c_cV1);
      vis.array.assignVariable(mStr, 2, c_m1);
      vis.array.assignVariable(minStr, 2, c_Min1); 

      // highlight nodes as finalised/frontier in array
      for (let i = 0; i < numVertices; i++) {
        if (c_nodes_etc[2][i+1] === null) {
          vis.array.select(0, i + 1, 0, i + 1, colors.FINALISED_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FINALISED_N);
        } else if (isNumber(c_nodes_etc[2][i+1])) {
          vis.array.select(0, i + 1, 0, i + 1, colors.FRONTIER_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FRONTIER_N);
        }
      }

      // color Min in PQ
      if (c_Min != null)
        vis.array.select(2, c_Min + 1, 2, c_Min + 1, colors.PQ_MIN_A);
    }

    chunker.add(
      1,
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
      },
      [E, coords]
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
      [[nodes, parents, minCosts, finalCosts],0]
    );
    
  
    // Cost[s] <- 0
    cost[start] = 0;
    minCosts[start + 1] = 0; 
    chunker.add(
      7,
      (vis, v, w) => {
        vis.array.set(v, algNameStr);
        vis.array.assignVariable(minStr, 2, w + 1);
        vis.array.select(2, w + 1, 2, w + 1, colors.PQ_MIN_A);

        // color start node in array + graph
        vis.array.select(0, w + 1, 0, w + 1, colors.FRONTIER_A);
        vis.graph.colorNode(w, colors.FRONTIER_N);
        
      },
      [[nodes, parents, minCosts, finalCosts], start]
    );

    // Nodes <- PQ containing all nodes 
    chunker.add(8);

    let currentVertex = null;
    // while Nodes not Empty 
    // while (visited.size < numVertices) { 
    // extra chunk before break to make loop termination clearer
    /* eslint-disable no-constant-condition */
    while (true) {
      
      findMinimum(); 
      
      chunker.add( 
        2,
        (vis, c_nodes_etc, c_miniIndex, c_last, c_prev, c_cV) => {
          refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null);
          // visit1(x,y,2) highlights the edge xy,and nodes x and y
          // in the 2nd color 
          // leave1(x,y,2) removes the highlight on nodes x, y and 
          // edge xy(placed by the visit1 function in the 2nd color)
          if (c_last[0] != null) {
            vis.graph.removeEdgeColor(c_last[0], c_last[1]); 

            
            
            // restore the original color of the edge
            if(c_prev[c_last[0]] != null && c_nodes_etc[3][c_last[0]+1] == dashStr)
            {
              vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
              vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FRONTIER_E);
            }

            if(c_prev[c_last[1]] != null && c_nodes_etc[3][c_last[1]+1] == dashStr)
            {
              vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
              vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FRONTIER_E);
            }

            if(c_nodes_etc[3][c_last[0]+1] != dashStr)
            {
              vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
              vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FINALISED_E);
            }

            if(c_nodes_etc[3][c_last[1]+1] != dashStr)
            {
              vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
              vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FINALISED_E);
            }

          }

        },
        [[nodes, parents, minCosts, finalCosts], miniIndex, last, prev, currentVertex]
      );
      if (!(visited.size < numVertices))
        break;

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
        (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV) => {
          // color graph node
          //vis.graph.colorNode(c_cV, colors.FINALISED_N);

          // reset
          if (c_prev_cV != null) {
            vis.graph.removeEdgeColor(c_prev_cV, c_cV);
            // vis.graph.colorNode(c_prev_cV, 1);
            // vis.graph.colorEdge(c_prev_cV, c_cV, 1);
            vis.graph.colorEdge(c_prev_cV, c_cV, colors.FINALISED_E);
            //vis.graph.deselect(y, x); 
            //vis.graph.select(y, y);
            //vis.graph.visit1(y, x, 1); 
            //vis.graph.leave1(x, x, 1); 
            //vis.graph.leave1(y, y, 1);
          }
          // vis.graph.colorNode(c_cV, 1);
          //vis.graph.select(x, x);

          refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null);
        },
        [[nodes, parents, minCosts, finalCosts], miniIndex, 
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
        if (edgeValueMatrix[currentVertex][m] !== 0) { //TODO: check
            // && !visited.has(m)) {  // Skip if no edge exists
          // findMinimum();
          chunker.add(
            4,
            (vis, v, c_miniIndex, c_last, c_prev, c_cV, c_m) => {
              if (c_last[0] != null) { 
                vis.graph.removeEdgeColor(c_last[0], c_last[1]);
                //vis.graph.leave1(c_last[0], c_last[1], 2); 
                if(c_prev[c_last[0]] != null && v[3][c_last[0]+1] == dashStr)
                {
                  vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
                  vis.graph.colorEdge(c_prev[c_last[0]], c_last[0],
colors.FRONTIER_E);
                }

                if(c_prev[c_last[1]] != null && v[3][c_last[1]+1] == dashStr)
                {
                  vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
                  vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FRONTIER_E);
                }

                if(v[3][c_last[0]+1] != dashStr)
                {
                  vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
                  vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FINALISED_E);
                }

                if(v[3][c_last[1]+1] != dashStr)
                {
                  vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
                  vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FINALISED_E);
                }
              } 

              
              // console.log(['vis.graph.colorEdge', c_cV, c_m, colors.N_M_E]);
              vis.graph.removeEdgeColor(c_cV, c_m);
              vis.graph.colorEdge(c_cV, c_m, colors.N_M_E);

              refresh(vis, v, c_miniIndex, c_cV, c_m);


            },
            [[nodes, parents, minCosts, finalCosts], miniIndex, last, prev, currentVertex,
            m]
          );
          
          const newCost = cost[currentVertex] + edgeValueMatrix[currentVertex][m]; //TODO: check
          
          // if Cost[n]+weight(n,m)<Cost[m]
          let tempString = minCosts[m + 1];
          if (minCosts[m + 1] === Infinity) {
            tempString = infinityStr;
          }
          if (!visited.has(m)) {
            if (newCost < cost[m]) {
              minCosts[m + 1] = (`${newCost} ${lessThanStr} ${tempString}`);
            } else {
              minCosts[m + 1] = (`${newCost} ${notLessThanStr} ${tempString}`);
            }
          }
          
          // findMinimum();
          chunker.add(
            11,
            (vis, v, c_miniIndex, c_cV, c_m) => {
              refresh(vis, v, c_miniIndex, c_cV, c_m);
            },
            [[nodes, parents, minCosts, finalCosts], miniIndex,
                currentVertex, m]
          ); 

           if (!visited.has(m))
            minCosts[m + 1] = cost[m];

          last = [currentVertex, m];
          
          if (!visited.has(m) && newCost < cost[m]) {
            // Cost[m] <- Cost[n] + weight(n,m)
            cost[m] = newCost; 
            minCosts[m + 1] = newCost;
            // findMinimum();
            chunker.add(
              12,
              (vis, c_nodes_etc, c_miniIndex, c_cV, c_m) => {
                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, c_m);
              },
              [[nodes, parents, minCosts, finalCosts], miniIndex, currentVertex, m]
            );

            // UpdateCost(Nodes,m,Cost[m])
            findMinimum();
            chunker.add(
              13,
              (vis, c_nodes_etc, c_miniIndex, c_cV, c_m) => {
                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, c_m);
              },
              [[nodes, parents, minCosts, finalCosts], miniIndex, currentVertex, m]
            );

            // Parent[m] <- n
            parents[m + 1] = currentVertex + 1;
            const lastParent = prev[m];
            prev[m] = currentVertex;   
          
            // findMinimum();
            chunker.add(
              14,
              (vis, c_nodes_etc, c_miniIndex, c_prev_m, c_m, c_lastP, c_cV) => {

                vis.graph.removeEdgeColor(c_cV, c_m);
                
                vis.graph.removeNodeColor(c_prev_m);
                vis.graph.colorEdge(c_prev_m, c_m, colors.FRONTIER_E);
                vis.graph.colorNode(c_prev_m, 1);
                //vis.graph.deselect(c_prev_m, c_prev_m);
                //vis.graph.select(c_prev_m, c_m);  
                
                // disconnect from the previous parent
                if (c_lastP != null) {
                  
                  // vis.graph.visit(c_m,[c_lastP]);
                  
                  vis.graph.removeEdgeColor(c_lastP, c_m);
                  //vis.graph.deselect(c_lastP, c_m);

                  // vis.graph.colorNode(c_lastP, 1);
                  //vis.graph.select(c_lastP, c_lastP);
                }

                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, c_m);
              },
              [[nodes, parents, minCosts, finalCosts], miniIndex,
                  prev[m], m, lastParent, currentVertex]
            );
          } 
        }
      }
    }
    // XXX add stuff to deal with while loop termination due to
    // PQ being empty
  }, 


  

};
