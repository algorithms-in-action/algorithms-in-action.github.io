
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

Geeks for Geeks Link: [**Transitive Closure**][G4GLink]


[G4GLink]: https://www.geeksforgeeks.org/transitive-closure-of-a-graph/

The code for the Warshall algorithm for transitive closure seems simple, just three nested loops.
However the order of the loops is critical to the accuracy of the algorithm.
Convince yourself that this order is necessary by exploring what will happen if you change the order.
