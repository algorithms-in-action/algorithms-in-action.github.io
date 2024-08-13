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
            p <- Traverse down to the leaf node, where k will be inserted after \\Ref Traverse 
            \\Expl{  
                The process of “Traverse down to the leaf node p, where k will be inserted after” 
                involves navigating through the AVL tree from the root down to the appropriate 
                position where the new key k should be inserted. Here is a step-by-step explanation 
                of what happens during this traversal
            \\Expl}
            Insert k into the leaf node p, adjusting the structure \\Ref Insert
            \\Expl{  
                The process of “Insert k into the leaf node p, adjusting the structure” involves 
                inserting the new key k into the leaf node p that was found during the traversal. 
                This step also includes balancing the tree after the insertion.
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
    else \\B else: k > p.key
        \\In{
            p.right <- a new node containing k and height 1 \\B p.right <- a new node containing k and height 1
        \\In}
    Balance and Update the tree \\Ref Balance
    \\Expl{
        After inserting the new key k into the leaf node p, we need to balance the tree and update 
        the height of the nodes along the path from the leaf node to the root. This ensures that 
        the AVL tree remains balanced after the insertion.
    \\Expl}
\\Code}
    
\\Code{
    Traverse
    p <- Empty        // We keep track of the parent node, initially Empty \\B p <- Empty
    c <- t            // c traverses the path from the root down to a leaf \\B c <- t
    \\Expl{  
        c (and parent node p) will follow a path down to a leaf where new key
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
        \\Expl{
            If the key already exists in the tree, we do not insert it again.
            Duplicate keys are not allowed in an AVL tree.
        \\Expl}
        \\In{
            return t   \\B Exit the function without inserting the duplicate
        \\In}
    \\In}
    until c is Empty (and p is a leaf node) \\B until c is Empty (and p is a leaf node)
    return p \\B return p
\\Code}

\\Code{
    Balance
    // Traverse back up, updating the height and balancing the tree
    \\Expl{
        We traverse back up from the leaf node where the new key was inserted
        to the root node, updating the height and balancing the tree along the way.
    \\Expl}
    c <- p \\B c <- p back up
    repeat \\B repeat_2
    \\In{
        // Update the height of the current node
        c.height <- max(Height(c.left), Height(c.right)) + 1 \\B c.height <- max(Height(c.left), Height(c.right)) + 1

        // Calculate the balance factor to check if the node is unbalanced
        balance <- Height(c.left) - Height(c.right) \\B balance <- Height(c.left) - Height(c.right)
        
        Perform rotations if the tree is unbalanced \\Ref Rotate
        \\Expl{
            If the balance factor is greater than 1 or less than -1, the tree is unbalanced.
            We perform rotations to balance the tree.
        \\Expl}
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
    \\Expl{
        Rotations are used to balance the AVL tree after an insertion. There are four types of rotations:
        Left-Left Case, Right-Right Case, Left-Right Case, and Right-Left Case. We perform these rotations
        based on the balance factor of the node.
    \\Expl}
    if balance > 1 // Left-heavy case \\B if balance > 1
        \\In{
            if k < c.left.key  // Left Left Case \\B Left Left Case
                \\In{
                    c <- Right_Rotate(c)  // Perform right rotation \\B Left Left right rotation
                \\In}
            else // Left Right Case \\B Left Right Case
                \\In{
                    c.left <- Left_Rotate(c.left)  // Perform left rotation \\B Left Right left rotation
                    c <- Right_Rotate(c)  // Perform right rotation \\B Left Right right rotation
                \\In}
        \\In}
    else if balance < -1 // Right-heavy case \\B else if balance < -1
        \\In{
            if k > c.right.key  // Right Right Case \\B Right Right Case
                \\In{
                    c <- Left_Rotate(c)  // Perform left rotation \\B Right Right left rotation
                \\In}
            else // Right Left Case \\B Right Left Case
                \\In{
                    c.right <- Right_Rotate(c.right)  // Perform right rotation \\B Right Left right rotation
                    c <- Left_Rotate(c)  // Perform left rotation \\B Right Left left rotation
                \\In}
        \\In}
\\Code}
`);