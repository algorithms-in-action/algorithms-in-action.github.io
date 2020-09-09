/* eslint-disable no-undef */

import Prim from './actualPrim';

test('Prim_1', () => {
  const E = [null,
    [null, 0, 2, 6, 0, 0],
    [null, 2, 0, 6, 5, 7],
    [null, 6, 6, 0, 1, 4],
    [null, 0, 5, 1, 0, 3],
    [null, 0, 7, 4, 3, 0]];
  const vertex = 5;
  expect(Prim(E, vertex)).toEqual([undefined, 0, 1, 4, 2, 4,
    undefined, undefined, undefined, undefined]);
});

test('Prim_2', () => {
  const E = [null,
    [null, 0, 3, 5, 7, 6, 0],
    [null, 3, 0, 1, 0, 0, 0],
    [null, 5, 1, 0, 0, 0, 0],
    [null, 7, 0, 0, 0, 4, 2],
    [null, 6, 0, 0, 4, 0, 0],
    [null, 0, 0, 0, 2, 0, 0]];
  const vertex = 6;
  expect(Prim(E, vertex)).toEqual([undefined, 0, 1, 2, 5, 1, 4,
    undefined, undefined, undefined]);
});
