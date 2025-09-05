/*
    This file contains input validation helpers.
    They should return a collection containing
    true/false and an error message which is pulled
    from the central repository ErrorMessages.js.
*/

import { ERRORS } from './ErrorExampleStrings';

export const commaSeparatedNumberListValidCheck = (t) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  const regex = /^[0-9]+(,[0-9]+)*$/;
  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_POSITIVE_NUMBERS_LIST };
  }

  return { valid: true, error: null };
};

export const stringListValidCheck = (t) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  const regex = /^[a-zA-Z]+(,[a-zA-Z]+)*$/g;
  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_LOWERCASE };
  }

  return { valid: true, error: null };
};

export const stringValidCheck = (t) => {
  const regex = /^[a-z\s]+$/g;

  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_LOWERCASE };
  }

  return { valid: true, error: null };
};

export const singleNumberValidCheck = (t) => {
  const regex = /^\d+$/;

  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_POSITIVE_INTEGERS };
  }

  return { valid: true, error: null };
};

// eslint-disable-next-line consistent-return
export const matrixValidCheck = (m) => {
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < i; j++) {
      if (m[i][j] !== m[j][i]) {
        return { valid: false, error: ERRORS.GEN_MATRIX_NOT_SYMMETRIC };
      }
    }
    if (m[i][i] !== 0) {
      return { valid: false, error: ERRORS.GEN_MATRIX_DIAGONAL_NOT_ZERO };
    }
  }
  return { valid: true, error: null };
};

/**
 * Check if the input string are comma-separated numbers, pairs and triples
 * @param {*} allowPosInteger if true it allows positive integers
 * @param {*} allowNegInteger if true it allows negative integers
 * @param {*} input the input string
 */
export const commaSeparatedPairTripleCheck = (allowPosInteger, allowNegInteger, input) => {
  const regex_pos_num = /^[0-9]+(-[0-9]+){0,2}$/g;
  const regex_all_num = /^[0-9]+(-[0-9]+){0,2}$|^-[0-9]+$/g;
  const regex_no_num = /^[0-9]+(-[0-9]+){1,2}$/g;
  let array = input.split(",");

  for (let item of array) {
    if (!item.match(allowPosInteger ? (allowNegInteger ? regex_all_num : regex_pos_num) : regex_no_num)) {
      return { valid: false, error: ERRORS.HASHING_INVALID_INPUT_INSERT };
    }
  }
  return { valid: true, error: null };
};

/**
 * Check if all ranges in array of inputs are valid (e.g for a-b, a must < b)
 * @param {*} values array of inputs
 */
export const checkAllRangesValid = (values) => {
  for (let item of values) {
    let rangesItems = item.split("-").map(Number);
    if ((rangesItems.length == 2 || rangesItems.length == 3) && rangesItems[0] > rangesItems[1]) {
      return { valid: false, error: ERRORS.HASHING_INVALID_RANGES };
    }
  }
  return { valid: true, error: null };
};
