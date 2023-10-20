import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of 234 tree insertion and search
\\Note}
    
\\Note{  We would like the AIA representation of data structures for 
        search applications to share a certain format, allowing the 
        student to develop and use a structure (such as a BST) 
        through these operations: create a structure, search, insert, 
        and remove elements. This specification only covers 
        construction (using insertion) and search.
\\Note}
    
\\Overview{

\\Note{ Linda's changes 7/2023
par 1 line 4 "named for..."
par 2 line 3 "made for a given tree"
More later I didn't keep track of them
  more explanation of why splitting, top down, bottom up
Last paragraph end with B-trees
\\Note}

A 234 tree is a form of balanced search tree (and a simple instance
of a B-tree).  All leaves are at the same level of the tree. The
tree is made up of three kinds of nodes: two-nodes, three-nodes
and four-nodes, named for the number of childred the node has.
Two-nodes are the same as binary search tree nodes,
containing a left subtree (child1), a key (key1) and a right subtree
(child2). Ordinarily they would also hold a data field, which the user
would like to find by searching for the key. Since this field has no
impact on how insertion and search take place, we disregard it here.

The tree is ordered so the keys in child1 are less than key1, which is
less than the keys in child2.
Three-nodes have two keys and three subtrees, named and
ordered child1, key1, child2, key2, child3.  Four-nodes have three keys
and four subtrees, named and ordered child1, key1, child2, key2, child3,
key3, child4.  

For simplicity, equal keys have been ignored in this module. One way of handling duplicate
keys would be to have a linked list of records originating in the node. Alternatively an
application might not support records with equal keys, sending an error message if there
is an attempt to insert a record whose key is already in the tree.  Another alternative might be
to make an arbitrary choice beween storing equal keys in the left or the right subtree, and implement
a search function that finds all matching keys.

New items are always inserted in the leaves of the tree. Insertion into
two-nodes and three-nodes is straightforward - just add the key and another pointer
to the leaf node. However, if the search for the correct insertion point leads to a four-node,
the four-node
must be  split into two two-nodes, so as to make space for the insertion.
Because splitting,
might propagate up the tree, if the parent of the newly split four-node was also a four-node,
it is simplest to implement the
"top down" 234 tree insertion algorithm shown in this animation, which always splits four-nodes
encountered as we traverse down the tree. There is a more complicated
"bottom up" version that waits to split four-nodes until the split is actually needed.  The
"bottom-up" version can slightly reduce the number of nodes in the
tree in some cases, potentially improving efficiency.  

---

Although 234 trees
are a bit cumbersome to code directly in many programming languages due
to the multiple kind of nodes, they provide the idea behind red-black
trees.  Red-black trees can be seen as a representation of 234-trees
using a simpler data structure but a more complicated algorithm. Another
variation of 234-trees is to ensure all nodes as compact as possible,
for example, omitting child pointers from leaf nodes. This results in
more node types and more re-allocation of memory when node types change
but can be very space-efficient. Other variations of the 234-trees are the B-tree
and the B+ tree, where each node has between M and M/2 children. The B- and B+-tree
minimize memory accesses by setting M so that the node size is equal
to the page of the file-system.

\\Overview}
  
    
\\Note{
    Visualisation can use one, two or three boxes for nodes, with arrows for
    subtrees originating from the bottom corner of the boxes. Ideally,
    animation should be consistent with binary search tree animation where
    possible.
\\Note}
    
\\Code{
    T234_Search(t, k)
    \\Note{  We separate comparison for equality with comparison for finding
    the subtree to traverse down to next to simplify refinement
    \\Note}
    \\In{
        while t not Empty
        \\In{
            if the root of t contains k, return t \\Ref Return_if_key_in_node
            \\Expl{  There can be different kinds of node and multiple keys per node.
            \\Expl}
            \\Note{  Refinement is messy due to different kinds of node so we
                    include return here and avoid else
            \\Note}
            t <- the child of t that may contain k \\Ref Find_child
            \\Expl{  There can be different kinds of node and multiple children.
            \\Expl}
        \\In}
        return NotFound
    \\In}
\\Code}
    
\\Code{
    Return_if_key_in_node
    if t is a two-node
    \\In{
        if t.key1 == k return t
    \\In}
    else if t is a three-node
    \\In{
        if t.key1 == k or t.key2 == k return t
    \\In}
    else // t is a four-node
    \\In{
        if t.key1 == k or t.key2 == k or t.key3 == k return t
    \\In}
\\Code}
    
\\Code{
    Find_child
    if t is a two-node
    \\In{
        if k < t.key1
        \\In{
            c <- t.child1
        \\In}
        else
        \\In{
            c <- t.child2
        \\In}
    \\In}
    else if t is a three-node
    \\In{
        if k < t.key1
        \\In{
            c <- t.child1
        \\In}
        else if k < t.key2
        \\In{
            c <- t.child2
        \\In}
        else
        \\In{
            c <- t.child3
        \\In}
    \\In}
    else // t is a four-node
    \\Expl{ We could use nested if-then-else here so we always have two
    key comparisons
    \\Expl}
    \\In{
        if k < t.key1
        \\In{
            c <- t.child1
        \\In}
        else if k < t.key2
        \\In{
            c <- t.child2
        \\In}
        else if k < t.key3
        \\In{
            c <- t.child3
        \\In}
        else
        \\In{
            c <- t.child4
        \\In}
    \\In}
\\Code}
    
