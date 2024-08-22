import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ This is a copied+modified version of the top down mergesort pseudocode.
Merge is identical and bookmarks have been left in (but more will be needed
for the code that is not the same). Ideally the animation sould look as
similar to the top down version as possible.  There is no call stack but
runlength could be displayed where the top down stack is displayed.
\\Note}

\\Code{
Main
// Sort array A[1]..A[size] in ascending order
Mergesort(A, size) \\B Main
    runlength <- 1 // each element is a (sorted) run of length 1 \\B runlength
    while runlength < size \\B MainWhile
    \\Expl{ We stop when the whole array is a single run.
    \\Expl}
    \\In{
        merge all consecutive pairs of runs of length runlength \\Ref MergeAll
        runlength <- runlength * 2 // merging runs doubles the run length \\B runlength2
    \\In}
\\Code}

\\Code{
MergeAll
    left <- 1 \\B left
    while left + runlength < size \\B MergeAllWhile
    \\Expl{ Unless size is a power of two there can be times when the
        number of runs is odd and we have a "leftover" run at the end
        (with length <= runlength), that will be merged in a later iteration.
    \\Expl}
    \\In{
        mid <- left + runlength - 1 // first run is A[left..mid] \\B mid
        right <- minimum(mid+runlength, size) // next is A[mid+1..right] \\B right
        \\Expl{ The rightmost run in A may be shorter than runlength
        \\Expl}
        merge A[left..mid] and A[mid+1..right], with the result in A \\Ref MergeCopy
        left <- right + 1 // skip to the next pair of runs (if any)
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
