/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../pseudocode/parse';
import GraphTracer from '../components/DataStructures/Graph/GraphTracer';
import { BSTExp } from './explanations';

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

  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('bst', null, 'BST'),
        order: 0
      }
    };
  },

  /**
   * 
   * @param {object} chunker 
   * @param {array} nodes array of numbers needs to be inserted 
   */
  run(chunker, { nodes }) {
    let parent;
    // tree is an object contains nodes and edges, e.g.
    //  {
    //   0: {},
    //   1: { right: 2, left: 0 },
    //   2: {},
    //   3: { right: 4, left: 1 },
    //   4: {},
    //   5: { right: 8, left: 3 },
    //   6: { right: 7 },
    //   7: {},
    //   8: { right: 10, left: 6 },
    //   9: {},
    //   10: { left: 9 },
    // };
    const tree = {};
    const root = nodes[0];
    tree[root] = {};

    chunker.add('start');   
    if (nodes.length === 0) return;

    chunker.add('1', (vis, r) => {   
      vis.graph.addNode(r);
      vis.graph.layoutTree(r, true);
    }, [root]);

    for (let i = 1; i < nodes.length; i++) {
      const element = nodes[i];

      chunker.add('1');
      let ptr = tree;
      parent = root;

      chunker.add('2');
      while (ptr) {
        chunker.add('4');
        if (element < parent) {
          if (tree[parent].left !== undefined) {
            // if current node has left child
            chunker.add('5');
            parent = tree[parent].left;
            ptr = tree[parent];
          } else {
            tree[parent].left = element;
            tree[element] = {};
            chunker.add('8', (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
            }, [element, parent]);
            break;
          } 
        } else if (element > parent) {
          if (tree[parent].right !== undefined) {
            // if current node has right child
            chunker.add('6');
            parent = tree[parent].right;
            ptr = tree[parent];
          } else {
            tree[parent].right = element;
            tree[element] = {};
            chunker.add('9', (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
            }, [element, parent]);
            break;
          }
        }
      }
      chunker.add('end');
    }
  },
};
