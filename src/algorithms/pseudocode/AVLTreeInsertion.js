import parse from '../../pseudocode/parse';

export default parse(`
    
\\Note{  REAL specification of AVL tree insertion and search
XXX Note: has undergone significant restructure and bookmarks have not been
renamed according to new structure
\\Note}

\\Note{  modified from BST - best check actual running BST Real code for
search and use that  XXX still needs unification with BST

Terminology (changed, might change again but this looks OK I reckon)
XXX should change BST (et al?) so it is consistent
We brush over the fact that pointers are used and use record notation
"." where C "->" would be used (implicit dereference of pointer).
t <- t.left etc is the most dubious looking code if we think of records
and not pointers.
Basically t = Empty or, otherwise, t.key, t.left and t.right exist (we
don't explicitly use t.height in the code but could). Creating a new
singleton tree is done in a single step.
\\Note}

\\Note{ For both insertion and search, the animation should be as
consistent
as possible with BST
\\Note}

\\Code{
Main
\\Note{
  This is recursive, with most of the work done as we return back up from
  recursive calls. This should be visualised in some way. Perhaps
  colouring nodes on the way down and removing the colour on the way
  back up is sufficient - there is only one path back up to the root.
  The "current" node should certainly be highlighted in some way also.
\\Note}
AVLT_Insert(t, k) // returns t with key k inserted \\B Main
  \\In{
    if t = Empty \\B if t = Empty
    \\In{
\\Note{ simplified this
      //Both subtrees are Empty and the height is 1
      create new node n containing k \\B create new node
\\Note}
      return a single-node tree containing k \\B return n
      \\Expl{ Both subtrees are Empty and its height is 1.
              New memory will need to be allocated for it.
              This is the base case of the recursion.
      \\Expl}
    \\In}
    if k < t.key \\B if k < t.key
    \\Expl{ The key in the root determines if we insert into the left or
          right subtree.
    \\Expl}
    \\In{
        insert k into the left subtree of t \\Ref recurseLeft
    \\In}
    else if k > t.key \\B else if k > root(t).key
      \\Note{ XXX allow duplicate keys or not??? Avoid for now.
      \\Note}
      \\Expl{ Note: if k = t.key we ignore the insertion.
      \\Expl}
    \\In{
        insert k into the right subtree of t \\Ref recurseRight
    \\In}
\\Note{ !*%#ing rubbish parser - right brace removed
    else \\B else k = root(t).key
    \\In{
        return t // ignore duplicate key \\B return t, no change
    \\In] XXX
\\Note}
    Update the height of t \\B root(t).height = 1 + max(left(t).height, right(t).height)
    \\Expl{
        The tree height is one more than the maximum height of its children. It may
        have increased by one due to the insertion.
    \\Expl}
    Re-balance (if needed) and return t \\Ref rotateIfNeeded
    \\Expl{ If the tree has become unbalanced, it can be made balanced by
      performing one or two "rotation" operations.
      Rotations are local tree operations that decrease the
      height/depth of one subtree but may increase that of another.
      See Background (click at the top of the right panel)
      for diagrams etc explaining rotations.
    \\Expl}
  \\In}
\\Code}

\\Code{
recurseLeft
\\Note{
Animation stops at this comment so user can prepare mentally for
recursive call plus we need a chunk at this level of recursion just
before the call so we can step back to it
\\Note}
// *recursively* call insert with the left subtree \\B prepare for the left recursive call
t.left <- AVLT_Insert(t.left, k) \\B recursiveCallLeft
\\Expl{
The (possibly empty) left subtree is replaced by the result of this recursive call.
\\Expl}
\\Code}


\\Code{
recurseRight
\\Note{
Animation stops at this comment so user can prepare mentally for
recursive call plus we need a chunk at this level of recursion just
before the call so we can step back to it
\\Note}
// *recursively* call insert with the right subtree \\B prepare for the right recursive call
t.right <- AVLT_Insert(t.right, k) \\B recursiveCallRight
\\Expl{
The (possibly empty) right subtree is replaced by the result of this recursive call.
\\Expl}
\\Code}

\\Code{
rotateIfNeeded
switch balanceCase(t) of \\B switch balanceCase of
\\Expl{ If the "balance" of t  (t.left.height - t.right.height) is between -1
and 1, inclusive, we just
return t. Otherwise we must determine which sub-sub-tree the new element was
inserted into and use "rotation" operations to raise up that subtree and
restore balance.
See Background (click at the top of the right panel)
for diagrams etc explaining rotations.
\\Expl}
case Balanced:// sufficiently balanced \\B case Balanced
\\Expl{
  Tree t is sufficiently balanced (-1 <= balance <= 1) so no
  rotations are needed:)
\\Expl}
\\In{
    return t \\B return t
\\In}
case Left-Left:// Left-Left insertion, unbalanced \\B perform right rotation to re-balance t
\\Expl{
  Key k was inserted into the left-left subtree and made t unbalanced
  (balance > 1 and k < t.left.key).
  We must re-balance the tree with a "right rotation" that lifts up this
  subtree.  See Background (click at the top of the right panel)
  for diagrams etc explaining rotations.
\\Expl}
\\In{
    return rightRotate(t) // raise Left-Left subtree to balance \\B return rightRotate(t)
\\In}
case Right-Right:// Right-Right insertion, unbalanced \\B perform left rotation to re-balance t
\\Expl{
  Key k was inserted into the right-right subtree and made t unbalanced
  (balance < -1 and k > t.right.key).
  We must re-balance the tree with a "left rotation" that lifts up this
  subtree.  See Background (click at the top of the right panel)
  for diagrams etc explaining rotations.
\\Expl}
\\In{
  return leftRotate(t) // raise Right-Right subtree to balance \\B return leftRotate(t)
\\In}
case Left-Right:// Left-Right insertion, unbalanced \\B perform left rotation on the left subtree
\\Expl{
  Key k was inserted into the left-right subtree and made t unbalanced
  (balance > 1 && k > t.left.key).
  Balance can be restored by performing a "left rotation" on t.left (this
  lifts up the subtree) followed by a right rotation of t (in case the first
  rotation made the left-left subtree too deep).
  See Background (click at the top of the right panel)
  for diagrams etc explaining rotations.
\\Expl}
\\In{
  t.left <- leftRotate(t.left); // raise Left-Right-Right subtree \\B left(t) <- leftRotate(left(t));
  \\Expl{
    This also raises the root of the Left-Right subtree.
    The Left-Right-Left subtree remains at the same level but is now the
    Left-Left-Right subtree (it is raised in the next step).
  \\Expl}
  return rightRotate(t) // raise Left-Left subtree to balance \\B return rightRotate(t) after leftRotate
  \\Expl{
    This raises what was previously the Left-Right-Left subtree, so the
    whole of the previous Left-Right subtree is now higher (and the
    Right subtree is lower).
  \\Expl}
\\In}
case Right-Left:// Right-Left insertion, unbalanced \\B perform right rotation on the right subtree
\\Expl{
  Key k was inserted into the right-left subtree and made t unbalanced
  (balance < -1 && k < t.right.key).
  Balance can be restored by performing a "right rotation" on t.right (this
  lifts up the subtree) followed by a left rotation of t (in case the first
  rotation made the right-right subtree too deep).
  See Background (click at the top of the right panel)
  for diagrams etc explaining rotations.
\\Expl}
\\In{
  t.right <- rightRotate(t.right); // raise Right-Left-Left subtree \\B right(t) <- rightRotate(right(t));
  \\Expl{
    This also raises the root of the Right-Left subtree.
    The Right-Left-Right subtree remains at the same level but is now the
    Right-Right-Left subtree (it is raised in the next step).
  \\Expl}
  return leftRotate(t) // raise Right-Right subtree to balance \\B return leftRotate(t) after rightRotate
  \\Expl{
    This raises what was previously the Right-Left-Right subtree, so the
    whole of the previous Right-Left subtree is now higher (and the
    Left subtree is lower).
  \\Expl}
\\In}
// ==== rotation functions ====
leftRotate(t2) // raises Right-Right + lowers Left-Left subtrees \\B leftRotate(t2)
\\Expl{
The edge between t2 and its right child is "rotated" to the left
(counter-clockwise), and the right child becomes the new root.
See Background (click at the top of the right panel)
for diagrams etc explaining rotations.
\\Expl}
  \\In{
    t6 <- t2.right \\B t6 = right(t2)
    t4 <- t6.left // may be Empty \\B t4 = left(t6)
    t6.left <- t2 \\B t6.left = t2
    t2.right <- t4 // may be Empty \\B t2.right = t4
    recompute heights of t2 and t6 \\B recompute heights of t2 and t6
    \\Expl{ The height of each tree is one more than its sub-tree heights.
        t2 will decrease in height by one. t6 may increase in height by one.
    \\Expl}
    return (pointer to) t6 // new root \\B return t6
  \\In} 
rightRotate(t6) // inverse of leftRotate \\B rightRotate(t6)
\\Expl{
The edge between t6 and its left child is "rotated" to the right
(clockwise), and the left child becomes the new root.
See Background (click at the top of the right panel)
for diagrams etc explaining rotations.
\\Expl}
  \\In{
    t2 <- t6.left \\B t2 = left(t6)
    t4 <- t2.right // may be Empty \\B t4 = right(t2)
    t2.right <- t6 \\B t2.right = t6
    t6.left <- t4 // may be Empty \\B t6.left = t4
    \\Note{ Animation here should be as smooth an intuitive as possible.
      Ideally node 4 should get detached from 2 but remain in place then
      get re-attached to 6. We could possibly move 7 down to the level of 4
      at the first step and delay moving 1 up until the end. Best highlight
      the edge between 6 and 2. If extra steps are required for animation
      we can stay on the same line of code for more than one step if
      needed. Similarly for left rotation.
    \\Note}
    recompute heights of t6 and t2 \\B recompute heights of t6 and t2
    \\Expl{ The height of each tree is one more than its sub-tree heights.
        t6 will decrease in height by one. t2 may increase in height by one.
    \\Expl}
    return (pointer to) t2 // new root \\B return t2
  \\In} 
\\Code}

\\Note{  This is an implementation in C (from geeksforgeeks, with very
minor mods):
// C program to insert a node in AVL tree 
#include<stdio.h> 
#include<stdlib.h> 

// An AVL tree node 
struct Node 
{ 
	int key; 
	struct Node *left; 
	struct Node *right; 
	int height; 
}; 

// A utility function to get the height of the tree 
int height(struct Node *N) 
{ 
	if (N == NULL) 
		return 0; 
	return N->height; 
} 

// A utility function to get maximum of two integers 
int max(int a, int b) 
{ 
	return (a > b)? a : b; 
} 

/* Helper function that allocates a new node with the given key and 
	NULL left and right pointers. */
struct Node* newNode(int key) 
{ 
	struct Node* node = (struct Node*) 
						malloc(sizeof(struct Node)); 
	node->key = key; 
	node->left = NULL; 
	node->right = NULL; 
	node->height = 1; // new node is initially added at leaf 
	return(node); 
} 

// A utility function to right rotate subtree rooted with y 
// See the diagram given above. 
struct Node *rightRotate(struct Node *y) 
{ 
	struct Node *x = y->left; 
	struct Node *T2 = x->right; 

	// Perform rotation 
	x->right = y; 
	y->left = T2; 

	// Update heights 
	y->height = max(height(y->left), 
					height(y->right)) + 1; 
	x->height = max(height(x->left), 
					height(x->right)) + 1; 

	// Return new root 
	return x; 
} 

// A utility function to left rotate subtree rooted with x 
// See the diagram given above. 
struct Node *leftRotate(struct Node *x) 
{ 
	struct Node *y = x->right; 
	struct Node *T2 = y->left; 

	// Perform rotation 
	y->left = x; 
	x->right = T2; 

	// Update heights 
	x->height = max(height(x->left), 
					height(x->right)) + 1; 
	y->height = max(height(y->left), 
					height(y->right)) + 1; 

	// Return new root 
	return y; 
} 

// Get Balance factor of node N 
int getBalance(struct Node *N) 
{ 
	if (N == NULL) 
		return 0; 
	return height(N->left) - height(N->right); 
} 

// Recursive function to insert a key in the subtree rooted 
// with node and returns the new root of the subtree. 
struct Node* insert(struct Node* node, int key) 
{ 
	/* 1. Perform the normal BST insertion */
	if (node == NULL) 
		return(newNode(key)); 

	if (key < node->key) 
		node->left = insert(node->left, key); 
	else if (key > node->key) 
		node->right = insert(node->right, key); 
	else // Equal keys are not allowed in BST 
		return node; 

	/* 2. Update height of this ancestor node */
	node->height = 1 + max(height(node->left), 
						height(node->right)); 

	/* 3. Get the balance factor of this ancestor 
		node to check whether this node became 
		unbalanced */
	int balance = getBalance(node); 

	// If this node becomes unbalanced, then 
	// there are 4 cases 

	// Left Left Case 
	if (balance > 1 && key < node->left->key) 
		return rightRotate(node); 

	// Right Right Case 
	if (balance < -1 && key > node->right->key) 
		return leftRotate(node); 

	// Left Right Case 
	if (balance > 1 && key > node->left->key) 
	{ 
		node->left = leftRotate(node->left); 
		return rightRotate(node); 
	} 

	// Right Left Case 
	if (balance < -1 && key < node->right->key) 
	{ 
		node->right = rightRotate(node->right); 
		return leftRotate(node); 
	} 

	/* return the (unchanged) node pointer */
	return node; 
} 

// A utility function to print preorder traversal 
// of the tree. 
// The function also prints height of every node XXX no it doesn't
void preOrder(struct Node *root) 
{ 
	if(root != NULL) 
	{ 
		printf("(%d", root->key); 
		preOrder(root->left); 
		preOrder(root->right); 
		printf(")"); 
	} 
} 

/* Driver program to test above function*/
int main() 
{ 
struct Node *root = NULL; 

/* Constructing tree given in the above figure */
root = insert(root, 10); 
root = insert(root, 20); 
root = insert(root, 30); 
root = insert(root, 40); 
root = insert(root, 50); 
root = insert(root, 25); 

/* The constructed AVL Tree would be 
			30 
		/ \\
		20 40 
		/ \\	\\ 
	10 25 50 
*/

printf("Preorder traversal of the constructed AVL"
		" tree is \\n"); 
preOrder(root); 
printf("\\n"); 

return 0; 
} 
\\Note}
`);
