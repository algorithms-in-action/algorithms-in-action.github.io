/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import transitiveClosure from './transitiveClosure';

// Simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('transitiveClosure', () => {
  it('Test an empty array', () => {
    const E = [];
    const s = 0;
    const result = [];
    expect(transitiveClosure.run(chunker, { matrix: E, size: s })).toEqual(result);
  });
  it('Test an array that forms a string of connected vertices', () => {
    const E = [
      [0, 1, 0, 0, 0],
      [1, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1],
      [0, 0, 0, 1, 0]];
    const s = 5;
    const result = [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]];
    expect(transitiveClosure.run(chunker, { matrix: E, size: s })).toEqual(result);
  });
  it('General testing', () => {
    const E = [
      [0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 0]];
    const s = 7;
    const result = [
      [0, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 0, 1, 1],
      [0, 0, 1, 1, 0, 1, 1],
      [0, 0, 1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0, 1, 1],
      [0, 0, 1, 1, 0, 1, 1],
      [0, 0, 1, 1, 0, 1, 1]];
    expect(transitiveClosure.run(chunker, { matrix: E, size: s })).toEqual(result);
  });
});
