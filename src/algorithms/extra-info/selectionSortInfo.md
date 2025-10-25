<style>
a:link {
    color: #1e28f0;
}
a:visited {
    color: #3c1478;
}
a:hover {
    color: #1e288c;
}
</style>

## Extra Info

-----

Geeks for Geeks Link: [**Selection Sort**][G4GLink]

[G4GLink]: https://www.geeksforgeeks.org/selection-sort/

## Exercises/Exploration

Compare Selection Sort with Insertion Sort.
- Why does Selection Sort perform the same number of comparisons regardless of the initial order of elements?
- Which algorithm performs fewer swaps, and why?
- In what kinds of situations might this property make Selection Sort preferable?

Try tracing Selection Sort on an array of size 6–8 that is already sorted.
- How many comparisons are still made in total?
- How many swaps actually occur?
- What does this tell you about Selection Sort’s efficiency on nearly sorted arrays?

Think about the stability of Selection Sort.
- Why is Selection Sort not stable by default?
- How could you modify it to make it stable (hint: use shifting instead of swapping)?
- Can you think of real-world examples where stability in sorting would matter (e.g., sorting by secondary attributes)?