/* eslint quote-props: 0 */
import * as Explanation from './explanations';
import BinarySearchTree from './BinarySearchTree';
/*
 This file lists all the algorithms in the program, and imports
 them from the relevant file. Follow the example below for how to
 add new algorithms.

 Each imported algorithm is expected to be an object of the form:
 { pseudocode: String, explanation: String, run: Function }
 */

// Very Important: The key must be unique!
const algorithms = {
  'binarySearchTree': {
    name: 'Binary Search Tree',
    category: 'Graphs',
    explanation: Explanation.BSTExp,
    controller: BinarySearchTree,
  },
  'quickSort': {
    name: 'Quick Sort',
    category: 'Sorting',
    explanation: Explanation.QuicksortExp,
    controller: {
      pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
      * run() { yield ''; },
    },
  },
  'heapSort': {
    name: 'Heap Sort',
    category: 'Sorting',
    explanation: Explanation.HeapsortExp,
    controller: {
      pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
      * run() { yield ''; },
    },
  },
  'kmp': {
    name: 'Knuth-Morris-Pratt',
    category: 'Dynamic Programming',
    explanation: Explanation.KMPExp,
    controller: {
      pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
      * run() { yield ''; },
    },
  },
  'transitiveClosure': {
    name: 'Transitive Closure',
    category: 'Graphs',
    explanation: Explanation.TransitiveClosureExp,
    controller: {
      pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
      * run() { yield ''; },
    },
  },
};

// This function generates a list of algorithms classed by categories
const generateAlgorithmCategoryList = () => {
  const alCatList = [];
  let categoryNum = 1;

  // Get all the categories
  for (const [key, value] of Object.entries(algorithms)) {
    if (!alCatList.some((al) => al.category === value.category)) {
      alCatList.push({
        category: value.category,
        num: categoryNum,
        list: [],
      });
      categoryNum += 1;
    }
  }

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(algorithms)) {
    const algo = alCatList.find((al) => al.category === value.category);
    algo.list.push({
      name: value.name,
      id: key,
    });
  }

  return alCatList;
};

export default algorithms;
export const AlgorithmCategoryList = generateAlgorithmCategoryList();
