/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../pseudocode/parse';
import GraphTracer from '../components/Graph/GraphTracer';

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
  explanation: 'In computer science, binary search trees (BST), sometimes called ordered or sorted binary trees, are a particular type of container: a data structure that stores "items" (such as numbers, names etc.) in memory. They allow fast lookup, addition and removal of items, and can be used to implement either dynamic sets of items, or lookup tables that allow finding an item by its key (e.g., finding the phone number of a person by name). Binary search trees keep their keys in sorted order, so that lookup and other operations can use the principle of binary search: when looking for a key in a tree (or a place to insert a new key), they traverse the tree from root to leaf, making comparisons to keys stored in the nodes of the tree and deciding, on the basis of the comparison, to continue searching in the left or right subtrees. On average, this means that each comparison allows the operations to skip about half of the tree, so that each lookup, insertion or deletion takes time proportional to the logarithm of the number of items stored in the tree. This is much better than the linear time required to find items by key in an (unsorted) array, but slower than the corresponding operations on hash tables. Several variants of the binary search tree have been studied in computer science; this article deals primarily with the basic type, making references to more advanced types when appropriate. In computer science, binary search trees (BST), sometimes called ordered or sorted binary trees, are a particular type of container: a data structure that stores "items" (such as numbers, names etc.) in memory. They allow fast lookup, addition and removal of items, and can be used to implement either dynamic sets of items, or lookup tables that allow finding an item by its key (e.g., finding the phone number of a person by name). Binary search trees keep their keys in sorted order, so that lookup and other operations can use the principle of binary search: when looking for a key in a tree (or a place to insert a new key), they traverse the tree from root to leaf, making comparisons to keys stored in the nodes of the tree and deciding, on the basis of the comparison, to continue searching in the left or right subtrees. On average, this means that each comparison allows the operations to skip about half of the tree, so that each lookup, insertion or deletion takes time proportional to the logarithm of the number of items stored in the tree. This is much better than the linear time required to find items by key in an (unsorted) array, but slower than the corresponding operations on hash tables. Several variants of the binary search tree have been studied in computer science; this article deals primarily with the basic type, making references to more advanced types when appropriate.',
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
  graph: new GraphTracer('key', null, 'Test graph'),
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
      
      yield { step: 'start', current, parent }; current = tree[0];
                                                parent = null;
                                                const item = 2;
      yield { step: '1', current, parent };     let ptr = tree;
                                                parent = current;
      yield { step: '2', current, parent };     while (ptr) {
      yield { step: '3', current, parent };       if (ptr[0] === item) {
      yield { step: '4', current, parent };         return;
                                                  }
      yield { step: '5', current, parent };       if (item < ptr[0]) {
                                                    parent = current;
                                                    current = ptr[1][0];
      yield { step: '6', current, parent };         ptr = ptr[1];
                                                  } else {
                                                    parent = current;
                                                    current = ptr[2][0];
      yield { step: '7', current, parent };         ptr = ptr[2];
                                                  }
                                                }
      yield { step: '8', current, parent };
  },
};
