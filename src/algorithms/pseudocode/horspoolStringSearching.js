import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of Horspool's algorithm
Draft Harald 15 Aug 2021
Edited Linda 31 Aug 2021
Linda added AlphabetSize explanation 1 Sept 2021
\\Note}

\\Note{  Provide a visualisation in which a "shift table" is first
        constructed, and then the search is shown as the pattern P
        being slid across the text T.
\\Note}

\\Overview{
    Horspool's algorithm uses a preprocessing of the pattern P to limit
    the number of partial matches attempted, compared to the brute-force
    method. As with the brute-force method, we can think of P as 
    "sliding along" the text T. Horspool's method, however, matches the
    pattern P from right to left. Its preprocessing generates a Shift
    Table which gives, for each character, the number of places to shift
    the pattern along, in case of a failed partial match. The shift table has a value
    for every character in the alphabet, including characters that are not in pattern P, 
   but could be in text T. The alphabet contains all characters that might possibly be in the 
   text and pattern.  In this visualization, the alphabet contains all letters in the 
   Roman alphabet (A-Z) plus the Space character.  Alphabets might be smaller, e.g. for DNA 
   sequences the alphabet would be the four bases, or they might be larger, e.g. the characters
   found in English literature, which would include both upper and lower case letters, space,
   punctuation, numbers, etc.

     As an example of how the Shift Table is used:
    if the pattern is "wally" and matching fails (immediately) because the
    'y' gets compared against an 'x' in the text, a character not found in the pattern,
    the pattern can be slid 5 characters forward because there is not chance of a match.  So the value for 
   character 'x' in the shift table is 5.
\t 
    If the failure was due to comparing 'y' against an 'a', a character
    that does appear in the pattern, the pattern can be slid 
    forward by 3 characters, to where the 'a' in the text is aligned with the last 'a' in the pattern. At this point 
    we need to start another attempted match from the rightmost end of the pattern. Where a
    character appears repeatedly in the pattern, as 'l' does in the "wally"
    example, it is the last occurrence that counts, so in this example
    the shift therefore will be 1, not 2.\t 
\\Overview}

\\Code{
Main
Horspool(T, n, P, m)  \\B 1
  // Look for pattern P (of length m) in text T (of length n).
  // If found, return the index of P's first occurrence in T.
\\Expl{  The pattern is P[1]..P[m] and the text is T[1]..T[n].
\\Expl}
\\In{
    CreateShiftTable          \t\t\t\t \\Ref CreateShiftTable
    Search \t\t                              \\Ref Search
\\In}
\\Code}

\\Code{
CreateShiftTable
Initialize ShiftTable   \\Ref InitializeShiftTable

//Put in values for characters in pattern P
for j <- 1 to m-1  \\B 4
\\In{
    Shift[P[j]] <- m - j  \\B 5
    \\Expl{ For characters that are in pattern P, overwrite the default shift to something smaller.
    \\Expl}\t \t
\\In}
\\Code}

\\Code{
Search
i <- m  \\B 6
while i <= n  \\B 11
\\Expl{ Until matching has gone beyond the length n of text T, start another attempted match. 
\\Expl}
\\In{
    j <- 0  \\B 13
    while j < m and P[m-j] = T[i-j] \\B 8
    \\Expl{ These characters match.
    \\Expl} \t\t
    \\In{
        j <= j + 1 \\B 9
    \\In}
    \\Expl{  So move back one character and keep trying to match.
    \\Expl} 
    if j = m  \\B 14
    \\In{
        // we have a match
        return i - m + 1  // start of the match \\B 10
    \\In}
    else  \\B 15
    \\In{
    i <- i + Shift[T[i]] \\B 7
    \\Expl{  Advance the pattern, consulting the shift table to see how
            far, given the attempted match starting with T[i] failed.
    \\Expl}
    \\In}
\\In}  
return NOT FOUND  // Signal that there was no match   \\B 12
\\Code}
\\Code{
InitializeShiftTable
for k <- 1 to AlphabetSize \\B 2
\\Expl{  The Alphabet contains all characters from which the
text or pattern may be drawn, and AlphabetSize is the
number of characters in the Alphabet.  
\\Expl}        
\\In{
    Shift[k] <- m  \\B 3
    \\Expl{  Set the default shift to be length m of pattern P.  That is, whenever
     the current character in the text is not in the pattern at all, we do not have
     to try any more possible matches that contain this character, so we make a large skip. 
    \\Expl}
\\In}
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
