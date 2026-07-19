# Splay Trees

A Splay Tree is a self-adjusting binary search tree. Items are inserted into the tree in binary 
search tree order.  The newly inserted item is then *splayed* (moved to
the root), 
using a defined sequence of *rotation* operations (the same as used in
AVL trees; we strongly recommend reading the AIA AVL tree background
before tackling Splay trees). Items that are 
searched for are also *splayed*. When a search is unsuccessful, the node nearest 
where the successful search would have ended is *splayed*.

The Splay Tree is not strictly balanced, like the AVL tree, but the splay operations preserve the binary search 
tree order and can reduce the depth of an unbalanced tree, at the same time that they move accessed items to the root. 
This provides efficient retrieval over a series of insertions and/or searches, without the AVL-tree overhead 
of keeping track of the exact depth of subtrees.  

Good performance is not guaranteed for an *single* search in the Splay Tree, but 
*amortized analysis* shows an excellent worst case upper bound for a *series* of searches 
in the Splay Tree. The mathematics behind the amortized analysis is complicated, but it has been 
shown to be O(M log n) for a series of M operations.

The *amortized* worst case is often more realistic in practice than the *per operation* 
worst case (as is more calculated for may algorithms). Locality of reference, where some items are 
retrieved more frequently than others, is common in practice, so having frequently accessed items 
closer to the root is advantageous.  Another reason for the efficient search that each *splay* 
operation broadens the tree, making search paths shorter overall.  

### Splay Tree Advantages:

The splay tree is generally reasonably balanced over a series of operations, efficient for many applications, and 
is simpler than either the AVL tree or the 2-3-4 tree, with a single type of node and no need to 
keep an extra variable in each node for balancing purposes. 

### Splay Tree Disadvantages:

Equal keys may end up in either subtree, so either duplicates cannot be allowed 
or a method must be devised to accommodate equal keys; the version here does not
support duplicates.

Additionally, any single operation may be costly, even though rare, so the 
splay tree is not suitable for applications that require a guaranteed worst 
case bound for every operation, *e.g.* safety-critical systems.     


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
splay a node the path is found as we (recursively) search down the tree
for the node (going left or right depending on key comparisons, as is
normal with a BST) and the rotations are done after we *return* from
recursive calls, working our way back up the tree (similar to the way
AVL trees are rebalanced after recursive calls to insert a node). The
rotation operations are described below.  Recursion proceeds down the
tree two levels at a time (unless only going down one level is possible).
Splay is called with a key, and if the key exists in the tree the node
containing the key will end up at the root. If the key is not in the
tree, the node with the next larger (or next smaller) key will end up
at the root.

### Search

Search for a key can be done by splaying with the key then simply checking
if the root node contains the key.

### Insertion

Insertion of a key can be done by splaying with the key then (because
there are no keys between the new key and the key in the root) the new
key can be insert as a new root with minimal rearrangement of other nodes
and pointers. One child of the new root node will be the old root node and
the other child will be a child of the old root node that has been moved.


XXXXXX

### Rotations

Explain single, mention we mostly to two at a time. Explain left-right
- same as AVL.  Mention order of rotations for left-left (skip the
  diagram)




In this implementation, search and insertion are initially the same as for recursive 
binary search tree, that is follow the right link if the insertion/search key is larger 
than the current tree node, follow the left link if it is smaller, building up the 
recursive calls to search on the stack.  The difference occurs at the point of return from 
the search/insertion point, when the node being accessed(or the nearest node for an 
unsuccessful search) is *splayed* to the root.

The splay function uses rotation to move the node being accessed to the root 
of the subtree rooted at its *grandfather*. 

### Insertion

BST insertion traverses the tree from the root (going left or right at each stage, 
depending on the comparison between the key in the node and the key to be inserted), 
then adds new leaf containing the inserted key once the correct position has 
been found.  Splay Tree insertion does the same, but additionally, the structure of the tree is changed by splaying the 
newly inserted node to the root.  The coding here is recursive, with each 
recursive insert call going *two* levels further down the tree. Note: this is 
different from the AVL tree, in which the recursive calls go only 
*one* level down.  After each recursive call returns (implicitly traversing back up the tree 
to the root) two rotations 
are performed, moving a node into the position of its grandfather node, while maintaining BST ordering. 
The collapsed pseudocode is simply BST insertion code containing recursive calls, with code for moving 
the node to the root. Recursive calls to splay bring the newly searched or inserted node to the 
root of the entire tree.



### Duplicate Keys


The AIA code ignores insertion of keys that already exist in the tree.  
It is possible to support duplicate keys by inserting them into either the 
left or right subtree. However, this does complicate search - we may want 
to search for one of the keys or all the keys. An alternative is for nodes 
to contain a list of keys instead of a single key.

