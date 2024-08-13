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
            Traverse down to the leaf node p, where k will be inserted after \\Ref Traverse 
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
    else
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
            return t   // Exit the function without inserting the duplicate
        \\In}
    \\In}
    until c is Empty (and p is a leaf node) \\B until c is Empty (and p is a leaf node)
\\Code}

\\Code{
    Balance
    // Traverse back up, updating the height and balancing the tree
    \\Expl{
        We traverse back up from the leaf node where the new key was inserted
        to the root node, updating the height and balancing the tree along the way.
    \\Expl}
    c <- p
    repeat \\B repeat_2
    \\In{
        // Update the height of the current node
        c.height <- max(Height(c.left), Height(c.right))

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
            if k < c.left.key  // Left Left Case
                \\In{
                    1. Perform right rotation \\Ref Right_Rotate_1
                \\In}
            else // Left Right Case
                \\In{
                    1. Perform left rotation \\Ref Left_Rotate_1
                    2. Perform right rotation \\Ref Right_Rotate_2
                \\In}
        \\In}
    else if balance < -1 // Right-heavy case \\B else if balance < -1
        \\In{
            if k > c.right.key  // Right Right Case
                \\In{
                    1. Perform left rotation \\Ref Left_Rotate_2
                \\In}
            else // Right Left Case
                \\In{
                    1. Perform right rotation \\Ref Right_Rotate_3
                    2. Perform left rotation \\Ref Left_Rotate_3
                \\In}
        \\In}
\\Code}

\\Code{
    Left_Rotate_1
    \\In{
        y <- x.right \\B y <- x.right_1
        T2 <- y.left \\B T2 <- y.left_1
        y.left <- x \\B y.left_1 <- x_1
        x.right <- T2 \\B x.right_1 <- T2_1
        
        // Update heights
        x.height <- max(Height(x.left), Height(x.right)) + 1 \\B UpdateHeight_lx_1
        y.height <- max(Height(y.left), Height(y.right)) + 1 \\B UpdateHeight_ly_1
        return y // Return the new root \\B return y_l1
    \\In}
\\Code}

\\Code{
    Left_Rotate_2
    \\In{
        y <- x.right \\B y <- x.right_2
        T2 <- y.left \\B T2 <- y.left_2
        y.left <- x \\B y.left <- x_2
        x.right <- T2 \\B x.right <- T2_2
        
        // Update heights
        x.height <- max(Height(x.left), Height(x.right)) + 1 \\B UpdateHeight_lx_2
        y.height <- max(Height(y.left), Height(y.right)) + 1 \\B UpdateHeight_ly_2
        return y // Return the new root \\B return y_l2
    \\In}
\\Code}

\\Code{
    Left_Rotate_3
    \\In{
        y <- x.right \\B y <- x.right_3
        T2 <- y.left \\B T2 <- y.left_3
        y.left <- x \\B y.left <- x_3
        x.right <- T2 \\B x.right <- T2_3
        
        // Update heights
        x.height <- max(Height(x.left), Height(x.right)) + 1 \\B UpdateHeight_lx_3
        y.height <- max(Height(y.left), Height(y.right)) + 1 \\B UpdateHeight_ly_3
        return y // Return the new root \\B return y_l3
    \\In}
\\Code}

\\Code{
    Right_Rotate_1
    \\In{
        x <- y.left \\B x <- y.left_1
        T2 <- x.right \\B T2 <- x.right_1
        x.right <- y \\B x.right <- y_1
        y.left <- T2 \\B y.left <- T2_1
        
        // Update heights
        y.height <- max(Height(y.left), Height(y.right)) + 1 \\B UpdateHeight_ry_1
        x.height <- max(Height(x.left), Height(x.right)) + 1 \\B UpdateHeight_rx_1
        return y // Return the new root \\B return y_r1
    \\In}
\\Code}

\\Code{
    Right_Rotate_2
    \\In{
        x <- y.left \\B x <- y.left_2
        T2 <- x.right \\B T2 <- x.right_2
        x.right <- y \\B x.right <- y_2
        y.left <- T2 \\B y.left <- T2_2
        
        // Update heights
        y.height <- max(Height(y.left), Height(y.right)) + 1 \\B UpdateHeight_ry_2
        x.height <- max(Height(x.left), Height(x.right)) + 1 \\B UpdateHeight_rx_2
        return y // Return the new root \\B return y_r2
    \\In}
\\Code}

\\Code{
    Right_Rotate_3
    \\In{
        x <- y.left \\B x <- y.left_3
        T2 <- x.right \\B T2 <- x.right_3
        x.right <- y \\B x.right <- y_3
        y.left <- T2 \\B y.left <- T2_3
        
        // Update heights
        y.height <- max(Height(y.left), Height(y.right)) + 1 \\B UpdateHeight_ry_3
        x.height <- max(Height(x.left), Height(x.right)) + 1 \\B UpdateHeight_rx_3
        return y // Return the new root \\B return y_r3
    \\In}
\\Code}

`);