import parse from '../../pseudocode/parse';

// TODO: replace this with prim's pseudocode
export default parse(`
\\Note{  REAL specification of Prim's algorithm
\\Note}

\\Code{
Main
Prim(E, n) // Given a weighted connected graph G with nodes 1..n and edges E,  \\B 1
           // find a minimum spanning tree for G.
\\In{
    PQ <- InitPriorityQueue(n) \\Ref InitPQ
    \\Expl{  Nodes are put in a priority queue PQ according to their
            Cost. Smaller cost means higher priority and initially 
            node 1 has the minimum cost.
    \\Expl}

    Cost[1] <- 0
    \\Expl{  We arrange for the tree construction to start with node 1;
            this is achieved by setting the cost of node 1 to 0 (to get
            from node 1 to itself costs nothing).  Other nodes are 
            initially assigned the largest possible cost.
    \\Expl}

    while PQ not Empty \\B 3
    \\In{
        i <- RemoveMin(PQ)  // i is now part of the spanning tree \\B 4
        \\Expl{  Node i is closest to the tree constructed so far.
                More precisely, for every node k inside the current 
                tree, and every node j outside of it, the weight of
                (k,i) is smaller than (or possibly equal to) the weight
                of (k,j) for all outside nodes j. So i is picked as 
                the next node to add to the tree. The array Parent keeps
                track of the connections: Parent[i] is the spanning tree
                node that i is connected to. Note that, unless i = 1, 
                Parent[i] has already been determined.
        \\Expl}
        update priority queue PQ    \\Ref Update
        \\Expl{  Adding node i to the tree may reduce the costs of nodes
                neighbouring i, affecting PQ. The node with minumum cost 
                may also change.
        \\Expl}
    \\In}
\\In}
\\Code}

\\Code{
InitPQ
        for i <- 1 to n    \\B 2                                           
        \\In{
            Cost[i] <- Infinity                                     
            \\Expl{  The Cost of each node is initially set to Infinity to
                    indicate we do not (yet) know how node i can be added
                    to the spanning tree
            \\Expl}
            Parent[i] <- Null
            \\Expl{  The array Parent will be used to track how nodes are 
                    connected into the resulting spanning tree. Node 1
                    will be the root of the spanning tree and an edge (j,i)
                    is added to the tree by setting Parent[i] to j.
                    Eventually all nodes except 1 have a (non-Null) Parent,
                    thus all nodes are in the spanning tree.
            \\Expl}
        \\In}
\\Code}

\\Code{
Update
        for each (i,j) in E \\B 5
        \\Expl{  Now that i gets included in the tree, we need to check the edge 
                to each of its neighbours j.
        \\Expl}
        \\In{
        if j is in PQ and weight(i,j) < Cost[j] \\B 6
        \\Expl{  The inclusion of i may have brought i's neighbour j closer 
            to the tree; if so, update the information we have about j.
        \\Expl}
        \\In{
                Cost[j] <- weight(i,j) \\B 7                                 
                \\Expl{  The new cost for j is its distance to i.
                \\Expl}
                Update(PQ, j, Cost[j]) \\B 8
                \\Expl{  Rearrange PQ so the priority queue reflects j's new cost.
                \\Expl}
                Parent[j] <- i \\B 9                                          
                \\Expl{  Record the fact that j's closest neighbour in the 
                        spanning tree (so far) was i.
                \\Expl}
        \\In}
\\Code}
`);
