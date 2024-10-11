
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


Geeks for Geeks Link: [**Astar Algorithm**][G4GLink]

[G4GLink]: https://www.geeksforgeeks.org/a-search-algorithm/


## Exercises/Exploration

For Graph 1 (or any other graph) what is the longest path (choice of
start and end nodes) for which the algorithm makes no "mistakes", that
is, every node removed from the priority queue is on the shortest path?
What are the characteristics of such paths?

The background says if Euclidean distance is used for weights and
Manhattan distance is used for the heuristic, it is not admissible
(so the shortest path may not be the one returned) whereas for other
combinations of Manhattan/Euclidean the heuristic is admissible (so the
shortest will be returned).  Use the default settings (Graph1, start node
5, end node 12) to explore this.  Can you come up with other examples
to illustrate this?

AIA uses integer approximations to Euclidean distances for convenience.
There was a choice of rounding to the closest integer, rounding up
(ceiling) or rounding down (floor).  By picking different node positions,
try to determine which of these alternatives is used. Why was that
alternative used?  Can you think of an example that would not work so
well if a different alternative was used.  Hint: consider a graph in the
shape of a right-angled triangle with edge lengths 10, 10 and 10 root 2
(around 14.142137) with nodes at the corners and several nodes along
the hypotenuse.

