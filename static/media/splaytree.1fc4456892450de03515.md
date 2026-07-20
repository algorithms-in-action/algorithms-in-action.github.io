# Splay Trees

A Splay Tree is a self-adjusting binary search tree (we assume the
reader is familiar with binary search trees). It relies on the
*splay* operation that moves a tree node to the root of the tree. Splay
uses a sequence of *rotation* operations, also used in AVL trees (it
may help to read the AIA AVL tree background before reading about the
details of Splay trees). Both insertion and search use splay and thus
with insertion and successful search, the key that is inserted or searched
for ends up at the root of the tree.

The Splay Tree is not strictly balanced, like the AVL tree, but the splay
operations preserve the binary search tree order and can reduce the
depth of an unbalanced tree, at the same time that they move accessed
items to the root.  This provides efficient retrieval over a series of
insertions and/or searches, without any space overhead (AVL trees store
the height of the subtree in each node).

Good performance is not guaranteed for any *single* search in the Splay Tree, but 
*amortized analysis* shows an excellent worst case upper bound for a *series* of searches 
in the Splay Tree. The mathematics behind the amortized analysis is complicated, but it has been 
shown to be O(M log n) for a series of M operations.
The *amortized* worst case is often more important in practice than the *per operation* 
worst case (as is more often given in complexity analysis).

### Splay Tree Advantages:

The splay tree is generally reasonably balanced over a series of
operations, efficient for many applications, and is simpler than either
the AVL tree or the 2-3-4 tree, with a single type of node and no need
to keep extra information in each node for balancing purposes. They have
excellent amortized complexity and perform particularly well if there
is good "locality of reference" (for example, if a particular key is
inserted or searched for at some point in time, it is more likely to be
searched for soon after that point).

### Splay Tree Disadvantages:

Any single operation may be costly and even though this is rare, splay
trees area not suitable for applications that require a good guaranteed
worst case for every operation, *e.g.* some real-time systems.  Search is
not a "read-only" operation, making it potentially less efficient and less
convenient for multi-threaded applications and declarative languages.
Also, duplicate keys cause some complications; the version here does
not support duplicates.


 ## Splay Tree Implementation

There are several strategies for implementing splay trees, related to
when and how the path between the splayed node and the root is found. For
some implementations there are two passes, one to insert/find a node then
another to splay it, and other have a single pass. The path can be found
"top down", starting at the root or "bottom up", starting at the node
to be splayed (some implementations require "parent" pointers in nodes,
missing out on one important advantage of splay trees). Another subtle
point is that the tree is generally processed two levels at a time and
if the path length is odd, a single level must be processed and this
could be at either end of the path. Finally, the code can be iterative
or recursive.

### Splaying 

Splaying is the key operation and the version in AIA is recursive. To
splay a node, the path is found as we (recursively) search down the
tree for the node (going left or right depending on key comparisons,
as is normal with a BST). The rotations are done after we *return*
from recursive calls, working our way back up the tree (similar to the
way AVL trees are rebalanced after recursive calls to insert a node in
AIA). The rotation operations are described below.  Recursion proceeds
down the tree two levels at a time (unless only going down one level
is possible).  Splay is called with a key, and if the key exists in
the tree the node containing the key will end up at the root. If the
key is not in the tree, the node with the next larger (or next smaller)
key will end up at the root.

### Search

Search for a key can be done by splaying with the key then simply checking
if the root node contains the key.

### Insertion

Insertion of a key can be done by splaying with the key then (because
there are no keys between the new key and the key in the root) the new
key can be inserted as a new root with minimal rearrangement of other
nodes and pointers (if the key already exists in the tree it will be in
the root and the insertion can be ignored). One child of the new root
node will be the old root node and the other child will be a child of
the old root node that has been moved (see the code for details).

### Rotations

Rotations are local operations that simply re-assign several pointers
in the vicinity of a particular tree node while maintaining the order
of the tree.  For splay trees, rotations are used primarily to move
a node higher in the tree as part of a splay operation (it may also
make the tree more balanced; in AVL trees, rotations are used in a way
that always makes the tree more balanced). Splay trees are processed two
levels at a time, so there are normally pairs of rotation operations used.
If the number of tree levels processed is odd, a single rotation is used
for the last level encountered.

#### Single rotations

A single rotation transforms the tree as shown in the diagram below,
where t1, t4 and t7 are subtrees that may be of any size (in the "More"
tab there is a W3Schools link that has an animation of these
rotations). They can be used to raise the left or right child of the
root of a subtree up to the root.
```
       /                               /
      t6                              t2
     / \          Right Rotation     / \
    t2  t7       - - - - - - - >    t1  t6
   / \           < - - - - - - -       / \
  t1  t4          Left Rotation       t4  t7
```

Going from left to right (a **right rotation** of t6), node t2 is raised
to the root but the ordering is preserved. You can think of t6, t2 and
the edge between them being rotated clockwise, so t2 becomes the parent
and t6 becomes the right child. Additionally, the parent of t4 changes and
the root of the tree changes (so the pointer from its parent changes).
Similarly, the inverse operation, going from right to left (a **left
rotation** of t2), raises node t6 to the root.  The AIA pseudocode for
rotation uses variables names consistent with this diagram.

#### Double rotations

Double rotation operations raise a grandchild of the root up to the root.
There are four cases, we call "left-left", "left-right", "right-left" and
"right-right", for the four different grandchildren.  The left-right
case is shown in the diagram below:
```
     /                     /                     /
    t6     Rotate         t6     Rotate         t4
   /  \   left at t2     /  \   right at t6    /  \
  t2   t7 - - - - - >   t4  t7  - - - - - >   t2   t6
 / \                   / \                   / \   / \
t1  t4                t2  t5                t1 t3 t5 t7
   / \               / \
  t3  t5            t1  t3
```

Node t4 is moved two levels up the tree using a left rotation followed
by a right rotation (the same double rotation is done in AVL trees).
The two subtrees of t4 (t3 and t5) end up separated from t4 (but the order
is maintained).  The right-left case is the mirror image and uses a right
rotation followed by a left rotation (for brevity we omit the details).

The left-left case is similar but the order of rotations is inverted (a
subtle but important difference).  To move t1 to the root in the diagram
above, a right rotation of the root, t6, is performed first. This brings
t2 to the root and also raises its child, t1 (see the diagram for single
rotations). A second right rotation of the root, now t2, brings t1 to
the root. The right-right case is the mirror image and uses two left
rotations of the root.
