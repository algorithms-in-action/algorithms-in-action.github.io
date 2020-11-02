# Prim's Algorithm

---

A minimum spanning tree of a weighted connected graph G is
a connected acyclic subgraph of the tree of lowest weight.
Each edge `(i,j)` in a weighted graph has a weight (or distance)
associated with it, and the weight of the tree is the sum of
the weights of the edges between the nodes in the tree.
Graph G is not directed, and there may be more than one
minimum spanning trees (equal minimum weight).

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
