# Heap Sort

---

Heapsort is a general purpose in-place sorting algorithm that has
*<verbatim>O(n log n)</verbatim>* behavior in the worst case. It achieves
this by first rearranging the array so it is a *heap* (which has some
ordering maintained; see below) then converting the heap into a sorted
array.

## The Heap Data Structure

A heap is a complete binary tree represented by an array, with
the root in *<verbatim>A[1]</verbatim>* and the children of
*<verbatim>A[i]</verbatim>* being *<verbatim>A[2i]</verbatim>* and
*<verbatim>A[2i+1]</verbatim>*. Each node is greater than or equal to
it's children (this is called the *heap condition*), thus the root is
the maximum (heap sort uses a "max" heap; there are also "min" heaps
where the ordering is reversed).  Note that there are no pointers etc -
we can view the array as a tree so as to understand the ordering.

## Building a heap "bottom up"

The best way to build a heap from an unordered array is to first note that
all the leaf nodes in the tree view are already heaps (they have no cildren
so the heap condition is satisfied), and work up the tree (backwards
through the array) to the root. Each step combines two existing heaps
plus their parent node to form a new heap (some rearrangement may be
needed; this is done by the *DownHeap* operation).

## Sorting with a heap

Sorting proceeds by repeating the following steps:

- swap the largest item (the root) with the last item in the array
- remove this largest item from further consideration (it is no longer
  considered part of the heap)
- reform the remaining data items into heap order by performing
  *DownHeap* on the new root (note the two children of the root remain
  heaps)

## The DownHeap operation

*DownHeap* traverses down the tree, swapping the data in the node with
the maximum child of the node.  It stops as soon as the data in the node
is greater than or equal to the maximum child (or the node is a leaf).
The time complexity is *O(log n)*

## Complexity

The worst case and nearly all other cases have time complexity *O(n log n)*.
Space complexity is O(1).




