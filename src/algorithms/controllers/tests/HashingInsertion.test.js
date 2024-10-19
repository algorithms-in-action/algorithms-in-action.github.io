/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import { LARGE_SIZE, SMALL_SIZE } from '../HashingCommon';
import HashingInsertion from '../HashingInsertion';

// Simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('HashingInsertion', () => {
  // Test cases for Linear Probing
  it('LP insert small table', () => {
    const input = ["42", "87", "16", "59", "23", "74", "31", "5", "68", "90"];
    const result = [undefined, 59, 74, 23, 16, 42, 31, 5, 87, 68, 90];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingLP" })).toEqual(result);
  });
  it('LP insert with duplicates', () => {
    const input = ["14", "62", "14", "33", "57", "62", "85", "33"];
    const result = [33, undefined, 85, undefined, undefined, undefined, 57, undefined, undefined, 14, 62];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingLP" })).toEqual(result);
  });
  it('LP insert with bulk insert', () => {
    const input = ["14", "2-6-2", "8-10", "3"];
    const result = [undefined, 4, 8, undefined, undefined, 9, 2, 6, 10, 14, 3];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingLP" })).toEqual(result);
  });
  it('LP insert large table', () => {
    const input = ["1", "57", "84", "39", "12", "93", "66", "2", "48", "76", "35", "26", "49", "19", "87", "73", "62", "28", "17", "8", "94", "33", "70", "30", "11", "45", "38", "81", "15", "5", "60", "46", "32", "88", "27", "86", "69", "3", "54", "24", "77", "22", "72", "91", "41", "78", "25", "90", "34", "44", "52", "130", "196", "14", "23", "31", "42", "125"];
    const result = [undefined, undefined, 72, 11, undefined, undefined, 22, undefined, 94, 33, 69, 8, 44, 130, 19, undefined, 91, 30, 66, 5, 41, 77, undefined, 52, 88, 27, undefined, 2, 38, 196, undefined, 49, undefined, 24, 60, undefined, 35, undefined, undefined, 46, undefined, undefined, 57, 93, 32, undefined, undefined, undefined, undefined, undefined, 54, 90, undefined, undefined, undefined, undefined, 76, 15, undefined, 87, 26, 62, 1, undefined, 73, 12, 48, 84, 23, undefined, undefined, 34, 70, undefined, 45, 81, undefined, undefined, undefined, 31, undefined, undefined, 42, 78, 17, undefined, undefined, 28, 125, 3, 39, undefined, 14, undefined, 86, 25, undefined];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: LARGE_SIZE, name: "HashingLP" })).toEqual(result);
  });

  // Test cases for Double Hashing
  it('DH insert small table', () => {
    const input = ["42", "87", "16", "59", "23", "74", "31", "5", "68", "90"];
    const result = [undefined, 59, 74, 23, 16, 42, 68, 31, 87, 90, 5];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingDH" })).toEqual(result);
  });
  it('DH insert with duplicates', () => {
    const input = ["14", "62", "14", "33", "57", "62", "85", "33"];
    const result = [33, undefined, 85, undefined, undefined, undefined, 57, undefined, undefined, 14, 62];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingDH" })).toEqual(result);
  });
  it('DH insert with bulk insert', () => {
    const input = ["14", "2-6-2", "8-10", "3"];
    const result = [undefined, 4, 8, undefined, undefined, 9, 2, 6, 10, 14, 3];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingDH" })).toEqual(result);
  });
  it('DH insert large table', () => {
    const input = ["1", "57", "84", "39", "12", "93", "66", "2", "48", "76", "35", "26", "49", "19", "87", "73", "62", "28", "17", "8", "94", "33", "70", "30", "11", "45", "38", "81", "15", "5", "60", "46", "32", "88", "27", "86", "69", "3", "54", "24", "77", "22", "72", "91", "41", "78", "25", "90", "34", "44", "52", "130", "196", "14", "23", "31", "42", "125"];
    const result = [undefined, undefined, 72, 11, undefined, undefined, 22, undefined, 94, 33, 69, 8, 44, undefined, 19, undefined, 91, 30, 66, 5, 41, 77, 125, 52, 88, 27, undefined, 2, 38, undefined, undefined, 49, 130, 24, 60, undefined, 35, undefined, undefined, 46, undefined, 196, 57, 93, 32, undefined, undefined, undefined, undefined, undefined, 54, 90, undefined, undefined, undefined, undefined, 76, 15, undefined, 87, 26, 62, 1, undefined, 73, 12, 48, 84, 23, undefined, undefined, 34, 70, undefined, 45, 81, undefined, undefined, undefined, 31, undefined, undefined, 42, 78, 17, undefined, undefined, 28, undefined, 3, 39, undefined, 14, undefined, 86, 25, undefined];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: LARGE_SIZE, name: "HashingDH" })).toEqual(result);
  });
});
