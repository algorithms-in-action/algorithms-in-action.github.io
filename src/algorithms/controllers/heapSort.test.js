/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import heapSort from './heapSort';

// Simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('heapsort', () => {
  it('sorts empty array', () => {
    expect(heapSort.run(chunker, { nodes: [] })).toEqual([]);
  });
  it('sorts single element', () => {
    expect(heapSort.run(chunker, { nodes: [4] })).toEqual([4]);
  });
  it('sorts two values', () => {
    expect(heapSort.run(chunker, { nodes: [1, 2] })).toEqual([1, 2]);
  });
  it('sorts two values in reverse', () => {
    expect(heapSort.run(chunker, { nodes: [2, 1] })).toEqual([1, 2]);
  });
  it('sorts odd list', () => {
    expect(heapSort.run(chunker, { nodes: [1, 4, 3] })).toEqual([1, 3, 4]);
  });
  it('sorts even list', () => {
    expect(heapSort.run(chunker, { nodes: [1, 4, 3, 2] })).toEqual([1, 2, 3, 4]);
  });
  it('sorts ordered elements', () => {
    expect(heapSort.run(chunker, { nodes: [1, 2, 3, 4, 5] })).toEqual([1, 2, 3, 4, 5]);
  });
  it('sorts reversed elements', () => {
    expect(heapSort.run(chunker, { nodes: [5, 4, 3, 2, 1] })).toEqual([1, 2, 3, 4, 5]);
  });
  it('sorts list with duplicates', () => {
    expect(heapSort.run(chunker, { nodes: [1, 3, 2, 5, 3, 2] })).toEqual([1, 2, 2, 3, 3, 5]);
  });
});
