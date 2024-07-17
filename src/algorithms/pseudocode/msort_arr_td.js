import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
// Sort array A[left]..A[right] in ascending order
Mergesort(A, left, right) \\B Main
\\Expl{  We need left and right indices because the code is recursive
        and both may be different for recursive calls.
\\Expl}
    if left < right \\B left<right
    \\Expl{  Terminating condition (if there are less than two
            elements in the array segment it's already sorted).
    \\Expl}
    \\In{
        mid <- (left + right)/2 \\B mid
        sort first half, A[left]..A[mid]    \\Ref MergesortL
        \\Expl{ Sort elements in the first half of the array segment.
        \\Expl}
        \\Note{ This should be animated in one step if not expanded
        \\Note}
        sort second half, A[mid+1]..A[right]    \\Ref MergesortR
        \\Expl{ Sort elements in the second half of the array segment.
        \\Expl}
        \\Note{ This should be animated in one step if not expanded
        \\Note}
        Merge the two sorted halves, with the result in A \\Ref MergeCopy
    \\In}
    // Done \\B Done
    \\Note{ Good to have this as a step in animation to clarify recursion
           (especially the base case), plus clean up stack display at end
    \\Note}


\\Code}

\\Code{
MergesortL
    \\Note{ Recursive call should be animated if this is expanded, like
      quicksort.  We add the comment below to pause the animation,
      making recursion clearer, and the animation also needs an extra
      "chunk" at the right recursion level if we hit the "back" button.
    \\Note}
    // *recursively* sort the first half \\B preSortL
    Mergesort(A, left, mid) \\B sortL
\\Code}

\\Code{
MergesortR
    \\Note{ See MergesortL note
    \\Note}
    // *recursively* sort the second half \\B preSortR
    Mergesort(A, mid + 1, right) \\B sortR
\\Code}

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
