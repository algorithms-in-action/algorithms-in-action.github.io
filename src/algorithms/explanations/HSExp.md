# Heap Sort

---

Heapsort is a general purpose sorting algorithm that has *<verbatim>O(n log n)</verbatim>* behavior in the worst case. It achieves this by processing the data using a priority queue known as a heap.  

## Heap Data Structure

The heap is a priority queue that avoids the worst case behavior of lists and arrays as priority queues, where unsorted lists or arrays are
*<verbatim>O(n)</verbatim>* for finding and removing the maximum item (or minimum for a *min*-priority queue) and sorted lists or arrays are *<verbatim>O(n)</verbatim>* for inserting a new item into the priority queue.  In contrast, heaps are partially ordered, and exhibit *<verbatim>O(log n)</verbatim>* behavior for both insertion and removal of the largest item from the priority queue.

The items in a heap are stored in an array.  The array can be represented as a complete binary tree, where array element *<verbatim>A[i]</verbatim>* is a parent node with two children that are array elements *<verbatim>A[2i]</verbatim>* and *<verbatim>A[2i+1]</verbatim>*.     

 



## Sorting with the heap

To sort using a heap, we use a *max*-heap, which has the largest item at its root (first element in the array), and is formed 
 through a series of successive *DownHeap* operations.
 
Sorting then proceeds by repeating the following steps:

- swap the largest item (the root) with the last item in the array
- remove this largest item from further consideration
- reform the remaining data items into heap order by performing *DownHeap* from the new root

## Complexity

The worst case and nearly all cases have time complexity *O(n log n)*.
Space complexity is O(1), that is, no extra space is needed.




