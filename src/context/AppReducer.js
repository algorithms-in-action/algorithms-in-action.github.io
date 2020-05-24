import algorithms from '../algorithms';
import { findFirstBookmarkInProcedure } from '../pseudocode/utils';

// Types of action that can occur, and an example of their use
export const GlobalActions = {
  // {type: GlobalActions.LOAD_ALGORITHM, name: 'binaryTreeSearch'}
  LOAD_ALGORITHM: 'LOAD_ALGORITHM',
  // {type: GlobalActions.NEXT_LINE}
  NEXT_LINE: 'NEXT_LINE',
};

const reducer = (state, action) => {
  switch (action.type) {
    case GlobalActions.LOAD_ALGORITHM:
      const data = algorithms[action.name];
      // This line just picks an arbitrary procedure from the pseudocode to show
      // It will need to be changed when we properly support multiple procedures
      // (e.g. insert and search)
      const procedurePseudocode = data.pseudocode[Object.keys(data.pseudocode)[0]];
      return {
        name: data.name,
        explanation: data.explanation,
        pseudocode: procedurePseudocode,
        generator: data.run(),
        bookmark: findFirstBookmarkInProcedure(procedurePseudocode),
      };
    case GlobalActions.NEXT_LINE:
      const result = state.generator.next();
      return {
        ...state,
        bookmark: result.value,
      };
    default: return state;
  }
};


export function init(defaultAlgorithmName) {
  return reducer(undefined, {
    type: GlobalActions.LOAD_ALGORITHM,
    name: defaultAlgorithmName,
  });
}

export default reducer;
