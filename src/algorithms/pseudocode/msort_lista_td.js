import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ top down merge sort for lists.  Should be able to use identical
psuedocode independently of list implementation.  Needs more bookmarks.
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
        split L at its mid point, giving lists L and R \\Ref split
        sort L    \\Ref MergesortL
        \\Note{ This should be animated in one step if not expanded
        \\Note}
        sort R    \\Ref MergesortR
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
    Mid <- mid point of L \\Ref scan
    R <- tail(Mid)    // R starts after Mid
    tail(Mid) <- Null // truncate L after Mid \\B tail(Mid)<-Null
\\Code}

\\Code{
scan
    Mid <- L \\B Mid
    \\Expl{ Start at first element of L
    \\Expl}
    for i = 1 to len/2 - 1 // while not at middle
    \\In{
        Mid <- tail(Mid) \\B MidNext
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
    \\Expl{ We don't use len/2 for the length due to truncation with
      integer division.
    \\Expl}
\\Code}

\\Code{
Merge
    Initialise M with minimum of L and R \\Ref initM
    \\Expl{ Set M to the input list with the smallest first element and
      skip over (delete) that element for that input list.
    \\Expl}
    E <- M // E is the end element of M \\B E
    while L != Null && R != Null  \\B whileNotNull
    \\Expl{ Scan through L and R, appending elements to M.  E is always the
        end element of M, and L and R are the remaining inputs that have
        not yet been appended.
    \\Expl}
    \\In{
        append the smaller input element to M, advance pointers \\Ref CopySmaller
        \\Expl{ The smaller of head(L) and head(R) is appended to M.
        \\Expl}
    \\In}
    append any remaining elements onto M \\Ref CopyRest
    \\Expl{ One of the input lists will have been completely appended;
        the other will have remaining elements.
    \\Expl}
\\Code}

\\Code{
initM
    if head(L) < head(R)
    \\In{
        M <- L \\B M<-L
        L <- tail(L) \\B L<-tail(L)
        \\Expl{ M will contain the first element of L so we skip L to
          its next element.
        \\Expl}
    \\In}
    else
    \\In{
        M <- R \\B M<-R
        R <- tail(R) \\B R<-tail(R)
        \\Expl{ M will contain the first element of R so we skip R to
          its next element.
        \\Expl}
    \\In}
\\Code}

\\Code{
CopySmaller
    if head(L) <= head(R) \\B findSmaller
    \\In{
        tail(E) <- L // append L element to M
        E <- L       // E <- end element of M
        L <- tail(L)     // skip element in L that has been appended \\B popL
    \\In}
    else
    \\In{
        tail(E) <- R // append R element to M
        E <- R       // E <- end element of M
        R <- tail(R)     // skip element in R that has been appended \\B popR
    \\In}
\\Code}

\\Code{
CopyRest
    if L == Null
    \\In{
        tail(E) <- R // append extra R elements to M \\B appendR
    \\In}
    else
    \\In{
        tail(E) <- L // append extra L elements to M \\B appendL
    \\In}
\\Code}

`);
