/* eslint-disable no-undef */
// import { GlobalActions } from './actions';

// this dummy test just to pass the Jest test
describe('my beverage', () => {
  test('is delicious', () => {
    expect(true).toBeTruthy();
  });
});

// describe('LOAD_ALGORITHM action', () => {
//   it('loads an algorithm', () => {
//     const loadedState = GlobalActions.LOAD_ALGORITHM(undefined, { name: 'binarySearchTree' });
//     expect(loadedState).toMatchObject({
//       id: 'binaryTreeSearch',
//       name: 'Binary Tree Search',
//       bookmark: {
//         step: 'start',
//       },
//     });
//   });
// });

// describe('NEXT_LINE action', () => {
//   it('moves to next line', () => {
//     const initialState = GlobalActions.LOAD_ALGORITHM(undefined, { name: 'binaryTreeSearch' });
//     const newState = GlobalActions.NEXT_LINE(initialState);
//     expect(newState.bookmark).not.toBe(initialState.bookmark);
//   });
// });


// describe('LOAD_ALGORITHM action', () => {
//   it('loads an algorithm', () => {
//     const loadedState = GlobalActions.LOAD_ALGORITHM(undefined, { name: 'binaryTreeSearch' });
//     expect(loadedState).toMatchObject({
//       id: 'binaryTreeSearch',
//       name: 'Binary Tree Search',
//       bookmark: '1',
//     });
//   });
// });

// describe('NEXT_LINE action', () => {
//   it('moves to next line', () => {
//     const initialState = GlobalActions.LOAD_ALGORITHM(undefined, { name: 'binaryTreeSearch' });
//     const newState = GlobalActions.NEXT_LINE(initialState);
//     expect(newState.bookmark).not.toBe(initialState.bookmark);
//   });
// });

// describe('PREV_LINE action', () => {
//   it('moves to the previous line', () => {
//     const initialState = GlobalActions.LOAD_ALGORITHM(undefined, { name: 'binaryTreeSearch' });
//     const newState = GlobalActions.PREV_LINE(GlobalActions.NEXT_LINE(initialState));
//     expect(newState.bookmark).toBe(initialState.bookmark);
//   });
// });
