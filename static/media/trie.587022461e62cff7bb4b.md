# Radix search trie

A radix search trie (RST) follows the digits of a key from left to right. Each node has one child per possible digit: two in base 2, four in base 4, ten in base 10. Keys with a common prefix share the same initial path.

If the next child is missing, insertion creates it. The pointer `t` then moves to that child. After all digits have been consumed, the node is marked as an end node and displays the original key. Inserting the same key again reuses its path. Search follows the same path and succeeds only if it ends on an end node.

Put `?` before a key to search for it in the trie built so far.

## Base 2

An edge labelled 0 goes left; an edge labelled 1 goes right. All keys are padded with leading zeros to the binary width of the largest input, so every key ends at the same depth. The current bit and its mask are highlighted in the key panel.

## Base 4

Each node has up to four children, labelled 0 to 3 from left to right. Keys are converted to base 4 and padded to the width of the largest input. In the key panel each base 4 digit covers two bits of the binary key.

## Base 10

Each decimal digit picks one of ten children, labelled 0 to 9. Keys are not padded, so they can have different lengths. A key that is a prefix of another key needs no new node: inserting 12 then 125 stores 12 on the node reached by 1 &rarr; 2, and 125 hangs below it. Such a node is both an end node (green outline, showing its key) and an internal node with children. Searching for 12 when only 125 is stored reaches that node but fails, because it is not an end node.

The key panel highlights the current digit and its place value (e.g. 100 for the first digit of 125).

Layout coordinates are reserved in advance so existing nodes do not move as children appear.
