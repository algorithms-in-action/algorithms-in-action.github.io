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

  run(chunker, { matrix, size }) {
    const nodes = [...matrix];
    const numOfNodes = size;
    
    chunker.add(1, (g) => {
      g.graph.set(nodes);
      g.graph.layoutCircle();
      // initialise the matrix in the 'Matrix' component
      g.array.set(nodes);
    }, [this.graph], [this.array]);

    for (let k = 0; k < numOfNodes; k++) {
      for (let i = 0; i < numOfNodes; i++) {
        if (nodes[i][k]) {
          chunker.add(2, (g, i) => {
            // if a path between i and k is found, highlight the edge in blue
            g.graph.visit(i);
            g.graph.visit(k, i);
          }, [i, k]);
              
          for (let j = 0; j < numOfNodes; j++) {
            if (nodes[k][j]) {
              nodes[i][j] = 1;
              
              chunker.add(2, (g, i, j) => {
                // if a path between j and k is found, highlight the edge in blue
                g.graph.visit(j, k);
              }, [i, j, k]);
              

              chunker.add(3, (g, i, j) => {
                // there is a path between i and j, add a new edge and highlight the edge in blue
                g.graph.addEdge(i, j);
                g.graph.visit(j, i);
                // highlight the node (i,j) in the matrix when a path is found 
                g.array.select(i, j);
              }, [i, j]);

              
              chunker.add(4, (g, i, j, k) => {
                // leave the node (i,j) to move to the next node
                g.graph.leave(j, i);
                // remove highlighting from the node (i,j) in the matrix to move to the next element
                g.array.deselect(i, j);
                // leave the node (k,j) to move to the next node
                g.graph.leave(j, k);
              }, [i, j, k]);
            }
          }
          chunker.add(4, (g, i, k) => {
            // leave the node (i,k) to move to the next node
            g.graph.leave(k, i);
            g.graph.leave(i);
          }, [i, k]);
        }
      }
    }
    // for test
    return nodes;
  },
};
