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
    
    A 234 tree is a form of balanced search tree (and a simple instance
    of a B-tree).  All leaves are at the same level of the tree. The
    tree is made up of three kinds of nodes: two-nodes, three-nodes
    and four-nodes. Two-nodes are the same as binary search tree nodes,
    containing a left subtree (child1), a key (key1) and a right subtree
    (child2). Ordinarily they would also hold a data field, which the user
    would like to find by searching for the key. Since this field has no
    impact on how insertion and search take place, we disregard it here.
    The tree is ordered so the keys in child1 are less than key1, which is
    less than the keys in child2. Equal keys are ignored here. They can either
    not be supported or an arbitrary choice made beween storing them in the
    left and right subtrees; a search function that finds all matching keys
    can be supported.  Three-nodes have two keys and three subtrees, named and
    ordered child1, key1, child2, key2, child3.  Four-nodes have three keys
    and four subtrees, named and ordered child1, key1, child2, key2, child3,
    key3, child4.  The version of the insertion algorithm here is called the
    "top down" 234 tree insertion algorithm, which always splits four-nodes
    encountered as we traverse down the tree. There is a more complicated
    "bottom up" version that can slightly reduce the number of nodes in the
    tree in some cases, potentially improving efficiency.  Although 234 trees
    are a bit cumbersome to code directly in many programming languages due
    to the multiple kind of nodes, they provide the idea behind red-black
    trees.  Red-black trees can be seen as a representation of 234-trees
    using a simpler data structure but a more complicated algorithm. Another
    variation of 234-trees is to ensure all nodes as compact as possible,
    for example, omitting child pointers from leaf nodes. This results in
    more node types and more re-allocation of memory when node types change
    but can be very space-efficient.
\\Overview}
    
\\Note{
    Visualisation can use one, two or three boxes for nodes, with arrows for
    subtrees originating from the bottom corner of the boxes. Ideally,
    animation should be consistent with binary search tree animation where
    possible.
\\Note}
    
\\Code{
    Main
    T234_Insert(t, k) \\B T234_Insert(t, k)
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
    if c is a two-node \\B if c is a two-node
    \\In{
        if k < c.key1 \\B if k < c.key1: if c is a two-node
        \\In{
            c <- c.child1 \\B c <- c.child1: if c is a two-node
        \\In}
        else \\B else: if c is a two-node
        \\In{
            c <- c.child2 \\B c <- c.child2: if c is a two-node
        \\In}
    \\In}
    else if c is a three-node \\B else if c is a three-node
    \\In{
        if k < c.key1 \\B if k < c.key1: else if c is a three-node
        \\In{
            c <- c.child1 \\B c <- c.child1: else if c is a three-node
        \\In}
        else if k < c.key2 \\B else if k < c.key2: else if c is a three-node
        \\In{
            c <- c.child2 \\B c <- c.child2: else if c is a three-node
        \\In}
        else \\B else: else if c is a three-node
        \\In{
            c <- c.child3 \\B c <- c.child3: else if c is a three-node
        \\In}
    \\In}
    else // c is a four-node \\B else: MoveToChild
    \\Expl{ We could use nested if-then-else here so we always have two
    key comparisons
    \\Expl}
    \\In{
        if k < c.key1 \\B if k < c.key1: else: MoveToChild
        \\In{
            c <- c.child1 \\B c <- c.child1: else: MoveToChild
        \\In}
        else if k < c.key2 \\B else if k < c.key2: else: MoveToChild
        \\In{
            c <- c.child2 \\B c <- c.child2: else: MoveToChild
        \\In}
        else if k < c.key3 \\B else if k < c.key3
        \\In{
            c <- c.child3 \\B c <- c.child3: else: MoveToChild
        \\In}
        else \\B else: else: MoveToChild
        \\In{
            c <- c.child4 \\B c <- c.child4
        \\In}
    \\In}
\\Code}
`);