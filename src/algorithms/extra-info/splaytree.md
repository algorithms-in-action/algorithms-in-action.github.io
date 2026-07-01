<style>
a:link {
    color: #1e28f0;
}
a:visited{
    color: #3c1478;
}
a:hover{
    color: #1e288c;
}
</style>

## Extra Info

W3Schools Link: [**AVL Trees**][G4GLink]

[G4GLink]: https://www.w3schools.com/dsa/dsa_data_avltrees.php

## Exercises/Exploration

Compare and contrast the AVL tree code with the recursive BST code.

How can the code be modified to allow duplicate keys, in different tree
nodes? Assume that for equal keys, we insert into the right subtree.
Write search code that, given a key, returns the *list* of all nodes
that contain the key. When we find a node containing the key, is it
necessary to search the left subtree?

With insertion of three distinct keys there are six orders in which the
keys may appear.  How many different AVL trees are there with three
given distinct keys? Explore how insertion takes place for the six
different orders and compare this with simple binary search trees.

In the background it says that unbalance can only be caused by insertion
into a grandchild of a node.  Why can't it be caused by just adding a
new child to a node?

In the worst case for simple binary trees, every node except one has a
single child. Find some worst case AVL trees.

The AIA insertion code is recursive.  What possible ways are there to
write a non-recursive version?

