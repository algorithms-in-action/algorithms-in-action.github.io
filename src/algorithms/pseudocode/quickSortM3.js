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
        Sort FirstPart   \\Ref QuicksortFirst
        \\Expl{  Sort elements left of (smaller or equal to) the pivot, which is in A[i].
        \\Expl}
        Sort SecondPart  \\Ref QuicksortSecond
        \\Expl{  Sort elements right of (greater or equal to) the pivot, which is in A[i].
        \\Expl}
    \\In}
    // Done \\B 19
\\Code}

\\Code{
QuicksortFirst
// *Recursively* sort first part: \\B 300
Quicksort(A, left, i - 1) \\B 3
\\Code}

\\Code{
QuicksortSecond
// *Recursively* sort second part: \\B 400
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
Swap(A[mid], A[right - 1]) // put median in A[right-1] \\B 18

pivot <- A[right - 1] \\B 5
\\Expl{  Using the median of the left, right and middle elements for the
        pivot leads to very good performance for sorted and reverse sorted
        inputs, and the theoretical worse case is rarely encountered.
\\Expl}
\\Code}
    
\\Code{
SortLMR
mid <- (left + right) / 2 // index of middle element \\B 14
if A[left] > A[mid] \\B 20
\\In{
    Swap(A[left], A[mid]) \\B 15
\\In}
if A[mid] > A[right] \\B 21
\\In{
    Swap(A[right], A[mid]) \\B 16
    if A[left] > A[mid] \\B 22
    \\In{
        Swap(A[left], A[mid]) \\B 17
    \\In}
    // now A[left] <= A[mid] <= A[right]
\\In}
\\Code}
    
\\Code{
Partition
Set index i at left the of array segment and j at the right    \\Ref init_iAndj 
\\Expl{  i scans from left to right stopping at "large" elements
(greater than or equal to the pivot) and j scans from right to left
stopping at "small" (less than or equal to the pivot) elements.
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
// Put the pivot in its final place
swap(A[i], A[right - 1]) \\B 13
\\Expl{  The pivot element, in A[right-1], is swapped with A[i]. All
        elements to the left of A[i] must be less then or equal to
        the pivot and A[i] plus all elements to its right must be
        greater than or equal to the pivotC thus the pivot is now in its
        final position and is not considered further.
\\Expl}
\\Code}
    
\\Code{
init_iAndj
i <- left \\B 11
\\Expl{  The i pointer scans left to right with a preincrement and
is set to left (A[left] is known to be less than or equal to the
pivot).
\\Expl}
j <- right - 1 \\B 12
\\Expl{  The j pointer scans right to left with a predecrement and
is set to right-1. A[right] is known to be greater than or equal to the
pivot and the pivot, in A[right-1], is skipped in the
scanning it is swapped into its correct position at the end).
\\Expl}
\\Code}
    
`);
