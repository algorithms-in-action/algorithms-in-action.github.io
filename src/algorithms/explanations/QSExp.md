# Quicksort

---

Quicksort is a divide and conquer algorithm. It first rearranges the input
array into two smaller sub-arrays: the (relatively) low elements and the
(relatively) high elements. It then recursively sorts each of the sub-arrays.

### Sorting using Basic Quicksort

The steps for basic Quicksort, used in this animation are:

* Pick the rightmost element of the array, called a pivot.

* Partitioning: reorder the array so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it. After this partitioning, the pivot is in its final position.

* Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.

The base case of the recursion is arrays of size one or zero, which are in order by definition, so they never need to be sorted.


### Complexity

Time complexity:
<code>
   Average case     <i>O(nlogn)</i>
   Worst case       <i>O(n<sup>2</sup>)</i>
   Best case        <i>O(nlogn)</i>

Note: Worst case in simple quicksort occurs when a file is already sorted, since the partition is highly asymmetrical. Improvements such as median-of-three quicksort make a significant improvement, although worst case behaviour is still possible.  
</code>

Space complexity is O(1), that is, no extra space is required.



### Development of Quicksort

The first version of quicksort was published by Tony Hoare in 1961 and
quicksort remains the *fastest* sorting algorithm on average (subject to
various caveats).  The pivot selection and partitioning steps can be
done in *many* different ways and the choice of specific implementation
details and computer hardware can significantly affect the algorithm's
performance. In 1975, Robert Sedgewick completed a Ph.D. thesis on this
single algorithm.  Our presentation here is influenced by the original
Hoare version and some of Sedgewick's adaptations. 