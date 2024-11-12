// This comment is entirely for the
// amusement of the person who wrote
// it and should be ignored by anyone
// else. However, THE COMMENTS BELOW
// SHOULD BE READ BY ANYONE LOOKING
// AT THE CODE, PARTICULARLY IF IT IS
// TO BE MODIFIED!

// Animation of merge sort for lists (represented using array), top down.
// XXX PROTOTYPE for pointer version. Adapted from code for mergesort for
// arrays (may include some quicksort remnants also).
// XXX Needs major clean up of code to remove junk, refactor, etc before
// being used for anything else
// XXX Not all  steps are animated
// XXX should be more consistent with mergesort for arrays with colours
// etc
// XXX Colours are very limited - colour support is a mystery to me and
// there are major inconsistencies between colours specification for
// graph nodes/edges, 1D arrays and 2D arrays (there is a student group
// that will hopefully look into this and improve things)

import { msort_lista_td } from '../explanations';

const run = run_msort();

export default {
    explanation: msort_lista_td,
    initVisualisers,
    run
};


// XXX (was) Quicksort common code
// Example of a recursive algorithm that could serve as a guide to
// implementing others.  Some things to note:
// 1) A depth parameter is added to the recursive code and also passed
// to chunker.add()
// 2) Recursive calls are in code blocks that can be collapsed, so the
// whole recursive call can be done in a single step. To do this we must
// have chunks at the recursion level of the call at the start and end
// of the collapsed computation. Here the start chunk is a comment line.
// It does nothing but notes that the call on the next line is recursive.
// At the next step control goes back to the start of the function so
// an extra comment is not a bad thing to do for clarity in any case.
// The chunk after the recursive computation is at the line of code with
// the call, so the call is highlighted when it returns, as we would
// want.
// 3) The stack is visualised in the animation, to help understanding of
// the algorithm overall and also where we are in the recursion.
// 4) There is chunk at the end of the whole computation that cleans up
// the final display a bit.

// There may be remnants of code from a previous version that didn't
// encapsulate the recursive calls properly

// import linked list tracer
import LinkedListTracer from '../../components/DataStructures/LinkedList/LinkedListTracer';

import {
    areExpanded,
} from './collapseChunkPlugin';

/////////////////////////////////////////////////////

// arrayB exists and is displayed only if MergeCopy is expanded
function isMergeCopyExpanded() {
    return areExpanded(['MergeCopy']);
}

// We don't strictly need isMergeExpanded: only needed if last chunk of
// merge still had extra vars displayed.  Some code still needs
// isMergeCopyExpanded because it uses arrayB
function isMergeExpanded() {
    return areExpanded(['MergeCopy', 'Merge']); // MergeCopy contains Merge
}

