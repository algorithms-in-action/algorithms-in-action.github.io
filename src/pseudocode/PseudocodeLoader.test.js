/* eslint-disable no-undef */
import parse from './PseudocodeLoader';

test('empty pseudocode', () => {
  expect(parse('')).toEqual({});
});

test('single basic procedure', () => {
  expect(parse(`
  procedure BinaryTreeSearch(needle):
    doSomething
    doSomethingElse`)).toEqual({
    BinaryTreeSearch: [
      { code: 'doSomething' },
      { code: 'doSomethingElse' },
    ],
  });
});

test('single procedure with bookmarks', () => {
  expect(parse(`
  procedure BinaryTreeSearch(needle):
    doSomething $something
    doSomethingElse    $somethingElse`)).toEqual({
    BinaryTreeSearch: [
      { code: 'doSomething', bookmark: 'something' },
      { code: 'doSomethingElse', bookmark: 'somethingElse' },
    ],
  });
});

test('single procedure with explanation', () => {
  expect(parse(`
  procedure BinaryTreeSearch(needle):
    doSomething $something (* abc *)
    doSomethingElse    $somethingElse    (* def *)`)).toEqual({
    BinaryTreeSearch: [
      { code: 'doSomething', bookmark: 'something', explanation: 'abc' },
      { code: 'doSomethingElse', bookmark: 'somethingElse', explanation: 'def' },
    ],
  });
});

test('multi-line explanation', () => {
  expect(parse(`
  procedure BinaryTreeSearch(needle):
    doSomething $something (* abc 
      def
      ghi *)
    doSomethingElse    $somethingElse`)).toEqual({
    BinaryTreeSearch: [
      { code: 'doSomething', bookmark: 'something', explanation: 'abc def ghi' },
      { code: 'doSomethingElse', bookmark: 'somethingElse' },
    ],
  });
});
