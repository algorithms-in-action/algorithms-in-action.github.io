# Most Significant Digit / Bit Radix Exchange Sort 

---

## Introduction to Most Significant Digit / Bit Radix Exchange Sort (MSDRexSort)
The Most Significant Digit/Bit (MSD/MSB) variant of Radix Sort is a recursive algorithm that sorts an array (of integers)
by focusing on individual bits, starting from the most significant (left most) bit and working down to the least significant
one as indicated by the binary representation and mask. <br>

By sorting based on the most significant bits first, it ensures that larger or more important bits are considered before
smaller ones.

## Processes of MSDRexSort

### 1. Initial Setup:
* The ```Rexsort``` function sets up the sorting process by determining the largest bit position in the array element,
referred to as the ```mask```. This ```mask``` serves as a reference for which bit is being compared in the following
steps.
* The recursive sorting function ```RexsortRecursive``` is then called to sort the entire array starting from the most significant
bit.
### 2. Recursive Sorting: 
* The ```RexsortRecursive``` function works on sub-arrays, defined by a left and right index/guard, and recursively divides
the array based on the current bit position determined by the ```mask```.
* If the segment contains more than one element, ```i < j``` and the mask is greater than 0, the function proceeds to partition
the array.

### 3. Partitioning Based on Current Bit
* The guards ```i``` and ```j```, are set at the left and right of the array segment.
* These guards move towards each other, adjusting positions based on the bit value at the current ```mask``` position
  i.e.,
    * Increment ```i``` until an element with a 1 in the current ```mask``` position is found.
    * Decrement ```j``` until an element with a 0 in the current ```mask``` position is found.

* If the two guards have not crossed, perform a swap. to ensure that 0s and placed on the left and 1s on the right.

### 4. Completion
Once the array is done with sorting its left and right sub arrays, the ```mask``` is reduced by 1 to shift the focus to 
the next bit. The recursion continues until the entire array is sorted based on all bits, from the most significant bit to
the least significant bit.

## Complexity
### Time Complexity
* ```n``` is the number elements in the array
* ```log(largest bit)``` is the number of bits required to represent the largest number in the array
* Hence, overall time complexity is ```O(n * log(largest bit)```
### Space Complexity
```O(log(largest bit))```
