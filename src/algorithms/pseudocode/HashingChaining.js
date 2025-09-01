import parse from '../../pseudocode/parse';
import { hash1 } from './HashingInsertion'

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

const chaining = parse(chainingInsert + '\n' + hash1);
export default chaining;