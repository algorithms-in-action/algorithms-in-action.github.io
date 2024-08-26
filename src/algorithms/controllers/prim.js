// Prim's MST algorithm; code copied+modified from Dijkstra's shortest
// path algorithm animation
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
        instance: new Array2DTracer('array', null, 'Parent array & Priority Queue'),
        order: 1,
      },
    };
  },

  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes, moveNode}) {
    // String Variables used in displaying algo
    const algNameStr = 'prim';
    const dashStr = '-';
    const minStr = 'Min'; 
    const nStr = 'n';
    const mStr = 'm';
    const totalStrs = ['Cost', 'Tot.', ' = '];
    const infinityStr = '∞';
    const lessThanStr = '<';
    const notLessThanStr = '≮';

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;
    const minCosts = [];
    const parents = [];
    const nodes = [];  
    const finalCosts = []; 
    const start = startNode - 1; 
    const end = endNodes[0] - 1;
    let totalCost = 0;

    // Display has table [nodes, parents, minCosts, finalCosts]
    // and display code indexes into this table; we define the indices here
    const NODE = 0;
    const PAR = 1;
    const MCOST = 2;
    const FCOST = 3;
    
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
    // c_Total: total cost (at end)
    const refresh = (vis, c_nodes_etc, c_Min, c_cV, c_m, c_Total = null) => {
      vis.array.set(c_nodes_etc, algNameStr);
      // XXX Hack to display total cost near left of array
      // aligned near the left of the array if c_Total != null and
      // room permits; otherwise we set and display n, m, Min as required
      // XXX could do similar for other algorithms to display 'Path'
      // 'Len.' ' = ' ...
      if (c_Total != null && c_nodes_etc[MCOST].length > 3) {
        // vis.array.assignVariable('Tot. Cost', 2, 0); 
        vis.array.assignVariable(totalStrs[0], 2, 0); 
        vis.array.assignVariable(totalStrs[1], 2, 1); 
        vis.array.assignVariable(totalStrs[2], 2, 2); 
        vis.array.assignVariable(c_Total, 2, 3); 
      } else {
        let c_m1 = (c_m === null? null: c_m+1);
        let c_cV1 = (c_cV === null? null: c_cV+1);
        let c_Min1 = (c_Min === null? null: c_Min+1);
        let c_Total1 = (c_Total === null? null: c_Total);
        vis.array.assignVariable(nStr, 2, c_cV1);
        vis.array.assignVariable(mStr, 2, c_m1);
        vis.array.assignVariable(minStr, 2, c_Min1); 
      }

      // highlight nodes as finalised/frontier in array
      for (let i = 0; i < numVertices; i++) {
        if (c_nodes_etc[MCOST][i+1] === null) {
          vis.array.select(NODE, i + 1, NODE, i + 1, colors.FINALISED_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FINALISED_N);
        } else if (isNumber(c_nodes_etc[MCOST][i+1])) {
          vis.array.select(NODE, i + 1, NODE, i + 1, colors.FRONTIER_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FRONTIER_N);
        }
      }

      // color Min in PQ
      if (c_Min != null)
        vis.array.select(MCOST, c_Min + 1, MCOST, c_Min + 1, colors.PQ_MIN_A);
    }

    chunker.add(
      1,
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.moveNodeFn(moveNode);
        vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
      },
      [E, coords]
    );

    // initialise each element of array Parent to zero 
    const prev = Array(numVertices).fill(null);  

    nodes.push('i'); // initialize the pq display
    parents.push('Parent[i]');
    minCosts.push('Cost[i]'); 
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
        // re-render table with new cost
        vis.array.set(v, algNameStr);
        // color start node in array + graph
        vis.array.select(NODE, w + 1, NODE, w + 1, colors.FRONTIER_A);
        vis.graph.colorNode(w, colors.FRONTIER_N);
      },
      [[nodes, parents, minCosts, finalCosts], start]
    );

    // Nodes <- PQ containing all nodes 
    chunker.add(
      8,
      (vis, v, w) => {
        // add min to display
        vis.array.set(v, algNameStr);
        vis.array.assignVariable(minStr, 2, w + 1);
        vis.array.select(MCOST, w + 1, MCOST, w + 1, colors.PQ_MIN_A);
        vis.array.select(NODE, w + 1, NODE, w + 1, colors.FRONTIER_A);
      },
      [[nodes, parents, minCosts, finalCosts], start]
    );

    let currentVertex = null;
    // while Nodes not Empty 
    // while (visited.size < numVertices)  
    // extra chunk before break to make loop termination clearer
    /* eslint-disable no-constant-condition */
    while (true) {
      
      findMinimum(); 
      
      chunker.add( 
        2,
        (vis, c_nodes_etc, c_miniIndex, c_last, c_prev, c_cV) => {
          refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null);
          
          if (c_last[0] != null) {
            vis.graph.removeEdgeColor(c_last[0], c_last[1]); 
            
            // restore the original color of the edge
            if(c_prev[c_last[0]] != null && c_nodes_etc[FCOST][c_last[0]+1] == dashStr)
            {
              vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
              vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FRONTIER_E);
            }

            if(c_prev[c_last[1]] != null && c_nodes_etc[FCOST][c_last[1]+1] == dashStr)
            {
              vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
              vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FRONTIER_E);
            }

            if(c_nodes_etc[FCOST][c_last[0]+1] != dashStr)
            {
              vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
              vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FINALISED_E);
            }

            if(c_nodes_etc[FCOST][c_last[1]+1] != dashStr)
            {
              vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
              vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FINALISED_E);
            }

          }

        },
        [[nodes, parents, minCosts, finalCosts], miniIndex, last, prev, currentVertex]
      );
      if (!(visited.size < numVertices)) {
        // return at end of function

        // sum of all numbers in finalCosts array
        totalCost = finalCosts.reduce((acc, el) => 
            (isNumber(el)? acc + el: acc), 0);
        chunker.add(
          99,
          (vis, v, c_miniIndex, c_cV, c_m, c_totalCost) => {
            refresh(vis, v, c_miniIndex, c_cV, c_m, c_totalCost);
            // re-do finalised edges in success colour for extra highlight
            for (let i = 0; i < numVertices; i++) {
              for (let j = 0; j < numVertices; j++) {
                if (v[PAR][i+1] === j+1) {
                  vis.graph.removeEdgeColor(i, j);
                  vis.graph.colorEdge(i, j, colors.SUCCESS_E);
                }
              }
            }
          },
          [[nodes, parents, minCosts, finalCosts], null,
              null, null, totalCost]
        );
        break;
      }

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
          // reset previous highlight if any
          if (c_prev_cV != null) {
            vis.graph.removeEdgeColor(c_prev_cV, c_cV);
            vis.graph.colorEdge(c_prev_cV, c_cV, colors.FINALISED_E);
          }
          refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null);
        },
        [[nodes, parents, minCosts, finalCosts], miniIndex, 
            currentVertex, prev[currentVertex]]
      );
      
      // If we can't find a reachable vertex, exit 
      // if Cost[n] = infinity 
      chunker.add(10);
      if (currentVertex === null // || currentVertex === end
        || cost[currentVertex] === Infinity) {
        // return without exploring all components

        // undo last "remove next element" operation
        minCosts[currentVertex+1] = infinityStr;
        finalCosts[currentVertex+1] = dashStr;
        miniIndex = currentVertex;
        // sum all numbers in finalCosts array
        totalCost = finalCosts.reduce((acc, el) => 
            (isNumber(el)? acc + el: acc), 0);
        // console.log(['totalCost', totalCost]);
        chunker.add(
          3,
          (vis, v, c_miniIndex, c_cV, c_m, c_totalCost) => {
            vis.graph.removeNodeColor(currentVertex);
            refresh(vis, v, c_miniIndex, c_cV, c_m, c_totalCost);
            // re-do finalised edges in success colour for extra highlight
            for (let i = 0; i < numVertices; i++) {
              for (let j = 0; j < numVertices; j++) {
                if (v[PAR][i+1] === j+1) {
                  vis.graph.removeEdgeColor(i, j);
                  vis.graph.colorEdge(i, j, colors.SUCCESS_E);
                }
              }
            }
          },
          [[nodes, parents, minCosts, finalCosts], miniIndex,
              currentVertex, null, totalCost]
        );
        // return
        break; 
      }

      // Mark the vertex as visited
  
      // Update the cost and prev arrays 
      
      // for each node m neighbouring n
      for (let m = 0; m < numVertices; m++) {
        if (edgeValueMatrix[currentVertex][m] !== 0) { //TODO: check
            // && !visited.has(m))   // Skip if no edge exists
          // findMinimum();
          chunker.add(
            4,
            (vis, v, c_miniIndex, c_last, c_prev, c_cV, c_m) => {
              if (c_last[0] != null) { 
                vis.graph.removeEdgeColor(c_last[0], c_last[1]);
                //vis.graph.leave1(c_last[0], c_last[1], 2); 
                if(c_prev[c_last[0]] != null && v[FCOST][c_last[0]+1] == dashStr)
                {
                  vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
                  vis.graph.colorEdge(c_prev[c_last[0]], c_last[0],
colors.FRONTIER_E);
                }

                if(c_prev[c_last[1]] != null && v[FCOST][c_last[1]+1] == dashStr)
                {
                  vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
                  vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FRONTIER_E);
                }

                if(v[FCOST][c_last[0]+1] != dashStr)
                {
                  vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
                  vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FINALISED_E);
                }

                if(v[FCOST][c_last[1]+1] != dashStr)
                {
                  vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
                  vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FINALISED_E);
                }
              } 

              vis.graph.removeEdgeColor(c_cV, c_m);
              vis.graph.colorEdge(c_cV, c_m, colors.N_M_E);

              refresh(vis, v, c_miniIndex, c_cV, c_m);
            },
            [[nodes, parents, minCosts, finalCosts], miniIndex, last, prev, currentVertex,
            m]
          );
          
          const newCost = edgeValueMatrix[currentVertex][m];
          
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
                
                // disconnect from the previous parent
                if (c_lastP != null) {
                  vis.graph.removeEdgeColor(c_lastP, c_m);
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
  }, 

};
