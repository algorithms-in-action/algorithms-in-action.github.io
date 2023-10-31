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
    Main
    T234_Insert(t, k) // return either a node containing key k or \\B T234_Insert(t, k)
                      // NotFound, if no such node is present
    \\In{
        if t = Empty \\B if t = Empty
        \\In{
            t <- a new two-node containing k and empty subtrees \\B t <- a new two-node containing k and empty subtrees
        \\In}
        else \\B else: T234_Insert(t, k)
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
    if p is a two-node \\B if p is a two-node
    \\In{
        Change p to a three-node, containing the old p.key1 and k \\B Change p to a three-node, containing the old p.key1 and k
        \\Note{ Expand this????
        \\Note}
        \\Expl{ We must compare the keys and ensure they are in the right
               order in the new node.  All subtrees are empty.
        \\Expl}
    \\In}
    else // p is three-node (four-nodes have been split) \\B else: Insert
        \\In{
        Change p to a four-node, containing the old p.key1 and p.key2 and k \\B Change p to a four-node, containing the old p.key1 and p.key2 and k
        \\Note{ Expand this????
        \\Note}
        \\Expl{ We must compare the keys and ensure they are in the right
               order in the new node.  All subtrees are empty.
        \\Expl}
    \\In}
\\Code}
    
\\Code{
    Traverse
    // Traverse down to a leaf where k gets inserted, splitting four-nodes
    \\Note{
    The code here stops when c becomes Empty.  This results in more
    comparisons but slightly simpler code structure. We could break out of
    the loop when c is a leaf instead. The low level details of the code and
    its efficiency are not so important so I have gone for simple structure.
    It's also more similar to the BST code to iterate until we fall off the
    tree then repeat some comparison.
    \\Note}
    p <- Empty        // We keep track of the parent node, initially Empty \\B p <- Empty
    c <- t            // c traverses the path from the root down to a leaf \\B c <- t
    \\Expl{  c (and parent node p) will follow a path down to a leaf where new key
            is to be inserted. We start from the root (t) and stop when p
            reaches a leaf.
    \\Expl}
    repeat \\B repeat
    \\In{
        if c is a four-node \\B if c is a four-node
        \\In{
        Split c into two two-nodes and insert c.key2 into parent (p) \\Ref Split
           \\Expl{  c is assigned the left or right node depending on comparison
                   with k. If p is empty a new two-node is added as the root
                   and the height of the tree increases by one.
            \\Expl}
        \\In} 
        p <- c \\B p <- c
        \\Expl{  c will move down one level so the old c is the new p.
        \\Expl}
        c <- a child of c, dependent on key comparisons \\Ref MoveToChild
    \\In}
    until c is Empty (and p is a leaf node) \\B until c is Empty (and p is a leaf node)
\\Code}
    
