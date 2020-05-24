import algorithms from '../algorithms';

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
      const algorithmGenerator = data.run();
      return {
        name: data.name,
        explanation: data.explanation,
        pseudocode: procedurePseudocode,
        generator: algorithmGenerator,
        bookmark: algorithmGenerator.next().value, // Run it until the first yield
      };
    case GlobalActions.NEXT_LINE:
      return {
        ...state,
        bookmark: state.generator.next().value,
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
