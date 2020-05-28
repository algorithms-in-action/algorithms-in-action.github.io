/* eslint-disable no-undef */
import { GlobalActions } from './actions';

describe('LOAD_ALGORITHM action', () => {
  it('loads an algorithm', () => {
    const loadedState = GlobalActions.LOAD_ALGORITHM(undefined, { name: 'binaryTreeSearch' });
    expect(loadedState).toMatchObject({
      id: 'binaryTreeSearch',
      name: 'Binary Tree Search',
      bookmark: {
        current: null,
        parent: null,
        step: 'start',
      },
    });
  });
});

describe('NEXT_LINE action', () => {
  it('moves to next line', () => {
    const initialState = GlobalActions.LOAD_ALGORITHM(undefined, { name: 'binaryTreeSearch' });
    const newState = GlobalActions.NEXT_LINE(initialState);
    expect(newState.bookmark).not.toBe(initialState.bookmark);
  });
});
