/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from "../../pseudocode/parse";
import GraphTracer from "../../components/DataStructures/Graph/GraphTracer";
import { BSTExp } from "../explanations";

export default {
  pseudocode: parse(`
  \\Note{  REAL specification of Prim's algorithm
  \\Note}
  
  \\Code{
  Main
  Prim(E, n) // Given a weighted connected graph G with nodes 1..n and edges E,  \\B 1
             // find a minimum spanning tree for G.
  \\In{
      for i <- 1 to n                                             
      \\In{
          Cost[i] <- Infinity                                     
          Prev[i] <- Null
          \\Expl{  The array Prev will be used to track how nodes are 
                  connected into the resulting spanning tree. 
                  Whenever an edge (j,i) is added to the tree, this 
                  is captured by setting Prev[i] to j.
          \\Expl}
      \\In}
      Cost[1] <- 0
      \\Expl{  We arrange for the tree construction to start with
              node 1; this is achieved by setting the cost of node
              1 to 0 (to get from node 1 to itself costs nothing).
              Other nodes initially assigned the largest possible 
              cost, Infinity, as they have not been considered yet.
      \\Expl}
      Q <- InitPriorityQueue(n)                                   
      \\Expl{  Nodes are arranged in the priority queue Q according 
              to cost. Smaller cost means higher priority.
      \\Expl}
      while Q not Empty \\B 2
      \\In{
          i <- RemoveMin(Q)  // i is now part of the spanning tree
          \\Expl{  Node i is closest to the tree constructed so far.
                  More precisely, for every node k inside the current 
                  tree, and every node j outside of it, the weight of
                  (k,i) is smaller than (or possibly equal to) the weight
                  of (k,j) for all outside nodes j. So i is picked as 
                  the next node to add to the tree. Note that, unless 
                  i = 1, prev[i] has already been determined.
          \\Expl}
          update priority queue Q    \\Ref Update
      \\In}
  \\In}
  \\Code}
  
  \\Code{
  Update
  for each (i,j) in E 
  \\Expl{  Now that i gets included in the tree, we need to check the edge 
          to each of its neighbours j.
  \\Expl}
  \\In{
      if j is in Q and weight(i,j) < Cost[j] \\B 3
      \\Expl{  The inclusion of i may have brought i's neighbour j closer 
              to the tree; if so, update the information we have about j.
      \\Expl}
      \\In{
          Cost[j] <- weight(i,j)                                  
          \\Expl{  The new cost for j is its distance to i.
          \\Expl}
          Update(Q, j, Cost[j])                                   
          \\Expl{  Rearrange Q so the priority queue reflects j's new cost.
          \\Expl}
          Prev[j] <- i                                           
          \\Expl{  Record the fact that j's closest neighbour in the 
                  spanning tree (so far) was i.
          \\Expl}
      \\In}
  \\In}
  \\Code}
       
`),

  explanation: BSTExp,

  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer("graph", null, "Prim"),
        order: 0,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   */
  run(chunker, { matrix }) {
    const E = [...matrix];
    const vertex = matrix.length;

    let weight = new Array(matrix.length);
    for (let i = 0; i < weight.length; i += 1) {
      weight[i] = new Array(matrix.length);
    }

    const cost = new Array(matrix.length);
    const pending = new Array(matrix.length);
    const prev = new Array(matrix.length);
    const pq = new Array(matrix.length);
    let pqStart;
    let n;

    chunker.add(
      1,
      (vis, array) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.set(array, Array.from({ length: matrix.length }, (v, k) => (k + 1))
        );
      },
      [E]
    );

    const PqSort = () => {
      let i;
      let j;
      let v;
      for (i = pqStart; i < n; i += 1) {
        v = pq[i];
        for (j = i - 1; j >= pqStart && cost[v] < cost[pq[j]]; j -= 1) {
          pq[j + 1] = pq[j];
        }
        pq[j + 1] = v;
      }
    };

    const PqUpdate = (i) => {
      let j;
      let w;
      for (j = 0; j < n; j += 1) {
        w = weight[i][j];
        if (w > 0 && !prev.includes(j) && pqStart < n) {
          chunker.add(
            3,
            (vis, n1, n2) => {
              vis.graph.visit(n1, n2);
            },
            [i, j]
          );
          chunker.add(
            3,
            (vis, n1, n2) => {
              vis.graph.leave(n1, n2);
            },
            [i, j]
          );
        }
        if (w > 0 && pending[j] && w < cost[j]) {
          cost[j] = w;
          PqSort();
          prev[j] = i;
        }
      }
    };

    let i;
    weight = [...E];
    n = vertex;
    for (i = 0; i < n; i += 1) {
      cost[i] = Infinity;
      prev[i] = 0;
      pending[i] = 1;
    }
    cost[0] = 0;
    for (i = 0; i < n; i += 1) {
      pq[i] = i;
    }
    pqStart = 0;
    while (pqStart < n) {
      i = pq[pqStart];
      chunker.add(
        2,
        (vis, n1, n2) => {
          vis.graph.visit(n1, n2);
        },
        [i, prev[i]]
      );
      pending[i] = 0;
      pqStart += 1;
      PqUpdate(i);
    }
  },
};
