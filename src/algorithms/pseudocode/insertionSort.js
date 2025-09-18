import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
// Sort array A[0..n-1] in ascending order
InsertionSort(A, n) \\B Main
\\Expl{ Insertion Sort builds the sorted portion of the array one element at a time
       by inserting each new element from the unsorted portion into its correct position 
       among the previously sorted elements. }
\\Expl}

for i <- 1 to n-1 \\B outerLoop
\\Expl{ Outer loop: after each iteration, the subarray A[0..i] is sorted. }
\\Expl}
\\In{
    key <- A[i] \\B pick key
    j <- i - 1 \\B initialize J as an indicator for searched part when searching the 
        right position for the element picked from the unsorted portion
    
    while j >= 0 and A[j] > key \\B innerLoop
    \\Expl{ Shift elements of the sorted subarray A[0..i-1] that are greater than key
           one position to the right. }
    \\Expl}
    \\In{
        A[j+1] <- A[j] \\B shift
        j <- j - 1 \\B decrement J meaning continue to check the one further ahead
    \\In}

    A[j+1] <- key \\B insert key
    \\Expl{ Place the key in its correct position in the sorted subarray 
            next loop will start by doing the same thing on the next element of the unsorted portion. }
    \\Expl}
\\In}

// Done \\B Done
\\Note{ After the algorithm finishes, the array A[0..n-1] is sorted in ascending order. }
\\Note}
\\Code}
`);