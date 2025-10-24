import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of heapsort animation
        \\Note}
        
        \\Code{
        Main
        HeapSort(A, n) // Sort array A[1]..A[n] in ascending order. \\B 1
        \\Expl{  We are not using A[0] (for languages that start array indices at 0).
        \\Expl}
        \\In{
            BuildHeap(A, n)    \\Ref BuildHeap 
            \\Expl{  First reorder the array elements so they form a (max) heap
                    (no element is larger than its parent). The root node, A[1],
                    is therefore the largest element.  
            \\Expl}
            SortHeap(A, n)    \\Ref SortHeap 
            \\Expl{  Convert the heap into a sorted array. The largest element is
                    put in the correct position A[n] first and we work backwards 
                    from there, putting the next-largest element in its place, 
                    etc, shrinking the heap by one element at each step. 
            \\Expl}
        \\In}
        \\Code}
        
        \\Code{
        BuildHeap
        // build heap
        for k <- Index of last non-leaf downto 1    \\Ref BHForLoop 
        \\Expl{  We use bottom-up heap creation, to build the heap from the bottom
                up (tree view) and right to left (array view). The leaves are 
                already heaps of size 1, so nothing needs to be done with them. 
                Working backwards through the heap, and starting from the last 
                non-leaf node, we form heaps of up to size 3 (from 2 leaves plus
                their parent k), then 7 (2 heaps of size 3 and their parent k) 
                etc, until the whole array is a single heap. 
        \\Expl}
        \\In{
            DownHeap(A, k, n)    \\Ref DownHeapk 
            \\Expl{  DownHeap is where smaller heaps are combined to form larger
                    heaps. The children of node k are already heaps, so we need
                    only be concerned about where A[k] fits in. 
            \\Expl}
        \\In}
        \\Code}
        
        \\Code{
        BHForLoop
        for k <- n/2 downto 1 \\B 4
        \\Expl{  Using root index 1, the last non-leaf has index n/2 (rounded down
                to the nearest integer).
        \\Expl}
        \\Code}
        
        \\Code{
        DownHeapk
        // DownHeap(A, k, n)
        i <- k \\B 6
        \\Expl{  Set index i to the root of the subtree that we are now going to 
                make into a heap. 
        \\Expl}
        heap <- False // 'heap' is a flag \\B 7
        while not (IsLeaf(A[i]) or heap) \\B 8
        \\Expl{  Traverse down the heap until the current node A[i] is a leaf. 
                We also terminate the loop if the children of A[i] are in the 
                correct order relative to the parent, since we know that subtrees
                lower down already meet the heap condition. We use the heap flag
                to test the heap condition.  
        \\Expl}
        \\In{        
            j <- IndexOfLargestChild(A, i, n)    \\Ref IndexOfLargestk 
            \\Expl{  Find the larger of the two children of the node.
            \\Expl}
            if A[i] >= A[j] \\B 14
            \\In{
                heap <- True \\B 15
                \\Expl{  The heap condition is satisfied (the root is larger 
                        than both children), so exit from while loop. 
                \\Expl}
            \\In}
            else
            \\In{
                Swap(A[i], A[j]) // Swap root element with (larger) child \\B 17
                i <- j \\B 18
            \\In}
        \\In}        
        \\Code}
        
        \\Code{
        IndexOfLargestk
        if 2*i < n and A[2*i] < A[2*i+1] \\B 10
        \\Expl{  The left child of A[i] is A[2*i] and the right child (if there is
                a right child) is A[2*i+1]; set j to the index of the larger child.
        \\Expl}
        \\In{
            j <- 2*i+1 \\B 11
        \\In}
        else
        \\In{
            j <- 2*i \\B 13
        \\In}
        \\Code}
        
        \\Code{
        SortHeap
        // Sort heap
        while n > 1 \\B 20
        \\Expl{  A[1] always has the largest value not yet processed in the 
                sorting phase. A[n] is the last array element in the heap-ordered
                array that is not yet sorted. Repeatedly swap these two values, 
                so that the largest element is now in the last place, decrement n 
                and re-establish the heap condition for the remaining heap (which
                now has one less element). Repeat this procedure until n=1, that 
                is, only one node remains.  
        \\Expl}
        \\In{
            Swap(A[n], A[1]) \\B 21
            n <- n-1 \\B 22
            DownHeap(A, 1, n)    \\Ref DownHeap1
            \\Expl{  Now that the root node has been swapped to the end, A[1] may 
                    no longer be the largest element in the (reduced size) heap.
                    Use the DownHeap operation to restore the heap condition. 
            \\Expl}
        \\In}
        // Done \\B 37
        \\Code}
        
        \\Note{  This is very similar to DownHeapk.
        \\Note}
        
        \\Code{
        DownHeap1
        // DownHeap(A, 1, n)
        i <- 1 \\B 24
        \\Expl{  Set index i to the root of the subtree that we are now going to 
                examine. 
        \\Expl}
        heap <- False // 'heap' is a flag \\B 25
        while not (IsLeaf(A[i]) or heap) do \\B 26
        \\Expl{  Traverse down the heap until the current node A[i] is a leaf. 
                We also terminate the loop if the children of A[i] are in the 
                correct order relative to the parent, since we know that subtrees
                lower down already meet the heap condition. We use the heap flag
                to test the heap condition.  
        \\Expl}
        \\In{        
            j <- IndexOfLargestChild(A, i, n)    \\Ref IndexOfLargest0 
            \\Expl{  Find the larger of the two children of the node. 
            \\Expl}
            if A[i] >= A[j]         // Parent is larger than the largest child \\B 32
                                                                          
            \\In{
                heap <- True \\B 33
                \\Expl{  The heap condition is satisfied, that is, the root is 
                        larger than both children, so we exit from the while loop.
                \\Expl}
            \\In}
            else
            \\In{
                Swap(A[i], A[j])    // Swap root element with (larger) child \\B 35
                i <- j \\B 36
            \\In}
        \\In}
        \\Code}
        
        \\Note{  Same as IndexOfLargestk (could possible reuse that; it is duplicated 
                here because it might make linking with animation easier if each code 
                expansion is used from a single place).
        \\Note}
        
        \\Code{
        IndexOfLargest0
        if 2*i < n and A[2*i] < A[2*i+1] \\B 28
        \\Expl{  The left child of A[i] is A[2*i] and the right child (if there is
                a right child) is A[2*i+1]; set j to the index of the larger child.
        \\Expl}
        \\In{
            j <- 2*i+1 \\B 29
        \\In}
        else
        \\In{
            j <- 2*i \\B 31
        \\In}
        \\Code}    
`);
