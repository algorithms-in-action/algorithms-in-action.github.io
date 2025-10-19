import parse from '../../pseudocode/parse';


// We now skip NullTable and HashInit function completely - just start
// animation with initialised table
// If dynamic tables are not implemented, both CheckTableFullness
// and CheckTableFullnessDel should be removed.
// Currently dynamic tables are supported for open addressing but not
// chaining.  The latter still has "Check how full the table is" that
// doesn't expand but has an explanation. XXX could be added some time.

export const main = `

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
            HashInsert(T, k)  // Insert key k into table \\B 1
                \\In{
                    Check how full the table is \\Ref CheckTableFullness
                    \\Expl{ 
                      The table must always have at least one Empty slot
                      (otherwise search may not terminate). Performance
                      also degrades greatly with fewer empty slots.
                      This can be overcome by reconstructing the
                      whole table so there are no longer any Deleted slots and
                      the table size may also increase. The is done if
                      the "Dynamic size" option (below "SEARCH") is enabled.
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
                    Search for Empty slot or k \\Ref InsertionLoop
                    \\Expl{ Check slots in steps of the chosen increment
                        value, wrapping around at the end of the table.
                        If k already exists in the table
                        the code here simply over-writes the previous
                        ocurrence of k, as if the slot was empty.
                    \\Expl}
                    T[i] <- k // Put k into table \\B 9
                    // Done \\B 10
                \\In}

            //=======================================================

            HashDelete(T, k)  // Delete key k in table T \\B 11
            \\In{
                Check how full the table is \\B 21
\\Note{ \\Ref CheckTableFullnessDel
}
                \\Expl{ If there are lots of Deleted slots we may want to
                  reconstruct the table to improve performance. In rare
                   cases we may also want to decrease the table size.
                   Currently we don't implement these options here.
                \\Expl}
                i <- hash(k) // Expand Hash in HashInsert for details \\B 16
                Choose Increment value for stepping through T \\B 17
                \\Expl{ Expand Choose Increment in HashInsert for
                  details.  The increment value for deletion is the same as that for
                  insertion.
                \\Expl}
                Search for k or Empty slot \\Ref DeletionLoop
                    \\Expl{ Check slots in steps of the chosen increment
                        value, wrapping around at the end of the table.
                    \\Expl}
                if T[i] = k \\B 14
                    \\In{
                        T[i] <- Deleted \\B 15
                        \\Expl{ If T[i] contains the key, the slot is flagged as deleted.
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
            DeletionLoop
                while not (T[i] = k or T[i] = Empty) \\B 12
                    \\Expl{ Note we keep searching if T[i] = Deleted.
                    \\Expl}
                    \\In{
                        i <- (i + Increment) mod TableSize \\B 13
                        \\Expl{ T[i] is not k or Empty so we jump ahead Increment
                            steps and "wrapping around" if we reach the end, mirroring
                            the insertion code.
                        \\Expl}
                    \\In}

        \\Code}

        \\Code{
            InsertionLoop
                while not (T[i] = Empty or T[i] = k) \\B 7
                \\Expl{ Note we keep searching if T[i] = Deleted.
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
                if there are too few empty slots // and "Dynamic size" is enabled \\B 19
                    \\Expl{ A small number of empty slots leads to poor performance.
                        If fewer than 20% of slots that are Empty and
                        the "Dynamic size" option is enabled
                        we reconstruct the table.
                        Usually we approximately double the table size (up
                        to a maximum of 97).  If most non-empty slots
                        are Deleted we retain the same size.
                        For bulk insertions we calculate the new size assuming
                        there will be no duplicate elements.
                    \\Expl}
                    \\In{
                        OldT <- T;  // save T so we can extract the keys
                        T <- new empty table \\B 30
                        \\Expl{ Without deleted elements, it is best for
                            the table size to approximately double.  If there are many deleted slots
                            it may be OK to keep the same size.
                        \\Expl}
                        Insert all keys of OldT into T \\Ref InsertAll
                    \\In}
        \\Code}

              \\Note{ version for expanded
                "Insert all keys of OldT into T"
              \\Note}
        \\Code{
            InsertAll
            For each key k1 in OldT \\B 31
            \\In{
              HashInsert(T, k1) \\B 32
              \\Expl{ Note: this call is recursive but there will never
                be multiple levels of
                recursion because the new table will be large enough
                to easily accomodate all the keys that were in T.
                We don't animate the details of these insertions.
              \\Expl}
              \\Note{ Animation can stop at this line for each
                key
              \\Note}
            \\In}
        \\Code}

        \\Code{
            CheckTableFullnessDel
                if there are too many deleted slots \\B 20
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
                \\Expl{ Ideally, BIGPRIME is much bigger than TableSize, which is also prime.
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
	      next table entry (for double hashing, different increments are used).
              The same increment is used for insertion, search and delete.
            \\Expl}
        \\Code}

`

export const doubleHashingIncrement = `

        \\Code{
            SetIncrement
                Increment <- (k * BIGPRIME2) mod SMALLISHPRIME + 1 \\B 6
                \\Expl{ Double hashing resolves collisions by hashing the key k a second time to set the increment
                    to find the next empty slot in the table R. The value given by the function must be non-zero
                    and must also be relatively prime to the table size.
                    Here BIGPRIME2 is 1429 and SMALLISHPRIME is 3 or 23, depending on the table size selected.
                    The same increment is used for insertion, search and delete.
                \\Expl}
        \\Code}
`

let chainingInsert = `
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
        HashInsert(T, k)  // Insert key k into table T \\B 1
            \\In{
            Check how full the table is \\B 4
            \\Expl{ This is not really required, but if the number of insertions
                is getting large compared to the table size it may be worth expanding the
                table (not currently implemented).
            \\Expl}
            i <- hash(k) \\Ref Hash1
            insert k into list T[i] \\Ref InsertList
            // Done \\B 10
            \\In}

        //=======================================================

        HashDelete(T, k) \\B 11
            \\In{
            i <- hash(k) // Expand Hash in HashInsert for more details \\B 16
            delete k from list T[i] \\B 14
            \\Expl{ If k does not exist we ignore it (but highlight the
              slot with a different color).
            \\Expl}
            \\In}
    \\Code}

    \\Code{
    InsertList
        l <- new list node with head k and tail T[i] \\B 7
        \\Expl{ Here we simply insert k at the start of the list T[i]. We
        could check for duplicates but it is not necessary and would require
        scanning the list.
        \\Expl}
        T[i] <- l \\B 9
    \\Code}

    \\Code{
    DeleteList
        l <- T[i]  // l scans through the list T[i] \\B 20
        prevptr <- pointer to T[i] // follows one step behind l
        \\Expl{ prevptr is a pointer to a pointer. It trails one step behind
            l as we scan through the list so the previous node (or T[i]) can
            be modified when k is found.
        \\Expl}
        while not (l = Empty or head(l) = k) // 'Empty' is the empty list
            \\In{
            l <- tail(l)  // skip to next list element
            prevptr <- pointer to tail(l)
            \\In}
        if l = Empty // reached the end of the list without finding k \\B 14
            \\In{
            // do nothing
            \\In}
        else \\B 18
            \\In{
            *prevptr <- tail(l) // previous node now points to tail(l)
            \\Expl{ The list now skips over the node containing k. The
                memory for this node can be reclaimed.
            \\Expl}
            \\In}
    \\Code}
`

export const doubleHashing = parse(main + hash1 + '\n' + doubleHashingIncrement);
export const linearProbing = parse(main + hash1 + '\n' + linearProbingIncrement);
export const chaining = parse(chainingInsert + '\n' + hash1);
