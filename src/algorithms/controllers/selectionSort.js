/* eslint-disable no-multi-spaces,indent */
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { colors } from '../../components/DataStructures/colors';

const selColor = colors.leaf;   
const minColor = colors.apple;
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

        chunker.add('Main', (vis, arr) => {
            vis.array.set(arr, 'selectionsort');
        }, [A]);

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;

            chunker.add('For_i', (vis, cur, n) => {
                for (let i = cur; i < n; i++)
                    vis.array.deselect(i); // XXX color interface???
                vis.array.assignVariable('i', cur);
            }, [i, n]);

            chunker.add('Init_min', (vis, cur) => {
                vis.array.assignVariable('min', cur);
                vis.array.selectColor(cur, minColor);
            }, [i]);
            for (let j = i + 1; j < n; j++) {
                chunker.add('For_j', (vis, cur) => {
                    vis.array.selectColor(cur, selColor);
                    vis.array.assignVariable('j', cur);
                }, [j]);

                if (A[j] < A[minIdx]) {
                    chunker.add('IfA[j]<A[min]', (vis, cur, n) => {
                    }, [j, n]);
                    chunker.add('min<-j', (vis, newMin, oldMin, cur, n) => {
                        vis.array.assignVariable('min', newMin);
                        vis.array.selectColor(newMin, minColor);
                        vis.array.selectColor(oldMin, selColor);
                        if (cur === n - 1)
                            vis.array.removeVariable('j');
                    }, [j, minIdx, j, n]);
                    minIdx = j;
                } else
                    // XXX we make j disappear on the last iteration so
                    // its not visible if the pseudocode is not expanded
                    // - not ideal; could check if code is expanded
                    // instead
                    chunker.add('IfA[j]<A[min]', (vis, cur, n) => {
                        if (cur === n - 1)
                            vis.array.removeVariable('j');
                    }, [j, n]);
            }

            // if (minIdx !== i) {
                [A[i], A[minIdx]] = [A[minIdx], A[i]];
                chunker.add('Swap', (vis, a, b) => {
                    vis.array.swapElements(a, b);
                    vis.array.removeVariable('min');
                    vis.array.sorted(a);
                }, [i, minIdx]);
            // }

        }

        chunker.add('Done', (vis, idx) => {
            vis.array.removeVariable('i');
            vis.array.sorted(idx);
        }, [n - 1]);

        return A;
    },
};
