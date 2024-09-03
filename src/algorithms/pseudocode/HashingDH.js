import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    HashSearch(T, k)  // Search for key k in table T \\B HashSearch(T, k)
    \\In{
        i <- hash(k) \\Ref Hash1
        Choose Increment value for stepping through T \\Ref SetIncrementLinearProbing
        while not (T[i] = k or T[i] = Empty) // search for T or Empty
        \\In{
            i <- (i + Increment) mod TableSize
            \\Expl{ T[i] is not k or Empty so we jump ahead Increment
                steps and "wrapping around" if we reach the end, mirroring
                the insertion code.
            \\Expl}
        \\In}
        if T[i] = key
        \\In{
            return i // return the table index where the key has been found
        \\In}
        else
        \\In{
            return NOTFOUND
        \\In}
    \\In}
\\Code}

\\Code{
    Hash1
        i <- (k * BIGPRIME) mod TableSize
        \\Expl{ XXX blah blah Want BIGPRIME much bigger than TableSize
            Here we use BIGPRIME = 3457
        \\Expl}
\\Code}

\\Code{
    SetIncrementLinearProbing
        Increment <- 1
        \\Expl{ For linear probing, if we have a collision we just look at the
            next table entry. This tends to form "clusters" of full table
            entries, reducing performance.  Offset linear probing adds some
            fixed number n to the table index for collisions. It's harder to
            see the clusters in the table but effectively they are still there
            and performance is not improved.
        \\Expl}
\\Code}

\\Code{
    SetIncrementDoubleHashing
        Increment <- (k * BIGPRIME2) mod SMALLISHPRIME + 1
        \\Expl{ For double hashing, the increment we use for the table index
            to resolve collisions depends on the key k. We apply a secondary
            hash function to k but must also ensure the increment is non-zero.
            This reduces clustering in the table. Here we use
            BIGPRIME2=1429, SMALLISHPRIME=23
        \\Expl}
\\Code}
`);
