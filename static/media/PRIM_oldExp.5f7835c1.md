# Prim's Algorithm

---

A minimum spanning tree of a weighted connected graph G is
a connected acyclic subgraph of the tree of lowest weight.
Each edge `(i,j)` in a weighted graph has a weight (or distance)
associated with it, and the weight of the tree is the sum of
the weights of the edges between the nodes in the tree.
Graph G is not directed, and there may be more than one
minimum spanning tree (equal minimum weight).

Prim's algorithm is a greedy algorithm for finding a minimum
spanning tree in a graph G specified by edges E. Starting with
a tree of one node, Prim's algorithm builds up the spanning
tree in a "greedy" fashion, adding more nodes one at a time
into the tree.

The next new node is chosen by finding the node with the least
cost. The cost of a node i, not yet in the spanning tree,
captures information about the edges from any node in the
spanning tree to this node, i.e., it is the least value for the
weight of (k,i), where k is any node in the spanning tree, and
can be thought of as the cost of adding i to the spanning tree.

Costs are stored in a priority queue, so that the next node to
add (least cost edge to the tree) can be found efficiently.
As the spanning tree grows, costs need to be updated, since
there may now be a lower cost associated with including a node
in the tree (since an edge of lower weight might be usable now).
In the presentation here, we do not give details of how the
priority queue is implemented, but just emphasise it is a
collection of nodes with associated costs and the node with
the minimum cost is important at each stage. When elements
disappear from the Cost array it means the element has been
removed from the priority queue (the value is not used again).

Here we number all nodes for simplicity so we can use arrays for the graph
representation, the parent pointers, etc. In this animation the layout of
the graph nodes is important. All nodes are on a two-dimensional grid so
each have (x,y) integer coordinates.  The weight of each edge can be are
related to the "distance" between the two nodes.  Two measures of distance
are provided: Euclidean, Manhattan and as input.  Eclidean distance is
the straight line distance; here we round it up to the next integer.
Manhattan distance is the difference in x coordinate values plus the
difference in y coordinate values. Weights can also be input manually.
You can choose which distance measure to use to explore behaviour
of the algorithm.  You can also choose the start node and change the
graph choice.


