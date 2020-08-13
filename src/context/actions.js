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
      graph,
      pseudocode: procedurePseudocode,
      chunks: chunker.chunks,
      bookmark: chunker.chunks[0].bookmark,
      currentChunk: 0,
    };
  },

  // No expected params
  NEXT_LINE: (state) => {
    if (state.currentChunk === state.chunks.length - 1) {
      // We have reached the end, do nothing
      return state;
    }
    state.chunks[state.currentChunk + 1].mutator();
    return {
      ...state,
      bookmark: state.chunks[state.currentChunk + 1].bookmark,
      currentChunk: state.currentChunk + 1,
    };
  },

  // No expected params
  PREV_LINE: (state) => {
    if (state.currentChunk === 0) {
      // Can't go past first chunk
      return state;
    }
    // How do we reset the graph state?
    for (let i = 0; i < state.currentChunk; i += 1) {
      state.chunks[i].mutator();
    }
    return {
      ...state,
      bookmark: state.chunks[state.currentChunk - 1].bookmark,
      currentChunk: state.currentChunk - 1,
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
