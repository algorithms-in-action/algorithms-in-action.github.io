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
};
