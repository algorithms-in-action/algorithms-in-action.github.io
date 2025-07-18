# Prim's MST Algorithm
---

A minimal spanning tree (MST) of a weighted connected graph G is a connected
subgraph of G that includes all the nodes but minimises the total
weight of all the edges. It is guaranteed to be acyclic, so it is a
tree, and there may be more than one (with the same minimal weight).

Prim's algorithm can find a minimal spanning tree for a connected
graph. If the graph is not connected, the coding here finds a minimum
spanning tree for the connected component that contains the start
node. With a slightly different termination condition a MST can be found
for each component (a minimum spanning forest).

Prim's is one of a related group of graph traversal algorithms that can be viewed as having a similar
structure.
Others of these algorithms attempt to minimise the cost of individual
paths (rather than the whole tree) or may ignore costs, and may
terminate when certain nodes are reached.

These graph traversal algorithms can be used for both directed
and undirected graphs; in AIA we use undirected graphs for simplicity.
Paths are represented by having each node point to the previous
"parent" node in the path, so 
we have a tree with "parent" pointers and the start node at the
root, that is a tree of reversed paths. This allows these algorithms to return
multiple nodes that each have a single path from the start node. 
Prim's will find a tree that includes all connected nodes and has
minimal total cost for the edges. 

As these algorithms execute, we can classify nodes into three sets.
These are:

 
- "Finalised" nodes, for which the path back to the start node has 
been finalised, that is, the final parent node has been determined and recorded;


- "Frontier" nodes, that are not finalised but are connected to a finalised node by a single edge; and

- The rest of the nodes, which have not been seen yet. 

The frontier nodes are stored explicitly in a data structure.
Some of the algorithms also need a way to check if a node has already been seen and/or finalised.

The frontier initially contains just the start node. The algorithms repeatedly
pick a frontier node, finalise the node (its current parent becomes
its final parent) and update information about the neighbours of the node.
Prim's algorithm uses a priority queue for the frontier nodes, ordered
on the minimum known distance
to a finalised node.  At each stage the node with minumum cost
is removed for processing, and its neighbors that have not yet
been finalised
have their costs recomputed. Other algorithms use other data structures to keep track 
of the frontier nodes.

In the presentation here, we do not give details of how the priority
queue is implemented, but just emphasise it is a collection of nodes
with associated costs and the node with the minimum cost is selected each
stage. When elements disappear from the Cost array it means the element
has been removed from the priority queue (the value is not used again).
The pseudo-code is very simple to adapt to finding minimal spanning
forests if nodes that are yet to be seen are also
put in the PQ, with infinite cost, which we do here. The frontier is the
set of nodes with a finite cost shown.

Here we number all nodes for simplicity so we can use arrays for the graph
representation, the parent pointers, etc.  For consistency
with other algorithm animations, the layout of the graph is on a
two-dimensional grid where each node has (x,y) integer coordinates, which
can determine the edge weight (see the instructions tab for more details).

