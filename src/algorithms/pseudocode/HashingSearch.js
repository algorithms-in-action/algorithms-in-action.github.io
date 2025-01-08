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

let chainingPseudocode = `
\\Code{
    Main
    HashSearch(T, k)  // Search for key k in table T
    \\In{
        i <- hash(k) \\Ref Hash1
        search for k in list T[i] \\Ref SearchList
    \\In}
\\Code}

\\Code{
    SearchList
        l <- T[i] \\B 9
        while not (l = Empty or head(l) = k) // 'Empty' is the empty list
            \\In{
            l <- tail(l)  // skip to next list element
            \\In}
        if l = Empty // reached the end of the list without finding k
            \\In{
            return NOTFOUND \\B 8
            \\In}
        else
            \\In{
            return l // return list element where the key has been found \\B 7
            \\Expl{ Normally there would keys and values stored and we would
            return the value.
            \\Expl}
            \\In}
\\Code}
`

export const doubleSearch = parse(main + '\n' + hash1 + '\n' + doubleHashingIncrement);
export const linearSearch = parse(main + '\n' + hash1 + '\n' + linearProbingIncrement);
export const chainingSearch = parse(chainingPseudocode + '\n' + hash1);
