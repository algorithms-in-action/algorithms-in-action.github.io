import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of Horspool's algorithm
\\Note}

\\Note{  Provide a visualisation in which a "shift table" is first
        constructed, and then the search is shown as the pattern P
        being slid across the text T.
\\Note}

\\Overview{
    Horspool's algorithm uses a pre-analysis of the pattern P to limit
    the number of partial matches attempted (compared to the brute-force
    method). As with the brute-force method, we can think of P as 
    "sliding along" the text T. Horspool's method, however, matches the
    pattern P from right to left. Its pre-analysis generates a "shift"
    table which gives, for each character, the number of places to shift
    the pattern along, in case of a failed partial match. For an example,
    if the pattern is "wally" and matching fails (immediately) because the
    'y' gets compared against an 'x' in the text, the pattern can be slid
    5 characters forward. This is because it contains no x at all. Even 
    if the failure was due to comparing 'y' against an 'a' (a character
    that does appear in the pattern), the pattern can still be slid 
    forward by more than a single character, namely three. Where some
    character appears repeatedly in the pattern (as 'l' does in the 
    example), it is the last occurrence that counts, so in the example, 
    the shift corresponding to 'l' should be 1, not 2.
\\Overview}

\\Code{
Main
Horspool(T, n, P, m) 
  // Look for pattern P (of length m) in text T (of length n).
  // If found, return the index of P's first occurrence in T.
  // Otherwise return -1.
\\Expl{  The pattern is P[1]..P[m] and the text is T[1]..T[n].
\\Expl}
\\In{
    find the shift value for each character          \\Ref FindShifts
    perform the search                               \\Ref Search
\\In}
\\Code}

\\Code{
FindShifts
// Ignoring the text T, calculate, from P, a suitable shift value 
// for each character in the alphabet. 
for k in a..z
\\In{
    Shift[k] <- m
    \\Expl{  Set the default shift to be m.
    \\Expl}
\\In}
for j <- 1 to m-1
\\In{
    Shift[P[j]] <- m - j
\\In}
\\Code}

\\Code{
Search
i <- m
while i <= n
\\In{
    j <- 0
    while j < m and P[m-j] = T[i-j]
    \\In{
        j <= j + 1
    \\In}
    if j = m
    \\In{
        // we have a match
        return i - m + 1  // start of the match
    \\In}
    else
    \\In{
    i <- i + Shift[T[i]]
    \\Expl{  Advance the pattern, consulting the shift table to see how
            far, given the attempted match starting with T[i] failed.
    \\Expl}
    \\In}
return -1  // signal there was no match
\\Code}

\\Note{  The following is an implementation in C:

// Horspool's string matching algorithm

#include<stdio.h>
#include<stdlib.h>
#include<string.h>

#define ALPHABET_SIZE 128
#define TEXT_SIZE 41    // Allow for strings with up to 40 characters
#define PATTERN_SIZE 21 // Allow for search strings with up to 20 characters

int horspool_string_search(char T[], int n, char P[], int m);
void findshifts(char P[], int m);

char Shift[ALPHABET_SIZE];

int
main() {
    int i, n, m;
    char Text[TEXT_SIZE + 2];
    char Pattern[PATTERN_SIZE + 2];

    printf("String to search in:\\n");
    fgets(Text+1, TEXT_SIZE, stdin);        // Leave Text[0] unused
    Text[0] = '\\0';

    printf("String to search for:\\n");
    fgets(Pattern+1, PATTERN_SIZE, stdin);  // Leave Pattern[0] unused
    Pattern[0] = '\\0';

    n = strlen(Text+1);
    m = strlen(Pattern+1);

    // Remove a possible terminating newline character from Text
    if (Text[n] == '\\n') {
        Text[n] = '\\0';
        n = n-1;
    }

    // Remove a possible terminating newline character from Pattern
    if (Pattern[m] == '\\n') {
        Pattern[m] = '\\0';
        m = m-1;
    }

    i = horspool_string_search(Text, n, Pattern, m);
    if (i == -1)
        printf("No match\\n");
    else
        printf("Match from position %d\\n", i);
}

int
horspool_string_search(char T[], int n, char P[], int m) {
    // Assume the strings of interest are T[1]..T[n] and P[1]..P[m]
    int i, j;

    findshifts(P, m);
    i = m;
    while (i <= n) {          // If i > n, no match is possible
        j = 0;
        while (j < m && P[m-j] == T[i-j]) // Until possible mismatch,
            j = j+1;                      //   continue the matching
        if (j == m)           // If we reached the end of the pattern
            return i-m+1;     //   then we had a match T[i-m+1]..T[i]
        i = i + Shift[(int) T[i]];
    }
    return (-1);              // There was no match
}

void
findshifts(char P[], int m) {
    // Assume the pattern of interest is P[1]..P[m]
    int j, k;
    for (k = 0; k < ALPHABET_SIZE; k++)
        Shift[k] = m;           // m is the default shift
    for (j = 1; j < m; j++)
        Shift[(int) P[j]] = m-j;
    return;
}

\\Note}
`);
