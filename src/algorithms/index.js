/* eslint quote-props: 0 */
import {
  QuicksortExp,
  HeapsortExp,
  KMPExp,
  TransitiveClosureExp,
} from './explanations';

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
    explanation: QuicksortExp,
    pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
    * run() { yield ''; },
  },
  'heapsort': {
    name: 'Heap Sort',
    explanation: HeapsortExp,
    pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
    * run() { yield ''; },
  },
  'kmp': {
    name: 'Knuth-Morris-Pratt',
    explanation: KMPExp,
    pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
    * run() { yield ''; },
  },
  'transitiveClosure': {
    name: 'Transitive Closure',
    explanation: TransitiveClosureExp,
    pseudocode: { main: [{ code: '', bookmark: '', explanation: '' }] },
    * run() { yield ''; },
  },
};
