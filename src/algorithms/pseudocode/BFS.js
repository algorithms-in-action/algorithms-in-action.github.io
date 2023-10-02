import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    BFS(G, s) // Given a graph G find a path from start node s to an
            // end node.  It is assumed the end node(s) are defined
            // separately; if there are no end nodes, paths to all connected
            // nodes are found. Nodes are numbered 1..nmax. Returns the Parent
            // array, which gives the previous node in the path from s to the
            // node i (if one has been found; Parent[i] = 0 otherwise).
    \\In{
        initialise, with fontier={s}, stored in Nodes \\Ref Init
        while Nodes not empty
        \\In{
            remove next node n from Nodes and finalise it \\Ref Next_node
            // The Parent of n has now been determined
            if task_completed(n) \\Ref Completed
            \\Expl{ If there are no end nodes the whole connected component
                   of G will be explored and we can skip this "if".
            \\Expl}
            \\In{
                return
                \\Expl{ If there may be several end nodes we may want to
                       return which one is found as well as the Parent array.
                \\Expl}
            \\In}
            for each node m neighbouring n // G has edge from n to m
            \\In{
                update Nodes, Parent etc with n & m \\Ref UpdateNodes
            \\In}
        \\In}
        return
        \\Expl{ The whole component of the graph connected to s has been
                explored. If we were searching for an end node we have failed
                and some indication of this should be returned.
        \\Expl}
    \\In}
    \\Code}
    
    \\Code{
    Init
        initialise each element of array Parent to zero
        initialise each element of array Seen to False
        Seen[s] <- True      // Initially we have seen only the start node
        Nodes <- queue containing just s
    \\Code}
    
    \\Code{
    Next_node
        n <- dequeue(Nodes) // remove the front element of the Nodes queue
    \\Code}
    
    \\Code{
    Completed
        if is_end_node(n)
        \\Expl{ If we were searching for an end node we have succeeded!
            If we just want to traverse the whole graph component connected
            to s, we can skip this "if".
        \\Expl}
    \\Code}
    
    \\Code{
    UpdateNodes
        if not Seen[m]
        \\In{
            Seen[m] <- True
            Parent[m] <- n
            enqueue(Nodes, m) // add m to back of Nodes queue
        \\In}
    \\Code}
`);