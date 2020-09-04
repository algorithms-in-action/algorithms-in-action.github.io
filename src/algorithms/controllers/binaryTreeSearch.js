/* eslint-disable no-lonely-if */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../../pseudocode/parse';
import { BSTExp } from '../explanations';

export default {
  name: 'Binary Tree Search',
  pseudocode: parse(`
    \\Code{
    Main
    BST_Search(t, k)  // return subtree whose root has key k; or
                      // NotFound is no such node is present
    \\In{
        while t not Empty \\B 1
        \\In{
            if t.key = k  \\B 2
            \\In{
                return t \\B 3
                \\Expl{  We have found a node with the desired key k.
                \\Expl}
            \\In}
            if t.key > k  \\B 4
            \\Expl{  The BST condition is that nodes with keys less than the 
                    current node's key are to be found in the left subtree, and
                    nodes whose keys are greater are to be in the right subtree.
            \\Expl}
            \\In{
                t <- t.left \\B 5
            \\In}
            else
            \\In{
                t <- t.right \\B 6
            \\In}
        return NotFound \\B 7
        \\In}
    \\In}
    \\Code}
  `),

  explanation: BSTExp,

  /**
   * For the search algorithm, we use the tree that is created in 
   * the insertion algorithm to initialise the visualiser 
   * @param {object} visualiser 
   */
  initVisualisers({ visualiser }) {
    // clear existing trace, if any
    visualiser.graph.instance.clear();
    return {
      graph: {
        instance: visualiser.graph.instance,
        order: 0
      }
    };
  },

  /**
   * We use the tree that is created in the insertion algorithm to search
   * @param {object} chunker 
   * @param {object} visualiser 
   * @param {number} target 
   */
  run(chunker, { visualiser, target }) {
    const tree = visualiser.graph.instance.getTree();
    const root = visualiser.graph.instance.getRoot();
    const item = target;

    let current = root;
    let parent = null;

    chunker.add(1, (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
    let ptr = tree;
    parent = current;

    while (ptr) {
      chunker.add(2);
      if (current === item) {
        chunker.add(3);
        return;
      }

      chunker.add(4);
      if (item < current) {
        if (tree[current].left !== undefined) {
          // if current node has left child
          parent = current;
          current = tree[current].left;
          ptr = tree[current];
          chunker.add(5, (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
        } else {
          break;
        }
      } else {
        if (tree[current].right !== undefined) {
          // if current node has right child
          parent = current;
          current = tree[current].right;
          ptr = tree[current];
          chunker.add(6, (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
        } else {
          break;
        }
      }
    }
    chunker.add(7);
  },
};
