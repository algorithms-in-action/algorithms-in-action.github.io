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

Geeks for Geeks Links: [**(Straight/LSD) Radix Sort**][G4GLink] and
[**Counting Sort**][G4GLink2] (also known as Distribution counting)


[G4GLink]: https://www.geeksforgeeks.org/radix-sort/
[G4GLink2]: https://www.geeksforgeeks.org/counting-sort/

## Exercises/Exploration

In *counting sort*, temporary array **B** is filled by scanning array
**A** from right to left. If it was scanned from left to right, array
**B** would still end up sorted on the digit in question.  What would
the affect be on the radix sorting if left to right scanning was used?

How is the run-time of Straight Radix Sort affected by the order of the
data?

The AIA progress bar allows you to see how many steps there are in the
animation, which is a *very rough* guide to run-time. By experimenting
with different input data, can you devise a formula for how many steps
there are, given the number of data items and the number of (base 4)
digits?

Look up how sorting punched cards has been done historically. Card
sorting machines used LSD radix sorting! How could you sort a deck of
playing cards using LSD radix sorting?

