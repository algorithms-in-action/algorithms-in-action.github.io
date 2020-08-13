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
      name, pseudocode, explanation, graph,
    } = algorithms[params.name];

    // This line just picks an arbitrary procedure from the pseudocode to show
    // It will need to be changed when we properly support multiple procedures
    // (e.g. insert and search)
    const procedurePseudocode = Object.values(pseudocode)[0];
    const chunker = new Chunker();
    algorithms[params.name].run(chunker);
    chunker.chunks[0].mutator();

    return {
      id: params.name,
      name,
      explanation,
      pseudocode: procedurePseudocode,
      chunks: chunker.chunks,
      bookmark: chunker.chunks[0].bookmark,
      currentChunk: 0,
      graph,
    };
  },

  // No expected params
  NEXT_LINE: (state) => {
    console.log(state.chunks);
    state.chunks[state.currentChunk + 1].mutator();
    return {
      ...state,
      bookmark: state.chunks[state.currentChunk + 1].bookmark,
      currentChunk: state.currentChunk + 1,
    };
  },
};

export function dispatcher(state, setState) {
  return (action, params) => {
    setState(action(state, params));
  };
}

export function initialState() {
  return GlobalActions.LOAD_ALGORITHM(undefined, { name: DEFAULT_ALGORITHM });
}
