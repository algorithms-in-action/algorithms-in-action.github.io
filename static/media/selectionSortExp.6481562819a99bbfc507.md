# Selection Sort

---

Selection sort is a straightforward comparison-based sorting algorithm that works by repeatedly selecting the smallest (or largest, depending on sorting order) element from the unsorted portion of an array and moving it to its correct position in the sorted portion.

The list is conceptually divided into two parts: a sorted region at the beginning and an unsorted region that occupies the remainder of the list. During each iteration, the smallest element in the unsorted region is identified and swapped with the first element of that region.

Although easy to understand and implement, selection sort is not efficient for large datasets due to its quadratic time complexity, making it mainly useful for educational purposes or small arrays.

---

## Algorithm Overview

The basic steps for Selection Sort are:

1. Start from the first element of the array.
2. Find the smallest element in the unsorted portion of the array.
3. Swap this smallest element with the first element of the unsorted portion.
4. Move the boundary between the sorted and unsorted parts one element to the right.
5. Repeat the process until the entire array is sorted.

At the end of the process, every element has been compared at least once, and the array becomes sorted in ascending order.

---

## Selection Process

The selection process in each iteration involves scanning the unsorted portion of the array to find the smallest element’s index. Once identified, that element is swapped with the first element of the unsorted portion. This guarantees that after every iteration, the sorted part of the array grows by one element.

Unlike insertion sort, selection sort minimizes the number of swaps — it performs at most **n − 1 swaps** for an array of size **n**, though it still performs approximately **n² / 2 comparisons**.

---

## Time Complexity

Selection sort’s time complexity characteristics are as follows:

- **Best Case:** O(n²)  
  Even if the array is already sorted, selection sort still scans the entire unsorted portion each time to find the smallest element.

- **Average Case:** O(n²)  
  On average, it performs about n²/2 comparisons and n swaps.

- **Worst Case:** O(n²)  
  Regardless of the initial order, the algorithm always makes the same number of comparisons.

Although it is inefficient for large datasets, its simplicity and predictable performance can make it acceptable for small lists.

---

## Space Complexity

Selection sort is an **in-place** algorithm — it only requires a constant amount of extra memory space for temporary swapping.  
Thus, its space complexity is **O(1)**.

Additionally, selection sort is **not stable** by default, because swapping elements may change the relative order of equal elements.

---

## Development of Selection Sort

Selection sort has historical significance as one of the earliest sorting algorithms taught in computer science education due to its conceptual simplicity and lack of dependencies on advanced data structures.

Its name comes from the core idea of *selecting* the smallest (or largest) element in each iteration and placing it in its correct position.

Despite its inefficiency compared to algorithms like mergesort or quicksort, selection sort has advantages in cases where:
- The cost of swapping is much higher than comparing.
- Memory is limited (since it requires no additional space).
- Simplicity and predictability of behavior are preferred over speed.

In modern computing, selection sort serves as an introductory algorithm for understanding sorting logic, iteration, and comparison-based algorithm design.