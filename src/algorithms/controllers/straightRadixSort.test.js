/* The purpose of the test here is to detect whether the correct result is generated
   under the legal input, not to test its robustness, because this is not considered
   in the implementation process of the algorithm.
*/

/* eslint-disable no-undef */

import straightRadixSort from "./straightRadixSort";

// Simple stub for the chunker
const chunker = {
    add: () => { },
};

describe('straight radix sort', () => {

    it('sorts empty array', () => {
        expect(straightRadixSort.run(chunker, { nodes: [] })).toEqual([]);
    });

    it('sorts an array with one element', () => {
        expect(straightRadixSort.run(chunker, { nodes: [42] })).toEqual([42]);
    });

    it('sorts an array of positive integers', () => {
        expect(straightRadixSort.run(chunker, { nodes: [170, 45, 75, 90, 802, 24, 2, 66] })).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
    });

    it('sorts an array of mixed positive and zero values', () => {
        expect(straightRadixSort.run(chunker, { nodes: [0, 802, 75, 0, 2, 66] })).toEqual([0, 0, 2, 66, 75, 802]);
    });

    it('handles sorting arrays with repeated values', () => {
        expect(straightRadixSort.run(chunker, { nodes: [3, 6, 3, 6, 6, 1] })).toEqual([1, 3, 3, 6, 6, 6]);
    });

    it('sorts an array of numbers with varying digit lengths', () => {
        expect(straightRadixSort.run(chunker, { nodes: [1, 100, 10, 1000, 10000, 0] })).toEqual([0, 1, 10, 100, 1000, 10000]);
    });


    // it('sorts an array of negative integers, ignoring negative values', () => {
    //     expect(straightRadixSort.run(chunker, { nodes: [-170, 45, -75, 90, 802, 24, -2, 66] })).toEqual([-170, -75, -2, 24, 45, 66, 90, 802]);
    // });

    // it('sorts objects by a specific key (value) and remains stable', () => {
    //     const arr = [
    //         { value: 170, label: 'A' },
    //         { value: 45, label: 'B' },
    //         { value: 75, label: 'C' },
    //         { value: 45, label: 'D' },
    //         { value: 802, label: 'E' },
    //         { value: 24, label: 'F' },
    //         { value: 2, label: 'G' },
    //         { value: 66, label: 'H' }
    //     ];
    //
    //     straightRadixSort.run(chunker, { nodes: arr, getKey: (item) => item.value });
    //     expect(arr).toEqual([
    //         { value: 2, label: 'G' },
    //         { value: 24, label: 'F' },
    //         { value: 45, label: 'B' },
    //         { value: 45, label: 'D' },
    //         { value: 66, label: 'H' },
    //         { value: 75, label: 'C' },
    //         { value: 170, label: 'A' },
    //         { value: 802, label: 'E' }
    //     ]);
    // });



});