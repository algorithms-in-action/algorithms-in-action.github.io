/* eslint-disable no-undef */

import parse from './parse';

// When Input is Empty
test('empty pseudocode', () => {
  expect(parse('')).toEqual({});
});

// Test signle basic parse
test('single basic procedure', () => {
  expect(parse(`
  \\Code{
  Main
  \\In{
      while t not Empty
  \\In}
  \\Code}
`)).toEqual(
    {
      Main: [{
        bookmark: 1, code: 'while t not Empty', explanation: '', indentation: 1, ref: '', refBookmark: 0,
      }],
    },
  );
});

// Test whether explanation function can work well
test('procedure with explanation', () => {
  expect(parse(`
  \\Code{
  Main
  \\In{
      while t not Empty
      \\Expl{  We have found a node with the desired key k.
      \\Expl}
  \\In}
  \\Code}
`)).toEqual(
    {
      Main: [{
        bookmark: 1, code: 'while t not Empty', explanation: ' We have found a node with the desired key k.', indentation: 1, ref: '', refBookmark: 0,
      }],
    },
  );
});

// Test whether Ref function can work well.
test('procedure with ref', () => {
  expect(parse(`
  \\Code{
    Main
    \\In{
        Ref thing \\Ref Insert
    \\In}
    \\Code}
  \\Code{
    Insert
    \\In{
        something                                              
    \\In}
    \\Code}
`)).toEqual({
    Insert: [{
      bookmark: 2, code: 'something', explanation: '', indentation: 2, ref: '', refBookmark: 1,
    }],
    Main: [{
      bookmark: 1, code: 'Ref thing', explanation: '', indentation: 1, ref: 'Insert', refBookmark: 0,
    }],
  });
});
