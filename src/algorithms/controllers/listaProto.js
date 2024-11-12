import { msort_lista_td } from '../explanations';
import LinkedListTracer from '../../components/DataStructures/LinkedList/LinkedListTracer';
import {
    areExpanded,
} from './collapseChunkPlugin';

const run = run_msort();

export default {
    explanation: msort_lista_td,
    initVisualisers,
    run
};

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
            let List = [...nodes], listA, listB;
        // ----------------------------------------------------------------------------------------------------------------------------
        // Define helper functions
        // ----------------------------------------------------------------------------------------------------------------------------

        // ----------------------------------------------------------------------------------------------------------------------------
        // Define quicksort functions
        // ----------------------------------------------------------------------------------------------------------------------------
        function MergeSort(L, R, end, depth) {

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
                L = MergeSort(L, Mid, newR, depth + 1);

                chunker.add('7', (vis, Lists, cur_L, cur_R) => {
                    vis.llist.assignVariable('L', cur_L);
                    vis.llist.assignVariable('R', cur_R);
                },[linkedList, newR, R], depth);
                R = MergeSort(newR, R, end, depth + 1);
            }

            merge(L,R, end, depth);

            return L;
        }

        function merge(L,R,end,depth) {
            if (L === R) {return}

            // Set up variables
            let prev, next, nodeA, nodeB;
            let A = 0, B = 0, iterations = 0, Ashift = 0, Bshift = 0;
            let firstNode = true, M;
            chunker.add('8', (vis, Lists, cur_L, cur_R, depth) => {
                listA = vis.llist.findListbyNode(L);
                listB = vis.llist.findListbyNode(R);
                vis.llist.assignVariable('L', cur_L);
                vis.llist.assignVariable('R', cur_R);
                vis.llist.deselect(0, Lists.length-1);
                },[linkedList, L, R], depth);

            // Lines two lists vertically
            chunker.add('10', (vis) => {
                vis.llist.moveList(listB.listIndex, listB.layerIndex, listA.listIndex, "stack");
            },);

            // Find first Node
            chunker.add('11', (vis) => {
                vis.llist.select(L);
                vis.llist.select(R);
            },);
            chunker.add('12', (vis) => {
                let nodeA = vis.llist.findNode(L), nodeB = vis.llist.findNode(R);
                if (nodeA.value < nodeB.value) {
                    vis.llist.patch(L);
                    vis.llist.deselect(R);
                    vis.llist.clearVariables();
                    vis.llist.assignVariable('M', L);
                    A++;
                    prev = 'up';
                    M = L;
                }
                else {
                    vis.llist.patch(R);
                    vis.llist.deselect(L);
                    vis.llist.clearVariables();
                    vis.llist.assignVariable('M', R);
                    B++;
                    prev = 'down';
                    M = R;
                }
            },);

            // Change pointer iteratively
            while (iterations < end-L-1) {
                // Iteration tracker to prevent infinite loop
                iterations++;

                // Select possible next nodes
                chunker.add('14', (vis) => {
                    // detect if end of list
                    nodeA = A < R-L ? vis.llist.findNode(L + A): null;
                    nodeB = B < end-R ? vis.llist.findNode(R + B): null;

                    vis.llist.select(nodeA ? L+A : null);
                    vis.llist.select(nodeB ? R+B: null);
                },);

                // Find next node
                chunker.add('15', (vis, Lists) => {
                    let newM;

                    if (!nodeA) {
                        vis.llist.patch(R+B);
                        newM = R+B;
                        B = (B < end-R) ? B + 1 : null;
                        next = 'down';
                    }
                    else if (!nodeB) {
                        vis.llist.patch(L+A);
                        newM = L+A;
                        A = (A < R-L) ? A + 1 : null;
                        next = 'up';
                    }
                    else if (nodeA.value < nodeB.value) {
                        vis.llist.patch(L+A);
                        newM = L+A;
                        A = (A < R-L) ? A + 1 : null;
                        next = 'up';
                    }
                    else {
                        vis.llist.patch(R+B);
                        newM = R+B;
                        B = (B < end-R) ? B + 1 : null;
                        next = 'down';
                    }
                    vis.llist.setArrow(M,arrowDirection(A+Ashift,B+Bshift,prev, next, true));

                    vis.llist.deselect(0, Lists.length-1);
                    M = newM;
                },[linkedList]);

                // Shift list across if necessary
                chunker.add('15', (vis) => {
                    if (A-B>1) {
                        vis.llist.addNull(R+B,-1);
                        Bshift++;
                    }
                    else if (B-A>1) {
                        vis.llist.addNull(L+A,-1);
                        Ashift++;
                    }
                },);

                // Set next M
                chunker.add('15', (vis) => {
                    prev = next;
                    vis.llist.assignVariable('M', M);
                },);

            }

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

        // Calculates angle of next arrow
        function arrowDirection(A,B,prev, next) {
            if (prev === next) {
                return 0;
            }
            else if (A===B) {
                if (prev === 'up') {
                    return 90;
                }
                return -90;
            }
            else if (prev === 'up'){
                return 45;
            }
            return -45;
        }

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

        const msresult = MergeSort(0, nodes.length - 1, nodes.length-1,0);
        // const msresult = 0;

        return msresult;
    }
}

