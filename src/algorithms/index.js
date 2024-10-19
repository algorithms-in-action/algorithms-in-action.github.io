/* eslint quote-props: 0 */
import React from 'react';
import * as Explanation from './explanations';
import * as Param from './parameters';
import * as ExtraInfo from './extra-info';
import * as Controller from './controllers';
import * as Pseudocode from './pseudocode';
import * as Instructions from './instructions';

/*
 This file lists all the algorithms in the program, and imports
 them from the relevant file. Follow the example below for how to
 add new algorithms. There are two versions of this: allalgs
 is all algorithms, whatever the quality etc, and algorithms is the
 subset that are selected to be made visible and can be run. The idea is
 that during development we can merge all algorithms into a single
 branch of the repository but only deploy some of them to the users.
 For developers etc we can change a single line of code below where
 algorithms is defined to deploy all algorithms. For allalgs we use a
 noDeploy flag for each entry; if it is missing the default is the
 algorithm is deployed. Note that the DEFAULT_ALGORITHM from
 src/context/actions.js had better be deployed!
 XXX Design of noDeploy stuff was done with the aim of minimal code change
 and could be re-thought when there are fewer merges going on.

 Each imported algorithm is expected to be an object of the form:
 { pseudocode: String, explanation: String, run: Function }
 */

// Very Important: The key for each algorithm MUST be unique!
// Also: the key for the algorithm MUST be the same as the "name"
// of the top level Param block returned by the parameter function.
// Eg, parameters/msort_arr_td.js has
// 
// function MergesortParam() {
// ...
// return (
//     // <>
//       <div className="form">
//         <ListParam
//           name="msort_arr_td"  <---- ****SAME AS KEY****
// ...
// export default MergesortParam

