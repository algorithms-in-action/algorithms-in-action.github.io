# Merge Sort (bottom-up, for arrays)

---

Bottom up merge sort uses the idea of "runs" - sequences of elements
that are sorted.  Any array can be considered a sequence of runs, each
of length one. Mergesort repeatedly merges consecutive pairs of runs to
form runs of twice the length.  Thus from an initial run length of 1,
we get (half as many) runs of length 2, then runs of length 4, and so
on until the array has a single run.

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
which array is used for output for the different run lengths (not shown
here). This algorithm can easily be adapted to take advantage of partial
sortedness of the initial array. For example, instead of using fixed
run lengths starting with 1, natural merge sort uses whatever runs exist
in the data.  Bottom up merge sort can also be adapted to linked lists
(extra space and copying is not needed as we can just change the pointers
in the list, though extra traversal of the list must be done) and versions
of merge sort are often the preferred sorting algorithms in declarative
languages that use such data structures extensively.  Because merge
sort only does sequential scans of the input and output at each stage,
it can also be adapted to sorting large quantities of data that do not
fit into main memories. Historically, when data was primarily stored on
magnetic tape, versions of bottom up merge sort were absolutely essential.
There are recursive "top down" versions of merge sort, shown elsewhere.

