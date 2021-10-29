import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
  Main
  Warshall(A, n)  \\B 1
  \\Expl{  Compute the transitive closure of a directed graph G 
    with nodes 1..n, represented by n x n adjacency matrix A 
  \\Expl}
  \\In{
    for k <- 1 to n  \\B 2
    \\Expl{  Consider all possible nodes k that might be
      used as stepping stones on the way from i to j.
    \\Expl}  
    \\In{
      for i <- 1 to n   \\B 3
      \\Expl{ Explore and try to add new paths from each source node i.
      \\Expl} 
      \\In{
        if A[i,k]  \\B 4
        \\Expl{ When A[i,k] is 0 (that is, there is no path from i to k), k
          cannot possibly be a stepping stone in the path from i to j,
          so we do not explore whether there is a path from k to j.
        \\Expl}  
        // Consider all paths from i to j, either already reachable (using 
        // nodes 1 to k-1 as intermediates), or now reachable using k as an 
        // intermediate.   
        Find all nodes reachable from i via k \\Ref Reachable
        \\Expl{  Identify target nodes j that are reachable from 
        source node i, whether they were already reachable 
        before now, or whether they are now reachable using 
        node k as a stepping stone.
        \\Expl}
      \\In}
    \\In}
  \\In}
  \\In{
  return A  \\B 8
  \\In}
\\Code}

\\Code{
  Reachable
  \\In{
  for j <- 1 to n   \\B 5
  \\Expl{ Consider paths to all possible target nodes j.
  The effect of this innermost loop is to update row i
  to become its binary "or" with row k.
  \\Expl} 
  \\In{
    if A[k,j]   \\B 6
    \\Expl{  Check if there is a path from this intermediate 
    node k to target node j.
    \\Expl} 
    \\In{
      A[i,j] <- 1     \\B 7
      \\Expl{  Record the new path from i to j (through k) in the 
      reachability matrix by setting A[i,j] to 1 (if there
      was already a path from i to j in the reachability
      matrix, then it remains there, whether or not that
      path goes through k.
      \\Expl} 
    \\In}
  \\In}
  \\In}
\\Code}
`);
