// DFS, recursive version. Should do the same thing as iterative version
// but code is simpler and has different structure of course.
// Copied and modified from dijkstra.js (nicer code than DFS)
// XXX add support for multiple end nodes
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
        instance: new Array2DTracer('array', null, 'Parent array'),
        order: 1,
      },
    };
  },

  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes}) {
    // String Variables used in displaying algo
    const algNameStr = 'DFSrec';
    const dashStr = '-';
    const minStr = 'Min'; 
    const nStr = 'n';
    const mStr = 'm';
    const infinityStr = '∞';
    const lessThanStr = '<';
    const notLessThanStr = '≮';

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;
    const unassigned = ' '; // unassigned parent
    const parents = []; // parent of each node; initially unassigned
    const seen = []; // neighbours of finalised node
    const nodes = [];  
    const start = startNode - 1; 
    const end = endNodes[0] - 1;

    // Display has table [nodes, parents]
    // and display code indexes into this table; we define the indices here
    const NODE = 0;
    const PAR = 1;
    
    // Create a set to keep track of visited vertices
    const visited = new Set();  
    let last = [null, null]; // keep track of the last neighbour we visited
    // initialize each element of array Cost to infinity
    const stack = [];  // call stack for display

    // core recursive function - need recursion depth for chunker
    const dfs1 = (n, p, rec_depth) => {

      stack.unshift('('+n+','+p+')');
      chunker.add(
        'dfs1',
        (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
          refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
        },
        [[nodes, parents], null, 
            null, 0, stack, seen], rec_depth
      );
      chunker.add(
        'check_parent',
        (vis, c_nodes_etc, c_miniIndex, c_n, c_p, c_stack, c_seen) => {
          refresh(vis, c_nodes_etc, c_miniIndex, c_n, null, c_stack, c_seen);
          if (c_p !== 0) {
            console.log(['finalised Edge', c_n, c_p]);
            vis.graph.removeEdgeColor(c_p-1, c_n-1);
            vis.graph.colorEdge(c_p-1, c_n-1, colors.FINALISED_E);
          }
        },
        [[nodes, parents], null, 
            n, p, stack, seen], rec_depth
      );
      if (parents[n] === unassigned) {
        parents[n] = p;
        chunker.add(
          'assign_parent',
          (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
            refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
          },
          [[nodes, parents], null, 
              null, 0, stack, seen], rec_depth
        );
        chunker.add(
          'check_end',
          (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
            refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
          },
          [[nodes, parents], null, 
              null, 0, stack, seen], rec_depth
        );
        if (n === end+1) {
          chunker.add(
            'found',
            (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
              refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
            },
            [[nodes, parents], null, 
                null, 0, stack, seen], rec_depth
          );
          return true;
        }
        // set all neighbours as seen - they are in the continuation
        for (let m = numVertices; m > 0; m--) {
          if (edgeValueMatrix[n-1][m-1] !== 0) {
           seen[m] = true;
          }
        }
        chunker.add(
          'frontier',
          (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen, c_n) => {
            refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
            for (let m = numVertices; m > 0; m--) {
              if (edgeValueMatrix[c_n-1][m-1] !== 0 &&
c_nodes_etc[PAR][c_n]
!== m && c_nodes_etc[PAR][m] !== c_n) {
                vis.graph.colorEdge(c_n-1, m-1, colors.FRONTIER_E);
                vis.graph.removeNodeColor(c_n-1);
                vis.graph.colorNode(c_n-1, colors.FINALISED_N);
              }
            }
          },
          [[nodes, parents], null, 
              null, 0, stack, seen, n], rec_depth
        );
        // for each node m neighbouring n
        // (in reverse order so we get same traversal order as
        // iterative version)
        for (let m = numVertices; m > 0; m--) {
          if (edgeValueMatrix[n-1][m-1] !== 0) {
            chunker.add(
              'neighbours',
              (vis, c_nodes_etc, c_miniIndex, c_cV, c_m, c_stack, c_seen) => {
                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, c_m, c_stack, c_seen);
              },
              [[nodes, parents], null, 
                  null, m, stack, seen], rec_depth
            );
            chunker.add(
              'rec_dfs1',
              (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
              },
              [[nodes, parents], null, 
                  null, 0, stack, seen], rec_depth
            );
            let result = dfs1(m, n, rec_depth+1);
            chunker.add(
              'rec_dfs1_done',
              (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
              },
              [[nodes, parents], null, 
                  null, 0, stack, seen], rec_depth
            );
           
            if (result) {
              chunker.add(
                'rec_found',
                (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
                  refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
                },
                [[nodes, parents], null, 
                    null, 0, stack, seen], rec_depth
              );
              stack.shift();
              return true;
            }
          }
        }
      }
      chunker.add('not_found',
        (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
          refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
        },
        [[nodes, parents], null, 
            null, 0, stack, seen], rec_depth
      );
      stack.shift();
      return false;
    };

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
    // c_stk call stack
    const refresh = (vis, c_nodes_etc, c_Min, c_cV, c_m, c_stk, c_seen) => {
      vis.array.set(c_nodes_etc, algNameStr);
      vis.array.setList(c_stk);
      // set n, m, Min as required
      let c_m1 = (c_m === null? null: c_m+1);
      let c_cV1 = (c_cV === null? null: c_cV+1);
      let c_Min1 = (c_Min === null? null: c_Min+1);
      // vis.array.assignVariable(nStr, 2, c_cV1);
      // vis.array.assignVariable(mStr, 2, c_m); // XXXXXX
      //vis.array.assignVariable(minStr, 2, c_Min1); 

      // highlight nodes as finalised/frontier in array
      for (let i = 0; i < numVertices; i++) {
        if (c_nodes_etc[PAR][i+1] !== unassigned) {
          vis.array.select(NODE, i + 1, NODE, i + 1, colors.FINALISED_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FINALISED_N);
        } else if (c_seen[i+1]) {
          vis.array.select(NODE, i + 1, NODE, i + 1, colors.FRONTIER_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FRONTIER_N);
        }
      }
    }

    chunker.add(
      'start',
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
      },
      [E, coords], 0
    );

    // initialise each element of array Parent to zero 
    const prev = Array(numVertices).fill(null);  

    nodes.push('i'); // initialize the pq display
    parents.push('Parent[i]');
    seen.push('Seen[i]'); // not actually displayed
     
    // Initialize the table
    for (let i = 0; i < numVertices; i += 1) {
      nodes[i + 1] = i + 1;
      seen.push(false); 
      parents.push(unassigned); 
    }

    chunker.add(
      'init',
      (vis, v) => {
        vis.array.set(v, algNameStr);
        vis.array.assignVariable('tmp', 1, 4);
      },
      [[nodes, parents]], 0
    );

    seen[startNode] = true;
    chunker.add(
      'frontier_s',
      (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
        refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
      },
      [[nodes, parents], null, 
          null, 0, stack, seen], 0
    );
    let result = dfs1(startNode, 0, 0);
