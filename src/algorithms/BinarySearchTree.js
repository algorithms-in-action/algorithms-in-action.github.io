/* eslint-disable no-prototype-builtins */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../pseudocode/parse';
import GraphTracer from '../components/Graph/GraphTracer';
import { BSTExp } from './explanations';

export default {
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
  nodes: [[]], // a 2D array of nodes, e.g.
              // [
              //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              //   [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              //   [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
              //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              //   [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
              //   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
              //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              //   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
              //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
              // ],
  tree: {},  // an object contains nodes and edges, e.g.
          //  {
          //   0: {},
          //   1: { right: 2, left: 0 },
          //   2: {},
          //   3: { left: 1, right: 4 },
          //   4: {},
          //   5: { root: true, right: 8, left: 3 },
          //   6: { right: 7 },
          //   7: {},
          //   8: { right: 10, left: 6 },
          //   9: {},
          //   10: { left: 9 },
          // };
  root: -1,
  target: -1,
  graph: new GraphTracer('key', null, 'Searching for Item = 2'),
  init(tree, target) {
    this.tree = tree;
    console.log(this.tree);
    // const nodes2D = this.transform(tree);
    // this.nodes = nodes2D;
    // console.log(this.nodes);
    this.target = target;
    this.graph.mySet(tree);
    this.setRoot(tree);
    this.graph.layoutTree(this.root);
  },
  setRoot(tree) {
    for (const [node, children] of Object.entries(tree)) {
      // set root node
      if (children.hasOwnProperty('root')) {
        this.root = +node;
      }
    }
  },
  /**
   * transform a tree to a 2D array
   * @param {object} tree something like {0: {}, 1: {right: 2, left: 0}, ...}
   * @return 2D array of nodes
   */
  transform(tree) {
    const nodes = [];
    const len = Object.entries(tree).length;
    for (const [node, children] of Object.entries(tree)) {
      const row = [];
      // set root node
      if (children.hasOwnProperty('root')) {
        this.root = +node;
      }
      const r = children.hasOwnProperty('right') ? children.right : -1;
      const l = children.hasOwnProperty('left') ? children.left : -1;
      for (let i = 0; i < len; i += 1) {
        if (i === r || i === l) {
          row.push(1);
        } else {
          row.push(0);
        }
      }
      nodes.push(row);
    }
    return nodes;
  },
  // This next line is special syntax for a generator. It's just a function that uses `yield` to
  // return control to the caller regularly. It yields a bookmark so the caller knows where in
  // the pseudocode the execution is up to.
  * run() {
      // const tree = [5, 
      //   [3, [1, [0], [2]], [4]],
      //   [8, [6, [7]], [10, [9]]]
      // ];
      let current = null;
      let parent = null;

      yield { step: 'start' };  current = this.root;
                                parent = null;
                                const item = this.target;
      yield { step: '1' };      let ptr = this.root;
                                parent = current;
                                this.graph.visit(current, parent);
      yield { step: '2' };      while (ptr !== undefined) {
      yield { step: '3' };        if (ptr === item) {
      yield { step: '4' };          return;
                                  }
      yield { step: '5' };        if (item < ptr) {
                                    parent = current;
                                    current = this.tree[ptr].left;
        yield { step: '6' };        ptr = this.tree[ptr].left;
                                    this.graph.visit(current, parent);
                                  } else {
                                    parent = current;
                                    current = this.tree[ptr].right;
        yield { step: '7' };        ptr = this.tree[ptr].right;
                                    this.graph.visit(current, parent);
                                  }
                                }
      yield { step: '8' };
      
      // yield { step: 'start' };  current = tree[0];
      //                           parent = null;
      //                           const item = this.target;
      // yield { step: '1' };      let ptr = tree;
      //                           parent = current;
      //                           this.graph.visit(current, parent);
      // yield { step: '2' };      while (ptr) {
      // yield { step: '3' };        if (ptr[0] === item) {
      // yield { step: '4' };          return;
      //                             }
      // yield { step: '5' };        if (item < ptr[0]) {
      //                               parent = current;
      //                               current = ptr[1][0];
      //   yield { step: '6' };        ptr = ptr[1];
      //                               this.graph.visit(current, parent);
      //                             } else {
      //                               parent = current;
      //                               current = ptr[2][0];
      //   yield { step: '7' };        ptr = ptr[2];
      //                               this.graph.visit(current, parent);
      //                             }
      //                           }
      // yield { step: '8' };
  },
};
