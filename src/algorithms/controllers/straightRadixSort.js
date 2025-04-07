// Some animation deleted, some added; could delete some commented out stuff
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import MaskTracer from '../../components/DataStructures/Mask/MaskTracer';
import { areExpanded } from './collapseChunkPlugin';
import { createPopper } from '@popperjs/core';
import {colors} from '../../components/DataStructures/colors';

// radix must be a power of two; we use radix 4 here but code should work
// with another radix except vis.mask.setAddBase4() would need to be
// generalised and that call deleted if radix = 2, plus digitColor
// would need generalising
const RADIX_BITS = 2;
const RADIX = 1 << RADIX_BITS;

// color handling code has some legacy stuff that could be cleaned up
const highlightColor = colors.apple; // various highlights
const changedColor = colors.wood; // was for cumulative sums
// colors for the 4 digits XXX assumes radix 4 (or less)
const digitColor = [colors.peach, colors.leaf, colors.sky, colors.plum];

const SRS_BOOKMARKS = {
    radix_sort: 1,
    max_number: 2,
    counting_sort_for_loop: 3,
    // counting_sort: 4,  // no longer used
    // count_nums: 5,  // no longer used
    // cumulative_sum: 6, // no longer used
    // populate_array: 7, // no longer used
    populate_for_loop: 8,
    insert_into_array: 9,
    copy: 10,
    done: 11,
    add_to_count: 12,
    add_count_for_loop: 13,
    cum_sum_for_loop: 14,
    add_cum_sum: 15,
    zero_counts: 16,
    get_digit1: 17,
    dec_count: 18,
};

const isCountExpanded = () => {
    return areExpanded(["Countingsort"]);
};

const highlight = (array, index) => {
    array.selectColor(index, highlightColor);
};

// color all digits in array according to digit value
const colorDigits = (A, visA, digit, n) => {
    for (let i = 0; i < n; i++) {
        if (A[i] !== undefined) {
            visA.deselect(i);
            visA.selectColor(i, digitColor[bitsAtIndex(A[i], digit, RADIX_BITS)]);
        }
    }
}

// color all counts in array according to index
const colorCounts = (visA, n) => {
    for (let i = 0; i < n; i++) {
        visA.selectColor(i, digitColor[i]);
    }
}

const updateMask = (vis, index, bits) => {
    const mask = ((1 << bits) - 1) << (index * bits);
    const indexes = [];

    for (let i = 0; i < vis.mask.maxBits; i++) {
        if (bitsAtIndex(mask, i, 1) == 1) {
            indexes.push(i);
        }
    }

    vis.mask.setMask(mask, indexes);
};

const updateBinary = (vis, value) => {
    vis.mask.setBinary(value);
};

const bitsAtIndex = (num, index, bits) => {
    return num >> (index * bits) & ((1 << bits) - 1);
};

// could check that isArray is defined and avoid some of the
// isCountExpanded() checks elsewhere
const setArray = (visArray, array) => {
    visArray.set(array, 'straightRadixSort');
};

