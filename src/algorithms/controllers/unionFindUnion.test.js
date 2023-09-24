/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import unionFindUnion from './unionFindUnion';

// simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('Union Find', () => {

  it('union 5-7,8-5,9-8 (FINISH WRITING TEST)', () => {
    // TODO: currently no return value for unionFindUnion.run()
    const unionOps = [[5, 7], [8, 5], [9, 8]];
    const pathCompression = false;
    expect(unionFindUnion.run(chunker, {
      target: {
        arg1: unionOps,
        arg2: pathCompression,
      }
    })).toEqual();
  });

  it('notAtRoot() should return true', () => {
    const parentArr = [0, 1, 2, 2];
    const node = 3;
    expect(unionFindUnion.notAtRoot(chunker, parentArr, node, "n", undefined, undefined, undefined)).toEqual(true);
  });

  it('notAtRoot() should return false', () => {
    const parentArr = [0, 1, 2, 3];
    const node = 3;
    expect(unionFindUnion.notAtRoot(chunker, parentArr, node, "n", undefined, undefined, undefined)).toEqual(false);
  });

});