/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import unionFindUnion from './unionFindUnion';
import unionFindFind from './unionFindFind';

// simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('Union Find', () => {
  describe('union', () => {
    it('union 5-7,8-5,9-8', () => {
      const unionOps = [
        [5, 7],
        [8, 5],
        [9, 8],
      ];
      const pathCompression = false;
      expect(
        unionFindUnion.run(chunker, {
          target: {
            arg1: unionOps,
            arg2: pathCompression,
          },
        })
      ).toEqual([1, 2, 3, 4, 7, 6, 7, 7, 7, 10]);
    });

    it('union 5-7,8-5,9-8,3-9,5-2', () => {
      const unionOps = [
        [5, 7],
        [8, 5],
        [9, 8],
        [3, 9],
        [5, 2],
      ];
      const pathCompression = false;
      expect(
        unionFindUnion.run(chunker, {
          target: {
            arg1: unionOps,
            arg2: pathCompression,
          },
        })
      ).toEqual([1, 7, 7, 4, 7, 6, 7, 7, 7, 10]);
    });
  });

  describe('find', () => {
    it('should return root node given the root', () => {
      const parentArr = [0, 1, 2, 3, 4];
      const n = 0;
      const result = unionFindFind.find(
        chunker,
        parentArr,
        n,
        'n',
        null,
        false
      );
      expect(result).toEqual(0);
    });

    it('should return root node given a child', () => {
      const parentArr = [0, 1, 2, 0, 4];
      const n = 3;
      const result = unionFindFind.find(
        chunker,
        parentArr,
        n,
        'n',
        null,
        false
      );
      expect(result).toEqual(0);
    });

    it('should return root node given a grandchild', () => {
      const parentArr = [0, 1, 2, 0, 3];
      const n = 4;
      const result = unionFindFind.find(
        chunker,
        parentArr,
        n,
        'n',
        null,
        false
      );
      expect(result).toEqual(0);
    });
    describe('notAtRoot', () => {
      it('should return true', () => {
        const parentArr = [0, 1, 2, 2];
        const node = 3;
        expect(
          unionFindFind.notAtRoot(
            chunker,
            parentArr,
            node,
            'n',
            undefined,
            undefined,
            undefined
          )
        ).toEqual(true);
      });

      it('should return false', () => {
        const parentArr = [0, 1, 2, 3];
        const node = 3;
        expect(
          unionFindFind.notAtRoot(
            chunker,
            parentArr,
            node,
            'n',
            undefined,
            undefined,
            undefined
          )
        ).toEqual(false);
      });
    });
  });
});
