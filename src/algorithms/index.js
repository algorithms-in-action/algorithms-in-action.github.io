/* eslint quote-props: 0 */

/*
 This file lists all the algorithms in the program, and imports
 them from the relevant file. Follow the example below for how to
 add new algorithms.

 Each imported algorithm is expected to be an object of the form:
 { pseudocode: String, explanation: String, run: Function }
 */

import binaryTreeSearch from './binaryTreeSearch';

export default {
  'binaryTreeSearch': binaryTreeSearch,
  // The entries below are not fully-written yet, they are for testing only
  'quicksort': {
    name: 'Quick Sort',
    explanation: 'A Quick Sort works by sorting quickly.',
    pseudocode: {},
  },
  'heapsort': {
    name: 'Heap Sort',
    explanation: 'A Heap Sort works by sorting heaps.',
    pseudocode: {},
  },
  'kmp': {
    name: 'Knuth-Morris-Pratt',
    explanation: 'There\'s a good chance I got the spelling of the name of this algorithm wrong.',
    pseudocode: {},
  },
  'transitiveClosure': {
    name: 'Transitive Closure',
    explanation: 'This is some kind of graph algorithm that looks cool and does something useful.',
    pseudocode: {},
  },
};
