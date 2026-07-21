import parse from '../../pseudocode/parse';

// Digital search tree (DST), based on BST
// XXX add search code here in the same style
export default parse(`
\\Code{
    Main
    DST_Insert(k, t) // Insert key k in DST t \\B 1
    b <- most significant bit number \\B init_b
    \\Expl{ For this animation we choose b as the most significant bit
        used in the data; normally it would be based on the word size
        used for integers. This bit of keys is used at the root of the tree
        to determine if insertion is done to the left or right. The next
        level of the tree uses the next (less significant) bit, and so on.
    \\Expl}
    if t = Empty \\B 7
    \\In{
        return a single-node tree containing k \\B 8
        \\Expl{ Memory is allocated for a new DST node and initialized with
                key k and empty sub-trees. It is returned to replace
                the previously empty tree.
        \\Expl}
    \\In}
    else
    \\In{
      Find parent node p that k will be inserted below (+update b) \\Ref Locate
      \\Expl{ We search down the tree going left or right depending on
              bits in the key, until we can go no further (or we find k).
              At each step, b is changed to the next (less significant)
              bit.  Nodes left of
              p have keys with 0 for bit b and nodes right of p have keys
              with 1 for bit b. If we find a node containing k we simply
              ignore the insertion of k and return t.
      \\Expl}
      if bit b of p.key = 0  \\B 9
      \\Expl{  The new node n (whose key is k) will be a child of p. We just 
              need to decide whether it should be a left or a right child of p.
      \\Expl}
      \\In{
          p.left <- new node containing k \\B 10
          \\Expl{ A new DST node is allocated and initialized with
                key k and empty sub-trees; this replaces the empty
                left sub-tree of p.
          \\Expl}
      \\In}
      else
      \\In{
          p.right <- new node containing k  \\B 11
          \\Expl{ A new DST node is allocated and initialized with
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
      if bit b of c.key = 0 \\B 15
      \\Expl{ The DST condition is that nodes with keys with 0 as the current
              bit number are put in the left subtree and nodes with keys
              with 1 as the current bit number are put in the right subtree.
      \\Expl}
      \\In{
          c <- c.left \\B 16
      \\In}
      else if bit b of c.key = 1
      \\In{
          c <- c.right \\B 17
      \\In}
      else
      \\In{
        return t // k is in t already - skip insertion \\B eq_key
        \\Expl{ We ignore insertion of equal keys.
        \\Expl}
      \\In}
      b <- next (less significant) bit number \\B update_b
      \\Expl{ As we tranverse down the tree we use less significant bits
        in the keys.
      \\Expl}
  \\In}
  until c = Empty \\B 18
  \\Expl{ At the end of this loop, c has located the empty subtree where new
          key k should be located, and p will be the parent of the new node.
  \\Expl}
\\Code}
`);
