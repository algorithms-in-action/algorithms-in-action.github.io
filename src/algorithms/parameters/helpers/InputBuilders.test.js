/* eslint-disable no-undef */
import {
  genUniqueRandSearchList,
  sortAndInterleaveSearches,
  balancedAndInterleaveSearches,
} from './InputBuilders';

describe('genUniqueRandSearchList', () => {
  test('generates two successful searches and one unsuccessful search', () => {
    for (let run = 0; run < 50; run += 1) {
      const operations = genUniqueRandSearchList(12, 1, 100);
      const inserted = new Set();
      let successfulSearches = 0;
      let unsuccessfulSearches = 0;

      operations.forEach((operation) => {
        if (String(operation).startsWith('?')) {
          const value = Number(String(operation).slice(1));
          if (inserted.has(value)) {
            successfulSearches += 1;
          } else {
            unsuccessfulSearches += 1;
          }
        } else {
          inserted.add(operation);
        }
      });

      expect(operations).toHaveLength(15);
      expect(inserted.size).toBe(12);
      expect(successfulSearches).toBe(2);
      expect(unsuccessfulSearches).toBe(1);
    }
  });
});

describe('sortAndInterleaveSearches', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sorts inserts while preserving search order and the original input', () => {
    const operations = ['10', '?10', '-2', '3', '?99'];
    const originalOperations = [...operations];
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const result = sortAndInterleaveSearches(operations);

    expect(result.filter((operation) => !String(operation).startsWith('?')))
      .toEqual(['-2', '3', '10']);
    expect(result.filter((operation) => String(operation).startsWith('?')))
      .toEqual(['?10', '?99']);
    expect(operations).toEqual(originalOperations);
  });

  test('allows searches before the first insert and after the last insert', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValue(0);

    const result = sortAndInterleaveSearches([3, '?3', 1, '?9', 2]);

    expect(result).toEqual(['?3', 1, 2, 3, '?9']);
  });

  test('accepts a comma-separated operation string', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(sortAndInterleaveSearches('4,?4,1'))
      .toEqual(['1', '4', '?4']);
  });
});


describe('balancedAndInterleaveSearches', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('balances inserts while preserving search order and the original input', () => {
    const operations = ['10', '?10', '-2', '3', '?99'];
    const originalOperations = [...operations];

    jest.spyOn(Math, 'random').mockReturnValue(0);

    const result = balancedAndInterleaveSearches(operations);

    expect(result.filter(
      (operation) => !String(operation).startsWith('?')
    )).toEqual([3, -2, 10]);

    expect(result.filter(
      (operation) => String(operation).startsWith('?')
    )).toEqual(['?10', '?99']);

    expect(operations).toEqual(originalOperations);
  });

  test('interleaves searches in their original order with balanced numeric inserts', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValue(0);

    const result = balancedAndInterleaveSearches([
      3, '?3', 1, '?9', 2,
    ]);

    expect(result).toEqual([2, '?3', 1, '?9', 3]);
  });

  test('accepts a comma-separated operation string', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(
      balancedAndInterleaveSearches('4,?4,1')
    ).toEqual([4, '?4', 1]);
  });
});
