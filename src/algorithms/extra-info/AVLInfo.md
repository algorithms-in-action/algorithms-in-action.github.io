<style>
a:link {
    color: #90ee90;
}
a:visited{
    color: #ffaeb9;
}
a:hover{
    color: #B22222;
}
</style>

## Extra Info

-----

<!-- Geeks for Geeks Link: [**AVL Tree**][G4GLink] -->

<!-- [G4GLink]: https://www.w3schools.com/dsa/dsa_data_avltrees.php -->

Geeks for Geeks Link:
<a href="https://www.w3schools.com/dsa/dsa_data_avltrees.php" target="_blank">AVL Tree</a>

Insert detailed information about rotations here.

Rework the following original:

# Rotation in AVL trees

### Node numbering convention

When examining any particular subtree of an AVL tree in *AIA*, we use the following **node numbering scheme** in *AIA*. The nodes are
labelled `tX`, where `X` is a numeric value, and the binary search invariant is , that is, node t1 (with value 1) is always to the left of node t2 (value 2), node t2 is always to the left of node t3 (value 3), node t4 is (value 4) always to the right of node t3.  Importantly, note also that some of these nodes **may be empty**, and are shown in the diagrams here for completeness.  Note also that generally nodes in *AIA* are identified only by their value; we introduce the numbers tX only when showing rotation.  

  

A full and completely balanced tree, rooted at node would thus be:

[Comment: need to have empty spaces at the left of this diagram for it to render correctly.]: #)


        
            t4  
           /  \   
         t2   t6   
        / \   / \                  
      t1  t3 t5  t7              

Even if *some* nodes or combinations of nodes were empty, the above tree would still be balanced according to AVL criteria. For example, t1 or t3, or both could be removed, but note that removal of t1 and t2 and t3 would leave the tree unbalanced.

## Correcting the temporarily unbalanced tree

Adding a new node may increase the height of some nodes that are closer to the root along the search path.  We show here 
how a rotation operation, which consists of only a few local pointer reassignments, used to restore the balance of the AVL tree. Importantly,
although the rotation operation is local, it restores the balance at all the preceding nodes in the search path.


In the simplest terms, an edge rotation in a tree is exactly what you would imaging, looking at it visually, and preserves the BST invariant:

Right rotation:

FIX THIS!!
      
      t6                       t2                                t2                                     t6
     /      Right Rotation      \               and              \            Left Rotation            / 
   t2     - - - - - - - >       t6                                t6         - - - - - - - >         t2  

 Complications arise with how to handle child nodes.  For example, in the Right Rotation above, what if t2 already has 
 a right child, making it not so simple to assign t6 as its right child?  Similarly, how do we leave the rotated node 
 linked to the rest of the tree, if the ancestor of t6 is now t2?
 
 When a new node temporarily unbalances an AVL, the tree can be in one of two configurations, each of which has a mirror image. 
 The _*left-left*_ case and _*right-right*_ case are mirror images corrected by a single rotation, while the *left-right* and *right-left*
 case are mirror images corrected by a double rotation.
 
 ## Left-left and Right-right cases (single rotation)

 
Below we show a temporarily unbalanced AVL tree, where t6 has been identified as the node where 
an imbalance is first noted and (as above for Right Rotation) t2 is its left child. Note that some of the nodes may be 
`empty`.   

First we look at the *left-left* case, where the newly added node is inserted into the subtree rooted at `t1`. The tree is unbalanced at `t6`,
since its left subtree now has a height of 3, while its right subtree has a height of 1.



To restore balance in this *left-left* case,  we perform a *Right Rotation* around the node where the imbalance is detected, `t6` in this case.
 Node t2 is made the parent of t6, while t6 is now the *right* child of t2.  Additionally, since t2 already had t4 as its right child, but now needs to 
t4 is moved to become the *left* child of t6, which nicely preserves the BST invariant.   This subtree is now rooted at t2, instead of t6, and is 
therefore linked into the rest of the tree from this new root.
 The rotation reduces the distance from the root to t1 (where the new node was added), so the tree is now:   

       /                                   /   
      t6                                 t2
     / \             Right Rotation      / \
    t2  t7          - - - - - - - >    t1  t6
   / \             < - - - - - - -         / \
  t1   t4            Left Rotation       t4  t7


Conversely, for the *right-right* case, looking at t7 as the direct parent of the new node, and t2 as the point at which the
imbalance is first noted: t7 is the right child of right child `t6`, and we would perform a *Left Rotation*, and shown in the
same diagram, going from right to left, and implemented as function `leftRotate` in AIA. 



## The left-right  and right-left cases (double rotation)

*I think these diagrams are not consistent with the diagrams in the left-left/right-right section above*
*Think about it!*

Again, these two cases, left-right and right-left, are symmetrical.

The diagram below illustrates a *left-right* situation, where insertion of a new node into the subtree rooted in node t4 introduces an imbalance into the tree
that is first noted at node t6. The insertion has been into the *right* subtree (rooted at t4) of a *left* subtree (t2) of `t6`, the node at
which the dimbalance was first detected.  This situation is corrected by a left rotation at node t2, followed by a right rotation at node t6`, shortening the distance between the new node and the root and rebalancing the tree.  Note that the first rotation turns the left-right configuration to a left-left situation, and the second rotation simply follows as in an outright left-left imbalance.  


```
      6      Rotate           6       Rotate           4
     / \    left at 2        / \     right at 6      /   \
    2   7   - - - - - >     4   7    - - - - - >    2     6
   / \                     / \                     / \   / \
  1   4                   2   5                   1   3 5   7
     / \                 / \
    3   5               1   3
```
Nodes in the subtree rooted at 4 (where the extra element was added,
making the tree unbalanced) are moved closer to the root.
Trees rooted at 1, 3, 5 and 7 are not affected, except the distances from
the root of 3, 5 and 7 are changed by one, affecting the overall balance.

## The right-left case (double rotation):

If the new key was added to the left child of the right child (the
right-left case) and the resulting tree is too unbalanced, it is a mirror
image of the left-right case.  Insertion into the subtree rooted at `t4`, which is the left child of `t6`, while `t6` is the right child of `t2`, where the imbalance is first detected:

```
      2      Rotate           2       Rotate           4
     / \    right at 6       / \     left at 2       /   \
    1   6   - - - - - >     1   4    - - - - - >    2     6
       / \                     / \                 / \   / \
      4   7                   3   6               1   3 5   7
     / \                         / \
    3   5                       5   7
```
