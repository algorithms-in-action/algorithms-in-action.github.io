import parse from '../../pseudocode/parse';

export default parse(`
  \\Code{
      Main
      BST_Build(keys)
      \\Expl{  return the BST that results from inserting nodes 
        with keys 'keys', in the given order, into an
        initially empty BST
      \\Expl}
      t <- Empty \\B 1
      for each k in keys \\B 2
      \\In{
          t <- BST_Insert(t, k) \\Ref Insert
          \\Expl{  Insert key k in BST t, maintaining the BST invariant
          \\Expl}
      \\In}
  \\Code}
  \\Code{
      Insert
      n <- new Node \\B 3
      \\Expl{  create a new node to hold key k 
      \\Expl}
      n.key <- k \\B 4
      n.left <- Empty \\B 5
      \\Expl{  it will be a leaf, that is, it has empty subtrees
      \\Expl}
      n.right <- Empty \\B 6

      if t = Empty \\B 7
      \\In{
          t <- n \\B 8
          \\Expl{  In this case, the result is a tree with just one node.
                  If the tree is initially empty, the resulting BST is just
                  the new node, which has key k, and empty sub-trees.
          \\Expl}
      \\In}
      else
      \\In{
        Locate the node p that should be the parent of the new node n. \\Ref Locate
        if k < p.key  \\B 9
        \\Expl{  The new node n (whose key is k) will be a child of p. We just 
                need to decide whether it should be a left or a right child of p.
        \\Expl}
        \\In{
            p.left <- n  \\B 10
            \\Expl{  insert n as p's left child
            \\Expl}
        \\In}
        else
        \\In{
            p.right <- n  \\B 11
            \\Expl{  insert n as p's right chil
            \\Expl}
        \\In}
      \\In}
  \\Code}
    
  \\Code{
    Locate
    c <- t \\B 13
    
    \\Expl{  c traverses the path from the root to the insertion point.
            c is going to follow a path down to where the new node is to 
            be inserted. We start from the root (t).
    \\Expl}
    repeat
    \\In{
        p <- c  \\B 14
        \\Expl{  When the loop exits, p will be c's parent.
                Parent p and child c will move in lockstep, with p always 
                trailing one step behind c.
        \\Expl}
        if k < c.key \\B 15
        \\Expl{  The BST condition is that nodes with keys less than the current
                node's key are to be found in the left subtree, and nodes whose
                keys are greater (or the same) are to be in the right subtree.
        \\Expl}
        \\In{
            c <- c.left \\B 16
        \\In}
        else
        \\In{
            c <- c.right \\B 17
        \\In}
    \\In}
    until c = Empty \\B 18
    \\Expl{  At the end of this loop, c has located the empty subtree where new
            node n should be located, and p will be the parent of the new node.
    \\Expl}
  \\Code}
`);
