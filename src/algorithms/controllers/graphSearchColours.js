import {colors as globalColors} from '../../components/DataStructures/colors';

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
// Moving towars something less crazy.  Arrays now accept integers (and
// strings) plus we import some global color names; not consistent for graphs
// yet.
export const colors = {
    // FRONTIER_A: '0',  // Blue
    FRONTIER_A: globalColors.sky,
    FRONTIER_N: 4,  // Blue
    FRONTIER_E: 4,  // Blue
    N_M_E: 3, // edge between n and m
    FINALISED_A: globalColors.leaf,
    FINALISED_N: 1, // Green
    FINALISED_E: 1,
    PQ_MIN_A: globalColors.peach,
    // if we find a path to end node:
    SUCCESS_A: globalColors.leaf,
    SUCCESS_E: 3,
  }
