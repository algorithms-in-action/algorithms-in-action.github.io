/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../pseudocode/parse';
import GraphTracer from '../components/Graph/GraphTracer';
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

  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('key', null, 'Seaching for Item = 2'),
        order: 0
      }
    };
  },

  run(chunker) {
    const tree = [5,
      [3, [1, [0], [2]], [4]],
      [8, [6, [7]], [10, [9]]]
    ];
    const nodes = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    ];
    const root = 5;
    const item = 2;

    chunker.add('start', (vis) => {
      vis.graph.set(nodes);
      vis.graph.layoutTree(root);
    });

    let current = tree[0];
    let parent = null;

    chunker.add('1', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
    let ptr = tree;
    parent = current;

    chunker.add('2');
    while (ptr) {
      chunker.add('3');
      if (ptr[0] === item) {
        chunker.add('4');
        return;
      }
      chunker.add('5');

      if (item < ptr[0]) {
        parent = current;
        current = ptr[1][0];
        ptr = ptr[1];
        chunker.add('6', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
      } else {
        parent = current;
        current = ptr[2][0];
        ptr = ptr[2];
        chunker.add('7', (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
      }
    }
  },
};
