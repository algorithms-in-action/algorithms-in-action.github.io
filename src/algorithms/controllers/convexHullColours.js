import {colors as globalColors} from '../../components/DataStructures/colors';

// Colors for array (..._A), graph nodes (..._N), graph edges (..._E)
// for convex hull algorithms gwrap only for now, no array
// See also graphSearchColours.js
export const colorsCH = {
    // HULL_A: globalColors.leaf,
    HULLP_N: 1, // Green
    HULL_E: 1,
    // FRONTIER_A: '0',  // Blue
    // FRONTIER_A: globalColors.sky,
    NEXTQ_N: 4,  // Blue
    AKL_N: 4,
    GWRAPI_N: 2,  // Orange/peach?
    AKLK_N: 2,
    AKLDEL_N: 3, // Want apple/something different
    CLOCKWISE_E: 4,  // Blue
    AKL_E: 4,
    ANTICLOCK_E: 3, // anticlockwise edges, Red
    // PQ_MIN_A: globalColors.peach,
    // if we find a path to end node:
    // SUCCESS_A: globalColors.leaf,
    // SUCCESS_E: 3,
  }
