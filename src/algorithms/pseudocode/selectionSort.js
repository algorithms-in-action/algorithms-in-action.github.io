import parse from '../../pseudocode/parse';

export default parse(`
\\Note{
Selection sort draft, with some help from ChatGPT. It's not too bad at
producing pseudocode and comments.  More structuring is needed and care
is needed (of course) - it gets some things wrong.

ChatGPT version "write a high level pseudocode description of the
selection sort algorithm":
SelectionSort(array A)
    n ← length of A

    // Repeat for each position in the array (except the last one)
    for i from 0 to n - 2 do
        // Assume the smallest element is at position i
        minIndex ← i

        // Look for a smaller element in the rest of the array
        for j from i + 1 to n - 1 do
            if A[j] < A[minIndex] then
                minIndex ← j

        // Swap the smallest found with the element at position i
        if minIndex ≠ i then
            swap A[i] and A[minIndex]
\\Note}

\\Code{
Main
SelectionSort(A, n) // sort A[1]...A[n] in increasing order \\B Main
\\In{
    for i <- 1 to n - 1 \\B For_i
    \\Expl{ At each iteration the elements A[1]...A[i-1] are
        in their final position. They are the smallest i-1 elements, in
        sorted order. We stop at A[n-1] (at this point A[n] must be the
        largest element).
    \\Expl}
    \\In{
        Swap A[i] with the minimum unsorted element \\Ref NextEl
        \\Expl{ The elements up to A[i-1] are already sorted, in their
          final positions. This step extends the sorted region to A[i].
        \\Expl}
    \\In}
    Done \\B Done
\\In} 
\\Code} 

\\Code{
NextEl
min <- i // initially assume A[i] is smallest \\B Init_min
\\Expl{ min is set to the index of the smallest element of A[i]...A[n].
  Initially we set it to i then scan the rest of A, updating min
  whenever we find a smaller element.
\\Expl}
for j <- i + 1 to n // search A[i+1]...A[n] for smaller elements \\B For_j
    \\In{
    if A[j] < A[min] // if we have found a smaller element \\B IfA[j]<A[min]
        \\In{
        min <- j // update index of smallest \\B min<-j
        \\In}
    \\In}
Swap(A[i], A[min]) // Swap smallest into its correct position, A[i] \\B Swap
\\Code} 
`);

/*
// student version, with bookmarks improved
export default parse(`
\\Note{  REAL specification of selection sort animation
        \\Note}

        \\Code{
        Main
        SelectionSort(A, n) // Sort array A[1]..A[n] in ascending order. \\B Main
        \\Expl{  Selection Sort 每一趟在未排序区中选择最小元素，
                 放到已排序区的末尾。
                 简单直观，但不稳定，时间复杂度 O(n^2)。
        \\Expl}
        \\In{
            ForLoop_i(A, n)   \\Ref ForLoop_i
            \\Expl{  外层循环：确定 A[i] 的最终位置。
            \\Expl}
        \\In}
        // Done \\B Done
        \\Code}

        \\Code{
        ForLoop_i
        for i <- 1 to n-1 \\B For_i
        \\Expl{  i 从 1 开始，表示当前要放置的最小元素位置。
        \\Expl}
        \\In{
            min <- i \\B Init_min
            \\Expl{  假设当前位置就是最小值下标。
            \\Expl}
            ForLoop_j(i+1, n)   \\Ref ForLoop_j
            \\Expl{  内层循环：在 A[i+1..n] 中找更小的元素。
            \\Expl}
            SwapIfNeed(A[i], A[min]) \\B Swap
            \\Expl{  找到更小元素就交换，使 A[i] 成为当前最小。
            \\Expl}
        \\In}
        \\Code}

        \\Code{
        ForLoop_j
        for j <- i+1 to n \\B For_j
        \\Expl{  遍历未排序区的每一个元素。
        \\Expl}
        \\In{
            if A[j] < A[min] \\B IfA[j]<A[min]
            \\Expl{  如果比当前最小值还小，则更新最小值下标。
            \\Expl}
            \\In{
                min <- j \\B min<-j
            \\In}
        \\In}
        EndFor_j // end for j
        \\Code}
`);
*/
