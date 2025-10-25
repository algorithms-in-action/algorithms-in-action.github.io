/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import selectionSort from '../selectionSort';

// Simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('selectionSort', () => {
  it('sorts empty array', () => {
    expect(selectionSort.run(chunker, { nodes: [] })).toEqual([]);
  });
  it('sorts single element', () => {
    expect(selectionSort.run(chunker, { nodes: [4] })).toEqual([4]);
  });
  it('sorts two values', () => {
    expect(selectionSort.run(chunker, { nodes: [1, 2] })).toEqual([1, 2]);
  });
  it('sorts two values in reverse', () => {
    expect(selectionSort.run(chunker, { nodes: [2, 1] })).toEqual([1, 2]);
  });
  it('sorts odd list', () => {
    expect(selectionSort.run(chunker, { nodes: [1, 4, 3] })).toEqual([1, 3, 4]);
  });
  it('sorts even list', () => {
    expect(selectionSort.run(chunker, { nodes: [1, 4, 3, 2] })).toEqual([1, 2, 3, 4]);
  });
  it('sorts ordered elements', () => {
    expect(selectionSort.run(chunker, { nodes: [1, 2, 3, 4, 5] })).toEqual([1, 2, 3, 4, 5]);
  });
  it('sorts reversed elements', () => {
    expect(selectionSort.run(chunker, { nodes: [5, 4, 3, 2, 1] })).toEqual([1, 2, 3, 4, 5]);
  });
  it('sorts list with duplicates', () => {
    expect(selectionSort.run(chunker, { nodes: [1, 3, 2, 5, 3, 2] })).toEqual([1, 2, 2, 3, 3, 5]);
  });
});
