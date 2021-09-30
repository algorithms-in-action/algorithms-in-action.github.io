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
    const highlight = (vis, index, primaryColor = true) => {
      if (primaryColor) {
        vis.array.select(index);
      } else {
        vis.array.patch(index);
      }
    };

    const unhighlight = (vis, index, primaryColor = true) => {
      if (primaryColor) {
        vis.array.deselect(index);
      } else {
        vis.array.depatch(index);
      }
    };

    const swapAction = (b, n1, n2) => {
      chunker.add(b, (vis, _n1, _n2) => {
        vis.array.swapElements(_n1, _n2);
      }, [n1, n2]);
    };

    function partition(values, left, right) {
      const a = values;
      let tmp;
      const pivot = a[right];
      chunker.add(5, (vis, index) => {
        highlight(vis, index);
      }, [right]);
      let i = left - 1;
      chunker.add(11, (vis, index) => {
        highlight(vis, index, false);
      }, [i + 1]);
      let j = right;
      chunker.add(12, (vis, index) => {
        highlight(vis, index, false);
      }, [j - 1]);
      while (i < j) {
        chunker.add(6);
        if (i < left) tmp = i + 1;
        else tmp = i;
        do {
          i += 1;
        } while (a[i] < pivot);
        chunker.add(7, (vis, prev, curr) => {
          unhighlight(vis, prev, false);
          highlight(vis, curr, false);
        }, [tmp, i]);
        if (j === right) tmp = j - 1;
        else tmp = j;
        do {
          j -= 1;
        } while (i <= j && pivot < a[j]);
        chunker.add(8, (vis, prev, curr) => {
          unhighlight(vis, prev, false);
          if (curr >= left) highlight(vis, curr, false);
        }, [tmp, j]);
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
      chunker.add(13, (vis, index1, index2, index3) => {
        unhighlight(vis, index1);
        if (index2 >= left) unhighlight(vis, index2, false);
        unhighlight(vis, index3, false);
      }, [i, j, right]);
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
      return a; // Facilitates testing
    }

    chunker.add(
      1,
      (vis, array) => {
        vis.array.set(array, 'quicksort');
      },
      [nodes],
    );
    return QuickSort(nodes, 0, nodes.length - 1, `0/${nodes.length - 1}`);
  },
};
