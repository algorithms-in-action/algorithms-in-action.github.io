// DFS, recursive version. Should do the same thing as iterative version
// but code is simpler and has different structure of course.
// XXX iterative version ends up with fewer "fontier" edges because if
// you add the node to the frontier again, the previous edge reverts - that
// should probably be changed??  Not sure about BFS etc
// Copied and modified from dijkstra.js (nicer code than DFS)
// Might be some leftover bit from dijkstra.js that could be cleaned up
// further.
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

  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes, moveNode}) {
    // String Variables used in displaying algo
    const algNameStr = 'DFSrec';
    const nStr = 'n';
    const mStr = 'm';

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;
    const unassigned = ' '; // unassigned parent
    const parents = []; // parent of each node; initially unassigned
    const seen = []; // neighbours of finalised node
    const nodes = [];  
    const start = startNode - 1; 
    const end = endNodes[0] - 1;

    // Display has table [nodes, parents, seen]
    // and display code indexes into this table; we define the indices here
    // Seen is hidden from display but included due to quirk with
    // assignVariable - see XXX comments later
    const NODE = 0;
    const PAR = 1;
    const SEEN = 2;
    
    // initialize each element of array Cost to infinity
    const stack = [];  // call stack for display

    // refresh display.  Ideally one would think we could do incremental
    // changes but there are all kinds of subtelties like what triggers
    // re-rendering, some selected colors vanishing with some apparently
    // unrelated operations, etc.  For sanity, and to avoid code thats
    // duplicated countless times, we put lots of it here. And we name
    // the parameters something more readable than x,y,z,z1,a,b,c etc...
    // c_nodes_etc: 2D array with node number, parents, seen
    // c_n: current node n
    // c_m: m (neighbour of m)
    // c_stk call stack
    const refresh = (vis, c_nodes_etc, c_n, c_m, c_stk) => {
      vis.array.set(c_nodes_etc, algNameStr);
      vis.array.hideArrayAtIndex(2); // HACK - see above
      vis.array.setList(c_stk);
      // set n, m as required
      vis.array.assignVariable(nStr, 2, c_n);
      vis.array.assignVariable(mStr, 2, c_m);

      // highlight nodes as finalised/frontier in array
      for (let i = 0; i < numVertices; i++) {
        if (c_nodes_etc[PAR][i+1] !== unassigned) {
          vis.array.select(NODE, i + 1, NODE, i + 1, colors.FINALISED_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FINALISED_N);
        } else if (c_nodes_etc[SEEN][i+1]) {
          vis.array.select(NODE, i + 1, NODE, i + 1, colors.FRONTIER_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FRONTIER_N);
        }
      }
    }

    // core recursive function - need recursion depth for chunker
    const dfs1 = (n, p, rec_depth) => {

      stack.unshift('('+n+','+p+')');
      chunker.add(
        'dfs1',
        (vis, c_nodes_etc, c_n, c_m, c_stack) => {
          refresh(vis, c_nodes_etc, c_n, null, c_stack);
        },
        [[nodes, parents, seen],
            n, null, stack], rec_depth
      );
      chunker.add(
        'check_parent',
        // need parent p here
        (vis, c_nodes_etc, c_n, c_m, c_stack, c_p) => {
          refresh(vis, c_nodes_etc, c_n, null, c_stack);
          // if p !== 0 the n-p has been highlighted in the for loop
          if (c_p !== 0) {
            // set edge to finalised if parent unassigned or it was
            // previously finalised, otherwise back to frontier
            if (c_nodes_etc[PAR][c_n] === unassigned ||
                c_nodes_etc[PAR][c_n] === c_p ||
                c_nodes_etc[PAR][c_p] === c_n) {
              // console.log(['finalised Edge', c_n, c_p]);
              vis.graph.removeEdgeColor(c_p-1, c_n-1);
              vis.graph.colorEdge(c_p-1, c_n-1, colors.FINALISED_E);
            } else { // reset to frontier
              // console.log(['Still frontier edge', c_n, c_p]);
              vis.graph.removeEdgeColor(c_p-1, c_n-1);
              vis.graph.colorEdge(c_p-1, c_n-1, colors.FRONTIER_E);
            }
          }
        },
        [[nodes, parents, seen],
            n, null, stack, p], rec_depth
      );
      if (parents[n] === unassigned) {
        parents[n] = p;
        chunker.add(
          'assign_parent',
          (vis, c_nodes_etc, c_n, c_m, c_stack) => {
            refresh(vis, c_nodes_etc, c_n, null, c_stack);
          },
          [[nodes, parents, seen],
              n, null, stack], rec_depth
        );
        chunker.add(
          'check_end',
          (vis, c_nodes_etc, c_n, c_m, c_stack) => {
            refresh(vis, c_nodes_etc, c_n, null, c_stack);
          },
          [[nodes, parents, seen],
              n, 0, stack], rec_depth
        );
        if (n === end+1) {
          chunker.add(
            'found',
            (vis, c_nodes_etc, c_n, c_m, c_stack) => {
              refresh(vis, c_nodes_etc, c_n, null, c_stack);
            },
            [[nodes, parents, seen],
                n, null, stack], rec_depth
          );
          stack.shift();
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
          (vis, c_nodes_etc, c_n, c_m, c_stack) => {
            refresh(vis, c_nodes_etc, c_n, null, c_stack);
            // real m defined in this for loop; c_m is junk
            for (let m = numVertices; m > 0; m--) {
              if (edgeValueMatrix[c_n-1][m-1] !== 0 &&
                  c_nodes_etc[PAR][c_n] !== m &&
                  c_nodes_etc[PAR][m] !== c_n) {
                vis.graph.colorEdge(c_n-1, m-1, colors.FRONTIER_E);
                vis.graph.removeNodeColor(c_n-1);
                vis.graph.colorNode(c_n-1, colors.FINALISED_N);
              }
            }
          },
          [[nodes, parents, seen],
              n, null, stack], rec_depth
        );
        // for each node m neighbouring n
        // (in reverse order so we get same traversal order as
        // iterative version)
        for (let m = numVertices; m > 0; m--) {
          if (edgeValueMatrix[n-1][m-1] !== 0) {
            chunker.add(
              'neighbours',
              (vis, c_nodes_etc, c_n, c_m, c_stack) => {
                refresh(vis, c_nodes_etc, c_n, c_m, c_stack);
                // highlight edge we are dealing with
                vis.graph.removeEdgeColor(c_m-1, c_n-1);
                vis.graph.colorEdge(c_m-1, c_n-1, colors.N_M_E);
              },
              [[nodes, parents, seen],
                  n, m, stack], rec_depth
            );
            chunker.add(
              'rec_dfs1',
              (vis, c_nodes_etc, c_n, c_m, c_stack) => {
                refresh(vis, c_nodes_etc, c_n, c_m, c_stack);
              },
              [[nodes, parents, seen],
                  n, m, stack], rec_depth
            );
            let result = dfs1(m, n, rec_depth+1);
            chunker.add(
              'rec_dfs1_done',
              (vis, c_nodes_etc, c_n, c_m, c_stack) => {
                refresh(vis, c_nodes_etc, c_n, c_m, c_stack);
              },
              [[nodes, parents, seen],
                  n, m, stack], rec_depth
            );
           
            if (result) {
              chunker.add(
                'rec_found',
                (vis, c_nodes_etc, c_n, c_m, c_stack) => {
                  refresh(vis, c_nodes_etc, c_n, c_m, c_stack);
                },
                [[nodes, parents, seen],
                    n, m, stack], rec_depth
              );
              stack.shift();
              return true;
            }
          }
        }
      }
      chunker.add('not_found',
        (vis, c_nodes_etc, c_n, c_m, c_stack) => {
          refresh(vis, c_nodes_etc, c_n, null, c_stack);
        },
        [[nodes, parents, seen],
            n, null, stack], rec_depth
      );
      stack.shift();
      return false;
    };


    chunker.add(
      'start',
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(false);
        vis.graph.moveNodeFn(moveNode);
        vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
      },
      [E, coords], 0
    );

    // Initialize the table
    nodes.push('i');
    parents.push('Parent[i]');
    seen.push('Seen[i]'); // not actually displayed
    for (let i = 0; i < numVertices; i += 1) {
      nodes[i + 1] = i + 1;
      seen.push(false); 
      parents.push(unassigned); 
    }

    seen[startNode] = true; // moved before init
    chunker.add(
      'init',
      (vis, c_nodes_etc, c_n, c_m, c_stack) => {
        refresh(vis, c_nodes_etc, c_n, null, c_stack);
      },
      [[nodes, parents, seen],
          startNode, null, stack], 0
    );

