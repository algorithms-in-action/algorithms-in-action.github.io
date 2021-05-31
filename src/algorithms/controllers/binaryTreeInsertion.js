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
    let prev = null;
    let visitedList = [null];
    const tree = {};
    const root = nodes[0];
    tree[root] = {};

    // populate the ArrayTracer using nodes
    chunker.add('1', (vis, elements) => {
      vis.array.set(elements);
      // vis.array.select(0); // the index of root element is 0
    }, [nodes]);
    chunker.add('1', (vis) => {
      vis.array.select(0); // the index of root element is 0
    });
    chunker.add(2);
    chunker.add(3, (vis, r) => {
      vis.graph.addNode(r);
      vis.graph.layoutBST(r, true);
      vis.graph.select(r, null);
    }, [root]);
    chunker.add(4);
    chunker.add(5);
    chunker.add(6);
    chunker.add(7);
    chunker.add(8);
    for (let i = 1; i < nodes.length; i++) {
      chunker.add(2, (vis, index, visited) => {
        vis.array.deselect(index - 1);
        vis.array.select(index);
        for (let j = 1; j < visited.length; j++) {
          vis.graph.leave(visited[j], visited[j - 1]);
        }
        if (nodes[index - 1] !== visited[visited.length - 1]) {
          vis.graph.deselect(nodes[index - 1], visited[visited.length - 1]);
        }
      }, [i, visitedList]);
      visitedList = [null];
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
        visitedList.push(parent);
        chunker.add(14, (vis, c, p) => vis.graph.visit(c, p), [parent, prev]);
        chunker.add(15);
        if (element < parent) {
          chunker.add(16);
          chunker.add(18);
          if (tree[parent].left !== undefined) {
            // if current node has left child
            prev = parent;
            parent = tree[parent].left;
            ptr = tree[parent];
          } else {
            chunker.add(9);
            tree[parent].left = element;
            tree[element] = {};
            chunker.add(10, (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
              vis.graph.select(e, p);
            }, [element, parent]);
            break;
          }
        } else if (element > parent) {
          chunker.add(17);
          chunker.add(18);
          if (tree[parent].right !== undefined) {
            // if current node has right child
            prev = parent;
            parent = tree[parent].right;
            ptr = tree[parent];
          } else {
            chunker.add(9);
            tree[parent].right = element;
            tree[element] = {};
            chunker.add(11, (vis, e, p) => {
              vis.graph.addNode(e);
              vis.graph.addEdge(p, e);
              vis.graph.select(e, p);
            }, [element, parent]);
            break;
          }
        } else {
          break;
        }
      }
    }
    // deselect the last element in the array
    chunker.add(2, (vis, index, visited) => {
      vis.array.deselect(index);
      for (let j = 1; j < visited.length; j++) {
        vis.graph.leave(visited[j], visited[j - 1]);
      }
      if (nodes[index] !== visited[visited.length - 1]) {
        vis.graph.deselect(nodes[index], visited[visited.length - 1]);
      }
    }, [nodes.length - 1, visitedList]);
    // for test
    // eslint-disable-next-line consistent-return
    return tree;
  },
};
