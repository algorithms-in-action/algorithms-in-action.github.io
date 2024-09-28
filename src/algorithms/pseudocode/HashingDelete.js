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
            while not (T[i] = k or T[i] = Empty) // search for T or Empty \\B 2
                \\In{
                    i <- (i + Increment) mod TableSize \\B 3
                    \\Expl{ T[i] is not k or Empty so we jump ahead Increment
                        steps and "wrapping around" if we reach the end, mirroring
                        the insertion code.
                    \\Expl}
                 \\In}
            if T[i] = k \\B 4
                \\In{
                    T[i] <- "x" \\B 7
                    \\Expl{ If T[i] contains the index element, it is deleted from the array.
                        In this implementation, deletion of said integer occurs by replacing it
                        with "x" to help with visualisation.
                    \\Expl}
                \\In}
            else
                \\In{
                return NOTFOUND \\B 8
                \\In}
        \\In}
    \\Code}
`
export const doubleDelete = parse(main + '\n' + hash1 + '\n' + doubleHashingIncrement);
export const linearDelete = parse(main + '\n' + hash1 + '\n' + linearProbingIncrement);