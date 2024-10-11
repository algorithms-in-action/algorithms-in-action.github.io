import parse from '../../pseudocode/parse';
import {
  linearProbingIncrement,
  doubleHashingIncrement,
  hash1
} from './HashingInsertion'

let main = `
    \\Code{
        Main
        HashSearch(T, k)  // Search for key k in table T \\B 1
        \\In{
            i <- hash(k) \\Ref Hash1
            Choose Increment value for stepping through T \\Ref SetIncrement
            while not (T[i] = k or T[i] = Empty or T[i] = Deleted) // search for T or Empty or Deleted \\B 2
                \\In{
                    i <- (i + Increment) mod TableSize \\B 3
                    \\Expl{ T[i] is not k or Empty so we jump ahead Increment
                        steps and "wrapping around" if we reach the end, mirroring
                        the insertion code.
                    \\Expl}
                 \\In}
            if T[i] = k \\B 4
                \\In{
                    return i // return the table index where the key has been found \\B 7
                \\In}
            else
                \\In{
                return NOTFOUND \\B 8
                \\In}
        \\In}
    \\Code}
`

export const doubleSearch = parse(main + '\n' + hash1 + '\n' + doubleHashingIncrement);
export const linearSearch = parse(main + '\n' + hash1 + '\n' + linearProbingIncrement);
