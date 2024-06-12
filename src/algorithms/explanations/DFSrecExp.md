# Depth First Search Algorithm (recursive)
---

Depth first search (DFS) for graphs can be used to find a path from
a single start node to either a single end node, one of several end
nodes, or all nodes that are connected (depending on the termination
condition). As the search proceeds, a "parent" is assigned to each node
encountered, which allows us to represent a path from the node back to
the start. This recursive coding is very simple: the core is a recursive
function that is called with a node n and a parent p. If the parent of
n has not yet been decided it assigns p as the parent and recursively
calls the function on all nodes neighbouring n, with n as the parent,
until an end node is found or all nodes in the componenent have been
examined.

Elsewhere we have an iterative version of DFS.
For recursive DFS it is not necessary to understand the code or
structure of the iterative version but it can be informative.
The iterative DFS code is more complicated but it 
emphasises the similar structure with several other graph algorithms.
Some of these work with weighted graphs (with positive weights
for all edges), where the aim is to find the shortest path(s) (or the
minimum spanning tree in the case of Prim's algorithm) but DFS ignores
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
nodes are stored in some data structure and some algorithms
also need some way to check if a node has been seen and/or finalised. The
frontier initially contains just the start node. The algorithms repeatedly
pick a frontier node, finalises the node (its current parent becomes
its final parent) and updates information about neighbours of the node.
Recursive DFS uses an implicit stack of calls (we
show this in the animation), and each of these calls has a "continuation"
(the remaining neighbouring nodes to be examined when control returns to
that function call). You can think of the frontier as being implicitly
represented by the stack of calls plus their continuations.

Here we number all nodes for simplicity so we can use arrays for the
graph representation, the parent pointers, etc.  For many important
applications, particularly in artificial intelligence, the graphs can
be huge and arrays are impractical for representing the graph so other
data structures are needed.

For consistency with other algorithm animations, the layout of the
graph is on a two-dimensional grid where each node has (x,y) integer
coordinates.  You can choose the start and end nodes and change the
graph choice (see the instructions tab for more details).  While weights of
edges can be included in the text box input, DFS will ignore weights
and positions of nodes.  Only a single end node is supported; choosing
0 results in finding paths to all connected nodes.

