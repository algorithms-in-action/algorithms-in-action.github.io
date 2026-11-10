# Merge Sort (bottom-up, for lists)

---

Merge sort is a divide and conquer algorithm. This version operates on
linked lists (there is also a similar algorithm for arrays). Linked lists
(just called lists in many languages, particularly declarative languages)
are either empty (generally a null pointer) or a pointer to a list cell
containing a data item (the "head" of the list) and another list (the
"tail" of the list, which points to the next cell). 

Rather than recursively splitting the input in half, as top-down merge
sort does, the bottom-up version starts with trivially sorted lists of
length one and repeatedly merges consecutive pairs of sorted lists to
form sorted lists of twice the length.

Here the input list ***L*** is first turned into ***LL***: 
a list of single element lists, one for each
element of ***L***. The algorithm then repeatedly scans through
***LL***, replacing each consecutive pair of lists by the single sorted
list formed by merging the pair. Each pass halves the number of lists in
***LL*** (if there are an odd number of lists, the last one is left
untouched and is merged in a later pass) and doubles their length, so
after around log(n) passes ***LL*** contains a single sorted list with
all the elements of ***L***, which is returned. No length parameter is
needed, unlike the top-down version, though each pass traverses all the
list cells.

Throughout, the list cells of ***L*** are reused rather than copied:
sorting proceeds by rearranging tail pointers, so data is never copied
and no significant extra space is required (the original list ***L*** is
destroyed in the process).

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
Because the bottom-up version avoids recursion, it is particularly
simple to implement in languages without recursion, and it can easily be
adapted to take advantage of partial sortedness of the input: instead of
starting with lists of length one, natural merge sort starts with
whatever sorted runs exist in the data. This algorithm can also be 
adapted to arrays (extra space and copying is needed for merge; 
the list version here just rearranges pointers). Because merge sort only 
does sequential scans of the input and output at each
stage, it can also be adapted to sorting large quantities of data that
do not fit into main memories. Historically, when data was primarily
stored on magnetic tape, it was absolutely essential.

