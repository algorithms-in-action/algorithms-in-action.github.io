import parse from '../../pseudocode/parse';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { QSExp } from '../explanations';

export default {
  pseudocode: parse(`
  \\Note{ REAL specification of quicksort (simple version) for animation

  NOTE: Ultimately it would be nice to support different versions (eg,
  median of three partitioning, etc), in AIA. Ideally the list of algorithms
  presented by AIA should just include a single occurrence of quicksort.
  Different versions could be selected via a menu in the quicksort animation
  (or perhaps a sub-menu at the top level).  This version should be the
  default/first listed.
  \\Note}

  \\Code{
  Main
  // Sort array A[left]..A[right] in ascending order
  Quicksort(A, left, right) \\B 1
  \\Expl{  We need left and right indices because the code is recursive
          and both may be different for recursive calls.
  \\Expl}
      if (left < right) \\B 2
      \\Expl{  Terminating condition (if there are less than two
              elements in the array segment do nothing).
      \\Expl}
      \\In{
          Choose pivot    \\Ref ChoosePivot 
          \\Expl{  There are various ways to choose the "pivot", which
                  is used to distinguish (relatively) small elements
                  and (relatively) large elements in the partitioning
                  process.
          \\Expl}
          Partition array segment    \\Ref Partition 
          \\Expl{  This is where most of the work of Quicksort gets done.
                  We start with an unordered array segment, and finish
                  with an array segment containing the pivot in its final
                  place, A[i], and two partitions, one containing only
                  elements smaller than or equal to the pivot, and the other
                  containing only elements larger than or equal to the pivot.
                  There are various ways this can be coded, often with
                  some subtle points.
          \\Expl}
          Quicksort FirstHalf    \\Ref QuicksortFirstHalf 
          \\Expl{  Sort elements left of (smaller or equal to) the
                  pivot, which is in A[i].
          \\Expl}
          Quicksort SecondHalf    \\Ref QuicksortSecondHalf
          \\Expl{  Sort elements right of (greater or equal to) the
                  pivot, which is in A[i].
          \\Expl}
      \\In}
  \\Code}

  \\Code{
  QuicksortFirstHalf
  Quicksort(A, left, i - 1)
  \\Code}
  
  \\Code{
  QuicksortSecondHalf
  Quicksort(A, i + 1, right)
  \\Code}
  
  \\Code{
  ChoosePivot
  pivot <- A[right] \\B 3
  \\Expl{  This simple method of choosing a pivot just uses the rightmost 
          element of the array segment. Unfortunately it leads to very poor 
          performance in some common cases, such as when the array is almost 
          sorted already.
  \\Expl}
  \\Code}
  
  \\Code{
  Partition
  Set index i at left of the array segment and j at the right    \\Ref init_iAndj 
  \\Expl{  i scans from left to right stopping at large elements and
          j scans from right to left stopping at small elements.
  \\Expl}
  while i < j \\B 4
  \\Expl{  When the indices cross, all the large elements at the left of
          the array segment have been swapped with small elements from the
          right of the array segment. The coding here can be simplified 
          if we use "break" or similar to exit from this loop.
  \\Expl}
  \\In{
      Repeatedly increment i until A[i] >= pivot \\B 5
      \\Expl{  Stopping at elements equal to the pivot results in better
              performance when there are many equal elements and because 
              the pivot is in A[right] this also acts as a sentinel, so 
              we don't increment beyond the right of the array segment.
      \\Expl}
      Repeatedly decrement j until A[j] <= pivot or j < i \\B 6
      \\Expl{  Stopping at elements equal to the pivot results in better
              performance when there are many equal elements. If the 
              indices cross we exit the outer loop; this also stops us 
              decrementing beyond the left of the array segment.
      \\Expl}
      if j > i \\B 7
      \\Expl{  If the indices cross we exit the loop.
      \\Expl}
      \\In{
          swap(A[i], A[j]) \\B 8
          \\Expl{  Swap the larger element (A[i]) with the smaller
                  element (A[j]).
          \\Expl}
      \\In}
  \\In}
  Put the pivot in its final place    \\Ref SwapP 
  \\Code}
  
  \\Code{
  init_iAndj
  i <- left - 1 \\B 9
  \\Expl{  i is incremented before use, so A[left] is the first element
          in the left to right scan.
  \\Expl}
  j <- right \\B 10
  \\Expl{  j is decremented before use, so A[right-1] is the first
          element in the right to left scan (A[right] is the pivot).
  \\Expl}
  \\Code}
  
  \\Code{
  SwapP
  swap(A[i], A[right]) \\B 11
  \\Expl{  The pivot element, in A[right], is swapped with A[i]. All
          elements to the left of A[i] must be less then or equal to
          the pivot and A[i] plus all elements to its right must be
          greater than or equal to the pivot.
  \\Expl}
  \\Code}
`),

  explanation: QSExp,

  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array'),
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
    const A = [...nodes];
    const left = 0;
    const right = nodes.length - 1;

    chunker.add(1, (vis, array) => {
      vis.array.set(array);
    }, [nodes]);

    const swapAction = (b1, b2, n1, n2) => {
      chunker.add(b1, (vis, _n1, _n2) => {
        vis.array.patch(_n1);
        vis.array.patch(_n2);
      }, [n1, n2]);

      chunker.add(b2, (vis, _n1, _n2) => {
        vis.array.swapElements(_n1, _n2);
        vis.array.depatch(_n2);
        vis.array.depatch(_n1);
      }, [n1, n2]);
    };

    function partition(a, l, r) {
      // Choose pivot
      const pivot = a[r];
      chunker.add(3, (vis) => {
        vis.array.select(r);
      }, [a]);

      while (l < r) {
        chunker.add(4, (vis) => {
          vis.array.deselect(r);
        }, [a]);

        // Repeatedly increment l until A[l] >= pivot
        while (l < r && a[l] <= pivot) {
          // eslint-disable-next-line no-param-reassign
          l += 1;
        }
        // Swap
        // eslint-disable-next-line no-param-reassign
        a[r] = a[l];
        swapAction(8, 8, l, r);
        // Repeatedly decrement r until A[r] <= pivot or r < l
        while (l < r && pivot <= a[r]) {
          // eslint-disable-next-line no-param-reassign
          r -= 1;
        }
        // Swap
        // eslint-disable-next-line no-param-reassign
        a[l] = a[r];
        swapAction(11, 11, l, r);
      }
      // eslint-disable-next-line no-param-reassign
      a[r] = pivot;
      return r;
    }

    function QuickSort(a, l, r) {
      if (l < r) {
        chunker.add(2, (vis) => {
          vis.array.select(l);
          vis.array.select(r);
        }, [a]);

        chunker.add(3, (vis) => {
          vis.array.deselect(l);
          vis.array.deselect(r);
        }, [a]);

        const p = partition(a, l, r);
        //  Quicksort FirstHalf
        QuickSort(a, l, p - 1);
        //  Quicksort SecondHalf
        QuickSort(a, p + 1, r);
      }
    }

    QuickSort(A, left, right);
  },
};

/*
  function partition(a, l, r){
    // Choose pivot
    pivot = a[r]
    while(l < r) {
      // Repeatedly increment l until A[l] >= pivot
      while(l<r && a[l]<=pivot)
        l++;
      // Swap
      a[r] = a[l];
      // Repeatedly decrement r until A[r] <= pivot or r < l
      while(l<r&&pivot<=a[r])
        r--;
      // Swap
      a[l] = a[r];

    }
    a[r] = pivot;
    return r;
  }

  function QuickSort(a,left, right){
    if(left<right){
      l = partition(a, left, right)
      //  Quicksort FirstHalf
      QuickSort(a, left, l-1);
      //  Quicksort SecondHalf
      QuickSort(a, l+1, right);
    }
  }
*/
