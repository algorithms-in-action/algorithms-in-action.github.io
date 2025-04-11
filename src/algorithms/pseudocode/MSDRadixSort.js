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
    RexsortRecursive(A, 1, n, mask) \\B 201
    \\Expl{  We need left and right indices because the code is recursive
        and both may be different for recursive calls. For each call, all
        elements in the array segment must have the same pattern
        of bits for all bits larger than the mask bit.
    \\Expl}
\\In}
//======================================================================
RexsortRecursive(A, left, right, mask) // Sort A[left]..A[right] \\B 200
\\Expl{
Sort A[left]..A[right];
only the mask bit and less significant bits are used for sorting. Higher bits
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
// *Recursively* sort smaller elements: \\B 400
RexsortRecursive(A, left, i-1, mask/2) \\B 401
\\Code}

\\Code{
MSDRadixSortRight
// *Recursively* sort larger elements: \\B 500
RexsortRecursive(A, i, right, mask/2) \\B 501
\\Code}

\\Code{
Partition
i,j <- left,right \\B 301
\\Expl{ i scans from left to right stopping at "large" elements
(with "1" as the mask bit) and j scans from right to left
stopping at "small" elements (with "0" as the mask bit).
\\Expl}
while i < j \\B 303
\\Expl{ When the indices meet/cross, all the large elements at the left of
        the array segment have been swapped with small elements from the
        right of the array segment. The coding here can be simplified
        if we use "break" or similar to exit from this loop.
\\Expl}
\\In{
    Increment i until the mask bit of A[i] = 1 or i >= j \\B 304
    \\Expl{ Scan right looking for a "large" element that is out of
        place (mask bit is one). Bitwise "and" between A[i] and mask can be used to
        extract the desired bit.
        Note we do the tests before incrementing i.
    \\Expl}
    Decrement j until the mask bit of A[j] = 0 or j <= i \\B 305
    \\Expl{ Scan left looking for a "small" element that is out of
        place (mask bit is zero). Bitwise "and" between A[i] and mask can be used to
        extract the desired bit.
        Note we do the tests before decrementing j.
    \\Expl}
    if i < j \\B 309
    \\Expl{ If the indices meet/cross, we exit the loop.
    \\Expl}
    \\In{
        swap(A[i], A[j]) \\B 310
        \\Expl{ Swap the larger element (A[i]) with the smaller
                element (A[j]).
        \\Expl}
        Increment i and decrement j \\B inc_dec
    \\In}
\\In}
\\Code}

`);
