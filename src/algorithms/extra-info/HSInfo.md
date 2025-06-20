
<style>
a:link {
    color: #1e28f0;
}
a:visited{
    color: #3c1478;
}
a:hover{
    color: #1e288c;
}
</style>

## Extra Info

-----

Geeks for Geeks Link: [**Heap Sort**][G4GLink]


[G4GLink]: https://www.geeksforgeeks.org/heap-sort/

## Exercises/Exploration

Many teaching resources say the best case for Heap sort is O(n log n).
However, there is a case where it is O(n) - can you figure out what it is?
The AIA progress bar allows you to see how many steps there are in the
animation, which is a *very rough* guide to run-time. For the best case,
can you determine a formula for the number of steps taken with 2n data
items, demonstrating it is O(n)?

Here we have presented the "bottom up" way of creating a heap from an
unsorted array.  There is also a "top down" method where we start with
just the first element of the array (which can be considered a heap)
and repeatedly include the next element in the array until all array
elements are included in the heap. At each stage some elements may need
to be rearranged to ensure the heap condition is met (using an operation
normally called *UpHeap*).  Work out (or look up) the details of this
algorithm. Try to work out (or look up) the worst case time complexity
for these two ways of creating a heap.

Heaps are an efficient way of implementing the *piority queue* abstract
data type.  What operations does this ADT support and how can they
be implemented using a heap?  What are priority queues useful for?
Can you find some algorithms in AIA that use priority queues?

