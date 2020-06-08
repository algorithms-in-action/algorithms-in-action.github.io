/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../pseudocode/parse';
import GraphTracer from '../components/Graph/GraphTracer';
import { BSTExp } from './explanations';

export default {
  name: 'Binary Tree Insertion',
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
  explanation: BSTExp,
  T: {},
  elements: [5, 8, 10, 3, 1, 6, 9, 7, 2, 0, 4],  // elements to be inserted
  graph: new GraphTracer('key', null, 'Test Insertion Graph'),
  init() {
    // currently do nothing
  },
  bstInsert(root, element, parent) {
    this.graph.visit(root, parent);
    const treeNode = this.T[root];

    let propName = '';
    if (element < root) {
      propName = 'left';
    } else if (element > root) {
      propName = 'right';
    }

    if (propName !== '') {
      if (!(propName in treeNode)) {
        // insert as left child of root
        treeNode[propName] = element;
        this.T[element] = {};
        this.graph.addNode(element);
        this.graph.addEdge(root, element);
        this.graph.select(element, root);
        this.graph.deselect(element, root);
      } else {
        this.bstInsert(treeNode[propName], element, root);
      }
    }
    this.graph.leave(root, parent);
  },
  // This next line is special syntax for a generator. It's just a function that uses `yield` to
  // return control to the caller regularly. It yields a bookmark so the caller knows where in
  // the pseudocode the execution is up to.
  * run() {
      const root = this.elements[0];  // take first element as root
      this.T[root] = {};
      
      yield { step: 'start' };  this.graph.addNode(root);
                                this.graph.layoutTree(root, true);

                                for (let i = 1; i < this.elements.length; i++) {
      yield { step: 'start' };    this.bstInsert(root, this.elements[i]); // insert ith element
                                }
  },
};
