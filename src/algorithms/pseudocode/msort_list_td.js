import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ top down merge sort for lists.  Should be able to use identical
psuedocode independently of list implementation. Might hack up a version
where lists are implemented using arrays before the linked list
visualisation is ready (the latter might have a few more steps in the
visualisation of the lists to move things around etc).
\\Note}
\\Code{
Main
// Sort list L of length len, in ascending order
Mergesort(L, len) \\B Main
\\Expl{ We pass in len so we can find the middle of the list more
    easily; it can be computed using a separate scan of the list at the top
    level if unknown.
\\Expl}
    if len > 1 \\B len>1
    \\Expl{  Terminating condition (if there are less than two
            elements in the list it's already sorted).
    \\Expl}
    \\In{
        split L at its mid point, giving lists L and R \\B split
        sort L    \\Ref MergesortL
        \\Expl{ Sort elements in the first half of the input list.
        \\Expl}
        \\Note{ This should be animated in one step if not expanded
        \\Note}
        sort R    \\Ref MergesortR
        \\Expl{ Sort elements in the second half of the input list.
        \\Expl}
        \\Note{ This should be animated in one step if not expanded
        \\Note}
        M <- Merge of L and R \\Ref Merge
        return M \\B returnM
    \\In}
    else
    \\In{
        return L // already sorted \\B returnL
    \\In}
\\Note{ Might want "Done" line+bookmark to clean up at end???
\\Note}
\\Code}

\\Code{
split
    Lmid <- mid point of L \\B scan
    R <- tail(Lmid)    // R starts after Lmid
    tail(Lmid) <- Null // truncate L after Lmid
\\Code}

\\Code{
scan
    Lmid <- L \\B Lmid
    \\Expl{ Start at first element of L
    \\Expl}
    for i = 1 to len/2 - 1 // while not at middle
    \\In{
        Lmid <- tail(Lmid) \\B LmidNext
        \\Expl{ Skip to next element
        \\Expl}
    \\In}
\\Code}

\\Code{
MergesortL
    \\Note{ Recursive call should be animated if this is expanded, like
      quicksort.  We add the comment below to pause the animation,
      making recursion clearer, and the animation also needs an extra
      "chunk" at the right recursion level if we hit the "back" button.
    \\Note}
    // *recursively* sort the first half \\B preSortL
    L <- Mergesort(L, len/2) \\B sortL
\\Code}

\\Code{
MergesortR
    \\Note{ See MergesortL note
    \\Note}
    // *recursively* sort the second half \\B preSortR
    R <- Mergesort(R, len - len/2) \\B sortR
    \\Expl{ We don't use len/2 due to truncation with integer division.
    \\Expl}
\\Code}

\\Code{
Merge
    M <- minimum of L and R \\B initM
    Mlast <- M // last element in M \\B Mlast
    while L != Null && R != Null  \\B whileNotNull
    \\Expl{ Scan through L and R, appending elements to M.  Mlast is always the
        last element of M, and L and R are the remaining inputs that have
        not yet been appended.
    \\Expl}
    \\In{
        append the smaller input element to M, advance pointers \\Ref CopySmaller
        \\Expl{ The smaller of head(L) and head(R) is appended to M.
        \\Expl}
    \\Expl}
    append any remaining elements onto M \\Ref CopyRest
    \\Expl{ One of the input lists will have been completely appended;
        the other will have remaining elements.
    \\Expl}
\\Code}

\\Code{
CopySmaller
    if head(L) <= head(R) \\B findSmaller
    \\In{
        tail(Mlast) <- L // append L element to M
        Mlast <- L       // Mlast <- last element of M
        L <- tail(L)     // skip element in L that has been appended
    \\In}
    else
    \\In{
        tail(Mlast) <- R // append R element to M
        Mlast <- R       // Mlast <- last element of M
        R <- tail(R)     // skip element in R that has been appended
    \\In}
\\Code}

\\Code{
CopyRest
    if L == Null
    \\In{
        tail(Mlast) <- R // append extra R element to M
    \\In}
    else
    \\In{
        tail(Mlast) <- L // append extra L element to M
    \\In}
\\Code}

`);
