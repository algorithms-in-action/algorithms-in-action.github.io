/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import AVLTreeInsertion from './AVLTreeInsertion';

// Simple stub for the chunker
const chunker = {
  add: () => { },
};

describe('AVLTreeInsertion', () => {
  it('[Simple] No rotation', () => {
    const E = [10, 5, 15];
    const result = {
      10: { "height": 2, "left": 5, "right": 15, "par": null },
      5: { "height": 1, "left": null, "par": 10, "right": null },
      15: { "height": 1, "left": null, "par": 10, "right": null }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
});
