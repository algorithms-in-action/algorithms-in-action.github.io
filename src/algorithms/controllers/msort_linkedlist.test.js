/* Testing file for the linked list mergesort algorithm, trialing a variety of inputs
   designed to cover different scenarios, edge cases, and potential sources of bugs.
   The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import { NULL } from 'sass';
import msort_linkedlist from './msort_linkedlist';

// Simple stub for the chunker
const chunker = {
    add: () => { },
};

describe('msort_linkedlist', () => {
    it('sorts empty list', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [] })).toEqual([]);
    });
    it('sorts single element', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [5] })).toEqual([5]);
    });
    it('sorts sorted list', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [1, 2, 3, 4, 5] })).toEqual([1, 2, 3, 4, 5]);
    });
    it('sorts reverse sorted list', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [5, 4, 3, 2, 1] })).toEqual([1, 2, 3, 4, 5]);
    });
    it('sorts odd numbers list', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [5, 9, 13, 27, 3] })).toEqual([3, 5, 9, 13, 27]);
    });
    it('sorts even numbers list', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [6, 2, 14, 36, 22] })).toEqual([2, 6, 14, 22, 36]);
    });
    it('sorts list with duplicates', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [1, 3, 2, 7, 7, 2, 3, 5] })).toEqual([1, 2, 2, 3, 3, 5, 7, 7]);
    });
    it('sorts negatives', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [-4, -3, -17, -23, -9] })).toEqual([-23, -17, -9, -4, -3]);
    });
    it('sorts negatives and positives', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [-9, 9, 5, -3, 17, 8, -8, -22] })).toEqual([-22, -9, -8, -3, 5, 8, 9, 17]);
    });
    it('sorts all identical list', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [1, 1, 1, 1, 1, 1, 1] })).toEqual([1, 1, 1, 1, 1, 1, 1]);
    });
    it('exits with invalid inputs', () => {
        expect(msort_linkedlist.run(chunker, { nodes: ['a', 'b', 'b', '1', '2', '3', true, [1, false], null] })).toEqual(null);
    });
    it('handles decimals', () => {
        expect(msort_linkedlist.run(chunker, { nodes: [2.1, 1.1, 2.3, 1.3, 1.2, 2.2] })).toEqual([1.1, 1.2, 1.3, 2.1, 2.2, 2.3]);
    });
});
