/* eslint-disable no-undef */

import trieInsertion from '../trieInsertion';

const statusesFor = (operations) => {
  const vis = Object.fromEntries(Object.entries(trieInsertion.initVisualisers())
    .map(([name, visualiser]) => [name, visualiser.instance]));
  const statuses = [];
  trieInsertion.run({
    add: (bookmark, callback, args = []) => {
      if (callback) callback(vis, ...args);
      if (statuses[statuses.length - 1] !== vis.mask.pointerStatus) statuses.push(vis.mask.pointerStatus);
    },
  }, { operations });
  return statuses;
};

test('searches the trie as built so far', () => {
  const statuses = statusesFor([
    { type: 'search', value: 5 },
    { type: 'insert', value: 5 },
    { type: 'insert', value: 7 },
    { type: 'search', value: 5 },
    { type: 'search', value: 4 },
    { type: 'search', value: 1 },
  ]);
  const ends = statuses.filter(status => /^(Found|Not found|Inserted)/.test(status));
  // 4 (100) shares the path to 5 (101) but was never inserted;
  // 1 (001) has no 0 child under the root.
  expect(ends).toEqual(['Not found: 5', 'Inserted: 5', 'Inserted: 7', 'Found: 5', 'Not found: 4', 'Not found: 1']);
});

test('still accepts a plain insert list', () => {
  expect(statusesFor(undefined)).toEqual(expect.any(Array));
  const root = trieInsertion.run({ add: () => {} }, { nodes: [5, 7] });
  expect(Object.keys(root.children)).toEqual(['1']);
});

test('handles duplicate inserts and repeated searches', () => {
  const statuses = statusesFor([
    { type: 'insert', value: 5 },
    { type: 'insert', value: 5 },
    { type: 'search', value: 5 },
    { type: 'search', value: 5 },
  ]);
  const ends = statuses.filter(status => /^(Found|Not found|Inserted|Already)/.test(status));
  expect(ends).toEqual(['Inserted: 5', 'Already inserted: 5', 'Found: 5', 'Found: 5']);
});
