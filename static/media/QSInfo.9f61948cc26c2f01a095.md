
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

Geeks for Geeks Link: [**Quicksort**][G4GLink]


[G4GLink]: https://www.geeksforgeeks.org/quick-sort/

## Exercises/Exploration

The AIA progress bar allows you to see how many steps there are in the
animation, which is a *very rough* guide to run-time. Plot the
number of steps versus the number of data items, for sorted data - what
does it show?

Look into some of the history of quicksort.  The basic idea is relatively
simple and was invented long ago. However, it has had a *huge* amount
of work done on it over the years to refine it in many ways - far more
than any other relatively simple algorithm.

The coding of partition used in AIA goes back to some early versions of
quicksort where in order to maximize efficiency, the "inner loop(s)" of
the algorithm (incrementing or decrementing the array index and testing
an array element) was written so as to minimise the number of instructions
executed by the hardware. Hardware has changed a lot since then! Look
into some more recent efficient ways of coding partition.

