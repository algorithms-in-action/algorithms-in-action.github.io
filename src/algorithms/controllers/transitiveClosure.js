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
      for (let i = 0; i < numOfNodes; i++) {
        chunker.add(3, (g, i, k) => {
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
              g.array.select1(k, j);
            }, [k, j]); // move along rows
            if (nodes[k][k][j]) {
              chunker.add(3, (g, i, j) => {
                if (!g.array.data[i][j].value) {
                  g.array.patch(i, j, '0->1');
                }
              }, [i, j]);

              for (let a = k; a < numOfNodes; a++) {
                nodes[a][i][j] = 1;
              }

              chunker.add(2, (g, j, k) => {
                // if a path between j and k is found, highlight the edge in blue
                g.graph.visit(j, k);
              }, [j, k]);

              chunker.add(2, (g, i, j) => {
                // there is a path between i and j, add a new edge and highlight the edge in blue
                g.graph.addEdge(i, j);
                g.graph.visit(j, i);
                // highlight the node (i,j) in the matrix when a path is found
                // g.array.select(i, j);
              }, [i, j]);

              if (i !== j || j !== k) {
                chunker.add(3, (g, k, j) => {
                  g.array.deselect(k, j);
                }, [k, j]);
              }

              chunker.add(4, (g, i, j, k) => {
                // leave the node (i,j) to move to the next node
                g.graph.leave(j, i);
                // remove highlighting from the node (i,j) in the matrix to move to the next element
                if (j !== k) {
                  // g.array.deselect(i, j);
                  g.array.depatch(i, j, 1);
                }
                g.graph.leave(j, k);
              }, [i, j, k]);
            }
            if (i !== j || j !== k) {
              chunker.add(3, (g, k, j) => {
                g.array.deselect(k, j);
              }, [k, j]);
            }
          }
          chunker.add(4, (g, i, k) => {
            // leave the node (i,k) to move to the next node
            g.graph.leave(k, i);
            g.graph.leave(i);
          }, [i, k]);
        }
        chunker.add(3, (g, i, k) => {
          g.array.deselect(i, k);
        }, [i, k]);
      }
    }
  },
};
