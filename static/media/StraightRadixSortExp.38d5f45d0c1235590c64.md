# Straight Radix Sort

--- 

## Introduction
Straight Radix Sort (SRS) is a **stable** sorting algorithm that processes each digit or each bit of the binary representation 
of an integer, starting from the least significant digit / bit and working its
way to the most significant bit / digit. It leverages a non-comparative
approach, using a **stable** auxiliary sorting algorithm at each stage to reorder the elements by each bit / digit.

## Explanation
### 1. Initialisation
The ```Radixsort``` function begins by determining the maximum number of digits, in this case the maximum number of digits
in the data. This number defines how many iterations the algorithm will go through, 
starting from the least significant bit (LSB-right most) moving toward the most significant bit (MSB-left most).
### 2. Iteration through Bits
* Instead of iterating bit by bit, we have decided to process two consecutive bits at a time and sort based on possible 
combinations, i.e., (00, 01, 10, 11), starting from the LSB, performing ```Countingsort``` at each step to ensure the elements
are sorted based on that bit combination.
* Since bits are processed as a combination of 2, the number of iterations will be reduced. If the maximum number has ```d```
the algorithm will only need to perform ```d/2``` iterations (rounding up if the number of bits is odd).
    
### 3. Counting Sort
* Counting occurrences of 00, 01, 10 and 11
    * For each number in the array, the two-bit value at the current position is extracted.
    * The algorithm **counts** how many times each two-bit combination occurs.
  These counts are stored in an auxiliary array ```C```, which has four slots to count the occurrences of each combination.
* Cumulative Sum
    * After counting the occurrences of the two-bit combinations, the algorithm computes the cumulative sums of these counts
  in ```C```. This allows the determination of the correct position of each element in the sorted array.
    * The cumulative sum ensures that elements with the same two-bit value are placed next to each other
  in the final sorted array while preserving their original order, i.e., the **stability**
* Populating the Temporary Array ```B```:
    * ```C[digit]``` determines how many elements have this specific combination, allowing the algorithm to decide where
  to place the current element.
    * After placing an element in ```B```, the algorithm decrements the count in ```C[digit]``` by 1, so the next element
  with the same two-bit combination will be placed in the next available slot.

### 4. Completion
* Once the sorting based on the current two-bit combination is complete, the temporary array ```B```, which now contains
the sorted element for the current two-bit combination is copied back to the original array ```A```.
* The process is repeated for the next two-bit combination until all bits are processed and the array is fully sorted.

## Complexity
### Time Complexity
* Each iteration requires ```Countingsort```, which requires ```O(n)```, where n is the number of elements.
* Since our design processes two bits at a time, the number of iterations is halved, hence, if the maximum number in the
array has ```d``` bits, the number of iterations is ```O(d/2)```
* As a result, the overall time complexity is: ```O(n * d/2)``` -> ```O(n * d)```

### Space Complexity
* Original Array ```A```: ```O(n)```
* Counting Array ```C```: ```O(1)```, constant space of 4 in this case.
* Temporary Array ```B```: ```O(n)```,
* As a result, the overall time complexity is: ```O(n)```


