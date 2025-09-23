import parse from '../../pseudocode/parse';
import {main, hash1} from './HashingInsertion'

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

const linearProbing = parse(main + hash1 + '\n' + linearProbingIncrement);
export default linearProbing;