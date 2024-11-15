import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ REAL specification of radix exchange sort
Modified quicksort code: will need extra bookmarks for top level plus
NOTE that j can start off the RHS of the array.
\\Note}

\\Code{
Main
Rexsort(A, n) // Sort array A[1]..A[n] in ascending order. \\B 1
\\In{
    mask <- maximum bit used \\B 100
    \\Expl{ mask is a power of two (a bit string with a single "1" in it). We
      start with the mask bit being at least as big as any bit that is "1" in
      the data. This can be determined from the word size used to represent
      the data or by scanning through the data (we do the latter here
      because only small examples are used).
    \\Expl}
    \\Note{ implementation should scan data
    \\Note}
    RexsortRecursive(A, 1, n, mask) \\B 200
    \\Expl{  We need left and right indices because the code is recursive
        and both may be different for recursive calls. For each call, all
        elements in the array segment must have the same pattern
        of bits for all bits larger than the mask bit.
    \\Expl}
\\In}
//======================================================================
RexsortRecursive(A, left, right, mask) // Sort array A[left]..A[right] using bits up to mask
\\Expl{
Only the mask bit and smaller bits are used for sorting; higher bits
should be the same for all data in the array segment.
\\Expl}
    if (left < right and mask > 0) \\B 300
    \\Expl{ Terminating condition (if there are less than two
            elements in the array segment or no bits left, do nothing).
    \\Expl}
    \\In{
        Partition array segment using mask    \\Ref Partition
        \\Expl{ This is where most of the work of MSDRadixSort gets done.
                We start with an unordered array segment, and finish
                with an array segment containing elements with 0 as the
                mask bit at the left and 1 as the mask bit at the right.
                Sets i to the index of the first "1" element (or
                right+1 if there are none).
        \\Expl}
        Sort Left Part   \\Ref MSDRadixSortLeft
        \\Expl{ Sort elements with 0 mask bit: A[left]..A[i-1]
        \\Expl}
        Sort Right Part   \\Ref MSDRadixSortRight
        \\Expl{ Sort elements with 1 mask bit: A[i]..A[right]
        \\Expl}
    \\In}
    // Done \\B 5000
\\Code}

\\Code{
MSDRadixSortLeft
// *Recursively* sort first part: \\B 400
RexsortRecursive(A, left, i-1, mask-1) \\B 401
\\Code}

\\Code{
MSDRadixSortRight
// *Recursively* sort first part: \\B 500
RexsortRecursive(A, i, right, mask-1) \\B 501
\\Code}

\\Code{
Partition
Set index i at left the of array segment and j at the right    \\Ref InitCounters
\\Expl{ i scans from left to right stopping at "large" elements
(with "1" as the mask bit) and j scans from right to left
stopping at "small" elements (with "0" as the mask bit).
\\Expl}
while i < j \\B 303
\\Expl{ When the indices cross, all the large elements at the left of
        the array segment have been swapped with small elements from the
        right of the array segment. The coding here can be simplified
        if we use "break" or similar to exit from this loop.
\\Expl}
\\In{
    Repeatedly increment i until i >= j or A[i] has 1 as the mask bit \\B 304
    \\Expl{ Scan right looking for a "large" element that is out of
        place. Bitwise "and" between A[i] and mask can be used to
        extract the desired bit.
    \\Expl}
    Repeatedly decrement j until j <= i or A[j] has 0 as the mask bit \\B 305
    \\Expl{ Scan left looking for a "small" element that is out of
        place. Bitwise "and" between A[i] and mask can be used to
        extract the desired bit.
    \\Expl}
    if j > i \\B 309
    \\Expl{ If the indices cross, we exit the loop.
    \\Expl}
    \\In{
        swap(A[i], A[j]) \\B 310
        \\Expl{ Swap the larger element (A[i]) with the smaller
                element (A[j]).
        \\Expl}
    \\In}
\\In}
\\Code}

\\Code{
InitCounters
i <- left \\B 301
\\Expl{ The i pointer scans left to right, so it is set to left
\\Expl}
j <- right \\B 302
\\Expl{ The j pointer scans right to left, so it is set to right
\\Expl}
\\Code}

`);
