import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of brute-force string search
    \\Note}
    \\Code{
    Main
    BruteForceStringSearch(T, n, P, m)  \\B 1
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
                i <- i+1 \\B 2
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
    while j < m and P[j] = T[i+j] \\B 3
    \\Expl{  We keep progressing the search as long as we have not 
            exhausted the pattern (that is, j<m) and the pattern 
            checked so far matches the string starting from T[i].
    \\Expl}
    \\In{
            j <- j+1 \\B 4
    \\In}
    if j = m 
    \\Expl{  If we have reached the end of the pattern, that means
            we have matched T[i]..T[i+m-1].
    \\Expl}
    \\In{
            return i \\B 5
    \\In}
    \\Code}
    \\Note{  The following is an implementation in C:
    #include<stdio.h>
    #include<stdlib.h>
    #include<string.h>
    int
    brute_force_string_search(char T[], int n, char P[], int m) {
        int i, j;
        i = 0;
        while (i+m <= n) { // If i+m > n, no match is possible
            j = 0;
            while (j < m && P[j] == T[i+j]) // Until exhaustion or mismatch,
                j = j+1;                    //   continue the matching
            if (j == m)   // If we reached the end of the pattern
                return i; //   we had a match T[i]..T[i+m-1]
            i = i+1;
        }
        return (-1);
    }
    int
    main() {
        int i, n, m;
        char Text[TEXT_SIZE + 1];
        char Pattern[PATTERN_SIZE + 1];
        printf("String to search in:\n");
        fgets(Text, TEXT_SIZE, stdin);
        printf("String to search for:\n");
        fgets(Pattern, PATTERN_SIZE, stdin);
        n = strlen(Text);
        m = strlen(Pattern);
        if (Text[n-1] == '\n') {
            n = n-1;
            Text[n] = '\0';
        }
        if (Pattern[m-1] == '\n') {
            m = m-1;
            Pattern[m] = '\0';
        }
        i = brute_force_string_search(Text, n, Pattern, m);
        if (i == -1)
            printf("No match\n");
        else
            printf("Match from position %d\n", i);
    }
    \\Note}
`);
