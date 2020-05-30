/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../pseudocode/parse';

export default {
  name: 'Binary Tree Search',
  pseudocode: parse(`
procedure BinaryTreeSearch(Tree, Item):  $start
  Ptr = Root;                   $1            (* Set search pointer Ptr to root *)
  while (Ptr Not Null)          $2            (* Continue searching until we go past a leaf to Null *)
    if(Ptr->Key == Item)        $3            (* Compare to see if keys match *)
      return FOUND              $4            (* Keys match, item has been found in tree *)
    else
      if(DataItem < Ptr->Key)   $5            (* Compare data item and the data pointed by the search pointer *)
        Ptr = Ptr->lchild       $6            (* Item key is less, so should follow the left child on search path. *)
      else                                    (* Item key is greater or equal to data pointed by the search pointer. *)
        Ptr = Ptr->rchild       $7            (* Item key is greater or equal, so should follow the right child on search path *)
      end if
    end if
  end while
  return NOTFOUND               $8            (* Following along the search path, item was not encountered, so it must not be in the tree. *)
`),
  explanation: '## Binary Search Tree \n'
  + 'A binary search tree (bst) is a basic tree data structure that supports a simple searching algorithm. For each node in the binary search tree, with key `k`, all nodes in its left subtree have keys smaller than `k`, while all nodes in its right subtree have keys larger than `k`. Where duplicate keys are allowed in the tree, they usually go into the right subtree by convention.\n\n'
  + 'The binary search tree is built up by adding items one at a time. Since the average path length in a tree of `n` items is `log n`, the average case complexity of building a bst is `O(n log n)`. Similarly, the average case for a search for `m` items in a tree of n items is `O(m log n)`, that is `O(log n)` per item.\n\n'
  + 'The biggest problem with the binary search tree is that its behavior degenerates when there is order in the input data. In the worst case, sorted or reverse sorted data items yield a linear tree, or "stick", the complexity of building the tree is `O(n^2)`, and the complexity of a search for a single item is `O(n)`.',

  // This next line is special syntax for a generator. It's just a function that uses `yield` to
  // return control to the caller regularly. It yields a bookmark so the caller knows where in
  // the pseudocode the execution is up to.
  * run() {
      const tree = [5, [3, [1], [4]], [8, [6], [10]]];
      yield 'start'; const item = 1;
      yield '1';     let ptr = tree;
      yield '2';     while (ptr) {
      yield '3';       if (ptr[0] === item) {
      yield '4';         return;
                       }
      yield '5';       if (item < ptr[0]) {
      yield '6';         ptr = ptr[1];
                       } else {
      yield '7';         ptr = ptr[2];
                       }
                     }
      yield '8';
  },
};
