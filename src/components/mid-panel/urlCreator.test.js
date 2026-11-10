/* eslint-env jest */
import { createUrl } from './urlCreator';

test.each(['AVLTree', 'binarySearchTree', 'BSTrec'])(
  'shares mixed input for %s without a separate search value', name => {
    const url = new URL(createUrl(`https://example.com/animation/?alg=${name}&mode=search`,
      'Insert/Search', { nodes: ['0', '?0', '-2', '?-2'], searchValue: '99' }));
    expect(url.searchParams.get('mode')).toBe('operations');
    expect(url.searchParams.get('list')).toBe('0,?0,-2,?-2');
    expect(url.searchParams.has('value')).toBe(false);
  },
);

test('preserves other insert/search modules sharing separate values', () => {
  const url = new URL(createUrl('https://example.com/animation/?alg=TTFTree&mode=insertion',
    'Insert/Search', { nodes: [1, 2], searchValue: '2', small: false }));
  expect(url.searchParams.get('mode')).toBe('insertion');
  expect(url.searchParams.get('list')).toBe('1,2');
  expect(url.searchParams.get('value')).toBe('2');
});
