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
    ANTICLOCK_E: 3, // anticlockwise edges, Red
    CLOCKWISE_E: 4,  // Blue
    AKL_E: 4,
    // divide and conquer algorithm - might want to try to make things
    // more consistent at some point XXX
    DCHULL_N: 1,
    DCRIGHT_N: 4,
    DCLEFT_N: 2,
    DCANTICLOCK_E: 1, // for divide and conquer alg
    DCCLOCKWISE_E: 3,
    DCCOLINEAR_E: 3,
    DCTANGENT_E: 4,
  }