###  Splaying

The splay operation moves a newly accessed node to the position of its 
*grand*father node, while maintaining BST ordering.

The order of rotations during splaying depends on whether we have a 
left-left orientation or right-right orientation 
(node is left child of parent AND parent is left child of grandparent, or *vice versa*), 
or a left-right, or right-left orientation 
(node is a left child, parent is a right child, or *vice versa*).

#### Left-Left and Right-Right orientations

For the left-left configuration, after inserting t1, 
two right rotations are performed, as shown below:

**Lee** – This is not strictly true – when inserting t1, it will have no children, 
but when returning from recursive calls it will.  
How to deal with this?   I have put children in this diagram, but 
maybe shouldn’t? Leave out the tx and ty?  They aren’t in BST order anyway.

```
       /                        /                          /     
      t6                       t2                        t1                    
     / \   Right Rotation 1   / \    Right Rotation 2   / \  
    t2  t7   - - - - - - >   t1  t6     -- - - >      tx   t2 
   / \      edge t2-t6      / \  / \   edge t1-t2         / \
  t1  t4                   tx ty t4 t7                  ty  t6 
 / \                                                        / \ 
tx  ty                                                     t4 t7    

```

New node t1 has gone into the position previously held by 
its grandparent t6.


Right rotation 1: Going from left to right 
(a right rotation of t6-t2 edge, the parent and grandparent of 
new node t1), subtree t1 is raised and t7 is lowered, 
while the ordering is preserved. You can think of t6, t2 
and the edge between them being rotated clockwise, so t2 
becomes the parent and t6 becomes the right child. 
Additionally, the parent of t4 changes and the root of the 
tree changes (so the pointer from its parent changes). 

Right rotation 2: Rotate the edge t1-t2, *i.e.* the node 
and its parent, so the node t1 is not parent of the 
previous parent t2.  Children move as in Rotation 1.

The right-right case is the mirror image, 
that is, there are two successive *left* rotations.


The effect of the two rotations is that t1 is now in 
the position previously held by its grandfather t6.  

The right-right case is the mirror image, that is, 
there are two successive LEFT rotations.

**Lee**  *** FOR US TO DO Figure out what the splay node numbering will be in AIA. 

Then we can add the following text: “The AIA pseudocode for rotation uses variables names consistent with this diagram.”








#### Left-Right and Right-Left configurations 


For a new node t4, in the left-right configuration, the rotation sequence is:

```
     /                     /                     /
    t6     Rotate left    t6   Rotate right     t4
   /  \    edge t2-t4     /  \  edge t4-t6      /  \
  t2   t7 - - - - - >   t4  t7  - - - - - >   t2   t6
 / \                    / \                  / \   / \
t1  t4                 t2 t5                t1 t3 t5  t7
    / \               / \                               
      t3 t5           t1 t3                                           
```

Rotation 1: Left rotate edge t2-t4 between the new node t4 
and its parent, to that t4 is now the parent of t2.  
The right rotate the edge between new node t4 and its previous grandparent, 
now its parent, so that the new node t4 ends up as the parent of both its 
former parent t2 and its former grandparent t6.  This restructured subtree 
will then return to the next call to *splay* waiting on the stack.



Note that new node t4 has gone into the place previously held by its 
grandparent t6.  Additionally, the tree height has been reduced by one level.

The right-left configuration is the mirror image of the above, 
starting with a right rotation of the node and its parent, then a 
left rotation of the node (now in parent location) and the grandparent. 

#### Single rotation splay

In instances where the new node is inserted at an odd level, 
the final call to splay will entail a single rotation, a right rotation if 
the new node is inserted as a left child, and a left rotation 
if it is inserted as a right child.

Note that in all calls to splay, the newly accessed (inserted or searched for) 
node ends up in the position previously held by the grandparent.
 

     

## Examples ??



# For the More Section

### Tarjan

Tarjan is known for his many contributions to computer science, 
which include the development of the dynamic data structures the 
Splay Tree and the Fibonacci Heap.  Tarjan developed the idea and 
mathematical rigor for amortized complexity analysis.  

Tarjan and colleagues applied amortized analysis to a number of 
existing data structures, and used the concept to develop and analyze 
two new self-adjusting data structures, the 
Splay Tree and the Fibonacci Heap.


### Uses of Splay Trees

Because frequently access items end up near the root and are retrieved very quickly, 
splay trees are an excellent algorithm to use in situations where a 
small number of items is accessed repeatedly.  Such situation might include: 
caching algorithms, where recently accessed items are likely to be accessed again; 
network routing, where frequently used routes will be accessed quickly; and many others.  

### References

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

