# Depth First Search (iterative)
---

Depth first search (DFS) for graphs can be used to find a path from
a single start node to either a single end node, to one of several end
nodes, or to all nodes that are connected to the start node (depending
on the termination
condition). DFS makes no attempt to find shortest paths and weights/costs
of edges are ignored.

DFS can be coded recursively (this is presented elsewhere).
Here we give a rather more complex
iterative version to illustrate how DFS is
one of a related group of graph traversal algorithms that can be viewed as having a similar
structure.
Others of these algorithms work with weighted graphs (with positive weights
for all edges), where the aim is to find the least cost path(s), while Prim's
algorithm finds a minumum spanning tree of the graph (the least cost 
set of edges that connects all nodes, if the graph is connected).  

These graph traversal algorithms can be used for both directed
and undirected graphs; in AIA we use undirected graphs for simplicity.
Paths are represented by having each node point to the previous
"parent" node in the path, so 
we have a tree with "parent" pointers and the start node at the
root, that is a tree of reversed paths. This allows these algorithms to return
multiple nodes that each have a single path from the start node. 

As these algorithms execute, we can classify nodes into three sets.
These are:

 
- "Finalised" nodes, for which the shortest or least costly path back to the start node has already
been finalised, that is the final parent node has been determined and is
recorded (DFS is an exception in that path lengths/costs are ignored and
finalised nodes can have very long paths to them);

- "Frontier" nodes, that are not finalised but are connected to a finalised node by a single edge; and

- The rest of the nodes, which have not been seen yet. 

The frontier nodes are stored in a data structure.
Some of the algorithms also need a way to check if a node has already been seen and/or finalised.

The frontier initially contains just the start node. The algorithms repeatedly
pick a frontier node, finalise the node (its current parent becomes
its final parent) and update information about the neighbours of the node.
DFS uses a stack of nodes that includes all the frontier
nodes plus some that may have been finalised already (in the recursive
coding the stack is implicit). At each stage the top node is popped off
the stack. If it has been finalised already it is ignored, otherwise it
is finalised and its neighbours that have not been finalised are pushed
onto the stack. Thus the frontier is represented by the stack plus the
finalised status of each node.  Other algorithms use other data structures to keep track 
of the frontier nodes.



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

