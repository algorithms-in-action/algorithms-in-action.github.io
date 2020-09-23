/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-lonely-if */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../../pseudocode/parse';
import { BSTExp } from '../explanations';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';

export default {
  name: 'Transitive CLosure',
    pseudocode: parse(`
    \\Code{
      Main
      Warshall(A, n)  \\B 1
      \\Expl{  Compute the transitive closure of a directed graph G 
        with nodes 1..n, represented by n x n adjacency matrix A 
      \\Expl}
      \\In{
        for k <- 1 to n   
        \\Expl{  Consider all possible nodes k that might be
          used as stepping stones on the way from i to j.
        \\Expl}  
        \\In{
          for i <- 1 to n   
          \\Expl{  Explore and try to add new paths from each source node i.
          \\Expl} 
          \\In{
            find all nodes reachable from i via k      \\Ref Reachable  
            \\Expl{  Identify target nodes j that are reachable from 
              source node i, whether they were already reachable 
              before now, or whether they are now reachable using 
              node k as a stepping stone.
            \\Expl}
          \\In}
        \\In}
      \\In}
    \\Code}
  
    \\Code{
      Reachable  
      // Consider all paths from i to j, either already reachable
                 // or now reachable using k as an intermediate
      if A[i,k]  \\B 2
      \\Expl{ When A[i,k] is 0 (that is, there is no path from i to k), k
        cannot possibly be a stepping stone in the path from i to j,
        so we do not explore whether there is a path from k to j.
      \\Expl}
      \\In{
        for j <- 1 to n  
        \\Expl{ Consider paths to all possible target nodes j.
        \\Expl} 
        \\In{
          if A[k,j]   \\B 3
          \\Expl{  Check if there is a path from this intermediate 
          node k to target node j.
          \\Expl} 
          \\In{
            A[i,j] <- 1     \\B 4
            \\Expl{  Record the new path from i to j (through k) in the 
              reachability matrix by setting A[i,j] to 1 (if there
              was already a path from i to j in the reachability
              matrix, then it remains there, whether or not that
              path goes through k.
            \\Expl} 
          \\In}
        \\In}
      \\In}
    \\Code}
  `),
  explanation: BSTExp,

  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('key', null, 'Transitive Closure'),
        order: 0
      }, 
    };
  },

  run(chunker, { matrix, size }) {
    const nodes = matrix;
    const numOfNodes = size;
    
    chunker.add(1, (g) => {
      g.graph.set(nodes);
      g.graph.layoutCircle();
    }, [this.graph]);

    for (let k = 0; k < numOfNodes; k++) {
      for (let i = 0; i < numOfNodes; i++) {
        if (nodes[i][k] === 1) {
          for (let j = 0; j < numOfNodes; j++) {
            if (nodes[k][j] === 1) {
              chunker.add(2, (g, i, j) => {
                g.graph.visit(i);
                g.graph.visit(k, i);
                g.graph.visit(j, k);
              }, [i, j, k]);
              

              chunker.add(3, (g, i, j) => {
                g.graph.visit(j, i);
                g.graph.leave(j, i);
                g.graph.addEdge(i, j);
                g.graph.visit(j, i);
              }, [i, j]);

              
              chunker.add(4, (g, i, j, k) => {
                g.graph.leave(j, i);
                g.graph.leave(j, k);
                g.graph.leave(k, i);
                g.graph.leave(i);
              }, [i, j, k]);
            }  
          } 
       }
     }
  }
  },
};
