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
      return { valid: false, error: ERRORS.GEN_PAIR_TRIPLES_POS_INT };
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
      return { valid: false, error: ERRORS.GEN_INVALID_RANGES };
    }
  }
  return { valid: true, error: null };
};

/**
 * Validate a comma-separated list of integers (no duplicates allowed).
 * @param {string} input
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateListInput(input) {
  const inputArr = input.split(',').map((s) => s.trim());
  const inputSet = new Set(inputArr);

  // check duplicates
  if (inputArr.length !== inputSet.size) {
    return { valid: false, error: ERRORS.GEN_LIST_DUPLICATES };
  }

  // check validity of each number
  for (const num of inputArr) {
    if (!singleNumberValidCheck(num)) {
      return { valid: false, error: ERRORS.GEN_LIST_INVALID_NUMBER };
    }
  }

  return { valid: true, error: null };
}

/**
 * Validate the text input within the DualValueParam component.
 * @param {string} value The text input.
 * @param {number[]} domain List of allowed integers.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateTextInput(value, domain) {
  if (!value) {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  // ensuring only allowable characters
  if (!/^[0-9,-\s]+$/.test(value)) {
    return { valid: false, error: ERRORS.GEN_TEXT_PAIR_FORMAT };
  }

  const pairs = value.split(',').map((pair) => pair.trim());

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('-');

    if (pair.length !== 2) {
      return { valid: false, error: ERRORS.GEN_TEXT_PAIR_FORMAT };
    }

    const [aStr, bStr] = pair;
    const a = Number(aStr);
    const b = Number(bStr);

    if (isNaN(a) || isNaN(b)) {
      return { valid: false, error: ERRORS.GEN_ONLY_POSITIVE_INTEGERS };
    }

    if (!domain.includes(a) || !domain.includes(b)) {
      return { valid: false, error: ERRORS.GEN_NUMBER_NOT_IN_DOMAIN };
    }
  }

  return { valid: true, error: null };
}
