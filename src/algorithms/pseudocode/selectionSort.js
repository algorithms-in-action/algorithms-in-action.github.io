import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of selection sort animation
        \\Note}

        \\Code{
        Main
        SelectionSort(A, n) // Sort array A[1]..A[n] in ascending order. \\B 1
        \\Expl{  Selection Sort 每一趟在未排序区中选择最小元素，
                 放到已排序区的末尾。
                 简单直观，但不稳定，时间复杂度 O(n^2)。
        \\Expl}
        \\In{
            ForLoop_i(A, n)   \\Ref ForLoop_i
            \\Expl{  外层循环：确定 A[i] 的最终位置。
            \\Expl}
        \\In}
        // Done \\B 8
        \\Code}

        \\Code{
        ForLoop_i
        for i <- 1 to n-1 \\B 2
        \\Expl{  i 从 1 开始，表示当前要放置的最小元素位置。
        \\Expl}
        \\In{
            min <- i \\B 3
            \\Expl{  假设当前位置就是最小值下标。
            \\Expl}
            ForLoop_j(i+1, n)   \\Ref ForLoop_j
            \\Expl{  内层循环：在 A[i+1..n] 中找更小的元素。
            \\Expl}
            SwapIfNeed(A[i], A[min]) \\B 8
            \\Expl{  找到更小元素就交换，使 A[i] 成为当前最小。
            \\Expl}
        \\In}
        \\Code}

        \\Code{
        ForLoop_j
        for j <- i+1 to n \\B 4
        \\Expl{  遍历未排序区的每一个元素。
        \\Expl}
        \\In{
            if A[j] < A[min] \\B 5
            \\Expl{  如果比当前最小值还小，则更新最小值下标。
            \\Expl}
            \\In{
                min <- j \\B 6
            \\In}
        \\In}
        EndFor_j // end for j \\B 7
        \\Code}
`);
