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


Geeks for Geeks Link: [**Iterative Depth First Search**][G4GLink]


[G4GLink]: https://www.geeksforgeeks.org/iterative-depth-first-traversal/

## Exercises/Exploration

In AIA, the coding of various graph algorithms is designed to show
their similarity. Iterative DFS, breadth first search, Dijkstra's
shortest path algorithm, heuristic search and Prim's minimal spanning
tree algorithm all have *identical* top-level pseudocode - check it out!
Can you re-write the code for this and/or for other algorithms to make
it as simple as possible, rather than emphasising similarity?

For Graph2 can you find a combination of start and end nodes so the path
found includes all nodes in the graph?

Experiment with the iterative and recursive versions of DFS. Can you
convince yourself that, given the same graph input, they both always
produce the same parent array output, and the parent array elements have
their final values assigned in the same order?

Both the iterative and recursive codings of DFS have the line "for each
node m neighbouring n". For iterative DFS, the neighbours are considered
in increasing node number order whereas for recursive DFS the order is
reversed. Why is this done?

The "frontier" nodes for iterative DFS are fairly easy to determine
from the data structures - they are the nodes in the stack that have not
yet been finalised.  How does this compare with the animation of the
recursive version?

Given a graph with **N** nodes, what is the maximum size of the stack?
Hint: look at the animation for graphs that have lots of edges.

How can you code iterative DFS so it uses less stack space in the worst
case?  Hint: consider what information is on the (implicit) stack for
recursive DFS and how that is coded.


