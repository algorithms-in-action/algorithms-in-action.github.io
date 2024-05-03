# Prim's MST Algorithm
---

A minimum spanning tree (MST) of a weighted connected graph G is
a connected acyclic subgraph of the tree of lowest weight.
Each edge `(i,j)` in a weighted graph has a weight (or distance)
associated with it, and the weight of the tree is the sum of
the weights of the edges between the nodes in the tree.
Graph G is undirected and there may be more than one
minimum spanning tree with equal weight (thus "minimal" spanning
tree is a more precise term).  If G is not connected we may wish to find
a minimal spanning tree of each component (a minimal spanning forest).
This can be done by Prim's algorithm with a minor change to the
termination condition.

Prim's is one of a related group of graph traversal algorithms that can be viewed as having a similar
structure.
Others of these algorithms attempt to minimise the cost of individual
paths (rather than the whole tree) or may ignore costs, and may
terminate when certain nodes are reached.

These graph search algorithms can be used for both directed
and undirected graphs; in AIA we use undirected graphs for simplicity.
Paths are represented by having each node point to the previous
"parent" node in the path, so 
we have a tree with "parent" pointers and the start node at the
root, that is a tree of reversed paths. This allows these algorithms to return
multiple end nodes that each have a single path from the start node. 
Prim's will find a tree that includes all nodes and has
minimum total cost for the edges. 

As these algorithms execute, we can classify nodes into three sets.
These are:

 
- "Finalised" nodes, for which the shortest or least costly path back to the start node has already
been finalised, that is the final parent node has been determined and is recorded;

- "Frontier" nodes, that are not finalised but are connected to a finalised node by a single edge; and

- The rest of the nodes, which have not been seen yet. 

The frontier nodes are stored explicitly in a data structure.
Some of the algorithms also need a way to check if a node has already been seen and/or finalised.

The frontier initially contains just the start node. The algorithms repeatedly
pick a frontier node, finalise the node (its current parent becomes
its final parent) and update information about the neighbours of the node.
Prim's uses a priority queue for the frontier nodes, with the cost of
each node being the minimum known distance
to a finalised node.  At each stage the node with minumum cost
is removed for processing, and its neighbors that have not yet
been finalised
have their costs recomputed. Other algorithms use other data structures to keep track 
of the frontier nodes.



Here we number all nodes for simplicity so we can use arrays for the
graph representation, the parent pointers, etc.  For many important
applications, particularly in artificial intelligence, the graphs can
be huge and arrays are impractical for representing the graph so other
data structures are needed.

For consistency with other algorithm animations, the layout of the
graph is on a two-dimensional grid where each node has (x,y) integer
coordinates.  You can choose the start node and change the
graph choice (see the instructions tab for more details).

