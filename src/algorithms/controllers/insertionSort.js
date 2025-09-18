import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { insertionSortExp } from '../explanations';
import {colors} from '../../components/DataStructures/colors';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';

export default{
    initVisualisers() {
        return {
            graph: {
                instance: new Array1DTracer('array', null, 'Insertion Sort Array'),
            },
        };
    },

    run(chunker, { nodes }) {
        let A = [...nodes];
        const n = A.length;

        for (let i = 1; i < n; i++) {
            let key = A[i];
            let j = i - 1;

            // Shift elements of A[0..i-1] that are greater than key
            while (j >= 0 && A[j] > key) {
                A[j + 1] = A[j];
                j--;
            }
            
            A[j + 1] = key;
        }
    }
}