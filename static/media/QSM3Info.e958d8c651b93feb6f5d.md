
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

Geeks for Geeks Link: [**Quick Sort - Median of Three**][G4GLink]


[G4GLink]: https://www.geeksforgeeks.org/quick-sort/

## Exercises/Exploration

Look into some of the history of quicksort.  The basic idea is relatively
simple and was invented long ago. However, it has had a *huge* amount
of work done on it over the years to refine it in many ways (median
of three partitioning is just one of these) - far more than any other
relatively simple algorithm. What are some of the other refinements?

The coding of partition used in AIA goes back to some early versions of
quicksort where in order to maximize efficiency, the "inner loop(s)" of
the algorithm (incrementing or decrementing the array index and testing
an array element) was written so as to minimise the number of instructions
executed by the hardware. Hardware has changed a lot since then! Look
into some more recent efficient ways of coding partition.

Give two examples of input to quicksort which best cases for median
of three partitioning but are worst cases for the simple version of
quicksort.

Can you construct a worst case input for median of three quicksort for
the number 1 to 12?  For example, the first call to partition takes
the median of 3, 2 and 1, the second takes the median of 5, 4 and 3,
the next has 7, 6 and 5 etc.

