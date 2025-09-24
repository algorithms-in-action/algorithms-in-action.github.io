import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of insertion sort animation
        \\Note}

        \\Code{
        Main
        InsertionSort(A, n) // Sort array A[1]..A[n] in ascending order. \\B 1
        \\Expl{  Insertion Sort builds the sorted portion of the array one element at a time
                by inserting each new element from the unsorted portion into its correct position 
                among the previously sorted elements.
        \\Expl}
        \\In{
            ForLoop(A, n)    \\Ref ForLoop
            \\Expl{  Starting from the second element, insert each A[i] into the previously sorted section one by one.
            \\Expl}
        \\In}
        // Done \\B 20
        \\Code}

        \\Code{
        ForLoop
        for i <- 2 to n \\B 2
        \\Expl{  Here, array indices start from 1; i=2 indicates the first element to be inserted.
        \\Expl}
        \\In{
            InsertPass(A, i)    \\Ref InsertPass
            \\Expl{  Insert the element at position i into the correct position within A[1..i-1].
            \\Expl}
        \\In}
        \\Code}

        \\Code{
        InsertPass
        key <- A[i] \\B 3
        \\Expl{  Temporarily store the element to be inserted.
        \\Expl}
        j <- i - 1 \\B 4
        \\Expl{  Use J as an indicator for searched part when searching the 
                right position for the element picked from the unsorted portion.
        \\Expl}
        while j >= 1 and A[j] > key \\B 5
        \\Expl{  Shift elements of the sorted subarray A[0..i-1] that are greater than key
                one position to the right.
        \\Expl}
        \\In{
            A[j+1] <- A[j] \\B 6
            j <- j - 1 \\B 7
        \\In}
        A[j+1] <- key \\B 8
        \\Expl{  Place the key in its correct position in the sorted subarray, A[1..i] is sorted
                next loop will start by doing the same thing on the next element of the unsorted portion. 
        \\Expl}
        \\Code}
`);
