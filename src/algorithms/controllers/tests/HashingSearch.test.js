/*
The purpose of the test here is to detect whether the correct result is generated
*/

/* eslint-disable no-undef */

import { LARGE_SIZE, SMALL_SIZE } from '../HashingCommon';
import HashingInsertion from '../HashingInsertion';
import HashingSearch from '../HashingSearch';

// Simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('HashingSearch', () => {
    // Search tests for Linear Probing
  it('Search small table found LP', () => {
    const arr = ["x", 59, 74, 23, 16, 42, 31, 5, 87, 68, 90];
    const target = 16;
    const found = true;
    const hashSize = SMALL_SIZE;
    const visualisers = {
        array: {
            instance: {
              extractArray(row = [1], empty = "x") {
                return arr;
              }
            },
          },
    };
    expect(HashingSearch.run(chunker, { name: "HashingLP", visualisers, target, hashSize })).toEqual(found);
  });
  it('Search small table not found LP', () => {
    const arr = ["x", 59, 74, 23, 16, 42, 31, 5, 87, 68, 90];
    const target = 20;
    const found = false;
    const hashSize = SMALL_SIZE;
    const visualisers = {
        array: {
            instance: {
              extractArray(row = [1], empty = "x") {
                return arr;
              }
            },
          },
    };
    expect(HashingSearch.run(chunker, { name: "HashingLP", visualisers, target, hashSize })).toEqual(found);
  });
  it('Search with duplicates LP', () => {
    const arr = [14, 33, 62, 85, 33, "x", 57, "x", "x", 14, 62];
    const target = 33;
    const found = true;
    const hashSize = SMALL_SIZE;
    const visualisers = {
        array: {
            instance: {
              extractArray(row = [1], empty = "x") {
                return arr;
              }
            },
          },
    };
    expect(HashingSearch.run(chunker, { name: "HashingLP", visualisers, target, hashSize })).toEqual(found);
  });
  it('Search large table LP', () => {
    const arr = ["x", "x", 72, 11, "x", "x", 22, "x", 94, 33, 69, 8, 44, 130, 19, "x", 91, 30, 66, 5, 41, 77, "x", 52, 88, 27, "x", 2, 38, 196, "x", 49, "x", 24, 60, "x", 35, "x", "x", 46, "x", "x", 57, 93, 32, "x", "x", "x", "x", "x", 54, 90, "x", "x", "x", "x", 76, 15, "x", 87, 26, 62, 1, "x", 73, 12, 48, 84, 23, "x", "x", 34, 70, "x", 45, 81, "x", "x", "x", 31, "x", "x", 42, 78, 17, "x", "x", 28, 125, 3, 39, "x", 14, "x", 86, 25, "x"];
    const target = 66;
    const found = true;
    const hashSize = LARGE_SIZE;
    const visualisers = {
        array: {
            instance: {
              extractArray(row = [1], empty = "x") {
                return arr;
              }
            },
          },
    };
    expect(HashingSearch.run(chunker, { name: "HashingLP", visualisers, target, hashSize })).toEqual(found);
  });

  // Search tests for Double Hashing
  it('Search small table found DH', () => {
    const arr = ["x", 59, 74, 23, 16, 42, 68, 31, 87, 90, 5];
    const target = 16;
    const found = true;
    const hashSize = SMALL_SIZE;
    const visualisers = {
        array: {
            instance: {
              extractArray(row = [1], empty = "x") {
                return arr;
              }
            },
          },
    };
    expect(HashingSearch.run(chunker, { name: "HashingDH", visualisers, target, hashSize })).toEqual(found);
  });
  it('Search small table not found DH', () => {
    const arr = ["x", 59, 74, 23, 16, 42, 68, 31, 87, 90, 5];
    const target = 20;
    const found = false;
    const hashSize = SMALL_SIZE;
    const visualisers = {
        array: {
            instance: {
              extractArray(row = [1], empty = "x") {
                return arr;
              }
            },
          },
    };
    expect(HashingSearch.run(chunker, { name: "HashingDH", visualisers, target, hashSize })).toEqual(found);
  });
  it('Search with duplicates DH', () => {
    const arr = [33, 14, 62, 33, 85, "x", 57, "x", "x", 14, 62];
    const target = 33;
    const found = true;
    const hashSize = SMALL_SIZE;
    const visualisers = {
        array: {
            instance: {
              extractArray(row = [1], empty = "x") {
                return arr;
              }
            },
          },
    };
    expect(HashingSearch.run(chunker, { name: "HashingDH", visualisers, target, hashSize })).toEqual(found);
  });
  it('Search large table DH', () => {
    const arr = [97, 36, "x", 11, "x", "x", 22, 58, 94, 33, "x", 8, "x", "x", 19, "x", 128, "x", 66, 5, "x", 77, 113, 59, 88, 27, "x", 2, 16, 171, "x", 24, "x", "x", "x", 96, 35, "x", 174, 143, 179, "x", "x", 93, "x", 74, 10, "x", "x", 18, 54, "x", "x", 65, 101, 137, 173, "x", 51, "x", 123, "x", 1, "x", "x", 12, 145, 84, 120, 156, 95, 34, 167, 106, 142, 178, "x", "x", "x", 31, 4, 200, 181, "x", "x", "x", 89, "x", "x", "x", 39, 75, "x", 186, "x", "x", 61];
    const target = 66;
    const found = true;
    const hashSize = LARGE_SIZE;
    const visualisers = {
        array: {
            instance: {
              extractArray(row = [1], empty = "x") {
                return arr;
              }
            },
          },
    };
    expect(HashingSearch.run(chunker, { name: "HashingDH", visualisers, target, hashSize })).toEqual(found);
  });
});
