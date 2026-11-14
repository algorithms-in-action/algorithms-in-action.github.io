import parse from '../../pseudocode/parse';

// Binary trie insert & search, used by the "operations" mode:
// input like 5,7,?5 inserts 5 and 7 then searches for 5.
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
//==============================================================
Trie_Search(k, t) // Return the end node for key k or NotFound \\B search
for each digit in k // left to right scan of digits \\B search-digit
\\In{
    if no child of t for digit exists \\B search-test-child
    \\In{
        return NotFound \\B search-no-child
        \\Expl{ No stored key starts with the digits scanned so far.
        \\Expl}
    \\In}
    t <- child of t for digit \\B search-move
\\In}
if t is an end node \\B search-test-end
\\In{
    return t \\B search-found
\\In}
else
\\In{
    return NotFound \\B search-not-end
    \\Expl{ The digits of k form a path in the trie, but k itself was
            never inserted.
    \\Expl}
\\In}
\\Code}
`);
