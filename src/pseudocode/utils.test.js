/* eslint-disable no-undef */
import { findBookmarkInProcedure, findFirstBookmarkInProcedure, nextBookmark } from './utils';

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

test('immediate next bookmark', () => {
  expect(nextBookmark(testPseudocode.P, 'somethingElse')).toEqual('b4');
});

test('separated next bookmark', () => {
  expect(nextBookmark(testPseudocode.P, 'start')).toEqual('somethingElse');
});
