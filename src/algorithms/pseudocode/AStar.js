import parse from '../../pseudocode/parse';

export default parse(`
    \\Code{
         Main
        Astar(G, s, e) // Given a graph G find a shortest path from start node s
                // to the end node e.  Nodes are numbered 1..nmax. Returns the
               // Parent array, which gives the previous node in the path from s
               // to e.
         \\In{
              initialise, with fontier={s}, stored in Nodes \\Ref Init
                while Nodes not empty
                \\In{
                    remove next node n from Nodes and finalise it \\Ref Next_node
                    // The Parent of n has now been determined
                    if task_completed(n) \\Ref Completed
                    \\Expl{ Have we found the end node?
                    \\Expl}
                    \\In{
                        return
                        \\Expl{ If we have explored the whole graph component without
                            finding the end node that should be indicated, otherwise
                            the Parent array has the desired path information.
                        \\Expl}
                    \\In}
                    for each node m neighbouring n // G has edge from n to m
                    \\In{
                        update Nodes, Parent etc with n & m \\Ref UpdateNodes
                    \\In}
                \\In}
                \\Expl{ The whole component of the graph connected to s has been
                        explored but we have failed to find e
                        and some indication of this should be returned.
                \\Expl}
            \\In}
    \\Code}

    \\Code{
        Init
            initialise each element of array Parent to zero
            initialise each element of array Length to infinity
            Length[s] <- 0
            Nodes <- PQ containing all nodes // only s has finite cost
            \\Note{ Nodes in the PQ with finite cost are in the frontier; others
                are yet to be seen.
            \\Note}
    \\Code}

    \\Code{
        Next_node
            n <- RemoveMin(Nodes) // remove lowest cost element of Nodes PQ
            \\Expl{ n is the node in the frontier with the shortest known path
                    length back to s plus heuristic value (if it has infinite
                    cost it must be in a component not connected to s; not
                    actually in the frontier).
            \\Expl}
        
    \\Code}

    \\Code{
        Completed
            if n = e or Length[n] = infinity
            \\Expl{ If the Length of n is infinite we have searched the whole
                    component (without finding the end node) and we should
                    return a failure indication.
                    Otherwise, if n is the end node we have succeeded and
                    the Parent array has the path.
            \\Expl}
    \\Code}
        
        
    \\Code{
        UpdateNodes
            if n is in Nodes PQ and Length[n] + weight(n,m) < Length[m] 
            \\Expl{ The path from s to n to m is shorter than the current
                shortest known path from s to m. If Length[m] == infinity
                it will be replaced with a finite weight, implicitly moving
                m from the unseen nodes to the frontier.
            \\Expl} 
            \\In{
                Length[m] <- Length[n] + weight(n,m) // smaller path length from s
                UpdateCost(Nodes, m, Length[m]+heur(m)) // update cost in Nodes PQ
                Parent[m] <- n
                \\Expl{ The shortest known path to m now goes via n.
                \\Expl}
            \\In}
    \\Code}
`);