/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import { LARGE_TABLE, SMALL_TABLE } from '../HashingCommon';
import HashingInsertion from '../HashingInsertion';

// Simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('HashingInsertion', () => {
  // Test cases for Linear Probing
  it('LP insert small table', () => {
    const input = [42, 87, 16, 59, 23, 74, 31, 5, 68, 90];
    const result = ["x", 59, 74, 23, 16, 42, 31, 5, 87, 68, 90];
    expect(HashingInsertion.run(chunker, { values: input.map(Number), hashSize: SMALL_TABLE, name: "HashingLP" })).toEqual(result);
  });
  it('LP insert with duplicates', () => {
    const input = [14, 62, 14, 33, 57, 62, 85, 33];
    const result = [14, 33, 62, 85, 33, "x", 57, "x", "x", 14, 62];
    expect(HashingInsertion.run(chunker, { values: input.map(Number), hashSize: SMALL_TABLE, name: "HashingLP" })).toEqual(result);
  });
  it('LP insert large table', () => {
    const input = [1, 57, 84, 39, 12, 93, 66, 2, 48, 76, 35, 26, 49, 19, 87, 73, 62, 28, 17, 8, 94, 33, 70, 30, 11, 45, 38, 81, 15, 5, 60, 46, 32, 88, 27, 86, 69, 3, 54, 24, 77, 22, 72, 91, 41, 78, 25, 90, 34, 44, 52, 130, 196, 14, 23, 31, 42, 125];
    const result = ["x", "x", 72, 11, "x", "x", 22, "x", 94, 33, 69, 8, 44, 130, 19, "x", 91, 30, 66, 5, 41, 77, "x", 52, 88, 27, "x", 2, 38, 196, "x", 49, "x", 24, 60, "x", 35, "x", "x", 46, "x", "x", 57, 93, 32, "x", "x", "x", "x", "x", 54, 90, "x", "x", "x", "x", 76, 15, "x", 87, 26, 62, 1, "x", 73, 12, 48, 84, 23, "x", "x", 34, 70, "x", 45, 81, "x", "x", "x", 31, "x", "x", 42, 78, 17, "x", "x", 28, 125, 3, 39, "x", 14, "x", 86, 25, "x"];
    expect(HashingInsertion.run(chunker, { values: input.map(Number), hashSize: LARGE_TABLE, name: "HashingLP" })).toEqual(result);
  });

  // Test cases for Double Hashing
  it('DH insert small table', () => {
    const input = [42, 87, 16, 59, 23, 74, 31, 5, 68, 90];
    const result = ["x", 59, 74, 23, 16, 42, 68, 31, 87, 90, 5];
    expect(HashingInsertion.run(chunker, { values: input.map(Number), hashSize: SMALL_TABLE, name: "HashingDH" })).toEqual(result);
  });
  it('DH insert with duplicates', () => {
    const input = [14, 62, 14, 33, 57, 62, 85, 33];
    const result = [33, 14, 62, 33, 85, "x", 57, "x", "x", 14, 62];
    expect(HashingInsertion.run(chunker, { values: input.map(Number), hashSize: SMALL_TABLE, name: "HashingDH" })).toEqual(result);
  });
  it('DH insert large table', () => {
    const input = [36, 142, 89, 167, 19, 77, 58, 145, 5, 200, 123, 88, 2, 75, 113, 39, 51, 27, 171, 18, 96, 156, 106, 173, 94, 84, 24, 66, 174, 95, 11, 101, 4, 97, 186, 34, 120, 65, 137, 35, 143, 54, 33, 22, 93, 74, 181, 1, 16, 12, 59, 31, 178, 8, 61, 10, 128, 179];
    const result = [97, 36, "x", 11, "x", "x", 22, 58, 94, 33, "x", 8, "x", "x", 19, "x", 128, "x", 66, 5, "x", 77, 113, 59, 88, 27, "x", 2, 16, 171, "x", 24, "x", "x", "x", 96, 35, "x", 174, 143, 179, "x", "x", 93, "x", 74, 10, "x", "x", 18, 54, "x", "x", 65, 101, 137, 173, "x", 51, "x", 123, "x", 1, "x", "x", 12, 145, 84, 120, 156, 95, 34, 167, 106, 142, 178, "x", "x", "x", 31, 4, 200, 181, "x", "x", "x", 89, "x", "x", "x", 39, 75, "x", 186, "x", "x", 61];
    expect(HashingInsertion.run(chunker, { values: input.map(Number), hashSize: LARGE_TABLE, name: "HashingDH" })).toEqual(result);
  });
});
