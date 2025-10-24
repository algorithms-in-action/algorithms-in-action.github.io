/* eslint-disable no-multi-spaces,indent */
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { colors } from '../../components/DataStructures/colors';

const selColor = colors.apple;   
const minColor = colors.sky;
const sortedColor = colors.stone;

export default {
    initVisualisers() {
        return {
            array: {
                instance: new ArrayTracer('array', null, 'Array view', { arrayItemMagnitudes: true }),
                order: 0,
            },
        };
    },

    /**
     * @param {object} chunker
     * @param {array} nodes 待排序数组
     */
    run(chunker, { nodes }) {
        const A = [...nodes];
        const n = A.length;

        chunker.add(1, (vis, arr) => {
            vis.array.set(arr, 'selectionsort');
        }, [A]);

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;

            chunker.add(2, (vis, cur) => {
                vis.array.selectColor(cur, selColor);
                vis.array.assignVariable('i', cur);
            }, [i]);

            for (let j = i + 1; j < n; j++) {
                chunker.add(3, (vis, cur) => {
                    vis.array.selectColor(cur, minColor);
                    vis.array.assignVariable('j', cur);
                }, [j]);

                if (A[j] < A[minIdx]) {
                    minIdx = j;
                    chunker.add(4, (vis, newMin) => {
                        vis.array.assignVariable('min', newMin);
                    }, [minIdx]);
                }

                chunker.add(5, (vis, cur) => {
                    vis.array.depatch(cur);
                    vis.array.removeVariable('j');
                }, [j]);
            }

            if (minIdx !== i) {
                [A[i], A[minIdx]] = [A[minIdx], A[i]];
                chunker.add(6, (vis, a, b) => {
                    vis.array.swapElements(a, b);
                }, [i, minIdx]);
            }

            chunker.add(7, (vis, idx) => {
                vis.array.sorted(idx);
                vis.array.removeVariable('i');
                vis.array.removeVariable('min');
            }, [i]);
        }

        chunker.add(8, (vis, idx) => {
            vis.array.sorted(idx);
        }, [n - 1]);

        return A;
    },
};
