/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-lonely-if */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
// import the 2D tracer to generate an array that stores the matrix in 2D format
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';


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

    chunker.add(1, (g) => {
      g.array.set([...matrix], 'tc');
      g.graph.set([...matrix]);
      g.graph.layoutCircle();
      // initialise the matrix in the 'Matrix' component
    }, [this.graph], [this.array]);

    for (let i = 0; i < numOfNodes; i++) {
      nodes[i] = this.copyArr([...matrix]);
    }

    for (let k = 0; k < numOfNodes; k++) {
      chunker.add(2, (g, k) => {
        g.array.selectCol(k, 0, numOfNodes - 1, '2');
        g.array.selectRow(k, 0, numOfNodes - 1, '3');
      }, [k]);
      for (let i = 0; i < numOfNodes; i++) {
        chunker.add(2, (g, i, k) => {
          g.array.deselect(i, k, i, k);
          g.array.select(i, k);
        }, [i, k]); // move along columns

        if (nodes[k][i][k]) {
          chunker.add(2, (g, i, k) => {
            // if a path between i and k is found, highlight the edge in blue
            g.graph.visit(i);
            g.graph.visit(k, i);
          }, [i, k]);

          for (let j = 0; j < numOfNodes; j++) {
            chunker.add(3, (g, k, j) => {
              g.array.deselect(k, j, k, j);
              g.array.select(k, j, k, j, '1');
            }, [k, j]); // move along rows (green)

            if (nodes[k][k][j]) {
              chunker.add(3, (g, j, k) => {
                // if a path between j and k is found, highlight the edge in green
                g.graph.visit1(j, k, 1);
              }, [j, k]);

              chunker.add(3, (g, i, j) => {
                // orange
                if (!g.array.data[i][j].value) {
                  g.array.patch(i, j, '0->1');
                // there is a path between i and j, add a new edge and highlight the edge in orange
                  g.graph.addEdge(i, j);
                  g.graph.visit1(j, i, 2); // orange
                  // highlight the node (i,j) in the matrix when a path is found
                }
              }, [i, j]);

              if (i !== j || j !== k) {
                chunker.add(3, (g, i, k, j) => {
                  // remove green
                  g.array.deselect(k, j, k, j);
                  g.array.select(k, j, k, j, '3');
                  // g.graph.leave1(j, k);
                }, [i, k, j]);
              }
              chunker.add(3, (g, i, k, j) => {
                // remove green
                // g.array.deselect(k, j);
                g.graph.leave1(j, k);
              }, [i, k, j]);

              chunker.add(3, (g, i, j, k) => {
                // leave the node (i,j) to move to the next node
                // g.graph.leave(j, i);
                // remove highlighting from the node (i,j) in the matrix to move to the next element
                if (j !== k) {
                  // g.array.deselect(i, j);
                  g.array.depatch(i, j, 1);
                  g.graph.leave1(j, i); // remove orange
                }
              }, [i, j, k]);

              for (let a = k; a < numOfNodes; a++) {
                nodes[a][i][j] = 1;
              }
            }

            if (i !== j || j !== k) {
              chunker.add(3, (g, i, k, j) => {
                // remove green
                g.array.deselect(k, j, k, j);
                g.array.select(k, j, k, j, '3');
                g.graph.leave1(j, k);
              }, [i, k, j]);
            }
          }
          chunker.add(4, (g, i, k) => {
            // leave the node (i,k) to move to the next node
            // remove blue
            g.graph.leave(k, i);
            g.graph.leave(i);
            // g.graph.leave1(j, k);
          }, [i, k]);
        }
        chunker.add(3, (g, i, k) => {
          g.array.deselect(i, k);
          g.array.select(i, k, i, k, '2');
          // g.graph.leave1(k);
        }, [i, k]);
      }
      chunker.add(2, (g, k) => {
        g.array.deselectRow(k, 0, numOfNodes - 1);
        g.array.deselectCol(k, 0, numOfNodes - 1);
      }, [k]);
    }
  },
};
