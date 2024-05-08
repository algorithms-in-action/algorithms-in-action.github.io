// Prim's MST algorithm - version with common code structure
import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
Prim(G, s) // Given a weighted graph G, return a minimum spanning tree \\B 1
        // for the graph component that includes s (with a different termination
        // condition a minimum spanning forest for all graph components could
        // be found). Nodes are numbered 1..nmax. Prim returns the Parent
        // array, which gives a path from each connected node back to
        // the root s (which has 0 as the parent).
        \\In{
                initialise, with fontier={s}, stored in Nodes \\Ref Init
                while Nodes not empty \\B 2
                \\In{
                    remove next node n from Nodes and finalise it \\Ref Next_node
                    // The Parent of n has now been determined
                    if task_completed(n) \\Ref Completed
                    \\Expl{ If we want a MST for just one component we may be able to
                            finish here, otherwise we can skip this "if".
                    \\Expl} 
                    \\In{
                        return \\B 3
                        \\Expl{ The Parent array has a MST for the component containing s.
                           We reset the Nodes PQ etc to show the component more clearly.
                        \\Expl} 
                    \\In} 
                    for each node m neighbouring n // G has edge from n to m \\B 4
                    \\In{
                        update Nodes, Parent etc with n & m \\Ref UpdateNodes
                    \\In}
                \\In}
                return \\B 99
                \\Expl{ A minimal spanning forest for the whole graph has been found.
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
            n <- PQRemoveMin(Nodes) // remove lowest cost element of Nodes PQ \\B 9
            \\Expl{ n is the node in the frontier closest to a finalised
                    node (if it has infinite cost it must be in a component not
                    connected to s; not actually in the frontier).
            \\Expl}
        \\Code}
        

\\Code{
        Completed
            if Cost[n] = infinity \\B 10
            \\Expl{ The MST of the component containing s has been found!
                 If we just want a minimal spanning forest the whole graph
                 we can skip this "if" and continue until Nodes is empty.
            \\Expl}
\\Code}

\\Code{
        UpdateNodes
            if m is in Nodes PQ and weight(n,m) < Cost[m] \\B 11
            \\Expl{ Adding n to the MST may have brought n's neighbour m closer
                 to the tree. If so, update the information we have about m.
                 If Cost[m] = infinity it will be replaced with a finite weight,
                 implicitly moving m from the unseen nodes to the frontier.
            \\Expl} 
            \\In{
                Cost[m] <- weight(n,m) // new cost is distance from n \\B 12
                PQUpdateCost(Nodes, m, Cost[m]) // update cost in Nodes PQ \\B 13
                Parent[m] <- n \\B 14
                \\Expl{ m's closest neighbour in the MST (so far) is n.
                \\Expl}
            \\In}
\\Code}
`);
