/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { UFExp } from '../explanations';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';
import TreeNode from '../../components/DataStructures/Graph/NAryTree'; 
import { chunk } from 'lodash';
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
        instance: new NTreeTracer('n-tree', null, 'Tree View'),
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
  notAtRoot(chunker, parentArr, n, name, nTempPrev, nConst, caption) {

    
    // To visually separate into two distinct steps:
    chunker.add(`while n != parent[n]`, (vis,n) => {

      vis.array.setMotion(true);

      vis.array.assignVariable(`${name}`, N_ARRAY_IDX, n);
      vis.array.showKth(caption);
      vis.array.select(N_ARRAY_IDX, n, undefined, undefined, ORANGE);
      // To keep 'n' highlighted:
      vis.array.select(N_ARRAY_IDX, nConst, undefined, undefined, GREEN);
      vis.tree.visit1(n.toString(),n.toString(),2);
      if (nTempPrev != n) {
        // Maintain orange highlight (assignVariable effectively deselects).
        vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, ORANGE);
      }
    },[n]);

    chunker.add(`while n != parent[n]`, (vis) => {

      vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, ORANGE);
      
      vis.array.deselect(PARENT_ARRAY_IDX, 0, undefined, n-1)
      vis.array.deselect(PARENT_ARRAY_IDX, n+1, undefined, 10)
      
    });

    if (parentArr[n] != n) {
      return true;
    }
    return false;
  },

   // TODO: path compression for tree
   shortenPath(chunker, parentArr, rankArr, n, name, m, nodesArray) {
    const parent = parentArr[n];
    const grandparent = parentArr[parent];
    const parentNode = nodesArray[n].parent;
    const grandparentNode = parentNode.parent;
    
    // highlight parent[n] in parent array
    chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
      vis.array.deselect(N_ARRAY_IDX, n);
      vis.array.deselect(PARENT_ARRAY_IDX, n);
      vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, ORANGE);
    });

    // highlight n's parent in the n array
    chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
      vis.array.select(N_ARRAY_IDX, parent, undefined, undefined, ORANGE);
    });
    
    // highlight the grandparent
    chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
      vis.array.deselect(N_ARRAY_IDX, parent);
      vis.array.select(PARENT_ARRAY_IDX, parent, undefined, undefined, ORANGE);
    });

    let gp = null;
    let p = parentNode.id;
    // change parent[n] into the grandparent's value
    parentArr[n] = grandparent;
    if (grandparentNode != null){
      let index = parentNode.children.indexOf(nodesArray[n]);
      parentNode.children.splice(nodesArray[n],1);
      nodesArray[n].parent = grandparentNode;
      gp = grandparentNode.id;
    }
    
    chunker.add(`parent[n] <- parent[parent[n]]`, (vis, array, n, p, gp) => {
      vis.array.set(array, 'unionFind', ' ');
      vis.array.assignVariable(name, N_ARRAY_IDX, n);
      if (name == 'n') {
        vis.array.showKth(`Union(${n}, ${m})`);
      }
      else { // dealing with m, need to show n and order Union(n,m) correctly
        vis.array.assignVariable('n', N_ARRAY_IDX, m);
        vis.array.showKth(`Union(${m}, ${n})`);        
      }
      // change edges if the node has a grandparent
      
      if (gp != null){
        console.log(n, p, gp);
        vis.tree.removeEdge(p.toString(), n.toString());
        vis.tree.addEdge(gp.toString(), n.toString());
        vis.tree.layout();
      }
    
      vis.array.deselect(PARENT_ARRAY_IDX, parent);
      vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, ORANGE);
    }, [[N_ARRAY, parentArr, rankArr],nodesArray[n].id,p, gp]);

  },

  /**
   * Populate the chunker with the steps required to do a find operation.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Array} parentArr The parent array.
   * @param {Number} n The number to find.
   * @param {String} name The variable name of the number to find.
   * @param {Boolean} pathCompression Whether to use path compression.
   */
  find(chunker, parentArr, rankArr, n, name, m, pathCompression, nodesArray, nConst, caption) {
    
           
    // 'while n != parent[n]'
    let nTempPrev = n;
    
    while (this.notAtRoot(chunker, parentArr, n, name, nTempPrev, nConst, caption)) {

      
      nTempPrev = n;
      
      chunker.add(`while n != parent[n]`, (vis,n) => {

        vis.array.deselect(N_ARRAY_IDX, nTempPrev);
        vis.array.deselect(PARENT_ARRAY_IDX, nTempPrev);

        vis.array.select(N_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
        vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
        vis.tree.leave1(n.toString(),n.toString(),2);
        vis.tree.visit(n.toString(), n.toString());
        
      },[nTempPrev]);

      // TODO: `n <- parent[n]` (path compression)
      if (pathCompression === true) {
        this.shortenPath(chunker, parentArr, rankArr, nTempPrev, name, m, nodesArray);
      }

      // 'n <- parent[n]'
      n = parentArr[n];
      const nTemp = n;
      chunker.add(`n <- parent[n]`, (vis,n) => {
      

        vis.array.deselect(N_ARRAY_IDX, nTempPrev);
        vis.array.deselect(PARENT_ARRAY_IDX, nTempPrev);

        vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, ORANGE);
        vis.tree.leave(n.toString(),n.toString());
        
      }, [nTempPrev]);
    }

    // 'return n'
    chunker.add(`while n != parent[n]`, (vis) => {

      vis.array.deselect(N_ARRAY_IDX, n);
      vis.array.deselect(PARENT_ARRAY_IDX, n);
      
      vis.array.select(N_ARRAY_IDX, n, undefined, undefined, GREEN);
      vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, GREEN);
      
      vis.tree.visit1(n.toString(),n.toString(),2);
    }, [n]);

    chunker.add(`return n`, (vis) => {

      vis.array.deselect(PARENT_ARRAY_IDX, n);
      vis.tree.leave1(n.toString(), n.toString(),2);
      vis.tree.select(n.toString(), n.toString());
    },[n]);

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
    chunker.add('Union(n, m)', (vis, array) => {


      vis.array.set(array, 'unionFind', ' ');
      vis.array.setMotion(false);
      vis.array.assignVariable('n', N_ARRAY_IDX, n);
      vis.array.assignVariable('m', N_ARRAY_IDX, m);

      vis.array.showKth(`Union(${n}, ${m})`);

    }, [[N_ARRAY, parentArr, rankArr]]);



    // 'n <- find(n)' and 'm <- find(m)'
    let root1 = this.find(chunker, parentArr, rankArr, n, 'n', m, pathCompression, nodesArray, undefined, `Union(${n}, ${m}) → Find(${n})`);
    let root2 = this.find(chunker, parentArr, rankArr, m, 'm', m, pathCompression, nodesArray, root1, `Union(${n}, ${m}) → Find(${m})`);
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
        //vis.tree.swapNodes(n,m);
        //vis.tree.layout();
      }, [root1node.id, root2node.id]);
      
      let tmpParent = null;
      let tmpChildren = null;
      let tmpId = null;
  
      tmpParent = root1node.parent;
      tmpChildren = root1node.children;
      tmpId = root1node.id;
      root1node.parent = root2node.parent;
      root1node.children = root2node.children;
      root1node.id = root2node.id;
      root2node.parent = tmpParent;
      root2node.children = tmpChildren;
      root2node.id = tmpId;
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
      
      console.log(n, m)
    }, [[N_ARRAY, parentArr, rankArr],root1node.id, root2node.id]);

    // 'if rank[n] == rank[m]'
    chunker.add('if rank[n] == rank[m]', (vis) => {
      vis.array.deselect(PARENT_ARRAY_IDX, root1);
      vis.array.deselect(N_ARRAY_IDX, root2);
      vis.array.select(RANK_ARRAY_IDX, root1, undefined, undefined, ORANGE);
      vis.array.select(RANK_ARRAY_IDX, root2, undefined, undefined, ORANGE);
      vis.tree.deselect(n.toString(), n.toString());
      vis.tree.deselect(m.toString(), m.toString());
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
    chunker.add('Union(n, m)', (vis, array) => {
    
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
