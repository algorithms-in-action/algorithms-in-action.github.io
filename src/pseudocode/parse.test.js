/* eslint-disable no-undef */
import parse from './parse';

test('empty pseudocode', () => {
  expect(parse('')).toEqual({});
});

test('single basic procedure', () => {
  expect(parse(`procedure BinaryTreeSearch(needle):
  doSomething
  doSomethingElse`)).toEqual({
    BinaryTreeSearch: [
      { code: 'procedure BinaryTreeSearch(needle):', bookmark: undefined, explanation: undefined },
      { code: '  doSomething', bookmark: undefined, explanation: undefined },
      { code: '  doSomethingElse', bookmark: undefined, explanation: undefined },
    ],
  });
});

test('single procedure with bookmarks', () => {
  expect(parse(`procedure BinaryTreeSearch(needle):
  doSomething $something
  doSomethingElse    $somethingElse`)).toEqual({
    BinaryTreeSearch: [
      { code: 'procedure BinaryTreeSearch(needle):', bookmark: undefined, explanation: undefined },
      { code: '  doSomething', bookmark: 'something', explanation: undefined },
      { code: '  doSomethingElse', bookmark: 'somethingElse', explanation: undefined },
    ],
  });
});

test('single procedure with explanation', () => {
  expect(parse(`procedure BinaryTreeSearch(needle):
  doSomething $something (* abc *)
  doSomethingElse    $somethingElse    (* def *)`)).toEqual({
    BinaryTreeSearch: [
      { code: 'procedure BinaryTreeSearch(needle):', bookmark: undefined, explanation: undefined },
      { code: '  doSomething', bookmark: 'something', explanation: 'abc' },
      { code: '  doSomethingElse', bookmark: 'somethingElse', explanation: 'def' },
    ],
  });
});

test('multi-line explanation', () => {
  expect(parse(`procedure BinaryTreeSearch(needle):
  doSomething $something (* abc 
    def
    ghi *)
  doSomethingElse    $somethingElse`)).toEqual({
    BinaryTreeSearch: [
      { code: 'procedure BinaryTreeSearch(needle):', bookmark: undefined, explanation: undefined },
      { code: '  doSomething', bookmark: 'something', explanation: 'abc def ghi' },
      { code: '  doSomethingElse', bookmark: 'somethingElse', explanation: undefined },
    ],
  });
});
