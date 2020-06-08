/* eslint-disable brace-style */
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
procedure BinaryTreeInsertion(Tree, DataItem):  $start
  Ptr = Parent = Root;                  $1            (* Set search pointer Ptr to root *)
  while (Ptr Not Null)                  $2            (* Continue searching until we go past a leaf to Null *)
    Parent = Ptr;                       $3            (* Set parent pointer to search pointer Ptr *)
    if(less(DataItem, Ptr->Item))       $4            (* If DataItem less than the data pointed by the search pointer *)
      Ptr = Ptr->lchild                 $5            (* Item key is less, so should follow the left child on search path *)
    else                                $a                                             
      Ptr = Ptr->rchild                 $6            (* Item key is greater or equal, so should follow the right child on search path *)
    end if                              $b
  end while                             $c

  if(less(DataItem, Parent->key))       $7            (* If DataItem less than the data pointed by the parent pointer *)
    Parent->lchild = newnode(DataItem)  $8            (* Item key is less, so should create the new node on the left child on search path *)
  else                                  $d
    Parent->rchild = newnode(DataItem)  $9           (* Item key is greater or equal, so should create the new node on the right child on search path *)
  end if                                $end
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
      
      const tree = {};
      let parent;
      tree[root] = {};
      
      yield { step: 'start' };  this.graph.addNode(root);
                                this.graph.layoutTree(root, true);

                                for (let i = 1; i < this.elements.length; i++) {
                                  const element = this.elements[i];
      // yield { step: i };          this.bstInsert(root, this.elements[i]); // insert ith element
                                  
      yield { step: '1' };        let ptr = tree;
                                  parent = root;
                                  
      yield { step: '2' };        while (ptr) {
      yield { step: '4' };          if (element < parent) {
                                      if (tree[parent].left) {
                                        // if has left child
                                        parent = tree[parent].left;
      yield { step: '5' };              ptr = tree[parent];
                                      } else {
      yield { step: '8' };                tree[parent].left = element;
                                        tree[element] = {};
                                        this.graph.addNode(element);
                                        this.graph.addEdge(parent, element);
                                        break;
                                      }
                                    } else if (element > parent) {
                                      if (tree[parent].right) {
                                        // if has right child
                                        parent = tree[parent].right;
      yield { step: '6' };                ptr = tree[parent];
                                    } else {
      yield { step: '9' };                tree[parent].right = element;
                                        tree[element] = {};
                                        this.graph.addNode(element);
                                        this.graph.addEdge(parent, element);
                                        break;
                                      }
                                    }
                                  }                                 
      yield { step: 'end' };                          }
  },
};
