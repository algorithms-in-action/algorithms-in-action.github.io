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
  it('[Complex] Complex rotates 1', () => {
    const E = [4, 5, 7, 9, 8];
    const result = {
      4: { "height": 1, "left": null, "right": null, "par": 5 },
      5: { "height": 3, "left": 4, "right": 8, "par": null },
      7: { "height": 1, "left": null, "right": null, "par": 8 },
      9: { "height": 1, "left": null, "right": null, "par": 8 },
      8: { "height": 2, "left": 7, "right": 9, "par": 5 }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Complex] Complex rotates 2', () => {
    const E = [40, 20, 60, 10, 30, 50, 70, 25, 5, 35, 15, 55, 65];
    const result = {
      40: { "height": 4, "left": 20, "right": 60, "par": null },
      20: { "height": 3, "left": 10, "right": 30, "par": 40 },
      60: { "height": 3, "left": 50, "right": 70, "par": 40 },
      10: { "height": 2, "left": 5, "right": 15, "par": 20 },
      30: { "height": 2, "left": 25, "right": 35, "par": 20 },
      50: { "height": 2, "left": null, "right": 55, "par": 60 },
      70: { "height": 2, "left": 65, "right": null, "par": 60 },
      5: { "height": 1, "left": null, "right": null, "par": 10 },
      15: { "height": 1, "left": null, "right": null, "par": 10 },
      25: { "height": 1, "left": null, "right": null, "par": 30 },
      35: { "height": 1, "left": null, "right": null, "par": 30 },
      55: { "height": 1, "left": null, "right": null, "par": 50 },
      65: { "height": 1, "left": null, "right": null, "par": 70 }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Complex] Complex rotates 3', () => {
    const E = [50, 30, 70, 20, 40, 60, 80, 35, 10, 45, 25, 65, 75, 58];
    const result = {
      50: { "height": 4, "left": 30, "right": 70, "par": null },
      30: { "height": 3, "left": 20, "right": 40, "par": 50 },
      70: { "height": 3, "left": 60, "right": 80, "par": 50 },
      20: { "height": 2, "left": 10, "right": 25, "par": 30 },
      40: { "height": 2, "left": 35, "right": 45, "par": 30 },
      60: { "height": 2, "left": 58, "right": 65, "par": 70 },
      80: { "height": 2, "left": 75, "right": null, "par": 70 },
      10: { "height": 1, "left": null, "right": null, "par": 20 },
      25: { "height": 1, "left": null, "right": null, "par": 20 },
      35: { "height": 1, "left": null, "right": null, "par": 40 },
      45: { "height": 1, "left": null, "right": null, "par": 40 },
      58: { "height": 1, "left": null, "right": null, "par": 60 },
      65: { "height": 1, "left": null, "right": null, "par": 60 },
      75: { "height": 1, "left": null, "right": null, "par": 80 }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Complex] Complex rotates 4', () => {
    const E = [135, 54, 121, 29, 71, 12, 199, 64, 102, 36, 85, 144, 168, 211, 175, 307, 2, 73, 56, 27];
    const result = {
      71: { "height": 5, "left": 29, "right": 168, "par": null },
      54: { "height": 3, "left": 36, "right": 64, "par": 29 },
      168: { "height": 4, "left": 121, "right": 199, "par": 71 },
      29: { "height": 4, "left": 12, "right": 54, "par": 71 },
      121: { "height": 3, "left": 85, "right": 144, "par": 168 },
      199: { "height": 3, "left": 175, "right": 211, "par": 168 },
      12: { "height": 2, "left": 2, "right": 27, "par": 29 },
      36: { "height": 1, "left": null, "right": null, "par": 54 },
      64: { "height": 2, "left": 56, "right": null, "par": 54 },
      85: { "height": 2, "left": 73, "right": 102, "par": 121 },
      144: { "height": 2, "left": 135, "right": null, "par": 121 },
      175: { "height": 1, "left": null, "right": null, "par": 199 },
      211: { "height": 2, "left": null, "right": 307, "par": 199 },
      2: { "height": 1, "left": null, "right": null, "par": 12 },
      27: { "height": 1, "left": null, "right": null, "par": 12 },
      56: { "height": 1, "left": null, "right": null, "par": 64 },
      73: { "height": 1, "left": null, "right": null, "par": 85 },
      102: { "height": 1, "left": null, "right": null, "par": 85 },
      135: { "height": 1, "left": null, "right": null, "par": 144 },
      307: { "height": 1, "left": null, "right": null, "par": 211 }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
});
