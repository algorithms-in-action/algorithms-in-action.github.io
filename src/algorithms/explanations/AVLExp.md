# AVL Trees

An AVL tree is a kind of **binary search tree** that is
**self-balancing**.

Unlike a basic binary search tree, which can exhibit *O(n)* worst case
behavior for both search and insert, an AVL tree is always balanced, so
the worst case *O(log n)*. The way balanced is maintained is quite
complicated; we suggest experimenting with the examples at the end of
this background.

A **binary search tree (BST)** is either empty or else it is a root
node containing a key and two subtrees, which are binary search trees.
We refer to these as t.key, t.left and t.right, respectively (typically
t is represented as *a pointer to* a record and these are the fields
of the record *pointed to* by t).
Binary trees are ordered, so keys in the left subtree are smaller (or
equal to) the key in the root and keys in the right subtree are greater
(or equal to).  Normally there is additional data in each node as well
as the key, disregarded here.  For an **AVL tree**, nodes also contain
the *height* of the tree; this is used in the insertion algorithm to
ensure the tree is balanced. The two children of an AVL tree node have
*a height difference of at most one*. The height is ignored for search
and AVL tree search is identical to BST search.

## Insertion

BST insertion traverses down the tree from the root (going left or
right at each stage, depending on the comparison between the key in
the node and the key to be inserted) then adds new leaf containing the
inserted key.  AVL tree insertion does the same, but additionally, the
height information is updated and the tree may be adjusted to restore the
balance.  The coding here is recursive, with each recursive insert call
going one step further down the tree. After each recursive call returns
(implicitly traversing back up the tree to the root) the height adjustment
and re-balancing is performed. The collapsed pseudocode is simply BST
insertion code containing recursive calls, with code for height update
and re-balancing added at the end. The new height is simply the maximum
height of the two subtrees plus 1.

### Tree re-balancing 

If the difference between the heights of the left and right subtrees is
more than one, the tree is considered unbalanced and must be rearranged
so that it is balanced.  This is done by **local** operations, called
**rotations**, that simply re-assign several pointers in the vicinity
of the node.  A rotation will raise up one subtree and lower another;
the AVL insertion algorithm chooses what rotations to perform so as
to ensure the tree is balanced after the insertion operation has been
completed (assuming it was balanced to begin with).

An AVL tree node can only become unbalanced if insertion into one of the
"grandchildren" (sub-sub-trees) increased the height of the tree.  There
are four grandchildren (called "left-left", "left-right", "right-left"
and "right-right"), which must be handled separately.  For the left-left
and right-right cases a single rotation operation will restore balance.
The other two cases each require two rotation operations.

#### Single rotations

A single rotation transforms the tree as shown in the diagram below,
where t1, t4 and t7 are subtrees that may be of any size (in the "More"
tab there is a W3Schools link that has an animation of these
rotations).
```
       /                               /
      t6                              t2
     / \          Right Rotation     / \
    t2  t7       - - - - - - - >    t1  t6
   / \           < - - - - - - -       / \
  t1  t4          Left Rotation       t4  t7
```

Going from left to right (a **right rotation** of t6), subtree t1 is
raised and t7 is lowered, but the ordering is preserved. You can think of
t6, t2 and the edge between them being rotated clockwise, so t2 becomes
the parent and t6 becomes the right child. Additionally, the parent of t4
changes and the root of the tree changes (so the pointer from its parent
changes). If t6 was unbalanced due to an insertion into t1 (the left-left
case), this restores the balance. Similarly, the inverse operation, going
from right to left (a **left rotation** of t2), restores the balance if
unbalance was caused by insertion into t7 (the right-right case). The AIA
pseudocode for rotation uses variables names consistent with this diagram.

#### Double rotations

If the tree becomes unbalanced due to insertion into t4 (the left-right
case), balance can be restored by performing a left rotation at t2
followed by a right rotation at t6, as shown in the following digram:

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

Note that subtree t4 is broken into three parts but all these parts are
raised whereas t7 is lowered (and the order is preserved).  The right-left
case is the mirror image and balance can be restored with a right rotation
followed by a left rotation (for brevity we omit the details).

## Examples

The following examples of inputs result in rotation for the last key
inserted.  You can copy/paste these into AIA, use the progress bar to
get to the point where the last key is inserted and step through the
execution; expand the pseudocode to show details of the rotations being
performed.

### Left-left cases (right rotations)

The following examples show a simplest case (where t4 is empty), a
case most like the first diagram above, a case where the rotation is
not at the root and a case where insertion is several levels below the
rotation point.

```
60,20,10
60,20,70,10,40,15
60,20,70,10,5
60,20,70,10,40,80,30,5,15,12
```

### Right-right cases (left rotations)

In the following examples the trees are mirror images of the ones above.

```
20,60,70
20,10,60,40,70,65
20,10,60,40,35
20,10,60,5,40,70,50,65,80,67
```

### Left-right and right-left cases (double rotations)

These cases require double rotations.

```
60,20,40
60,20,70,40,10,30
20,60,40
20,10,60,40,70,30
```
