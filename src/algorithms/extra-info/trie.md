
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

-----

Geeks for Geeks Link: [**Binary Search Tree**][G4GLink]


[G4GLink]: https://www.geeksforgeeks.org/binary-search-tree-data-structure/

## Exercises/Exploration

Try inserting data in sorted order. What is the complexity?  How about
reverse sorted?

The "balanced" input option is designed to produce a best possible
ordering for building a binary search tree.  Can you figure out how it
works? Can you design an algorithm to produce this ordering?

In a *complete* binary tree, every non-leaf node has two children. If we
number the levels of the tree from 1 (being the root), how many nodes
are at level *n* in a complete binary tree? If the height is *h* (the
level of the leaves), how many nodes are there in total?

Compare and contrast the recursive and iterative versions of the BST
code.

How can the code be modified to allow duplicate keys, in different tree
nodes? Assume that for equal keys, we insert into the right subtree.
Write search code that, given a key, returns the *list* of all nodes
that contain the key. When we find a node containing the key, is it
necessary to search the left subtree?

The insertion code here traverses down the tree using two variables
(the current
subtree c and parent p) and the last key comparison is repeated.
Re-write the code so the extra variable and comparison are avoided.
What are the advantages and disadvantages of your coding compared to
the AIA code?

In a programming language that supports explicit pointers, you can have
a version of insert that takes a key and a pointer to a tree (that is,
a pointer to a pointer to a record), and inserts the key into the (pointed
to) tree.  Try coding this iteratively and compare it to the AIA code.

