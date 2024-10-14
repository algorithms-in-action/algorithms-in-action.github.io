
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

Geeks for Geeks Link: [**Prim's Algorithm**][G4GLink]

[G4GLink]: https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/

## Exercises/Exploration

Consider Graph 1 with weights "As input". Can you find two different
minimal spanning trees using Prim's algorithm, by selecting different
start nodes?

For Graph1 with the other weight options, can you convince yourself that
there is a single minimum spanning tree without running the algorithm
multiple times with different start nodes?

Choose Graph 2 and manually delete the edge between nodes 11 and 13,
so the graph has two components.  Find minimum spanning trees for each
component.  Prim's algorithm can be adapted to find a minimal spanning
forest for the whole graph.  One coding sometimes used is to add an outer
loop that calls Prims() for each node in the graph, ignoring nodes that
have already been visited.  Can you think of a different way of coding it?

Compare and contrast how Prim's algorithm and Kruskal's algorithm operate
to compute minimum spanning trees.

