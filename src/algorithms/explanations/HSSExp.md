# Horspool String Search

Horspool's algorithm uses a preprocessing of the pattern P to limit the number of partial matches attempted, compared to the brute-force method. 
As with the brute-force method, we can think of P as "sliding along" the text T. Horspool's method, however, matches the pattern P from right to left. 
Its preprocessing generates a Shift Table which gives, for each character, the number of places to shift the pattern along, in case of a failed partial match. 
The shift table has a value for every character in the alphabet, including characters that are not in pattern P, but could be in text T. The alphabet contains all characters that might possibly be in the text and pattern.  

In this visualization, the alphabet contains all letters in the Roman alphabet (A-Z) plus the Space character.  Alphabets might be smaller, e.g. for DNA sequences the alphabet would be the four bases, or they might be larger, e.g. the characters found in English literature, which would include both upper and lower case letters, space, punctuation, numbers, etc.  

As an example of how the Shift Table is used:  

If the pattern is "wally" and matching fails (immediately) because the
    'y' gets compared against an 'x' in the text, a character not found in the pattern,
    the pattern can be slid 5 characters forward because there is not chance of a match.  So the value for character 'x' in the shift table is 5.

If the failure was due to comparing 'y' against an 'a', a character
    that does appear in the pattern, the pattern can be slid 
    forward by 3 characters, to where the 'a' in the text is aligned with the last 'a' in the pattern. At this point 
    we need to start another attempted match from the rightmost end of the pattern. Where a
    character appears repeatedly in the pattern, as 'l' does in the "wally"
    example, it is the last occurrence that counts, so in this example
    the shift therefore will be 1, not 2.	 