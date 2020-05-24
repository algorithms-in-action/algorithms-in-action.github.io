import algorithms from '../algorithms';

// Types of action that can occur, and an example of their use
export const GlobalActions = {
  // {type: types.LOAD_ALGORITHM, name: 'binaryTreeSearch'}
  LOAD_ALGORITHM: 'LOAD_ALGORITHM',
};

const reducer = (state, action) => {
  switch (action.type) {
    case GlobalActions.LOAD_ALGORITHM:
      const data = algorithms[action.name];
      return {
        name: data.name,
        explanation: data.explanation,
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
