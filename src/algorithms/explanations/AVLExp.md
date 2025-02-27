# AVL Trees

An AVL tree is **self-balancing** **binary search tree**.

Unlike the basic binary search tree, which can exhibit *O(n)* worst case behavior for certain inputs, the AVL tree is always balanced, so search will be *O(log n)*
regardless of the order of the input data. 

### The Binary Search Tree Invariant

A **binary tree (BST)** is either is either empty (`Empty`) or else it
it has a root node and two subtrees (which are binary trees, and can also be empty).
The root node `t` has a key `t.key`. Ordinarily every node would also
hold other data (`t.data`), which the user would like to find by
searching for the key, `e.g.` search for Student ID Number (key) to find street address (data).  

Since the `data` attribute has no impact on 
how insertion and search take place, we disregard it in this animation.
	

Note that a newly inserted node will always appear as a leaf
in the tree. 
		
In a binary search tree the **BST invariant** is always maintained:\
for each 
subtree `t`, with root key `t.key`, the left subtree, `t.left`, 
contains no node with key greater than `t.key`, and the right subtree,
`t.right`, contains no node with key smaller than `t.key`.

### AVL tree balancing 

An AVL tree is **balanced** when the difference in heights of the left and right subtrees is no greater than `1`. 



The AVL tree preserves the balance of the tree by (1) checking after every insertion to detect
when the tree has become unbalanced
and (2) performing one or more **rotation operations** to restore balance when necessary.
The imbalance may be located at
any node along the search path from the root of the tree to the newly inserted node, possibly the grandparent of the newly inserted node, or 
possibly 
considerably closer to the root of the tree.



### Imbalance configurations 

When a new node is inserted in an AVL tree, the tree may become *temporarily* unbalanced. 
A temporarily unbalanced AVL tree takes on one of two **configurations**, *zig-zag* or *zig-zig*. The 
sequence of rotations depends on the configuration around the node where the imbalance is detected. 


The **zig-zig** configuration has two mirror-image cases: the child and grandchild nodes or subtrees of the unbalanced node are 
either (1) both left subtrees or (2) both right subtrees. The **zig-zag** configuration also has two mirror-image cases: the child and grandchild nodes or subtrees of the unbalanced node are 
either (1) a left subtree and a right subtree or (2) a right subtrees and a left subtree.



 

Balance will be restored, using one or two **rotation**
operations (see below).

### Insertion and rotation





**Insertion of a new item** into any binary tree requires (1) first the search to find the correct place to insert, then (2) the actual insertion. 

In the **recursive implementation** shown in *AIA*, the first stage, determining  
the insertion point takes place
during the *"wind up"* stage of the algorithm, where successive recursive *calls to `insert`* are made and accumulate on the machine stack.  Search does not
affect the balance of the tree.  During the second stage, however, an imbalance may be introduced into the tree when the new node is actually inserted. The imbalance may be close to the new node, or may be 
considerably farther up the tree toward the root, along the search path.  Therefore, during each successive *return* from the call to `insert`
 in the "unwind" stage of the algorithm, the height of the node is updated and the tree is checked for balance.  

When an imbalance is detected, `i.e.` whenever the heights of the subtrees rooted at this node vary by more than `1`, 
a rotation 
or rotations are performed in order to bring the tree back into balance.  **Rotation** is a **local operation**, involving only 6 pointer reassignments,
yet it affects the balance of the tree overall.  

Details of the **rotation**, **single** and **double** rotation are found in the AIA tab `More` for this algorithm.  

 



_**Suggested exercises in AIA**_

To **zig-zig and zig-zag configurations** and **rotation corrections** in AIA: 

-For a left-left zig-zig configuration, enter 50, 40, then with the code expanded enter 30, step by step, to see the temporary left-left zig-zig imbalance, followed by a single rotation.\
-For right-right zig-zig and single rotation, enter 30, 40, then slowly 50.\
-For left-right zig-zag and double rotation, enter 50, 30, then slowly 40.\
-For right-left zig-zag and double rotation enter 30, 50, then slowly 40.

In the above exercises the imbalance takes place near the newly inserted node. To see how an imbalance can quite remote, and how this is handled:


For imbalance further up the tree from the newly inserted node:  
-Input 60,40,80,20,50,70,90,15,25,45,55,10.  Insert 60..55 quickly (use the speed bar and collapse the pseudocode), then expand the pseudocode and proceed step by step as 10 is inserted.

 
 
 
 
 
 
 
 
 
 
