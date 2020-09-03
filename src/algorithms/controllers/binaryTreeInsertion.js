/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../../pseudocode/parse';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import { BSTExp } from '../explanations';

export default {
  pseudocode: parse(`
  \\Code{
      Main
      BST_Build(keys)  // return the BST that results from inserting nodes \\B start
                       // with keys 'keys', in the given order, into an
                       // initially empty BST
      t <- Empty \\B 1
      for each k in keys \\B 2
      \\In{
          t <- BST_Insert(t, k) \\Ref Insert
      \\In}
  \\Code}
  \\Code{
      Insert
      // Insert key k in BST t, maintaining the BST invariant
      n <- new Node     // create a new node to hold key k \\B 3
      n.key <- k \\B 4
      n.left <- Empty   // it will be a leaf, that is, \\B 5
      n.right <- Empty  // it has empty subtrees \\B 6

      if t = Empty \\B 7
      \\In{
          t <- n      // in this case, the result is a tree with just one node \\B 8
          \\Expl{  If the tree is initially empty, the resulting BST is just
                  the new node, which has key k, and empty sub-trees.
          \\Expl}
      \\In}
      else
      \\In{
        Locate the node p that should be the parent of the new node n. \\Ref Locate
        if k < p.key  \\B 9
        \\Expl{  The new node n (whose key is k) will be a child of p. We just 
                need to decide whether it should be a left or a right child of p.
        \\Expl}
        \\In{
            p.left <- n       // insert n as p's left child \\B 10
        \\In}
        else
        \\In{
            p.right <- n      // insert n as p's right child  \\B 11
        \\In}
      \\In}
  \\Code}
    
  \\Code{
    Locate
    c <- t            // c traverses the path from the root to the insertion point \\B 13
    
    \\Expl{  c is going to follow a path down to where the new node is to 
            be inserted. We start from the root (t).
    \\Expl}
    repeat
    \\In{
        p <- c        // when the loop exits, p will be c's parent \\B 14
        \\Expl{  Parent p and child c will move in lockstep, with p always 
                trailing one step behind c.
        \\Expl}
        if k < c.key \\B 15
        \\Expl{  The BST condition is that nodes with keys less than the current
                node's key are to be found in the left subtree, and nodes whose
                keys are greater (or the same) are to be in the right subtree.
        \\Expl}
        \\In{
            c <- c.left \\B 16
        \\In}
        else
        \\In{
            c <- c.right \\B 17
        \\In}
    \\In}
    until c = Empty \\B 18
    \\Expl{  At the end of this loop, c has located the empty subtree where new
            node n should be located, and p will be the parent of the new node.
    \\Expl}
  \\Code}
`),

  explanation: BSTExp,

  initVisualisers() {
    return {
      array: {
        instance: new Array1DTracer('array', null, 'Keys to insert'),
        order: 0
      },
      graph: {
        instance: new GraphTracer('bst', null, 'Binary tree'),
        order: 1
      }, 
    };
  },

  /**
   * 
   * @param {object} chunker 
   * @param {array} nodes array of numbers needs to be inserted 
   */
  run(chunker, { nodes }) {
    if (nodes.length === 0) return;
    
    // tree is an object contains nodes and edges, e.g.
    //  {
    //   0: {},
    //   1: { right: 2, left: 0 },
    //   2: {},
    //   3: { right: 4, left: 1 },
    //   4: {},
    //   5: { right: 8, left: 3 },
    //   6: { right: 7 },
    //   7: {},
    //   8: { right: 10, left: 6 },
    //   9: {},
    //   10: { left: 9 },
    // };
    let parent;
    const tree = {};
    const root = nodes[0];
    tree[root] = {};

    // populate the ArrayTracer using nodes
    chunker.add('1', (vis, elements) => {
      vis.array.set(elements);
      vis.array.select(0); // the index of root element is 0
    }, [nodes]);
    chunker.add(2);
    chunker.add(3, (vis, r) => {
      vis.graph.addNode(r);
      vis.graph.layoutTree(r, true);
    }, [root]);
    chunker.add(4);
    chunker.add(5);
    chunker.add(6);
    chunker.add(7);
    chunker.add(8);
    for (let i = 1; i < nodes.length; i++) {
      chunker.add(2, (vis, index) => {
        vis.array.deselect(index - 1);
        vis.array.select(index);
      }, [i]);
      const element = nodes[i];
      chunker.add(3);
      chunker.add(4);
      chunker.add(5);
      chunker.add(6);
      chunker.add(7);
      chunker.add(13);
      let ptr = tree;
      parent = root;
      while (ptr) {
        chunker.add(14);
        chunker.add(15);
        if (element < parent) {
          chunker.add(16);
          chunker.add(18);
          if (tree[parent].left !== undefined) {
            // if current node has left child
            parent = tree[parent].left;
            ptr = tree[parent];
          } else {
            chunker.add(9);
            tree[parent].left = element;
            tree[element] = {};
            chunker.add(10, (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
            }, [element, parent]);
            break;
          } 
        } else if (element > parent) {
          chunker.add(17);
          chunker.add(18);
          if (tree[parent].right !== undefined) {
            // if current node has right child
            parent = tree[parent].right;
            ptr = tree[parent];
          } else {
            chunker.add(9);
            tree[parent].right = element;
            tree[element] = {};
            chunker.add(11, (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
            }, [element, parent]);
            break;
          } 
        } else {
          break;
        }
      }
    }
  },
};
