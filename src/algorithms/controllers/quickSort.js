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

      chunker.add(5);

      chunker.add(11);
      chunker.add(12);
      const pivot = a[right];
      chunker.add(6, (vis, p, i1, j1) => {
        vis.array.assignVariable('p', p);
        if (i1 >= 0) {
          vis.array.assignVariable('i', i1);
        }
        if (j1 >= 0) {
          vis.array.assignVariable('j', j1);
        }
      }, [right, i, j]);
      // chunker.add(6);
      while (i < j) {
        chunker.add(7, (vis, i1, j1) => {
          if (i1 >= 0) {
            vis.array.assignVariable('i', i1);
          }
          if (j1 >= 0) {
            vis.array.assignVariable('j', j1);
          }
        }, [i, j]);
        // chunker.add(7);
        do {
          i += 1;
        } while (a[i] < pivot);
        chunker.add(8);
        do {
          j -= 1;
        } while (i <= j && pivot < a[j]);
        chunker.add(9, (vis, i1, j1) => {
          if (i1 >= 0) {
            vis.array.assignVariable('i', i1);
          }
          if (j1 >= 0) {
            vis.array.assignVariable('j', j1);
          }
        }, [i, j]);
        // chunker.add(9);
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
      chunker.add(13, (vis, i) => {
        vis.array.sorted(i);
      }, [i]);
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
        chunker.add(3);
        QuickSort(a, left, p - 1, `${left}/${p - 1}`);
        chunker.add(4);
        QuickSort(a, p + 1, right, `${right}/${p + 1}`);
      }
      // array of size 1, already sorted
      else if (left < array.length) {
        chunker.add(2, (vis, left) => {
          vis.array.sorted(left);
        }, [left]);
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
    const result = QuickSort(nodes, 0, nodes.length - 1, `0/${nodes.length - 1}`);
    chunker.add(50, (vis) => {
      // Put in done state
      vis.array.clearVariables();
    });
    return result;
  },
};
