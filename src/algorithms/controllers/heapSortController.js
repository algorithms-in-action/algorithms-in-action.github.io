/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../../pseudocode/parse';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { BSTExp } from '../explanations';

export default {
  pseudocode: parse(`
  \\Code{
    Main
    BST_Build(keys)  // return the BST that results from inserting nodes
                     // with keys 'keys', in the given order, into an
                     // initially empty BST
    t <- Empty
    for each k in keys
    \\In{
        t <- BST_Insert(t, k) \\Ref Insert
    \\In}
    \\Code}
  \\Code{
    Insert
    BST_Insert(t, k) // Insert key k in BST t, maintaining the BST invariant
    \\In{
        n <- new Node     // create a new node to hold key k
        n.key <- k
        n.left <- Empty   // it will be a leaf, that is,
        n.right <- Empty  // it has empty subtrees
        
        if t = Empty
        \\In{
            return n      // in this case, the result is a tree with just one node
            \\Expl{  If the tree is initially empty, the resulting BST is just
                    the new node, which has key k, and empty sub-trees.
            \\Expl}
        \\In}
        Locate the node p that should be the parent of the new node n. \\Ref Locate
        if k < p.key 
        \\Expl{  The new node n (whose key is k) will be a child of p. We just 
                need to decide whether it should be a left or a right child of p.
        \\Expl}
        \\In{
            p.left <- n       // insert n as p's left child         
        \\In}
        else
        \\In{
            p.right <- n      // insert n as p's right child        
        \\In}
        return t                                                    
    \\In}
    \\Code}
    
    \\Code{
    Locate
    c <- t            // c traverses the path from the root to the insertion point
    
    \\Expl{  c is going to follow a path down to where the new node is to 
            be inserted. We start from the root (t).
    \\Expl}
    repeat
    \\In{
        p <- c        // when the loop exits, p will be c's parent
        \\Expl{  Parent p and child c will move in lockstep, with p always 
                trailing one step behind c.
        \\Expl}
        if k < c.key
        \\Expl{  The BST condition is that nodes with keys less than the current
                node's key are to be found in the left subtree, and nodes whose
                keys are greater (or the same) are to be in the right subtree.
        \\Expl}
        \\In{
            c <- c.left
        \\In}
        else
        \\In{
            c <- c.right
        \\In}
    \\In}
    until c = Empty
    \\Expl{  At the end of this loop, c has located the empty subtree where new
            node n should be located, and p will be the parent of the new node.
    \\Expl}
    \\Code}
` ),

  explanation: BSTExp,

  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('', null, 'array'),
        order: 0
      },
      heap: {
        instance: new GraphTracer('', null, 'heap'),
        order: 1
      },
    };
  },

  /**
   * 
   * @param {object} chunker 
   * @param {array} nodes array of numbers needs to be sorted 
   */
  run(chunker, { nodes }) {
    const A = nodes;
    let n = nodes.length - 1;
    let i;
    let heap;
    let swap;

    chunker.add(1, (vis, array) => {  
      vis.heap.setHeap(array);
      vis.array.set(array);
    }, [[...A]]);

    const swapAction = (b1, b2, n1, n2) => {
      // console.log(`swap A[${n1}]=${A[n1]} with A[${n2}]=${A[n2]}`);
      chunker.add(b1, (vis, _n1, _n2) => {  
        vis.heap.visit(_n1 + 1);
        vis.heap.visit(_n2 + 1);
        vis.array.patch(_n1);
        vis.array.patch(_n2);
      }, [n1, n2]);

      chunker.add(b2, (vis, _n1, _n2) => {  
        vis.heap.swapNodes(_n1 + 1, _n2 + 1);
        vis.heap.leave(_n1 + 1);
        vis.heap.leave(_n2 + 1);
        vis.array.swapElements(_n1, _n2);
        vis.array.depatch(_n2);
        vis.array.depatch(_n1);
      }, [n1, n2]);
    };

    for (let k = Math.floor(n / 2); k >= 0; k -= 1) {
      let j;
      heap = false;
      i = k;

      while (!(i > (n - 1) / 2 || heap)) {
        if (2 * i < n && A[2 * i] < A[2 * i + 1]) {
          j = 2 * i + 1;
        } else {
          j = 2 * i;
        }

        if (A[i] >= A[j]) {
          heap = true;
        } else {
          swapAction(1, 2, i, j);
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          i = j;
        }
      }
    }

    while (n > 0) {
      let j;
      swapAction(1, 2, 0, n);
      swap = A[n];
      A[n] = A[0];
      A[0] = swap;

      n -= 1;
      i = 0;
      heap = false;

      while (!(i > (n - 1) / 2 || heap)) {
        if (2 * i < n && A[2 * i] < A[2 * i + 1]) {
          j = 2 * i + 1;
        } else {
          j = 2 * i;
        }

        if (A[i] >= A[j]) {
          heap = true;
        } else {
          swapAction(1, 2, i, j);
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          i = j;
        }
      }
    }
  },
};
