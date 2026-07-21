/**
 * This file contains the AVL Tree Search algorithm,
 * alongside the visualisation code.
 * NOTE: THIS CODE ALSO USED FOR BST SEARCH
 *
 * XXX needs a bunch more fixes. Best ignore height and balance, highlight
 * nodes at the right points (done), improve display of t if possible,...
 *
 * The AVL Tree Search algorithm is used to find a node.
 * 
 * The search algorithm is based on the tree created by the insertion algorithm. 
 * By accessing the visualized AVL tree, it retrieves the complete tree structure. 
 * The input is a node to be searched for, and the algorithm starts from the root, 
 * traversing down to the child nodes to find the target node.
 */

// old colour interface used visit, select and leave; similar interface
// reproduced here with new color interface
import {BSTColors as colors} from './BSTColors';
let visitn = (graph, c, p) => {
  if (p !== undefined) {
    graph.setNodeColor(p, colors.SPATH_N);
    graph.setEdgeColor(p, c, colors.SPATH_E);
  }
  graph.setNodeColor(c, colors.SPATH_N);
}

// remove any highlighting etc from tree
let uncolor = (graph, tree) => {
  Object.keys(tree).forEach(p => {
    let l = tree[p].left;
    let r = tree[p].right;
    let n = Number(p);
    graph.setNodeColor(n, undefined);
    if (l)
      graph.setEdgeColor(n, l, undefined);
    if (r)
      graph.setEdgeColor(n, r, undefined);
  })
}

export default {
    /**
         * For the search algorithm, we use the tree that is created in
         * the insertion algorithm to initialise the visualiser
         * @param {object} visualiser
         */
    initVisualisers({ visualiser }) {
        // clear existing trace, if any
        visualiser.graph.instance.clear();
        return {
            graph: {
                instance: visualiser.graph.instance,
                order: 0,
            },
        };
    },

    /**
     * We use the tree that is created in the insertion algorithm to search
     * @param {object} chunker
     * @param {object} visualiser
     * @param {number} target
     */
    run(chunker, { visualiser, target }) {
        // get whole tree
        const tree = visualiser.graph.instance.getTree();
        let root = visualiser.graph.instance.getRoot();

        let current = root;
        let parent = null;

        chunker.add('AVL_Search(t, k)', (vis, c, p, t) => {
            vis.graph.setZoom(0.55);
            // Remove all the recursion rectangles first
            vis.graph.popAllRectStack();
            // remove any highlighting etc
            vis.graph.setFunctionInsertText("(t, " + target + ")");
            vis.graph.setFunctionName("BST_Search");
            uncolor(vis.graph, t);
            visitn(vis.graph, c, p);
        }, [current, parent, tree]);
        if (!tree)
            chunker.add('while t not Empty');

        let ptr = tree;
        parent = current;

        /* eslint-disable no-constant-condition */
        while (true) {
            chunker.add('while t not Empty');

            if (current === undefined || !ptr) // should use null
                break;

            let node = current;
            if (node !== target) {
                chunker.add('if n.key = k', (vis, c, p) => {
                    vis.graph.setNodeColor(c, colors.NOT_EQ_N);
                }, [node, parent]);
            } else {
                chunker.add('if n.key = k', (vis, c, p) => {
                    vis.graph.setNodeColor(c, colors.FOUND_N);
                }, [node, parent]);
                chunker.add('return t', (vis, c, p) => {
                    // vis.graph.setNodeColor(c, colors.FOUND_N);
                    // vis.graph.setEdgeColor(p, c, colors.FOUND_E);
                    vis.graph.setText('Key found');
                }, [node, parent]);
                return 'success';
            }

            // chunker.add('if n.key > k');
            chunker.add('if n.key > k', (vis, c, p) => {
                vis.graph.setNodeColor(c, colors.PATH_N);
            }, [node, parent]);
            if (target < node) {
                parent = node;
                current = tree[node].left;
                ptr = tree[node];
                if (current !== undefined) {

                    chunker.add('t <- n.left', (vis, c, p) => visitn(vis.graph, c, p), [current, parent]);
                } else {
                    chunker.add('t <- n.left', (vis) => vis.graph.setText('t = Empty'));
                }
            } else {
                parent = node;
                current = tree[node].right;
                ptr = tree[node];
                // if current node has right child
                if (current !== undefined) {
                    chunker.add('t <- n.right', (vis, c, p) => visitn(vis.graph, c, p), [current, parent]);
                } else {
                    chunker.add('t <- n.right', (vis) => vis.graph.setText('t = Empty'));
                }
            }
        }

        chunker.add('return NotFound', (vis) => vis.graph.setText('Key not found'));
        return 'fail';
    },
};

