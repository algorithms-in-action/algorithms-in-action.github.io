// Kruskal's MST algorithm
// XXX separate init code
import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
Kruskal(G)  // Compute minimum spanning tree for graph G \\B Kruskal(G)
    \\Expl{ Given a weighted graph G, return Selected, a set of edges.
        If G is connected, Selected represents a minimal spanning tree
        (there may be more than one tree with minimal weight).
        In general it represents a minimal spanning forest (one MST for
        each connected component of the graph).
    \\Expl}
\\In{
    \\Note{XXX have separate init, skip explicit gsize?
    \\Note}
    gsize <- number of nodes in G
    Edges <- all edges in G // may involve sorting the edges \\B initEdges
    \\Expl{ We display Edges as a list, sorted on weight. Other data
        structures could be used but at each stage the edge with the
        next lowest weight is removed and this should be efficient.
    \\Expl}
    Selected <- empty set of edges \\B SelectedEmpty
    nselected <- 0
    \\Note{XXX skip explicit nselected?
    \\Note}
    \\Expl{ Keeping track of the number of selected edges is not
        necessary but it is very easy to do and allows us to exit
        from the while loop significantly earlier in some cases.
    \\Expl}
    NodeSets <- set of singleton sets with each node in G \\B initNodeSets
    \\Expl{ NodeSets is a set of sets of nodes that are connected by
        selected edges (like a forest but without information about
        which edges are used to connect the nodes of each tree)
    \\Expl}
    while Edges is not empty and nselected < gsize - 1 \\B while
    \\Expl{ A tree with n nodes has n-1 edges, so if nselected = gsize-1,
        all nodes are in the same tree. It's not necessary to perform
        this check but it is easy and can save time for connected graphs
        with many edges.
    \\Expl}
    \\In{
        (n1, n2) <- RemoveMin(Edges) // remove edge n1-n2 with minimum weight \\B RemoveMin
        \\Note{highlight edge + trees for n1, n2?
        \\Note}
        if n1 and n2 are in different trees \\Ref DifferentTrees
        \\In{
            Add e to Selected \\B addSelected
            nselected <- nselected + 1
            union(NodeSets, n1, n2) // update NodeSets, combining n1&n2 \\B union
            \\Expl{ This is a union-find operation that takes the union
                of the sets containing n1 and n2, respectively, since
                they are now connected by a selected edge.
            \\Expl}
        \\In}
    \\In}
    return Selected \\B return
    \\Note{display total cost
    \\Note}
\\In}
\\Code}

\\Code{
DifferentTrees
    \\Note{highlight find(n1), find(n2)?
    \\Note}
    if find(NodeSets, n1) != find(NodeSets, n2) \\B DifferentTrees
    \\Expl{ Find is a union-find operation that returns a representative
        element of a set containing a given element. If the elements
        returned for n1 and n2 are not equal, it means they are not
        in the same set, so they are not connected by selected edges.
    \\Expl}
\\Code}


`);
