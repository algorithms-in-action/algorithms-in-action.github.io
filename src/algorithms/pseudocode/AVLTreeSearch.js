import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
AVLT_Search(t, k)  // return subtree whose root has key k; or NotFound  \\B AVL_Search(t, k)
\\Expl{ This is identical to simple binary search tree search.
\\Expl}
\\In{
    while t not Empty   \\B while t not Empty
    \\In{
        n = root(t)  \\B n = root(t)
        \\Note{ Avoids confounding pointers and nodes  XXX not worth it???
            could use key(t), left(t), right(t) below; make as similar to
            AVLTree code as possible
        \\Note}
        if n.key = k    \\B if n.key = k
        \\In{
            return t    \\B return t
            \\Expl{  We have found a node with the desired key k.
            \\Expl}
        \\In}
        if n.key > k    \\B if n.key > k
        \\Expl{  The BST condition is that nodes with keys less than the 
                current node's key are to be found in the left subtree, and
                nodes whose keys are greater are to be in the right subtree.
        \\Expl}
        \\In{
            t <- n.left   \\B t <- n.left
        \\In}
        else
        \\In{
            t <- n.right    \\B t <- n.right
        \\In}
    return NotFound   \\B return NotFound
    \\In}
\\In}
\\Code}
`);
