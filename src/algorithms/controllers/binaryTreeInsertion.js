// simple iterative BST
// Various modifications made to improve it and make it more similar
// to other BST variants
// Code structure was rubbish. Still is, as are variable names - doesn't
// bear much resemblance to pseudocode plus tree data structure is a bit
// rubbish.
// XXX new color stuff doesn't color arrow heads? Also hard to see black
// numbers on some node colors so we choose lighter colors here for now
// XXX Best make search look more similar + check pseudocode etc
// XXX added c, labels; p highlighted - OK?

/* eslint-disable no-plusplus */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import {ALGO_COLOR_PALLETE} from '../../components/DataStructures/colors';
const color_c = ALGO_COLOR_PALLETE.sky;
const color_p = ALGO_COLOR_PALLETE.peach;
const color_new = ALGO_COLOR_PALLETE.leaf;
const color_p_c = ALGO_COLOR_PALLETE.peach; // p->c edge
const color_p_new = ALGO_COLOR_PALLETE.leaf; // p->new edge

export default {
  initVisualisers() {
    return {
      // array: {
        // instance: new Array1DTracer('array', null, 'Keys to insert', { arrayItemMagnitudes: true }),
        // order: 0,
      // },
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
    // chunker.add(
      // '1',
      // (vis, elements) => {
        // vis.array.set(elements);
        // // vis.array.select(0); // the index of root element is 0
        // // make a bit more room for tree
        // vis.graph.setSize(2.5);
        // vis.graph.setZoom(0.8);
        // vis.array.setZoom(0.9);
      // },
      // [nodes],
    // );
    // chunker.add('1', (vis) => {
      // vis.array.select(0); // the index of root element is 0
    // });
    chunker.add(1,
      (vis) => {
        vis.graph.setFunctionName("Tree is Empty");
        vis.graph.setZoom(0.5);
      },
      [],
    );
    chunker.add(7,
      (vis, r) => {
        vis.graph.setFunctionName("Inserting:");
        vis.graph.setFunctionInsertText(` ${r} `);
      },
      [root],
    );
    chunker.add(8,
      (vis, r) => {
        vis.graph.addNode(r);
        vis.graph.layoutBST(r, true);
        vis.graph.myColorNode(r, color_new);
      },
      [root],
    );
    chunker.add('end',
      (vis, r) => {
        vis.graph.myColorNode(r, undefined);
      },
      [root]
    );
    for (let i = 1; i < nodes.length; i++) {

      // BST_Insert() call
      prev = null;
      const element = nodes[i];
      chunker.add(
        1,
        (vis, index, visited, rr, k) => {
/*
          for (let j = 1; j < visited.length; j++) {
            vis.graph.leave(visited[j], visited[j - 1]);
          }
          if (nodes[index - 1] !== visited[visited.length - 1]) {
            vis.graph.deselect(nodes[index - 1], visited[visited.length - 1]);
          }
*/
          vis.graph.setFunctionName("Inserting:");
          vis.graph.setFunctionInsertText(` ${k} `);
        },
        [i, visitedList, root, element],
      );
      visitedList = [null];
      chunker.add(7);
      let ptr = tree;
      parent = root;
      chunker.add(13,
        (vis, c) => {
          // vis.graph.myColorNode(c, color_c);
          vis.graph.updateUpperLabel(c, 'c');
        },
        [root]
      );
      while (ptr) {
        visitedList.push(parent);
        chunker.add(14,
          (vis, c, p) => {
            vis.graph.myColorNode(c, color_p);
console.log(p, c);
            if (p !== null)
              vis.graph.myColorNode(p, undefined);
          },
          [parent, prev]
        );
        chunker.add(15);
        if (element < parent) {
          // chunker.add(16);
          // chunker.add(18);
          if (tree[parent].left !== undefined) {
            // if current node has left child
            prev = parent;
            parent = tree[parent].left;
            ptr = tree[parent];
            chunker.add(16,
              (vis, c, p) => {
                // vis.graph.myColorNode(c, color_c);
                vis.graph.updateUpperLabel(p, '');
                vis.graph.updateUpperLabel(c, 'c');
                vis.graph.myColorEdge(p, c, color_p_c);
              },
              [parent, prev]
            );
            chunker.add(18);
          } else {
            chunker.add(16,
              (vis, p) => {
                vis.graph.updateUpperLabel(p, '');
              },
              [parent]
            );
            chunker.add(18);
            chunker.add(9);
            tree[parent].left = element;
            tree[element] = {};
            chunker.add(
              10,
              (vis, e, p) => {
                vis.graph.addNode(e);
                vis.graph.addEdge(p, e);
                vis.graph.updateUpperLabel(p, '');
                vis.graph.myColorNode(e, color_new);
                vis.graph.myColorEdge(p, e, color_p_new);
              },
              [element, parent],
            );
            visitedList.push(element);
            break;
          }
        } else if (element > parent) {
          // chunker.add(17);
          // chunker.add(18);
          if (tree[parent].right !== undefined) {
            // if current node has right child
            prev = parent;
            parent = tree[parent].right;
            ptr = tree[parent];
            chunker.add(17,
              (vis, c, p) => {
                vis.graph.updateUpperLabel(p, '');
                vis.graph.updateUpperLabel(c, 'c');
                vis.graph.myColorEdge(p, c, color_p_c);
              },
              [parent, prev]
            );
            chunker.add(18);
          } else {
            chunker.add(17,
              (vis, p) => {
                vis.graph.updateUpperLabel(p, '');
              },
              [parent]
            );
            chunker.add(18);
            chunker.add(9);
            tree[parent].right = element;
            tree[element] = {};
            chunker.add(
              11,
              (vis, e, p) => {
                vis.graph.addNode(e);
                vis.graph.addEdge(p, e);
                vis.graph.updateUpperLabel(p, '');
                vis.graph.myColorNode(e, color_new);
                vis.graph.myColorEdge(p, e, color_p_new);
              },
              [element, parent],
            );
            visitedList.push(element);
            break;
          }
        } else {
            chunker.add('eq_key',
              (vis, p) => {
                vis.graph.updateUpperLabel(p, '');
              },
              [parent]
            );
          break;
        }
      }
      // deselect everything
      chunker.add('end',
        (vis, el, visited) => {
          for (let j = 1; j < visited.length; j++) {
            vis.graph.myColorEdge(visited[j-1], visited[j], undefined);
            vis.graph.myColorNode(visited[j], undefined);
          }
        },
        [element, visitedList],
      );
    }
    // for test
    // eslint-disable-next-line consistent-return
    return tree;
  },
};