\\Code{
    Split 
    c1 <- new two-node with c.child1, c.key1 and c.child2 \\B c1 <- new two-node with c.child1, c.key1 and c.child2
    c2 <- new two-node with c.child3, c.key3 and c.child4 \\B c2 <- new two-node with c.child3, c.key3 and c.child4
    Insert c1, c.key2 and c2 into parent node p, replacing c \\Ref InsertParent
    \\Expl{
        c1 and c2 will be children of p instead of c. p must be a two-node
        or three-node so there will be room for expansion, because
        four-nodes were split as we traversed down.
    \\Expl}
    if k < c.key2 \\B if k < c.key2: Split
    \\In{
        c <- c1 \\B c <- c1
        \\Expl{ c is the new subtree that k belongs in
        \\Expl}
    \\In}
    else \\B else: Split
    \\In{
        c <- c2 \\B c <- c2
        \\Expl{ c is the new subtree that k belongs in
        \\Expl}
    \\In}
    \\Code}
    
    \\Code{
    InsertParent
    if p = Empty \\B if p = Empty
    \\In{
        t <- new two-node with c1, c.key2 and c2 \\B t <- new two-node with c1, c.key2 and c2
        \\Expl{  This is where the tree t grows by one level
        \\Expl}
        p <- t \\B p <- t
    \\In}
    else if p is a two-node \\B else if p is a two-node
    \\In{
        Change p to a three-node, with c1, c.key2 and c2 replacing c \\B Change p to a three-node, with c1, c.key2 and c2 replacing c
        \\Note{ Expand this????
        \\Note}
        \\Expl{  If the old p.child1 = c the new node contains c1, c.key2, c2,
                p.key1 and p.child2. If the old p.child2 = c the new node
                contains p.child1, p.key1, c1, c.key2 and c2.
        \\Expl}
    \\In}
    else // p is three-node (four-nodes have been split) \\B else: InsertParent
    \\In{
        Change p to a four-node, with c1, c.key2 and c2 replacing c \\B Change p to a four-node, with c1, c.key2 and c2 replacing c
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
    if c is a two-node \\B if t is a two-node
    \\In{
        if k < c.key1 \\B if k < t.key1: if t is a two-node
        \\In{
            c <- c.child1 \\B c <- t.child1: if t is a two-node
        \\In}
        else \\B else: if t is a two-node
        \\In{
            c <- c.child2 \\B c <- t.child2: if t is a two-node
        \\In}
    \\In}
    else // c is a three-node \\B else if t is a three-node
    \\In{
        if k < c.key1 \\B if k < t.key1: else if t is a three-node
        \\In{
            c <- c.child1 \\B c <- t.child1: else if t is a three-node
        \\In}
        else if k < c.key2 \\B else if k < t.key2: else if t is a three-node
        \\In{
            c <- c.child2 \\B c <- t.child2: else if t is a three-node
        \\In}
        else \\B else: else if t is a three-node
        \\In{
            c <- c.child3 \\B c <- t.child3: else if t is a three-node
        \\In}
    \\In}
\\Code}

\\Note{  This is an implementation in C:
    // 234-tree implementation and simple testing based on two34tree.real
    /*
    echo 15 4 6 18 5 13 2 7 17 9 8 19 11 10 15 16    11 5 16 6 2 3 12 22 1 0 | ./a.out
    
    Inorder traversal yields:
      (4.1)2
      (4.2)4
      (4.3)5
     (2.1)6
      (2.1)7
    (2.1)8
      (4.1)9
      (4.2)10
      (4.3)11
     (3.1)13
      (4.1)15
      (4.2)16
      (4.3)17
     (3.2)18
      (2.1)19
    
    Found  11
    Found  5
    Found  16
    Found  6
    Found  2
    Missed 3
    Missed 12
    Missed 22
    Missed 1
    */
    
    #include<stdio.h>
    #include<stdlib.h>
    
    typedef int k234;
    typedef struct node234 {
        int node_kind; // 2, 3 or 4
        struct node234 *child1;
        k234 key1;
        struct node234 *child2;
        k234 key2;
        struct node234 *child3;
        k234 key3;
        struct node234 *child4;
        } n234, *t234;
    
    #define NEW(type) (type *) malloc(sizeof(type))
    #define demand(fact, remark)\
        {   if (!(fact))\
            {   fprintf(stderr, "%s\n", remark); exit(1);   }\
        }
    
    #define SIZE 30      /* Allow for a tree with up to 30 keys */
    
    // list (and other) code from bst.c
    typedef struct lnode {
        int elt;
        struct lnode *next;
    } ELT;
    
    // change node to particular kind with given fields
    // Braces used to avoid potential bugs with use in "else" so
    // no ";" needed/wanted.  Temp vars used in case arguments are fields of
    // struct being updated (its a macro so call by name, not value)
    #define mkThree(c, c1, k1, c2, k2, c3) \
        {t234 c1t=c1, c2t=c2, c3t=c3; k234 k1t=k1, k2t=k2; \
        c->node_kind = 3; c->child1 = c1t; c->key1 = k1t; c->child2 = c2t; \
        c->key2 = k2t; c->child3 = c3t;}
    #define mkFour(c, c1, k1, c2, k2, c3, k3, c4) \
        {t234 c1t=c1, c2t=c2, c3t=c3, c4t=c4; k234 k1t=k1, k2t=k2, k3t=k3; \
        c->node_kind = 4; c->child1 = c1t; c->key1 = k1t; c->child2 = c2t; \
        c->key2 = k2t; c->child3 = c3t; c->key3 = k3t; c->child4 = c4t;}
    
    void build_t234(ELT *lst, t234 *tp);
    t234 find_child(t234 c, k234 k);
    t234 Two(t234 c1, k234 k1, t234 c2);
    void t234_insert(t234 *tp, k234 k);
    void inorder(t234 t, int indent);
    
    // create new two-node with given contents
    t234
    Two(t234 c1, k234 k1, t234 c2) {
        t234 c;
    
        c = NEW(n234);
        c->node_kind = 2;
        c->child1 = c1;
        c->key1 = k1;
        c->child2 = c2;
        return c;
    }
    
    // 234-tree insertion.  We pass in pointer to tree so it can be modified
    // and return void
    void
    t234_insert(t234 *tp, k234 k) {
            // p is the parent of c and follows c down the tree to a leaf
        t234 c, p;
    
        if (*tp == NULL) {  
            c = Two(NULL, k, NULL);
            *tp = c;
        } else {
            // Traverse
            p = NULL;
            c = *tp;
            do {
                if (c->node_kind == 4) {
                    // Split
                    t234 c1, c2;
                    c1 = Two(c->child1, c->key1, c->child2);
                    c2 = Two(c->child3, c->key3, c->child4);
                    // InsertParent
                    if (p == NULL)
                        *tp = Two(c1, c->key2, c2); // add new root to tree
                    else if (p->node_kind == 2)
                        if (p->child1 == c)
                            mkThree(p, c1, c->key2, c2, p->key1, p->child2)
                        else
                            mkThree(p, p->child1, p->key1, c1, c->key2, c2)
                    else { // p->node_kind == 3
                        if (p->child1 == c)
                            mkFour(p, c1, c->key2, c2, p->key1, p->child2, p->key2, p->child3)
                        else if (p->child2 == c)
                            mkFour(p, p->child1, p->key1, c1, c->key2, c2, p->key2, p->child3)
                        else
                            mkFour(p, p->child1, p->key1, p->child2, p->key2, c1, c->key2, c2)
                    }
                    if (k < c->key2) {
                        c = c1;
                    } else {
                        c = c2;
                    }
                }
                p = c;
                c = find_child(c, k);
            } while (c);
            // Insert
            if (p->node_kind == 2)
                if (k < p->key1)
                    mkThree(p, NULL, k, NULL, p->key1, NULL)
                else
                    mkThree(p, NULL, p->key1, NULL, k, NULL)
            else // p->node_kind == 3
                if (k < p->key1)
                    mkFour(p, NULL, k, NULL, p->key1, NULL, p->key2, NULL)
                else if (k < p->key2)
                    mkFour(p, NULL, p->key1, NULL, k, NULL, p->key2, NULL)
                else
                    mkFour(p, NULL, p->key1, NULL, p->key2, NULL, k, NULL)
        }
    }
    
    // return child of node that might contain k
    t234
    find_child(t234 c, k234 k) {
        if (c->node_kind == 2)
            if (k < c->key1)
                return c->child1;
            else
                return c->child2;
        else if (c->node_kind == 3)
            if (k < c->key1)
                return c->child1;
            else if (k < c->key2)
                return c->child2;
            else
                return c->child3;
        else // c->node_kind == 4
            if (k < c->key1)
                return c->child1;
            else if (k < c->key2)
                return c->child2;
            else if (k < c->key3)
                return c->child3;
            else
                return c->child4;
    }
    
    // insert list elements into tree
    void
    build_t234(ELT *lst, t234 *tp) {
        while (lst) { 
            t234_insert(tp, lst->elt);
            lst = lst->next;
        }
    } 
    
    void search_t234(t234 t, k234 k) {
        while (t) {
            if (k == t->key1 || t->node_kind>1 && 
                    (k == t->key2 || t->node_kind>2 && k == t->key3)) {
                printf("Found  %d\n", k);
                return;
            }
            t = find_child(t, k);
        }
        printf("Missed %d\n", k);
        return;
    }
    
    void inorder(t234 t, int indent) {
        int i;
    
        if (t) {
            inorder(t->child1, indent+1);
            for (i=0; i<indent; i++) printf(" ");
            printf("(%d.1)", t->node_kind);
            printf("%d\n", t->key1);
            inorder(t->child2, indent+1);
            if (t->node_kind>2) {
                for (i=0; i<indent; i++) printf(" ");
                printf("(%d.2)", t->node_kind);
                printf("%d\n", t->key2);
                inorder(t->child3, indent+1);
                if (t->node_kind>3) {
                    for (i=0; i<indent; i++) printf(" ");
                    printf("(%d.3)", t->node_kind);
                    printf("%d\n", t->key3);
                    inorder(t->child4, indent+1);
                }
            }
        }
    }
    
    int main() {
        t234 t=NULL;
        int i, n, x;
        ELT *e;
        ELT *first;
        ELT *last;
        scanf("%d", &n);
        demand(n>0, "n must be positive");
        first = NEW(ELT);
        first->next = NULL;
        scanf("%d", &(first->elt));
        last = first;
        
        for (i=1; i<n; i++) {
            e = NEW(ELT);
            e->next = NULL;
            scanf("%d", &(e->elt));
            last->next = e;
            last = e;
        }
        
        build_t234(first, &t);
    
     /* For testing only : */
        printf("\nInorder traversal yields:\n");
        inorder(t, 0);   
        printf("\n");                         
    /*  */
        scanf("%d", &x);
        while (x > 0) {
            search_t234(t, x);
            scanf("%d", &x);
        } 
    
        return 0;
    }
     
    /* Example of test input with 15 keys (must be no more than 20):
    
    15
    77  13  10  46  94  49  91  88  25  62  54  59  19  44  16
    62
    63
    94
    0
    
    This yields the following output:
    
    Found  62
    Missed 63
    Found  94
    
    */
    
    \\Note}
    \\Note{
    Handy things to copy/paste in vim for editing this file:
    (mostly in my .exrc now)
    :set ts=4 et
    
    \\In{
    \\In}
    
    \\Note}
`);