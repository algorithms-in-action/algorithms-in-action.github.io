import parse from '../../pseudocode/parse';

export default parse(`
    
\\Code{
    Main
    AVL_Insert(t, k)  // Insert key k into AVL tree t and balance the tree. \\B AVL_Insert(t, k)
    \\In{
        if t = Empty \\B if t = Empty
        \\In{
            t <- a new node containing k and height 1 \\B t <- a new node containing k and height 1
        \\In}
        else \\B else: AVL_Insert(t, k)
        \\In{
            Traverse down to the leaf node p, where k will be inserted \\Ref Traverse 
            \\Expl{  Any four-node encountered is split into two two-nodes and the
                    middle key (key2) is inserted into the parent node. Once this
                    is done, we can be sure the leaf will have enough room for an
                    extra key. The tree grows in height when the root node is
                    split.
            \\Expl}
            Insert k into the leaf node p, adjusting the structure \\Ref Insert
            \\Expl{  A two-node will change to a three-node and a three-node
                    will change to a four-node.
            \\Expl}
        \\In}
    \\In}
\\Code}
    
\\Code{
    Insert
    if k < p.key \\B if k < p.key
        \\In{
            p.left <- a new node containing k and height 1 \\B p.left <- a new node containing k and height 1
        \\In}
    else
        \\In{
            p.right <- a new node containing k and height 1 \\B p.right <- a new node containing k and height 1
        \\In}
    Balance and Update the tree \\Ref Balance
\\Code}
    
\\Code{
    Traverse
    p <- Empty        // We keep track of the parent node, initially Empty \\B p <- Empty
    c <- t            // c traverses the path from the root down to a leaf \\B c <- t
    \\Expl{  c (and parent node p) will follow a path down to a leaf where new key
            is to be inserted. We start from the root (t) and stop when p
            reaches a leaf.
    \\Expl}
    repeat \\B repeat_1
    \\In{
        //Traverse down to the appropriate leaf node

        if k < c.key \\B if k < c.key
        \\In{
            p <- c \\B p <- c if k < c.key
            c <- c.left \\B c <- c.left if k < c.key
        \\In} 
        else if k > c.key \\B else if k > c.key
        \\In{
            p <- c \\B p <- c if k > c.key
            c <- c.right \\B c <- c.right if k > c.key
        \\In}
        else // k == c.key, Duplicate keys NOT ALLOWED! \\B else k == c.key
        \\In{
            return t   // Exit the function without inserting the duplicate
        \\In}
    \\In}
    until c is Empty (and p is a leaf node) \\B until c is Empty (and p is a leaf node)
\\Code}

\\Code{
    Balance
    // Traverse back up, updating the height and balancing the tree
    c <- p
    repeat \\B repeat_2
    \\In{
        // Update the height of the current node
        c.height <- max(Height(c.left), Height(c.right))

        // Calculate the balance factor to check if the node is unbalanced
        balance <- Height(c.left) - Height(c.right) \\B balance <- Height(c.left) - Height(c.right)
        
        Perform rotations if the tree is unbalanced \\Ref Rotate
        if c = t // We are back at the root \\B if c = t
            \\In{
                return t
            \\In}
        c <- Parent of c // Move up one level \\B c <- Parent of c
    \\In}
    until c is Empty (which should be the root node) \\B until c is Empty
\\Code}

\\Code{
    Rotate
    if balance > 1 // Left-heavy case \\B if balance > 1
        \\In{
            if k < c.left.key  // Left Left Case
                \\In{
                    c <- Right_Rotate(c)  // Perform right rotation
                \\In}
            else // Left Right Case
                \\In{
                    c.left <- Left_Rotate(c.left)  // Perform left rotation
                    c <- Right_Rotate(c)  // Perform right rotation
                \\In}
        \\In}
    else if balance < -1 // Right-heavy case \\B else if balance < -1
        \\In{
            if k > c.right.key  // Right Right Case
                \\In{
                    c <- Left_Rotate(c)  // Perform left rotation
                \\In}
            else // Right Left Case
                \\In{
                    c.right <- Right_Rotate(c.right)  // Perform right rotation
                    c <- Left_Rotate(c)  // Perform left rotation
                \\In}
        \\In}
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

`);