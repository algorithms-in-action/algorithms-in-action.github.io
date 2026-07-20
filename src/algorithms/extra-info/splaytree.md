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

Geeks for Geeks Link: [**Splay Trees**][G4GLink]

[G4GLink]: https://www.geeksforgeeks.org/dsa/introduction-to-splay-tree-data-structure/

W3Schools Link (with rotation animation): [**AVL Trees**][W3Link]

[W3Link]: https://www.w3schools.com/dsa/dsa_data_avltrees.php

## Exercises/Exploration

Compare and contrast AVL trees and Splay trees.

Explore how splay trees adjust with repeated search operations. Given
any splay tree, can you come up with a strategy to turn it into a
"worst case" tree where no node has two children?  Given a worst case
tree, how does it behave if a sequence of "random" searches are
performed?

What applications are splay trees used in and why?

How can the code be modified to allow duplicate keys, in different tree
nodes? Assume that for equal keys, insertion ensures a duplicate is in the
right subtree.  Write search code that, given a key, returns the *list*
of all nodes that contain the key. When we find a node containing the key,
is it necessary to search the left subtree?

The AIA splay code is recursive.  What possible ways are there to
write a non-recursive version? What alternative ways could insert and
search be coded?

## Tarjan

Tarjan is known for his many contributions to computer science, 
which include the development of the dynamic data structures the 
Splay Tree and the Fibonacci Heap.  Tarjan developed the idea and 
mathematical rigor for amortized complexity analysis.  

Tarjan and colleagues applied amortized analysis to a number of 
existing data structures, and used the concept to develop and analyze 
two new self-adjusting data structures, the 
Splay Tree and the Fibonacci Heap.


## References

First publication of Splay trees:

Sleator, Daniel D.; Tarjan, Robert E. (1985). "Self-Adjusting Binary Search Trees". 
*Journal of the ACM.* *32* (3): 652–686. doi:10.1145/3828.3835.

Fibonacci heaps, another self-adjusting data structure with good amortized complexity:

Fredman, Michael Lawrence; Tarjan, Robert E.  (1987). "Fibonacci heaps and their 	
uses in improved network optimization algorithms". *Journal of the ACM*. 
*34* (3): 596–615.  doi:10.1145/28869.28874.

First publication of details of amortized complexity analysis:
	
Tarjan, Robert E. (1985). “Amortized Complexity Analysis”. 
*SIAM Journal on 	Algebraic and Discrete methods*. *6* (2): 306-318.


