# Most Significant Digit Radix Sort 

---

## Introduction
Unlike most sorting algorithms, which are based on *comparison* of whole
keys, radix sorting is based on examining individual "digits" in the
keys.
Most Significant Digit (MSD) Radix Sort (also known as Radix Exchange Sort)
is a recursive algorithm that sorts an array of keys (here we use integers)
by focusing on individual bits, starting from the most significant (left
most) bit of each key and working down to the least significant bit.

## The algorithm

### 1. Initial Setup:
* The ```Rexsort``` function sets up the sorting process by determining the
most significant bit position in the array elements.
* A *mask* is created that has a 1 in this bit position and 0 elsewhere. The
mask is used to extract bits from keys during sorting.
* The recursive sorting function ```RexsortRecursive``` is then called to
sort the entire array starting with this mask. The mask is shifted to the
right for recursive calls.
### 2. Recursive Sorting: 
* The ```RexsortRecursive``` function works on sub-arrays, defined by a left
and right index, and additionally has the current mask as a parameter.
* If the sub-array contains no more than one element or the mask is 0, the
function simply returns.
* Otherwise, the array is first *partitioned* into two sub-arrays using the
mask bit. The
(smaller) keys with a 0 mask bit are put at the left and (larger) keys with a 1
mask bit are put at the right (similar to partition in quicksort).
* Finally, the two sub-arrays are recursively sorted, using the appropriate
indices for the sub-arrays boundaries and and the mask shifted one bit
position to the right.

### 3. Partitioning Based on Current Mask Bit
* The indices ```i``` and ```j```, are set at the left and right of the
  array segment, respectively.
* These indices scan towards each other, adjusting positions based on the mask bit of each key:
    * Increment ```i``` until an element with a 1 as the mask bit is reached
    * Decrement ```j``` until an element with a 0 as the mask bit is reached

* If the two indices have met/crossed, stop. Otherwise, swap the
  elements (so the 0 element is on the left and the 1 element is on the
  right) and continue scanning as described above.

## Complexity
### Time Complexity
* Partitioning takes ```O(n)```, where ```n``` is the number elements in the
array.
* If we *assume the maximum number of digits is fixed* the overall time complexity is: ```O(n)``` 
* Note that the best comparison-based sorting algorithms have ```O(n log n)```
  complexity, but the number of bits is typically related to ```log n```
  (otherwise there must be many duplicate keys)
  so radix sorts are not necessarily better.

### Space Complexity
Extra space is required for the stack but, unlike quicksort, the stack depth
is limited by the number of bits, so it is a constant (if the number of bits
is limited).
