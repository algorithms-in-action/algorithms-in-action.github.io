# AVL Trees



An AVL tree is **self-balancing** **binary search tree**.

Unlike the basic binary search tree, which can exhibit *O(n)* worst case behavior for certain inputs, the AVL tree is always balanced, so search will be *O(log n)*
regardless of the order of the input data. 

### The Binary Search Tree Invariant

A **binary tree (BST)** is either is either empty (Empty) or else it
it has a root node and two subtrees (which are binary trees, and can also be empty).
The root node t has a key t.key. Ordinarily every node would also
hold other data (t.data), which the user would like to find by
searching for the key, *e.g.* search for Student ID Number (key) to find street address (data).  Since the 
data attribute has no impact on 
how insertion and search take place, we disregard it in this animation.


Note that a newly inserted node 
will always appear as a leaf
in the tree. 

		
In any binary search tree, the **BST invariant** is always maintained; that is,
for each 
subtree t, with root key t.key, the left subtree, t.left, 
contains no node with key greater than t.key, and the right subtree,
t.right, contains no node with key smaller than t.key.



### Insertion and Tree Balancing 


**Insertion of a new item** into any binary tree (*e.g.* a BST or an AVL tree) requires 
(1) first the search to find the correct place to insert, then (2) the actual insertion. 

In the **recursive implementation** of the AVL shown in *AIA*, the first stage, 
determining the insertion point, takes place
during the recursive *calls* to the insert function, which accumulate on the machine stack.  


The last recursive call *returns* when the new node has been inserted into the tree. 

In the AVL tree, the height of the subtree rooted at each node is stored in the 
node.During *each* successive *return* from the call to insert,
the **height of the   is updated** and the **tree is checked for balance**.
When a new node is inserted in an AVL tree, the tree may become *temporarily* unbalanced, that is 
the difference in  heights of the left and right subtrees of *any* node is greater than 1.



If the tree has become unbalanced, 
balance will be restored using one or two **rotation**
operations, which reduce the height of the unbalanced subtree, while still maintaining the BST invariant.

### Imbalance configurations and rotations

The exact sequence of rotations depends on the configuration around the 
node where the imbalance has been detected.

There are four possible configurations at the node where an imbalance has been detected:
(1) *left-left*, where the  where the child and grandchild nodes or subtrees of the unbalanced node are 
either both left subtrees, and (2) its mirror image and *right-right*, where the child and grandchild are both right 
subtrees; (3) *left-right*, where there is a left child, with a right subtree as the grandchild, and (4) its mirror image 
*right-left*, where the the right child of the unbalanced node has a left (grand)child.   

The *left-left* imbalance is restored by a single rotation around the edge between the node
where the imbalance is detected and its (left) child.  Try inserting items 30, 20, then 10 into an AVL tree in *AIA*.  You
will see that the rotation restores balance, and at the same time maintains the binary search invariant.  Similarly for
the *right-right* configuration; try inserting 10, 20, then 30 into the *AIA* AVL tree.        




If you try a larger tree
XXX Lee -- we should come up with a sample tree here, to show imbalance up the tree from the new insert
XXX Lee -- we can put URLs here, as you suggested. Should we do that for the really simple ones above?

As you can see, while 
**rotation** is a **local operation**, involving only 6 pointer reassignments,
it can affect the balance of the tree overall.  

The *left-right* and *right-left* configurations require a double rotation.  For the *left-right* configuration,
first a left rotation at the edge between the child and grandchild of the node, and then a right rotation
at the edge between the node and its now left child (previously grandchild).  The *right-left* configuration requires
first a right rotation between the child and grandchild, then a left rotation around the node and its (new) right child. 
You can see how these work by inserting 30,10, then 20 into AIA (*left-right*) and 10, 30, 20 (*right-left*).




XXX Lee -- put these exercises here? or integrated into the text, as I've done for left-left above?
Only one place, not both

_**Suggested exercises in AIA**_  
XXX Lee - I haven't reviewed these recently, waiting for us to agree on desired  format first.
XXX In any case, will be rewritten to obliterate zig-zag and friend


-For a left-left zig-zig configuration, enter 50, 40, then with the code expanded enter 30, step by step, to see the temporary left-left zig-zig imbalance, followed by a single rotation.\
-For right-right zig-zig and single rotation, enter 30, 40, then slowly 50.\
-For left-right zig-zag and double rotation, enter 50, 30, then slowly 40.\
-For right-left zig-zag and double rotation enter 30, 50, then slowly 40.

In the above exercises the imbalance takes place near the newly inserted node. To see how an imbalance can quite remote, and how this is handled:


For imbalance further up the tree from the newly inserted node:  
-Input 60,40,80,20,50,70,90,15,25,45,55,10.  Insert 60..55 quickly (use the speed bar and collapse the pseudocode), then expand the pseudocode and proceed step by step as 10 is inserted.

 
 
 
 
 
 
 
 
 
 
