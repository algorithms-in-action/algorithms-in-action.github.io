/**
 * The purpose of the test here is to detect whether the correct BST structure is generated
 * under various insertion orders. It checks for unbalanced, skewed tree structures based on the input.
 */

/* eslint-disable no-undef */

import BSTrec from '../BSTrecInsertion';

// Simple stub for the chunker
const chunker = {
  add: () => { },
};

describe('BSTrec', () => {
  it('insert a simple tree from balanced-style input', () => {
    const E = [10, 5, 15];
    const result = {
      key: 10,
      left: {
        key: 5,
        left: null,
        right: null,
      },
      right: {
        key: 15,
        left: null,
        right: null,
      },
    };
    expect(BSTrec.run(chunker, { nodes: E })).toEqual(result);
  });

  it('insert a right-skewed tree from ordered input', () => {
    const E = [1, 2, 3];
    const result = {
      key: 1,
      left: null,
      right: {
        key: 2,
        left: null,
        right: {
          key: 3,
          left: null,
          right: null,
        },
      },
    };
    expect(BSTrec.run(chunker, { nodes: E })).toEqual(result);
  });

  it('insert a left-skewed tree from reverse-ordered input', () => {
    const E = [3, 2, 1];
    const result = {
      key: 3,
      left: {
        key: 2,
        left: {
          key: 1,
          left: null,
          right: null,
        },
        right: null,
      },
      right: null,
    };
    expect(BSTrec.run(chunker, { nodes: E })).toEqual(result);
  });

  it('insert a (LR) insertion pattern correctly', () => {
    const E = [3, 1, 2];
    const result = {
      key: 3,
      left: {
        key: 1,
        left: null,
        right: {
          key: 2,
          left: null,
          right: null,
        },
      },
      right: null,
    };
    expect(BSTrec.run(chunker, { nodes: E })).toEqual(result);
  });
});