export default {
    initVisualisers,

    /**
     *
     * @param {object} chunker
     * @param {array} nodes array of numbers needs to be sorted
     */
    run(chunker, { nodes }) {
        let A = [...nodes];
        const n = A.length;
        // Stuff for poppers, copied from MSDRadixSort.js - search for
        // POPPERS: in that code for more details, though it's done
        // slightly differently here:
        // The first time the first chunk is called, poppers are created
        // (after a delay - see MSDRadixSort.js).  Subsequent times the
        // first chunk is called we reset the innerHTML so the contents
        // is correct (it may have changed during execution).
        // Similarly, when the temp array is copied back to A we update
        // the innerHTML.
        let floatingBoxes = new Array(n); // XXX popper instances (rename)
        let DELAY_POPPER_CREATE = 700;
        let DELAY_POPPER_RESET = 800;
        let DELAY_POPPER_UPDATE = 800;

        let bits; // number of bits used (depends on max data value)

        // poppers show binary plus whatever radix we use
        // XXX if radix === 2, best avoid duplication
        const popperContent = (n) => {
            return n.toString(2).padStart(bits, "0") + "<br>"
                + n.toString(RADIX).padStart(bits/RADIX_BITS, "0");
        }

        const countingSort = (A, k, n, radixBits) => {
            const count = Array.apply(null, Array(1 << radixBits)).map(() => 0);
            let lastBit = -1;

            chunker.add(SRS_BOOKMARKS.zero_counts,
                (vis, count) => {
                    if (isCountExpanded()) {
                        setArray(vis.countArray, count);
                        colorCounts(vis.countArray, RADIX);
                    }
                },
                [count]
            );

            for (let i = 0; i < n; i++) {
                chunker.add(SRS_BOOKMARKS.add_count_for_loop,
                    (vis, i, lastBit, count, A, n, k) => {
                        if (isCountExpanded()) {
                            setArray(vis.countArray, count);
                            colorCounts(vis.countArray, RADIX);
                        }
                        colorDigits(A, vis.array, k, n);
                        highlight(vis.array, i);
                        updateBinary(vis, A[i]);
                    },
                    [i, lastBit, count, A, n, k]
                );

                const bit = bitsAtIndex(A[i], k, radixBits);
                count[bit]++;

                chunker.add(SRS_BOOKMARKS.add_to_count,
                    (vis, i, count, A, n, k) => {
                        if (isCountExpanded()) {
                            setArray(vis.countArray, count);
                            colorCounts(vis.countArray, RADIX);
                        }
                        colorDigits(A, vis.array, k, n);
                    },
                    [i, count, A, n, k]
                );

                lastBit = bit;
            }

/*
            chunker.add(SRS_BOOKMARKS.cumulative_sum,
                (vis, n, lastBit) => {
                    unhighlight(vis.array, n - 1);

                    if (isCountExpanded()) {
                        unhighlight(vis.countArray, lastBit);
                    }
                },
                [n, lastBit]
            );
*/

            for (let i = 1; i < count.length; i++) {
                chunker.add(SRS_BOOKMARKS.cum_sum_for_loop,
                    (vis, i, A, n, lastBit) => {
                        if (isCountExpanded()) {
                            colorCounts(vis.countArray, RADIX);
                            highlight(vis.countArray, i);
                        }
                    },
                    [i, A, n, lastBit]
                );

                count[i] += count[i - 1];

                chunker.add(SRS_BOOKMARKS.add_cum_sum,
                    (vis, count, i) => {
                        if (isCountExpanded()) {
                            setArray(vis.countArray, count);
                            colorCounts(vis.countArray, RADIX);
                        }
                    },
                    [count, i]
                )
            }

            const sortedA = Array.apply(null, Array(n)).map(() => undefined);

/*
            chunker.add(SRS_BOOKMARKS.populate_array,
                (vis, countLength) => {
                    if (isCountExpanded()) {
                        unhighlight(vis.countArray, countLength - 1);
                    }
                },
                [count.length]
            );
*/

            // chunker.add(SRS_BOOKMARKS.populate_for_loop);

            let bit;

            for (let i = n - 1; i >= 0; i--) {
                const num = A[i];
                chunker.add(SRS_BOOKMARKS.populate_for_loop,
                    (vis, num, i, bit, count, A, sortedA, k, n) => {
                        if (i !== n - 1) {
                            colorDigits(A, vis.array, k, n);
                            if (isCountExpanded()) {
                                setArray(vis.countArray, count);
                                colorCounts(vis.countArray, RADIX);
                                setArray(vis.tempArray, sortedA);
                                colorDigits(sortedA, vis.tempArray, k, n);
                            }
                        }
                        updateBinary(vis, num);
                        // highlight(vis.array, i);
                    },
                    [num, i, bit, count, A, sortedA, k, n]
                );
                bit = bitsAtIndex(num, k, radixBits);
                count[bit]--;
                chunker.add(SRS_BOOKMARKS.dec_count,
                    (vis, num, i, bit, count, A, sortedA, k, n) => {

                        if (isCountExpanded()) {
                            setArray(vis.countArray, count);
                            colorCounts(vis.countArray, RADIX);
                            // highlight(vis.countArray, bit);
                        }
                        colorDigits(A, vis.array, k, n);
                    },
                    [num, i, bit, count, A, sortedA, k, n]
                );
                sortedA[count[bit]] = num;
                A[i] = undefined; // blank out array element
                chunker.add(SRS_BOOKMARKS.insert_into_array,
                    (vis, num, i, bit, count, A, sortedA, k, n) => {

                        setArray(vis.array, A);
                        colorDigits(A, vis.array, k, n);
                        if (isCountExpanded()) {
                            setArray(vis.tempArray, sortedA);
                            colorDigits(sortedA, vis.tempArray, k, n);
                            // highlight(vis.tempArray, count[bit]);
                        }
                    },
                    [num, i, bit, count, A, sortedA, k, n]
                );
            }

            chunker.add(SRS_BOOKMARKS.copy,
                (vis, array, n, countLength, k) => {
                    setArray(vis.array, array);
                    colorDigits(array, vis.array, k, n);
                    if (isCountExpanded()) {
                        setArray(vis.tempArray, Array.apply(null, Array(n)).map(() => undefined));
                        setArray(vis.countArray, Array.apply(null, Array(countLength)).map(() => undefined));
                    }
                    // update contents of all poppers
                    setTimeout( () => {
                      for (let idx = 0; idx < array.length; idx++) {
                        const popper = document.getElementById('float_box_' + idx);
                        popper.innerHTML = popperContent(array[idx]);
                      }
                    }, DELAY_POPPER_UPDATE);
                },
                [sortedA, n, count.length, k]
            );

            return sortedA;
        };

        let maxNumber = Math.max(...A);
        let savedMax = maxNumber;
        let maxBit = 0;

        while (maxNumber > 0) {
            maxNumber = Math.floor(maxNumber / 2);
            maxBit++;
        }

        bits = maxBit + maxBit % RADIX_BITS; // bits is multiple of radix
        floatingBoxes.fill(null); // poppers: see MSDRadixSort.js

        chunker.add(SRS_BOOKMARKS.radix_sort,
            (vis, array, bits) => {
                // XXX assumes radix 4
                vis.mask.setAddBase4(true); // add Base 4 display
                setArray(vis.array, array);

                if (isCountExpanded()) {
                    setArray(vis.countArray, Array.apply(null, Array(1 << RADIX_BITS)).map(() => undefined));
                    colorCounts(vis.countArray, RADIX);
                    setArray(vis.tempArray, Array.apply(null, Array(n)).map(() => undefined));
                }
                // create poppers or reset poppers if they already exist
                for (let idx = 0; idx < array.length; idx++) {
                  if (floatingBoxes[idx] === null) {
                    setTimeout( () => {
                      const popper = document.getElementById('float_box_' + idx);
                      const slot = document.getElementById('chain_' + idx);
                      floatingBoxes[idx] =  createPopper(slot, popper, {
                          placement: "right-start",
                          strategy: "fixed",
                          modifiers: [
                              {
                                  removeOnDestroy: true, // doesn't work well?
                                  name: 'preventOverflow',
                                  options: {
                                    // XXX popper_boundary not defined for 1D
                                    // array - maybe it should be??
                                    boundary: document.getElementById('popper_boundary'),
                                  },
                              },
                          ]
                      });
                      popper.innerHTML = popperContent(array[idx]);
                    }, DELAY_POPPER_CREATE);
                  } else {
                    setTimeout( () => {
                      const popper = document.getElementById('float_box_' + idx);
                      popper.innerHTML = popperContent(array[idx]);
                      floatingBoxes[idx].forceUpdate();
                    }, DELAY_POPPER_RESET)
                  }
                }
            },
            [nodes, bits]
        );

        chunker.add(SRS_BOOKMARKS.max_number,
            (vis, bits, max) => {
                // XXX could highlight max in array also?
                vis.mask.setMaxBits(bits);
                updateBinary(vis, max);
            },
            [bits, savedMax]
        );

        for (let k = 0; k < bits / RADIX_BITS; k++) {
            chunker.add(SRS_BOOKMARKS.counting_sort_for_loop,
                (vis, A, k) => {
                    updateMask(vis, k, RADIX_BITS);
                    for (let i = 0; i < n; i++) {
                        vis.array.deselect(i);
                        vis.array.selectColor(i, digitColor[bitsAtIndex(A[i], k, RADIX_BITS)]);
                }
                },
                [A, k]
            );

            A = countingSort(A, k, n, RADIX_BITS);

            // chunker.add(SRS_BOOKMARKS.counting_sort);
        }

        chunker.add(SRS_BOOKMARKS.done,
            vis => {
                for (let i = 0; i < n; i++) {
                    vis.array.sorted(i);
                }
            }
        );

        return A;
    }
};


export function initVisualisers() {
    if (isCountExpanded()) {
        return {
            mask: {
                instance: new MaskTracer('mask', null, 'Key + Mask'),
                order: 0,
            },
            array: {
                instance: new ArrayTracer('array', null, 'Array A', { arrayItemMagnitudes: false }),
                order: 1,
            },
            countArray: {
                instance: new ArrayTracer('countArray', null, 'Count array', { arrayItemMagnitudes: false }),
                order: 1,
            },
            tempArray: {
                instance: new ArrayTracer('tempArray', null, 'Temp array B', { arrayItemMagnitudes: false }),
                order: 1,
            },
        };
    } else {
        return {
            mask: {
                instance: new MaskTracer('mask', null, 'Key + Mask'),
                order: 0,
            },
            array: {
                instance: new ArrayTracer('array', null, 'Array A', { arrayItemMagnitudes: true }),
                order: 1,
            },
        };
    }
}
