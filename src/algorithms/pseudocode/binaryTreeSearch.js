import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    BST_Search(t, k)  // return subtree whose root has key k; or \\B 8
                      // NotFound is no such node is present
    \\In{
        while t not Empty \\B 1
        \\In{
            if t.key = k  \\B 2
            \\In{
                return t \\B 3
                \\Expl{  We have found a node with the desired key k.
                \\Expl}
            \\In}
            if t.key > k  \\B 4
            \\Expl{  The BST condition is that nodes with keys less than the 
                    current node's key are to be found in the left subtree, and
                    nodes whose keys are greater are to be in the right subtree.
            \\Expl}
            \\In{
                t <- t.left \\B 5
            \\In}
            else
            \\In{
                t <- t.right \\B 6
            \\In}
        return NotFound \\B 7
        \\In}
    \\In}
    \\Code}
`);
