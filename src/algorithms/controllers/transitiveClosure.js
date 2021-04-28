/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-lonely-if */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('key', null, 'Transitive Closure'),
        order: 0
      }, 
    };
  },

  run(chunker, { matrix, size }) {
    const nodes = [...matrix];
    const numOfNodes = size;
    
    chunker.add(1, (g) => {
      g.graph.set(nodes);
      g.graph.layoutCircle();
    }, [this.graph]);

    for (let k = 0; k < numOfNodes; k++) {
      for (let i = 0; i < numOfNodes; i++) {
        if (nodes[i][k]) {
          chunker.add(2, (g, i) => {
            g.graph.visit(i);
            g.graph.visit(k, i);
          }, [i, k]);
              
          for (let j = 0; j < numOfNodes; j++) {
            if (nodes[k][j]) {
              nodes[i][j] = 1;
              
              chunker.add(2, (g, i, j) => {
                g.graph.visit(j, k);
              }, [i, j, k]);
              

              chunker.add(3, (g, i, j) => {
                g.graph.addEdge(i, j);
                g.graph.visit(j, i);
              }, [i, j]);

              
              chunker.add(4, (g, i, j, k) => {
                g.graph.leave(j, i);
                g.graph.leave(j, k);
              }, [i, j, k]);
            }
          }
          chunker.add(4, (g, i, k) => {
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