// XXX if result, trace path
    chunker.add(
      'finish',
      (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV, c_stack, c_seen) => {
        refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null, c_stack, c_seen);
      },
      [[nodes, parents], null, 
          null, 0, stack, seen], 0
    );

//    let currentVertex = null;
//    // while Nodes not Empty 
//    // while (visited.size < numVertices)  
//    // extra chunk before break to make loop termination clearer
//    /* eslint-disable no-constant-condition */
//    while (true) {
//      
//      findMinimum(); 
//      
//      chunker.add( 
//        2,
//        (vis, c_nodes_etc, c_miniIndex, c_last, c_prev, c_cV) => {
//          refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null);
//          
//          if (c_last[0] != null) {
//            vis.graph.removeEdgeColor(c_last[0], c_last[1]); 
//            
//            // restore the original color of the edge
//            if(c_prev[c_last[0]] != null && c_nodes_etc[FCOST][c_last[0]+1] == dashStr)
//            {
//              vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
//              vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FRONTIER_E);
//            }
//
//            if(c_prev[c_last[1]] != null && c_nodes_etc[FCOST][c_last[1]+1] == dashStr)
//            {
//              vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
//              vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FRONTIER_E);
//            }
//
//            if(c_nodes_etc[FCOST][c_last[0]+1] != dashStr)
//            {
//              vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
//              vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FINALISED_E);
//            }
//
//            if(c_nodes_etc[FCOST][c_last[1]+1] != dashStr)
//            {
//              vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
//              vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FINALISED_E);
//            }
//
//          }
//
//        },
//        [[nodes, parents, minCosts, finalCosts], miniIndex, last, prev, currentVertex]
//      );
//      if (!(visited.size < numVertices)) {
//        chunker.add(99); // return at end of function
//        chunker.add(
//          99,
//          (vis, v, c_miniIndex, c_cV, c_m) => {
//// XXX
//            // refresh(vis, v, c_miniIndex, c_cV, c_m);
//          },
//          [[nodes, parents, minCosts, finalCosts], miniIndex,
//              null, null]
//        );
//        break;
//      }
//
//      // Find the unvisited vertex with the smallest cost
//      
//      currentVertex = null; 
//      findMinimum();
//      currentVertex = miniIndex;
//      finalCosts[miniIndex + 1] = cost[miniIndex];
//      
//      // n <- RemoveMin(Nodes)  
//      minCosts[currentVertex + 1] = null; 
//      visited.add(currentVertex);
//      
//      // Update the miniIndex
//      findMinimum(); 
//      chunker.add(
//        9,
//        (vis, c_nodes_etc, c_miniIndex, c_cV, c_prev_cV) => {
//          // reset previous highlight if any
//          if (c_prev_cV != null) {
//            vis.graph.removeEdgeColor(c_prev_cV, c_cV);
//            vis.graph.colorEdge(c_prev_cV, c_cV, colors.FINALISED_E);
//          }
//          refresh(vis, c_nodes_etc, c_miniIndex, c_cV, null);
//        },
//        [[nodes, parents, minCosts, finalCosts], miniIndex, 
//            currentVertex, prev[currentVertex]]
//      );
//      
//      // If we can't find a reachable vertex, exit 
//      // if is_end_node(n) or Cost[n] = infinity 
//      chunker.add(10);
//      if (currentVertex === null // || currentVertex === end
//        || cost[currentVertex] === Infinity) {
//        // return without exploring all components & no end node
//
//        // undo last "remove next element" operation
//        minCosts[currentVertex+1] = infinityStr;
//        finalCosts[currentVertex+1] = dashStr;
//        miniIndex = currentVertex;
//        chunker.add(
//          3,
//          (vis, v, c_miniIndex, c_cV, c_m) => {
//            vis.graph.removeNodeColor(currentVertex);
//            refresh(vis, v, c_miniIndex, c_cV, c_m);
//          },
//          [[nodes, parents, minCosts, finalCosts], miniIndex,
//              null, null]
//        );
//        // return
//        break; 
//      }
//      if (currentVertex === end) {
//        // found end node - highlight path
//        chunker.add(3, 
//          (vis, c_nodes_etc) => {
//                // remove n, add start and end
//                vis.array.set(c_nodes_etc, algNameStr);
//                vis.array.assignVariable('end', 2, end + 1);
//                vis.array.assignVariable('start', 2, start + 1);
//                vis.array.assignVariable('n', 2, null);
//                // remove color from node numbers
//                // (done by vis.array.assignVariable, it seems):
//                // for(let i = 0; i < c_nodes_etc[NODE].length; i++){
//                  // vis.array.deselect(0, i);
//                // }
//
//                // color the path from the start node to the end node
//                // + color nodes and parent array
//                let current = end;
//                let next = 0;
//                while((current != start) && (c_nodes_etc[PAR][current+1] != null))
//                { 
//                  next = c_nodes_etc[PAR][current+1]-1;
//                  vis.array.select(NODE, current + 1, NODE, current + 1, colors.SUCCESS_A);
//                  vis.array.select(PAR, current + 1, PAR, current + 1, colors.SUCCESS_A);
//                  vis.graph.removeEdgeColor(current, next);
//                  vis.graph.colorEdge(current, next, colors.SUCCESS_E);
//                  current = next;
//                }
//                // also colour start node in array + final cost for end
//                vis.array.select(NODE, start + 1, NODE, start + 1, colors.SUCCESS_A);
//                vis.array.select(FCOST, end + 1, FCOST, end + 1, colors.SUCCESS_A);
//          },
//          [[nodes, parents, minCosts, finalCosts]]
//        )
//        break; 
//      }
//
//      // Mark the vertex as visited
//  
//      // Update the cost and prev arrays 
//      
//      // for each node m neighbouring n
//      for (let m = 0; m < numVertices; m++) {
//        if (edgeValueMatrix[currentVertex][m] !== 0) { //TODO: check
//            // && !visited.has(m)) {  // Skip if no edge exists
//          // findMinimum();
//          chunker.add(
//            4,
//            (vis, v, c_miniIndex, c_last, c_prev, c_cV, c_m) => {
//              if (c_last[0] != null) { 
//                vis.graph.removeEdgeColor(c_last[0], c_last[1]);
//                //vis.graph.leave1(c_last[0], c_last[1], 2); 
//                if(c_prev[c_last[0]] != null && v[FCOST][c_last[0]+1] == dashStr)
//                {
//                  vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
//                  vis.graph.colorEdge(c_prev[c_last[0]], c_last[0],
//colors.FRONTIER_E);
//                }
//
//                if(c_prev[c_last[1]] != null && v[FCOST][c_last[1]+1] == dashStr)
//                {
//                  vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
//                  vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FRONTIER_E);
//                }
//
//                if(v[FCOST][c_last[0]+1] != dashStr)
//                {
//                  vis.graph.removeEdgeColor(c_prev[c_last[0]], c_last[0]);
//                  vis.graph.colorEdge(c_prev[c_last[0]], c_last[0], colors.FINALISED_E);
//                }
//
//                if(v[FCOST][c_last[1]+1] != dashStr)
//                {
//                  vis.graph.removeEdgeColor(c_prev[c_last[1]], c_last[1]);
//                  vis.graph.colorEdge(c_prev[c_last[1]], c_last[1], colors.FINALISED_E);
//                }
//              } 
//
//              vis.graph.removeEdgeColor(c_cV, c_m);
//              vis.graph.colorEdge(c_cV, c_m, colors.N_M_E);
//
//              refresh(vis, v, c_miniIndex, c_cV, c_m);
//            },
//            [[nodes, parents, minCosts, finalCosts], miniIndex, last, prev, currentVertex,
//            m]
//          );
//          
//          const newCost = cost[currentVertex] + edgeValueMatrix[currentVertex][m]; //TODO: check
//          
//          // if Cost[n]+weight(n,m)<Cost[m]
//          let tempString = minCosts[m + 1];
//          if (minCosts[m + 1] === Infinity) {
//            tempString = infinityStr;
//          }
//          if (!visited.has(m)) {
//            if (newCost < cost[m]) {
//              minCosts[m + 1] = (`${newCost} ${lessThanStr} ${tempString}`);
//            } else {
//              minCosts[m + 1] = (`${newCost} ${notLessThanStr} ${tempString}`);
//            }
//          }
//          
//          // findMinimum();
//          chunker.add(
//            11,
//            (vis, v, c_miniIndex, c_cV, c_m) => {
//              refresh(vis, v, c_miniIndex, c_cV, c_m);
//            },
//            [[nodes, parents, minCosts, finalCosts], miniIndex,
//                currentVertex, m]
//          ); 
//
//           if (!visited.has(m))
//            minCosts[m + 1] = cost[m];
//
//          last = [currentVertex, m];
//          
//          if (!visited.has(m) && newCost < cost[m]) {
//            // Cost[m] <- Cost[n] + weight(n,m)
//            cost[m] = newCost; 
//            minCosts[m + 1] = newCost;
//            // findMinimum();
//            chunker.add(
//              12,
//              (vis, c_nodes_etc, c_miniIndex, c_cV, c_m) => {
//                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, c_m);
//              },
//              [[nodes, parents, minCosts, finalCosts], miniIndex, currentVertex, m]
//            );
//
//            // UpdateCost(Nodes,m,Cost[m])
//            findMinimum();
//            chunker.add(
//              13,
//              (vis, c_nodes_etc, c_miniIndex, c_cV, c_m) => {
//                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, c_m);
//              },
//              [[nodes, parents, minCosts, finalCosts], miniIndex, currentVertex, m]
//            );
//
//            // Parent[m] <- n
//            parents[m + 1] = currentVertex + 1;
//            const lastParent = prev[m];
//            prev[m] = currentVertex;   
//          
//            // findMinimum();
//            chunker.add(
//              14,
//              (vis, c_nodes_etc, c_miniIndex, c_prev_m, c_m, c_lastP, c_cV) => {
//
//                vis.graph.removeEdgeColor(c_cV, c_m);
//                
//                vis.graph.removeNodeColor(c_prev_m);
//                vis.graph.colorEdge(c_prev_m, c_m, colors.FRONTIER_E);
//                vis.graph.colorNode(c_prev_m, 1);
//                
//                // disconnect from the previous parent
//                if (c_lastP != null) {
//                  vis.graph.removeEdgeColor(c_lastP, c_m);
//                }
//
//                refresh(vis, c_nodes_etc, c_miniIndex, c_cV, c_m);
//              },
//              [[nodes, parents, minCosts, finalCosts], miniIndex,
//                  prev[m], m, lastParent, currentVertex]
//            );
//          } 
//        }
//      }
//    }
//  }
  }
  , 

};
