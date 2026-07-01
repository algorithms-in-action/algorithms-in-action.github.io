import parse from '../../pseudocode/parse';

export default parse(`

    
\\Note{  REAL specification of Splay tree insertion and search

XXX best keep insertion and search in same "mode" and adapt data input
so 4,5,6,?5,7 inserts 4,5,6 then searches for 5 then inserts 7, etc
XXX add deletion eventually, eg, 4,5,6,?5,7,-4 deletes 4 at end
XXX Might be good to have option for default expansion also, and allow more
collapsing with collapse all (eg, collapse delete completely when we are
just inserting).

Initial bookmark is Main because we are adapting from AVLTree

Keep look and feel for recursion, rotation etc as similar to AVLTree as
possible
\\Note}

\\Note{ Animation should be as consistent
as possible with BST/AVL trees
\\Note}
\\Code{
Main
ST_Insert(t, k) // insert key k into tree t; return result \\B Main
\\In{
  if t = Empty
  \\In{
    Return a single-node tree containing k
  \\In}
  Move the node closest to k to the root \\Ref insert_splay
  if k > t.key
  \\In{
    Insert k above and right of the root \\Ref insert_right
  \\In}
  else if k < t.key
  \\In{
    Insert k above and left of the root \\Ref insert_left
  \\In}
  // else if k = t.key ignore insertion
  \\Expl{ Duplicate keys are not supported and k is in t already.
  \\Expl}
  return t
\\In}
//==============================================================
ST_Search(t, k) // return node containing k or NotFound  \\B 1
\\In{
  Move the node closest to k to the root \\Ref search_splay
  if t != Empty and t.key = k
  \\In{
    return t
  \\In}
  else
  \\In{
    return NotFound
  \\In}
\\In}
//==============================================================
splay(t, k) // Move node k to root of t
// Note: "node k" means the node closest to k
\\Expl{ Returns a tree with the same nodes as t, rearranged.
  The root will be the node containing key k
  (if such a node exists), otherwise the node with the next larger key
  (if such a node exists), otherwise the node with the next smaller key
  (if any node exists). The node is found by searching down the tree in
  the normal BST fashion and moved to the root by a sequence of
  "rotation" operations that make local changes to the tree structure.
  This coding is recursive (see Background - click at the top of the right
  panel).
\\Expl}
  \\In{
    switch startOfPathTo(k) of \\B switchPath
    \\Expl{ We determine the start of the path to node k in BST t
      (going left, or right at each node). We want the first two nodes of the
      path (if there are at least two nodes), otherwise one node (if there is
      at least one node), otherwise we do nothing.
    \\Expl}
    case Left-Left:// Left-Left path \\B left-left
    \\Expl{
      Node k is in the left subtree of the left subtree.
    \\Expl}
    \\In{
        Move node k to the top of the left-left subtree \\Ref LL-recurse
        t <- rightRotate(t) // Move node k to the left of the root \\B LL-rot1
        \\Expl{
          This moves the whole left-left subtree (with k at the top, assuming
          k exists in the tree) up so it becomes the (new) left subtree.
        \\Expl}
        return rightRotate(t) // Move node k to root \\B LL-rot2
        \\Expl}
    \\In}
    case Left-Right:// Left-Right path \\B left-right
    \\Expl{
      Node k is in the right subtree of the left subtree.
    \\Expl}
    \\In{
        Move node k to the top of the left-right subtree \\Ref LR-recurse
        t.left <- leftRotate(t.left) // Move node k to the left of the root \\B LR-rot1
        \\Expl{
          This moves the whole left-right node (containing k, assuming
          k exists in the tree) up so it becomes the (new) left subtree.
        \\Expl}
        return rightRotate(t) // Move node k to root \\B LR-rot2
    \\In}
    case Right-Right:// Right-Right path \\B right-right
    \\Expl{
      Node k is in the right subtree of the right subtree.
    \\Expl}
    \\In{
        Move node k to the top of the right-right subtree \\Ref LL-recurse
        t <- leftRotate(t) // Move node k to the right of the root \\B LL-rot1
        \\Expl{
          This moves the whole right-right subtree (with k at the top, assuming
          k exists in the tree) up so it becomes the (new) right subtree.
        \\Expl}
        return leftRotate(t) // Move node k to root \\B LL-rot2
        \\Expl}
    \\In}
    case Right-Left:// Right-Left path \\B right-left
    \\Expl{
      Node k is in the left subtree of the right subtree.
    \\Expl}
    \\In{
        Move node k to the top of the right-left subtree \\Ref LR-recurse
        t.right <- rightRotate(t.right) // Move node k to the right of the root \\B LR-rot1
        \\Expl{
          This moves the whole right-left node (containing k, assuming
          k exists in the tree) up so it becomes the (new) right subtree.
        \\Expl}
        return leftRotate(t) // Move node k to root \\B LR-rot2
    \\In}
    case Left-Empty:// Left (and no further) \\B left-empty
    \\Expl{
      Key k is at the top of the left subtree or the subtree in which
      it would occur (left-left or left-right) is Empty.
    \\Expl}
    \\In{
        return rightRotate(t) // Move node k to root \\B LE-rot1
    \\In}
    case Right-Empty:// Right (and no further) \\B right-empty
    \\Expl{
      Key k is at the top of the right subtree or the subtree in which
      it would occur (right-left or right-right) is Empty.
    \\Expl}
    \\In{
        return leftRotate(t) // Move node k to root \\B RE-rot1
    \\In}
    case Empty: // t is Empty or k is at root already \\B case-empty
    \\In{
        return t // nothing to do \\B E-return
    \\In}
  \\In}
  // Done \\B DoneSplay

//==== rotation functions ======================================
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
    return (pointer to) t2 // new root \\B return t2
  \\In} 
\\Code}

\\Code{
insert_right
l,r <- t,t.right // left and right subtrees of new tree
t.right <- Empty
t <- new node with k and subtrees l and r
\\Code}

\\Code{
insert_left
l,r <- t.left,t // left and right subtrees of new tree
t.left <- Empty
t <- new node with k and subtrees l and r
\\Code}

\\Code{
insert_splay
t <- splay(t, k)
\\Expl{
The splay operation does most of the work. It will update t so the root
will be the node containing k, if such a node exists, otherwise it will
be the node with the next highest or next lowest key. If t is empty it
is just returned.
\\Expl}
\\Code}

\\Code{
search_splay
t <- splay(t, k)
\\Expl{
The splay operation does most of the work. It will update t so the root
will be the node containing k, if such a node exists.
\\Expl}
\\Code}

\\Note{
Animation stops at comments before recursion so user can prepare mentally for
recursive call plus we need a chunk at this level of recursion just
before the call so we can step back to it
\\Note}

\\Code{
LL-recurse
// *recursively* call splay with the left-left subtree \\B pre-recurseLL
t.left.left <- splay(t.left.left, k) \\B recurse-LL
\\Expl{
The left-left subtree is replaced by the result of this
recursive call. If this subtree is not empty, node k will be its root.
\\Expl}
\\Code}

\\Code{
LR-recurse
// *recursively* call splay with the left-right subtree \\B pre-recurseLR
t.left.right <- splay(t.left.right, k) \\B recurseLR
\\Expl{
The left-right subtree is replaced by the result of this
recursive call. If this subtree is not empty, node k will be its root.
\\Expl}
\\Code}

\\Code{
RL-recurse
// *recursively* call splay with the right-left subtree \\B pre-recurseRL
t.right.left <- splay(t.right.left, k) \\B recurse-RL
\\Expl{
The right-left subtree is replaced by the result of this
recursive call. If this subtree is not empty, node k will be its root.
\\Expl}
\\Code}

\\Code{
RR-recurse
// *recursively* call splay with the right-right subtree \\B pre-recurseRR
t.right.right <- splay(t.right.right, k) \\B recurseRR
\\Expl{
The right-right subtree is replaced by the result of this
recursive call. If this subtree is not empty, node k will be its root.
\\Expl}
\\Code}


\\Code{
InitPQ
        for i <- 1 to n    \\B 2                                           
        \\In{
            Cost[i] <- Infinity                                     
            \\Expl{  The Cost of each node is initially set to Infinity to
                    indicate we do not (yet) know how node i can be added
                    to the spanning tree
            \\Expl}
            Parent[i] <- Null
            \\Expl{  The array Parent will be used to track how nodes are 
                    connected into the resulting spanning tree. Node s
                    will be the root of the spanning tree and an edge (j,i)
                    is added to the tree by setting Parent[i] to j.
                    Eventually all nodes have a (non-Null) Parent,
                    thus all nodes are in the spanning tree.
            \\Expl}
        \\In}
        Cost[s] <- 0
        Parent[s] <- s // the parent of the tree root s points to itself
\\Code}

\\Code{
Update
        for each (i,j) in E \\B 5
        \\Expl{  Now that i gets included in the tree, we need to check the edge 
                to each of its neighbours j.
        \\Expl}
        \\In{
        if j is in PQ and weight(i,j) < Cost[j] \\B 6
        \\Expl{  The inclusion of i may have brought i's neighbour j closer 
            to the tree; if so, update the information we have about j.
        \\Expl}
        \\In{
                Cost[j] <- weight(i,j) \\B 7                                 
                \\Expl{  The new cost for j is its distance to i.
                \\Expl}
                Update(PQ, j, Cost[j]) \\B 8
                \\Expl{  Rearrange PQ so the priority queue reflects j's new cost.
                \\Expl}
                Parent[j] <- i \\B 9                                          
                \\Expl{  Record the fact that j's closest neighbour in the 
                        spanning tree (so far) was i.
                \\Expl}
        \\In}
\\Code}



`);
