/* eslint-disable no-undef */
import findBookmark from './findBookmark';

const testPseudocode = {
  P: [
    { code: 'procedure BinaryTreeSearch(needle):', bookmark: 'start', explanation: undefined },
    { code: '  doSomething', bookmark: undefined, explanation: 'abc' },
    { code: '  doSomethingElse', bookmark: 'somethingElse', explanation: 'def' },
    { code: '  moreStuff', bookmark: 'b4', explanation: 'er' },
  ],
};

test('find bookmark on first line', () => {
  expect(findBookmark(testPseudocode.P, { step: 'start', current: null, parent: null })).toEqual(
    { code: 'procedure BinaryTreeSearch(needle):', bookmark: 'start', explanation: undefined },
  );
});

test('find bookmark on later line', () => {
  expect(findBookmark(testPseudocode.P, { step: 'somethingElse', current: null, parent: null })).toEqual(
    { code: '  doSomethingElse', bookmark: 'somethingElse', explanation: 'def' },
  );
});
