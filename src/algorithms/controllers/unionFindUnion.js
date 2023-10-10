/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { UFExp } from '../explanations';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';
import TreeNode from '../../components/DataStructures/Graph/NAryTree'; 

import { getGlobalAlgotithm } from './transitiveClosureCollapseChunkPlugin';
import { update } from 'lodash';


// Defining constants for readability.
const array = {
  RED: '5',
  ORANGE: '4',
  GREEN: '1',
}

const tree = {
  RED: 3,
  ORANGE: 2,
  GREEN: 1,
}

const N_ARRAY_IDX = 0;
const PARENT_ARRAY_IDX = 1;
const RANK_ARRAY_IDX = 2;

const N_ARRAY = ["i", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const N_GRAPH = ['0','1','2','3','4','5','6','7','8','9','10'];

let isRankVisible = false;
let unionPair = [];

export function unionFindChunkerRefresh(vis) {
  const algorithm  = getGlobalAlgotithm();
  let isVisible = algorithm.collapse.unionFind.union.Maybe_swap || algorithm.collapse.unionFind.union.Adjust_rank;
  vis.array.instance.hideArrayAtIndex(isVisible ? null : RANK_ARRAY_IDX);
  isRankVisible = isVisible;
}

function unhighlight(visObj, index1, index2, deselectForRow=false) {
  if (visObj.key === 'array') {
    if (deselectForRow === true) {
      visObj.deselect(index1, 0, undefined, N_ARRAY.length-1);
      return;
    }
    visObj.deselect(index1, index2);
    return;
  }

  if(visObj.key === 'n-tree') {
    visObj.leave1(index1.toString(), index2.toString(), tree.RED);
    visObj.leave1(index1.toString(), index2.toString(), tree.ORANGE);
    visObj.leave1(index1.toString(), index2.toString(), tree.GREEN);
  }
}

function highlight(visObj, index1, index2, colour) {
  if (visObj.key === 'array') {
    visObj.deselect(index1, index2); // might cause an issue
    visObj.select(index1, index2, undefined, undefined, colour);
  }

  if(visObj.key === 'n-tree') {
    unhighlight(visObj, index1, index2);
    visObj.visit1(index1.toString(), index2.toString(), colour);
  }
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
  

  /**
   * Populate the chunker with 'while n != parent[n]' or 'while m != parent[m]'.
   * Return true if the number is not at the root, false otherwise.
   * @param {Chunker} chunker The chunker to populate.
   * @param {Array} parentArr The parent array.
   * @param {Number} n The number to find.
   * @param {String} name The variable name of the number to find.
   * @returns {Boolean} Whether the number is not at the root.
   */
  notAtRoot(chunker, parentArr, n, name, nTempPrev, nConst) {
    // To visually separate into two distinct steps:
    chunker.add(`while n != parent[n]`, (vis,n) => {

      vis.array.setMotion(true);
      vis.array.assignVariable(`${name}`, N_ARRAY_IDX, n);
      vis.array.showKth(`Union(${unionPair[0]}, ${unionPair[1]}): Find(${unionPair[name === 'n' ? 0 : 1]})`);

      highlight(vis.array, N_ARRAY_IDX, n, array.ORANGE);
      highlight(vis.array, N_ARRAY_IDX, nConst, array.GREEN);
      highlight(vis.tree, n.toString(), n.toString(), tree.ORANGE);

      if (nTempPrev !=n ) {
        highlight(vis.array, PARENT_ARRAY_IDX, nTempPrev, array.ORANGE);
      }

    },[n]);

    chunker.add(`while n != parent[n]`, (vis) => {

      unhighlight(vis.array, PARENT_ARRAY_IDX, n, true);
      highlight(vis.array, PARENT_ARRAY_IDX, n, array.ORANGE);

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
    let grandparentNode =null;
    const parentNode = nodesArray[n].parent;
    if (parentNode!= null){
      grandparentNode = parentNode.parent;
    }
    
    
    
    // highlight parent[n] in parent array
    chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
      unhighlight(vis.array, N_ARRAY_IDX, n);
      unhighlight(vis.array, PARENT_ARRAY_IDX, n);
      highlight(vis.array, PARENT_ARRAY_IDX, n, array.ORANGE);

    });

    // highlight n's parent in the n array
    chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
      highlight(vis.array, N_ARRAY_IDX, parent, array.ORANGE);
    });
    
    // highlight the grandparent
    chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
      unhighlight(vis.array, N_ARRAY_IDX, parent);
      highlight(vis.array, PARENT_ARRAY_IDX, parent, array.ORANGE);
    });

    let gp = null;
    let p =null;
    if (parentNode != null){
      p = parentNode.id;
    }
    
    // change parent[n] into the grandparent's value
    
    parentArr[n] = grandparent;
    if (grandparentNode != null){
      let index = parentNode.children.indexOf(nodesArray[n]);
      parentNode.children.splice(nodesArray[n],1);
      nodesArray[n].parent = grandparentNode;
      gp = grandparentNode.id;
    }
    
    chunker.add(`parent[n] <- parent[parent[n]]`, (vis, array, n, p, gp) => {
      // may not work ;)
      // fix this up :))
      vis.array.set(array, 'unionFind', ' ');
      vis.array.hideArrayAtIndex(isRankVisible ? null : RANK_ARRAY_IDX);
      vis.array.assignVariable(name, N_ARRAY_IDX, n);
      if (name == 'n') {
        vis.array.assignVariable('m', N_ARRAY_IDX, m);
        vis.array.showKth(`Union(${n}, ${m})`);
      }
      else { // dealing with m, need to show n and order Union(n,m) correctly
        vis.array.assignVariable('n', N_ARRAY_IDX, m);
        vis.array.showKth(`Union(${m}, ${n})`);    
      }
      // change edges if the node has a grandparent
      
      if (gp != null){
        vis.tree.removeEdge(p.toString(), n.toString());
        vis.tree.addEdge(gp.toString(), n.toString());
        vis.tree.layout();
      }
    
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


    /*chunker.add(`${name} <- Find(${name})`, (vis) => {
      ////vis.array.select(N_ARRAY_IDX, n, undefined, undefined, ORANGE);
    },); */
    
           
    // 'while n != parent[n]'
    let nTempPrev = n;
    
    while (this.notAtRoot(chunker, parentArr, n, name, nTempPrev, nConst, caption)) {
      
      nTempPrev = n;
      
      chunker.add(`while n != parent[n]`, (vis,n) => {

        highlight(vis.array, N_ARRAY_IDX, nTempPrev, array.RED);
        highlight(vis.array, PARENT_ARRAY_IDX, nTempPrev, array.RED);
        highlight(vis.tree, n.toString(), n.toString(), tree.RED);
        
      },[nTempPrev]);

      // TODO: `n <- parent[n]` (path compression)
      if (pathCompression === true) {
        this.shortenPath(chunker, parentArr, rankArr, nTempPrev, name, m, nodesArray);
      }

      n = parentArr[n];
      const nTemp = n;
      chunker.add(`n <- parent[n]`, (vis,n) => {

        unhighlight(vis.array, N_ARRAY_IDX, nTempPrev);
        highlight(vis.array, PARENT_ARRAY_IDX, nTempPrev, array.ORANGE);
        unhighlight(vis.tree, n.toString(), n.toString());
        
      }, [nTempPrev]);
    }

    chunker.add(`while n != parent[n]`, (vis) => {

      highlight(vis.array, N_ARRAY_IDX, n, array.GREEN);
      highlight(vis.array, PARENT_ARRAY_IDX, n, array.GREEN);
      highlight(vis.tree, n.toString(), n.toString(), tree.GREEN);

    }, [n]);

    chunker.add(`return n`, (vis) => {

      unhighlight(vis.array, PARENT_ARRAY_IDX, n);
      
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

    //animationState.caption = `Union(${n}, ${m})`;
    const constN = n;
    const constM = m;
    
    // Setting up array. 
    chunker.add('Union(n, m)', (vis, array) => {

      unionPair = [n, m];
      vis.array.set(array, 'unionFind', ' ');

      vis.array.setMotion(false);
      vis.array.hideArrayAtIndex(isRankVisible ? null : RANK_ARRAY_IDX);

      vis.array.assignVariable('n', N_ARRAY_IDX, n);
      vis.array.assignVariable('m', N_ARRAY_IDX, m);

      vis.array.showKth(`Union(${n}, ${m})`);


    }, [[N_ARRAY, parentArr, rankArr]]);

    // 'n <- find(n)' and 'm <- find(m)'
    let root1 = this.find(chunker, parentArr, rankArr, n, 'n', m, pathCompression, nodesArray, undefined, `Union(${n}, ${m}), Find(${n})`);
    let root2 = this.find(chunker, parentArr, rankArr, m, 'm', m, pathCompression, nodesArray, root1, `Union(${n}, ${m}), Find(${m})`);

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

    chunker.add('if n == m', (vis) => {

      vis.array.showKth(`Union(${constN}, ${constM})`);
      highlight(vis.array, N_ARRAY_IDX, root1, array.GREEN);
      highlight(vis.array, N_ARRAY_IDX, root2, array.GREEN);
      
    });

    if (root1 === root2) {

      chunker.add('return', () => {
      });

      return;
    }

    // 'if rank[n] > rank[m]'
    chunker.add('if rank[n] > rank[m]', (vis) => {

      unhighlight(vis.array, N_ARRAY_IDX, root1);
      unhighlight(vis.array, N_ARRAY_IDX, root2);
      highlight(vis.array, RANK_ARRAY_IDX, root1, array.ORANGE);
      highlight(vis.array, RANK_ARRAY_IDX, root2, array.ORANGE);

    });

    if (rankArr[root1] > rankArr[root2]) {

      const tempRoot1 = root1;
      root1 = root2;
      root2 = tempRoot1;

      chunker.add('swap(n, m)', (vis,n,m) => {

        vis.array.assignVariable('n', N_ARRAY_IDX, root1);
        vis.array.assignVariable('m', N_ARRAY_IDX, root2);
        highlight(vis.array, RANK_ARRAY_IDX, root1, array.ORANGE);
        highlight(vis.array, RANK_ARRAY_IDX, root2, array.ORANGE);

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

      unhighlight(vis.array, RANK_ARRAY_IDX, root1);
      unhighlight(vis.array, RANK_ARRAY_IDX, root2);
      highlight(vis.array, N_ARRAY_IDX, root2, array.GREEN);
      highlight(vis.array, PARENT_ARRAY_IDX,root1, array.GREEN);

    }, [[N_ARRAY, parentArr, rankArr]]);

    root1node.parent = root2node;
    root2node.addChild(root1node);

    parentArr[root1] = root2;

    const treeRoot = '0';
    chunker.add('parent[n] = m', (vis, array,n,m) => {

      vis.array.updateValueAt(PARENT_ARRAY_IDX, root1, root2);
      vis.tree.removeEdge(treeRoot, n.toString());
      vis.tree.removeEdge(n.toString(), n.toString()) // Remove self-loop.
      vis.tree.addEdge(m.toString(), n.toString());
      vis.tree.layout();
      
    }, [[N_ARRAY, parentArr, rankArr],root1node.id, root2node.id]);

    chunker.add('if rank[n] == rank[m]', (vis, n, m ) => {

      unhighlight(vis.array, PARENT_ARRAY_IDX, root1);
      unhighlight(vis.array, N_ARRAY_IDX, root2);
      highlight(vis.array, RANK_ARRAY_IDX, root1, array.ORANGE);
      highlight(vis.array, RANK_ARRAY_IDX, root2, array.ORANGE);
      unhighlight(vis.tree, n.toString(), n.toString());
      unhighlight(vis.tree, m.toString(), m.toString());

    },[root1node.id, root2node.id]);
    
    if (root1node.rank == root2node.rank) {
      root2node.rank += 1;
    }

    if (rankArr[root1] == rankArr[root2]) {

      rankArr[root2] += 1;
      rankArr[root1] = null;

      chunker.add('rank[m] <- rank[m] + 1', (vis) => {

        vis.array.updateValueAt(RANK_ARRAY_IDX, root2, rankArr[root2]);
        vis.array.updateValueAt(RANK_ARRAY_IDX, root1, rankArr[root1]);
        unhighlight(vis.array, RANK_ARRAY_IDX, root1);
        highlight(vis.array, RANK_ARRAY_IDX, root2, array.GREEN);

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
    let rankArr = ["Rank[i]",...Array(10).fill(0)];

    const nodesArray = [];
    N_GRAPH.slice(1).forEach((id) => {
      const newNode = new TreeNode(id);
      nodesArray.push(newNode);
    });
    // now set up connections
    const rootNode = nodesArray[0]; // The first node in the array
    for (let i = 0; i < nodesArray.length; i++) { // Start from the second node
      //rootNode.addChild(nodesArray[i]);
      nodesArray[i].parent = null;
    }
    chunker.add('Union(n, m)', (vis, array) => {
     // console.log(isRankVisible);

      vis.array.set(array, 'unionFind');
      vis.array.hideArrayAtIndex(isRankVisible ? null : RANK_ARRAY_IDX);
      vis.tree.addNode(N_GRAPH[0], undefined, 'circle');
      for (const node of N_GRAPH.slice(1)) {
        vis.tree.addNode(node, undefined, 'circle');
        vis.tree.addEdge(N_GRAPH[0], node);
      }
      vis.tree.isReversed = true;
      vis.tree.layout();

      for (const node of N_GRAPH.slice(1)) {
        vis.tree.addSelfLoop(node);
      }
      
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
  }
};

