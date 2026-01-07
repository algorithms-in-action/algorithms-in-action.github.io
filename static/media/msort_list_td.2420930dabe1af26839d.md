# Merge Sort (top-down, for lists)

---

Merge sort is a divide and conquer algorithm. This version operates on
linked lists (there is also a similar algorithm for arrays). Linked lists
(just called lists in many languages, particularly declarative languages)
are either empty (generally a null pointer) or a pointer to a list cell
containing a data item (the "head" of the list) and another list (the
"tail" of the list, which points to the next cell). Top-down merge sort
first splits the input list in half: the left and right (irrespective of
the element values). It then recursively sorts these two shorter lists
and merges the results to get a sorted complete list.  The base case
for the recursion is lists of size one or zero.

Splitting the list in half requires traversing to the middle of the list.
Here we pass in the list length as a parameter. If the length is unknown
it can be computed using a traversal of the whole list before this
sorting code is called.

The merge operation rearranges pointers so all the list cells in the
two input lists ***L*** and ***R*** are linked together, in order,
to form a new list ***M***. The new list is constructed by repeatedly
adding extra elements to the end, by assigning to the tail pointer in
the last cell, which is pointed to by another variable, ***E***. During
merge, the cells from ***M*** up to and including ***E*** are known to
be sorted and ***L*** and ***R*** point to the next cells in the input
lists, respectively - these haven't yet been added to ***M***. At each
step, the head of ***L*** and ***R*** are compared.  The tail of ***E***
is made to point to the minimum and ***E*** and the minimum of ***L***
and ***R*** advance to the next cell. When all elements of one of the
input lists have been added, the tail of ***E*** is made to point to
the remaining part of the other input list.

Versions of merge sort for lists are often the preferred sorting
algorithms in declarative languages, where lists are used extensively.
This algorithm can also be adapted to arrays (extra space and copying
is needed for merge; the list version here just rearranges pointers).
There are also non-recursive "bottom up" versions of merge sort. Because
merge sort only does sequential scans of the input and output at each
stage, it can also be adapted to sorting large quantities of data that
do not fit into main memories. Historically, when data was primarily
stored on magnetic tape, it was absolutely essential.

