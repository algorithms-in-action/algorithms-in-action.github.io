import parse from '../../pseudocode/parse';
import { hash1 } from './HashingInsertion'
import { chainingPseudocode } from './HashingSearch';
const chainingSearch = parse(chainingPseudocode + '\n' + hash1);
export default chainingSearch;
