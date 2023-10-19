import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    T234_Search(t, k) \\B 1
    // return either a node containing key k or 
    // NotFound, if no such node is present
    \\Note{  We separate comparison for equality with comparison for finding
    the subtree to traverse down to next to simplify refinement
    \\Note}
    \\In{
        while t not Empty
        \\In{
            if the root of t contains k, return t \\Ref Return_if_key_in_node
            \\Expl{  There can be different kinds of node and multiple keys per node.
            \\Expl}
            \\Note{  Refinement is messy due to different kinds of node so we
                    include return here and avoid else
            \\Note}
            t <- the child of t that may contain k \\Ref Find_child
            \\Expl{  There can be different kinds of node and multiple children.
            \\Expl}
        \\In}
        return NotFound
    \\In}
    \\Code}
    
    \\Code{
    Return_if_key_in_node 
    // Return node t if it contains key k
    if t is a two-node
    \\In{
        if t.key1 == k return t
    \\In}
    else if t is a three-node
    \\In{
        if t.key1 == k or t.key2 == k return t
    \\In}
    else // t is a four-node
    \\In{
        if t.key1 == k or t.key2 == k or t.key3 == k return t
    \\In}
    \\Code}
    
    \\Code{
    Find_child 
    // Find child c of root node t that may contain key k
    if t is a two-node
    \\In{
        if k < t.key1
        \\In{
            c <- t.child1
        \\In}
        else
        \\In{
            c <- t.child2
        \\In}
    \\In}
    else if t is a three-node
    \\In{
        if k < t.key1
        \\In{
            c <- t.child1
        \\In}
        else if k < t.key2
        \\In{
            c <- t.child2
        \\In}
        else
        \\In{
            c <- t.child3
        \\In}
    \\In}
    else // t is a four-node
    \\Expl{ We could use nested if-then-else here so we always have two
    key comparisons
    \\Expl}
    \\In{
        if k < t.key1
        \\In{
            c <- t.child1
        \\In}
        else if k < t.key2
        \\In{
            c <- t.child2
        \\In}
        else if k < t.key3
        \\In{
            c <- t.child3
        \\In}
        else
        \\In{
            c <- t.child4
        \\In}
    \\In}
    \\Code}
    
`);