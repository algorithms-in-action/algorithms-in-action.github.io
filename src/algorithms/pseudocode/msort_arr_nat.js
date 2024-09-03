import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ Natural merge sort. This is a copied+modified version of the
bottom up mergesort pseudocode (possibly not the final version) which
was a copied+modified version of the top down mergesort pseudocode.
There is a fair bit of commonality (including the merge code).
\\Note}

\\Code{
Main
// Sort array A[1]..A[size] in ascending order
NaturalMergesort(A, size) \\B Main
    do \\B MainWhile
    \\In{
        merge all consecutive pairs of runs \\Ref MergeAll
    \\In}
    until there is only one run
    \\Expl{ Each iteration typically halves the number of runs and when
        there is only one left the array is sorted. During the merging
        of consecutive runs we count the number of runs.
    \\Expl}
\\Code}

\\Code{
MergeAll
    runcount <- 0 // we count the runs (for the outer loop condition)
    left <- 1 \\B left
    do \\B MergeAllWhile
        find the first run, A[left..mid] \\Ref FirstRun
        \\Expl{ We compute mid to get the longest sequence where A[left] <=
            A[left+1] <= ... <= A[mid].
        \\Expl}
        find the second run, A[mid+1..right] // could be empty \\Ref SecondRun
        \\Expl{ We compute right to get the longest sequence where A[mid+1] <=
            A[mid+2] <= ... <= A[right].  If mid = size this will be empty.
        \\Expl}
        if mid < size // if the second run isn't empty
        \\Expl{ If the number of runs is odd, the last one
            found doesn't need to be merged. This test could be
            moved before the code to find the second run and/or used to
            break out of the loop.
        \\Expl}
        \\In{
            merge A[left..mid] and A[mid+1..right], with the result in A \\Ref MergeCopy
        \\In}
        runcount <- runcount + 1
        left <- right + 1 // skip to the next pair of runs (if any) \\B left2
    until left >= size
    \\In}
\\Code}

\\Code{
FirstRun
    mid <- left
    while mid < size and A[mid] <= A[mid+1]
    \\Expl{ Scan until we find an element that is less than the previous
        element (or we reach the end).
    \\Expl}
    \\In{
        mid <- mid + 1
    \\In}
\\Code}

\\Code{
SecondRun
    right <- mid + 1
    while right < size and A[right] <= A[right+1]
    \\Expl{ Scan until we find an element that is less than the previous
        element (or we reach the end).
    \\Expl}
    \\In{
        right <- right + 1
    \\In}
\\Code}

\\Note{ 
XXXXXXXXXXXXXXXXXXXXXXXXXXXXX following verbatim from top-down mergesort
\\Note}

\\Code{
MergeCopy
    Merge(A, left, mid, right, B) \\Ref Merge
    \\Expl{ Takes two sorted array segments, A[left..mid] and A[mid+1..right],
        and merges them together to form a single sorted array segment
        in temporary array B[left..right].
        The animation shows values being deleted from A since they
        are no longer needed (they are actually still there).
    \\Expl}
    Copy merged elements back to A \\B copyBA
    \\Expl{ Copy elements from B[left..right] back to A[left..right].
        Copying can be reduced by merging
        from A to B and from B to A in alternate levels of recursion -
        a slightly more tricky coding.
        The animation shows values being deleted from B since they
        are no longer needed (they are actually still there).
    \\Expl}
    \\Note{ Might be better to move above to overview.
    \\Note}
\\Code}

\\Code{
Merge
    ap1 <- left \\B ap1
    max1 <- mid \\B max1
    \\Expl{ ap1 scans through the segment A[left..mid], "pointing at" or
        indexing elements of this array segment we copy from.
    \\Expl}
    ap2 <- max1+1 \\B ap2
    max2 <- right \\B max2
    \\Expl{ ap2 scans through the segment A[mid+1..right], "pointing at" or
        indexing elements of this array segment we copy from.
    \\Expl}
    bp <- ap1 \\B bp
    \\Expl{ bp scans through the segment B[left..right], "pointing at" or
        indexing elements of this array segment we copy to.
    \\Expl}
    while both A segments still have elements to copy \\Ref MergeWhile
    \\Expl{ we scan through both A segments from left to right by 
        incrementing ap1 and ap2, copying to B as we go.
        The animation shows values being deleted from A since they
        are no longer needed (they are actually still there).
    \\Expl}
    \\In{
        copy the smaller A element, increment its pointer and bp \\Ref CopySmaller
        \\Expl{ The smaller of A[ap1] and A[ap2] is copied to B[bp].
        \\Expl}
    \\In}
    copy any remaining elements from A to B \\Ref CopyRest
    \\Expl{ One of the A segments will have been completely copied;
        the other has uncopied elements.
    \\Expl}
\\Code}

\\Code{
MergeWhile
    while ap1 <= max1 and ap2 <= max2 \\B MergeWhile
    \\Expl{ Elements up to max1/max2 must be copied; those before
        ap1/ap2 have been copied already.
    \\Expl}
\\Code}

\\Code{
CopySmaller
    if A[ap1] < A[ap2] \\B findSmaller
    \\In{
        B[bp] <- A[ap1] \\B copyap1
        \\Expl{ The animation shows the value being deleted from A[ap1] since it
            is no longer needed (it is actually still there).
        \\Expl}
        ap1 <- ap1+1    \\B ap1++
        bp <- bp+1      \\B bp++
        \\Note{ Clearer to duplicate this in then and else branches(?)
        \\Note}
    \\In}
    else
    \\In{
        B[bp] <- A[ap2] \\B copyap2
        \\Expl{ The animation shows the value being deleted from A[ap2] since it
            is no longer needed (it is actually still there).
        \\Expl}
        ap2 <- ap2+1    \\B ap2++
        bp <- bp+1      \\B bp++_2
    \\In}
\\Code}

\\Code{
CopyRest
    copy A[ap1..max1] to B[bp..] \\B CopyRest1
    \\Note{ Need to expand this? I dont think so.
    \\Note}
    copy A[ap2..max2] to B[bp..] \\B CopyRest2
    \\Expl{ One of these copy steps will do nothing because one of the
        A segments will be empty. If ap2 is not shown in the animation
        it is max2+1, off the end of the array.
        The animation shows values being deleted from A since they
        are no longer needed (they are actually still there).
    \\Expl}
\\Code}

`);
