import parse from '../../pseudocode/parse';
import ArrayGraphTracer from '../../components/DataStructures/ArrayGraph/ArrayGraphTracer';
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
  Quicksort(A, left, i) \\B 3
  \\Code}
  
  \\Code{
  QuicksortSecondHalf
  Quicksort(A, i + 1, right) \\B 4
  \\Code}
  
  \\Code{
  ChoosePivot
  pivot <- A[right] \\B 5
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
  while i < j \\B 6
  \\Expl{  When the indices cross, all the large elements at the left of
          the array segment have been swapped with small elements from the
          right of the array segment. The coding here can be simplified 
          if we use "break" or similar to exit from this loop.
  \\Expl}
  \\In{
      Repeatedly increment i until A[i] >= pivot \\B 7
      \\Expl{  Stopping at elements equal to the pivot results in better
              performance when there are many equal elements and because 
              the pivot is in A[right] this also acts as a sentinel, so 
              we don't increment beyond the right of the array segment.
      \\Expl}
      Repeatedly decrement j until A[j] <= pivot or j < i \\B 8
      \\Expl{  Stopping at elements equal to the pivot results in better
              performance when there are many equal elements. If the 
              indices cross we exit the outer loop; this also stops us 
              decrementing beyond the left of the array segment.
      \\Expl}
      if j > i \\B 9
      \\Expl{  If the indices cross we exit the loop.
      \\Expl}
      \\In{
          swap(A[i], A[j]) \\B 10
          \\Expl{  Swap the larger element (A[i]) with the smaller
                  element (A[j]).
          \\Expl}
      \\In}
  \\In}
  Put the pivot in its final place    \\Ref SwapP 
  \\Code}
  
  \\Code{
  init_iAndj
  i <- left + 1 \\B 11
  \\Expl{  Because we will be doing a preincrement, the i pointer is set to left - 1.
  \\Expl}
  j <- right \\B 12
  \\Expl{  The j pointer is set to right, rather than right + 1, because the pivot
          element is in A[right] and is not part of the partitioning.
  \\Expl}
  \\Code}
  
  \\Code{
  SwapP
  swap(A[i], A[right]) \\B 13
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
      graph: {
        instance: new ArrayGraphTracer('graph', null, 'Graph'),
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
    function partition(values, left, right, parentId) {
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
      const id = `${left}/${right}`;
      chunker.add(2);
      if (left < right) {
        [p, a] = partition(a, left, right, parentId);
        chunker.add(3, (vis, id_, parentId_, values) => {
          vis.graph.addNode(id_, values);
          vis.graph.addEdge(parentId_, id_);
        }, [id, parentId, [...array].splice(left, right - left + 1)]);
        QuickSort(a, left, p - 1, id);
        chunker.add(4);
        QuickSort(a, p + 1, right, id);
      }
      return a; // Facilitates testing
    }

    chunker.add(1, (vis, values) => {
      vis.graph.addNode(`0/${values.length}`, values);
    }, [nodes]);
    return QuickSort(nodes, 0, nodes.length - 1, `0/${nodes.length - 1}`);
  },
  //      chunker.add(2);
  //       chunker.add(2, (vis, values) => {
  //         vis.graph.addNode(`${left}/${right}`, values.splice(left, right - left + 1));
  //       });
  //   const A = [...nodes];
  //   const left = 0;
  //   const right = nodes.length - 1;
  //
  //   const rootId = 0;
  //   let nextLeftNode = 0;
  //   let nextRightNode = 0;
  //   let pivotId = '';
  //
  //   let leftArray = [];
  //   let rightArray = [];
  //
  //   chunker.add(1, (vis, array) => {
  //     vis.graph.addNode(`${rootId}`, array);
  //   }, [nodes]);
  //
  //   const swapAction = (b1, b2, n1, n2) => {
  //     chunker.add(b1, (vis, _n1, _n2) => {
  //       // vis.array.patch(_n1);
  //       // vis.array.patch(_n2);
  //     }, [n1, n2]);
  //
  //     chunker.add(b2, (vis, _n1, _n2) => {
  //       // vis.array.swapElements(_n1, _n2);
  //       // vis.array.depatch(_n2);
  //       // vis.array.depatch(_n1);
  //     }, [n1, n2]);
  //   };
  //
  //   function partition(a, l, r, parentId) {
  //     leftArray = [];
  //     rightArray = [];
  //
  //     let i = l;
  //     const lim = r;
  //
  //     // Choose pivot
  //     const pivot = a[r];
  //
  //     while (l < r) {
  //       // Repeatedly increment l until A[l] >= pivot
  //       while (l < r && a[l] <= pivot) {
  //         // eslint-disable-next-line no-param-reassign
  //         l += 1;
  //       }
  //       // Swap
  //       // eslint-disable-next-line no-param-reassign
  //       a[r] = a[l];
  //
  //       // Repeatedly decrement r until A[r] <= pivot or r < l
  //       while (l < r && pivot <= a[r]) {
  //         // eslint-disable-next-line no-param-reassign
  //         r -= 1;
  //       }
  //       // Swap
  //       // eslint-disable-next-line no-param-reassign
  //       a[l] = a[r];
  //     }
  //     // eslint-disable-next-line no-param-reassign
  //     a[r] = pivot;
  //
  //     while (i <= lim) {
  //       if (i < r) {
  //         leftArray.push(a[i]);
  //         i += 1;
  //       } else if (i > r) {
  //         rightArray.push(a[i]);
  //         i += 1;
  //       } else {
  //         i += 1;
  //       }
  //     }
  //
  //     if (leftArray.length !== 0 && rightArray.length !== 0) {
  //       nextLeftNode += 1;
  //       nextRightNode += r + 1;
  //
  //       chunker.add(13, (vis, leftA, _pivot, rightA) => {
  //         vis.graph.addNode(`${nextRightNode}`, rightA);
  //         vis.graph.addEdge(`${parentId}`, `${nextRightNode}`);
  //         vis.graph.addNode(`${pivotId}`, _pivot);
  //         vis.graph.addEdge(`${parentId}`, `${pivotId}`);
  //         vis.graph.addNode(`${nextLeftNode}`, leftA);
  //         vis.graph.addEdge(`${parentId}`, `${nextLeftNode}`);
  //       }, [leftArray, pivot, rightArray]);
  //     } else if (leftArray.length === 0 && rightArray.length !== 0) {
  //       nextRightNode += 1;
  //
  //       chunker.add(13, (vis, _pivot, rightA) => {
  //         vis.graph.addNode(`${nextRightNode}`, rightA);
  //         vis.graph.addEdge(`${parentId}`, `${nextRightNode}`);
  //         vis.graph.addNode(`${pivotId}`, _pivot);
  //         vis.graph.addEdge(`${parentId}`, `${pivotId}`);
  //       }, [pivot, rightArray]);
  //     } else if (leftArray.length !== 0 && rightArray.length === 0) {
  //       nextLeftNode += 1;
  //
  //       chunker.add(13, (vis, leftA, _pivot) => {
  //         vis.graph.addNode(`${pivotId}`, _pivot);
  //         vis.graph.addEdge(`${parentId}`, `${pivotId}`);
  //         vis.graph.addNode(`${nextLeftNode}`, leftA);
  //         vis.graph.addEdge(`${parentId}`, `${nextLeftNode}`);
  //       }, [leftArray, pivot]);
  //     }
  //
  //     pivotId = `${pivotId}P`;
  //
  //     return r;
  //   }
  //
  //   function QuickSort(a, l, r, parentId) {
  //     if (l < r) {
  //       const p = partition(a, l, r, parentId);
  //
  //       //  Quicksort FirstHalf
  //       chunker.add(3);
  //       QuickSort(a, l, p - 1, `${nextLeftNode}`);
  //
  //       //  Quicksort SecondHalf
  //       chunker.add(4);
  //       QuickSort(a, p + 1, r, `${nextRightNode}`);
  //     }
  //   }
  //
  //   QuickSort(A, left, right, rootId);
  // },
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
      while(l<r && pivot<=a[r])
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
