/* eslint quote-props: 0 */
import React from 'react';
import * as Explanation from './explanations';
import BinarySearchTree from './BinarySearchTree';
import * as Param from '../components/parameters';
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
    category: 'Graphs',
    param: <Param.BSTParam />,
    explanation: Explanation.BSTExp,
    controller: BinarySearchTree,
  },
  'quickSort': {
    name: 'Quick Sort',
    category: 'Sorting',
    explanation: Explanation.QuicksortExp,
    param: <Param.QuicksortParam />,
    controller: {
      pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
      * run() { yield ''; },
    },
  },
  'heapSort': {
    name: 'Heap Sort',
    category: 'Sorting',
    explanation: Explanation.HeapsortExp,
    param: <Param.HeapsortParam />,
    controller: {
      pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
      * run() { yield ''; },
    },
  },
  'kmp': {
    name: 'Knuth-Morris-Pratt',
    category: 'Dynamic Programming',
    explanation: Explanation.KMPExp,
    param: <Param.KMPParam />,
    controller: {
      pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
      * run() { yield ''; },
    },
  },
  'transitiveClosure': {
    name: 'Transitive Closure',
    category: 'Graphs',
    explanation: Explanation.TransitiveClosureExp,
    param: <Param.TransitiveClosureParam />,
    controller: {
      pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
      * run() { yield ''; },
    },
  },
};

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
    });
    alNum += 1;
  }

  return alList;
};

export default algorithms;
export const AlgorithmCategoryList = generateAlgorithmCategoryList();
export const AlgorithmList = generateAlgorithmList();
