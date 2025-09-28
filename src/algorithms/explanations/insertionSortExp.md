# Insertion sort



---



Insertion sort is a simple sorting algorithm that works by iteratively inserting eachelement of an unsorted list into its correct position in a sorted portion of the list.The whole list is divided into 2 parts, one sorted part and one unsorted part. Eachtime we pick a number in the unsorted part and put it into the sorted part accordingto the sequence.

Insertion sort is a very simple sorting algorithm, but with higher time complexitycompared to more advanced algorithms (e.g., merge sort or quicksort). The averagecase and worst case behavior O(n<sup>2</sup>). Which the worst case of insertionsort is happened when the sequence is reversed.



## Algorithm overview



The steps for basic Insertion Sort are:



*Start from the second element of the array (since the first element is trivially sorted).



*Compare the current element (called the key) with the elements in the sortedportion to its left.



*Shift all elements greater than the key one position to the right, until the correctposition for the key is found.

*Insert the key into this position.

*Repeat the process for the next element, until the entire array is sorted.

The base case of the process is when all elements have been traversed; at this point.
the array is fully sorted.

## Insertion Process

The insertion process is done by firstly picking the current element (the key)from the unsorted portion, Then, scanning leftward through the sorted portionof the array, comparing each element to the key. Whenever an element largerthan the key is found, it is shifted one position to the right. When either thestart of the array is reached, or an element less than or equal to the key isencountered, the key is placed in that position. This ensures that at the encof each step, the left part of the array is sorted.

## Time complexity

In the best case, the array is already sorted, Each insertion only requires a singlecomparison without shifting elements, resulting in O(n) complexityoverall. In the worst case, the array is reverse sorted. Each insertion requires shiftingall previously sorted elements, giving a total of O(n<sup>2</sup>)complexity. In the average case, elements are sorted randomly. About half of theelements in the sorted portion need to be shifted for each insertion. This leads toO(n<sup>2</sup>)complexity as well.

## Space complexity

Insertion sort is an in-place algorithm. lt only requires a constant amount of extramemory for the key element being inserted. Thus, the space complexity isO(1), making it a space-efficient sorting algorithm.

## Development of insertion Sort

Insertion sort is one of the earliest and most intuitive sorting algorithms, with originstraceable to manual sorting methods used long before the computer era. lts procedureclosely resembles the way people arrange playing cards in their hands: each new cardis inserted into its correct position among the already sorted cards.

Because of its simplicity and ease of implementation, insertion sort has long been usedin teaching as an introduction to sorting algorithms and algorithmic complexity. Whileits performance degrades on large datasets, insertion sort is still practical for smallarrays or nearly sorted data, where it can outperform more advanced algorithms due toow overhead and cache efficiency.

In modern computing, insertion sort is often employed as a building block within hybridalgorithms (such as Timsort or introsort), where it is applied to small subarrays toimprove overall efficiency.
