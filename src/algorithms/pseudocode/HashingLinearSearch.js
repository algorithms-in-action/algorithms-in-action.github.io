import parse from '../../pseudocode/parse';
import { main } from './HashingSearch'
import { hash1 } from './HashingInsertion'
import { linearProbingIncrement } from './HashingLinearProbing';
const linearSearch = parse(main + '\n' + hash1 + '\n' + linearProbingIncrement);
export default linearSearch;