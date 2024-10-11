import parse from '../../pseudocode/parse';


// XXX Best skip NullTable and HashInit function completely - just start
// animation with initialised table
// XXX: if dynamic tables are not implemented, both CheckTableFullness
// and CheckTableFullness should be removed
// NOTE: code now no longer explicitly keeps track of number of
// insertions and CheckTableFullness is modified so some bookmarks (eg,
// 4, 19, 20) no longer exist and controller code will have to change
const main = `

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

            HashInsert(T, k)  // Insert key k into table
                \\In{
                    Check how full the table is \\Ref CheckTableFullness
                    \\Expl{ One empty slot must always be maintained, to
prevent infinite loops when searching.
                    Performance also degrades with fewer empty slots and we may want to reconstruct the table with a larger size.
                    See Background for more details.
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
            
            //=======================================================

            HashDelete(T, k)  // Delete key k in table T \\B 11
            \\In{
                Check how full the table is \\Ref CheckTableFullnessDel
                \\Expl{ If there are lots of Deleted slots we may want to reconstruct the table to improve performance.
                \\Expl}
                i <- hash(k) // Expand Hash in HashInsert for details \\B 16
                Choose Increment value for stepping through T //Expand ChooseIncrement in HashInsert for details \\B 17
                while not (T[i] = k or T[i] = Empty or T[i] = Deleted) // search for k or Empty or Deleted \\B 12
                    \\In{
                        i <- (i + Increment) mod TableSize \\B 13
                        \\Expl{ T[i] is not k or Empty so we jump ahead Increment
                            steps and "wrapping around" if we reach the end, mirroring
                            the insertion code.
                        \\Expl}
                    \\In}
                if T[i] = k \\B 14
                    \\In{
                        T[i] <- Deleted \\B 15
                        \\Expl{ If T[i] contains the index element, the slot is flagged as deleted.
                            We display "X" to indicate Deleted slots.
                        \\Expl}
                    \\In}
                else \\B 18
                    \\In{
                        // Do nothing
                    \\In}
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
            CheckTableFullness
                if there are too few empty slots \\B 19
                    \\Expl{ A small number of empty slots leads to poor performance.
                        To overcome this we must construct a new (possibly
                        larger) table and insert all the elements of T.
                        This also gets rid of deleted slots.
                    \\Expl}
                    \\In{
                        Create a new empty table T1
                        \\Expl{ Without deleted elements, it is best for
                            the table size to approximately double.  If there are many deleted slots
                            it may be OK to keep the same size.
                        \\Expl}
                        Insert each key in T into T1
                        \\Note{ Animation can stop at this line for each
                            key (could possibly have an extra level of expansion)
                        \\Note}
                        T <- T1
                    \\In}
        \\Code}
        \\Code{
            CheckTableFullnessDel
                if there are too many deleted slots \\B 19
                    \\Expl{ A small number of empty slots leads to poor performance.
                        To overcome this we must construct a new table, which gets rid of deleted slots.
                        It may also be worthwhile to reduce the table size.
                    \\Expl}
                    \\In{
                        Create a new empty table T1
                        \\Expl{ If there are many deleted slots
                            it may be be worthwhile to reduce the table size.
                        \\Expl}
                        Insert each key in T into T1
                        \\Expl{ For better performance we could omit inserting k here and skip the later HashDelete code.
                        \\Expl}
                        \\Note{ Animation can stop at this line for each
                            key (could possibly have an extra level of expansion)
                        \\Note}
                        T <- T1
                    \\In}
        \\Code}
`
export const hash1 = `
        \\Code{
            Hash1
                i <- (k * BIGPRIME) mod TableSize \\B 5
                \\Expl{ BIGPRIME much bigger than TableSize (which is also prime).
                The object is to spread the values across the hash table as widely as possible.
                    Here we use BIGPRIME = 3457
                \\Expl}
        \\Code}
`
export const linearProbingIncrement = `

        \\Code{
            SetIncrement
            Increment <- 1 \\B 6
            \\Expl{ For linear probing, if we have a collision we successively look at the
                    next table entry.
            \\Expl}
        \\Code}

`

export const doubleHashingIncrement = `

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
export const doubleHashing = parse(main + hash1 + '\n' + doubleHashingIncrement);
export const linearProbing = parse(main + hash1 + '\n' + linearProbingIncrement);
