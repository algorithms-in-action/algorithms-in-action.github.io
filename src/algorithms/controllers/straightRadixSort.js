import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import MaskTracer from '../../components/DataStructures/Mask/MaskTracer';
import { areExpanded } from './collapseChunkPlugin';

const BITS = 2;

const SRS_BOOKMARKS = {
    radix_sort: 1,
    max_number: 2,
    counting_sort_for_loop: 3,
    counting_sort: 4,
    count_nums: 5,
    cumulative_sum: 6,
    populate_array: 7,
    populate_for_loop: 8,
    insert_into_array: 9,
    copy: 10,
    done: 11,
    add_to_count: 12,
    add_count_for_loop: 13,
    cum_sum_for_loop: 14,
    add_cum_sum: 15,
};

const isCountExpanded = () => {
    return areExpanded(["Countingsort"]);
};

const highlight = (array, index, isPrimaryColor = true) => {
    if (isPrimaryColor) {
        array.select(index);
    } else {
        array.patch(index);
    }
};

const unhighlight = (array, index, isPrimaryColor = true) => {
    if (isPrimaryColor) {
        array.deselect(index);
    } else {
        array.depatch(index);
    }
};

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

        const countingSort = (A, k, n, bits) => {
            const count = Array.apply(null, Array(1 << bits)).map(() => 0);
            let lastBit = -1;

            chunker.add(SRS_BOOKMARKS.count_nums);

            for (let i = 0; i < n; i++) {
                chunker.add(SRS_BOOKMARKS.add_count_for_loop,
                    (vis, i, lastBit) => {
                        if (i !== 0) {
                            unhighlight(vis.array, i - 1);
                        }

                        if (lastBit !== -1 && isCountExpanded()) {
                            unhighlight(vis.countArray, lastBit);
                        }

                        highlight(vis.array, i);
                        updateBinary(vis, A[i]);
                    },
                    [i, lastBit]
                );

                const bit = bitsAtIndex(A[i], k, bits);
                count[bit]++;

                chunker.add(SRS_BOOKMARKS.add_to_count,
                    (vis, count) => {
                        if (isCountExpanded()) {
                            setArray(vis.countArray, count);
                            highlight(vis.countArray, bit);
                        }
                    },
                    [count]
                );

                lastBit = bit;
            }

            chunker.add(SRS_BOOKMARKS.cumulative_sum,
                (vis, n, lastBit) => {
                    unhighlight(vis.array, n - 1);

                    if (isCountExpanded()) {
                        unhighlight(vis.countArray, lastBit);
                    }
                },
                [n, lastBit]
            );

            for (let i = 1; i < count.length; i++) {
                chunker.add(SRS_BOOKMARKS.cum_sum_for_loop,
                    (vis, i) => {
                        if (i === 1 && isCountExpanded()) {
                            highlight(vis.countArray, 0);
                        }
                    },
                    [i]
                );

                count[i] += count[i - 1];

                chunker.add(SRS_BOOKMARKS.add_cum_sum,
                    (vis, count, i) => {
                        if (isCountExpanded()) {
                            setArray(vis.countArray, count);
                            highlight(vis.countArray, i);
                        }
                    },
                    [count, i]
                )
            }

            const sortedA = Array.apply(null, Array(n)).map(() => 0);

            chunker.add(SRS_BOOKMARKS.populate_array,
                (vis, countLength) => {
                    if (isCountExpanded()) {
                        unhighlight(vis.countArray, countLength - 1);
                    }
                },
                [count.length]
            );

            chunker.add(SRS_BOOKMARKS.populate_for_loop);

            let bit;

            for (let i = n - 1; i >= 0; i--) {
                const num = A[i];
                bit = bitsAtIndex(num, k, bits);
                count[bit]--;
                sortedA[count[bit]] = num;
                chunker.add(SRS_BOOKMARKS.insert_into_array,
                    (vis, num, i, bit, count, sortedA) => {
                        if (i !== n - 1) {
                            unhighlight(vis.array, i + 1);
                        }

                        if (isCountExpanded()) {
                            setArray(vis.countArray, count);
                            setArray(vis.tempArray, sortedA);
                            highlight(vis.countArray, bit);
                            highlight(vis.tempArray, count[bit]);
                        }

                        updateBinary(vis, num);
                        highlight(vis.array, i);
                    },
                    [num, i, bit, count, sortedA]
                );
            }

            chunker.add(SRS_BOOKMARKS.copy,
                (vis, array, n, countLength) => {
                    setArray(vis.array, array);

                    if (isCountExpanded()) {
                        setArray(vis.tempArray, Array.apply(null, Array(n)).map(() => undefined));
                        setArray(vis.countArray, Array.apply(null, Array(countLength)).map(() => undefined));
                    }
                },
                [sortedA, n, count.length]
            );

            return sortedA;
        };

        let maxNumber = Math.max(...A);
        let maxBit = -1;

        while (maxNumber > 0) {
            maxNumber = Math.floor(maxNumber / 2);
            maxBit++;
        }

        let bits = 1;

        while (bits < maxBit) {
            bits *= 2;
        }

        chunker.add(SRS_BOOKMARKS.radix_sort,
            (vis, array) => {
                setArray(vis.array, array);

                if (isCountExpanded()) {
                    setArray(vis.countArray, Array.apply(null, Array(1 << BITS)).map(() => undefined));
                    setArray(vis.tempArray, Array.apply(null, Array(n)).map(() => undefined));
                }
            },
            [nodes]
        );

        chunker.add(SRS_BOOKMARKS.max_number,
            (vis, bits) => {
                vis.mask.setMaxBits(bits);
            },
            [bits]
        );

        for (let k = 0; k < bits / BITS; k++) {
            chunker.add(SRS_BOOKMARKS.counting_sort_for_loop,
                vis => {
                    updateMask(vis, k, BITS);
                }
            );

            A = countingSort(A, k, n, BITS);

            chunker.add(SRS_BOOKMARKS.counting_sort);
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
                instance: new MaskTracer('mask', null, 'Mask'),
                order: 0,
            },
            array: {
                instance: new ArrayTracer('array', null, 'Array view', { arrayItemMagnitudes: false }),
                order: 1,
            },
            countArray: {
                instance: new ArrayTracer('countArray', null, 'Count array', { arrayItemMagnitudes: false }),
                order: 1,
            },
            tempArray: {
                instance: new ArrayTracer('tempArray', null, 'Temp array', { arrayItemMagnitudes: false }),
                order: 1,
            },
        };
    } else {
        return {
            mask: {
                instance: new MaskTracer('mask', null, 'Mask'),
                order: 0,
            },
            array: {
                instance: new ArrayTracer('array', null, 'Array view', { arrayItemMagnitudes: true }),
                order: 1,
            },
        };
    }
}