# Brute Force String Search
---

The most basic string matching problem is: Given a string ("text") T, decide whether the (contiguous) sub-string ("pattern") P appears in T; and, if it does, to identify the position i in T where the match starts. Of course there may be several matches; in that case we ask for the first occurrence of P in T.

Example: The pattern "in" does not appear in the text "scion", but it appears twice in "kingpin". 

The basic, and very natural, algorithm to solve this works by brute-force: Keep a pointer (i) into the text T and another pointer (j) into the pattern P. For each position i, look for a match starting at that point. That is, set j to 0 and keep incrementing j, each time comparing P[j] and T[i+j]. Three things may happen:

    (1) We reach the end of the pattern P, having successfully matched each character. In that case we report success: return the pointer to the start of the match, that is, i.

    (2) We find a mismatch. In that case, repeat the process from position i+1 in the text.

    (3) We run out of text to match against. Actually, we can avoid this situation by not letting i run all the way to the end of the text T: We stop the search as soon as i exceeds the length of T minus the length of P.

For many applications, such as search in English text, this algorithm works reasonably well, even though its worst-case time complexity is high. For search in text over a small alphabet, such as binary text, there are better algorithms.


