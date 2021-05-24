import ArrayGraphTracer from '../../components/DataStructures/ArrayGraph/ArrayGraphTracer';
import { QSExp } from '../explanations';
// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

export default {
  explanation: QSExp,

  initVisualisers() {
    return {
      graph: {
        instance: new ArrayGraphTracer('graph', null, 'Array'),
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
            // tell the array renderer that it is sorted array
            // }, [nodes]);
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
