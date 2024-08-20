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
  // Simple rotation: only envolves one rotate
  it('[Simple] No rotation', () => {
    const E = [10, 5, 15];
    const result = {
      10: { "height": 2, "left": 5, "right": 15, "par": null },
      5: { "height": 1, "left": null, "par": 10, "right": null },
      15: { "height": 1, "left": null, "par": 10, "right": null }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Simple] Single left rotate', () => {
    const E = [1, 2, 3];
    const result = {
      1: { "height": 1, "left": null, "right": null, "par": 2 },
      2: { "height": 2, "left": 1, "right": 3, "par": null },
      3: { "height": 1, "left": null, "right": null, "par": 2 }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Simple] Single right rotate', () => {
    const E = [3, 2, 1];
    const result = {
      1: { "height": 1, "left": null, "right": null, "par": 2 },
      2: { "height": 2, "left": 1, "right": 3, "par": null },
      3: { "height": 1, "left": null, "right": null, "par": 2 }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Simple] Single LR rotate', () => {
    const E = [3, 1, 2];
    const result = {
      1: { "height": 1, "left": null, "right": null, "par": 2 },
      2: { "height": 2, "left": 1, "right": 3, "par": null },
      3: { "height": 1, "left": null, "right": null, "par": 2 }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Simple] Single RL rotate', () => {
    const E = [1, 3, 2];
    const result = {
      1: { "height": 1, "left": null, "right": null, "par": 2 },
      2: { "height": 2, "left": 1, "right": 3, "par": null },
      3: { "height": 1, "left": null, "right": null, "par": 2 }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
});
