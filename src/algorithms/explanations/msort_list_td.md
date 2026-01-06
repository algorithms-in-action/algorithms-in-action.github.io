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

Splitting the list in half requires traversing to the middle of the list
(here we pass in the list length as a parameter; if the length is unknown
it can be computed using a traversal of the whole list before this
sorting code is called).  The main part of merge uses three pointers:
one for each of the input lists and one for the end of the output list
that is being constructed, so additional elements can be appended in
constant time.  At each stage the minimum input list element is appended
to the output list and the pointers for those two lists are advanced to
the next elements. When one input list has been completely traversed,
any additional elements in the other input list are linked onto to the
end of the output list. In this coding, the output list (a fourth pointer)
is initialised to point to the minimum first element of the input lists.

Versions of merge sort for lists are often the preferred sorting
algorithms in declarative languages, where lists are used extensively.
This algorithm can also be adapted to arrays (extra space and copying
is needed for merge; the list version here just rearranges pointers).
There are also non-recursive "bottom up" versions of merge sort. Because
merge sort only does sequential scans of the input and output at each
stage, it can also be adapted to sorting large quantities of data that
do not fit into main memories. Historically, when data was primarily
stored on magnetic tape, it was absolutely essential.

