import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ Bottom up merge sort for lists.  Should be able to use identical
psuedocode independently of list implementation.
Merge code from top down list version, the rest adapted from bottom up
array version.  Might need to adjust some bookmarks
\\Note}
\\Code{
Main
Mergesort(L) // Sort list L, in ascending order \\B Main
\\Expl{ The sorted version of L is returned. L is destroyed with this
    coding as the list cells are reused. Data is not copied but pointers are
    changed.
\\Expl}
    if length of L < 2 \\B len<1
    \\Expl{ If there are less than two elements in the list it's
        already sorted so we just return it.
    \\Expl}
    \\In{
        return L // already sorted \\B returnL
    \\In}
    LL <- list of single element lists from L \\Ref init_LL
    \\Expl{ Each element in L becomes a single element list in LL.
        We can reuse the list cells in L by changing the pointers.
    \\Expl}
    while length of LL > 1 \\B MainWhile
    \\Expl{ LL will be a list of sorted lists containing all element
        from L. When it has a single list, we can just return it.
    \\Expl}
    \\In{
        merge all consecutive pairs of lists in LL \\Ref MergeAll
        \\Expl{ This halves the number of lists but doubles their
            length. If there are an odd number of lists the last one
            is kept untouched.
        \\Expl}
    \\In}
    return LL.head \\B Done
    \\Expl{ Return the first (and only) list in LL. It is sorted and
        has all the elements from L.
    \\Expl}
\\Code}

\\Code{
init_LL
    T <- L.tail // save tail of L \\B init_T
    LL <- [[L.head]] // Put head of L in LL \\B init_LL
    \\Expl{ LL is a list containing a list containing the element L.head.
        The first list cell in L can be reused rather than copied.
        The tail pointer needs to be changed, which indirectly changes list
        L (hence the need to save the old tail T at the previous line).
    \\Expl}
    L <- T \\B use_T
    \\Expl{ L is the list of elements not yet added to LL.
    \\Expl}
    LR <- LL // LR points to the last cell of LL \\B init_LR_1
    \\Expl{ LR will scan left to right, adding extra cells at the end of LL. At
        each stage it will be the single element list at the end of LL.
    \\Expl}
    while L != Empty // loop over elements of L \\B WhileL
    \\Expl{ Each element of L will be added as a single element list
        at the end of LL (and LR). LR always points to the last cell in LL.
    \\Expl}
    \\In{
        T <- L.tail // save tail of L \\B init_T_1
        LR.tail <- [[L.head]] // Add next element of L to LL \\B assign_LRtail
        \\Expl{ This appends another single element list to LL (and LR).
            The first list cell in L can be reused rather than copied.
            The tail pointer needs to be changed, which indirectly changes list
            L (hence the need to save the old tail T at the previous line).
        \\Expl}
        L <- T \\B use_T_1
        \\Expl{ L is always the elements not yet added to LL.
        \\Expl}
        LR <- LR.tail \\B assign_LR
        \\Expl{ LR always points to the last cell in LL.
        \\Expl}
    \\In}
\\Code}

\\Code{
MergeAll
    LR <- LL \\B init_LR
    \\Expl{ LR will scan through the elements of LL two at a time
        and change the data (both head and tail) in some cells.
    \\Expl}
    while length of LR > 1 \\B MergeAllWhile
    \\Expl{ LR scans two elements at a time, replacing each pair of lists by
        the single merged list. When the
        number of lists is odd we have a "leftover" list at the
        end (that will be merged in a later iteration of the outer loop).
    \\Expl}
    \\In{
        L <- LR.head      // first element of LR \\B init L
        R <- LR.tail.head // second element of LR \\B init R
        M <- Merge of L and R \\Ref Merge
        \\Expl{ Note that in the animation of the merge operation we
          move R to below L. This is just to clarify the display; no
          list cells or data are actually copied/moved. Merge just
          reassigns pointers. For simplicity, LR.tail.head is not shown -
          it still exists as before but will never be used again.
        \\Expl}
        // merge completed \\B returnM
        \\Note{ Bookmark name for conistency with top down version.
          XXX probably best to rename both afterMerge
        \\Note}
        \\Expl{ Here the animation re-draws the list left to right.
          This is just to clarify the display; no
          list cells or data are actually copied/moved.
        \\Expl}
        LR.head <- M // replace first element \\B replace_head
        \\Expl{ The first list in LR (what was L) is replaced by
            M (the merge of L and R).
        \\Expl}
        LR.tail <- LR.tail.tail // skip second element \\B skip_second
        \\Expl{ The second list in LR (what was R) is removed
            by reassigning the pointer. Thus the two lists (L and R)
            are now replaced by the single merged list.
        \\Expl}
        LR <- LR.tail \\B next_pair
        \\Expl{ Move on to next pair of lists in LL to merge.
        \\Expl}
    \\In}
    // all consecutive pairs of runs merged \\B mergeDone
\\Code}


