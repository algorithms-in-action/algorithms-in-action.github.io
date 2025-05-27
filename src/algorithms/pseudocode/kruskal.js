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
    Initialise Edges, Selected (and Cost) and NodeSets \\Ref Init
    while Edges is not empty and size(Selected) < size(G) - 1 \\B while
    \\Expl{ size(G) is the number of nodes in G.
        A tree with n nodes has n-1 edges, so if there are size(G)-1
        selected edges, all nodes are in the same tree. It's not necessary
        to perform this check but it can be made easy and can save time
        for connected graphs with many edges.
    \\Expl}
    \\In{
        (n1, n2) <- RemoveMin(Edges) // remove edge n1-n2 with minimum weight \\B RemoveMin
        \\Expl{ The graph display highlights node n1 and all nodes
            connected to it by selected edges in one colour.
            If n1 and n2 are not already connected by selected edges the
            same is done with n2, with a different colour.
        \\Expl}
        \\Note{highlight edge + trees for n1, n2?
        \\Note}
        if n1 and n2 are in different trees/sets in NodeSets \\Ref DifferentTrees
        \\In{
            Add e to Selected \\B addSelected
            \\Expl{ The counter used to keep track of size(Selected)
                can be incremented here.
            \\Expl}
            union(n1, n2) // update NodeSets, combining n1&n2 \\B union
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
Init
    Edges <- all edges in G // may involve sorting the edges \\B initEdges
    \\Expl{ We display Edges as a list, sorted on weight. Other data
        structures could be used but at each stage the edge with the
        next lowest weight is removed and this should be efficient.
        There may be (far) more edges than nodes; here we omit listing the
        edges with higher weights if there are too many.
    \\Expl}
    Selected <- empty set of edges (Costs also shown) \\B SelectedEmpty
    \\Expl{ The number of selected edges is always less than the number
        of nodes so the display can list all of them. We also display
        the cost (weight) of each selected edge.
        Explicitly keeping track of the number of selected edges is
        also beneficial, eg, with a simple counter initialised to zero
        here. It is not necessary but allows us to exit
        from the while loop significantly earlier in some cases.
    \\Expl}
    NodeSets <- set of singleton sets with each node in G \\B initNodeSets
    \\Expl{ NodeSets represents the structure of the forest: which nodes
        are connected to each other (but without information about which
        edges are used). Each tree is represented as a just set of nodes;
        the forest is a set of sets. A "union find" data structure is
        used for efficiency.  All nodes in the same set/tree return the
        same result for the find() function. Initially there are no
        selected edges so each set/tree contains a single node and
        find() thus returns a different value for each node.
    \\Expl}
\\Code}

\\Code{
DifferentTrees
    \\Note{highlight find(n1), find(n2)?
    \\Note}
    if find(n1) != find(n2) \\B DifferentTrees
    \\Expl{ Find is a union-find operation that returns a representative
        element of a set in NodeSets containing a given element. If the elements
        returned for n1 and n2 are not equal, it means they are not
        in the same set/tree, so they are not connected by selected edges.
    \\Expl}
\\Code}


`);
