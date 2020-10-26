/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */
import binaryTreeSearch from './binaryTreeSearch';
// Simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('binaryTreeSearch', () => {
  // Due to the insertion algorithm, there will be no trees with duplicate values
  it('find successfully', () => {
    // const E = [7, 5, 99, 56, 78];
    const tree = {
      7: { left: 5, right: 99 },
      5: {},
      99: { left: 56 },
      56: { right: 78 },
      78: {},
    };
    const root = 7;
    const target = 78;
    const result = 'success';
    // visualiser.graph.instance.getTree();
    const visualiser = {
      graph: {
        instance: {
          getTree() {
            return tree;
          },
          getRoot() {
            return root;
          },
        },
      },
    };
    expect(binaryTreeSearch.run(chunker, { visualiser, target })).toEqual(result);
  });
  it('fail to find', () => {
    // const E = [7, 5, 99, 56, 78];
    const tree = {
      7: { left: 5, right: 99 },
      5: {},
      99: { left: 56 },
      56: { right: 78 },
      78: {},
    };
    const root = 7;
    const target = 100;
    const result = 'fail';
    // visualiser.graph.instance.getTree();
    const visualiser = {
      graph: {
        instance: {
          getTree() {
            return tree;
          },
          getRoot() {
            return root;
          },
        },
      },
    };
    expect(binaryTreeSearch.run(chunker, { visualiser, target })).toEqual(result);
  });
});