\\Note{ 
XXXXXXXXXXXXXXXXXXXXXXXXXXXXX following verbatim from top-down mergesort
\\Note}

\\Code{
Merge
    Initialise M with minimum of L and R \\Ref initM
    \\Expl{ Set M to the input list with the smallest first element and
      skip over (delete) that element for that input list. At this point,
      we are only interested in the first element of M, M.head -
      conceptually it is a single element list.  We could
      set M.tail to be the empty list, but it will be reset to another
      value later so this is not necessary.
    \\Expl}
    E <- M // E is the end element of M \\B E
    \\Expl{ With the normal representation of lists, M
      will be a pointer to a list cell and E will be a pointer to the same
      list cell. In the while loop below, the elements of M from its
      first element up to the element pointed to by E will be the elements
      of L and R that have been skipped over. The remaining elements of M
      can conceptually be ignored - we could set E.tail to be the empty
      list. The value of E.tail is not used in the whie loop and is reset
      after the while loop.
    \\Expl}
    \\Note{ Best color the elements of M up to E differently from the rest
      (which are elements of L or R as well).
    \\Note}
    while L != Null && R != Null  \\B whileNotNull
    \\Expl{ Scan through L and R, appending elements to M.  E is always the
        (conceptual) end element of M, and L and R are the remaining inputs that have
        not yet been appended.
    \\Expl}
    \\In{
        append the smaller input element to M, advance pointers \\Ref CopySmaller
        \\Expl{ The smaller of L.head and R.head is appended to M.
        \\Expl}
    \\In}
    append any remaining elements onto M \\Ref CopyRest
    \\Expl{ One of the input lists will have been completely appended;
        the other will have remaining elements.
    \\Expl}
\\Code}

\\Code{
initM
    if L.head < R.head \\B compareHeads
       \\Expl{ For clarity of the animation of the merge operation we
          move R to below L; no
          list cells or data are actually copied/moved.
          Also, LR.tail.head is not shown -
          it still exists as before but will never be used again.
        \\Expl}
    \\Note{ The animation moves R below L here.  It should also remove
        the LR.tail.head arrow (which would otherwise get in the way).
    \\Note}
    \\In{
        M <- L \\B M<-L
        L <- L.tail \\B L<-tail(L)
        \\Expl{ M will contain the first element of L so we skip L to
          its next element.
        \\Expl}
    \\In}
    else
    \\In{
        M <- R \\B M<-R
        R <- R.tail \\B R<-tail(R)
        \\Expl{ M will contain the first element of R so we skip R to
          its next element.
        \\Expl}
    \\In}
\\Code}

\\Code{
CopySmaller
    if L.head <= R.head \\B findSmaller
    \\In{
        E.tail <- L  // append L element to M \\B E.tail<-L
        E <- L       // E <- end element of M \\B E<-L
        L <- L.tail  // skip element in L that has been appended \\B popL
    \\In}
    else
    \\In{
        E.tail <- R  // append R element to M \\B E.tail<-R
        E <- R       // E <- end element of M \\B E<-R
        R <- R.tail  // skip element in R that has been appended \\B popR
    \\In}
\\Code}

\\Code{
CopyRest
    if L = Null
    \\In{
        E.tail <- R // append extra R elements to M \\B appendR
    \\In}
    else
    \\In{
        E.tail <- L // append extra L elements to M \\B appendL
    \\In}
\\Code}

`);
