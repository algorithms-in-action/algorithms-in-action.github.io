# 2-3-4 Trees

A 234 tree is a form of balanced search tree (and a simple instance
of a B-tree).  All leaves are at the same level of the tree. The
tree is made up of three kinds of nodes: two-nodes, three-nodes
and four-nodes, named for the number of children the node has.
Two-nodes are the same as binary search tree nodes,
containing a left subtree (child1), a key (key1) and a right subtree
(child2). Ordinarily they would also hold a data field, which the user
would like to find by searching for the key. Since this field has no
impact on how insertion and search take place, we disregard it here.

The tree is ordered so the keys in child1 are less than key1, which is
less than the keys in child2.
Three-nodes have two keys and three subtrees, named and
ordered child1, key1, child2, key2, child3.  Four-nodes have three keys
and four subtrees, named and ordered child1, key1, child2, key2, child3,
key3, child4.  

For simplicity, equal keys have been ignored in this module. One way of handling duplicate
keys would be to have a linked list of records originating in the node. Alternatively an
application might not support records with equal keys, sending an error message if there
is an attempt to insert a record whose key is already in the tree.  Another alternative might be
to make an arbitrary choice beween storing equal keys in the left or the right subtree, and implement
a search function that finds all matching keys.

New items are always inserted in the leaves of the tree. Insertion into
two-nodes and three-nodes is straightforward - just add the key and another pointer
to the leaf node. However, if the search for the correct insertion point leads to a four-node,
the four-node
must be  split into two two-nodes, so as to make space for the insertion.
Because splitting,
might propagate up the tree, if the parent of the newly split four-node was also a four-node,
it is simplest to implement the
"top down" 234 tree insertion algorithm shown in this animation, which always splits four-nodes
encountered as we traverse down the tree. There is a more complicated
"bottom up" version that waits to split four-nodes until the split is actually needed.  The
"bottom-up" version can slightly reduce the number of nodes in the
tree in some cases, potentially improving efficiency.  

---

Although 234 trees
are a bit cumbersome to code directly in many programming languages due
to the multiple kind of nodes, they provide the idea behind red-black
trees.  Red-black trees can be seen as a representation of 234-trees
using a simpler data structure but a more complicated algorithm. Another
variation of 234-trees is to ensure all nodes as compact as possible,
for example, omitting child pointers from leaf nodes. This results in
more node types and more re-allocation of memory when node types change
but can be very space-efficient. Other variations of the 234-trees are the B-tree
and the B+ tree, where each node has between M and M/2 children. The B- and B+-tree
minimize memory accesses by setting M so that the node size is equal
to the page of the file-system.
