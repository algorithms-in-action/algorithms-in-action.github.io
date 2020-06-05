import algorithms from '../algorithms';
// import GraphTracer from '../components/Graph/GraphTracer';

const DEFAULT_ALGORITHM = 'binaryTreeSearch';
// const DEFAULT_ALGORITHM = 'binaryTreeInsertion';

// At any time the app may call dispatch(action, params), which will trigger one of
// the following functions. Each comment shows the expected properties in the
// params argument.
export const GlobalActions = {
  // { name: 'binaryTreeSearch'}
  LOAD_ALGORITHM: (state, params) => {
    const data = algorithms[params.name];
    const {
      pseudocode, name, explanation, graph,
    } = data;

    // This line just picks an arbitrary procedure from the pseudocode to show
    // It will need to be changed when we properly support multiple procedures
    // (e.g. insert and search)
    const procedurePseudocode = pseudocode[Object.keys(pseudocode)[0]];
    const algorithmGenerator = data.run();

    // instantiate a GraphTracer and set up a tree
    data.init();

    return {
      id: params.name,
      name,
      explanation,
      pseudocode: procedurePseudocode,
      generator: algorithmGenerator,
      bookmark: algorithmGenerator.next().value, // Run it until the first yield
      graph,
    };
  },
  // No expected params
  NEXT_LINE: (state) => {
    const { current, parent } = state.bookmark;

    // visualize on the tree: from the parent node, visit current node
    if (!(current === null && parent === null)) {
      state.graph.visit(current, parent);
    }

    return {
      ...state,
      bookmark: state.generator.next().value,
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
