# Binary trie insertion

A binary trie follows the digits of a key from left to right. An edge labelled 0 goes left; an edge labelled 1 goes right. Keys with a common prefix share the same initial path.

If the next child is missing, insertion creates it. The pointer `t` then moves to that child. After all digits have been consumed, the node is marked as an end node and displays the original key. Inserting the same key again reuses its path.

This animation pads all keys to the binary width of the largest input. The current bit is highlighted in the key panel. Layout coordinates are reserved in advance so existing nodes do not move as children appear.

This first version supports binary insertion only. Search and bases 4 and 10 are separate follow-up work.