const allalgs = {

  'heapSort': {
    name: 'Heapsort',
    category: 'Sort',
    explanation: Explanation.HSExp,
    param: <Param.HSParam />,
    instructions: Instructions.HSInstruction,
    extraInfo: ExtraInfo.HSInfo,
    pseudocode: {
      sort: Pseudocode.heapSort,
    },
    controller: {
      sort: Controller.heapSort,
    },
  },
  'quickSort': {
    name: 'Quicksort',
    category: 'Sort',
    explanation: Explanation.QSExp,
    param: <Param.QSParam />,
    instructions: Instructions.QSInstruction,
    extraInfo: ExtraInfo.QSInfo,
    pseudocode: {
      sort: Pseudocode.quickSort,
    },
    controller: {
      sort: Controller.quickSort,
    },
  },
  'quickSortM3': {
    name: 'Quicksort (Median of 3)',
    category: 'Sort',
    explanation: Explanation.QSM3Exp,
    param: <Param.QSM3Param />,
    instructions: Instructions.QSInstruction,
    extraInfo: ExtraInfo.QSM3Info,
    pseudocode: {
      sort: Pseudocode.quickSortM3,
    },
    controller: {
      sort: Controller.quickSortM3,
    },
  },
  'radixSortMSD': {
    name: 'MSD Radix Sort',
    category: 'Sort',
    explanation: Explanation.MSDRadixSortExp,
    param: <Param.MSDRadixSortParam />,
    instructions: Instructions.RadixSortInstruction,
    extraInfo: ExtraInfo.MSDRadixSortInfo,
    pseudocode: {
      sort: Pseudocode.MSDRadixSort,
    },
    controller: {
      sort: Controller.MSDRadixSort,
    },
  },
  'msort_arr_td': {
    name: 'Merge Sort',
    noDeploy: false,
    category: 'Sort',
    explanation: Explanation.msort_arr_td,
    param: <Param.msort_arr_td />,
    instructions: Instructions.msort_arr_td,
    extraInfo: ExtraInfo.msort_arr_td,
    pseudocode: {
      sort: Pseudocode.msort_arr_td,
    },
    controller: {
      sort: Controller.msort_arr_td,
    },
  },
  'msort_lista_td': {
    name: 'Merge Sort (lists)',
    category: 'Sort',
    explanation: Explanation.msort_lista_td,
    param: <Param.msort_lista_td />,
    instructions: Instructions.msort_lista_td,
    extraInfo: ExtraInfo.msort_lista_td,
    pseudocode: {
      sort: Pseudocode.msort_lista_td,
    },
    controller: {
      sort: Controller.msort_lista_td,
    },
  },

  'binarySearchTree': {
    noDeploy: false,
    name: 'Binary Search Tree',
    category: 'Insert/Search',
    param: <Param.BSTParam />,
    instructions: Instructions.BSTInstruction,
    explanation: Explanation.BSTExp,
    extraInfo: ExtraInfo.BSTInfo,
    pseudocode: {
      insertion: Pseudocode.binaryTreeInsertion,
      search: Pseudocode.binaryTreeSearch,
    },
    controller: {
      insertion: Controller.binaryTreeInsertion,
      search: Controller.binaryTreeSearch,
    },
  },
  'TTFTree': {
    name: '2-3-4 Tree',
    category: 'Insert/Search',
    param: <Param.TTFTreeParam/>,
    instructions: Instructions.TTFInstruction,
    explanation: Explanation.TTFExp,
    extraInfo: ExtraInfo.TTFInfo,
    pseudocode: {
      insertion: Pseudocode.TTFTreeInsertion,
      search: Pseudocode.TTFTreeSearch,
    },
    controller: {
      insertion: Controller.TTFTreeInsertion,
      search: Controller.TTFTreeSearch,
    },
  },

  'DFSrec': {
    name: 'Depth First Search',
    category: 'Graph',
    param: <Param.DFSrecParam />,
    instructions: Instructions.DFSrecInstruction,
    explanation: Explanation.DFSrecExp,
    extraInfo: ExtraInfo.DFSrecInfo,
    pseudocode: {
      find: Pseudocode.DFSrec,
    },
    controller: {
      find: Controller.DFSrec,
    },
  },
  'DFS': {
    name: 'DFS (iterative)',
    category: 'Graph',
    param: <Param.DFSParam />,
    instructions: Instructions.DFSInstruction,
    explanation: Explanation.DFSExp,
    extraInfo: ExtraInfo.DFSInfo,
    pseudocode: {
      find: Pseudocode.DFS,
    },
    controller: {
      find: Controller.DFS,
    },
  },
  'BFS': {
    name: 'Breadth First Search',
    category: 'Graph',
    param: <Param.BFSParam/>,
    instructions: Instructions.BFSInstruction,
    explanation: Explanation.BFSExp,
    extraInfo: ExtraInfo.BFSInfo,
    pseudocode: {
      find: Pseudocode.BFS,
    },
    controller: {
      find: Controller.BFS,
    },
  },
  'dijkstra': {
    name: 'Dijkstra\'s (shortest path)',
    category: 'Graph',
    param: <Param.DIJKParam />,
    instructions: Instructions.DIJKInstruction,
    explanation: Explanation.DIJKExp,
    extraInfo: ExtraInfo.DIJKInfo,
    pseudocode: {
      find: Pseudocode.dijkstra,
    },
    controller: {
      find: Controller.dijkstra,

    },
  }, 
   'aStar': {
    name: 'A* (heuristic search)',
    category: 'Graph',
    param: <Param.ASTARParam />,
    instructions: Instructions.ASTARInstruction,
    explanation: Explanation.ASTARExp,
    extraInfo: ExtraInfo.ASTARInfo,
    pseudocode: {
      find: Pseudocode.AStar,
    },
    controller: {
      find: Controller.AStar,

    },
  }, 
  'prim': {
    noDeploy: false,
    name: 'Prim\'s (min. spanning tree)',
    category: 'Graph',
    explanation: Explanation.PrimsExp,
    param: <Param.PrimsParam />,
    instructions: Instructions.PrimsInstruction,
    extraInfo: ExtraInfo.PrimsInfo,
    pseudocode: {
      find: Pseudocode.prim,
    },
    controller: {
      find: Controller.prim,
    },
  },
  'prim_old': {
    noDeploy: false,
    name: 'Prim\'s (simpler code)',
    category: 'Graph',
    explanation: Explanation.Prims_oldExp,
    param: <Param.Prims_oldParam />,
    instructions: Instructions.Prims_oldInstruction,
    extraInfo: ExtraInfo.Prims_oldInfo,
    pseudocode: {
      find: Pseudocode.prim_old,
    },
    controller: {
      find: Controller.prim_old,
    },
  },
  'kruskal': {
    noDeploy: false,
    name: 'Kruskal\'s (min. spanning tree)',
    category: 'Graph',
    explanation: Explanation.KruskalExp,
    param: <Param.KruskalParam />,
    instructions: Instructions.KruskalInstruction,
    extraInfo: ExtraInfo.KruskalInfo,
    pseudocode: {
      find: Pseudocode.kruskal,
    },
    controller: {
      find: Controller.kruskal,
    },
  },
  'transitiveClosure': {
    name: 'Warshall\'s (transitive closure)',
    category: 'Graph',
    explanation: Explanation.TCExp,
    param: <Param.TCParam />,
    instructions: Instructions.TCInstruction,
    extraInfo: ExtraInfo.TCInfo,
    pseudocode: {
      tc: Pseudocode.transitiveClosure,
    },
    controller: {
      tc: Controller.transitiveClosure,
    },
  },

  'unionFind': {
    name: 'Union Find',
    category: 'Set',
    param: <Param.UFParam />,
    instructions: Instructions.UFInstruction,
    explanation: Explanation.UFExp,
    extraInfo: ExtraInfo.UFInfo,
    pseudocode: {
      union: Pseudocode.unionFindUnion,
      find: Pseudocode.unionFindFind,
    },
    controller: {
      union: Controller.unionFindUnion,
      find: Controller.unionFindFind,
    },
  },

  'bruteForceStringSearch': {
    noDeploy: false,
    name: 'Brute Force',
    category: 'String Search',
    explanation: Explanation.BFSSExp,
    param: <Param.BFSSParam />,
    instructions: Instructions.BFSSInstruction,
    extraInfo: ExtraInfo.BFSSInfo,
    pseudocode: {
      search: Pseudocode.bruteForceStringSearch,
    },
    controller: {
      search: Controller.bruteForceStringSearch,
    },
  },
  'horspoolStringSearch': {
    noDeploy: false,
    name: 'Horspool\'s',
    category: 'String Search',
    /*
    Todo:
     1. Add explanation and extra info markdown contents
     2. Implement controller (check bookmark)
    */
    explanation: Explanation.HSSExp,
    param: <Param.HSSParam />,
    instructions: Instructions.HSSInstruction,
    extraInfo: ExtraInfo.HSSInfo,
    pseudocode: {
      search: Pseudocode.horspoolStringSearching,
    },
    controller: {
      search: Controller.horspoolStringSearch,
    },
  },

};

