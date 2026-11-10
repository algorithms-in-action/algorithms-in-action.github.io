/* eslint-disable no-undef */

import dstInsertion from '../dstInsertion';

const chunker = { add: () => {} };

test('builds a digital search tree', () => {
  expect(
    dstInsertion.run(chunker, { nodes: [1, 19, 5, 3] })
  ).toEqual({
    1: { left: 5, right: 19 },
    5: { left: 3 },
    19: {},
    3: {},
  });
});

test('shows the current key and mask bit while traversing', () => {
  const visualisers = dstInsertion.initVisualisers();
  const vis = Object.fromEntries(
    Object.entries(visualisers).map(([name, visualiser]) => [
      name,
      visualiser.instance,
    ])
  );
  const animationChunker = {
    add: (bookmark, callback, args = []) => callback && callback(vis, ...args),
  };

  dstInsertion.run(animationChunker, { nodes: [1, 19, 5, 3] });
  const { mask } = vis;

  expect({
    maxBits: mask && mask.maxBits,
    key: mask && mask.binaryData,
    mask: mask && mask.maskData,
    highlightedBit: mask && mask.highlight,
  }).toEqual({
    maxBits: 5,
    key: 3,
    mask: 8,
    highlightedBit: [3],
  });
});
