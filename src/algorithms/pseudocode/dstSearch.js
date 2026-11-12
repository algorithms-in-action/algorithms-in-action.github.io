// Note: this code is used for DST search trees
import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
DST_Search(t, k)    \\B DST_Search(t, k)
\\Expl{ Return subtree whose root has key K; or NotFound
\\Expl}
\\In{
    m ⟵ mask for most-significant bit   \\B set M
    \\Expl{  m=1000...
    \\Expl}
    while t not Empty    \\B while t not Empty
    \\In{
        if t.key = k.key    \\B if t.key = k.key
        \\Expl{  Need to compare entire key, bits only used for branching
        \\Expl}
        \\In{
            return t   \\B return t
            \\Expl{  We have found a node with the desired key k.
            \\Expl}
        \\In}
        else    \\B key not equal
        \\In{
            if mask bit of k.key = 0   \\B if mask bit of k.key=0
            \\In{
            t <- t.left    \\B t <- t.left
            \\In}
            else
            \\Expl{  Mask bit of k.key = 1
            \\Expl}
            \\In{
                t <- t.right    \\B t <- t.right
            \\In}
            m <- m >> 1    \\B m <- m >> 1
            \\Expl{  Advance the mask to the next bit (m=0100...)
            \\Expl}
        \\In}
    \\In}
    return NotFound   \\B return NotFound
\\In}
\\Code}
`);
