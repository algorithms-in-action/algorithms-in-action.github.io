// Colors for array (..._A), graph nodes (..._N), graph edges (..._E)
// for graph search/traversal algorithms (+ Prim's eventually)
//
// OMG, colors for array and graph require different types and are
// inconsistent!
// XXX not sure how this interracts with color perception options -
// doesn't seem to work like this - should figure out how it's done if
// it's still supported
export const colors = {
    FRONTIER_A: '0',  // Blue
    FRONTIER_N: 4,  // Blue
    FRONTIER_E: 4,  // Blue
    N_M_E: 3, // Red - edge between n and m
    FINALISED_A: '1', // Green
    FINALISED_N: 1, // Green
    FINALISED_E: 2, // Orange
    PQ_MIN_A: '1', // XXX poor color but setting colors is a mystery
    // if we find a path to end node:
    SUCCESS_A: '1', // Green
    SUCCESS_E: 1, // Green
  }
