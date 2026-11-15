/* eslint-env jest */

jest.mock('../../context/GlobalState', () => ({}));
jest.mock('../../context/actions', () => ({}));
jest.mock('../../algorithms', () => ({}));

import { radixFromUrl } from './trie';

test('reads the base from the url, defaulting to 2', () => {
  expect(radixFromUrl('10')).toBe(10);
  expect(radixFromUrl('4')).toBe(4);
  expect(radixFromUrl('2')).toBe(2);
  expect(radixFromUrl(undefined)).toBe(2);
  expect(radixFromUrl('7')).toBe(2);
  expect(radixFromUrl('abc')).toBe(2);
});
