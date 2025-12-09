// Colours for BST variants (BST, BSTrec, AVL)
// Moving to new color scheme
// (XXX may be leftovers from older scheme)
// We use the color names directly rather than the trivial mapping here:
// import {ALGO_COLOR_PALLETE} from '../../components/DataStructures/colors';

export const BSTColors = {
    // P_N: ALGO_COLOR_PALLETE.peach, // newly inserted node
    P_N: "var(--peach)", // newly inserted node
    NEW_N: "var(--leaf)", // newly inserted node
    ROT_E: "var(--apple)", // rotated edge (AVL)
    ROT_N: "var(--apple)", // rotated nodes (AVL)
}
