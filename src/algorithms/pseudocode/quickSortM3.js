import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ REAL specification of quicksort (median of 3 version) for animation

\\Note}
    
\\Code{
Main
// Sort array A[left]..A[right] in ascending order
Quicksort(A, left, right) \\B 1
\\Expl{  We need left and right indices because the code is recursive
        and both may be different for recursive calls.
\\Expl}
    if (left < right) \\B 2
    \\Expl{  Terminating condition (if there are less than two
            elements in the array segment do nothing).
    \\Expl}
    \\In{
        Choose pivot    \\Ref ChoosePivot 
        \\Expl{  There are various ways to choose the "pivot", which is
                used to distinguish (relatively) small elements and
                (relatively) large elements in the partitioning process.
        \\Expl}
        Partition array segment    \\Ref Partition 
        \\Expl{  This is where most of the work of Quicksort gets done.
                We start with an unordered array segment, and finish
                with an array segment containing the pivot in its final
                place, A[i], and two partitions, one containing only
                elements smaller than or equal to the pivot, and the other
                containing only elements larger than or equal to the pivot.
                There are various ways this can be coded, often with
                some subtle points.
        \\Expl}
         Quicksort FirstHalf    \\Ref QuicksortFirstHalf 
        \\Expl{  Sort elements left of (smaller or equal to) the pivot,
                which is in A[i].
        \\Expl}
        Quicksort SecondHalf    \\Ref QuicksortSecondHalf
        \\Expl{  Sort elements right of (greater or equal to) the pivot,
                which is in A[i].
        \\Expl}
    \\In}
\\Code}
    
\\Code{
QuicksortFirstHalf
Quicksort(A, left, i - 1) \\B 3
\\Code}
    
\\Code{
QuicksortSecondHalf
Quicksort(A, i + 1, right) \\B 4
\\Code}
    
\\Code{
ChoosePivot
Put the left, right and middle elements in increasing order    \\Ref SortLMR
\\Expl{  This method of choosing a pivot uses the median of the left,
        right and middle elements of the array segment. Sorting the left,
        middle and and right elements ensures the median is in the middle
        plus A[left] and A[right] are in their correct partitions, so 
        they can be skipped in the rest of the partitioning.
\\Expl}
Swap(A[mid], A[right-1]) // put median in A[right-1]

pivot <- A[right-1] \\B 5
\\Expl{  Using the median of the left, right and middle elements for the
        pivot leads to very good performance for sorted and reverse sorted
        inputs, and the theoretical worse case is rarely encountered.
\\Expl}
\\Code}
    
\\Code{
SortLMR
mid <- (left+right)/2 // index of middle element \\B 14
if A[left] > A[mid]
\\In{
    Swap(A[left], A[mid])
\\In}
if A[mid] > A[right]
\\In{
    Swap(A[right], A[mid])
    if A[left] > A[mid]
    \\In{
        Swap(A[left], A[mid])
    \\In}
    // now A[left] <= A[mid] <= A[right]
\\In}
\\Code}
    
\\Code{
Partition
Set index i at left the of array segment and j at the right    \\Ref init_iAndj 
\\Expl{  i scans from left to right stopping at large elements and
        j scans from right to left stopping at small elements.
\\Expl}
while i < j \\B 6
\\Expl{  When the indices cross, all the large elements at the left of
        the array segment have been swapped with small elements from the
        right of the array segment. The coding here can be simplified 
        if we use "break" or similar to exit from this loop.
\\Expl}
\\In{
    Repeatedly increment i until A[i] >= pivot \\B 7
    \\Expl{  Stopping at elements equal to the pivot results in better
            performance when there are many equal elements and because
            the pivot is in A[right] this also acts as a sentinel so we 
            don't increment beyond the right of the array segment.
    \\Expl}
    Repeatedly decrement j until A[j] <= pivot or j < i \\B 8
    \\Expl{  Stopping at elements equal to the pivot results in better
            performance when there are many equal elements. If the 
            indices cross we exit the outer loop; this also stops us 
            decrementing beyond the left of the array segment.
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
Put the pivot in its final place    \\Ref SwapP 
\\Code}
    
\\Code{
init_iAndj
i <- left \\B 11
\\Expl{  i is incremented before use, so A[left+1] is the first
        element in the left to right scan (A[left] <= pivot already).
\\Expl}
j <- right - 1 \\B 12
\\Expl{  j is decremented before use, so A[right-2] is the first
        element in the right to left scan (A[right-1] is the pivot).
\\Expl}
\\Code}
    
\\Code{
SwapP
swap(A[i], A[right]) \\B 13
\\Expl{  The pivot element, in A[right], is swapped with A[i]. All
        elements to the left of A[i] must be less then or equal to
        the pivot and A[i] plus all elements to its right must be
        greater than or equal to the pivot.
\\Expl}
\\Code}
`);
