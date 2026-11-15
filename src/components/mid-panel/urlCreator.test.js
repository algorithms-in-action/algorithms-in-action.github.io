/* eslint-env jest */
import { createUrl } from './urlCreator';

const base = 'https://example.com/animation/';
const context = { nodes: ['5', '7', '?5'], searchValue: [], small: [], radix: '' };

test('adds radix to Insert/Search URLs only when set', () => {
  expect(createUrl(`${base}?alg=trie`, 'Insert/Search', context))
    .toBe(`${base}?alg=trie&list=5,7,?5&value=&smallTable=`);
  expect(createUrl(`${base}?alg=trie`, 'Insert/Search', { ...context, radix: '4' }))
    .toBe(`${base}?alg=trie&list=5,7,?5&value=&smallTable=&radix=4`);
});

test('adds a base 10 radix and leaves it out when cleared', () => {
  expect(createUrl(`${base}?alg=trie`, 'Insert/Search', { ...context, radix: '10' }))
    .toBe(`${base}?alg=trie&list=5,7,?5&value=&smallTable=&radix=10`);
  expect(createUrl(`${base}?alg=bst`, 'Insert/Search', { ...context, radix: '' })).not.toContain('radix');
});

test.each(['AVLTree', 'binarySearchTree', 'BSTrec'])(
  'shares mixed input for %s without a separate search value', name => {
    const url = new URL(createUrl(`${base}?alg=${name}&mode=search`,
      'Insert/Search', { nodes: ['0', '?0', '-2', '?-2'], searchValue: '99' }));
    expect(url.searchParams.get('mode')).toBe('operations');
    expect(url.searchParams.get('list')).toBe('0,?0,-2,?-2');
    expect(url.searchParams.has('value')).toBe(false);
  },
);

test('preserves other insert/search modules sharing separate values', () => {
  const url = new URL(createUrl(`${base}?alg=TTFTree&mode=insertion`,
    'Insert/Search', { nodes: [1, 2], searchValue: '2', small: false }));
  expect(url.searchParams.get('mode')).toBe('insertion');
  expect(url.searchParams.get('list')).toBe('1,2');
  expect(url.searchParams.get('value')).toBe('2');
});