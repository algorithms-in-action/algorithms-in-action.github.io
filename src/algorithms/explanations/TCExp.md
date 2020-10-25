# Transitive Closure

---

Warshalls algorithm computes the transitive closure of a directed 
graph, that is, what nodes can be reached from other nodes.  

The algorithm starts with an adjacency matrix A for a directed graph G
with n nodes. In the adjacency matrix, A[i,j] = 1 indicates that 
there is an edge, i.e., a one-step path, from node i to node j, and 
0 indicates that there is not an edge. The algorithm ends with a 
reachability matrix where A[i,j] = 1 means that there is a path from
i to j, possibly with several intermediate steps between i and j,
possibly with several intermediate steps between i and j. 

The algorithm uses three nested loops that iterate over all the nodes
but the order of the nesting is crucial for correctness. 
    
## The logic is as follows.
    
We start with the matrix describing direct reachability
(using a single edge and no intermediate nodes). 
    
We first compute reachability that may include node 1 as an intermediate node 
(as well as direct reachability), then compute reachability that may include 
nodes 1 and/or 2, and so on, up to n. 

Thus the outer loop iterates over potential intermediate nodes k, 
at each stage relying on the fact that all paths using intermediate 
nodes 1 up to k-1 have been computed. 

The inner two loops iterate over nodes i (that may have a path to k) and 
nodes j (that may have a path from k), respectively. 
If there is a path from i to k and from k to j, then there is a path 
from i to j, so A[i,j] is set to 1 at this point. Correctness of the 
algorithm relies on the fact that there is a path from i to j using 
only intermediate nodes 1 to k if and only if there is a path from 
i to k and from k to j using only intermediate nodes 1 to k-1.
