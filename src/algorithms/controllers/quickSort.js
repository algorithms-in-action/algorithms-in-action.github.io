import ArrayGraphTracer from '../../components/DataStructures/ArrayGraph/ArrayGraphTracer';
import { QSExp } from '../explanations';

export default {
//   pseudocode: parse(`
//   \\Note{ REAL specification of quicksort (simple version) for animation

  //   NOTE: Ultimately it would be nice to support different versions (eg,
  //   median of three partitioning, etc), in AIA. Ideally the list of algorithms
  //   presented by AIA should just include a single occurrence of quicksort.
  //   Different versions could be selected via a menu in the quicksort animation
  //   (or perhaps a sub-menu at the top level).  This version should be the
  //   default/first listed.
  //   \\Note}

  //   \\Code{
  //   Main
  //   // Sort array A[left]..A[right] in ascending order
  //   Quicksort(A, left, right) \\B 1
  //   \\Expl{  We need left and right indices because the code is recursive
  //           and both may be different for recursive calls.
  //   \\Expl}
  //       if (left < right) \\B 2
  //       \\Expl{  Terminating condition (if there are less than two
  //               elements in the array segment do nothing).
  //       \\Expl}
  //       \\In{
  //           Choose pivot    \\Ref ChoosePivot
  //           \\Expl{  There are various ways to choose the "pivot", which
  //                   is used to distinguish (relatively) small elements
  //                   and (relatively) large elements in the partitioning
  //                   process.
  //           \\Expl}
  //           Partition array segment    \\Ref Partition
  //           \\Expl{  This is where most of the work of Quicksort gets done.
  //                   We start with an unordered array segment, and finish
  //                   with an array segment containing the pivot in its final
  //                   place, A[i], and two partitions, one containing only
  //                   elements smaller than or equal to the pivot, and the other
  //                   containing only elements larger than or equal to the pivot.
  //                   There are various ways this can be coded, often with
  //                   some subtle points.
  //           \\Expl}
  //           Quicksort FirstHalf    \\Ref QuicksortFirstHalf
  //           \\Expl{  Sort elements left of (smaller or equal to) the
  //                   pivot, which is in A[i].
  //           \\Expl}
  //           Quicksort SecondHalf    \\Ref QuicksortSecondHalf
  //           \\Expl{  Sort elements right of (greater or equal to) the
  //                   pivot, which is in A[i].
  //           \\Expl}
  //       \\In}
  //   \\Code}

  //   \\Code{
  //   QuicksortFirstHalf
  //   Quicksort(A, left, i) \\B 3
  //   \\Code}

  //   \\Code{
  //   QuicksortSecondHalf
  //   Quicksort(A, i + 1, right) \\B 4
  //   \\Code}

  //   \\Code{
  //   ChoosePivot
  //   pivot <- A[right] \\B 5
  //   \\Expl{  This simple method of choosing a pivot just uses the rightmost
  //           element of the array segment. Unfortunately it leads to very poor
  //           performance in some common cases, such as when the array is almost
  //           sorted already.
  //   \\Expl}
  //   \\Code}

  //   \\Code{
  //   Partition
  //   Set index i at left of the array segment and j at the right    \\Ref init_iAndj
  //   \\Expl{  i scans from left to right stopping at large elements and
  //           j scans from right to left stopping at small elements.
  //   \\Expl}
  //   while i < j \\B 6
  //   \\Expl{  When the indices cross, all the large elements at the left of
  //           the array segment have been swapped with small elements from the
  //           right of the array segment. The coding here can be simplified
  //           if we use "break" or similar to exit from this loop.
  //   \\Expl}
  //   \\In{
  //       Repeatedly increment i until A[i] >= pivot \\B 7
  //       \\Expl{  Stopping at elements equal to the pivot results in better
  //               performance when there are many equal elements and because
  //               the pivot is in A[right] this also acts as a sentinel, so
  //               we don't increment beyond the right of the array segment.
  //       \\Expl}
  //       Repeatedly decrement j until A[j] <= pivot or j < i \\B 8
  //       \\Expl{  Stopping at elements equal to the pivot results in better
  //               performance when there are many equal elements. If the
  //               indices cross we exit the outer loop; this also stops us
  //               decrementing beyond the left of the array segment.
  //       \\Expl}
  //       if j > i \\B 9
  //       \\Expl{  If the indices cross we exit the loop.
  //       \\Expl}
  //       \\In{
  //           swap(A[i], A[j]) \\B 10
  //           \\Expl{  Swap the larger element (A[i]) with the smaller
  //                   element (A[j]).
  //           \\Expl}
  //       \\In}
  //   \\In}
  //   Put the pivot in its final place    \\Ref SwapP
  //   \\Code}

  //   \\Code{
  //   init_iAndj
  //   i <- left + 1 \\B 11
  //   \\Expl{  Because we will be doing a preincrement, the i pointer is set to left - 1.
  //   \\Expl}
  //   j <- right \\B 12
  //   \\Expl{  The j pointer is set to right, rather than right + 1, because the pivot
  //           element is in A[right] and is not part of the partitioning.
  //   \\Expl}
  //   \\Code}

  //   \\Code{
  //   SwapP
  //   swap(A[i], A[right]) \\B 13
  //   \\Expl{  The pivot element, in A[right], is swapped with A[i]. All
  //           elements to the left of A[i] must be less then or equal to
  //           the pivot and A[i] plus all elements to its right must be
  //           greater than or equal to the pivot.
  //   \\Expl}
  //   \\Code}
  // `),

  explanation: QSExp,

  initVisualisers() {
    return {
      graph: {
        instance: new ArrayGraphTracer('graph', null, 'Array'),
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
