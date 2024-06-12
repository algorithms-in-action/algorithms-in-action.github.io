// Kruskal's MST algorithm
// XXX migrating from Prim's
import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
Kruskal(G)  // Compute minimum spanning tree for graph G
    \\Expl{ Given a weighted graph G, return Selected, a set of edges.
        If G is connected, Selected represents a minimal spanning tree
        (there may be more than one tree with minimal weight).
        In general it represents a minimal spanning forest (one MST for
        each connected component of the graph).
    \\Expl}
\\In{
    gsize <- number of nodes in G
    Edges <- all edges in G // may involve sorting the edges
    \\Expl{ We display Edges as a list, sorted on weight. Other data
        structures could be used but at each stage the edge with the
        next lowest weight is removed and this should be efficient.
    \\Expl}
    Selected <- empty set of edges
    nselected <- 0
    \\Expl{ Keeping track of the number of selected edges is not
        necessary but it is very easy to do and allows us to exit
        from the while loop significantly earlier in some cases.
    \\Expl}
    NodeSets <- set of singleton sets with each node in G
    \\Expl{ NodeSets is a set of sets of nodes that are connected by
        selected edges (like a forest but without information about
        which edges are used to connect the nodes of each tree)
    \\Expl}
    while Edges is not empty and not all nodes are in the same tree \\Ref While
    \\In{
        e <- RemoveMin(Edges) // remove edge with minimum weight
        (n1, n2) <- the nodes edge e connects
        if n1 and n2 are in different trees \\Ref DifferentTrees
        \\In{
            Add e to Selected
            nselected <- nselected + 1
            union(NodeSets, n1, n2) // update NodeSets, combining n1&n2
            \\Expl{ This is a union-find operation that takes the union
                of the sets containing n1 and n2, respectively, since
                they are now connected by a selected edge.
            \\Expl}
        \\In}
    \\In}
    return Selected
\\In}
///////////////////////////////////////////////////////////////
Prim(G, s) // Find a minimum spanning tree for graph G starting at node s \\B 1
    \\Expl{ Given a weighted graph G, return a minimum spanning tree
        for the graph component that includes s (with a different termination
        condition a minimum spanning forest for all graph components could
        be found). Nodes are numbered 1..nmax. Prim returns the Parent
        array, which gives a path from each connected node back to
        the root s (which has 0 as the parent).
    \\Expl}
        \\In{
                initialise, with fontier={s}, stored in Nodes \\Ref Init
                while Nodes is not empty \\B 2
           \\Expl{ Nodes is the data structure used to represent the frontier.
                For Prim's algorithm, Nodes is a priority queue, ordered on
                Cost (the minumum edge weight found so far). Here we highlight the Min
                value. The priority queue also contains nodes that have not been
                seen, which have infinite Cost. The frontier nodes are those
                shown with a finite Cost. Nodes with no Cost shown
                have been finalised. The frontier and finalised nodes are also
                highlighted in the graph display.
            \\Expl}
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




\\Code{
While
    while Edges is not empty and nselected < gsize - 1
    \\Expl{ A tree with n nodes has n-1 edges, so if nselected = gsize-1,
        all nodes are in the same tree. It's not necessary to perform
        this check but it is easy and can save time for connected graphs
        with many edges.
    \\Expl}
\\Code}

\\Code{
DifferentTrees
    if find(NodeSets, n1) != find(NodeSets, n2)
    \\Expl{ Find is a union-find operation that returns a representative
        element of a set containing a given element. If the elements
        returned for n1 and n2 are not equal, it means they are not
        in the same set, so they are not connected by selected edges.
    \\Expl}
\\Code}




`);