\\Code{
    Main
    T234_Insert(t, k) \\B 1
    \\In{
        if t = Empty 
        \\In{
            t <- a new two-node containing k and empty subtrees
        \\In}
        else
        \\In{
            Traverse down to a leaf node p, transforming any four-nodes \\Ref Traverse 
            \\Expl{  Any four-node encountered is split into two two-nodes and the
                    middle key (key2) is inserted into the parent node. Once this
                    is done, we can be sure the leaf will have enough room for an
                    extra key. The tree grows in height when the root node is
                    split.
            \\Expl}
            Insert k into leaf p (changing the kind of node) \\Ref Insert 
            \\Expl{  A two-node will change to a three-node and a three-node
                    will change to a four-node.
            \\Expl}
        \\In}
    \\In}
\\Code}
    
\\Code{
    Insert
    if p is a two-node
    \\In{
        Change p to a three-node, containing the old p.key1 and k
        \\Note{ Expand this????
        \\Note}
        \\Expl{ We must compare the keys and ensure they are in the right
               order in the new node.  All subtrees are empty.
        \\Expl}
    \\In}
    else // p is three-node (four-nodes have been split)
    \\In{
        Change p to a four-node, containing the old p.key1 and p.key2 and k
        \\Note{ Expand this????
        \\Note}
        \\Expl{ We must compare the keys and ensure they are in the right
               order in the new node.  All subtrees are empty.
        \\Expl}
    \\In}
\\Code}
    
\\Code{
    Traverse
    \\Note{
    The code here stops when c becomes Empty.  This results in more
    comparisons but slightly simpler code structure. We could break out of
    the loop when c is a leaf instead. The low level details of the code and
    its efficiency are not so important so I have gone for simple structure.
    It's also more similar to the BST code to iterate until we fall off the
    tree then repeat some comparison.
    \\Note}
    p <- Empty        // We keep track of the parent node, initially Empty
    c <- t            // c traverses the path from the root down to a leaf
    \\Expl{  c (and parent node p) will follow a path down to a leaf where new key
            is to be inserted. We start from the root (t) and stop when p
            reaches a leaf.
    \\Expl}
    repeat
    \\In{
        if c is a four-node
        \\In{
        Split c into two two-nodes and insert c.key2 into parent (p) \\Ref Split
           \\Expl{  c is assigned the left or right node depending on comparison
                   with k. If p is empty a new two-node is added as the root
                   and the height of the tree increases by one.
            \\Expl}
        \\In} 
        p <- c
        \\Expl{  c will move down one level so the old c is the new p.
        \\Expl}
        c <- a child of c, dependent on key comparisons \\Ref MoveToChild
    \\In}
    until c is Empty (and p is a leaf node)
\\Code}
    
\\Code{
    Split 
    c1 <- new two-node with c.child1, c.key1 and c.child2
    c2 <- new two-node with c.child3, c.key3 and c.child4
    Insert c1, c.key2 and c2 into parent node p, replacing c \\Ref InsertParent
    \\Expl{
        c1 and c2 will be children of p instead of c. p must be a two-node
        or three-node so there will be room for expansion, because
        four-nodes were split as we traversed down.
    \\Expl}
    if k < c.key2
    \\In{
        c <- c1
        \\Expl{ c is the new subtree that k belongs in
        \\Expl}
    \\In}
    else
    \\In{
        c <- c2
        \\Expl{ c is the new subtree that k belongs in
        \\Expl}
    \\In}
    \\Code}
    
    \\Code{
    InsertParent
    if p = Empty
    \\In{
        t <- new two-node with c1, c.key2 and c2
        \\Expl{  This is where the tree t grows by one level
        \\Expl}
        p <- t
    \\In}
    else if p is a two-node
    \\In{
        Change p to a three-node, with c1, c.key2 and c2 replacing c
        \\Note{ Expand this????
        \\Note}
        \\Expl{  If the old p.child1 = c the new node contains c1, c.key2, c2,
                p.key1 and p.child2. If the old p.child2 = c the new node
                contains p.child1, p.key1, c1, c.key2 and c2.
        \\Expl}
    \\In}
    else // p is three-node (four-nodes have been split)
    \\In{
        Change p to a four-node, with c1, c.key2 and c2 replacing c
        \\Note{ Expand this????
        \\Note}
        \\Expl{  If the old p.child1 = c the new node contains c1, c.key2, c2,
                p.key1, p.child2, p.key2 and p.child3. If the old p.child2 = c
                the new node contains p.child1, p.key1, c1, c.key2, c2, p.key2
                and p.child3. If the old p.child3 = c the new node contains
                p.child1, p.key1, p.child2, p.key2, c1, c.key2 and c2.
        \\Expl}
    \\In}
\\Code}
    
\\Code{
    MoveToChild
    if c is a two-node
    \\In{
        if k < c.key1
        \\In{
            c <- c.child1
        \\In}
        else
        \\In{
            c <- c.child2
        \\In}
    \\In}
    else if c is a three-node
    \\In{
        if k < c.key1
        \\In{
            c <- c.child1
        \\In}
        else if k < c.key2
        \\In{
            c <- c.child2
        \\In}
        else
        \\In{
            c <- c.child3
        \\In}
    \\In}
    else // c is a four-node
    \\Expl{ We could use nested if-then-else here so we always have two
    key comparisons
    \\Expl}
    \\In{
        if k < c.key1
        \\In{
            c <- c.child1
        \\In}
        else if k < c.key2
        \\In{
            c <- c.child2
        \\In}
        else if k < c.key3
        \\In{
            c <- c.child3
        \\In}
        else
        \\In{
            c <- c.child4
        \\In}
    \\In}
\\Code}
`);