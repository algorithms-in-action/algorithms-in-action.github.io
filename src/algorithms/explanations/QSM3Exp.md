# Quicksort (*Median of Three* Partitioning)

---

Quicksort is a divide and conquer algorithm. It first rearranges the input
array into two smaller sub-arrays: the (relatively) low elements and the
(relatively) high elements. It then recursively sorts each of the sub-arrays.

Quicksort is a good general-purpose sorting algorithm, with average case behavior <i>O(n log n)</i>.  The *Median of Three* variant shown in this module reduces the likelihood that the worst case <i>O(n<sup>2</sup>)</i> behavior of Basic Quicksort will occur.

## Algorithm overview

The steps for 
*Median of Three Quicksort* are the same as for Basic Quicksort,
except for the method of choosing the *pivot* element.



* To pick the *pivot* element, first sort the first, middle and last elements of the array, then swap the
middle element with the second-rightmost element. Then 
pick the second-rightmost element of the array as the *pivot* (this
is the median of the original leftmost, middle and rightmost elements).

* Partitioning: reorder the array so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it. After this partitioning, the pivot is in its final position.

* Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.

The base case of the recursion is arrays of size one or zero, which are in order by definition, so they never need to be sorted.



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
complexity overall. While the worst case is still <i>O(n<sup>2</sup>)</i>, as for Basic Quicksort, the *Median of Three* strategy makes it extremely unlikely that partition will divide the sub-array
unevenly at each step unevenly enough to give this behavior. 


The pivot element is either the largest or
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

