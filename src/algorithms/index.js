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
 add new algorithms.

 Each imported algorithm is expected to be an object of the form:
 { pseudocode: String, explanation: String, run: Function }
 */

// Very Important: The key for the algorithms must be unique!
const algorithms = {
  'binarySearchTree': {
    name: 'Binary Search Tree',
    category: 'Searching',
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
  'quickSort': {
    name: 'Quicksort',
    category: 'Sorting',
    explanation: Explanation.QSExp,
    param: <Param.QSParam />,
    instructions: Instructions.QSInstruction,
    extraInfo: ExtraInfo.QSInfo,
    pseudocode: {
      sort: Pseudocode.quickSort,
      // medianSort: Pseudocode.quickSortM3,
    },
    controller: {
      sort: Controller.quickSort,
      // medianSort: Controller.quickSortM3,
    },
  },
  'quickSortM3': {
    name: 'Quicksort (Median of 3)',
    category: 'Sorting',
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
  'heapSort': {
    name: 'Heapsort',
    category: 'Sorting',
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
  'prim': {
    name: 'Prim\'s Algorithm',
    category: 'Greedy',
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
  'transitiveClosure': {
    name: 'Transitive Closure',
    category: 'Dynamic Programming',
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
  'bruteForceStringSearch': {
    name: 'Brute Force String Search',
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
};

/**
 * Get the first mode of an algorithm
 * @param {string} key algorithm's name
 */
const getDefaultMode = (key) => Object.keys(algorithms[key].pseudocode)[0];

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
