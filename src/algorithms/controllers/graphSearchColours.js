// Colors for array (..._A), graph nodes (..._N), graph edges (..._E)
// for graph search/traversal algorithms (+ Prim's eventually)
//
// OMG, colors for array and graph require different types and are
// inconsistent!
// Array: '0'=Blue, '1'=Green
// Nodes: 1=Green, 4= Blue
// Edges: 1=Green, 2=Orange, 3=Red, 4=Blue
// XXX not sure how this interacts with color perception options -
// doesn't seem to work like this - should figure out how it's done if
// it's still supported
export const colors = {
    FRONTIER_A: '0',  // Blue
    FRONTIER_N: 4,  // Blue
    FRONTIER_E: 4,  // Blue
    N_M_E: 2, // edge between n and m
    FINALISED_A: '1', // Green
    FINALISED_N: 1, // Green
    FINALISED_E: 1,
    PQ_MIN_A: '1', // XXX poor color but setting colors is a mystery
    // if we find a path to end node:
    SUCCESS_A: '1', // Green
    SUCCESS_E: 3,
  }
