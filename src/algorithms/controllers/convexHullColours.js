// Old color scheme uses colors (moving away from this),
// new uses ALGO_COLOR_PALLETE
import {colors, ALGO_COLOR_PALLETE} from '../../components/DataStructures/colors';

// Colors for array (..._A), graph nodes (..._N), graph edges (..._E)
// for convex hull algorithms
// See also graphSearchColours.js
export const colorsCH = {
    // HULL_A: colors.leaf,
    HULLP_N: 1, // Green
    HULL_E: 1,
    // FRONTIER_A: '0',  // Blue
    // FRONTIER_A: colors.sky,
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
    // graham scan
    TODELETE_A: colors.apple,
    GSANTICLOCK_E: 4,
    GSCLOCKWISE_E: 3,
  }

// New colour scheme
// import {ALGO_COLOR_PALLETE} from '../../components/DataStructures/colors';

// Colors for array (..._A), graph nodes (..._N), graph edges (..._E)
// for convex hull algorithms
// See also graphSearchColours.js
export const CHColors = {
    // HULL_A: colors.leaf,
    HULLP_N: ALGO_COLOR_PALLETE.leaf,
    HULL_E: ALGO_COLOR_PALLETE.leaf,
    NEXTQ_N: ALGO_COLOR_PALLETE.sky,
    AKL_N: ALGO_COLOR_PALLETE.sky,
    GWRAPI_N: ALGO_COLOR_PALLETE.peach,  // Orange/peach?
    AKLK_N: ALGO_COLOR_PALLETE.peach,
    AKLDEL_N: ALGO_COLOR_PALLETE.apple, // Want apple/something different
    ANTICLOCK_E: ALGO_COLOR_PALLETE.sky,
    CLOCKWISE_E: ALGO_COLOR_PALLETE.apple,  // Blue
    AKL_E: ALGO_COLOR_PALLETE.sky,
    // divide and conquer algorithm - might want to try to make things
    // more consistent at some point XXX
    DCHULL_N: ALGO_COLOR_PALLETE.leaf,
    DCRIGHT_N: ALGO_COLOR_PALLETE.sky,
    DCLEFT_N: ALGO_COLOR_PALLETE.peach,
    DCANTICLOCK_E: ALGO_COLOR_PALLETE.leaf, // for divide and conquer alg
    DCCLOCKWISE_E: ALGO_COLOR_PALLETE.apple,
    DCCOLINEAR_E: ALGO_COLOR_PALLETE.apple,
    DCTANGENT_E: ALGO_COLOR_PALLETE.sky,
    // graham scan
    TODELETE_A: ALGO_COLOR_PALLETE.apple,
    GSANTICLOCK_E: ALGO_COLOR_PALLETE.sky,
    GSCLOCKWISE_E: ALGO_COLOR_PALLETE.apple,
  }

