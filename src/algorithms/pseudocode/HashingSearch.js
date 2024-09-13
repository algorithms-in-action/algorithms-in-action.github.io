import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Main
    HashSearch(T, k)  // Search for key k in table T \\B HashSearch(T, k)
    \\In{
        i <- hash(k) \\B 4
        Choose Increment value for stepping through T \\Ref SetIncrementLinearProbing
        while not (T[i] = k or T[i] = Empty) // search for T or Empty
        \\Expl{
            We do not allow duplicates to be inserted into the table.
        \\Expl}
        \\In{
            i <- (i + Increment) mod TableSize \\B 7
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
        i <- (k * BIGPRIME) mod TableSize \\B 4
        \\Expl{
            BIGPRIME much bigger than TableSize (which is also prime).
            The object is to spread the values across the hash table as widely as possible.
            Here we use BIGPRIME = 3457.
        \\Expl}
\\Code}

\\Code{
    SetIncrementLinearProbing
    Increment <- 1 \\B 5
    \\Expl{ For linear probing, if we have a collision we successively look at the
            next table entry.
    \\Expl}
\\Code}


\\Code{
    SetIncrementDoubleHashing
        Increment <- (k * BIGPRIME2) mod SMALLISHPRIME + 1 \\B 10
        \\Expl{Double hashing resolves collisions by hashing the key k a second time to set the increment
            to find the next empty slot in the table R. The value given by the function must be non-zero
            and must also be relatively prime to the table size.
            Here BIGPRIME2 is 1429 and SMALLISHPRIME is 3 or 23, depending on the table size selected.
        \\Expl}
\\Code}
`);
