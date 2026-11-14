/* eslint-disable no-undef */

import dstInsertion from '../dstInsertion';

const chunker = { add: () => {} };

test('shows an empty pointer before the insertion point for either child, then reports the insert', () => {
  const vis = Object.fromEntries(Object.entries(dstInsertion.initVisualisers())
    .map(([name, visualiser]) => [name, visualiser.instance]));
  const frames = [];
  dstInsertion.run({
    add: (bookmark, callback, args = []) => {
      if (callback) callback(vis, ...args);
      frames.push({ bookmark, status: vis.mask.pointerStatus, count: vis.graph.nodes.length });
    },
  }, { nodes: [13, 4, 20, 4] });

  for (const [bookmark, count] of [[16, 1], [17, 2]]) {
    const empty = frames.findIndex(frame => frame.bookmark === bookmark && frame.count === count);
    expect(frames[empty].status).toBe('c = Empty');
    expect(frames[empty + 1]).toEqual({ bookmark: 18, status: 'Insertion point found', count });
    expect(frames[empty + 3].status).toBe(`Inserted: ${[4, 20][count - 1]}`);
    expect(frames[empty + 3].count).toBe(count + 1);
  }
  expect(frames[frames.length - 1].status).toBe('Already inserted: 4');
});

test('shows tree status text in the mask table instead of the graph title', () => {
  const vis = Object.fromEntries(Object.entries(dstInsertion.initVisualisers())
    .map(([name, visualiser]) => [name, visualiser.instance]));
  const statuses = [];
  dstInsertion.run({
    add: (bookmark, callback, args = []) => {
      if (callback) callback(vis, ...args);
      if (statuses[statuses.length - 1] !== vis.mask.pointerStatus) statuses.push(vis.mask.pointerStatus);
    },
  }, { nodes: [13, 4] });

  expect(statuses.slice(0, 4)).toEqual(['', 'Tree is empty', 'Insert: 13', 'Inserted: 13']);
  expect(statuses).toContain('Insert: 4');
  expect(statuses[statuses.length - 1]).toBe('Inserted: 4');
});

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

const statusesFor = (controller, input) => {
  const vis = Object.fromEntries(Object.entries(controller.initVisualisers())
    .map(([name, visualiser]) => [name, visualiser.instance]));
  const statuses = [];
  controller.run({
    add: (bookmark, callback, args = []) => {
      if (callback) callback(vis, ...args);
      if (statuses[statuses.length - 1] !== vis.mask.pointerStatus) statuses.push(vis.mask.pointerStatus);
    },
  }, input);
  return statuses;
};

test('runs insert & search operations in order', () => {
  const operations = [
    { type: 'search', value: 5 },
    { type: 'insert', value: 13 },
    { type: 'insert', value: 4 },
    { type: 'search', value: 4 },
    { type: 'search', value: 20 },
  ];
  const statuses = statusesFor(dstInsertion, { operations });
  const order = ['Search: 5', 'Not found: 5', 'Insert: 13', 'Inserted: 13',
    'Insert: 4', 'Inserted: 4', 'Search: 4', 'Found: 4', 'Search: 20', 'Not found: 20'];
  expect(order.map(status => statuses.indexOf(status)))
    .toEqual([...order.map(status => statuses.indexOf(status))].sort((a, b) => a - b));
  expect(order.every(status => statuses.includes(status))).toBe(true);
  expect(dstInsertion.run(chunker, { operations })).toEqual({ 13: { left: 4 }, 4: {} });
});

test('handles duplicate inserts and repeated searches', () => {
  const operations = [
    { type: 'insert', value: 13 },
    { type: 'insert', value: 13 },
    { type: 'search', value: 13 },
    { type: 'search', value: 13 },
  ];
  const statuses = statusesFor(dstInsertion, { operations });
  expect(statuses.filter(status => status === 'Found: 13')).toHaveLength(2);
  expect(statuses.filter(status => /^Search: 13/.test(status)).length).toBeGreaterThan(0);
  expect(dstInsertion.run(chunker, { operations })).toEqual({ 13: {} });
});
