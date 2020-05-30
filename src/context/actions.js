import algorithms from '../algorithms';

const DEFAULT_ALGORITHM = 'binarySearchTree';

// At any time the app may call dispatch(action, params), which will trigger one of
// the following functions. Each comment shows the expected properties in the
// params argument.
export const GlobalActions = {

  LOAD_ALGORITHM: (state, params) => {
    const data = algorithms[params.name];
    // This line just picks an arbitrary procedure from the pseudocode to show
    // It will need to be changed when we properly support multiple procedures
    // (e.g. insert and search)
    const procedurePseudocode = data.controller.pseudocode[Object.keys(data.controller.pseudocode)[0]];
    const algorithmGenerator = data.controller.run();
    return {
      id: params.name,
      name: data.name,
      explanation: data.explanation,
      pseudocode: procedurePseudocode,
      generator: algorithmGenerator,
      bookmark: algorithmGenerator.next().value, // Run it until the first yield
    };
  },
  // No expected params
  NEXT_LINE: (state) => ({
    ...state,
    bookmark: state.generator.next().value,
  }),
};

export function dispatcher(state, setState) {
  return (action, params) => {
    setState(action(state, params));
  };
}

export function initialState() {
  return GlobalActions.LOAD_ALGORITHM(undefined, { name: DEFAULT_ALGORITHM });
}
