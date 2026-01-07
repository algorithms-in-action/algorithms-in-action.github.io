# Insertion sort



---



Insertion sort is a simple sorting algorithm that works by iteratively
inserting each element of an unsorted list into its correct position in
a sorted portion of the list. The whole list is divided into 2 parts,
one sorted part and one unsorted part. Each time we pick a number in the
unsorted part and put it into the sorted part according to the sequence.

Insertion sort is a very simple sorting algorithm, but with
higher time complexity compared to more advanced algorithms (e.g.,
merge sort or quicksort). The average case and worst case behavior
O(n<sup>2</sup>). Which the worst case of insertion sort is happened
when the sequence is reversed.

## Algorithm overview



The steps for basic Insertion Sort are:



* Start from the second element of the array (since the first element is trivially sorted).

* Copy the current element (called the key) to a temporary variable.

* Compare the current element (called the key) with the elements in the sorted portion to its left.

* Shift all elements greater than the key one position to the right, until the correct position for the key is found.

* Copy the key from the temporary vaiable into this position.

* Repeat the process for the next element, until we reach the last element and the entire array is sorted.


## Insertion Process

The insertion process is done by firstly picking the current element
(the key) from the unsorted portion, Then, scanning leftward through the
sorted portion of the array, comparing each element to the key. Whenever
an element larger than the key is found, it is shifted one position to
the right. When either the start of the array is reached, or an element
less than or equal to the key is encountered, the key is placed in that
position. This ensures that at the end of each step, the left part of
the array is sorted.

## Time complexity

In the best case, the array is already sorted. Each insertion only
requires a single comparison without shifting elements, resulting in
O(n) complexity overall. In the worst case, the array is reverse sorted.
Each insertion requires shifting all previously sorted elements, giving
a total of O(n<sup>2</sup>) complexity. In the average case, elements
are sorted randomly. About half of the elements in the sorted portion
need to be shifted for each insertion. This leads to O(n<sup>2</sup>)
complexity as well.

## Space complexity

Insertion sort is an in-place algorithm. lt only requires a constant
amount of extra memory for the key element being inserted. Thus, the
space complexity is O(1), making it a space-efficient sorting algorithm.

## Development of insertion Sort

Insertion sort is one of the earliest and most intuitive sorting
algorithms, with origins traceable to manual sorting methods used long
before the computer era. lts procedure closely resembles the way people
arrange playing cards in their hands: each new card is inserted into
its correct position among the already sorted cards.

Because of its simplicity and ease of implementation, insertion sort has
long been used in teaching as an introduction to sorting algorithms and
algorithmic complexity. While its performance degrades on large datasets,
insertion sort is still practical for small arrays or nearly sorted data,
where it can outperform more advanced algorithms due to low overhead
and cache efficiency.

In modern computing, insertion sort is often employed as a building
block within hybrid algorithms (such as Timsort or introsort), where it
is applied to small subarrays to improve overall efficiency.

