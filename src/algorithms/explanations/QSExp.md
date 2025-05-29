# Quicksort

---

Quicksort is a divide and conquer algorithm. It first rearranges the input
array into two smaller sub-arrays: the (relatively) low elements and the
(relatively) high elements. It then recursively sorts each of the sub-arrays.

## Algorithm overview

The steps for basic Quicksort are:

* Pick the *pivot* element of the sub-array; here it is the rightmost
 element.

* Partitioning: reorder the sub-array so that only elements with values less than or equal to the pivot come before the pivot, while only elements with values greater than or equal to the pivot come after it. After this partitioning, the pivot is in its final position.

* Recursively apply the above steps to the sub-array of elements before the pivot and separately to the sub-array of elements after the pivot.

The base case of the recursion is sub-arrays of size one or zero, which are in order by definition, so they never need to be sorted.

## Partitioning

The way partitioning is done here is to use two pointers/indices to
scan through the sub-array. One starts at the left and scans right
in search for "large" elements (greater than or equal to the pivot).
The other starts at the right and scans left in search for "small"
elements (less than or equal to the pivot). Whenever a large and a small
element are found they are swapped.  When the two indices meet, the pivot
is swapped into that position and partitioning is complete.


## Time complexity

In the best case, partition divides the sub-array in half at each step,
resulting in <i>O(log n)</i> levels of recursion and <i>O(n log n)</i>
complexity overall. In the worst case, partition divides the sub-array
very unevenly at each step.  The pivot element is either the largest or
smallest element in the sub-array and one of the resulting partitions
is always empty, resulting in <i>O(n<sup>2</sup>)</i> complexity.
This occurs if the input is sorted or reverse-sorted. Refinements such
as median of three partitioning (shown elsewhere) make the worst case
less likely.  On average, partitioning is reasonably well balanced and
<i>O(n log n)</i> complexity results.

## Space complexity

Although there is no explicit additional space required, quicksort is
recursive, so it uses implicit stack space proportional to the depth of
recursion. The best and average cases are <i>O(log n)</i> but the worst
case is <i>O(n)</i>.



## Development of Quicksort

The first version of quicksort was published by Tony Hoare in 1961 and
quicksort remains the *fastest* sorting algorithm on average (subject to
various caveats).  The pivot selection and partitioning steps can be
done in *many* different ways and the choice of specific implementation
details and computer hardware can significantly affect the algorithm's
performance. In 1975, Robert Sedgewick completed a Ph.D. thesis on this
single algorithm.  Our presentation here is influenced by the original
Hoare version and some of Sedgewick's adaptations. 
