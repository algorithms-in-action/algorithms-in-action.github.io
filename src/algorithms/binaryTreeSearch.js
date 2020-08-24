/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../pseudocode/parse';
import GraphTracer from '../components/DataStructures/Graph/GraphTracer';
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
  nodes: [
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
  ],
  root: 5,
  target: 2,
  graph: new GraphTracer('key', null, 'Searching for Item = 2'),
  init() {
    this.graph.set(this.nodes);
    this.graph.layoutTree(this.root);
  },
  // This next line is special syntax for a generator. It's just a function that uses `yield` to
  // return control to the caller regularly. It yields a bookmark so the caller knows where in
  // the pseudocode the execution is up to.
  * run() {
      // const tree = [5, [3, [1], [4]], [8, [6], [10]]];
      const tree = [5, 
        [3, [1, [0], [2]], [4]],
        [8, [6, [7]], [10, [9]]]
      ];
      let current = null;
      let parent = null;
      
      yield { step: 'start' };  current = tree[0];
                                parent = null;
                                const item = this.target;
      yield { step: '1' };      let ptr = tree;
                                parent = current;
                                this.graph.visit(current, parent);
      yield { step: '2' };      while (ptr) {
      yield { step: '3' };        if (ptr[0] === item) {
      yield { step: '4' };          return;
                                  }
      yield { step: '5' };        if (item < ptr[0]) {
                                    parent = current;
                                    current = ptr[1][0];
        yield { step: '6' };        ptr = ptr[1];
                                    this.graph.visit(current, parent);
                                  } else {
                                    parent = current;
                                    current = ptr[2][0];
        yield { step: '7' };        ptr = ptr[2];
                                    this.graph.visit(current, parent);
                                  }
                                }
      yield { step: '8' };
  },
};
