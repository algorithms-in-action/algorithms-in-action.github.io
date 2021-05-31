import ArrayGraphTracer from '../../components/DataStructures/ArrayGraph/ArrayGraphTracer';
import { QSM3Exp } from '../explanations';
// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

export default {

  explanation: QSM3Exp,

  initVisualisers() {
    return {
      graph: {
        instance: new ArrayGraphTracer('graph', null, 'Graph'),
        order: 0,
      },
      // create a separate component called 'Sorted Array' to display sorted array separately
      array: {
        instance: new ArrayTracer('array', null, 'Sorted Array'),
        order: 1,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   */
  run(chunker, { nodes }) {
    // Method for implementing Median of Three
    // function SortLMR(arr, left, right) {
    //     let a = arr;

    //   //Sort the first, middle and last element in ascending order
    //   let tmp2;
    //   chunker.add(14);
    //   let mid = (left+right)/2;
    //   if(a[left] > a[mid]) {
    //       tmp2 = a[mid];
    //       a[mid] = a[left];
    //       a[left] = tmp2;
    //   }
    //   if(a[mid] > a[right]) {
    //       tmp2 = a[right];
    //       a[right] = a[mid];
    //       a[mid] = tmp2;

    //       if(a[left] > a[mid]) {
    //         tmp2 = a[mid];
    //         a[mid] = a[left];
    //         a[left] = tmp2;
    //       }
    //   }

    //   //Swap the middle element with second last (right - 1) element
    //   let tmp3;
    //   tmp3 = a[right-1];
    //   a[right-1] = a[mid];
    //   a[mid] = tmp3;

    //   return a;
    // }

    function partition(values, left, right) {
      const a = values;
      let i = left - 1;
      let j = right;
      let tmp;
      chunker.add(5);
      chunker.add(11);
      chunker.add(12);
      const pivot = a[right];
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
          chunker.add(10);
          tmp = a[j];
          a[j] = a[i];
          a[i] = tmp;
        }
      }
      chunker.add(13);
      a[right] = a[i];
      a[i] = pivot;
      return [i, a]; // Return [pivot location, array values]
    }

    function QuickSort(array, left, right, parentId) {
      // let a = SortLMR(array, left, right);
      let a = array;
      let p;
      chunker.add(2);
      if (left < right) {
        [p, a] = partition(a, left, right);
        const leftArray = a.slice(left, p);
        const rightArray = a.slice(p + 1, right + 1);
        chunker.add(3, (vis, _a, _left, _p, _right, _parentId, _leftArray, _rightArray) => {
          if (_leftArray.length !== 0) {
            vis.graph.addNode(`${_left}/${_p - 1}`, _leftArray);
            vis.graph.addEdge(_parentId, `${_left}/${_p - 1}`);
          }
          vis.graph.addNode(`p${_parentId}`, _a[_p]);
          vis.graph.addEdge(_parentId, `p${_parentId}`);

          if (_rightArray.length !== 0) {
            vis.graph.addNode(`${_right}/${_p + 1}`, _rightArray);
            vis.graph.addEdge(_parentId, `${_right}/${_p + 1}`);

            // Sorted array displayed at the end of algorithm
            // chunker.add(1, (vis, array) => {
            vis.array.set(array);
          }
        }, [a, left, p, right, parentId, leftArray, rightArray]);
        QuickSort(a, left, p - 1, `${left}/${p - 1}`);
        chunker.add(4);
        QuickSort(a, p + 1, right, `${right}/${p + 1}`);
      }
      return a; // Facilitates testing
    }

    chunker.add(1, (vis, _nodes) => {
      vis.graph.addNode(`0/${_nodes.length - 1}`, _nodes);
      vis.graph.layoutTree(`0/${_nodes.length - 1}`, false);
    }, [nodes]);
    return QuickSort(nodes, 0, nodes.length - 1, `0/${nodes.length - 1}`);
  },
};
