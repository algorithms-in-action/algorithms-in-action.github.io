# Depth First Search Algorithm
---
Depth first search (DFS) for graphs can be used to find a path from
a single start node to either a single end node, one of several end
nodes, or all nodes that are connected (depending on the termination
condition).
It is one of several algorithms that can be viewed as having a similar
structure. Some of these work with weighted graphs (with positive weights
for all edges), where the aim is to find the shortest path(s) (or the
minimum spanning tree in the case of Prim's algorithm) but BFS ignores
weights. These graph search algorithms can be used for both directed
and undirected graphs; here we use undirected graphs for simplicity.
The way paths are represented is for each node to point to the previous
node in the path, so paths are actually reversed in this representation
and we have a tree with "parent" pointers and the start node at the
root. This allows multiple nodes to each have a single path returned
(or we can return a spanning tree).

As all these algorithms execute, we can classify nodes into three sets.
They are the nodes for which the final parent node has been found (this
is a region of the graph around the start node), "frontier" nodes that
are not finalised but are connected to a finalised node by a single edge,
and the rest of the nodes, which have not been seen yet. The frontier
nodes are stored explicitly in some data structure and some algorithms
also need some way to check if a node has been seen and/or finalised. The
frontier initially contains just the start node. The algorithms repeatedly
pick a frontier node, finalises the node (its current parent becomes
its final parent) and updates information about neighbours of the node.

DFS can be coded recursively but here we give a rather more complex
iterative version because illustrates the similarity with the other
algorithms. DFS uses a stack of nodes that includes all the frontier
nodes plus some that may have been finalised already (in the recursive
coding the stack is implicit). At each stage the top node is popped off
the stack. If it has been finalised already it is ignored, otherwise it
is finalised and its neighbours that have not been finalised are pushed
onto the stack.

Here we number all nodes for simplicity so we can use arrays for the
graph representation, the parent pointers, etc.  For many important
applications, particularly in artificial intelligence, the graphs can
be huge and arrays are impractical for representing the graph so other
data structures are needed.