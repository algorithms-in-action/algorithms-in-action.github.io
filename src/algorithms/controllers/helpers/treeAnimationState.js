const states = new WeakMap();

export function resetTreeAnimationState(graph) {
  const state = {
    newNode: undefined,
    rotNodes: [],
    rotEdges: [],
    popAfterReturnFlag: false,
  };
  states.set(graph, state);
  return state;
}

export function getTreeAnimationState(graph) {
  return states.get(graph) || resetTreeAnimationState(graph);
}
