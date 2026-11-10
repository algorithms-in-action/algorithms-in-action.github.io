// Note: this code is used for simple binary search trees and also
// AVL trees.
import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
BST_Search(t, k)  // return subtree whose root has key k; or NotFound  \\B AVL_Search(t, k)
\\Expl{ Note: this code is used for simple binary search trees and also
AVL trees.
\\Expl}
\\In{
    while t not Empty   \\B while t not Empty
    \\In{
        \\Note{ Old code:
            n = root(t)  \\B n = root(t)
            Avoids confounding pointers and nodes  XXX not worth it???
            now use t.key etc below; bookmarks not changed XXX
        \\Note}
        if t.key = k    \\B if n.key = k
        \\In{
            return t    \\B return t
            \\Expl{  We have found a node with the desired key k.
            \\Expl}
        \\In}
        if k < t.key    \\B if n.key > k
        \\Expl{  The BST condition is that nodes with keys less than the 
                current node's key are to be found in the left subtree, and
                nodes whose keys are greater are to be in the right subtree.
        \\Expl}
        \\In{
            t <- t.left   \\B t <- n.left
        \\In}
        else
        \\In{
            t <- t.right    \\B t <- n.right
        \\In}
    \\In}
    return NotFound   \\B return NotFound
\\In}
\\Code}
`);
