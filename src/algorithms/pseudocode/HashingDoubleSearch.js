import parse from '../../pseudocode/parse';
import { main } from './HashingSearch'
import { hash1 } from './HashingInsertion'
import { doubleHashingIncrement } from './HashingDoubleHashing';
const doubleSearch = parse(main + '\n' + hash1 + '\n' + doubleHashingIncrement);
export default doubleSearch;