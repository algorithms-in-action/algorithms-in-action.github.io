import algorithms from '../algorithms';
import Chunker from './chunker';

const DEFAULT_ALGORITHM = 'binaryTreeSearch';

// At any time the app may call dispatch(action, params), which will trigger one of
// the following functions. Each comment shows the expected properties in the
// params argument.
export const GlobalActions = {
  // { name: 'binaryTreeSearch'}
  LOAD_ALGORITHM: (state, params) => {
    const {
      name, pseudocode, explanation, initVisualisers, run,
    } = algorithms[params.name];

    // This line just picks an arbitrary procedure from the pseudocode to show
    // It will need to be changed when we properly support multiple procedures
    // (e.g. insert and search)
    const procedurePseudocode = Object.values(pseudocode)[0];
    const chunker = new Chunker(initVisualisers);
    run(chunker);
    const bookmark = chunker.next();
    return {
      id: params.name,
      name,
      explanation,
      pseudocode: procedurePseudocode,
      visualisers: chunker.visualisers,
      bookmark,
      chunker,
    };
  },

  // No expected params
  NEXT_LINE: (state) => ({
    ...state,
    bookmark: state.chunker.next(),
  }),

  // No expected params
  PREV_LINE: (state) => ({
    ...state,
    bookmark: state.chunker.prev(),
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
