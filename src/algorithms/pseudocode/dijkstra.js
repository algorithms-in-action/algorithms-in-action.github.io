import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
Shortest(G, s) //Given a graph G find a shortest path from start node s \\B 1
        // to an end node.  It is assumed the end node(s) are defined
        // separately; with no end nodes, shortest paths to all connected
        // nodes are found. Nodes are numbered 1..nmax. Returns the Parent
        // array, which gives the previous node in the path from s to the
        // node i (if one has been found; Parent[i] = 0 otherwise). 
        \\In{
                initialise, with fontier={s}, stored in Nodes \\Ref Init
                while Nodes not empty \\B 2
                \\In{
                    remove next node n from Nodes and finalise it \\Ref Next_node
                    // The Parent of n has now been determined
                    if task_completed(n) \\Ref Completed
                    \\Expl{ Have we found an end node?
                    \\Expl} 
                    \\In{
                        return \\B 3
                        \\Expl{ If there may be several end nodes we may want to
                            return which one was found as well as the Parent
                            array, and if we have explored the whole graph
                            component that should be indicated.
                        \\Expl} 
                    \\In} 
                    for each node m neighbouring n // G has edge from n to m \\B 4
                    \\In{
                        update Nodes, Parent etc with n & m \\Ref UpdateNodes
                    \\In}
                \\In}
                \\Expl{ The whole component of the graph connected to s has been
                        explored. If we were searching for an end node we have failed
                        and some indication of this should be returned.
                \\Expl}
            \\In}
            
\\Code}

\\Code{
        Init
            initialise each element of array Parent to zero \\B 5
            initialise each element of array Cost to infinity \\B 6
            Cost[s] <- 0 \\B 7
            Nodes <- PQ containing all nodes  // only s has finite cost \\B 8
            //  Nodes in the PQ with finite cost are in the frontier; others are yet to be seen. 
\\Code}  

\\Code{
        Next_node
            n <- RemoveMin(Nodes) // remove lowest cost element of Nodes PQ \\B 9
            \\Expl{ n is the node in the frontier with the shortest known path
                    back to s (if it has infinite cost it must be in a component
                    not connected to s; not actually in the frontier).
            \\Expl}
        \\Code}
        

\\Code{
        Completed
            if is_end_node(n) or Cost[n] = infinity \\B 10
            \\Expl{ If the cost of n is infinite we have searched the whole component
                (without finding an end node) and the Parent array has all shortest
                paths.  Otherwise, n is an end node we have succeeded and
                the Parent array has the shortest path.
            \\Expl}
\\Code}

\\Code{
        UpdateNodes
            if Cost[n] + weight(n,m) < Cost[m] \\B 11
            \\Expl{ The path from s to n to m is shorter than the current
                shortest known path from s to m. If Cost[m] = infinity
                it will be replaced with a finite weight, implicitly moving
                m from the unseen nodes to the frontier. If m has been
                finalised, this test is guaranteed to fail.
            \\Expl} 
            \\In{
                Cost[m] <- Cost[n] + weight(n,m) // new cost is path length from s \\B 12
                UpdateCost(Nodes, m, Cost[m]) // update cost in Nodes PQ \\B 13
                Parent[m] <- n \\B 14
                \\Expl{ The shortest known path to m now goes via n.
                \\Expl}
            \\In}
\\Code}
`);
