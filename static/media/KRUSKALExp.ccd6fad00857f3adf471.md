# Kruskal's MST Algorithm
---

A minimal spanning tree (MST) of a weighted connected graph G is a connected
subgraph of G that includes all the nodes but minimises the total
weight of all the edges. It is guaranteed to be acyclic, so it is a
tree, and there may be more than one (with the same minimal weight).

Kruskal's algorithm can find a minimal spanning tree for a connected
graph. If the graph is not connected, a minimum spanning tree is found
for each connected component (a minimum spanning forest).  At each step
there is a forest. Initially each node in the graph forms its own separate
tree. Trees are joined/combined together to form larger trees by adding
one edge at a time. Edges are considered in order of increasing weight or
cost (thus it can be classified as a "greedy" algorithm). The algorithm
checks if the edge is between two nodes that are in the same tree. If so,
it is ignored, otherwise it is selected to combine the two trees into one.

The forest representation is designed so the checking and combining is
an instance of the "union-find" problem, for which there are efficient
algorithms (we don't give details in this animation but present them as a
separate animation).  Each tree is represented as a set of nodes (thus,
the forest is represented by a set of sets).  Initially, the inner sets
are singletons, one for each node in the graph.  Checking if two nodes
are in the same tree is done by calling the *find* operation for each
of the two nodes, returning a representative node for each tree, and
seeing if they are the same.  Adding a new edge, connecting two trees
in the forest, is done with a *union* operation on the two sets.

Here we number all nodes for simplicity so we can use arrays for the graph
representation, sets of integers for union-find, etc.  For consistency
with other algorithm animations, the layout of the graph is on a
two-dimensional grid where each node has (x,y) integer coordinates, which
can determine the edge weight (see the instructions tab for more details).

