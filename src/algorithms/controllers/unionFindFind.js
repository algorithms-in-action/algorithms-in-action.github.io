import {
  N_ARRAY,
  COLOUR_CODES,
  N_IDX,
  PARENT_IDX,
  default as unionFind,
} from './unionFindUnion.js';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import NTreeTracer from '../../components/DataStructures/Graph/NAryTreeTracer/NTreeTracer';

export default {
  initVisualisers({ visualiser }) {
    // need to clear here, otherwise we get a stepping back bug re highlighting - uncertain why.
    visualiser.tree.instance.unfillAll();

    // would ideally use the array and tree from union, but results in highlighting and child not returning to place when stepping back - uncertain why. 
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Array View'),
        order: 0,
      },
      tree: {
        instance: new NTreeTracer('n-tree', null, 'Tree View'),
        order: 1,
      },
    };
  },

  run(chunker, { visualiser, target, mode }) {
    // extracting array data from visualiser
    const value = target.arg1;
    const pathCompression = target.arg2;

    // extracting parent array from visualiser
    let parentArray = this.extractParentArray(visualiser);

    // extracting tree data from visualiser
    let { 'realNodes': realNodes, 'realEdges': realEdges, 'nodes': nodes, 'edges': edges } = visualiser.tree.instance.extractNTree();

    // restoring the visualisers
    chunker.add(
      `while n != parent[n]`,
      (vis, parentArray) => {
        vis.array.set([N_ARRAY, parentArray], 'unionFind');
        vis.tree.setNTree(realNodes, realEdges, nodes, edges);
        vis.tree.isReversed = true;
      }, [parentArray]); // passing nodes etc introduces highlighting

    this.find(chunker, parentArray, value, 'n', null, pathCompression, mode);

  },

  // getting the parent array from the visualiser
  extractParentArray(visualiser) {
    let parentElems = visualiser.array.instance.data[1];
    let parentArray = parentElems.map((element) => parseInt(element.value, 10));
    parentArray[0] = 'Parent[i]';

    return parentArray;
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
          COLOUR_CODES.ORANGE
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
  find(chunker, parentArr, n, name, m, pathCompression, mode) {

    // highlighting the current n to find in tree and array
    chunker.add(
      `while n != parent[n]`,
      (vis, n) => {
        vis.array.setMotion(true); // turning on smooth transition
        unionFind.highlight(vis.array, N_IDX, n, COLOUR_CODES.ORANGE);
        unionFind.highlight(vis.tree, n, n, COLOUR_CODES.ORANGE);
      },
      [n]
    );

    while (this.notAtRoot(chunker, parentArr, n)) {
      // highlighting for 'fail state'
      chunker.add(
        `while n != parent[n]`,
        (vis, n) => {
          unionFind.highlight(vis.array, N_IDX, n, COLOUR_CODES.RED);
          unionFind.highlight(vis.array, PARENT_IDX, n, COLOUR_CODES.RED);
          unionFind.highlight(vis.tree, n, n, COLOUR_CODES.RED);
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
            unionFind.highlight(vis.array, N_IDX, m, COLOUR_CODES.GREEN);
          unionFind.highlight(vis.array, N_IDX, n, COLOUR_CODES.ORANGE);
          unionFind.highlight(
            vis.array,
            PARENT_IDX,
            nPrev,
            COLOUR_CODES.ORANGE
          );
          unionFind.highlight(vis.tree, n, n, COLOUR_CODES.ORANGE);
          unionFind.unhighlight(vis.tree, nPrev, nPrev);
        },
        [n, m, nTempPrev]
      );
    }

    // highlighting for 'success state'
    chunker.add(
      `while n != parent[n]`,
      (vis, n) => {
        unionFind.highlight(vis.array, N_IDX, n, COLOUR_CODES.GREEN);
        unionFind.highlight(vis.array, PARENT_IDX, n, COLOUR_CODES.GREEN);
        unionFind.highlight(vis.tree, n, n, COLOUR_CODES.GREEN);
      },
      [n]
    );

    // returning found 'n'
    chunker.add(
      mode === 'find' ? 'return n' : `${name} <- Find(${name})`,
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
          COLOUR_CODES.ORANGE
        );
        unionFind.highlight(
          vis.array,
          N_IDX,
          parent,
          COLOUR_CODES.ORANGE
        );
        unionFind.highlight(vis.tree, n, n, COLOUR_CODES.ORANGE);
        unionFind.highlight(vis.tree, parent, parent, COLOUR_CODES.ORANGE);
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
          COLOUR_CODES.ORANGE
        );
        unionFind.highlight(
          vis.tree,
          grandparent,
          grandparent,
          COLOUR_CODES.ORANGE
        );
        vis.tree.layout(); // to resolve stepping back bug in find
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

          vis.tree.removeEdge(formerParent, n);
          vis.tree.addEdge(grandparent, n);
          vis.tree.layout();
        },
        [n, parentArr[parentArr[n]]]
      );

      chunker.add(
        `parent[n] <- parent[parent[n]]`,
        (vis, n, formerParent, newParent) => {
          unionFind.unhighlight(vis.array, PARENT_IDX, formerParent);
          unionFind.unhighlight(vis.tree, newParent, newParent);

          unionFind.highlight(vis.array, N_IDX, n, COLOUR_CODES.RED);
          unionFind.highlight(vis.array, PARENT_IDX, n, COLOUR_CODES.RED);
          unionFind.highlight(vis.tree, n, n, COLOUR_CODES.RED);
        },
        [n, formerParent, parentArr[n]]
      );
    }
    return parentArr[n];
  },
};
