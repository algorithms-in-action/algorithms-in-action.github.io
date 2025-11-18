
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

Compare and contrast the recursive and iterative versions of the BST
code.

How can the code be modified to allow duplicate keys, in different tree
nodes? Assume that for equal keys, we insert into the right subtree.
Write search code that, given a key, returns the *list* of all nodes
that contain the key. When we find a node containing the key, is it
necessary to search the left subtree?

