/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import binaryTreeInsertion from './binaryTreeInsertion';

// Simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('binaryTreeInsertion', () => {
  it('insert ordered elements', () => {
    const E = [1, 2, 3, 4, 5];
    const result = {
      1: { right: 2 },
      2: { right: 3 },
      3: { right: 4 },
      4: { right: 5 },
      5: {},
    };
    expect(binaryTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('insert reversed elements', () => {
    const E = [5, 4, 3, 2, 1];
    const result = {
      5: { left: 4 },
      4: { left: 3 },
      3: { left: 2 },
      2: { left: 1 },
      1: {},
    };
    expect(binaryTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('general testing', () => {
    const E = [7, 5, 99, 56, 78];
    const result = {
      7: { left: 5, right: 99 },
      5: {},
      99: { left: 56 },
      56: { right: 78 },
      78: {},
    };
    expect(binaryTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('list with duplicates', () => {
    const E = [1, 3, 2, 5, 3, 2];
    const result = {
      1: { right: 3 },
      3: { left: 2, right: 5 },
      2: {},
      5: {},
    };
    expect(binaryTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
});
