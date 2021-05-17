import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    BruteForceStringSearch(T, n, P, m) 
      // Look for pattern P (of length m) in text T (of length n).
      // If found, return the index of P's first occurrence in T.
      // Otherwise return -1.
    \\Expl{  The pattern is P[0]..P[m-1] and the text is T[0]..T[n-1].
    \\Expl}
    
    \\In{
        i <- 0
        while i+m <= n
        \\Expl{  If i plus the length of the pattern exceeds 
                the length of the text, no match is possible.
        \\Expl}
        \\In{
                Look for a match starting from T[i]   \\Ref LookForMatch
                i <- i+1
                \\Expl{  We got here if there was no match starting at T[i],
                        so we try starting from the next position, i+1, in T.
                \\Expl}
        \\In}
        return (-1)
        \\Expl{  We use -1 to indicate that there was no match.
        \\Expl}
    \\In}
    \\Code}
    
    \\Code{
    LookForMatch
    // Look for a match starting from T[i]
    j <- 0
    while j < m and P[j] = T[i+j]
    \\Expl{  We keep progressing the search as long as we have not 
            exhausted the pattern (that is, j<m) and the pattern 
            checked so far matches the string starting from T[i].
    \\Expl}
    \\In{
            j <- j+1
    \\In}
    if j = m
    \\Expl{  If we have reached the end of the pattern, that means
            we have matched T[i]..T[i+m-1].
    \\Expl}
    \\In{
            return i
    \\In}
    \\Code}
`);
