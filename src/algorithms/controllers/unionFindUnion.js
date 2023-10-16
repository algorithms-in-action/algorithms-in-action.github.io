/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { UFExp } from '../explanations';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';
import unionFindFind from './unionFindFind';

export const ARRAY_COLOUR_CODES = {
  RED: '5',
  ORANGE: '4',
  GREEN: '1',
};

export const TREE_COLOUR_CODES = {
  RED: 3,
  ORANGE: 2,
  GREEN: 1,
};

export const N_IDX = 0;
export const PARENT_IDX = 1;
export const RANK_IDX = 2;

export const N_ARRAY = ['i', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const N_GRAPH = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

let isRankVisible = false;
export function unionFindChunkerRefresh(algorithm) {
  if (!algorithm || algorithm.name.id != 'unionFind') return;
  let vis = algorithm.chunker.visualisers;
  let isVisible =
    algorithm.collapse.unionFind.union.Maybe_swap ||
    algorithm.collapse.unionFind.union.Adjust_rank;
  vis.array.instance.hideArrayAtIndex(isVisible ? null : RANK_IDX);
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
   * Highlight the current node.
   * @param {*} visObj
   * @param {*} index1
   * @param {*} index2
   * @param {*} colour
   */
  highlight(visObj, index1, index2, colour) {
    if (visObj.key === 'array') {
      visObj.deselect(index1, index2);
      visObj.select(index1, index2, undefined, undefined, colour);
    }
    if (visObj.key === 'n-tree') {
      this.unhighlight(visObj, index1, index2);
      visObj.visit1(index1.toString(), index2.toString(), colour);
    }
  },

  /**
   * Unhighlight the current node.
   * @param {*} visObj
   * @param {*} index1
   * @param {*} index2
   * @param {*} deselectForRow
   */
  unhighlight(visObj, index1, index2, deselectForRow = false) {
    if (visObj.key === 'array') {
      if (deselectForRow === true) {
        visObj.deselect(index1, 0, undefined, N_ARRAY.length - 1);
        return;
      }
      visObj.deselect(index1, index2);
      return;
    }
    if (visObj.key === 'n-tree') {
      visObj.leave1(
        index1.toString(),
        index2.toString(),
        TREE_COLOUR_CODES.RED
      );
      visObj.leave1(
        index1.toString(),
        index2.toString(),
        TREE_COLOUR_CODES.ORANGE
      );
      visObj.leave1(
        index1.toString(),
        index2.toString(),
        TREE_COLOUR_CODES.GREEN
      );
    }
  },

  /**
   * Union two nodes together.
   * @param {Chunker} chunker The chunker object.
   * @param {Array} parentArr The parent array.
   * @param {Array} rankArr The rank array.
   * @param {Number} n The first node.
   * @param {Number} m The second node.
   * @param {Boolean} pathCompression Whether to use path compression.
   */
  union(chunker, parentArr, rankArr, n, m, pathCompression) {
    // initialising current union operation
    chunker.add(
      'Union(n, m)',
      (vis, n, m) => {
        vis.array.setMotion(false);
        vis.array.assignVariable('n', N_IDX, n);
        vis.array.assignVariable('m', N_IDX, m);
        vis.array.showKth(`Union(${n}, ${m})`);
      },
      [n, m]
    );

    // highlighting the current n to find in tree and array
    chunker.add(
      `n <- Find(n)`,
      (vis, n) => {
        vis.array.setMotion(true); // turning on smooth transition
        this.highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.ORANGE);
        this.highlight(vis.tree, n, n, TREE_COLOUR_CODES.ORANGE);
        vis.array.showKth(`Union(${n}, ${m}) - Find(${n})`);
      },
      [n, m]
    );

    let root1 = unionFindFind.find(
      chunker,
      parentArr,
      n,
      'n',
      null,
      pathCompression
    );

    // highlighting the current n to find in tree and array
    chunker.add(
      `m <- Find(m)`,
      (vis, n, m) => {
        this.highlight(vis.array, N_IDX, m, ARRAY_COLOUR_CODES.ORANGE);
        this.highlight(vis.tree, m, m, TREE_COLOUR_CODES.ORANGE);
        vis.array.showKth(`Union(${n}, ${m}) - Find(${m})`);
      },
      [n, m]
    );

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
        vis.array.showKth(`Union(${n}, ${m})`);

        this.highlight(vis.array, N_IDX, root1, ARRAY_COLOUR_CODES.ORANGE);
        this.highlight(vis.array, N_IDX, root2, ARRAY_COLOUR_CODES.ORANGE);
        this.highlight(vis.tree, root1, root1, TREE_COLOUR_CODES.ORANGE);
        this.highlight(vis.tree, root2, root2, TREE_COLOUR_CODES.ORANGE);
      },
      [n, m, root1, root2]
    );

    // if in same set, return
    if (root1 === root2) {
      chunker.add(
        'return',
        (vis, root1) => {
          this.highlight(vis.array, N_IDX, root1, ARRAY_COLOUR_CODES.GREEN);
          this.highlight(vis.tree, root1, root1, TREE_COLOUR_CODES.GREEN);
        },
        [root1]
      );
      return;
    }

    // 'if rank[n] > rank[m]'
    chunker.add(
      'if rank[n] > rank[m]',
      (vis, root1, root2) => {
        this.unhighlight(vis.array, N_IDX, root1);
        this.unhighlight(vis.array, N_IDX, root2);
        this.highlight(vis.array, RANK_IDX, root1, ARRAY_COLOUR_CODES.ORANGE);
        this.highlight(vis.array, RANK_IDX, root2, ARRAY_COLOUR_CODES.ORANGE);
      },
      [root1, root2]
    );

    if (rankArr[root1] > rankArr[root2]) {
      // swap n and m
      const tempRoot1 = root1;
      root1 = root2;
      root2 = tempRoot1;

      chunker.add(
        'swap(n, m)',
        (vis, root1, root2) => {
          vis.array.assignVariable('n', N_IDX, root1);
          vis.array.assignVariable('m', N_IDX, root2);
          this.highlight(vis.array, RANK_IDX, root1, ARRAY_COLOUR_CODES.GREEN);
          this.highlight(vis.array, RANK_IDX, root2, ARRAY_COLOUR_CODES.GREEN);
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
        this.highlight(vis.array, N_IDX, root2, ARRAY_COLOUR_CODES.ORANGE);
        this.highlight(vis.array, PARENT_IDX, root1, ARRAY_COLOUR_CODES.ORANGE);
      },
      [root1, root2]
    );

    parentArr[root1] = root2;

    chunker.add(
      'parent[n] = m',
      (vis, root1, root2) => {
        vis.array.updateValueAt(PARENT_IDX, root1, root2);

        this.highlight(vis.array, N_IDX, root2, ARRAY_COLOUR_CODES.GREEN);
        this.highlight(vis.array, PARENT_IDX, root1, ARRAY_COLOUR_CODES.GREEN);

        this.highlight(vis.tree, root1, root1, TREE_COLOUR_CODES.GREEN);
        this.highlight(vis.tree, root2, root2, TREE_COLOUR_CODES.GREEN);

        vis.tree.removeEdge('0', root1.toString());
        // remove self-loop
        vis.tree.removeEdge(root1.toString(), root1.toString());
        vis.tree.addEdge(root2.toString(), root1.toString());
        vis.tree.layout();
      },
      [root1, root2]
    );

    chunker.add(
      'if rank[n] == rank[m]',
      (vis, root1, root2) => {
        this.unhighlight(vis.array, PARENT_IDX, root1);
        this.unhighlight(vis.array, N_IDX, root2);
        this.highlight(vis.array, RANK_IDX, root1, ARRAY_COLOUR_CODES.ORANGE);
        this.highlight(vis.array, RANK_IDX, root2, ARRAY_COLOUR_CODES.ORANGE);
        this.unhighlight(vis.tree, root1, root1);
        this.unhighlight(vis.tree, root2, root2);
      },
      [root1, root2]
    );

    if (rankArr[root1] == rankArr[root2]) {
      rankArr[root2] += 1;
      rankArr[root1] = null;

      chunker.add(
        'rank[m] <- rank[m] + 1',
        (vis, root1, root2, updatedRank1, updatedRank2) => {
          vis.array.updateValueAt(RANK_IDX, root1, updatedRank1);
          vis.array.updateValueAt(RANK_IDX, root2, updatedRank2);
          this.unhighlight(vis.array, RANK_IDX, root1);
          this.highlight(vis.array, RANK_IDX, root2, ARRAY_COLOUR_CODES.GREEN);
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
