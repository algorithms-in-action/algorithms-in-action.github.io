// Note: iterative version is used for simple binary search trees and also
// AVL trees. This is a recursive version, currently used just for the
// recursive coding of BSTs. To make recursion look similar to
// insertion, the controller (may) use the common code for recursive
// insertion in BST/AVLT.
import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
BST_Search(t, k)  // return subtree whose root has key k; or NotFound \\B Main
\\In{
    if t = Empty \\B if t = Empty
    \\In{
        return NotFound   \\B return NotFound
        \\Expl{ The search for key k is unsuccessful.
          Note we still need to unwind any recursive calls.
        \\Expl}
    \\In}
    if t.key = k    \\B if n.key = k
    \\In{
        return t    \\B return t
        \\Expl{ We have successfully found a node with key k.
          Note we still need to unwind any recursive calls.
        \\Expl}
    \\In}
    if k < t.key    \\B if k < t.key
    \\Expl{ The BST condition is that nodes with keys less than the 
            current node's key are to be found in the left subtree, and
            nodes whose keys are greater are to be in the right subtree.
    \\Expl}
    \\In{
        search for k in the left subtree of t \\Ref recurseLeft
    \\In}
    else \\B else if k > root(t).key
    \\Note{ Bookmark just in case its needed for common code
    \\Note}
    \\In{
        search for k in the right subtree of t \\Ref recurseRight
    \\In}
\\In}
  // Done \\B Done
\\Code}

\\Code{
recurseLeft
\\Note{
Animation stops at this comment so user can prepare mentally for
recursive call plus we need a chunk at this level of recursion just
before the call so we can step back to it
\\Note}
// *recursively* call search with the left subtree \\B prepare for the left recursive call
return BST_Search(t.left, k) \\B recursiveCallLeft
\\Expl{ The animation pauses here after the recursive call, as we unwind the
recursion.
\\Expl}
\\Code}

\\Code{
recurseRight
\\Note{
Animation stops at this comment so user can prepare mentally for
recursive call plus we need a chunk at this level of recursion just
before the call so we can step back to it
\\Note}
// *recursively* call search with the right subtree \\B prepare for the right recursive call
return BST_Search(t.right, k) \\B recursiveCallRight
\\Expl{ The animation pauses here after the recursive call, as we unwind the
recursion.
\\Expl}
\\Code}

`);
