/* eslint-disable no-console */
/* eslint-disable max-len */
import algorithms from '../algorithms';
import Chunker from './chunker';

const DEFAULT_ALGORITHM = 'binaryTreeInsertion';

// At any time the app may call dispatch(action, params), which will trigger one of
// the following functions. Each comment shows the expected properties in the
// params argument.
export const GlobalActions = {

  LOAD_ALGORITHM: (state, params) => {
    const data = algorithms[params.name];
    const {
      param, controller, name, explanation,
    } = data;

    const procedurePseudocode = Object.values(controller.pseudocode)[0];
    // here we pass a function reference to Chunker() because we may want to initialise
    // a visualiser using a previous one
    const chunker = new Chunker(() => controller.initVisualisers(params));
    controller.run(chunker, params);
    const bookmarkInfo = chunker.next();

    return {
      id: params.name,
      name,
      explanation,
      param,
      pseudocode: procedurePseudocode,
      ...bookmarkInfo, // sets bookmark & finished fields
      chunker,
      visualisers: chunker.visualisers.graph,
    };
  },

  // No expected params
  NEXT_LINE: (state) => ({
    ...state,
    ...state.chunker.next(),
  }),

  // No expected params
  PREV_LINE: (state) => ({
    ...state,
    ...state.chunker.prev(),
  }),
};

export function dispatcher(state, setState) {
  return (action, params, nodes, target) => {
    setState(action(state, params, nodes, target));
  };
}

export function initialState() {
  // return GlobalActions.LOAD_ALGORITHM(undefined, {});
  return GlobalActions.LOAD_ALGORITHM(undefined, { name: DEFAULT_ALGORITHM, nodes: [] });
}
