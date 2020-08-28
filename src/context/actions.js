/* eslint-disable no-console */
/* eslint-disable max-len */
import algorithms from '../algorithms';
import Chunker from './chunker';

const DEFAULT_ALGORITHM = 'binarySearchTree';

// At any time the app may call dispatch(action, params), which will trigger one of
// the following functions. Each comment shows the expected properties in the
// params argument.
export const GlobalActions = {

  // load an algorithm by returning its relevant components
  LOAD_ALGORITHM: (state, params) => {
    const data = algorithms[params.name];
    console.log('LOAD ALGORITHM');

    const {
      param, name, explanation, extraInfo,
    } = data;
    return {
      id: params.name,
      name,
      explanation,
      extraInfo,
      param,
    };
  },

  // run an algorithm by executing the algorithm
  RUN_ALGORITHM: (state, params) => {
    console.log('RUN ALGORITHM');
    const data = algorithms[params.name];
    const {
      param, controller, name, explanation, extraInfo,
    } = data;

    const procedurePseudocode = Object.values(controller[params.mode].pseudocode)[0];
    // here we pass a function reference to Chunker() because we may want to initialise
    // a visualiser using a previous one
    const chunker = new Chunker(() => controller[params.mode].initVisualisers(params));
    controller[params.mode].run(chunker, params);
    const bookmarkInfo = chunker.next();

    return {
      id: params.name,
      name,
      explanation,
      extraInfo,
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
  return GlobalActions.LOAD_ALGORITHM(undefined, { name: DEFAULT_ALGORITHM, nodes: [] });
}
