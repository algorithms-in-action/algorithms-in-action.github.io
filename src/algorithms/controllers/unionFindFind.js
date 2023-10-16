import {
  N_ARRAY,
  ARRAY_COLOUR_CODES,
  TREE_COLOUR_CODES,
  N_IDX,
  PARENT_IDX,
  default as unionFind,
} from './unionFindUnion.js';

export default {
  initVisualisers({ visualiser }) {
    // clearing tree from union
    for (let i = 1; i < N_ARRAY.length; i++) {
      let n = N_ARRAY[i];
      unionFind.unhighlight(visualiser.tree.instance, n, n);
    }
    return {
      array: {
        instance: visualiser.array.instance,
        order: 0,
      },
      tree: {
        instance: visualiser.tree.instance,
        order: 1,
      },
    };
  },

  run(chunker, { visualiser, target }) {
    let parentElems = visualiser.array.instance.data[1];
    let parentArray = parentElems.map((element) => parseInt(element.value, 10));
    parentArray[0] = 'Parent[i]';

    visualiser.array.instance.set([N_ARRAY, parentArray], 'unionFind');

    const value = target.arg1;
    const pathCompression = target.arg2;

    // highlighting the current n to find in tree and array
    chunker.add(
      `Find(n)`,
      (vis, n) => {
        vis.array.setMotion(true); // turning on smooth transition
        unionFind.highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.ORANGE);
        unionFind.highlight(vis.tree, n, n, TREE_COLOUR_CODES.ORANGE);
        vis.array.showKth(`Find(${n})`);
      },
      [value]
    );

    this.find(chunker, parentArray, value, 'n', null, pathCompression);
  },

  /**
   * Simply checks if the current node is at the root.
   * @param {Array} parentArr The parent array.
   * @param n The element to check.
   * @returns {boolean} True if not at root, false otherwise.
   */
  notAtRoot(chunker, parentArr, n) {
    // highlighting parent[n] for 'transition' state
    chunker.add(
      `while n != parent[n]`,
      (vis, n) => {
        unionFind.unhighlight(vis.array, PARENT_IDX, n, true);
        unionFind.highlight(
          vis.array,
          PARENT_IDX,
          n,
          ARRAY_COLOUR_CODES.ORANGE
        );
      },
      [n]
    );
    return parentArr[n] != n;
  },

  /**
   * Finds the root of the current node.
   * @param {Array} parentArr The parent array.
   * @param n The element to find.
   * @param {string} name The name of the element to find.
   * @param {boolean} pathCompression Whether to use path compression.
   * @returns {number} The root of the current node.
   */
  find(chunker, parentArr, n, name, m, pathCompression) {
    while (this.notAtRoot(chunker, parentArr, n)) {
      // highlighting for 'fail state'
      chunker.add(
        `while n != parent[n]`,
        (vis, n) => {
          unionFind.highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.RED);
          unionFind.highlight(vis.array, PARENT_IDX, n, ARRAY_COLOUR_CODES.RED);
          unionFind.highlight(vis.tree, n, n, TREE_COLOUR_CODES.RED);
        },
        [n]
      );

      if (pathCompression) {
        this.shortenPath(chunker, parentArr, n);
      }

      // updating the value of n
      let nTempPrev = n;
      n = parentArr[n];

      chunker.add(
        `n <- parent[n]`,
        (vis, n, m, nPrev) => {
          vis.array.assignVariable(`${name}`, N_IDX, n); // update 'n'
          if (n !== m && m !== null)
            unionFind.highlight(vis.array, N_IDX, m, ARRAY_COLOUR_CODES.GREEN);
          unionFind.highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.ORANGE);
          unionFind.highlight(
            vis.array,
            PARENT_IDX,
            nPrev,
            ARRAY_COLOUR_CODES.ORANGE
          );
          unionFind.highlight(vis.tree, n, n, TREE_COLOUR_CODES.ORANGE);
          unionFind.unhighlight(vis.tree, nPrev, nPrev);
        },
        [n, m, nTempPrev]
      );
    }

    // highlighting for 'success state'
    chunker.add(
      `while n != parent[n]`,
      (vis, n) => {
        unionFind.highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.GREEN);
        unionFind.highlight(vis.array, PARENT_IDX, n, ARRAY_COLOUR_CODES.GREEN);
        unionFind.highlight(vis.tree, n, n, TREE_COLOUR_CODES.GREEN);
      },
      [n]
    );

    // returning found 'n'
    chunker.add(
      `return n`,
      (vis, n) => {
        unionFind.unhighlight(vis.array, PARENT_IDX, n);
      },
      [n]
    );

    return n;
  },

  /**
   * Shortens the path from the current node to the root.
   * @param {Array} parentArr The parent array.
   * @param n The element to shorten the path for.
   */
  shortenPath(chunker, parentArr, n) {
    chunker.add(
      `parent[n] <- parent[parent[n]]`,
      (vis, n, parent, grandparent) => {
        unionFind.unhighlight(vis.array, N_IDX, n);
        unionFind.unhighlight(vis.tree, n, n);
        unionFind.highlight(
          vis.array,
          PARENT_IDX,
          n,
          ARRAY_COLOUR_CODES.ORANGE
        );
        unionFind.highlight(
          vis.array,
          N_IDX,
          parent,
          ARRAY_COLOUR_CODES.ORANGE
        );
        unionFind.highlight(vis.tree, n, n, TREE_COLOUR_CODES.ORANGE);
        unionFind.highlight(vis.tree, parent, parent, TREE_COLOUR_CODES.ORANGE);
      },
      [n, parentArr[n], parentArr[parentArr[n]]]
    );

    chunker.add(
      `parent[n] <- parent[parent[n]]`,
      (vis, n, parent, grandparent) => {
        unionFind.unhighlight(vis.array, N_IDX, parent);
        unionFind.unhighlight(vis.tree, parent, parent);
        unionFind.highlight(
          vis.array,
          PARENT_IDX,
          parent,
          ARRAY_COLOUR_CODES.ORANGE
        );
        unionFind.highlight(
          vis.tree,
          grandparent,
          grandparent,
          TREE_COLOUR_CODES.ORANGE
        );
      },
      [n, parentArr[n], parentArr[parentArr[n]]]
    );

    // if grandparent is not the parent
    if (parentArr[n] !== n && parentArr[parentArr[n]] !== parentArr[n]) {
      let formerParent = parentArr[n];
      parentArr[n] = parentArr[parentArr[n]];

      chunker.add(
        `parent[n] <- parent[parent[n]]`,
        (vis, n, grandparent) => {
          vis.array.updateValueAt(PARENT_IDX, n, grandparent);

          vis.tree.removeEdge(formerParent.toString(), n.toString());
          vis.tree.addEdge(grandparent.toString(), n.toString());
          vis.tree.layout();
        },
        [n, parentArr[parentArr[n]]]
      );

      chunker.add(
        `parent[n] <- parent[parent[n]]`,
        (vis, n, formerParent, newParent) => {
          unionFind.unhighlight(vis.array, PARENT_IDX, formerParent);
          unionFind.unhighlight(vis.tree, newParent, newParent);

          unionFind.highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.RED);
          unionFind.highlight(vis.array, PARENT_IDX, n, ARRAY_COLOUR_CODES.RED);
          unionFind.highlight(vis.tree, n, n, TREE_COLOUR_CODES.RED);
        },
        [n, formerParent, parentArr[n]]
      );
    }
    return parentArr[n];
  },
};