// checks if either recursive call is expanded (otherwise stack is not
// displayed)
function isRecursionExpanded() {
    return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

// see stackFrameColour in index.js to find corresponding function mapping to css
const STACK_FRAME_COLOR = {
    No_color: 0,
    In_progress_stackFrame: 1,
    Current_stackFrame: 2,
    Finished_stackFrame: 3,
    I_color: 4,
    J_color: 5,
    P_color: 6, // pivot
};

let linkedList = [];
let index;
let tail;
let simple_stack;


// ----------------------------------------------------------------------------------------------------------------------------

// Define helper functions
// without javascript Closure arguements (IE 'global variables')
// ----------------------------------------------------------------------------------------------------------------------------

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

export function update_vis_with_stack_frame(a, stack_frame, stateVal) {
    let left, right, depth;
    [left, right, depth] = stack_frame;

    for (let i = left; i <= right; i += 1) {
        // each element in the vis stack is a tuple:
        // 0th index is for base color,
        // 1th index is for pivot, i, j colors
        a[depth][i] = { base: stateVal, extra: [] };
    }
    let mid = Math.floor((left + right) / 2);
    // a[depth][mid] = { base: STACK_FRAME_COLOR.P_color, extra: [] };
    a[depth][mid] = { base: STACK_FRAME_COLOR.Current_stackFrame, extra: [] };
    return a;
}

const highlight = (vis, index, isPrimaryColor = true) => {
    if (isPrimaryColor) {
        vis.array.select(index);
    } else {
        vis.array.patch(index);
    }
};

const highlightB = (vis, index, isPrimaryColor = true) => {
    if (isPrimaryColor) {
        vis.arrayB.select(index);
    } else {
        vis.arrayB.patch(index);
    }
};

const unhighlight = (vis, index, isPrimaryColor = true) => {
    if (isPrimaryColor) {
        vis.array.deselect(index);
    } else {
        vis.array.depatch(index);
    }
};

const unhighlightB = (vis, index, isPrimaryColor = true) => {
    if (isPrimaryColor) {
        vis.arrayB.deselect(index);
    } else {
        vis.arrayB.depatch(index);
    }
};


// ----------------------------------------------------------------------------------------------------------------------------

export function initVisualisers() {
    return {
        llist: {
            instance: new LinkedListTracer('LList', null,
                'Linked list prototype', { arrayItemMagnitudes: true }),
            order: 0,
        },
    }
}

/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */
export function run_msort() {

    return function run(chunker, { nodes }) {
        // can't rename from nodes

        // ----------------------------------------------------------------------------------------------------------------------------
        // Define 'global' variables
        // ----------------------------------------------------------------------------------------------------------------------------
            let ListA, listB;
        // ----------------------------------------------------------------------------------------------------------------------------
        // Define helper functions
        // ----------------------------------------------------------------------------------------------------------------------------

        // ----------------------------------------------------------------------------------------------------------------------------
        // Define quicksort functions
        // ----------------------------------------------------------------------------------------------------------------------------
        function MergeSort(L, R, depth) {

            //// start mergesort --------------------------------------------------------

            // should show animation if doing high level steps for whole array OR if code is expanded to do all recursive steps

            chunker.add('1', (vis, lists, cur_L, cur_len) => {
                vis.llist.clearSelect();
                vis.llist.clearVariables();
                vis.llist.assignVariable('L', cur_L);
                vis.llist.select(cur_L, cur_len);
            }, [linkedList, L, R, depth]);

            // Split if length at least 2.
            if (R - L) {
                let Mid = L;

                chunker.add('2', (vis, lists, cur_L, cur_Mid) => {
                    vis.llist.assignVariable('Mid', cur_Mid);
                }, [linkedList, L, Mid], depth);

                Mid = Math.floor((R+L) / 2);

                // split L into lists L and R at (after) mid-point
                let newR = Mid + 1;

                chunker.add('3', (vis, lists, cur_L, cur_Mid, cur_R, c_stk) => {
                    vis.llist.deselect(0, lists.length-1);
                    vis.llist.assignVariable('L', cur_L);
                    vis.llist.assignVariable('Mid', cur_Mid);
                    vis.llist.assignVariable('R', cur_R);
                    vis.llist.select(cur_L);
                    vis.llist.select(cur_R);
                }, [linkedList, L, Mid, newR, simple_stack], depth);

                chunker.add('4', (vis, Lists, cur_L, cur_Mid, cur_R, c_stk) => {
                    vis.llist.splitList(cur_R);
                    vis.llist.removeVariable('Mid');
                }, [linkedList, L, Mid, newR, simple_stack], depth);

                chunker.add('6', (vis, Lists, cur_L, cur_R) => {
                    vis.llist.assignVariable('L', cur_L);
                },[linkedList, L, Mid], depth);
                L = MergeSort(L, Mid, depth + 1);

                chunker.add('7', (vis, Lists, cur_L, cur_R) => {
                    vis.llist.assignVariable('L', cur_L);
                    vis.llist.assignVariable('R', cur_R);
                },[linkedList, newR, R], depth);
                R = MergeSort(newR, R, depth + 1);
            }

            merge(L,R,depth);

            return L;
        }

        function merge(L,R, depth) {
            if (L === R) {return}

            // Set up variables
            let listA, listB, prev, next;
            let A = 0, B = 0, iterations = 0;
            chunker.add('8', (vis, Lists, cur_L, cur_R, depth) => {
                listA = vis.llist.findListbyNode(L);
                listB = vis.llist.findListbyNode(R);
                vis.llist.assignVariable('L', cur_L);
                vis.llist.assignVariable('R', cur_R);
                console.log(Lists.length-1);
                vis.llist.deselect(0, Lists.length-1);
                },[linkedList, L, R], depth);

            // Lines two lists vertically
            chunker.add('10', (vis) => {
                vis.llist.deselect(R);
                vis.llist.moveList(listB.listIndex, listB.layerIndex, listA.listIndex, "stack");
            },);

            // Change pointer iteratively
            chunker.add('12', (vis, Lists, cur_L, cur_R) => {

            while ((A < listA.size || B < listB.size) && iterations < 10) {
                // Iteration tracker to prevent infinite loop
                iterations++;

                // If at end of one list, iterate other list
                if (A >= listA.size) {
                    B = (B < listB.size) ? B + 1 : null;
                    return;
                } else if (B >= listB.size) {
                    A = (A < listA.size) ? A + 1 : null;
                    return;
                }

                // Otherwise, compare two
                chunker.add('13', (vis, Lists, cur_L, cur_R) => {
                    let nodeA = vis.llist.findNode(L + A), nodeB = vis.llist.findNode(R + B);

                    // First comparison: set arrow up or down based on values
                    if (prev === undefined) {
                        let startNode = nodeA.value < nodeB.value ? L + A : R + B;
                        prev = nodeA.value < nodeB.value ? 'up' : 'down';

                        chunker.add('14', (vis) => {
                            console.log(startNode);
                            vis.llist.select(startNode);
                        },);
                    }
                    // Subsequent comparison
                    else {
                        if (nodeA.value < nodeB.value) {
                            vis.llist.addNull(L + A);
                            vis.llist.setArrow(L + A, prev === 'down' ? 0 : 45);
                            prev = 'down';
                        } else {
                            vis.llist.addNull(R + B);
                            vis.llist.setArrow(R + B, prev === 'up' ? 0 : -45);
                            prev = 'up';
                        }
                    }

                    if (nodeA.value < nodeB.value) {
                        A < listA.size - 1 ? vis.llist.addNull(L + A) : null;
                        B = (B < listB.size) ? B + 1 : null;
                        chunker.add('15', (vis) => {
                        },);
                    } else {
                        B < listB.size - 1 ? vis.llist.addNull(R + B) : null;
                        A = (A < listA.size) ? A + 1 : null;
                        chunker.add('16', (vis) => {
                        },);
                    }
                }, [linkedList, L, R], depth);
                console.log(L + A, R + B);

                chunker.add('17', (vis) => {
                    vis.llist.clearVariables();
                },);
            }
            },);

            // remerge lists
                chunker.add('17', (vis, Lists, cur_L, cur_R, c_stk) => {
                    vis.llist.mergeLists(cur_L, cur_R);
                    vis.llist.clearNull();
                    vis.llist.resetArrows(cur_L);
                    vis.llist.sortList(cur_L);
                    vis.llist.clearVariables();
                    vis.llist.deselect(0, Lists.length-1);
                    vis.llist.depatch(0, Lists.length-1);
                }, [linkedList, L, R, simple_stack], depth);

        }

        function append() {}

        // ----------------------------------------------------------------------------------------------------------------------------
        // Perform actual mergesort
        // ----------------------------------------------------------------------------------------------------------------------------

        // XXXXXXXXX
        simple_stack = [];

        for (let i = 0; i < nodes.length; i++) {
            linkedList.push(nodes[i]);
        }

        chunker.add('Main', (vis, lists) => {
            vis.llist.addList(lists);
        }, [linkedList]);

        const msresult = MergeSort(0, nodes.length - 1, 0);
        // const msresult = 0;

        return msresult;
    }
}

