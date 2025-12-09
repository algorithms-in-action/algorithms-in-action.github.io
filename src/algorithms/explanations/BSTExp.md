# Binary Search Tree

A **binary search tree (BST)** is a simple form of tree structure.
It has *nodes* that contain keys and branches to other nodes. There is a
distinguished *root node* (drawn at the top; when new keys are inserted
the tree grows downwards).  Nodes that have no branches coming out of
them are called *leaves*.  A BST t is either *Empty* or else it is a root
node containing a key and *two* subtrees, which are binary search trees
(note that either or both the subtrees may be Empty).  Here we refer to
these as t.key, t.left and t.right, respectively. The root nodes of the
left and right subtrees (if they are not Empty) are called the *children*
of the root node of t. Similarly, we refer to the *parent* of a node;
the root node of the whole tree has no parent and other nodes have one
parent. Typically t is represented as *a pointer to* a record and t.key
etc are the fields of the record *pointed to* by t (this notation is
different from most programming languages that support explicit pointers).
Binary search trees
are *ordered*, so keys in the left subtree are smaller (or equal to)
the key in the root and keys in the right subtree are greater (or equal
to) the key in the root.  Normally there is additional data in each
node as well as the key, disregarded in AIA because it doesn't affect
the algorithms.

## Insertion

BST insertion traverses down the tree starting from the root. It goes
to the left or right at each stage, depending on the comparison between
the key in the node and the key to be inserted. When the edge of the tree
is reached we add a new leaf containing the inserted key. In the
iterative coding here we keep track of the current subtree, c, and also
its parent, p (which is highlighted in the animation). The traversal
terminates when c becomes an Empty
subtree and the new node is then inserted as a child of p.

## Search

BST search traverses down the tree starting from the root. At each stage
it compares the key we are searching for with the key in the node.  If
they are equal the search stops sucessfully.  Otherwise we go to the left
or right, depending on the comparison between the keys, and continue. If
we reach an Empty subtree the search terminates unsucessfully.

### Duplicate keys

The AIA code ignores insertion of keys that already exist in the tree.
It is possible to support duplicate keys by inserting them (plus any
associated data) into either the left or right subtree.  However,
this does complicate search - we may want to search for one of the key
occurrences (and return the associated data) or all the key occurrences
(and return all the data).  An alternative is to avoid duplicate keys
but for nodes to contain a list of all data items associated with the key.

## Complexity

For both insertion and search, the complexity is bounded by the
height/depth of the tree (the maximum length of the path being traversed).
In the worst case it is *O(n)*, where each node has at most one child
(sometimes known as a *stick*). In the best case, nearly all non-leaf
nodes have two children, the left and right subtrees of each node have
very similar heights and the tree is *balanced*. The complexity is then
*O(log n)*. This is also the average case complexity.

