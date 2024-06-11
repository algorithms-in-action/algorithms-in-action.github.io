import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    BFS(G, s) // Breadth first search of graph G from start node s \\B 1
    \\Expl{ Given a graph G, find a path from the start node s to an
            end node.  It is assumed the end node(s) are defined
            separately; if there are no end nodes, paths to all connected
            nodes are found. Nodes are numbered 1..nmax. Returns the Parent
            array, which gives the previous node in the path from s to the
            node i (if one has been found; Parent[i] = 0 otherwise).
    \\Expl}
    \\In{
        initialise, with fontier={s}, stored in Nodes \\Ref Init
        while Nodes is not empty \\B 2
            \\Expl{ Nodes is the data structure used to represent the frontier.
                For BFS, Nodes is a queue, shown below the arrays.  The frontier
                nodes are simply those in the queue (they are also marked as
                Seen). The Seen nodes that are no longer in the queue are
                finalised.  The frontier and finalised nodes are also highlighted
                in the graph display.
            \\Expl}
        \\In{
            remove next node n from Nodes and finalise it \\Ref Next_node 
            // The Parent of n has now been determined
            if task_completed(n) \\Ref Completed 
            \\Expl{ If there are no end nodes the whole connected component
                   of G will be explored and we can skip this "if".
            \\Expl}
            \\In{
                return \\B 3
                \\Expl{ If there can be several end nodes we may want to
                       return which one is found as well as the Parent array.
                       Here we highlight the path found in the Parent array.
                \\Expl}
            \\In}
            for each node m neighbouring n // G has edge from n to m \\B 4
            \\In{
                update Nodes, Parent etc with n & m \\Ref UpdateNodes 
            \\In}
        \\In}
        return \\B 5
        \\Expl{ A path to every node connected to s has been found.
                If we were searching for an end node we have failed
                and some indication of this should be returned.
        \\Expl}
    \\In}
    \\Code}
    
    \\Code{
    Init
        initialise each element of array Parent to zero \\B 6
        initialise each element of array Seen to False \\B 7
        Seen[s] <- True      // Initially we have seen only the start node \\B 8
        Nodes <- queue containing just s \\B 9
    \\Code}
    
    \\Code{
    Next_node
        n <- dequeue(Nodes) // remove the front element of the Nodes queue \\B 10
        \\Expl{ Finalised nodes are implicit: they are nodes that are in
                Seen but not in the Nodes queue. Frontier nodes are
                those than are in Seen and in Nodes. By removing n from
                Nodes we remove it from the frontier and finalise it.
        \\Expl}
    \\Code}
    
    \\Code{
    Completed
        if is_end_node(n) \\B 11
        \\Expl{ If we were searching for an end node we have succeeded!
            If we just want to traverse the whole graph component connected
            to s, we can skip this "if".
        \\Expl}
    \\Code}
    
    \\Code{
    UpdateNodes
        if not Seen[m] \\B 12
        \\In{
            Seen[m] <- True \\B 13
            Parent[m] <- n \\B 14
            enqueue(Nodes, m) // add m to back of Nodes queue \\B 15
        \\In}
    \\Code}
`);
