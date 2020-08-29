/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../../pseudocode/parse';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
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
`),

  explanation: BSTExp,

  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('bst', null, 'BST'),
        order: 0
      }
    };
  },

  /**
   * 
   * @param {object} chunker 
   * @param {array} nodes array of numbers needs to be inserted 
   */
  run(chunker, { nodes }) {
    let parent;
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
    const tree = {};
    const root = nodes[0];
    chunker.add(2);
    tree[root] = {};
    
    if (nodes.length === 0) return;
    chunker.add(3);
    chunker.add(6, (vis, r) => {   
      vis.graph.addNode(r);
      vis.graph.layoutTree(r, true);
    }, [root]);

    for (let i = 1; i < nodes.length; i++) {
      chunker.add(3);
      const element = nodes[i];

      let ptr = tree;
      parent = root;

      chunker.add(12);
      while (ptr) {
        chunker.add(14);
        if (element < parent) {
          chunker.add(16);
          if (tree[parent].left !== undefined) {
            // if current node has left child
            chunker.add(17);
            parent = tree[parent].left;
            ptr = tree[parent];
          } else {
            tree[parent].left = element;
            tree[element] = {};
            chunker.add(22, (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
            }, [element, parent]);
            break;
          } 
        } else if (element > parent) {
          chunker.add(18);
          if (tree[parent].right !== undefined) {
            // if current node has right child
            chunker.add(19);
            parent = tree[parent].right;
            ptr = tree[parent];
          } else {
            tree[parent].right = element;
            tree[element] = {};
            chunker.add(24, (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
            }, [element, parent]);
            break;
          }
        }
      }
    }
    chunker.add(25);
  },
};
