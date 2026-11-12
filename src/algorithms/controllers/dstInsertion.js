// Digital search tree, initially a copy of simple iterative BST with a
// hack to produce just one chunk
// XXX Best to *share* code if possible to make sure animations look very
// similar and make it easier to maintain (like AVL tree and recursive
// BST)

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
// XXX best highlight whole path, add p label

/* eslint-disable no-plusplus */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import MaskTracer from '../../components/DataStructures/Mask/MaskTracer';
import {ALGO_COLOR_PALLETE} from '../../components/DataStructures/colors';
import { createTidyTreeLayout } from './helpers/tidyTreeLayout';
const color_c = ALGO_COLOR_PALLETE.sky;
const color_p = ALGO_COLOR_PALLETE.peach;
const color_new = ALGO_COLOR_PALLETE.leaf;
const color_p_c = ALGO_COLOR_PALLETE.peach; // p->c edge
const color_p_new = ALGO_COLOR_PALLETE.leaf; // p->new edge
const color_t = ALGO_COLOR_PALLETE.peach; // search pointer t
const color_path = ALGO_COLOR_PALLETE.peach; // search path
const color_found = ALGO_COLOR_PALLETE.leaf;
const color_not_found = ALGO_COLOR_PALLETE.apple;

// Clear the previous operation's colours and pointers.
const clearHighlights = (graph) => {
  graph.nodes.forEach(({ id }) => {
    graph.setNodeColor(id, undefined);
    graph.setNodePointerText(id, '');
  });
  graph.edges.forEach(({ source, target }) => {
    graph.setEdgeColor(source, target, undefined);
  });
  graph.clearSelect_Circle_Count();
};

const buildFinalTree = (nodes, initialMask) => {
  const finalTree = { [nodes[0]]: {} };

  for (let i = 1; i < nodes.length; i++) {
    const key = nodes[i];
    let current = nodes[0];
    let mask = initialMask;

    while (current !== undefined) {
      if (key === current) break;

      const direction = (key & mask) === 0 ? 'left' : 'right';
      const child = finalTree[current][direction];
      if (child === undefined) {
        finalTree[current][direction] = key;
        finalTree[key] = {};
        break;
      }

      current = child;
      mask >>= 1;
    }
  }

  return finalTree;
};

