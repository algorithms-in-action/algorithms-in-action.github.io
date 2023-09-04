import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of Dijkstra's shortest path algorithm for graphs
\\Note}

\\Note{ There are several graph search algorithms that lead up to A*
        and we present them in a consistent way to show their similarities.
        Prim's MST tree is also similar.
\\Note}

\\Overview{

        Dijkstra's shortest path algorithm for graphs can be used to find the
        shortest (that is, lowest weight or cost) path from a single start node
        to either a single end node, one of several end nodes, or all nodes that
        are connected (depending on the termination condition). It assumes all
        edges have a positive weight.
        It is one of several algorithms that can be viewed as having a similar
        structure. Some of these can be used for both directed and undirected
        graphs; here we use undirected graphs for simplicity.
        The way paths are represented is for each node to point to the previous
        node in the path (so paths are actually reversed in this representation
        and essentially we have a tree with "parent" pointers and the start
        node at the root). This allows multiple nodes to each have a single
        path returned.
        
        As all these algorithms execute, we can classify nodes into three sets.
        They are the nodes for which the final parent node has been found (this
        is a region of the graph around the start node), "frontier" nodes that
        are not finalised but are connected to a finalised node by a single edge,
        and the rest of the nodes, which have not been seen yet. The frontier
        nodes are stored explicitly in some data structure and some algorithms
        also need some way to check if a node has been seen and/or finalised. The
        frontier initially contains just the start node. The algorithms repeatedly
        pick a frontier node, finalises the node (its current parent becomes
        its final parent) and updates information about neighbours of the node.
        
        Dijkstra's algorithm keeps track of the length of the shortest path
        found so far to each node (if any) and uses a priority queue (PQ) for
        the frontier nodes, with the "cost" being this length. At each stage the
        node that has the shortest path is removed from the PQ and finalised;
        its neighbours in the frontier may now have a shorter path to them so
        their costs need to be updated (and other neighbours must be added to
        the frontier).
        
        In the presentation here, we do not give details of how the priority
        queue is implemented, but just emphasise it is a collection of nodes
        with associated costs and the node with the minimum cost is selected each
        stage. When elements disappear from the Cost array it means the element
        has been removed from the PQ queue (the value is not used again).
        The pseudo-code is simpler if nodes that are yet to be seen are also
        put in the PQ, with infinite cost, which we do here.
        
        Here we number all nodes for simplicity so we can use arrays for the
        graph representation, the parent pointers, etc.  For many important
        applications, particularly in artificial intelligence, the graphs can
        be huge and arrays are impractical for representing the graph so other
        data structures are needed.
        
        
        XXX should we add something about graph layout to all these algorithms?
        In this animation the layout of the graph nodes is important. All nodes
        are on a two-dimensional, 100 by 100 grid. The weight of each edge is
        the length of the edge in the grid, rounded to an integer.
        
        XXX should we mention PQ implementations above (and in other algorithms)?
        Priority queues allow access/deletion of the minimum-cost element.
        Various data structures (eg, a min heap) allow this to be done
        efficiently; we don't display the details in this animation.
\\Overview}
        
        
\\Note{
        Suggested visualisation:
        
        For consistency with the other search algorithms the graph could be
        layed out on a grid (not visible), used for determining edge cost and
        heuristic values for other algorithms. Colours/... can distinguish
        finished, frontier and other nodes. Edges in chosen paths highlighted.
        
        XXX should write a separate note about graph display etc and include this:
        Cost for frontier nodes displayed, plus costs for edges displayed when
        frontier node is selected.  Maybe if we click/hover over a node in the
        frontier the path costs on the path back to the start could be displayed
        and similar for other algorithms?
        
        Could possibly have multiple graph displays - the one above plus the
        previously implemented one. The one above is probably preferred as it's
        visually clearer.
        
        We also need to display the arrays "Parent" and "Cost" (for the PQ).
        The arrays should be shown as a table, with an indication that the Cost
        array represents the PQ:
        
            i            1      2      3      ...
            Parent[i]
            Cost[i]
        
        When changes are made to the array values, a box showing the table entry
        in the array should light up, and also the value.  The PQ could be shown
        as a box around the Cost array, with the minimum element indicated in some
        way; as elements of the priority queue are removed they can be removed
        from the display.  Thus the Cost array will have gaps for some elements
        are they are removed (these values are never needed again in the algorithm).
        
\\Note}
        
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
                while Nodes not empty
                \\In{
                    remove next node n from Nodes and finalise it \\Ref Next_node
                    // The Parent of n has now been determined
                    if task_completed(n) \\Ref Completed
                    \\Expl{ Have we found an end node?
                    \\Expl} 
                    \\In{
                        return
                        \\Expl{ If there may be several end nodes we may want to
                            return which one was found as well as the Parent
                            array, and if we have explored the whole graph
                            component that should be indicated.
                        \\Expl} 
                    \\In} 
                    for each node m neighbouring n // G has edge from n to m 
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
            initialise each element of array Parent to zero \\B 2
            initialise each element of array Cost to infinity \\B 3
            Cost[s] <- 0
            Nodes <- PQ containing all nodes // only s has finite cost
            //  Nodes in the PQ with finite cost are in the frontier; others are yet to be seen. 
\\Code}  

\\Code{
        Next_node
            n <- RemoveMin(Nodes) // remove lowest cost element of Nodes PQ
            \\Expl{ n is the node in the frontier with the shortest known path
                    back to s (if it has infinite cost it must be in a component
                    not connected to s; not actually in the frontier).
            \\Expl}
        \\Code}
        

\\Code{
        Completed
            if is_end_node(n) or Cost[n] = infinity
            \\Expl{ If the cost of n is infinite we have searched the whole component
                (without finding an end node) and the Parent array has all shortest
                paths.  Otherwise, n is an end node we have succeeded and
                the Parent array has the shortest path.
            \\Expl}
\\Code}

\\Code{
        UpdateNodes
            if Cost[n] + weight(n,m) < Cost[m]
            \\Expl{ The path from s to n to m is shorter than the current
                shortest known path from s to m. If Cost[m] = infinity
                it will be replaced with a finite weight, implicitly moving
                m from the unseen nodes to the frontier. If m has been
                finalised, this test is guaranteed to fail.
            \\Expl} 
            \\In{
                Cost[m] <- Cost[n] + weight(n,m) // new cost is path length from s
                UpdateCost(Nodes, m, Cost[m]) // update cost in Nodes PQ
                Parent[m] <- n
                \\Expl{ The shortest known path to m now goes via n.
                \\Expl}
            \\In}
\\Code}

\\Note{
        We have C code that implements Prim's plus several graph search
        algorithms, depending on compilation flags.
        \\Note}
        
`);
