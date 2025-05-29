# Heap Sort

---

Heapsort is a general purpose sorting algorithm that has *<verbatim>O(n log n)</verbatim>* behavior on every input. It achieves this by processing the data using a priority queue known as a heap.  

### Heap Data Structure

The heap data structure is a priority queue that avoids the worst case behavior of lists and arrays, where unsorted lists or arrays are
*<verbatim>O(n)</verbatim>* for finding and removing the maximum (or minimum for a min-priority queue) item and sorted lists or arrays are *<verbatim>O(n)</verbatim>* for inserting a new item into the priority queue.  By contrast, heaps exhibit *<verbatim>O(log n)</verbatim>* behavior for both insertion and removal from the priority queue.

The items in a heap are stored in an array.  For ease of conceptualization, the array can be considered as a binary tree, where array element *<verbatim>A[i]</verbatim>* is a parent node with two children that are array elements *<verbatim>A[2i]</verbatim>* and *<verbatim>A[2i+1]</verbatim>*.     

Since there are no gaps in data in the array, the heap tree is complete. 
In a *max*-heap each node is larger or equal to both of its children. This property means that the root node, or the element *A[i]* is the largest item.   

PUT IN HERE SOMETHING ABOUT FORMING THE HEAP, I think.

### Sorting with the heap

Once the heap has been formed, sorting is straightforward.  Using a *max*-heap, repeatedly swap the root (largest item) with the last available item in the array and make this array element no longer available for swapping.  At this point, the root no longer contains the largest element, so the heap order must be restored.    

The heap is restored by checking every "parent node" in the array, to make sure it is larger than either of its "children". Parent nodes are at positions 1 - *n/2* in the array, because the last *n/2* nodes are leaves, *i.e.* have no children.  The parent node is checked to make sure it is larger than either of its two children.  If it is, then no action is necessary. If it isn't, then is it swapped with the largest of its two children. Initially we will be making a mini-heap of three items.  Then 


CONTINUE HERE 





MAYBE PUT SOMETHING in the More information tab about the analysis and why this is O(n).

## Complexity

Time complexity:
```
 Average Case     O(n log n) 
 Worst Case       O(n logn) 
 Best Case        O(n)         
 ```
       Note: Best case, when all elements are equal is O(n), although many sources
       list best case as O(n log n) 

Space complexity is always O(1), that is, no extra space is needed.

[ Previous Background treatment of complexity: Space complexity is O(1) in all cases.  Worst case and average case time
complexity is O(n log n). The best case time complexity is O(n), when
all elements are equal (despite many sources listing the best case as
O(n log n)).]: #


