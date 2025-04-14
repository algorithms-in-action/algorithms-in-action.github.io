# Extra Info

<a href="https://en.wikipedia.org/wiki/Disjoint-set_data_structure" target="_blank"><span style="color:blue">**wikipedia.com**</span></a>

<a href="https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/" target="_blank"><span style="color:blue">**geeksforgeeks.com**</span></a>

<a href="https://cp-algorithms.com/data_structures/disjoint_set_union.html" target="_blank"><span style="color:blue">**cp-algorithms.com**</span></a>

## Exercises/Exploration

Rather than using the *rank* of each tree, we could use the precise
*height* of the tree.  What are the potential advantages and
disadvantages of this?

The path compression used here approximately halves the length of the
path from a node to the root.  Instead, it would be possible to reduce
the path length to at most one.  How could this be done and what are
the potential advantages and disadvantages of this?

Find a sequence of union operations that results in all 10 elements
being in the same set but maximizes the height of the resulting tree.
Does path compression make a difference in this case?

Find a sequence of union operations that results in all 10 elements
being in the same set but maximizes the height of the resulting tree
when path compression is off but gives an almost optimal result with
path compression on. How many extra elements would be needed to have the
result optimal with path compression?