//  Previously a separate line
//  seen[startNode] = true; // moved before init
//  chunker.add(
//    'frontier_s',
//    (vis, c_nodes_etc, c_n, c_m, c_stack) => {
//      refresh(vis, c_nodes_etc, c_n, null, c_stack);
//    },
//    [[nodes, parents, seen],
//        startNode, null, stack], 0
//  );

    let result = dfs1(startNode, 0, 0);
    chunker.add(
      'top_call',
      (vis, c_nodes_etc, c_n, c_m, c_stack) => {
        refresh(vis, c_nodes_etc, c_n, null, c_stack);
      },
      [[nodes, parents, seen],
          null, null, stack], 0
    );
    if (result) {
      chunker.add(
        'finish',
         (vis, c_nodes_etc) => {
           // XXX HACK
           // For some reason, assignVariable only seems to display variables
           // for row 2, and we only want to display row 0 (i) and 1
           // (Parent[i]), so we also add Seen[i] as row two but hide it using
           // vis.array.hideArrayAtIndex(2)
           // remove n, add start and end
           vis.array.set(c_nodes_etc, algNameStr);
           vis.array.hideArrayAtIndex(2); // HACK - see above
           vis.array.setList([]);  // remove call stack
           vis.array.assignVariable('end', 2, end + 1);
           vis.array.assignVariable('start', 2, start + 1);
           // vis.array.assignVariable('n', 2, null);
           // remove color from node numbers
           // (done by vis.array.assignVariable, it seems):
           // for(let i = 0; i < c_nodes_etc[NODE].length; i++){
             // vis.array.deselect(0, i);
           // }

           // color the path from the start node to the end node
           // + color nodes and parent array
           let current = end;
           let next = 0;
           while((current != start) && (c_nodes_etc[PAR][current+1] != null))
           { 
             next = c_nodes_etc[PAR][current+1]-1;
             vis.array.select(NODE, current + 1, NODE, current + 1, colors.SUCCESS_A);
             vis.array.select(PAR, current + 1, PAR, current + 1, colors.SUCCESS_A);
             vis.graph.removeEdgeColor(current, next);
             vis.graph.colorEdge(current, next, colors.SUCCESS_E);
             current = next;
           }
           // also colour start node in array + final cost for end
           vis.array.select(NODE, start + 1, NODE, start + 1, colors.SUCCESS_A);
           // vis.array.select(FCOST, end + 1, FCOST, end + 1, colors.SUCCESS_A);
        },
        [[nodes, parents, seen], seen], 0
      )
    } else {
      chunker.add(
        'finish',
        (vis, c_nodes_etc, c_n, c_m, c_stack) => {
          refresh(vis, c_nodes_etc, c_n, null, c_stack);
        },
        [[nodes, parents, seen],
            null, null, stack], 0
      )
    }
  }
  , 

};
