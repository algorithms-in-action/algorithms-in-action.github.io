/* eslint-disable no-undef */
import { findBookmarkInProcedure, findFirstBookmarkInProcedure } from './utils';

const testPseudocode = {
  P: [
    { code: 'procedure BinaryTreeSearch(needle):', bookmark: 'start', explanation: undefined },
    { code: '  doSomething', bookmark: undefined, explanation: 'abc' },
    { code: '  doSomethingElse', bookmark: 'somethingElse', explanation: 'def' },
    { code: '  moreStuff', bookmark: 'b4', explanation: 'er' },
  ],
};

test('find bookmark on first line', () => {
  expect(findBookmarkInProcedure(testPseudocode.P, 'start')).toEqual(
    { code: 'procedure BinaryTreeSearch(needle):', bookmark: 'start', explanation: undefined },
  );
});

test('find bookmark on later line', () => {
  expect(findBookmarkInProcedure(testPseudocode.P, 'somethingElse')).toEqual(
    { code: '  doSomethingElse', bookmark: 'somethingElse', explanation: 'def' },
  );
});

test('find first bookmark', () => {
  expect(findFirstBookmarkInProcedure(testPseudocode.P)).toEqual('start');
});
