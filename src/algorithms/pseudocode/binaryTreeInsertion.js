import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    BST_Insert(k, t) // Insert key k in BST t \\B 1
    if t = Empty \\B 7
    \\In{
        t <- new node containing k \\B 8
        \\Expl{ A new BST node is allocated and initialized with
                key k and empty sub-trees; it replaces the empty tree.
        \\Expl}
    \\In}
    else
    \\In{
      Find parent node p that k will be inserted below \\Ref Locate
      \\Expl{ We search down the tree going left or right depending on
              key comparisons, until we can go no further (or we find k). Nodes left of
              p have keys less than k and nodes right of p have keys
              greater than k. If we find a node containing k we simply
              ignore the insertion of k and return t (see the MORE tab).
      \\Expl}
      if k < p.key  \\B 9
      \\Expl{  The new node n (whose key is k) will be a child of p. We just 
              need to decide whether it should be a left or a right child of p.
      \\Expl}
      \\In{
          p.left <- new node containing k \\B 10
          \\Expl{ A new BST node is allocated and initialized with
                key k and empty sub-trees; this replaces the empty
                left sub-tree of p.
          \\Expl}
      \\In}
      else
      \\In{
          p.right <- new node containing k  \\B 11
          \\Expl{ A new BST node is allocated and initialized with
                key k and empty sub-trees; this replaces the empty
                right sub-tree of p.
          \\Expl}
      \\In}
    \\In}
    return t \\B end
\\Code}
\\Code{
  Locate
  c <- t // c traverses from the root to the insertion point \\B 13
  
  \\Expl{ c is going to follow a path down to where the new node is to 
          be inserted. We start from the root (t). In the last iteration
          c "falls off" the tree and becomes an empty tree. However, p
          trails one step behind.
  \\Expl}
  repeat
  \\In{
      p <- c // when c moves down, p will be c's parent \\B 14
      \\Expl{ At the end of the loop p will be c's parent.  After we
              exit the loop, p will be the parent where k is inserted.
      \\Expl}
      if k < c.key \\B 15
      \\Expl{ The BST condition is that nodes with keys less than the current
              node's key are to be found in the left subtree, and nodes whose
              keys are greater (or the same) are to be in the right subtree.
      \\Expl}
      \\In{
          c <- c.left \\B 16
      \\In}
      else if k > c.key
      \\In{
          c <- c.right \\B 17
      \\In}
      else return t // k is in t already - skip insertion \\B eq_key
      \\Expl{ Here we ignore insertion of equal keys.  See the MORE tab.
      \\Expl}
  \\In}
  until c = Empty \\B 18
  \\Expl{ At the end of this loop, c has located the empty subtree where new
          key k should be located, and p will be the parent of the new node.
  \\Expl}
\\Code}
`);
