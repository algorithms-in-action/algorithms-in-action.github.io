/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { UFExp } from '../explanations';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';

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

const N_IDX = 0;
const PARENT_IDX = 1;
const RANK_IDX = 2;

const N_ARRAY = ["i", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const N_GRAPH = ['0','1','2','3','4','5','6','7','8','9','10'];
let unionPair = [];

let isRankVisible = false;
export function unionFindChunkerRefresh(algorithm) {
  if (!algorithm) return;
  let vis = algorithm.chunker.visualisers;
  let isVisible = algorithm.collapse.unionFind.union.Maybe_swap || algorithm.collapse.unionFind.union.Adjust_rank;
  vis.array.instance.hideArrayAtIndex(isVisible ? null : RANK_IDX);
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
    visObj.deselect(index1, index2);
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
  
  notAtRoot(chunker, parentArr, n) {
    // Highlighting parent[n] for 'transition' state. 
    chunker.add(`while n != parent[n]`, (vis, n) => {
      unhighlight(vis.array, PARENT_IDX, n, true);
      highlight(vis.array, PARENT_IDX, n, array.ORANGE);
    }, [n]);
    return parentArr[n] != n;
  },

   shortenPath(chunker, parentArr, n) {

    chunker.add(`parent[n] <- parent[parent[n]]`, (vis, n, parent, grandparent) => {
      unhighlight(vis.array, N_IDX, n);
      unhighlight(vis.tree, n, n);
      highlight(vis.array, PARENT_IDX, n, array.ORANGE);
      highlight(vis.array, PARENT_IDX, parent, array.ORANGE);
      highlight(vis.tree, parent, parent, tree.ORANGE);
      highlight(vis.tree, grandparent, grandparent, tree.ORANGE);
    },[n, parentArr[n], parentArr[parentArr[n]]]);

    // If grandparent is not the parent 
    if (parentArr[n] !== n && parentArr[parentArr[n]] !== parentArr[n]) {
        
      let formerParent = parentArr[n];
        parentArr[n] = parentArr[parentArr[n]]; 

      chunker.add(`parent[n] <- parent[parent[n]]`, (vis, n, grandparent) => {
        vis.array.updateValueAt(PARENT_IDX, n, grandparent);

        vis.tree.removeEdge(formerParent.toString(), n.toString());
        vis.tree.addEdge(grandparent.toString(), n.toString());
        vis.tree.layout();
      },[n, parentArr[parentArr[n]]]);
      

      chunker.add(`parent[n] <- parent[parent[n]]`, (vis, n, formerParent, newParent) => {
        unhighlight(vis.array, PARENT_IDX, formerParent);
        unhighlight(vis.tree, formerParent, formerParent);
        unhighlight(vis.tree, newParent, newParent)
        
        highlight(vis.array, N_IDX, n, array.RED);
        highlight(vis.array, PARENT_IDX, n, array.RED);
        highlight(vis.tree, n, n, tree.RED);
      },[n, formerParent, parentArr[n]]);

    } 
  },


  find(chunker, parentArr, n, name, m, pathCompression) {

    // Highlighting the current n to find in tree and array. 
    chunker.add(`${name} <- Find(${name})`, (vis, name) => {
      vis.array.setMotion(true); // Turning on smooth transition.

      const valToFind = unionPair[name === 'n' ? 0 : 1]
      highlight(vis.array, N_IDX, valToFind, array.ORANGE);
      highlight(vis.tree, valToFind, valToFind, tree.ORANGE);
      vis.array.showKth(`Union(${unionPair[0]}, ${unionPair[1]}): Find(${valToFind})`);

    },[name]);
        
    while (this.notAtRoot(chunker, parentArr, n)) {
            
      // Highlighting for 'fail state'. 
      chunker.add(`while n != parent[n]`, (vis, n) => {
        highlight(vis.array, N_IDX, n, array.RED);
        highlight(vis.array, PARENT_IDX, n, array.RED);
        highlight(vis.tree, n, n, tree.RED);
      },[n]);

      if (pathCompression) {
        this.shortenPath(chunker, parentArr, n);
      }
      
      // Updating the value of n.
      let nTempPrev = n;
      n = parentArr[n];

      chunker.add(`n <- parent[n]`, (vis, n, m, nPrev) => {
        vis.array.assignVariable(`${name}`, N_IDX, n); // Update 'n'.
        if (n !== m && m !== null) highlight(vis.array, N_IDX, m, array.GREEN);
        highlight(vis.array, N_IDX, n, array.ORANGE);
        highlight(vis.array, PARENT_IDX, nPrev, array.ORANGE);
        highlight(vis.tree, n, n, tree.ORANGE);
        unhighlight(vis.tree, nPrev, nPrev);
      },[n, m, nTempPrev]);
    }

    // Highlighting for 'success state'.
    chunker.add(`while n != parent[n]`, (vis, n) => {
      highlight(vis.array, N_IDX, n, array.GREEN);
      highlight(vis.array, PARENT_IDX, n, array.GREEN);
      highlight(vis.tree, n, n, tree.GREEN);
    }, [n]);

    // Returning found 'n'.
    chunker.add(`return n`, (vis, n) => {
      unhighlight(vis.array, PARENT_IDX, n);
    },[n]);

    return n;
  },

  union(chunker, parentArr, rankArr, n, m, pathCompression) {
    
    // Initialising current union operation.
    chunker.add('Union(n, m)', (vis, n, m) => {
      unionPair = [n, m]; // can maybe delete
      vis.array.setMotion(false);
      vis.array.assignVariable('n', N_IDX, n);
      vis.array.assignVariable('m', N_IDX, m);
      vis.array.showKth(`Union(${n}, ${m})`);
    },[n,m]);

    let root1 = this.find(chunker, parentArr, n, 'n', null, pathCompression);
    let root2 = this.find(chunker, parentArr, m, 'm', root1, pathCompression);

    chunker.add('if n == m', (vis) => {
      highlight(vis.array, N_IDX, root1, array.ORANGE);
      highlight(vis.array, N_IDX, root2, array.ORANGE);
      highlight(vis.tree, root1, root1, tree.ORANGE);
      highlight(vis.tree, root2, root2, tree.ORANGE);
    },[root1, root2]);

    // If in same set, return.
    if (root1 === root2) {
      chunker.add('return', (vis) => {
        highlight(vis.array, N_IDX, root1, array.GREEN);
        highlight(vis.tree, root1, root1, tree.GREEN);
      },[root1]);
      return;
    }

    // 'if rank[n] > rank[m]'
    chunker.add('if rank[n] > rank[m]', (vis) => {
      //unhighlight(vis.array, N_IDX, root1);
      //unhighlight(vis.array, N_IDX, root2);
      highlight(vis.array, RANK_IDX, root1, array.ORANGE);
      highlight(vis.array, RANK_IDX, root2, array.ORANGE);
    },[root1, root2]);

    if (rankArr[root1] > rankArr[root2]) {

      // Swap n and m
      const tempRoot1 = root1;
      root1 = root2;
      root2 = tempRoot1;

      chunker.add('swap(n, m)', (vis, root1, root2) => {
        vis.array.assignVariable('n', N_IDX, root1);
        vis.array.assignVariable('m', N_IDX, root2);
        highlight(vis.array, RANK_IDX, root1, array.GREEN);
        highlight(vis.array, RANK_IDX, root2, array.GREEN);
      },[root1, root2]);
    }

    chunker.add('parent[n] = m', (vis, root1, root2) => { 
      unhighlight(vis.array, N_IDX, root1);
      unhighlight(vis.array, RANK_IDX, root1);
      unhighlight(vis.array, RANK_IDX, root2);
      highlight(vis.array, N_IDX, root2, array.ORANGE);
      highlight(vis.array, PARENT_IDX, root1, array.ORANGE);
    },[root1, root2]);

    parentArr[root1] = root2;

    chunker.add('parent[n] = m', (vis, root1, root2) => {
      vis.array.updateValueAt(PARENT_IDX, root1, root2);

      highlight(vis.array, N_IDX, root2, array.GREEN);
      highlight(vis.array, PARENT_IDX, root1, array.GREEN);

      highlight(vis.tree, root1, root1, tree.GREEN);
      highlight(vis.tree, root2, root2, tree.GREEN);

      vis.tree.removeEdge('0', root1.toString());
      vis.tree.removeEdge(root1.toString(), root1.toString()) // Remove self-loop.
      vis.tree.addEdge(root2.toString(), root1.toString());
      vis.tree.layout();
      
    }, [root1, root2]);

    chunker.add('if rank[n] == rank[m]', (vis, root1, root2) => {
      unhighlight(vis.array, PARENT_IDX, root1);
      unhighlight(vis.array, N_IDX, root2);
      highlight(vis.array, RANK_IDX, root1, array.ORANGE);
      highlight(vis.array, RANK_IDX, root2, array.ORANGE);
      unhighlight(vis.tree, root1, root1);
      unhighlight(vis.tree, root2, root2);
    },[root1, root2]);

    if (rankArr[root1] == rankArr[root2]) {
      
      rankArr[root2] += 1;
      rankArr[root1] = null;

      chunker.add('rank[m] <- rank[m] + 1', (vis, root1, root2) => {
        vis.array.updateValueAt(RANK_IDX, root2, rankArr[root2]);
        vis.array.updateValueAt(RANK_IDX, root1, rankArr[root1]);
        unhighlight(vis.array, RANK_IDX, root1);
        highlight(vis.array, RANK_IDX, root2, array.GREEN);
      },[root1, root2]);
    }

  },


  run(chunker, params) {
    
    const { arg1: unionOperations, arg2: pathCompression } = params.target;
        
    // Setting up the arrays.
    let parentArr = ["Parent[i]",...N_ARRAY.slice(1)];
    let rankArr = ["Rank[i]",...Array(10).fill(0)];

    // Initialising the visualisers.
    chunker.add('Union(n, m)', (vis, array) => {

      // Setting up array.
      vis.array.set(array, 'unionFind', '');
      vis.array.hideArrayAtIndex(isRankVisible ? null : RANK_IDX);

      // Adding nodes to tree.
      vis.tree.addNode(N_GRAPH[0], undefined, 'circle');
      for (const node of N_GRAPH.slice(1)) {
        vis.tree.addNode(node, undefined, 'circle');
        vis.tree.addEdge(N_GRAPH[0], node); // Setting up connections to invisible root node.
      }

      vis.tree.isReversed = true;
      vis.tree.layout();

      // Adding self-loop. 
      for (const node of N_GRAPH.slice(1)) {
        vis.tree.addSelfLoop(node);
      }
      
    }, [[N_ARRAY, parentArr, rankArr]]);

    // Applying union operations
    for (let i = 0; i < unionOperations.length; i++) {
      this.union(
        chunker,
        parentArr,
        rankArr,
        unionOperations[i][0],
        unionOperations[i][1],
        pathCompression,
      );
    }
  },
};

