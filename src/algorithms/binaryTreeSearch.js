/* eslint-disable no-lonely-if */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../pseudocode/parse';
import { BSTExp } from './explanations';

export default {
  name: 'Binary Tree Search',
  pseudocode: parse(`
procedure BinaryTreeSearch(Tree, Item):  $start
  Ptr = Root;                   $1            (* Set search pointer Ptr to root *)
  while (Ptr Not Null)          $2            (* Continue searching until we go past a leaf to Null *)
    if(Ptr->Key == Item)        $3            (* Compare to see if keys match *)
      return FOUND              $4            (* Keys match, item has been found in tree *)
    else                        $a
      if(DataItem < Ptr->Key)   $5            (* Compare data item and the data pointed by the search pointer *)
        Ptr = Ptr->lchild       $6            (* Item key is less, so should follow the left child on search path. *)
      else                      $b            (* Item key is greater or equal to data pointed by the search pointer. *)
        Ptr = Ptr->rchild       $7            (* Item key is greater or equal, so should follow the right child on search path *)
      end if                    $c
    end if                      $d
  end while                     $e
  return NOTFOUND               $8            (* Following along the search path, item was not encountered, so it must not be in the tree. *)
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

    chunker.add('start');

    let current = root;
    let parent = null;

    chunker.add('1', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
    let ptr = tree;
    parent = current;

    chunker.add('2');
    while (ptr) {
      chunker.add('3');
      if (current === item) {
        chunker.add('4');
        return;
      }

      chunker.add('5');
      if (item < current) {
        if (tree[current].left !== undefined) {
          // if current node has left child
          parent = current;
          current = tree[current].left;
          ptr = tree[current];
          chunker.add('6', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
        } else {
          break;
        }
      } else {
        if (tree[current].right !== undefined) {
          // if current node has right child
          parent = current;
          current = tree[current].right;
          ptr = tree[current];
          chunker.add('7', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
        } else {
          break;
        }
      }
    }
    chunker.add('8');
  },
};
