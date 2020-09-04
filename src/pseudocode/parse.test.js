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
        code: '\xa0\xa0\xa0\xa0while t not Empty', explanation: '', indentation: 1,
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
        code: '\xa0\xa0\xa0\xa0while t not Empty', explanation: ' We have found a node with the desired key k.', indentation: 1,
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
      code: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0something', explanation: '', indentation: 1,
    }],
    Main: [{
      code: '\xa0\xa0\xa0\xa0Ref thing', explanation: '', indentation: 1, ref: 'Insert',
    }],
  });
});
