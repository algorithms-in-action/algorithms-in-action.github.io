# Heap Sort

---

Heap Sort is a popular and efficient sorting algorithm in computer programming. Learning how to write the heap sort algorithm requires knowledge of two types of data structures - arrays and trees.

The initial set of numbers that we want to sort is stored in an array e.g. `[10, 3, 76, 34, 23, 32]` and after sorting, we get a sorted array `[3,10,23,32,34,76]`.

Heap sort works by visualizing the elements of the array as a special kind of complete binary tree called a heap.

## Heap Data Structure

Heap is a special tree-based data structure. A binary tree is said to follow a heap data structure if

* It is a complete binary tree.
* All nodes in the tree follow the property that they are greater than their children i.e. the largest element is at the root and both its children and smaller than the root and so on. Such a heap is called a max-heap. If instead, all nodes are smaller than their children, it is called a min-heap

## Sorting Time Complexity

Best case | Average case | Worst case
--- | --- | ---
O(n log n) | O(n log n) | O(n log n) |
