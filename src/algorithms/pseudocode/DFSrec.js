import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of depth first search of graphs, recursive
version
\\Note}

\\Note{ There are several graph search algorithms that lead up to A*
and we present them in a consistent way to show their similarities.
It includes an iterative DFS coding; this recursive coding is somewhat
simpler but visualisation should emphasise similarities with the
iterative version as much as possible.
\\Note}

\\Note{
Visualisation: same as iterative version without Finalised + call stack
made explicit

    i            1      2      3      ...
    Parent[i]

    Call stack (n,p):

\\Note}


\\Code{
Main
DFS(G, n) // Depth first search of graph G from start node n \\B start
    \\Expl{ Given a graph G, find a path from the start node n to an
            end node.  It is assumed the end node(s) are defined
            separately; if there are no end nodes, paths to all connected
            nodes are found. Nodes are numbered 1..nmax. Returns the Parent
            array, which gives the previous node in the path from s to the
            node i (if one has been found; Parent[i] = 0 otherwise).
    \\Expl}

\\In{
    initialise all parents to null \\B init
    \\Expl{ We initialise to some special value so we can later check if a
        parent has been assigned (we display null as an empty cell).
        The start node is the implicit "frontier" for the top level DFS1
        call. It is not
        necessary to understand the frontier.  We mention it just for
        comparison with the iterative version of DFS and related graph
        search algorithms.
    \\Expl}
    result <- DFS1(G, n, 0) // recursive DFS with zero as parent node \\B top_call
    return result \\B finish
    \\Expl{ If there can be several end nodes we may want to
        return which one is found as well as the Parent array for
        successful searches (it defines a path from the end node back to
        the start node).  Here we highlight the path found in
        the Parent array.
    \\Expl}
\\In}
//======================================================================
\\Note{
    Whenever DFS1 is called, we should push (n,p) onto the stack displayed
    in the animation; pop stack on return.
\\Note}
DFS1(G, n, p) // Search from node n using parent node p. This visits all \\B dfs1
        // nodes connected to n, ignoring nodes with parents already
        // assigned (as if these nodes have been removed from G).
\\In{
    if Parent[n] == null // Ignore n if Parent[n] has been assigned \\B check_parent
    \\In{
        Parent[n] <- p \\B assign_parent
        \\Expl{ Node n is now finalised.
        \\Expl}
        if is_end_node(n) \\B check_end
        \\In{
            return FOUND // Success! \\B found
            \\Expl{ If there can be several end nodes we may want to
                return which one is found as well as the Parent array,
                which defined the path from the end node back to the start.
            \\Expl}
        \\In}
        // The neighbouring nodes are now part of the (implicit) frontier \\B frontier
        \\Expl{ It is not necessary to understand the frontier.
            We mention it just for comparison with the iterative version
            of DFS and related graph search algorithms. The neighbouring nodes
            will be checked via a recursive call in the loop below (finalised
            nodes will be ignored).
        \\Expl}
        for each node m neighbouring n // G has edge from n to m \\B neighbours
        \\Note{ When this is first reached, all neighbouring nodes
            should change to the "frontier" colour (see iterative DFS)
            unless they are already finalised (have parent assigned)
            and whenever this line is reached the n-m edge should be
            highlighted. For iterative DFS, the m nodes are all pushed onto
            the stack then the last one is popped off and visited if
            required. For this recursive version we don't have an
            explicit stack but have an implicit stack that has a
            "continuation" that will look at the subsequent m nodes.
        \\Note}
        \\Expl{ Any order of considering the nodes is ok.  Here we
            consider the largest node numbers first, which gives the
            same traversal order as the iterative coding.
        \\Expl}
        \\In{
            search G starting from m, with n as the parent \\Ref RECDFS
        \\In}
    \\In}
    return NOTFOUND  // no end node found \\B not_found
\\In}
\\Code}
\\Code{
RECDFS
    // *recursively* call DFS1 and return if successful \\B rec_dfs1
    if DFS1(G, m, n) = FOUND \\B rec_dfs1_done
    \\In{
        return FOUND // return if end node found, otherwise continue \\B rec_found
    \\In}
\\Code}



`);
