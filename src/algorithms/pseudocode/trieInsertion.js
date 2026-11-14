import parse from '../../pseudocode/parse';

// Team pseudocode from the 17 September meeting; bookmarks drive playback.
export default parse(`
\\Code{
Main
Trie_Insert(k, t) // Insert key k in trie t \\B 1
for each digit in k // left to right scan of digits \\B 2
\\In{
    if no child of t for digit exists \\B 3
    \\In{
        create child node for digit \\B 4
    \\In}
    t <- child of t for digit \\B 5
\\In}
mark t as an end node \\B 6
\\Code}
`);
