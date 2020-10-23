/* eslint-disable no-plusplus */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';

export default {
  initVisualisers() {
    return {
      array: {
        instance: new Array1DTracer('array', null, 'Keys to insert'),
        order: 0,
      },
      graph: {
        instance: new GraphTracer('bst', null, 'Binary tree'),
        order: 1,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be inserted
   */
  run(chunker, { nodes }) {
    if (nodes.length === 0) return;
    let parent;
    const tree = {};
    const root = nodes[0];
    tree[root] = {};

    // populate the ArrayTracer using nodes
    chunker.add('1', (vis, elements) => {
      vis.array.set(elements);
      vis.array.select(0); // the index of root element is 0
    }, [nodes]);
    chunker.add(2);
    chunker.add(3, (vis, r) => {
      vis.graph.addNode(r);
      vis.graph.layoutTree(r, true);
    }, [root]);
    chunker.add(4);
    chunker.add(5);
    chunker.add(6);
    chunker.add(7);
    chunker.add(8);
    for (let i = 1; i < nodes.length; i++) {
      chunker.add(2, (vis, index) => {
        vis.array.deselect(index - 1);
        vis.array.select(index);
      }, [i]);
      const element = nodes[i];
      chunker.add(3);
      chunker.add(4);
      chunker.add(5);
      chunker.add(6);
      chunker.add(7);
      chunker.add(13);
      let ptr = tree;
      parent = root;
      while (ptr) {
        chunker.add(14);
        chunker.add(15);
        if (element < parent) {
          chunker.add(16);
          chunker.add(18);
          if (tree[parent].left !== undefined) {
            // if current node has left child
            parent = tree[parent].left;
            ptr = tree[parent];
          } else {
            chunker.add(9);
            tree[parent].left = element;
            tree[element] = {};
            chunker.add(10, (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
            }, [element, parent]);
            break;
          }
        } else if (element > parent) {
          chunker.add(17);
          chunker.add(18);
          if (tree[parent].right !== undefined) {
            // if current node has right child
            parent = tree[parent].right;
            ptr = tree[parent];
          } else {
            chunker.add(9);
            tree[parent].right = element;
            tree[element] = {};
            chunker.add(11, (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
            }, [element, parent]);
            break;
          }
        } else {
          break;
        }
      }
    }
    // for test
    // eslint-disable-next-line consistent-return
    return tree;
  },
};
