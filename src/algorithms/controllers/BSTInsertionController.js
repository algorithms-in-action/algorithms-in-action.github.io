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
  elements: [],  // elements to be inserted, e.g. [5,8,10,3,1,6,9,7,2,0,4]
  graph: new GraphTracer('key1', null, 'BST - Insertion'),
  tree: {},
  reset() {
    // reset the graph
    this.graph = new GraphTracer('key2', null, 'BST - Insertion');
    this.elements = [];
    this.tree = {};
  },
  /**
   * 
   * @param {array} nodes array of numbers
   * @return the new graph and tree
   */
  init(nodes) {
    // set data dynamically
    this.elements = nodes;
    return { 
      graph: this.graph, 
      tree: this.tree 
    };
  },
  // This next line is special syntax for a generator. It's just a function that uses `yield` to
  // return control to the caller regularly. It yields a bookmark so the caller knows where in
  // the pseudocode the execution is up to.
  * run() {
      const root = this.elements[0];  // take first element as root

      let parent;
      if (root) {
        this.tree[root] = { root: true };
      }

      yield { step: 'start' };  this.graph.addNode(root);
                                this.graph.layoutTree(root, true);

                                for (let i = 1; i < this.elements.length; i++) {
                                  const element = this.elements[i];
                                  
      yield { step: '1' };        let ptr = this.tree;
                                  parent = root;
                                  
      yield { step: '2' };        while (ptr) {
      yield { step: '4' };          if (element < parent) {
                                      if (this.tree[parent].left !== undefined) {
                                        // if has left child
                                        parent = this.tree[parent].left;
      yield { step: '5' };              ptr = this.tree[parent];
                                      } else {
      yield { step: '8' };                this.tree[parent].left = element;
                                        this.tree[element] = {};
                                        this.graph.addNode(element);
                                        this.graph.addEdge(parent, element);
                                        break;
                                      }
                                    } else if (element > parent) {
                                      if (this.tree[parent].right !== undefined) {
                                        // if has right child
                                        parent = this.tree[parent].right;
      yield { step: '6' };                ptr = this.tree[parent];
                                    } else {
      yield { step: '9' };                this.tree[parent].right = element;
                                        this.tree[element] = {};
                                        this.graph.addNode(element);
                                        this.graph.addEdge(parent, element);
                                        break;
                                      }
                                    }
                                  } 
      yield { step: 'end' };                          }
  },
};
