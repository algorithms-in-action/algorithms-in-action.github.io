# Union Find

---

Union Find algorithms allow us to maintain and manipulate the partitioning
of a set into (disjoint) subsets. There are two main operations supported:
Union and Find. Union takes two subsets and merges them together to form
a single subset.  Find takes and element and returns a representative
element of the subset it occurs in. It must be the case that Find(n) =
Find(m) if and only if n and m are in the same subset, but which element
is returned is left to the implementation (this flexibility allows for
simple, efficient solutions). There may also be an operation to add
an additional element in a singleton subset; here we simply initialise
the data structure with a fixed number of elements, each in a singleton
subset. It is often convenient to number the elements 1, 2, 3,... allowing
the array-based solution we present here.

Union-Find has many and varied applications.  For example, to determine
connected components of an undirected graph, we can simply call Union(a,b)
for each edge a-b in the graph, then any two nodes in the same connected
component will have have the same result returned by Find.  Kruskal's
algorithm for finding minimum spanning trees is similar.

To represent a partitioning with N subsets we use N trees, each containing
the elements of the subset. Each tree node has a "parent" pointer and a
node can have many children pointing to it (there are no pointers from
parents to children).  The root node points to itself (a bit of a trick
that makes code simpler).  Find returns the root node and Union joins two
trees together.  There are some subtle aspects to ensure the height of
the trees is kept small, so that finding the root can be done very quickly.
Extra information is maintained for each subset so Union can reduce the
height and when Find traverses a path from a node to the root, we take
the opportunity to reduce the length of the path for future calls to Find
(the tree height is reduced and the "width" is increased by having more
children for some nodes).

Interestingly, the extra information used to reduce the height is only
approximate and the method used to reduce path lengths is not as thorough
as some obvious alternatives. These shortcuts make the code quite short,
but it is still extremely effective at reducing the tree height - most
nodes point directly to the root. It has been shown that no matter how
large the set is, Find has takes very close to constant time on average
(the inverse of the Ackerman function to be precise).  In this animation
we allow path compression to be disabled so you can experiment to see
how much this aspect of the algorithm reduces tree height.