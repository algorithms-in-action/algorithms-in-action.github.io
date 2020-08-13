/* eslint-disable max-len */
import algorithms from '../algorithms';

const DEFAULT_ALGORITHM = 'binaryTreeInsertion';

// At any time the app may call dispatch(action, params), which will trigger one of
// the following functions. Each comment shows the expected properties in the
// params argument.
export const GlobalActions = {

  LOAD_ALGORITHM: (state, params, nodes, target) => {
    const data = algorithms[params.name];
    const {
      param, controller, name, explanation,
    } = data;
    const { pseudocode, graph } = controller;

    // This line just picks an arbitrary procedure from the pseudocode to show
    // It will need to be changed when we properly support multiple procedures
    // (e.g. insert and search)
    const procedurePseudocode = pseudocode[Object.keys(pseudocode)[0]];
    const algorithmGenerator = controller.run();

    // instantiate a graph object
    controller.init(nodes, target);

    return {
      id: params.name,
      name,
      explanation,
      param,
      pseudocode: procedurePseudocode,
      generator: algorithmGenerator,
      bookmark: algorithmGenerator.next().value, // Run it until the first yield
      graph,
      finished: false,
    };
  },
  // No expected params
  NEXT_LINE: (state) => {
    if (state.finished) {
      return state;
    }
    const result = state.generator.next();
    return {
      ...state,
      // If we just finished the algorithm, leave the bookmark on the last line
      bookmark: result.done ? state.bookmark : result.value,
      finished: result.done,
    };
  },
};

export function dispatcher(state, setState) {
  return (action, params, nodes, target) => {
    setState(action(state, params, nodes, target));
  };
}

export function initialState() {
  return GlobalActions.LOAD_ALGORITHM(undefined, { name: DEFAULT_ALGORITHM }, [0], undefined);
}