export default {
  initVisualisers() {
    return {
      mask: {
        instance: new MaskTracer('mask', null, 'Key + Mask', { overlay: true }),
        order: 0,
      },
      // array: {
        // instance: new Array1DTracer('array', null, 'Keys to insert', { arrayItemMagnitudes: true }),
        // order: 0,
      // },
      graph: {
        instance: new GraphTracer('bst', null, 'Digital Search Tree'),
        order: 1,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be inserted
   * @param {array} operations insert/search steps, e.g. from "5,7,?5"
   */
  run(chunker, { nodes = [], operations }) {
    const operationList = operations
      || nodes.map(value => ({ type: 'insert', value }));
    if (operationList.length === 0) return;
    const keys = operationList.map(({ value }) => value);
    const insertKeys = operationList
      .filter(({ type }) => type === 'insert')
      .map(({ value }) => value);
    let parent;
    let prev = null;
    let visitedList = [null];
    const tree = {};
    let root;
    const maximumKey = Math.max(...insertKeys, 1);
    const maxBits = Math.floor(Math.log2(Math.max(maximumKey, 1))) + 1;
    const initialMaskIndex = maxBits - 1;
    const initialMask = 2 ** initialMaskIndex;
    const finalTree = insertKeys.length > 0
      ? buildFinalTree(insertKeys, initialMask) : {};
    const positions = insertKeys.length > 0
      ? createTidyTreeLayout({
        root: insertKeys[0],
        getId: key => key,
        getLeft: key => finalTree[key].left,
        getRight: key => finalTree[key].right,
        rootY: -260,
      })
      : new Map();

    chunker.add(
      'init_b',
      (vis, bits, key, mask, maskIndex) => {
        vis.mask.setMaxBits(bits);
        vis.mask.setPointerStatus('');
        vis.mask.setBinary(key);
        vis.mask.setMask(mask, maskIndex);
      },
      [maxBits, keys[0], initialMask, initialMaskIndex],
    );

    chunker.add(1,
      (vis) => {
        vis.mask.setPointerStatus('Tree is empty');
        vis.graph.setZoom(0.65);
      },
      [],
    );

    const insertRoot = (r) => {
      root = r;
      tree[root] = {};
      chunker.add(1,
        (vis, k, mask, maskIndex) => {
          clearHighlights(vis.graph);
          vis.mask.setBinary(k);
          vis.mask.setPointerStatus(`Insert: ${k}`);
          vis.mask.setMask(mask, maskIndex);
        },
        [root, initialMask, initialMaskIndex],
      );
      chunker.add(7);
      chunker.add(8,
        (vis, k, position) => {
          vis.graph.setPauseLayout(true);
          vis.graph.addNode(k);
          vis.graph.setNodePosition(k, position.x, position.y);
          vis.mask.setPointerStatus(`Inserted: ${k}`);
        },
        [root, positions.get(root)],
      );
    };

    const insert = (element) => {
      if (root === undefined) {
        insertRoot(element);
        return;
      }
      prev = null;
      let mask = initialMask;
      chunker.add(
        1,
        (vis, k, mask, maskIndex) => {
          clearHighlights(vis.graph);
          vis.mask.setBinary(k);
          vis.mask.setPointerStatus(`Insert: ${k}`);
          vis.mask.setMask(mask, maskIndex);
        },
        [element, initialMask, initialMaskIndex],
      );
      visitedList = [null];
      chunker.add(7);
      let ptr = tree;
      let duplicate = false;
      parent = root;
      chunker.add(13,
        (vis, c) => {
          vis.graph.setNodeColor(c, color_p);
          vis.graph.setNodePointerText(c, 'c');
        },
        [root]
      );
      while (ptr) {
        visitedList.push(parent);
        chunker.add(14,
          (vis, c, p) => {
            vis.graph.setNodeColor(c, color_p);
            if (p !== null)
              vis.graph.setNodePointerText(p, '');
            vis.graph.setNodePointerText(c, 'p,c');
            // if (p !== null)
              // vis.graph.setNodeColor(p, undefined); // XXX
          },
          [parent, prev]
        );

        if (element === parent) {
          duplicate = true;
          chunker.add('eq_key',
            (vis, p) => {
              vis.graph.setNodePointerText(p, 'p');
            },
            [parent]
          );
          break;
        }

        chunker.add(15);
        if ((element & mask) === 0) {
          // chunker.add(16);
          // chunker.add(18);
          if (tree[parent].left !== undefined) {
            // if current node has left child
            prev = parent;
            parent = tree[parent].left;
            ptr = tree[parent];
            mask >>= 1;
            chunker.add(16,
              (vis, c, p) => {
                // vis.graph.setNodeColor(c, color_c);
                vis.graph.setNodePointerText(p, 'p');
                vis.graph.setNodePointerText(c, 'c');
                vis.graph.setEdgeColor(p, c, color_p_c);
              },
              [parent, prev]
            );
            chunker.add(
              'update_b',
              (vis, nextMask) => {
                vis.mask.setMask(nextMask, Math.log2(nextMask));
              },
              [mask],
            );
            chunker.add(18);
          } else {
            chunker.add(16,
              (vis, p) => {
                vis.graph.setNodePointerText(p, 'p');
                vis.mask.setPointerStatus('c = Empty');
              },
              [parent]
            );
            chunker.add(18, (vis, p) => {
              vis.mask.setPointerStatus('Insertion point found');
              vis.graph.setSelect_Circle_Count(p);
            }, [parent]);
            chunker.add(9);
            tree[parent].left = element;
            tree[element] = {};
            chunker.add(
              10,
              (vis, e, p, position) => {
                vis.mask.setPointerStatus(`Inserted: ${e}`);
                vis.graph.clearSelect_Circle_Count();
                vis.graph.addNode(e);
                vis.graph.setNodePosition(e, position.x, position.y);
                vis.graph.addEdge(p, e, { direction: 'left' });
                vis.graph.setNodePointerText(p, 'p');
                vis.graph.setNodeColor(e, color_new);
                vis.graph.setEdgeColor(p, e, color_p_new);
              },
              [element, parent, positions.get(element)],
            );
            visitedList.push(element);
            break;
          }
        } else {
          // chunker.add(17);
          // chunker.add(18);
          if (tree[parent].right !== undefined) {
            // if current node has right child
            prev = parent;
            parent = tree[parent].right;
            ptr = tree[parent];
            mask >>= 1;
            chunker.add(17,
              (vis, c, p) => {
                vis.graph.setNodePointerText(p, 'p');
                vis.graph.setNodePointerText(c, 'c');
                vis.graph.setEdgeColor(p, c, color_p_c);
              },
              [parent, prev]
            );
            chunker.add(
              'update_b',
              (vis, nextMask) => {
                vis.mask.setMask(nextMask, Math.log2(nextMask));
              },
              [mask],
            );
            chunker.add(18);
          } else {
            chunker.add(17,
              (vis, p) => {
                vis.graph.setNodePointerText(p, 'p');
                vis.mask.setPointerStatus('c = Empty');
              },
              [parent]
            );
            chunker.add(18, (vis, p) => {
              vis.mask.setPointerStatus('Insertion point found');
              vis.graph.setSelect_Circle_Count(p);
            }, [parent]);
            chunker.add(9);
            tree[parent].right = element;
            tree[element] = {};
            chunker.add(
              11,
              (vis, e, p, position) => {
                vis.mask.setPointerStatus(`Inserted: ${e}`);
                vis.graph.clearSelect_Circle_Count();
                vis.graph.addNode(e);
                vis.graph.setNodePosition(e, position.x, position.y);
                vis.graph.addEdge(p, e, { direction: 'right' });
                vis.graph.setNodePointerText(p, 'p');
                vis.graph.setNodeColor(e, color_new);
                vis.graph.setEdgeColor(p, e, color_p_new);
              },
              [element, parent, positions.get(element)],
            );
            visitedList.push(element);
            break;
          }
        }
      }
      // deselect everything
      chunker.add('end',
        (vis, el, visited, exists) => {
          vis.mask.setPointerStatus(exists ? `Already inserted: ${el}` : `Inserted: ${el}`);
          for (let j = 1; j < visited.length; j++) {
            vis.graph.setEdgeColor(visited[j-1], visited[j], undefined);
            vis.graph.setNodeColor(visited[j], undefined);
            vis.graph.setNodePointerText(visited[j], '');
          }
          vis.graph.clearSelect_Circle_Count();
        },
        [element, visitedList, duplicate],
      );
    };

    const search = (target) => {
      let t = root;
      let mask = initialMask;
      let maskIndex = initialMaskIndex;
      chunker.add('DST_Search(t, k)',
        (vis, k, start) => {
          clearHighlights(vis.graph);
          vis.mask.setBinary(k);
          vis.mask.setPointerStatus(`Search: ${k}`);
          if (start !== undefined) {
            vis.graph.setNodeColor(start, color_t);
            vis.graph.setNodePointerText(start, 't');
          }
        },
        [target, t],
      );
      chunker.add('set M', (vis, m, index) => {
        vis.mask.setMask(m, index);
      }, [mask, maskIndex]);
      /* eslint-disable no-constant-condition */
      while (true) {
        chunker.add('while t not Empty');
        if (t === undefined) {
          chunker.add('return NotFound', (vis, k) => {
            vis.mask.setPointerStatus(`Not found: ${k}`);
          }, [target]);
          return;
        }
        chunker.add('if t.key = k.key', (vis, current, found) => {
          vis.graph.setNodeColor(current, found ? color_found : color_not_found);
        }, [t, t === target]);
        if (t === target) {
          chunker.add('return t', (vis, k) => {
            vis.mask.setPointerStatus(`Found: ${k}`);
          }, [target]);
          return;
        }
        chunker.add('key not equal', (vis, current) => {
          vis.graph.setNodeColor(current, color_t);
        }, [t]);
        chunker.add('if mask bit of k.key=0');
        const goLeft = (target & mask) === 0;
        const oldT = t;
        t = goLeft ? tree[oldT].left : tree[oldT].right;
        const bookmark = goLeft ? 't <- t.left' : 't <- t.right';
        if (t !== undefined) {
          chunker.add(bookmark, (vis, next, prevNode) => {
            vis.graph.setNodeColor(prevNode, color_path);
            vis.graph.setNodePointerText(prevNode, '');
            vis.graph.setEdgeColor(prevNode, next, color_path);
            vis.graph.setNodeColor(next, color_t);
            vis.graph.setNodePointerText(next, 't');
          }, [t, oldT]);
        } else {
          chunker.add(bookmark, (vis) => {
            vis.mask.setPointerStatus('t = Empty');
          });
        }
        mask >>= 1;
        maskIndex--;
        chunker.add('m <- m >> 1', (vis, m, index) => {
          vis.mask.setMask(m, index);
        }, [mask, maskIndex]);
      }
    };

    operationList.forEach(({ type, value }) => {
      if (type === 'search') search(value);
      else insert(value);
    });
    // for test
    // eslint-disable-next-line consistent-return
    return tree;
  },
};
