import parse from '../../pseudocode/parse';

// TODO: replace this with prim's pseudocode
export default parse(`
\\Note{  REAL specification of Prim's algorithm
\\Note}

\\Code{
Main
Prim(E, n, s) // Given a weighted connected graph G with nodes 1..n \\B 1
\\In{
\\In{
           // and edges E, start at node s to find a minimum spanning tree for G.
\\In}
\\In}
\\In{
    PQ <- InitPriorityQueue(n, s) \\Ref InitPQ
    \\Expl{  Nodes are put in a priority queue PQ according to their
            Cost. Smaller cost means higher priority and initially 
            all nodes have the highest possible cost, except the start
            node s, which has cost zero (we start building the tree from
            s and it costs nothing to get from s to s).
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
                    connected into the resulting spanning tree. Node s
                    will be the root of the spanning tree and an edge (j,i)
                    is added to the tree by setting Parent[i] to j.
                    Eventually all nodes have a (non-Null) Parent,
                    thus all nodes are in the spanning tree.
            \\Expl}
        \\In}
        Cost[s] <- 0
        Parent[s] <- s // the parent of the tree root s points to itself
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
