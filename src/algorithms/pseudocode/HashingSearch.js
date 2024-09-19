import parse from '../../pseudocode/parse';

let text1 = `
    \\Code{
        Main
        HashSearch(T, k)  // Search for key k in table T \\B 1
        \\In{
            i <- hash(k) \\Ref Hash1
            Choose Increment value for stepping through T \\Ref SetIncrement
            while not (T[i] = k or T[i] = Empty) // search for T or Empty \\B 4
                \\In{
                    i <- (i + Increment) mod TableSize \\B 5
                    \\Expl{ T[i] is not k or Empty so we jump ahead Increment
                        steps and "wrapping around" if we reach the end, mirroring
                        the insertion code.
                    \\Expl}
                 \\In}
            if T[i] = k \\B 6
                \\{In
                return i // return the table index where the key has been found \\B 7
                \\In}
            else
                \\{In
                return NOTFOUND \\B 8
                \\In}
        \\In}
    \\Code}

    \\Code{
        Hash1
            i <- (k * BIGPRIME) mod TableSize \\B 2
            \\Expl{ BIGPRIME much bigger than TableSize (which is also prime).
                The object is to spread the values across the hash table as widely as possible.
                    Here we use BIGPRIME = 3457
            \\Expl}
    \\Code}
`
let text2 =`

    \\Code{
        SetIncrement
            Increment <- 1 \\B 3
            \\Expl{ For linear probing, if we have a collision we successively look at the
                    next table entry.
            \\Expl}
    \\Code}
`

let text3 = `

        \\Code{
            SetIncrement
                Increment <- (k * BIGPRIME2) mod SMALLISHPRIME + 1 \\B 3
                \\Expl{Double hashing resolves collisions by hashing the key k a second time to set the increment
                    to find the next empty slot in the table R. The value given by the function must be non-zero
                    and must also be relatively prime to the table size.
                    Here BIGPRIME2 is 1429 and SMALLISHPRIME is 3 or 23, depending on the table size selected.
                \\Expl}
        \\Code}
`
export const doubleSearch = parse(text1 + '\n' + text3);
export const linearSearch = parse(text1 + '\n' + text2);