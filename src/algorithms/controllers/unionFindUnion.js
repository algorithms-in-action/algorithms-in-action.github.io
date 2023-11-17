/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { UFExp } from '../explanations';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import NTreeTracer from '../../components/DataStructures/Graph/NAryTreeTracer/NTreeTracer';
import unionFindFind from './unionFindFind';

export const COLOUR_CODES = {
  RED: 3,
  ORANGE: 2,
  GREEN: 1,
};

export const N_IDX = 0;
export const PARENT_IDX = 1;
export const RANK_IDX = 2;

export const N_ARRAY = ['i', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const N_GRAPH = ['0', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let isRankVisible = false;

/**
 * Updates the rank array visibility when user expands code panel.
 * @param {*} algorithm the state of the algorithm.
 */
export function unionFindToggleRank(algorithm) {
  if (!algorithm || algorithm.id.name != 'unionFind') return;
  let vis = algorithm.chunker.visualisers;
  let isVisible =
    algorithm.collapse.unionFind.union.Maybe_swap ||
    algorithm.collapse.unionFind.union.Adjust_rank; // determines whether rank shown in code panel
  vis.array.instance.hideArrayAtIndex(isVisible ? null : RANK_IDX); // hiding the rank array
  isRankVisible = isVisible;
}

export default {
  explanation: UFExp,
  initVisualisers() {
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

  run(chunker, params) {
    const { arg1: unionOperations, arg2: pathCompression } = params.target;

    // setting up the arrays
    let parentArr = ['Parent[i]', ...N_ARRAY.slice(1)];
    let rankArr = ['Rank[i]', ...Array(10).fill(0)];

    // initialising the visualisers
    chunker.add(
      'Union(n, m)',
      (vis, array) => {
        // setting up array
        vis.array.set(array, 'unionFind', '');
        vis.array.hideArrayAtIndex(isRankVisible ? null : RANK_IDX);

        // adding nodes to tree
        vis.tree.addNode(N_GRAPH[0], undefined, 'circle');
        for (const node of N_GRAPH.slice(1)) {
          vis.tree.addNode(node, undefined, 'circle');
          // setting up connections to invisible root node
          vis.tree.addEdge(N_GRAPH[0], node);
        }

        vis.tree.isReversed = true;
        vis.tree.layout();

        // adding self-loop.
        for (const node of N_GRAPH.slice(1)) {
          vis.tree.addSelfLoop(node);
        }
      },
      [[N_ARRAY, parentArr, rankArr]]
    );

    // applying union operations
    for (let i = 0; i < unionOperations.length; i++) {
      this.union(
        chunker,
        parentArr,
        rankArr,
        unionOperations[i][0],
        unionOperations[i][1],
        pathCompression
      );
    }
    return parentArr.slice(1);
  },

  /**
   * Highlights the object given colour.
   * @param {*} visObj the visualiser object (e.g., vis.array).
   * @param {*} index1 either the index row of the array or the node of the tree.
   * @param {*} index2 the index column if an array.
   * @param {*} colour the colour to highlight.
   */
  highlight(visObj, index1, index2, colour) {
    if (visObj.key === 'array') {
      visObj.unfill(index1, index2);
      visObj.fill(index1, index2, undefined, undefined, colour);
    }
    if (visObj.key === 'n-tree') {
      this.unhighlight(visObj, index1, index2);
      visObj.fill(index1, colour);
    }
  },

  /**
   * Unhighlights the given object.
   * @param {*} visObj the visualiser object.
   * @param {*} index1 either the index row of the array or the node of the tree.
   * @param {*} index2 the index column if an array.
   * @param {*} deselectForRow if array, whether to deselect the entire row.
   */
  unhighlight(visObj, index1, index2, deselectForRow = false) {
    if (visObj.key === 'array') {
      if (deselectForRow === true) {
        visObj.unfill(index1, 0, undefined, N_ARRAY.length - 1);
        return;
      }
      visObj.unfill(index1, index2);
      return;
    }
    if (visObj.key === 'n-tree') {
      visObj.unfill(index1);
    }
  },

  /**
   * Union two nodes together.
   * @param {Chunker} chunker
   * @param {Array} parentArr the parent array.
   * @param {Array} rankArr the rank array.
   * @param {Number} n the first node to union.
   * @param {Number} m the second node to union.
   * @param {Boolean} pathCompression whether to use path compression.
   */
  union(chunker, parentArr, rankArr, n, m, pathCompression) {
    // initialising current union operation
    chunker.add(
      'Union(n, m)',
      (vis, n, m) => {
        vis.array.setMotion(false);
        vis.array.assignVariable('n', N_IDX, n);
        vis.array.assignVariable('m', N_IDX, m);
        vis.array.showKth(`${n}, ${m}`);
      },
      [n, m]
    );

    // finding representative of first node
    let root1 = unionFindFind.find(
      chunker,
      parentArr,
      n,
      'n',
      null,
      pathCompression
    );

    // finding representative of second node
    let root2 = unionFindFind.find(
      chunker,
      parentArr,
      m,
      'm',
      root1,
      pathCompression
    );

    chunker.add(
      'if n == m',
      (vis, n, m, root1, root2) => {
        vis.array.showKth(`${n}, ${m}`);

        this.highlight(vis.array, N_IDX, root1, COLOUR_CODES.ORANGE);
        this.highlight(vis.array, N_IDX, root2, COLOUR_CODES.ORANGE);
        this.highlight(vis.tree, root1, root1, COLOUR_CODES.ORANGE);
        this.highlight(vis.tree, root2, root2, COLOUR_CODES.ORANGE);
      },
      [n, m, root1, root2]
    );

    // if in same set, return
    if (root1 === root2) {
      chunker.add(
        'return',
        (vis, root1) => {
          this.highlight(vis.array, N_IDX, root1, COLOUR_CODES.GREEN);
          this.highlight(vis.tree, root1, root1, COLOUR_CODES.GREEN);
        },
        [root1]
      );
      return;
    }

    chunker.add(
      'if rank[n] > rank[m]',
      (vis, root1, root2) => {
        this.unhighlight(vis.array, N_IDX, root1);
        this.unhighlight(vis.array, N_IDX, root2);
        this.highlight(vis.array, RANK_IDX, root1, COLOUR_CODES.ORANGE);
        this.highlight(vis.array, RANK_IDX, root2, COLOUR_CODES.ORANGE);
      },
      [root1, root2]
    );

    if (rankArr[root1] > rankArr[root2]) {
      // swap n and m so smaller subtree is joined to larger
      const tempRoot1 = root1;
      root1 = root2;
      root2 = tempRoot1;

      chunker.add(
        'swap(n, m)',
        (vis, root1, root2) => {
          vis.array.assignVariable('n', N_IDX, root1);
          vis.array.assignVariable('m', N_IDX, root2);
          this.highlight(vis.array, RANK_IDX, root1, COLOUR_CODES.GREEN);
          this.highlight(vis.array, RANK_IDX, root2, COLOUR_CODES.GREEN);
        },
        [root1, root2]
      );
    }

    chunker.add(
      'parent[n] = m',
      (vis, root1, root2) => {
        this.unhighlight(vis.array, N_IDX, root1);
        this.unhighlight(vis.array, RANK_IDX, root1);
        this.unhighlight(vis.array, RANK_IDX, root2);
        this.highlight(vis.array, N_IDX, root2, COLOUR_CODES.ORANGE);
        this.highlight(vis.array, PARENT_IDX, root1, COLOUR_CODES.ORANGE);
      },
      [root1, root2]
    );

    // joining the two nodes
    parentArr[root1] = root2;

    chunker.add(
      'parent[n] = m',
      (vis, root1, root2) => {
        vis.array.updateValueAt(PARENT_IDX, root1, root2);

        this.highlight(vis.array, N_IDX, root2, COLOUR_CODES.GREEN);
        this.highlight(vis.array, PARENT_IDX, root1, COLOUR_CODES.GREEN);

        this.highlight(vis.tree, root1, root1, COLOUR_CODES.GREEN);
        this.highlight(vis.tree, root2, root2, COLOUR_CODES.GREEN);

        vis.tree.removeEdge('0', root1);
        // remove self-loop
        vis.tree.removeEdge(root1, root1);
        vis.tree.addEdge(root2, root1);
        vis.tree.layout();
      },
      [root1, root2]
    );

    chunker.add(
      'if rank[n] == rank[m]',
      (vis, root1, root2) => {
        this.unhighlight(vis.array, PARENT_IDX, root1);
        this.unhighlight(vis.array, N_IDX, root2);
        this.highlight(vis.array, RANK_IDX, root1, COLOUR_CODES.ORANGE);
        this.highlight(vis.array, RANK_IDX, root2, COLOUR_CODES.ORANGE);
        this.unhighlight(vis.tree, root1, root1);
        this.unhighlight(vis.tree, root2, root2);
      },
      [root1, root2]
    );

    // updating rank
    if (rankArr[root1] == rankArr[root2]) {
      rankArr[root2] += 1;
      rankArr[root1] = null;

      chunker.add(
        'rank[m] <- rank[m] + 1',
        (vis, root1, root2, updatedRank1, updatedRank2) => {
          vis.array.updateValueAt(RANK_IDX, root1, updatedRank1);
          vis.array.updateValueAt(RANK_IDX, root2, updatedRank2);
          this.unhighlight(vis.array, RANK_IDX, root1);
          this.highlight(vis.array, RANK_IDX, root2, COLOUR_CODES.GREEN);
        },
        [root1, root2, rankArr[root1], rankArr[root2]]
      );

      chunker.add(
        'rank[m] <- rank[m] + 1',
        (vis, root2) => {
          this.unhighlight(vis.array, RANK_IDX, root2);
        },
        [root2]
      );
    } else {
      rankArr[root1] = null;

      chunker.add(
        'if rank[n] == rank[m]',
        (vis, root1, root2, updatedRank1) => {
          vis.array.updateValueAt(RANK_IDX, root1, updatedRank1);
          this.unhighlight(vis.array, RANK_IDX, root1);
          this.unhighlight(vis.array, RANK_IDX, root2);
        },
        [root1, root2, rankArr[root1]]
      );
    }
  },
};
