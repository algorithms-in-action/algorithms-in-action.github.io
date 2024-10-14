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

For Graph2 can you find a combination of start and end nodes so the path
found includes all nodes in the graph?

Both the iterative and recursive codings of DFS have the line "for each
node m neighbouring n". For iterative DFS, the neighbours are considered
in increasing node number order whereas for recursive DFS the order is
reversed. Why is this done?

The "frontier" nodes for iterative DFS are fairly easy to determine
from the animation - they are the nodes in the stack that have not
yet been finalised.  How does this compare with the animation of the
recursive version?

