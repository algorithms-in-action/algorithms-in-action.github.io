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
    for i <- 1 to n                                             
    \\In{
        Cost[i] <- Infinity                                     
        Prev[i] <- Null
        \\Expl{  The array Prev will be used to track how nodes are 
                connected into the resulting spanning tree. 
                Whenever an edge (j,i) is added to the tree, this 
                is captured by setting Prev[i] to j.
        \\Expl}
    \\In}
    Cost[1] <- 0
    \\Expl{  We arrange for the tree construction to start with
            node 1; this is achieved by setting the cost of node
            1 to 0 (to get from node 1 to itself costs nothing).
            Other nodes initially assigned the largest possible 
            cost, Infinity, as they have not been considered yet.
    \\Expl}
    Q <- InitPriorityQueue(n) \\B 2
    \\Expl{  Nodes are arranged in the priority queue Q according 
            to cost. Smaller cost means higher priority.
    \\Expl}
    while Q not Empty \\B 3
    \\In{
        i <- RemoveMin(Q)  // i is now part of the spanning tree \\B 4
        \\Expl{  Node i is closest to the tree constructed so far.
                More precisely, for every node k inside the current 
                tree, and every node j outside of it, the weight of
                (k,i) is smaller than (or possibly equal to) the weight
                of (k,j) for all outside nodes j. So i is picked as 
                the next node to add to the tree. Note that, unless 
                i = 1, prev[i] has already been determined.
        \\Expl}
        update priority queue Q    \\Ref Update
    \\In}
\\In}
\\Code}

\\Code{
Update
    \\In{
        for each (i,j) in E 
        \\Expl{  Now that i gets included in the tree, we need to check the edge 
                to each of its neighbours j.
        \\Expl}
        \\In{
        if j is in Q and weight(i,j) < Cost[j] \\B 5
        \\Expl{  The inclusion of i may have brought i's neighbour j closer 
                to the tree; if so, update the information we have about j.
        \\Expl}
        \\In{
                Cost[j] <- weight(i,j)                                  
                \\Expl{  The new cost for j is its distance to i.
                \\Expl}
                Update(Q, j, Cost[j]) \\B 6
                \\Expl{  Rearrange Q so the priority queue reflects j's new cost.
                \\Expl}
                Prev[j] <- i                                           
                \\Expl{  Record the fact that j's closest neighbour in the 
                        spanning tree (so far) was i.
                \\Expl}
        \\In}
        \\In}
    \\In}
\\Code}
`);
