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

describe('HashingDeletion', () => {
  // Test cases for Linear Probing
  it('LP insert small table, delete 1 element after all has been inserted', () => {
    const input = ["12", "10", "18", "6", "21", "48", "47", "49", "24", "26", "-18"];
    const result = [47, 48, 26, 12, 49, undefined, 24, 6, 10, 21, "X"];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingLP" })).toEqual(result);
  });
  it('LP delete element in the middle of insertion', () => {
    const input = ["3", "2", "10", "18", "-10", "28", "36", "25", "17","22","44"];
    const result = [36, 25, 22, 44, undefined, undefined, 2, 28, 17, 3, 18];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingLP" })).toEqual(result);
  });
  it('LP delete element, table contains no empty indices', () => {
    const input = ["29","40","15","14","43","10","16","48","12","18","-12","46"];
    const result = [40, 15, 10, 48, 16, "X", 18, 46, 43, 14, 29];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingLP" })).toEqual(result);
  });
  it('LP attempt to delete non-existent element from non-empty table', () => {
      const input = ["29","40","15","14","43","10","16","48","12","18","-12","46","-99"];
      const result = [40, 15, 10, 48, 16, "X", 18, 46, 43, 14, 29];
      expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingLP" })).toEqual(result);
  });
  it('LP delete everything', () => {
      const input = ["23", "11", "38", "22", "19", "3", "26", "35", "14", "37","-23", "-11", "-38", "-22", "-19", "-3", "-26", "-35", "-14", "-37"];
      const result = ["X", "X", "X", "X", "X", "X", "X", "X", undefined, "X", "X"];
      expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingDH" })).toEqual(result);
  });
  it('LP delete multiple elements during insertion in large table', () => {
    const input = ["34","57","55","43","42","100","71","62","-55","78","97","-43","45","59","87","-34","70","73","67","68","20","77","26","4","46","32","95","49","56","51","58","2","89","-77","66","18","98","27","48","13","36","84","10","74","-67","63","28","39","54","65","61","35","7","82","72","14","93","50","79","8","37","1","80","76","44","94","11","52","86","33","31","96","81","64","40","85","21","17","90","83","38","22","23","53","30","60","41","29","16","9","15","19","47","99","69","25","12","5","75","6","91"];
    const result = [97, 36, 72, 11, 47, 83, 22, 58, 94, 33, 69, 8, 44, 80, 19, "X", 91, 30, 66, 5, 41, "X", 16 , 52, undefined, 27, 63, 2, 38, 74, 13, 49, 85, 99, 60, 96, 35, 71, 10, 46, 82, 21, 57, 93, 32, 68, 7, "X", 79, 18, 54, 90, 29, 65, 4, 40, 76, 15, 51, 87, 26, 62, 98, 37, 73, 1, 48, 84, 23, 59, 95, 12, 70, 9, 45, 81, 20, 56, undefined, 31, "X", 6, 42, 78, 17, 53, 89, 28, 64, 100, 39, 75, 14, 50, 86, 25, 61];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: LARGE_SIZE, name: "HashingLP" })).toEqual(result);
  });

  // Test cases for Double Hashing
  it('DH insert small table, delete 1 element after all has been inserted', () => {
    const input = ["31","13","9","17","6","43","2","15","3","50","-9"];
    const result = [3, 43, 15, 50, undefined, 31, 13, "X", 6, 2, 17];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingDH" })).toEqual(result);
  });
  it('DH delete element in the middle of insertion', () => {
    const input = ["9", "29", "12", "46", "33", "2", "-46", "15", "37", "6", "18"];
    const result = [33, 15, 18, 12, undefined, 9, "X", 37, 6, 2, 29];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingDH" })).toEqual(result);
  });
  it('DH delete element, table contains no empty indices and deletion probe passes through a deleted index', () => {
      const input = ["30", "11", "24", "27", "14", "46", "44", "41", "50", "12", "-14", "92", "-12"];
      const result = [11, 44, 30, 41, 27, "X", 24, 46, 50, 92, undefined];
      expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingLP" })).toEqual(result);
  });
  it('DH attempt to delete non-existent element from non-empty table', () => {
    const input = ["14", "16", "25", "42", "32", "10", "18", "20", "5", "29", "-20", "97", "-53"];
    const result = [25, 18, 29, "X", 16, 42, 97, 5, 32, 14, 10];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingDH" })).toEqual(result);
  });
  it('DH delete everything', () => {
      const input = ["48","50","36","27","49","19","41","24","45","32","-48","-50","-36","-27","-49","-19","-41","-24","-45","-32"];
      const result = ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", undefined];
      expect(HashingInsertion.run(chunker, { values: input, hashSize: SMALL_SIZE, name: "HashingDH" })).toEqual(result);
    });
  it('DH delete multiple elements during insertion in large table', () => {
    const input = ["44", "26", "83", "49", "95", "22", "1", "84", "-83", "4", "31", "63", "33", "51", "-95", "-22", "47", "53", "68", "81", "72", "7", "23", "34", "32", "69", "6", "-34", "-81", "40", "5", "99", "52", "79", "14", "-40", "50", "15", "73", "86", "98", "70", "19", "39","61", "38", "96", "30", "54", "-86", "67", "12", "17", "62", "-73", "75", "80", "94", "82", "13", "85", "78", "45", "-67", "88", "24", "42","89", "28", "56", "21", "74", "92", "97", "27", "25", "3", "100", "43", "18", "91", "37", "93", "11", "87", "29", "8", "20", "16", "58", "9", "65", "10", "36", "60", "2", "66", "59", "64", "77", "57", "48", "76", "46", "55"];
    const result = [97, 36, 72, 98, 47, "X", 100, 58, 94, 33, 69, 8, 44, 80, 19, 55, 91, 30, 66, 5, undefined, 77, 16, 52, 88, 27, 63, 99, 38, 74, 13, 49, 85, 24, 60, 96, 11, undefined, 10, 46, 82, 21, 57, 93, 32, 68, 7, 43, 79, 18, 54, undefined, 29, 65, 4, 2, 76, 15, 51, 87, 26, 62, 1, 37, "X", 12, 48, 84, 23, 59, "X", "X", 70, 9, 45, "X", 20, 56, 92, 31, "X", 6, 42, 78, 17, 53, 89, 28, 64, 3, 39, 75, 14, 50, "X", 25, 61];
    expect(HashingInsertion.run(chunker, { values: input, hashSize: LARGE_SIZE, name: "HashingDH" })).toEqual(result);
  });
});
