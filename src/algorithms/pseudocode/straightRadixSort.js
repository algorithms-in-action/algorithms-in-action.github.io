import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ REAL specification of straight radix sort



XXXXXXXXXXXXXXXXXXXX Notes from Lee XXXXXXXXXXXXXXXXXXXXXXXXX

I've had a pass over this. A few details I've removed one bit added plus
changed "bits" to digits - best use radix 4 for now at least (though
writing the code so we can change the radix very easily would be a
good idea).  See also Notes in the code.  I've not changed the bookmarks
so (hopefully) I've not broken anything in the current animation code.

Also (not done here). Best rename the temporary data and count
arrays. Array B for the temporary array would be fine.  Array C or Counts
would be good for the counts array.
\\Note}

\\Code{
Main
Radixsort(A, n) // Sort array A[1]..A[n] in ascending order. \\B 1

    Find maximum number of "digits" used in the data
    \\Expl{  This depends on the radix (base) we use to view the data.
      We could use radix 10 (decimal digits), radix 2
      (binary) or anything else.  Here we use radix 4 for illustration
      (the digits are 0-3 and use two bits). Radix 256 (one byte) is a
      better choice in practice and we can set the maximum to be the
      word size rather than scanning all the input data as we do here.
    \\Expl}

    for each digit k up to maximum digit number
    \\Expl{  We scan the digits right to left, from least significant to
      most significant.
    \\Expl}
    \\In{
        Countingsort(A, k, n)    \\Ref Countingsort
        \\Expl{  Straight Radix Sort uses Counting Sort to stably sort the
          array, treating each digit value of the original data as a key in
          Counting Sort.
        \\Expl}
    \\In}

// Done \\B 11
\\Code}

\\Code{
MaximumBit
\\Note{ Skip this
\\Note}
maxNumber <- max(A) \\B 2
maxBit <- 0
while maxNumber > 0
\\In{
    maxNumber <- maxNumber/2
    maxBit <- maxBit+1
\\In}
\\Code}

\\Code{
RSFor
\\Note{ Skip this
\\Note}
for k <- 0 to maxDigit \\B 3
\\Code}

\\Code{
Countingsort
// Countingsort(A, k, n) \\B 4
Count number of 1s and 0s in B    \\Ref CountNums
Array B <- counts or each kth digit value   \\Ref CountNums
\\Expl{  We count the number of occurrences of each digit value (0-3
  here) in the kth digits of the data.
\\Expl}
Cumulatively sum digit value counts    \\Ref CumSum
\\Expl{ For each digit value, we compute the count for that digit value
  plus all smaller digit values. This allows us to determine where the
  last occurrence of each digit value will appear in the sorted array.
\\Expl}
Populate temporary array C with sorted numbers    \\Ref Populate
\\Expl{  We copy the data to temporary array C, using the digit
  value counts to determine where each element is copied to.
\\Expl}
Copy C back to A \\B 10
\\Expl{ Array A is now sorted on digit k and all smaller digits
  (because the smaller digits were sorted previously and counting
  sort is stable).
\\Expl}
\\Code}

\\Code{
CountNums
// Put counts of each kth digit value in array B \\B 5
initialise array B to all zeros
for num in A
\\In{
    digit <- kth digit value in num
    \\Expl{ To extract the kth digit we can use div and mod operations.
      If the radix is a power of two we can use bit-wise operations
      (right shift and bit-wise and) instead.
    \\Expl}
    \\Note{ It would be nice to highlight the (decimal) number plus
      somewhere display it in binary with the two relevant bits
      highlighted, and the digit value 0-3 (maybe the latter can be done
      by just highlighting B[digit] instead).
    \\Note}
    B[digit] <- B[digit]+1
\\In}
\\Code}

\\Code{
KthBit
\\Note{ Skip this
\\Note}
bit <- (num & (1 << i)) >> i
\\Code}

\\Code{
CumSum
// Cumulatively sum counts \\B 6
\\Note{ Best remove this comment line and move bookmark
\\Note}
for i = 1 to maximum digit value
\\Expl{ We must scan left to right. The count for digit 0 remains
  unchanged.
\\Expl}
\\In{
    B[i] = B[i-1] + B[i]
\\In}
\\Code}

\\Code{
Populate
// Populate new array C with sorted numbers \\B 7
for each num in A in reverse order
\\Expl{  We go from right to left so that we preserve the order of numbers
  with the same digit.
  This is CRUCIAL in radix sort as the counting sort MUST be stable.
\\Expl}
\\In{
    digit <- kth digit value in num    \\Ref KthBit
    \\Expl{ To extract the kth digit value we can use div and mod operations.
      If the radix is a power of two we can use bit-wise operations
      (right shift and bit-wise and) instead.
    \\Expl}
    \\Note{ It would be nice to highlight the (decimal) number plus
      somewhere display it in binary with the two relevant bits
      highlighted, and the digit value 0-3 (maybe the latter can be done
      by just highlighting B[digit] instead).
    \\Note}
    B[digit] = B[digit]-1
    C[B[digit]] = num \\B 9
\\In}
\\Code}

\\Code{
PopFor
\\Note{ Skip this?
\\Note}
for j <- n-1 downto 0 \\B 8
\\Code}

`);
