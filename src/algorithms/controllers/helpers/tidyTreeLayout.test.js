/* eslint-disable no-undef */

import { createTidyTreeLayout } from './tidyTreeLayout';

test('creates a centred, separated layout while preserving child direction', () => {
  const tree = {
    A: { left: 'B', right: 'C' },
    B: { left: 'D', right: 'E' },
    C: { left: 'F', right: 'G' },
    D: { left: 'H' },
    E: {},
    F: {},
    G: {},
    H: {},
  };

  const positions = createTidyTreeLayout({
    root: 'A',
    getId: node => node,
    getLeft: node => tree[node].left,
    getRight: node => tree[node].right,
    nodeGap: 100,
    singleChildOffset: 60,
    levelGap: 80,
    rootX: 10,
    rootY: 20,
  });

  expect(positions.size).toBe(8);
  expect(positions.get('A')).toEqual({ x: 10, y: 20 });
  expect(positions.get('A').x).toBe(
    (positions.get('B').x + positions.get('C').x) / 2,
  );
  expect(positions.get('H').x).toBeLessThan(positions.get('D').x);

  const nodesByRow = {};
  positions.forEach(({ x, y }) => {
    nodesByRow[y] = [...(nodesByRow[y] || []), x];
  });
  Object.values(nodesByRow).forEach((row) => {
    row.sort((a, b) => a - b);
    for (let i = 1; i < row.length; i++) {
      expect(row[i] - row[i - 1]).toBeGreaterThanOrEqual(100);
    }
  });
});
