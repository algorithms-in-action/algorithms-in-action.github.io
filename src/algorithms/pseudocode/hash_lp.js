import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification for hashing - linear probing
Currently includes double hashing pseudocode as well - will split into
two versions at some point.
\\Note}

\\Code{
    HashInit
    HashInit(T)    // TableSize is prime
        \\In{
            Initialize Hash Table Slots to Empty   \\Ref NullTable
            Insertions <- 0    // Keep track of how full table is
        \\In}
\\Code}
\\Note}

\\Note{
Lee: Not sure we need to spell this out - probably delete
\\Code{
    NullTable
        i <- 0
        while i<TableSize
        {\\In
            T[i] <- Empty     // Table must start with all slots empty
            i <- i+1
        \\In}
\\Code}
\\Note}

\\Code{
    Insert
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
            \\Note{ The animation could stop with a "Table too full" message here.
                Above should be shortened and maybe refer to overview - I wrote
                it before looking at the overview.
            \\Note}
            Insertions <- Insertions + 1
            \\Expl{ To check how full the table is we can maintain a simple
                counter.
            \\Expl}
            \\Note{
            \\Note}
            i <- hash(k) \\Ref Hash1
            Choose Increment value in case of collisions \\Ref SetIncrement
            while T[i] is occupied by another element // search for unoccupied slot
            \\Expl{ If T[i] = k then k already exists in the table. Ideally,
                duplicates should be avoided as they decrease performance and
                search just returns the first one.
            \\Expl}
            \\Note{ We could have a lookup operation = search + insert if not found.
                Or maybe move this explanation to the overview.
            \\Note}
                \\In{
                    i <- (i + Increment) mod TableSize
                    \\Expl{ T[i] is occupied so we jump ahead Increment steps.
                        We use modulo TableSize to "wrap around" if we reach the end.
                    \\Expl}
                \\In}
            T[i] <- k // unoccupied slot found so we put k in it
        \\In}
\\Code}

\\Code{
    HashSearch(T, k)  // Search for key k in table T
    \\In{
        i <- hash(k) \\Ref Hash1
        Choose Increment value for stepping through T \\Ref SetIncrement
        while not (T[i] = k or T[i] = Empty) // search for T or Empty
        \\In{
            i <- (i + Increment) mod TableSize
            \\Expl{ T[i] is not k or Empty so we jump ahead Increment
                steps and "wrapping around" if we reach the end, mirroring
                the insertion code.
            \\Expl}
            \\Note{ Probes <- Probes + 1
                Having the animation display the number of probes in some
                way is a good idea (we could highlight the slots probed)
                but dont need code here? Needs Probes <- 0 above.
            \\Note}
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

\\Note{ This is used for both Insert and Search - the implementation may
need to copy it for animation purposes
\\Note}
\\Code{
    Hash1
        i <- (k * BIGPRIME) mod TableSize
        \\Expl{ XXX blah blah Want BIGPRIME much bigger than TableSize
            Here we use BIGPRIME = 3457
        \\Expl}
\\Code}

\\Note{ Linear probing version
Pick this OR the double hashing version below
Need to separate these into two files at some point most likely - the
overview will be a bit different also
Alternatively, have a single version with radio buttons to select, like
union-find path compression (doesn't fit so well if we have other
hashing methods such as chaining, quadratic residue), though we could
have "hashing (open addressing)" and "hashing (chaining)"
\\Note}
\\Note{ This is used for both Insert and Search - the implementation may
need to copy it for animation purposes
\\Note}
\\Code{
    SetIncrement
        Increment <- 1
        \\Expl{ For linear probing, if we have a collision we just look at the
            next table entry. This tends to form "clusters" of full table
            entries, reducing performance.  Offset linear probing adds some
            fixed number n to the table index for collisions. It's harder to
            see the clusters in the table but effectively they are still there
            and performance is not improved.
        \\Expl}
        \\Note{ A bit long? Move offset linear probing to overview or ignore it?
            Increment and table size must be relatively prime.
        \\Note}
\\Code}

\\Note{ Double hashing version - see above
\\Note}
\\Note{ This is used for both Insert and Search - the implementation may
need to copy it for animation purposes
\\Note}
\\Code{
    SetIncrement
        Increment <- (k * BIGPRIME2) mod SMALLISHPRIME + 1
        \\Expl{ For double hashing, the increment we use for the table index
            to resolve collisions depends on the key k. We apply a secondary
            hash function to k but must also ensure the increment is non-zero.
            This reduces clustering in the table. Here we use
            BIGPRIME2=1429, SMALLISHPRIME=23
        \\Expl}
\\Code}

\\Note{
// Hashing implementation, based on BST code - might be a bit of
// leftover rubbish from that
\\Note}
`);
