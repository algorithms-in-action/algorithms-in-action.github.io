/* eslint-disable no-undef */

import {
  binaryKeyListValidCheck, binaryKeyValidCheck, binaryOperationListValidCheck, MAX_BINARY_KEY,
} from './InputValidators';
import { ERRORS } from './ErrorExampleStrings';

test('binary trie and DST share the same 31-bit key limit', () => {
  expect(binaryKeyListValidCheck(`0,5,${MAX_BINARY_KEY}`).valid).toBe(true);
  expect(binaryKeyListValidCheck(`5,${MAX_BINARY_KEY + 1}`).error).toBe(ERRORS.GEN_BINARY_KEY_RANGE);
  expect(binaryKeyListValidCheck('5,-1').error).toBe(ERRORS.GEN_ONLY_POSITIVE_NUMBERS_LIST);
  expect(binaryKeyValidCheck(String(MAX_BINARY_KEY)).valid).toBe(true);
  expect(binaryKeyValidCheck(String(MAX_BINARY_KEY + 1)).error).toBe(ERRORS.GEN_BINARY_KEY_RANGE);
});

test('insert & search input splits ?keys into search operations', () => {
  expect(binaryOperationListValidCheck('5,?7,7').operations).toEqual([
    { type: 'insert', value: 5 },
    { type: 'search', value: 7 },
    { type: 'insert', value: 7 },
  ]);
  expect(binaryOperationListValidCheck(`?${MAX_BINARY_KEY + 1}`).error).toBe(ERRORS.GEN_BINARY_KEY_RANGE);
  expect(binaryOperationListValidCheck('5,??7').error).toBe(ERRORS.GEN_BINARY_OPERATION_LIST);
  expect(binaryOperationListValidCheck('5,-7').error).toBe(ERRORS.GEN_BINARY_OPERATION_LIST);
  expect(binaryOperationListValidCheck('').error).toBe(ERRORS.GEN_EMPTY_INPUT);
});
