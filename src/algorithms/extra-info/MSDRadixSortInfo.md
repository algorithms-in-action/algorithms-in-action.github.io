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

Geeks for Geeks Link: [**(MSD) Radix Sort**][G4GLink] (also known as Radix Exchange
Sort)


[G4GLink]: https://www.geeksforgeeks.org/msd-most-significant-digit-radix-sort/

## Exercises/Exploration

The coding of partition used in AIA is based on the coding in quicksort.
Compare and contrast the two.  What other approaches to coding partition
could be used?

In quicksort, the maximum stack size depends greatly on the order of the
input data. For MSD radix sort, what influence does the input order have
(if any), and why?

Compare and contrast the behaviour of quicksort and MSD radix sort when
there are many duplicate keys. When is quicksort better (if ever)? When
is MSD radix sort better (if ever)?

In quicksort, the runtime generally is not affected by the size of the
numbers being sorted: we can square each number and the run time is
the same.  For the AIA version of MSD radix sort, what is the expected
affect on run time if we square each number in the input?

