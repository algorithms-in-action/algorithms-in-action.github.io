# Merge Sort (top-down, for arrays)

---

Merge sort is a divide and conquer algorithm. It first divides the
input array in half: the left and right (irrespective of the element
values). It then recursively sorts the sub-arrays and merges the two
sorted sub-arrays to get a sorted complete array.  The base case for
the recursion is sub arrays of size one or zero.

The merge operation is not in-place - it requires O(n) extra space.  A
simple solution (used here) is to merge the two sorted sub-arrays to a
temporary array then copy them back to the original array. Merge uses
three pointers/indices that scan from left to right; one for each of the
input sub-arrays and one for the output array.  At each stage the
minimum input array element is copied to the output array and the
indices for those two arrays are incremented. When one input array has
been completely copied, any additional elements in the other input array
are copied to the output array.

Copying can be reduced by alternating which array is used for input and
which array is used for output at the different levels of recursion (not
shown here). This algorithm can easily be adapted to linked lists (extra
space and copying is not needed as we can just change the pointers in
the list) and versions of merge sort are often the preferred sorting
algorithms in declarative languages that use such data structures
extensively. There are also non-recursive "bottom up" versions of merge
sort. Because merge sort only does sequential scans of the input and
output at each stage, it can also be adapted to sorting large quantities
of data that do not fit into main memories. Historically, when data was
primarily stored on magnetic tape, it was absolutely essential.
