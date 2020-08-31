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
    const data = algorithms[params.name];
    const {
      param, controller, name, explanation, extraInfo,
    } = data;

    const procedurePseudocode = controller[params.mode].pseudocode;
    // here we pass a function reference to Chunker() because we may want to initialise
    // a visualiser using a previous one
    const chunker = new Chunker(() => controller[params.mode].initVisualisers(params));
    controller[params.mode].run(chunker, params);
    const bookmarkInfo = chunker.next();
    const collapseController = {};
    for (const codeBlockName of Object.keys(procedurePseudocode)) {
      if (codeBlockName === 'Main') {
        collapseController[codeBlockName] = true;
      } else {
        collapseController[codeBlockName] = false;
      }
    }


    return {
      id: params.name,
      name,
      explanation,
      extraInfo,
      param,
      pseudocode: procedurePseudocode,
      ...bookmarkInfo, // sets bookmark & finished fields
      chunker,
      visualisers: chunker.visualisers,
      collapse: collapseController,
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
  COLLAPSE: (state, codeblockname) => {
    const result = state.collapse;
    result[codeblockname] = !result[codeblockname];
    return {
      ...state,
      collapse: result,
    };
  },
};

export function dispatcher(state, setState) {
  return (action, params, nodes, target) => {
    setState(action(state, params, nodes, target));
  };
}

export function initialState() {
  return GlobalActions.LOAD_ALGORITHM(undefined, { name: DEFAULT_ALGORITHM, nodes: [] });
}
