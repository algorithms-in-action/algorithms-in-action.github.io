# Dijkstra's Shortest Path Algorithm
---

Dijkstra's algorithm for shortest paths in graphs can be used to find
the shortest (that is, lowest weight or cost) path from a single start
node to a single end node, to one of several end nodes or to all nodes that
are connected (depending on the termination condition). It assumes all
edges have a positive weight.

Dijkstra's algorithm is one of a related group of graph traversal
algorithms that can be viewed as having a similar structure.
Others of these algorithms work with weighted graphs
where the aim is to find the least cost path(s), while BFS and DFS
ignore edge weights and Prim's
algorithm finds a minumum spanning tree of the graph (the least cost 
set of edges that connects all nodes, if the graph is connected).  

These graph traversal algorithms can be used for both directed
and undirected graphs; in AIA we use undirected graphs for simplicity.
Paths are represented by having each node point to the previous
"parent" node in the path, so 
we have a tree with "parent" pointers and the start node at the
root, that is a tree of reversed paths. This allows these algorithms to return
multiple nodes that each have a single path from the start node. 
Dijkstra's algorithm will find paths with
the minimum length (sum of the weights of each edge in the path).

As these algorithms execute, we can classify nodes into three sets.
These are:

 
- "Finalised" nodes, for which the shortest or least costly path back to the start node has already
been finalised, that is the final parent node has been determined and is recorded;

- "Frontier" nodes, that are not finalised but are connected to a finalised node by a single edge; and

- The rest of the nodes, which have not been seen yet. 

The frontier nodes are stored in a data structure.
Some of the algorithms also need a way to check if a node has already been seen and/or finalised.

The frontier initially contains just the start node. The algorithms repeatedly
pick a frontier node, finalise the node (its current parent becomes
its final parent) and update information about the neighbours of the node.
Dijkstra's algorithm uses a priority queue for the frontier nodes,
ordered on the shortest distance to the node found so far.  At each
stage the node with the minimum cost
is removed for processing, and its neighbors have their information
updated if a shorter path has now been found.
Other algorithms use other data structures to keep track 
of the frontier nodes.

In the presentation here, we do not give details of how the priority
queue is implemented, but just emphasise it is a collection of nodes
with associated costs and the node with the minimum cost is selected each
stage. When elements disappear from the Cost array it means the element
has been removed from the priority queue (the value is not used again).
The pseudo-code is simpler if nodes that are yet to be seen are also
put in the PQ, with infinite cost, which we do here. The frontier is the
set of nodes with a finite cost shown.

Here we number all nodes for simplicity so we can use arrays for the
graph representation, the parent pointers, etc.  For many important
applications, particularly in artificial intelligence, the graphs can
be huge and arrays are impractical for representing the graph so other
data structures are needed.

In this animation the layout of the graph nodes is important. All nodes
are on a two-dimensional grid so each has (x,y) integer coordinates.
Edge weights can be entered manually or computed automatically, based on
the "distance" between the two nodes.  Two measures of
distance are provided: Euclidean and Manhattan.  Eclidean distance is
the straight line distance; here we round it up to the next integer.
Manhattan distance is the difference in x coordinate values plus the
difference in y coordinate values.  You can choose the way weights are
decided, choose the
start and end nodes and change the graph choice (see the instructions
tab for more details). Only a single end node is supported; choosing 0
results in finding shortest paths to all connected nodes.

