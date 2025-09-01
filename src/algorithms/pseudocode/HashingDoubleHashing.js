import parse from '../../pseudocode/parse';
import { main, hash1 } from './HashingInsertion'

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

const doubleHashing = parse(main + hash1 + '\n' + doubleHashingIncrement);
export default doubleHashing;