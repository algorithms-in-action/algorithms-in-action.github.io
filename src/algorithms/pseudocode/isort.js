import parse from '../../pseudocode/parse';

export default parse(`
\\Note{
Insertion sort draft, with some help from ChatGPT. It's not too bad at
producing pseudocode and comments.  More structuring is needed and care
is needed (of course) - it gets some things wrong.

Should be able to display array with height bars then a gap then a spot
for temp element (use single array with extra two(?) elements and fudge
rendering, eg have " "/null for second last index/value and "temp"/value
for last one). Use swapping of elements to get nice tweening. Only use
this if Insert code is expanded.

Students developed an animation with their own pseudocode
(see insertionSort.js) - bookmarks copied here and only minor changes
needed because the expanded pseudocode is pretty much the same.
needed some changes in controller
XXX nicer to use meaningful strings for bookmarks
\\Note}

\\Code{
Main
InsertionSort(A, n) // sort A[1]...A[n] in increasing order \\B 1
\\In{
    for i <- 2 to n // iterate, starting with second element \\B 2
    \\Expl{ At each iteration the elements A[1]...A[i-1] are
        sorted. Initially A[1] (a single element) is sorted.
    \\Expl}
    \\In{
        Insert element i into the sorted region, elements 1...i-1 \\Ref Insert
        \\Expl{ The elements up to A[i-1] are
            already sorted. This step extends the sorted region to A[i].
        \\Expl}
    \\In}
    // Done \\B 20
\\In} 
\\Code} 

\\Code{
Insert
temp <- A[i]  // Save the element to be inserted \\B 3
Shift sorted elements greater than temp to the right \\Ref ShiftRight
\\Expl{ Sorted elements greater than temp are moved
one position to the right. We compute j such that elements A[1]...A[j-1]
are less than or equal to temp and elements A[j]...A[i-1] are greater than
temp (these are moved right).
\\Expl}
A[j] <- temp // Insert element into correct position \\B 8
\\Code} 

\\Code{
ShiftRight
j <- i // We scan right to left \\B 4
while j > 1 and A[j-1] > temp // For all elements > temp \\B 5
\\Expl{ We stop when we the previous element is less than
    or equal to temp, or we reach the end of the array.
\\Expl}
\\In{
    A[j] <- A[j-1]  // Shift element to the right \\B 6
    j <- j - 1      // Continue scan \\B 7
\\In}
\\Code} 

`);
