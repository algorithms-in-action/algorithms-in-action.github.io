import parse from '../../pseudocode/parse';


let text1 = `

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
                    Insertions <- 0    // Keep track of how full table is \\B 3
                \\In}

            //=======================================================

            HashInsert(T, k)  // Insert key k into table T \\B 11
                \\In{
                    Check how full the table is
                    \\Expl{ One empty slot must always be maintained, to prevent to potential for infinite looping.
                    Even before this point performance degrades if the table gets too full, say over 80% full.
                    See Overview for more details.
                    \\Expl}
                    Insertions <- Insertions + 1 \\B 4
                    \\Expl{ To check how full the table is we can maintain a simple
                        counter.
                    \\Expl}
                    \\Note{The following has a choose increment value -- assumes we can make a choice
                    	here between linear probing and double hashing. NOTE TO DEVELOPERS: We are planning to
                    	make linear probing and double hashing as two separate modules.
                    	So -- in the linear probing pseudocode there is no "Choose increment",
                    	increment is just 1, and further on in the pseudocode Increment will be replaced
                    	by 1.  For the double hashing, we need to calculate the second hash function.
                    \\Note}
                    i <- hash(k) \\Ref Hash1
                    Choose Increment value in case of collisions \\Ref SetIncrement
                    Search for unoccupied slot \\Ref InsertionLoop
                    \\Expl{ Check slots in steps of the chosen increment value, wrapping around at the end of the table
                    \\Expl}
                    T[i] <- k // unoccupied slot found so we put k in it \\B 9
                    // Done \\B 10
                \\In}
        \\Code}

        \\Code{
            InsertionLoop
                \\Expl{ If T[i] = k then k already exists in the table.  We could explicitly check
                    for this but the code here simply over-writes the previous
                    ocurrence of k, as if the slot was empty.
                \\Expl}
                while T[i] is occupied by another element // search for unoccupied slot \\B 7
                \\Expl{ If T[i] = k then k already exists in the table.  We could explicitly check
                        for this but the code here simply over-writes the previous
                        ocurrence of k, as if the slot was empty.
                \\Expl}
                \\In{
                    i <- (i + Increment) mod TableSize \\B 8
                    \\Expl{ T[i] is occupied so we jump ahead Increment steps.
                        We use modulo TableSize to "wrap around" if we reach the end.
                    \\Expl}
                \\In}
        \\Code}

        \\Code{
            HashDelete(T, i)    // mark T[i] as Deleted
                                // To delete a key we need to search for it first
                T[i] <- Deleted \\B 12
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
                i <- (k * BIGPRIME) mod TableSize \\B 5
                \\Expl{ BIGPRIME much bigger than TableSize (which is also prime).
                The object is to spread the values across the hash table as widely as possible.
                    Here we use BIGPRIME = 3457
                \\Expl}
        \\Code}
`
let text2 = `

        \\Code{
            SetIncrement
            Increment <- 1 \\B 6
            \\Expl{ For linear probing, if we have a collision we successively look at the
                    next table entry.
            \\Expl}
        \\Code}

`

let text3 = `

        \\Code{
            SetIncrement
                Increment <- (k * BIGPRIME2) mod SMALLISHPRIME + 1 \\B 6
                \\Expl{Double hashing resolves collisions by hashing the key k a second time to set the increment
                    to find the next empty slot in the table R. The value given by the function must be non-zero
                    and must also be relatively prime to the table size.
                    Here BIGPRIME2 is 1429 and SMALLISHPRIME is 3 or 23, depending on the table size selected.
                \\Expl}
        \\Code}
`
export const doubleHashing = parse(text1 + '\n' + text3);
export const linearProbing = parse(text1 + '\n' + text2);