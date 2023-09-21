/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { UFExp } from '../explanations';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';
import TreeNode from '../../components/DataStructures/Graph/NAryTree'; 
// Defining constants for readability.
const ORANGE = '4';
const GREEN = '1';
const RED = '5';

const N_ARRAY_IDX = 0;
const PARENT_ARRAY_IDX = 1;
const RANK_ARRAY_IDX = 2;

const N_ARRAY = ["i", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const N_GRAPH = ['0','1','2','3','4','5','6','7','8','9','10'];
export default {
  explanation: UFExp,

  initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Array View'),
        order: 0,
      },
      tree: {
        instance: new NTreeTracer('n-tree', null, 'Graph View'),
        order: 1,
      },
    };
  },

  /**
   * Populate the chunker with 'while n != parent[n]' or 'while m != parent[m]'.
   * Return true if the number is not at the root, false otherwise.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Array} parentArr The parent array.
   * @param {Number} n The number to find.
   * @param {String} name The variable name of the number to find.
   * @returns {Boolean} Whether the number is not at the root.
   */
  notAtRoot(chunker, parentArr, n, name, nTempPrev) {
    
    // To visually separate into two distinct steps:
    chunker.add(`while ${name} != parent[${name}]`, (vis) => {

      vis.array.assignVariable(`${name}`, N_ARRAY_IDX, n);
      vis.array.select(N_ARRAY_IDX, n, undefined, undefined, ORANGE);

      if (nTempPrev != n) {
        // Maintain orange highlight (assignVariable effectively deselects).
        vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, ORANGE);
      }
    });

    chunker.add(`while ${name} != parent[${name}]`, (vis) => {

      vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, ORANGE);
      
      vis.array.deselect(PARENT_ARRAY_IDX, 0, undefined, n-1)
      vis.array.deselect(PARENT_ARRAY_IDX, n+1, undefined, 10)
      
    });

    if (parentArr[n] != n) {
      return true;
    }
    return false;
  },

  /**
   * Populate the chunker with the steps required to do a find operation.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Array} parentArr The parent array.
   * @param {Number} n The number to find.
   * @param {String} name The variable name of the number to find.
   * @param {Boolean} pathCompression Whether to use path compression.
   */
  find(chunker, parentArr, n, name, pathCompression, nodesArray) {
    
    
    
   
    // 'while n != parent[n]' or 'while m != parent[m]'
    let nTempPrev = n;
    console.log("og ", n);
    while (this.notAtRoot(chunker, parentArr, n, name, nTempPrev)) {
      
      nTempPrev = n;
      
      chunker.add(`while ${name} != parent[${name}]`, (vis,n) => {

        vis.array.deselect(N_ARRAY_IDX, nTempPrev);
        vis.array.deselect(PARENT_ARRAY_IDX, nTempPrev);

        vis.array.select(N_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
        vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
        
        vis.tree.select(n.toString(),n.toString());
      },[nTempPrev]);

      // TODO: `${name} <- parent[${name}]` (path compression)
      if (pathCompression === true) {
        // console.log('path compression on');
      }

      // 'n <- parent[n]' or 'm <- parent[m]'
      n = parentArr[n];
      const nTemp = n;
      console.log("goo",n, nTempPrev);
      chunker.add(`${name} <- parent[${name}]`, (vis,nPrev) => {

        vis.array.deselect(N_ARRAY_IDX, nTempPrev);
        vis.array.deselect(PARENT_ARRAY_IDX, nTempPrev);

        vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, ORANGE);
        vis.tree.deselect(nPrev.toString(),nPrev.toString());
      }, [nTempPrev]);
    }

    // 'return n' or 'return m'
    chunker.add(`while ${name} != parent[${name}]`, (vis) => {

      vis.array.deselect(N_ARRAY_IDX, n);
      vis.array.deselect(PARENT_ARRAY_IDX, n);
      
      vis.array.select(N_ARRAY_IDX, n, undefined, undefined, GREEN);
      vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, GREEN);
      vis.tree.select(n.toString(), n.toString());

    }, [n]);

    chunker.add(`return ${name}`, (vis) => {

      vis.array.deselect(PARENT_ARRAY_IDX, n);
      
    });

    return n;
  },

  /**
   * Populate the chunker with the steps required to do a union operation.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Array} parentArr The parent array.
   * @param {Number} n The first number to union.
   * @param {Number} m The second number to union.
   * @param {Boolean} pathCompression Whether to use path compression.
   */
  union(chunker, parentArr, rankArr, n, m, pathCompression, nodesArray) {
    // For rendering the current union caption. 
    chunker.add('union(n, m)', (vis, array) => {

      vis.array.set(array, 'unionFind', ' ');

      vis.array.showKth(`Union(${n}, ${m})`);

    }, [[N_ARRAY, parentArr, rankArr]]);

    // 'n <- find(n)' and 'm <- find(m)'
    let root1 = this.find(chunker, parentArr, n, 'n', pathCompression);
    let root2 = this.find(chunker, parentArr, m, 'm', pathCompression);
    let root1node = null;
    let root2node = null;
    for (let i = 0; i < nodesArray.length; i++) {
      if (nodesArray[i].id == root1) {
        root1node = nodesArray[i];
      }
      if (nodesArray[i].id == root2) {
        root2node = nodesArray[i];
      }
    }
    // 'if n == m'
    chunker.add('if n == m', (vis) => {

      vis.array.select(N_ARRAY_IDX, root1, undefined, undefined, GREEN);
      vis.array.select(N_ARRAY_IDX, root2, undefined, undefined, GREEN);

    });

    if (root1 === root2) {

      chunker.add('return', () => {
      });

      return;
    }

    // 'if rank[n] > rank[m]'
    chunker.add('if rank[n] > rank[m]', (vis) => {
      vis.array.deselect(N_ARRAY_IDX, root1);
      vis.array.deselect(N_ARRAY_IDX, root2);
      vis.array.select(RANK_ARRAY_IDX, root1, undefined, undefined, ORANGE);
      vis.array.select(RANK_ARRAY_IDX, root2, undefined, undefined, ORANGE);
    });

    if (rankArr[root1] > rankArr[root2]) {
      // 'swap(n, m)'
      const tempRoot1 = root1;
      root1 = root2;
      root2 = tempRoot1;
      chunker.add('swap(n, m)', (vis,n,m) => {
        vis.array.assignVariable('n', N_ARRAY_IDX, root1);
        vis.array.assignVariable('m', N_ARRAY_IDX, root2);
        vis.array.select(RANK_ARRAY_IDX, root1, undefined, undefined, ORANGE);
        vis.array.select(RANK_ARRAY_IDX, root2, undefined, undefined, ORANGE);
        vis.tree.swapNodes(n,m);
        vis.tree.layout();
      }, [root1node.id, root2node.id]);
      
      let tmpParent = null;
      let tmpChildren = null;
      tmpParent = root1node.parent;
      tmpChildren = root1node.children;
      root1node.parent = root2node.parent;
      root1node.children = root2node.children;
      root2node.parent = tmpParent;
      root2node.children = tmpChildren;
      // now we have swapped the node
    }

    // 'parent[n] = m'
    chunker.add('parent[n] = m', (vis) => { 
      vis.array.deselect(RANK_ARRAY_IDX, root1);
      vis.array.deselect(RANK_ARRAY_IDX, root2);
      vis.array.select(N_ARRAY_IDX, root2, undefined, undefined, GREEN);
      vis.array.select(PARENT_ARRAY_IDX, root1, undefined, undefined, GREEN);
    }, [[N_ARRAY, parentArr, rankArr]]);
    root1node.parent = root2node;
    root2node.addChild(root1node);
    chunker.add('parent[n] = m', (vis, array) => {

      vis.array.deselect(N_ARRAY_IDX, root1);

    }, [[N_ARRAY, parentArr, rankArr]]);


    parentArr[root1] = root2;

    chunker.add('parent[n] = m', (vis, array,n,m) => {
      vis.array.set(array, 'unionFind', ' ');
      vis.array.assignVariable('n', N_ARRAY_IDX, root1);
      vis.array.assignVariable('m', N_ARRAY_IDX, root2);
      vis.array.select(N_ARRAY_IDX, root2, undefined, undefined, GREEN);
      vis.array.select(PARENT_ARRAY_IDX, root1, undefined, undefined, GREEN);
      
      // Re-rendering union caption after array reset.
      vis.array.showKth(`Union(${n}, ${m})`);
      // doing graph operations now
      const root = '0';
      vis.tree.removeEdge(root, n.toString());
      // now add a new edge connecting n to m
      vis.tree.addEdge(m.toString(), n.toString());
      // now relayout
      vis.tree.layout();
      vis.tree.deselect(n.toString(), n.toString());
      vis.tree.deselect(m.toString(), m.toString());

    }, [[N_ARRAY, parentArr, rankArr],root1node.id, root2node.id]);

    // 'if rank[n] == rank[m]'
    chunker.add('if rank[n] == rank[m]', (vis) => {
      vis.array.deselect(PARENT_ARRAY_IDX, root1);
      vis.array.deselect(N_ARRAY_IDX, root2);
      vis.array.select(RANK_ARRAY_IDX, root1, undefined, undefined, ORANGE);
      vis.array.select(RANK_ARRAY_IDX, root2, undefined, undefined, ORANGE);
    });
    if (root1node.rank == root2node.rank) {
      root2node.rank += 1;
    }

    if (rankArr[root1] == rankArr[root2]) {
      // 'rank[m] <- rank[m] + 1'
      rankArr[root2] += 1;
      rankArr[root1] = null;

      chunker.add('rank[m] <- rank[m] + 1', (vis, array) => {

        vis.array.set(array, 'unionFind', ' ');
        vis.array.showKth(`Union(${n}, ${m})`);
        vis.array.assignVariable('n', N_ARRAY_IDX, root1);
        vis.array.assignVariable('m', N_ARRAY_IDX, root2);
        vis.array.deselect(RANK_ARRAY_IDX, root1);
        vis.array.deselect(RANK_ARRAY_IDX, root2);
        vis.array.select(RANK_ARRAY_IDX, root2, undefined, undefined, GREEN);

      }, [[N_ARRAY, parentArr, rankArr]]);
    }
    else {
      chunker.add('if rank[n] == rank[m]', (vis) => {
        vis.array.deselect(RANK_ARRAY_IDX, root1);
        vis.array.deselect(RANK_ARRAY_IDX, root2);
      });
    }

  },

  /**
   * Run the algorithm, populating the chunker with the set of union
   * steps.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Object} params The parameters for the algorithm.
   * @param {Array} params.target The set of union operations to perform.
   * @param {Boolean} params.pathCompression Whether to use path compression.
   */
  run(chunker, params) {

    const unionOperations = params.target.arg1;
    const pathCompression = params.target.arg2;
        
    // setting up the arrays
    const parentArr = ["Parent[i]",...N_ARRAY.slice(1)];
    const rankArr = ["Rank[i]",...Array(10).fill(0)];
    const nodesArray = [];
    parentArr.forEach((id) => {
      const newNode = new TreeNode(id);
      nodesArray.push(newNode);
    });
    // now set up connections
    const rootNode = nodesArray[0]; // The first node in the array
    for (let i = 1; i < nodesArray.length; i++) { // Start from the second node
      rootNode.addChild(nodesArray[i]);
      nodesArray[i].parent = rootNode;
    }
    chunker.add('union(n, m)', (vis, array) => {
    
      vis.array.set(array, 'unionFind');
      vis.tree.addNode(N_GRAPH[0]);
      for (const node of N_GRAPH.slice(1)) {
        vis.tree.addNode(node);
        vis.tree.addEdge(N_GRAPH[0], node);
      }
      vis.tree.layout();
      
    }, [[N_ARRAY, parentArr, rankArr]]);

    // applying union operations
    for (let i = 0; i < unionOperations.length; i++) {
      this.union(
        chunker,
        parentArr,
        rankArr,
        unionOperations[i][0],
        unionOperations[i][1],
        pathCompression,
        nodesArray,
      );
    }
  },
};
