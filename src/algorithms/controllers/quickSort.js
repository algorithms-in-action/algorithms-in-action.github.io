import { QSExp } from '../explanations';
// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

export default {
  explanation: QSExp,

  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array view', { arrayItemMagnitudes: true }), // Label the input array as array view
        order: 0,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   */
  run(chunker, { nodes }) {
    const swapAction = (b, n1, n2) => {
      chunker.add(b, (vis, _n1, _n2) => {
        vis.array.swapElements(_n1, _n2);
      }, [n1, n2]);
    };

    function partition(values, left, right) {
      const a = values;
      let i = left - 1;
      let j = right;
      let tmp;
      const pivot = a[right];
      
      chunker.add(5);
      chunker.add(11);
      chunker.add(12);
      
      chunker.add(6);
      while (i < j) {
        chunker.add(7);
        do {
          i += 1;
        } while (a[i] < pivot);
        chunker.add(8);
        do {
          j -= 1;
        } while (i <= j && pivot < a[j]);
        chunker.add(9);
        if (i < j) {
          tmp = a[j];
          a[j] = a[i];
          a[i] = tmp;
          swapAction(10, i, j);
        }
      }
      a[right] = a[i];
      a[i] = pivot;
      swapAction(13, i, right);
      return [i, a]; // Return [pivot location, array values]
    }


    function QuickSort(array, left, right) {
      let a = array;
      let p;
      chunker.add(2);
      if (left < right) {
        [p, a] = partition(a, left, right);
        // const leftArray = a.slice(left, p);
        // const rightArray = a.slice(p + 1, right + 1);

        chunker.add(3, (vis, pivot, arrayLen) => {
          // fade out the part of the array that is not being sorted (i.e. right side)
          for (let i=pivot; i < arrayLen; i++){
            vis.array.fadeOut(i)
          } 
        }, [p, right+1]);
        QuickSort(a, left, p - 1, `${left}/${p - 1}`);
        
        chunker.add(4, (vis, pivot, arrayLen) => {
          // fade out the part of the array that is not being sorted (i.e. left side)
          for (let i=0; i <= pivot; i++){
            vis.array.fadeOut(i)
          } 
          // fade in part of the array that is now being sorted (i.e. right side)
          for (let i=pivot+1; i < arrayLen; i++){
            vis.array.fadeIn(i)
          } 
        }, [p, right+1]);
        QuickSort(a, p + 1, right, `${right}/${p + 1}`);
      }
      return a; // Facilitates testing
    }

    chunker.add(
      1,
      (vis, array) => {
        vis.array.set(array, 'quicksort');
      },
      [nodes],
    );
    QuickSort(nodes, 0, nodes.length - 1, `0/${nodes.length - 1}`);
    // Fade out final node 
    chunker.add(19, (vis, idx) => {
      vis.array.fadeOut(idx)
    }, [nodes.length - 1]);
  },
};
