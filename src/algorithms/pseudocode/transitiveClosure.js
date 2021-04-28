import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
  Main
  Warshall(A, n)  \\B 1
  \\Expl{  Compute the transitive closure of a directed graph G 
    with nodes 1..n, represented by n x n adjacency matrix A 
  \\Expl}
  \\In{
    for k <- 0 to n-1  
    \\Expl{  Consider all possible nodes k that might be
      used as stepping stones on the way from i to j.
    \\Expl}  
    \\In{
      for i <- 0 to n-1   
      \\Expl{ Explore and try to add new paths from each source node i.
      \\Expl} 
      \\In{
        //find all nodes reachable from i via k
        \\Expl{  Identify target nodes j that are reachable from 
        source node i, whether they were already reachable 
        before now, or whether they are now reachable using 
        node k as a stepping stone.
        \\Expl}
        if A[i,k]  \\B 2
        \\Expl{ When A[i,k] is 0 (that is, there is no path from i to k), k
          cannot possibly be a stepping stone in the path from i to j,
          so we do not explore whether there is a path from k to j.
        \\Expl}
        \\In{
          for j <- 0 to n-1  
          \\Expl{ Consider paths to all possible target nodes j.
          \\Expl} 
          \\In{
            if A[k,j]   \\B 3
            \\Expl{  Check if there is a path from this intermediate 
            node k to target node j.
            \\Expl} 
            \\In{
              A[i,j] <- 1     \\B 4
              \\Expl{  Record the new path from i to j (through k) in the 
              reachability matrix by setting A[i,j] to 1 (if there
              was already a path from i to j in the reachability
              matrix, then it remains there, whether or not that
              path goes through k.
              \\Expl} 
            \\In}
          \\In}
        \\In}
      \\In}
    \\In}
  \\In}
\\Code}
`);