const algorithms =
  // Use next line for a version that includes all the algorithms:
  // allalgs;
  // Use next line for the deployed version:
  Object.fromEntries(Object.entries(allalgs).filter(a => !a[1].noDeploy));

/**
 * Get the first mode of an algorithm
 * @param {string} key algorithm's name
 */
export const getDefaultMode = (key) => Object.keys(algorithms[key].pseudocode)[0];

/**
 * Get the category of an algorithm
 * @param {string} key algorithm's name
 */
export const getCategory = (key) => algorithms[key].category;

// This function generates a list of algorithms classed by categories
const generateAlgorithmCategoryList = () => {
  const alCatList = [];
  let categoryNum = 0;

  // Get all the categories
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(algorithms)) {
    if (!alCatList.some((al) => al.category === value.category)) {
      alCatList.push({
        category: value.category,
        id: categoryNum,
        algorithms: [],
      });
      categoryNum += 1;
    }
  }

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(algorithms)) {
    const algo = alCatList.find((al) => al.category === value.category);
    algo.algorithms.push({
      name: value.name,
      shorthand: key,
      mode: getDefaultMode(key),
    });
  }

  return alCatList;
};

// This function generates a list of algorithms classed by categories
const generateAlgorithmList = () => {
  const alList = [];
  let alNum = 0;

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(algorithms)) {
    alList.push({
      name: value.name,
      shorthand: key,
      id: alNum,
      mode: getDefaultMode(key),
    });
    alNum += 1;
  }

  return alList;
};

export default algorithms;
export const AlgorithmCategoryList = generateAlgorithmCategoryList();
export const AlgorithmList = generateAlgorithmList();
export const AlgorithmNum = generateAlgorithmList().length;
