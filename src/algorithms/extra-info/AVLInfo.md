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


In the diagrams below, t6 is the node where the imbalance is noted.    

As shown in the diagram below, t6 is the node at which the imbalance has been noted, and t2 is its left child. The clockwise rotation to restore balance makes t2 the parent of t6, while t6 is the *right* child of t2.  Additionally, since t2 already had t4 as its right child, t4 is moved to become the left child of t6.  Note that the BST invariant is preserved: t4, is bigger than t2, and is also smaller than t6.  The rotation reduces the distance from the root to t1 (where the new node was added), so the tree is now 






, as explained in the diagram The 6 and 4 nodes and the edge between them rotate clockwise, and
the 5 node changes parents from 4 to 6. This reduces the distance from
the root to the 1 (where the new node was added), restoring the balance
(the distance to the node rooted at 7 is increased but this does not
cause the AVL tree balance condition to be violated).  Right rotation is
done by calling rightRotate(t6), where t6 is the tree rooted at 6.

![Alt text if image doesn't open: AVL-left-left](images/AVL/AVL-left-left.jpg){width=120,height=50} This picture is from Greek for Geeks, and is only a placeholder to show proof of concept inserting diagrams, and to check things like size and cropping.
  

![Alt text if image doesn't open: AVL-left-left](Linda Stern/GitHub/algorithms-in-action.github.io/src/algorithms/explanationsimag/images/AVL/AVL-left-left.jpg){width=120,height=50} This picture is from Greek for Geeks, and is only a placeholder to show proof of concept inserting diagrams, and to check things like size and cropping.
  
Test comment

[This shouldn't be seen if the comment signal is correct]: #)

**Check whether the numbering here is still the same in the animation**
**Note I have added a link to the parent of t6 -- check, since the pointer to the left child of this anonymous node needs to be changed, have we given it a number?** 

**Lee - is t4 empty in this case?  If not, then the tree would already have been unbalanced  previously, when t4 was added??**

```
     	/                            /
      t6                          t2
     / \     Right Rotation      / \
    t2   7    - - - - - - - >    1  t6
   / \       < - - - - - - -       / \
  1   t4       Left Rotation      t4   7
```

**9 Jan 4PM I haven't gone beyond this**


## The right-right case

The right-right case is the exact opposite. If the tree on the right in
the diagram above is too unbalanced due to insertion into the subtree
rooted at 7, we can call rightRotate(t2) to lift that subtree and lower
the 1 subtree.

## The left-right case (double rotation)

If the new key was added to the right child of the left child (the
left-right case) and the resulting tree is too unbalanced, the balance can be
restored with a left rotation at node 2 followed by a right rotation at
node 6.
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
image of the left-right case:

```
      2      Rotate           2       Rotate           4
     / \    right at 6       / \     left at 2       /   \
    1   6   - - - - - >     1   4    - - - - - >    2     6
       / \                     / \                 / \   / \
      4   7                   3   6               1   3 5   7
     / \                         / \
    3   5                       5   7
```
