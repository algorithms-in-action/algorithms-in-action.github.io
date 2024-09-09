import parse from '../../pseudocode/parse';

export default parse(`

\\Code{
    NullTable
        i <- 0
        while i<TableSize \\B 2
        \\In{
            T[i] <- Empty     // Table must start with all slots empty
            i <- i+1
        \\In}
\\Code}

\\Code{
    Main
    HashInit(T)    // TableSize is prime \\B 1
        \\In{
            Initialize Hash Table Slots to Empty   \\Ref NullTable
            Insertions <- 0    // Keep track of how full table is
        \\In}

    //=======================================================

    HashInsert(T, k)  // Insert key k into table T
        \\In{
            Check how full the table is
            \\Expl{ If the table gets too full (over 80%, say), performance degrades
                a lot. Ideally, we should prevent this by allocating a larger table
                (eg, the size being a prime number around twice the size of T),
                inserting each element into the new table and continuing with T
                being the larger table. It is essential the table has at least one
                slot Empty, otherwise the Search code may loop; we just return
                with failure here rather than fill the last slot or expand the table.
            \\Expl}
            Insertions <- Insertions + 1 \\B 3
            \\Expl{ To check how full the table is we can maintain a simple
                counter.
            \\Expl}
            i <- hash(k) \\Ref Hash1
            Choose Increment value in case of collisions \\Ref SetIncrementLinearProbing
            while T[i] is occupied by another element // search for unoccupied slot \\B 6
            \\Expl{ If T[i] = k then k already exists in the table. Ideally,
                duplicates should be avoided as they decrease performance and
                search just returns the first one.
            \\Expl}
                \\In{
                    i <- (i + Increment) mod TableSize \\B 7
                    \\Expl{ T[i] is occupied so we jump ahead Increment steps.
                        We use modulo TableSize to "wrap around" if we reach the end.
                    \\Expl}
                \\In}
            T[i] <- k // unoccupied slot found so we put k in it \\B 8
        \\In}
\\Code}

\\Code{
    HashDelete(T, i)    // mark T[i] as Deleted
                        // To delete a key we need to search for it first
        T[i] <- Deleted
        \\Expl{ T[i] is no longer considered occupied, so a key may be
                inserted here, but searching does not stop at Deleted slots,
                only Empty ones (or if we find the key).
        \\Expl}
        Check how many Deleted slots there are in the table
        \\Expl{ Deleted slots slow down searching and limit table capacity as
                there must be at least one Empty slot for searching. If
                some threshold is reached a new table can be allocated with
                all slots Empty then all keys in the old table can be
                inserted into the new table and the old table discarded.
        \\Expl}
\\Code}

\\Code{
    Hash1
        i <- (k * BIGPRIME) mod TableSize \\B 4
        \\Expl{ XXX blah blah Want BIGPRIME much bigger than TableSize
            Here we use BIGPRIME = 3457
        \\Expl}
\\Code}

\\Code{
    SetIncrementLinearProbing
        Increment <- 1 \\B 5
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
