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
    const tree = visualiser.graph.instance.getTree();
    const root = visualiser.graph.instance.getRoot();
    const item = target;

    let current = root;
    let parent = null;

    chunker.add(8);
    chunker.add(1, (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
    let ptr = tree;
    parent = current;

    while (ptr) {
      chunker.add(2);
      if (current === item) {
        chunker.add(2, (vis, c, p) => vis.graph.leave(c, p), [current, parent]);
        chunker.add(3, (vis, c, p) => vis.graph.select(c, p), [current, parent]);
        // for test
        return 'success';
      }

      chunker.add(4);
      if (item < current) {
        if (tree[current].left !== undefined) {
          // if current node has left child
          parent = current;
          current = tree[current].left;
          ptr = tree[current];
          chunker.add(5, (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
        } else {
          break;
        }
      } else if (tree[current].right !== undefined) {
        // if current node has right child
        parent = current;
        current = tree[current].right;
        ptr = tree[current];
        chunker.add(6, (vis, c, p) => vis.graph.visit(c, p), [current, parent]);
      } else {
        break;
      }
    }
    chunker.add(7);
    // for test
    chunker.add(7, (vis) => vis.graph.setText('RESULT NOT FOUND'));
    return 'fail';
  },
};
