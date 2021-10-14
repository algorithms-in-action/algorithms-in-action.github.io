/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-lonely-if */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
// import the 2D tracer to generate an array that stores the matrix in 2D format
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import { runChunkWithCheckCollapseState, releaseChunkCache, runChunkWithEnterCollapse } from './transitiveClosureCollapseChunkPlugin';


export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('key', null, 'Transitive Closure'),
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

  run(chunker, { matrix, size }) {
    // eslint-disable-next-line no-unused-expressions
    const numOfNodes = size;
    const nodes = new Array(numOfNodes);
    let prevI = 0;
    let prevJ = 0;
    let prevK = 0;
    chunker.add(1, (g) => {
      g.array.set([...matrix], 'tc');
      g.graph.set([...matrix], Array.from({ length: matrix.length }, (v, k) => (k + 1)));
      g.graph.layoutCircle();
      // initialise the matrix in the 'Matrix' component
      g.graph.setIstc();
    }, [this.graph], [this.array]);

    for (let i = 0; i < numOfNodes; i++) {
      nodes[i] = this.copyArr([...matrix]);
    }

    for (let k = 0; k < numOfNodes; k++) {
      // run the second for loop
      chunker.add(3, (g, k) => {
        g.array.showKth(k + 1);
      }, [k]);

      for (let i = 0; i < numOfNodes; i++) {
        if (!nodes[k][i][k]) {
          chunker.add(3, (g, i, k) =>
          {
            g.graph.leave(prevK, prevI);
            g.graph.leave(prevI);
            prevK = k;
            prevI = i;
          chunker.add(3, (g, i, k) => {
            if (i > 0) {
              g.array.deselect(i - 1, k);
            }
            if (i === 0 && k > 0) {
              g.array.deselect(k - 1, numOfNodes - 1);
              g.array.deselect(numOfNodes - 1, k - 1);
            }
            g.array.select(i, k);
          }, [i, k]); // move along columns
        } else {
          chunker.add(3, (g, i, k) => {
            // if a path between i and k is found, highlight the edge in blue
            g.graph.leave(prevK, prevI);
            g.graph.leave(prevI);
            prevK = k;
            prevI = i;
            if (i > 0) {
              g.array.deselect(i - 1, k);
            }
            if (i === 0 && k > 0) {
              g.array.deselect(k - 1, numOfNodes - 1);
              g.array.deselect(numOfNodes - 1, k - 1);
            }
            g.array.select(i, k);
            g.graph.visit(i);
            g.graph.visit(k, i);
          }, [i, k]);

          for (let j = 0; j < numOfNodes; j++) {
            if (!nodes[k][k][j]) {
              chunker.add(4, (g, k, j, i) => {
                g.graph.leave1(prevJ, prevK);
                if (j > 0) {
                  g.array.deselect(k, j - 1);
                  if (i === k && k === (j - 1)) {
                    g.array.select(k, j - 1);
                    g.graph.visit(i);
                  }
                }
                if (j === 0) {
                  g.array.deselect(k, numOfNodes - 1);
                  if (i === k && k === (numOfNodes - 1)) {
                    g.array.select(k, numOfNodes - 1);
                  }
                }
                g.array.select(k, j, k, j, '1');
                if (i === k && k === j) {
                  g.array.select(k, j);
                  g.graph.visit(i);
                }
              }, [k, j, i]); // move along rows (green)
            } else {
              // eslint-disable-next-line no-loop-func
              chunker.add(4, (g, j, k, i) => {
                // if a path between j and k is found, highlight the edge in green
                g.graph.leave1(prevJ, prevK);
                if (j > 0) {
                  g.array.deselect(k, j - 1);
                  if (i === k && k === (j - 1)) {
                    g.array.select(k, j - 1);
                    g.graph.visit(i);
                  }
                }
                if (j === 0) {
                  g.array.deselect(k, numOfNodes - 1);
                  if (i === k && k === (numOfNodes - 1)) {
                    g.array.select(k, numOfNodes - 1);
                    g.graph.visit(i);
                  }
                }
                g.array.select(k, j, k, j, '1');
                if (i === k && k === j) {
                  g.array.select(k, j);
                  g.graph.visit(i);
                }
                g.graph.visit1(j, k, 1);
                prevJ = j;
                prevK = k;
              }, [j, k, i]);

              chunker.add(5, (g, i, j) => {
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

              chunker.add(5, (g, i, j, k) => {
                runChunkWithCheckCollapseState(() => {
                  // leave the node (i,j) to move to the next node
                  // g.graph.leave(j, i);
                  // eslint-disable-next-line max-len
                  // remove highlighting from the node (i,j) in the matrix to move to the next element
                  if (j !== k) {
                    // g.array.deselect(i, j);
                    g.array.depatch(i, j, 1);
                    g.graph.leave1(j, i); // remove orange
                  }
                  // g.graph.leave(j, k);
                });
              }, [i, j, k]);

              for (let a = k; a < numOfNodes; a++) {
                nodes[a][i][j] = 1;
              }
            }
          }
        }
      }
    }
  },
};
