/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-lonely-if */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
// import the 2D tracer to generate an array that stores the matrix in 2D format
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import {
  runChunkWithCheckCollapseState,
  releaseChunkCache,
  runChunkWithEnterCollapse,
  isInCollapseState,
  setKthVisible,
} from './transitiveClosureCollapseChunkPlugin';

export default {
  initVisualisers() {
    return {
      graph: {
        // instance: new GraphTracer('key', null, 'Transitive Closure'),
        instance: new GraphTracer('key', null, 'Graph view'),
        order: 0
      },
      // create a separate component for displaying the matrix as a 2D array
      array: {
        instance: new Array2DTracer('array', null, 'Matrix'),
        order: 1,
      },
    };
  },

  copyArr(obj) {
    const out = [];
    let i = 0;
    const len = obj.length;
    for (; i < len; i++) {
      if (obj[i] instanceof Array) {
        out[i] = this.copyArr(obj[i]);
      } else out[i] = obj[i];
    }
    return out;
  },

  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes, moveNode}) {
    // eslint-disable-next-line no-unused-expressions
    const matrix = edgeValueMatrix;
    const size = matrix.length;
    const numOfNodes = size;
    const nodes = new Array(numOfNodes);
    let prevI = 0;
    let prevJ = 0;
    let prevK = 0;
    chunker.add(1, (g, edgeArray, coordsArray) => {
      // show kth tag when step back
      setKthVisible(true);
      g.array.set([...matrix], 'tc');
      g.graph.set(edgeArray, Array.from({ length: matrix.length }, (v, k) => (k + 1)),coordsArray);
      // g.graph.layoutCircle();
      // initialise the matrix in the 'Matrix' component
      g.graph.setIstc();
      g.graph.moveNodeFn(moveNode);
    }, [[...edgeValueMatrix], [...coordsMatrix]]);

    for (let i = 0; i < numOfNodes; i++) {
      nodes[i] = this.copyArr([...matrix]);
    }

    for (let k = 0; k < numOfNodes; k++) {
      // run the first for loop
      chunker.add({ bookmark: 2, pauseInCollapse: true }, (g, k) => {
        g.array.showKth(k + 1);
        releaseChunkCache();
      }, [k]);

      for (let i = 0; i < numOfNodes; i++) {
        // run the second for loop
        // eslint-disable-next-line no-loop-func
        chunker.add({ bookmark: 3, pauseInCollapse: true }, (g, k, i) => {
          g.array.showKth(k + 1);
          if (i > 0) {
            g.array.deselect(k, numOfNodes - 1);
            g.graph.leave1(prevJ, prevK);
          }
          if (i === 0 && k > 0) {
            g.array.deselect(k - 1, numOfNodes - 1);
            g.graph.leave1(prevJ, prevK);
          }
          releaseChunkCache();
        }, [k, i]);

        if (!nodes[k][i][k]) {
          // eslint-disable-next-line no-loop-func
          chunker.add(4, (g, i, k) => {
            g.graph.leave0(prevK, prevI);
            g.graph.leave0(prevI);
            if (i > 0) {
              g.array.deselect(i - 1, k);
            }
            if (i === 0 && k > 0) {
              g.array.deselect(numOfNodes - 1, k - 1);
            }
            g.array.select(i, k);
          }, [i, k]); // move along columns
        } else {
          // eslint-disable-next-line no-loop-func
          chunker.add(4, (g, i, k) => {
            // if a path between i and k is found, highlight the edge in blue
            g.graph.leave0(prevK, prevI);
            g.graph.leave0(prevI);
            if (i > 0) {
              g.array.deselect(i - 1, k);
            }
            if (i === 0 && k > 0) {
              g.array.deselect(numOfNodes - 1, k - 1);
            }
            g.array.select(i, k);
            g.graph.visit0(i);
            g.graph.visit0(k, i);
            prevK = k;
            prevI = i;
          }, [i, k]);

          for (let j = 0; j < numOfNodes; j++) {
            // run the third for loop
            chunker.add(5, () => {
              runChunkWithEnterCollapse();
            }, []);

            if (!nodes[k][k][j]) {
              // eslint-disable-next-line no-loop-func
              chunker.add(6, (g, k, j, i) => {
                runChunkWithCheckCollapseState(() => {
                  g.graph.leave1(prevJ, prevK);
                });
                if (j > 0) {
                  runChunkWithCheckCollapseState(() => {
                    g.array.deselect(k, j - 1);
                  });
                  if (i === k && k === (j - 1)) {
                    g.array.select(k, j - 1);
                    g.graph.visit0(i);
                  }
                }
                if (j === 0) {
                  runChunkWithCheckCollapseState(() => {
                    g.array.deselect(k, numOfNodes - 1);
                  });
                  if (i === k && k === (numOfNodes - 1)) {
                    g.array.select(k, numOfNodes - 1);
                  }
                }
                g.array.select(k, j, k, j, '1');
                if (i === k && k === j) {
                  g.array.select(k, j);
                  g.graph.visit0(i);
                }
              }, [k, j, i]); // move along rows (green)
            } else {
              // eslint-disable-next-line no-loop-func
              chunker.add(6, (g, j, k, i) => {
                // if a path between j and k is found, highlight the edge in green
                // eslint-disable-next-line max-len
                runChunkWithCheckCollapseState(((pj, pk) => () => { g.graph.leave1(pj, pk); })(prevJ, prevK));
                if (j > 0) {
                  runChunkWithCheckCollapseState(() => {
                    g.array.deselect(k, j - 1);
                  });
                  if (i === k && k === (j - 1)) {
                    g.array.select(k, j - 1);
                    g.graph.visit0(i);
                  }
                }
                if (j === 0) {
                  runChunkWithCheckCollapseState(() => {
                    g.array.deselect(k, numOfNodes - 1);
                  });
                  if (i === k && k === (numOfNodes - 1)) {
                    g.array.select(k, numOfNodes - 1);
                    g.graph.visit0(i);
                  }
                }
                g.array.select(k, j, k, j, '1');
                if (i === k && k === j) {
                  g.array.select(k, j);
                  g.graph.visit0(i);
                }
                g.graph.visit1(j, k, 1);
                prevJ = j;
                prevK = k;
              }, [j, k, i]);

              chunker.add(7, (g, i, j) => {
                // orange
                if (!g.array.data[i][j].value) {
                  g.array.patch(i, j, '0->1');
                  // eslint-disable-next-line max-len
                  // there is a path between i and j, add a new edge and highlight the edge in orange
                  g.graph.addEdge(i, j);
                  g.graph.visit1(j, i, 2); // orange
                  // highlight the node (i,j) in the matrix when a path is found
                }
              }, [i, j]);

              if (!nodes[k][i][j]) {
                chunker.add(7, (g, i, j) => {
                    // leave the node (i,j) to move to the next node
                    // g.graph.leave(j, i);
                    // eslint-disable-next-line max-len
                    // remove highlighting from the node (i,j) in the matrix to move to the next element
                  
                  runChunkWithCheckCollapseState(() => {
                    g.array.depatch(i, j, 1);
                    g.graph.leave1(j, i, 2); // remove orange
                  });
                }, [i, j]);
              }

              for (let a = k; a < numOfNodes; a++) {
                nodes[a][i][j] = 1;
              }
            }
          }
        }
      }
    }

    // eslint-disable-next-line max-len
    // remove all the highlighting on graph and matrix when finish for both collapse and expansion status
    chunker.add({ bookmark: 8, pauseInCollapse: true }, (g) => {
      const n = numOfNodes - 1;
      g.graph.leave0(n);
      setKthVisible(false);
      if (!isInCollapseState()) {
        g.graph.leave1(n, n);
        g.array.deselect(n, n);
      } else {
        releaseChunkCache();
      }
    }, []);

    return nodes.length ? nodes[nodes.length-1] : nodes;
  },
};
