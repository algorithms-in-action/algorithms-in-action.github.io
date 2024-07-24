import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ REAL specification of radix exchange sort
XXX modifying quicksort code
\\Note}

\\Code{
Main
Rexsort(A, n) // Sort array A[1]..A[n] in ascending order.
\\In{
    mask <- maximum bit used
    \\Expl{ mask is a power of two (a bit string with a single "1" in it). We
      start with the mask bit being at least as big as any bit that is "1" in
      the data. This can be determined from the word size used to represent
      the data or by scanning through the data (we do the latter here
      because only small examples are used).
    \\Expl}
    Rexsort1(A, 1, n, mask)
    \\Expl{  We need left and right indices because the code is recursive
        and both may be different for recursive calls. For each call, all
        elements in the array segment are guaranteed to have the same pattern
        of bits for all bits larger than the mask bit.
    \\Expl}
\\In}
//======================================================================
Rexsort1(A, left, right, mask) // Sort array A[left]..A[right] using bits up to mask  \\B 1
\\Expl}
    if (left < right and mask > 0) \\B 2
    \\Expl{  Terminating condition (if there are less than two
            elements in the array segment or no bits left, do nothing).
    \\Expl}
    \\In{
        Partition array segment using mask    \\Ref Partition 
        \\Expl{ This is where most of the work of Rexsort gets done.
                We start with an unordered array segment, and finish
                with an array segment containing elements with 0 as the
                mask bit at the left and 1 as the mask bit at the right.
                The index of the first "1" element is returned.
        \\Expl}
        Sort FirstPart   \\Ref RexsortFirst
        \\Expl{  Sort elements with 0 mask bit: A[left]..A[i-1]
        \\Expl}
        Sort SecondPart  \\Ref RexsortSecond
        \\Expl{  Sort elements with 1 mask bit: A[i]..A[right]
        \\Expl}
    \\In}
    // Done \\B 19
\\Code}

\\Code{
RexsortFirst
// *Recursively* sort first part: \\B 300
Rexsort1(A, left, i - 1) \\B 3
\\Code}

\\Code{
RexsortSecond
// *Recursively* sort second part: \\B 400
Rexsort1(A, i, right) \\B 4
\\Code}

\\Code{
Partition
Set index i at left the of array segment and j at the right    \\Ref init_iAndj 
\\Expl{  i scans from left to right stopping at "large" elements
(with "1" as the mask bit) and j scans from right to left
stopping at "small" (with "0" as the mask bit) elements.
\\Expl}
while i < j \\B 6
\\Expl{  When the indices cross, all the large elements at the left of
        the array segment have been swapped with small elements from the
        right of the array segment. The coding here can be simplified 
        if we use "break" or similar to exit from this loop.
\\Expl}
\\In{
    Repeatedly increment i until i >= j or A[i] has 1 as the mask bit \\B 7
    \\Expl{ XXX
    \\Expl}
    Repeatedly decrement j until j <= i or A[j] has 0 as the mask bit \\B 8
    \\Expl{ XXX
    \\Expl}
    if j > i \\B 9
    \\Expl{  If the indices cross, we exit the loop.
    \\Expl}
    \\In{
        swap(A[i], A[j]) \\B 10
        \\Expl{  Swap the larger element (A[i]) with the smaller
                element (A[j]).
        \\Expl}
    \\In}
\\In}
// Put the pivot in its final place
swap(A[i], A[right]) \\B 13
\\Expl{  The pivot element, in A[right], is swapped with A[i]. All
        elements to the left of A[i] must be less than or equal to
        the pivot and A[i] plus all elements to its right must be
        greater than or equal to the pivot, thus the pivot is now in its
        final position and is not considered further.
\\Expl}
\\Code}

\\Code{
init_iAndj
i <- left - 1 \\B 11
\\Expl{  The i pointer scans left to right with a preincrement, so
it is set to left - 1 (this may be off the left end of the array but
we never access that element).
\\Expl}
j <- right + 1 \\B 12
\\Expl{  The j pointer scans right to left with a predecrement and
is set to right + 1 (this may be off the left end of the array but
we never access that element).
\\Expl}
\\Code}

`);
