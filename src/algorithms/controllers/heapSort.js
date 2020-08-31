/* eslint-disable brace-style */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import parse from '../../pseudocode/parse';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { BSTExp } from '../explanations';

export default {
  pseudocode: parse(`
  \\Note{  REAL specification of heapsort animation
    \\Note}
    
    \\Code{
    Main
    HeapSort(A, n) // Sort array A[1]..A[n] in ascending order.
    \\Expl{  We are not using A[0] (for languages that start array indices at 0).
    \\Expl}
    \\In{
        BuildHeap(A, n)    \\Ref BuildHeap 
        \\Expl{  First reorder the array elements so they form a (max) heap
                (no element is larger than its parent). The root node, A[1],
                is therefore the largest element.  
        \\Expl}
        SortHeap(A, n)    \\Ref SortHeap 
        \\Expl{  Convert the heap into a sorted array. The largest element is
                put in the correct position A[n] first and we work backwards 
                from there, putting the next-largest element in its place, 
                etc, shrinking the heap by one element at each step. 
        \\Expl}
    \\In}
    \\Code}
    
    \\Code{
    BuildHeap
    // build heap
    for k <- Index of last non-leaf downto 1    \\Ref BHForLoop 
    \\Expl{  We use bottom-up heap creation, to build the heap from the bottom
            up (tree view) and right to left (array view). The leaves are 
            already heaps of size 1, so nothing needs to be done with them. 
            Working backwards through the heap, and starting from the last 
            non-leaf node, we form heaps of up to size 3 (from 2 leaves plus
            their parent k), then 7 (2 heaps of size 3 and their parent k) 
            etc, until the whole array is a single heap. 
    \\Expl}
    \\In{
        DownHeap(A, k, n)    \\Ref DownHeapk 
        \\Expl{  DownHeap is where smaller heaps are combined to form larger
                heaps. The children of node k are already heaps, so we need
                only be concerned about where A[k] fits in. 
        \\Expl}
    \\In}
    \\Code}
    
    \\Code{
    BHForLoop
    for k <- n/2 downto 1                                           
    \\Expl{  Using root index 1, the last non-leaf has index n/2 (rounded down
            to the nearest integer).
    \\Expl}
    \\Code}
    
    \\Code{
    DownHeapk
    // DownHeap(A, k, n)
    \\Expl{  DownHeap is where smaller heaps are combined to form larger heaps.
            The children of node k are already heaps, so we need only be 
            concerned about where A[k] fits in. 
    \\Expl}
    i <- k                                                            
    \\Expl{  Set index i to the root of the subtree that we are now going to 
            make into a heap. 
    \\Expl}
    heap <- False // 'heap' is a flag                                 
    while not (IsLeaf(A[i]) or heap) 
    \\Expl{  Traverse down the heap until the current node A[i] is a leaf. 
            We also terminate the loop if the children of A[i] are in the 
            correct order relative to the parent, since we know that subtrees
            lower down already meet the heap condition. We use the heap flag
            to test the heap condition.  
    \\Expl}
    \\In{        
        j <- IndexOfLargestChild(A, i, n)    \\Ref IndexOfLargestk 
        \\Expl{  Find the larger of the two children of the node.
        \\Expl}
        if A[i] >= A[j] 
        \\In{
            heap <- True                                              
            \\Expl{  The heap condition is satisfied (the root is larger 
                    than both children), so exit from while loop. 
            \\Expl}
        \\In}
        else
        \\In{
            Swap(A[i], A[j]) // Swap root element with (larger) child 
            i <- j                                                    
        \\In}
    \\In}        
    \\Code}
    
    \\Code{
    IndexOfLargestk
    if 2*i < n and A[2*i] < A[2*i+1] 
    \\Expl{  The left child of A[i] is A[2*i] and the right child (if there is
            a right child) is A[2*i+1]; set j to the index of the larger child.
    \\Expl}
    \\In{
        j <- 2*i+1                                                    
    \\In}
    else
    \\In{
        j <- 2*i                                                      
    \\In}
    \\Code}
    
    \\Code{
    SortHeap
    // Sort heap
    while n > 1                                                         
    \\Expl{  A[1] always has the largest value not yet processed in the 
            sorting phase. A[n] is the last array element in the heap-ordered
            array that is not yet sorted. Repeatedly swap these two values, 
            so that the largest element is now in the last place, decrement n 
            and re-establish the heap condition for the remaining heap (which
            now has one less element). Repeat this procedure until n=1, that 
            is, only one node remains.  
    \\Expl}
    \\In{
        Swap(A[n], A[1])                                              
        n <- n-1                                                      
        DownHeap(A, 1, n)    \\Ref DownHeap1
        \\Expl{  Now that the root node has been swapped to the end, A[1] may 
                no longer be the largest element in the (reduced size) heap.
                Use the DownHeap operation to restore the heap condition. 
        \\Expl}
    \\In}
    \\Code}
    
    \\Note{  This is very similar to DownHeapk.
    \\Note}
    
    \\Code{
    DownHeap1
    // DownHeap(A, 1, n)
    i <- 1                                                            
    \\Expl{  Set index i to the root of the subtree that we are now going to 
            examine. 
    \\Expl}
    heap <- False // 'heap' is a flag                                 
    while not (IsLeaf(A[i]) or heap) do                               
    \\Expl{  Traverse down the heap until the current node A[i] is a leaf. 
            We also terminate the loop if the children of A[i] are in the 
            correct order relative to the parent, since we know that subtrees
            lower down already meet the heap condition. We use the heap flag
            to test the heap condition.  
    \\Expl}
    \\In{        
        j <- IndexOfLargestChild(A, i, n)    \\Ref IndexOfLargest0 
        \\Expl{  Find the larger of the two children of the node. 
        \\Expl}
        if A[i] >= A[j]         // Parent is larger than the largest child
                                                                      
        \\In{
            heap <- True                                              
            \\Expl{  The heap condition is satisfied, that is, the root is 
                    larger than both children, so we exit from the while loop.
            \\Expl}
        \\In}
        else
        \\In{
            Swap(A[i], A[j])    // Swap root element with (larger) child 
            i <- j                                                    
        \\In}
    \\In}        
    \\Code}
    
    \\Note{  Same as IndexOfLargestk (could possible reuse that; it is duplicated 
            here because it might make linking with animation easier if each code 
            expansion is used from a single place).
    \\Note}
    
    \\Code{
    IndexOfLargest0
    if 2*i < n and A[2*i] < A[2*i+1] 
    \\Expl{  The left child of A[i] is A[2*i] and the right child (if there is
            a right child) is A[2*i+1]; set j to the index of the larger child.
    \\Expl}
    \\In{
        j <- 2*i+1                                                    
    \\In}
    else
    \\In{
        j <- 2*i                                                      
    \\In}
    \\Code}
       
`),

  explanation: BSTExp,

  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array'),
        order: 0
      },
      heap: {
        instance: new GraphTracer('heap', null, 'Heap'),
        order: 1
      },
    };
  },

  /**
   * 
   * @param {object} chunker 
   * @param {array} nodes array of numbers needs to be sorted 
   */
  run(chunker, { nodes }) {
    const A = nodes;
    let n = nodes.length;
    let i;
    let heap;
    let swap;

    chunker.add(2, (vis, array) => {  
      vis.heap.setHeap(array);
      vis.array.set(array);
    }, [[...A]]);

    const swapAction = (b1, b2, n1, n2) => {
      chunker.add(b1, (vis, _n1, _n2) => {  
        vis.heap.visit(_n1 + 1);
        vis.heap.visit(_n2 + 1);
        vis.array.patch(_n1);
        vis.array.patch(_n2);
      }, [n1, n2]);

      chunker.add(b2, (vis, _n1, _n2) => {  
        vis.heap.swapNodes(_n1 + 1, _n2 + 1);
        vis.heap.leave(_n1 + 1);
        vis.heap.leave(_n2 + 1);
        vis.array.swapElements(_n1, _n2);
        vis.array.depatch(_n2);
        vis.array.depatch(_n1);
      }, [n1, n2]);
    };
 
    /** NOTE: In Linda's code, array index starts from 1 
     * index start from 0:
     * parent = k , left child = 2*k + 1, right child = 2*k + 2
     * index start from 1:
     * parent = k , left child = 2*k, right child = 2*k + 1
    */
    // k is the first non-leaf node
    for (let k = Math.floor(n / 2) - 1; k >= 0; k -= 1) {
      // chunker.add(3, (vis, index) => {
      //   vis.array.select(index);
      //   vis.heap.visit(index + 1);
      // }, [k]);

      chunker.add(3);
      let j;  
      i = k;
      chunker.add(6);
      heap = false;
      chunker.add(7);

      chunker.add(8);
      // chunker.add(8, (vis, index) => {
      //   vis.array.deselect(index);
      //   vis.heap.leave(A[index]);
      // }, [k]);

      
      // if current node's left child'index is greater than array length, 
      // then current node is a leaf
      while (!(2 * i + 1 >= n || heap)) {
        chunker.add(10);
        // chunker.add(10, (vis, index) => {
        //   vis.array.select(index);
        //   vis.heap.visit(A[index]);
        // }, [i]);
        // left child is smaller than right child
        if (2 * i + 2 < n && A[2 * i + 1] < A[2 * i + 2]) {
          j = 2 * i + 2;
          chunker.add(11);
          // chunker.add(11, (vis, index) => {
          //   vis.array.select(index);
          //   vis.heap.visit(A[index]);
          // }, [j]);
        } else {
          chunker.add(12);
          j = 2 * i + 1;
          chunker.add(13);
          // chunker.add(13, (vis, index) => {
          //   vis.array.select(index);
          //   vis.heap.visit(A[index]);
          // }, [j]);
        }

        chunker.add(14);
        // parent is greater than largest child
        if (A[i] >= A[j]) {
          heap = true;
          chunker.add(15);
        } else {
          chunker.add(16);
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          swapAction(17, 17, i, j);
          i = j;
          chunker.add(18);
        }
      }
    }

    while (n > 0) {
      chunker.add(20);
      let j;
      swap = A[n - 1];
      A[n - 1] = A[0];
      A[0] = swap;
      swapAction(21, 21, 0, n - 1);

      n -= 1;
      chunker.add(22);
      i = 0;
      chunker.add(24);
      heap = false;
      chunker.add(25);

      while (!(2 * i + 1 >= n || heap)) {
        chunker.add(26);
        if (2 * i + 2 < n && A[2 * i + 1] < A[2 * i + 2]) {
          chunker.add(28);
          j = 2 * i + 2;
          chunker.add(29);
        } else {
          chunker.add(30);
          j = 2 * i + 1;
          chunker.add(31);
        }

        if (A[i] >= A[j]) {
          chunker.add(32);
          heap = true;
          chunker.add(33);
        } else {
          chunker.add(34);
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          swapAction(35, 35, i, j);
          i = j;
          chunker.add(36);
        }
      }
    }
  },
};
