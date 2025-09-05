/*
    Central repo for error messages
    generated in the parameter pane.

    It should also contain example strings
    that are referenced. This is so the user
    does not have to go through the rigmarole
    of error after error to derive the expected
    input format.
*/

// Mark specific examples/errors with a prefix indicating the algorithm/algorithm group.
// Prefix general ones with GEN.

export const ERRORS = {
    GEN_EMPTY_INPUT                : "Input cannot be empty",
    GEN_ONLY_POSITIVE_NUMBERS_LIST : "Must be a comma-separated list of positive numbers only",
    GEN_ONLY_LOWERCASE             : "Only lowercase letters and spaces are allowed.",
    GEN_ONLY_POSITIVE_INTEGERS     : "Only positive integers are allowed.",
    GEN_MUST_HAVE_TREE_FIRST       : "Build a tree first by running some steps in insert mode.",
    GEN_MATRIX_NOT_SYMMETRIC       : "Matrix must be symmetric (m[i][j] = m[j][i]).",
    GEN_MATRIX_DIAGONAL_NOT_ZERO   : "Matrix diagonal entries must be zero.",
    GEN_EMPTY_TREE_ERROR           : "Please build a tree first.",
    GEN_POSITIVE_EDGE_WEIGHTS      : "Please enter positive edge weights (or 0 for no edge)",
    GEN_POSITIVE_INT               : "Please enter a positive integer",
    GEN_GRAPH_INVALID_COORDS       : "Coordinates input must follow the correct format",
    GEN_GRAPH_INVALID_EDGES        : "Edges input must follow the correct format",
    GEN_GRAPH_INVALID_ENDNODES     : "End nodes input must follow the correct format",
    GEN_PAIR_TRIPLES_POS_INT       : "Please enter a list containing positive integers, pairs or triples",
    GEN_RIGHT_NUMBER_INPUTS        : "Please enter the right amount of inputs",
    GEN_INVALID_RANGES             : "If you had entered ranges, please input valid ranges",
    GEN_LIST_INVALID_NUMBER        : "List must only contain valid integers",
    GEN_LIST_DUPLICATES            : "List must not contain duplicate values",
    GEN_TEXT_PAIR_FORMAT           : "Input must be comma-separated pairs (a-b)",
    GEN_NUMBER_NOT_IN_DOMAIN       : "Number entered is not in a valid domain."
};

export const EXAMPLES = {
    GEN_SYMMETRIC_MATRIX    : "TODO:",
    GEN_COORDS_EXAMPLE      : "Please follow example: 1-1,3-4,4-1,6-6 giving the X-Y coordinates for each of the nodes in the graph.",
    GEN_EDGES_EXAMPLE       : "Please follow example: 1-2,1-3,2-3,3-2-6,3-4-7 giving NodeA-NodeB-Weight for each in the graph; -Weight is optional and defaults to 1.",
    GEN_NUMBERS_BETWEEN_0_1 : "Please provide positive numbers: 0,1",
    GEN_LIST_PARAM          : "Please follow the example provided: 0,1,2,3,4",
    GEN_ENDNODES_EXAMPLE    : "Input a list of comma-separated node numbers, eg 1,2",
    HASHING_INSERT          : "TODO: Place holder example message",
    HASHING_TOO_LARGE       : "TODO: Add right amount of inputs whatever that is",

    UF_FIND                 : "Please follow the example provided: 2. The single digit should be between 1 and 10.",
    UF_UNION                : "Please follow the example provided: 5-7,8-5,9-8,3-9,5-2. All digits should be between 1 and 10, '-' should be used to separate the two digits, and ',' should be used to separate each union operation.",

    TTF_INSERTION           : "Duplicate-free list of non-negative integers please: 0,1,2,3,4",
};

