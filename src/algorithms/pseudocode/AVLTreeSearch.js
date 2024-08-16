import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    AVL_Search(t, k)  // return subtree whose root has key k \\B AVL_Search(t, k)
                      // or NotFound, if no such node is present
    \\In{
        while t not Empty \\B while t not Empty
        \\In{
            if t.key = k  \\B if t.key = k
            \\In{
                return t // found the target node  \\B return t
                \\Expl{  We have found a node with the desired key k.
                \\Expl}
            \\In}
            if t.key > k    \\B if t.key > k  
            \\Expl{  The AVL condition is that nodes with keys less than the 
                    current node's key are to be found in the left subtree, and
                    nodes whose keys are greater are to be in the right subtree.
            \\Expl}
            \\In{
                t <- t.left \\B t <- t.left
            \\In}
            else
            \\In{
                t <- t.right \\B t <- t.right
            \\In}
        return NotFound \\B return NotFound
        \\In}
    \\In}
    \\Code}
`);