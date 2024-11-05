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

        const entire_num_array = nodes;
        let A = nodes;
        let B = [...entire_num_array].fill(undefined);

        // ----------------------------------------------------------------------------------------------------------------------------
        // Define helper functions
        // ----------------------------------------------------------------------------------------------------------------------------
        /**/
        function assignMaybeNullVar(vis, variable_name, index) {
            if (index === 'Null') {
                vis.array.assignVariable(variable_name, 2, undefined);
                vis.array.assignVariable(variable_name + '=Null', 2, 0);
            } else
                vis.array.assignVariable(variable_name, 2, index);
        }

        function assignVarToA(vis, variable_name, index) {
            if (index === undefined)
                vis.array.removeVariable(variable_name);
            else
                vis.array.assignVariable(variable_name, index);
        }

        // might not need this for linked list
        function assignVarToB(vis, variable_name, index) {
            if (index === undefined)
                vis.arrayB.removeVariable(variable_name);
            else
                vis.arrayB.assignVariable(variable_name, index);
        }

        // ----------------------------------------------------------------------------------------------------------------------------
        // Define quicksort functions
        // ----------------------------------------------------------------------------------------------------------------------------

        function renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2, c_stk) {
            if (isMergeExpanded()) {
                vis.array.set(a, 'msort_lista_td');
                // set_simple_stack(vis.array, c_stk);
                assignVarToA(vis, 'ap1', cur_ap1);
                assignVarToA(vis, 'max1', cur_max1);
                highlight(vis, cur_ap1, true);
                if (cur_ap2 < a.length) { // XXX 
                    assignVarToA(vis, 'ap2', cur_ap2);
                    highlight(vis, cur_ap2, true);
                } else {
                    assignVarToA(vis, 'ap2', undefined);
                }
                assignVarToA(vis, 'max2', cur_max2);
                vis.arrayB.set(b, 'msort_lista_td');
                assignVarToB(vis, 'bp', cur_bp);
                for (let i = cur_left; i < cur_bp; i++) {
                    highlightB(vis, i, false);
                }
            }
        }

        // calls vis.array.setList(c_stk) to display simple stack but only
        // if recursion is expanded (otherwise stack is never displayed)
        // XXX is this confusing if we run the algorithm a bit with
        // recursion expanded then collapse recursion? I guess if you are
        // doing that you have a pretty good understanding anyway?
        const set_simple_stack = (vis_list, c_stk) => {
            if (isRecursionExpanded())
                //vis_list.setList(c_stk);
                ;
        }

        function MergeSort(L, R, depth) {

            //// start mergesort --------------------------------------------------------

            // XXX defined function to display first couple of list elements
            simple_stack.unshift('([' + linkedList[L] + '..],' + R + ')');

            // should show animation if doing high level steps for whole array OR if code is expanded to do all recursive steps

            chunker.add('Main', (vis, lists, cur_L, cur_len, cur_depth, c_stk) => {
                vis.llist.clearSelect();
                vis.llist.clearVariables();
                vis.llist.assignVariable('L', cur_L);
                vis.llist.select(cur_L, cur_len);
            }, [linkedList, L, R, depth, simple_stack], depth);

            chunker.add('len>1', (vis, lists) => {
            }, [linkedList], depth);

            // Split if length more than 2.
            if (R - L > 1) {
                let Mid = L;

                chunker.add('Mid', (vis, lists, cur_L, cur_Mid, c_stk) => {
                    vis.llist.assignVariable('Mid', cur_Mid);
                }, [linkedList, L, Mid, simple_stack], depth);

                Mid = Math.floor((R+L) / 2);

                // split L into lists L and R at (after) mid-point
                let newR = Mid + 1;

                chunker.add('tail(Mid)<-Null', (vis, lists, cur_L, cur_Mid, cur_R, c_stk) => {
                    vis.llist.deselect(0, lists.length);
                    vis.llist.assignVariable('L', cur_L);
                    vis.llist.assignVariable('Mid', cur_Mid);
                    vis.llist.assignVariable('R', cur_R);
                    vis.llist.select(cur_L);
                    vis.llist.select(cur_R);
                }, [linkedList, L, Mid, newR, simple_stack], depth);

                chunker.add('preSortL', (vis, Lists, cur_L, cur_Mid, cur_R, c_stk) => {
                    vis.llist.assignVariable('L', cur_L);
                    vis.llist.deselect(cur_R);
                    vis.llist.splitList(cur_R);
                }, [linkedList, L, Mid, newR, simple_stack], depth);

                chunker.add('sortL', (vis, Lists) => {
                }, [linkedList], depth);

                L = MergeSort(L, Mid, depth + 1);


                chunker.add('sortR', (vis, Lists) => {
                }, [linkedList], depth);

                R = MergeSort(newR, R, depth + 1);

            }
            // Merge if length is 2 or less.
            console.log(L, R);
            merge(L,R);
            return L;
        }

        function merge(L,R, depth) {

            // Lines two lists vertically
            chunker.add('headhead', (vis, Lists, cur_L, cur_R, c_stk) => {
                let listA = vis.llist.findNode(cur_L);
                let listB = vis.llist.findNode(cur_R);
                vis.llist.assignVariable('L', cur_L);
                vis.llist.assignVariable('R', cur_R);
                vis.llist.patch(cur_L);
                vis.llist.patch(cur_R);
                vis.llist.splitList(cur_R);
                vis.llist.moveList(listA.listIndex, listA.layerIndex, listB.listIndex, "stack");
            }, [linkedList, L, R, simple_stack], depth);

            //
        }


        // ----------------------------------------------------------------------------------------------------------------------------
        // Perform actual mergesort
        // ----------------------------------------------------------------------------------------------------------------------------

        // XXXXXXXXX
        simple_stack = [];

        for (let i = 0; i < entire_num_array.length; i++) {
            linkedList.push(entire_num_array[i]);
        }

        chunker.add('Main', (vis, lists) => {
            vis.llist.addList(lists);
        }, [linkedList]);

        const msresult = MergeSort(0, entire_num_array.length - 1, 0);
        // const msresult = 0;

        return msresult;
    }
}

