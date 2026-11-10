import parse from '../../pseudocode/parse';

// Trie prototype (started with DST based on BST)
export default parse(`
\\Code{
Main
    Trie_Insert(k, t) // Insert key k in trie t \\B 1
    for each digit in k // left to right scan of digits \\B for_digit
    \\Expl{ Keys are seen as a sequence of digits.  These can be binary or
        decimal or some other radix. Nodes have a (possibly empty) subtree
        for each digit value (0 up to radix - 1).
        The leftmost digit of k is used at the root of the tree
        to determine the subtree k belongs in. The next
        level of the tree uses the next digit, and so on.
        This loop traces down the tree until the last digit of k, creating
        new nodes if needed.
    \\Expl}
    \\In{
        if no child of t for digit exists \\B if_subtree_empty
        \\Expl{ For radix 2 we check for a left or right child, depending on the
            bit (like digital search trees).  In general, there is a
            subtree for each possible digit value; here we check if it is Empty.
        \\Expl}
        \\In{
            create child node for digit \\B new_subtree
            \\Expl{ The new node has empty subtrees and is not marked as an
                end node.
            \\Expl}
        \\In}
        t <- child of t for digit \\B move_down
        \\Expl{ For radix 2 we move left or right depending on the bit (like
                digital search trees).  In general, there is a
            (possibly empty) subtree for each possible digit value.
        \\Expl}
    \\In}
    mark t as an end node \\B mark_end
    \\Expl{ Node t corresponds to the last digit in k. Marking it as an end
        node indicates than k exists in the trie. If k was already in the
        trie the node would already be marked, so there is no change.
    \\Expl}

/////////////////////////////////////////////////////////
    Trie_Search(k, t) // Search for key k in trie t \\B 1
    for each digit in k // left to right scan of digits \\B for_digit_search
    \\Expl{ Keys are seen as a sequence of digits.  These can be binary or
        decimal or some other radix. Nodes have a (possibly empty) subtree
        for each digit value (0 up to radix - 1).
        The leftmost digit of k is used at the root of the tree
        to determine the subtree k belongs in. The next
        level of the tree uses the next digit, and so on.
        This loop traces down the tree until the last digit of k, unless
        appropriate nodes do not exist (in which case the search fails).
    \\Expl}
    \\In{
        if no child of t for digit exists \\B if_subtree_empty_search
        \\Expl{ For radix 2 we check for a left or right child, depending on the
            bit (like digital search trees).  In general, there is a
            subtree for each possible digit value; here we check if it is Empty.
        \\Expl}
        \\In{
            return NOTFOUND \\B not_found_null
            \\Expl{ There is no child for the current digit of k so k cannot
                have been inserted into the trie.
            \\Expl}
        \\In}
        t <- child of t for digit \\B move_down_search
        \\Expl{ For radix 2 we move left or right depending on the bit (like
            digital search trees).  In general, there is a
            (possibly empty) subtree for each possible digit value.
        \\Expl}
    \\In}
    if t is an end node \\B mark_end
    \\Expl{ Node t corresponds to the last digit in k. If it as an end
        node it means k exists in the trie.
    \\Expl}
    \\In{
        return FOUND \\B found
        \\Expl{ Potentially nodes could contained extra data and we could
            return the data or the node t.
        \\Expl}
    \\In}
    else
    \\In{
        return NOTFOUND \\B not_found
    \\In}
\\Code}

`);
