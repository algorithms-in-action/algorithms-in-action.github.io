# Straight Radix Sort

--- 

## Introduction
Unlike most sorting algorithms, which are based on *comparison* of whole
keys, radix sorting is based on examining individual "digits" in the
keys. For integers (used here) this could be decimal digits (base 10), bits (base 2) or any other
base. Using bytes (base 256) has efficiency advantages but here we use base 4
(digits 0-3) for illustration.
Straight Radix Sort (also known as Least Significant Digit Radix Sort)
is a *stable* sorting algorithm that processes each digit of the keys
starting from the least significant digit and working its
way to the most significant digit. It uses an
auxiliary sorting algorithm (Counting Sort) at each stage to reorder the
elements by each digit. Importantly, Counting Sort is *stable*, so when sorting
on one digit, if two values are equal, the ordering on previously sorted
digits is retained.

## The algorithm
### 1. Initialisation
The ```Radixsort``` function begins by determining the maximum number of digits, in this case the maximum number of digits
in the data. This number defines how many iterations the algorithm will go through, 
starting from the least significant (right-most) digit moving toward the most
significant (left-most). Here we use base 4 digits (0-3 or two bits)
and show values in decimal, base 4 (the most helpful in understanding
the algorithm) and binary.

### 2. Outer Loop
For each digit (scanning right to left), *Counting Sort* is performed on that
digit. This leave the array sorted.

### 3. Counting Sort

Counting sort has four parts:

* Counting occurrences of each digit (00, 01, 10 and 11 in binary)
    * For each key in the array, the digit at the current position is extracted.
    * The algorithm counts how many times each digit occurs.
    * These counts are stored in an auxiliary array ```Count```, which has a slot for each of the four digit values.
* Cumulative Sum
    * After counting the occurrences of the digits, the algorithm computes the cumulative sums of these counts
  in ```Count```. This allows the determination of the correct position of each element in the sorted array.
    * Keys with digit value 0 will be put in positions 0 to ```Count[0]-1```; those with value 1 in ```Count[0]``` to ```Count[1]-1```, etc.
* Copying to temporary Array ```B```:
    * Array ```A``` is scanned right to left, copying keys to ```B```.
    * The digit is extracted, ```Count[digit]``` is decremented and then
      determines which element of ```B``` the key is copied to.
* The temporary array ```B```, which now contains
the keys sorted on the current digit, is copied back to the original array ```A```.

## Complexity
### Time Complexity
* Each iteration uses ```Countingsort```, which takes ```O(n)``` time, where n is the number of elements.
* If we *assume the maximum number of digits is fixed* the overall time complexity is: ```O(n)```
* Note that the best comparison-based sorting algorithms have ```O(n log n)```
  complexity, but the number of digits is typically related to ```log n```
  (otherwise there must be many duplicate keys)
  so radix sorts are not necessarily better.

### Space Complexity
* Due to the temporary array ```B``` we need ```O(n)``` extra space.
* The ```Count``` array is considered constant space (though potentially a
  very large radix could be used).


