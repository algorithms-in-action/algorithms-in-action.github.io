// Merge sort for arrays, top down
// XXX Migrating code from Quicksort...

import { msort_arr_td } from '../explanations';

const is_qs_median_of_3 = false;
const run = run_msort(is_qs_median_of_3);

export default {
    explanation: msort_arr_td,
    initVisualisers, 
    run
};


// Quicksort common code
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

// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  isMergeExpanded,
  isMergeCopyExpanded,
  isRecursionExpanded,
} from './msort_arr_tdCollapseChunkPlugin';

// visualisation variable strings
// For now we use a special case for i&j running off the left of the
// array since we can't easily render them in the right place
const VIS_VARIABLE_STRINGS = {
  i_left_index: 'i',
  j_right_index: 'j',
  i_eq_0: 'i==0',
  j_eq_0: 'j==0',
  pivot: 'pivot',
};

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


/* 

(loc is line of code)
bookmarks are loc identifiers into a REAL file
REAL files are the pseudocode files
(search \\B and find quicksort)
keep up to date with this file

MEDIAN3_      if loc is only in median of 3 quicksort
SHARED_       if shared loc between MEDIAN3 and RIGHT_PIVOT
RIGHT_P_      if an loc is only in the right pivot quicksort

*/



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
  let left, right,  depth;
  [left, right,  depth] = stack_frame;

  for (let i = left; i <= right; i += 1) {
    // each element in the vis stack is a tuple:
    // 0th index is for base color,
    // 1th index is for pivot, i, j colors
    a[depth][i] = { base: stateVal, extra: [] };
  }
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


// Nice to hide array B entirely if things are collapsed
export function initVisualisers() {
  if (isMergeCopyExpanded()) {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array A', {
          arrayItemMagnitudes: true,
        }),
        order: 0,
      },
      arrayB: {
        instance: new ArrayTracer('arrayB', null, 'Array B', {
          arrayItemMagnitudes: true,
        }),
        order: 0,
      },
    }
  } else {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array A', {
          arrayItemMagnitudes: true,
        }),
        order: 0,
      },
    }
  }
}

/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_msort(is_qs_median_of_3) {

  return function run(chunker, { nodes }) {
    // can't rename from nodes

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define 'global' variables
    // ----------------------------------------------------------------------------------------------------------------------------

    const entire_num_array = nodes;
    let A = nodes;
    let B = [...entire_num_array].fill(undefined);
    let max_depth_index = -1; // indexes into 2D array, starts at zero
    const finished_stack_frames = []; // [ [left, right,  depth], ...]  (although depth could be implicit this is easier)
    const real_stack = []; // [ [left, right,  depth], ...]

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define helper functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function derive_stack(cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) {
      // return 2D array stack_vis containing color values corresponding to stack frame states and indexes in those stack frames
      // for visualise this data
      
      let stack_vis = [];

      for (let i = 0; i < max_depth_index + 1; i++) {
        // for whatever reason fill() does not work here... JavaScript
        stack_vis.push(
          [...Array.from({ length: entire_num_array.length })].map(() => ({
            base: STACK_FRAME_COLOR.No_color,
            extra: [],
          })),
        );
      }

      cur_finished_stack_frames.forEach((stack_frame) => {
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          stack_frame,
          STACK_FRAME_COLOR.Finished_stackFrame,
        );
      });

      cur_real_stack.forEach((stack_frame) => {
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          stack_frame,
          STACK_FRAME_COLOR.In_progress_stackFrame,
        );
      });

      if (cur_real_stack.length !== 0) {
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          cur_real_stack[cur_real_stack.length - 1],
          STACK_FRAME_COLOR.Current_stackFrame,
        );
      }

      if (cur_depth === undefined) {
        // return stack_vis;
        return []; // clobber stack display for now
      }

      if (cur_pivot_index !== undefined) {
        stack_vis[cur_depth][cur_pivot_index].extra.push(STACK_FRAME_COLOR.P_color);
      }

      // if (!isMergeCopyExpanded()) { return stack_vis; }
      // clobber stack display for now
      if (!isMergeCopyExpanded()) { return []; }

      if (cur_i !== undefined) {
        stack_vis[cur_depth][cur_i].extra.push(STACK_FRAME_COLOR.I_color);
      }

      if (cur_j !== undefined) {
        stack_vis[cur_depth][cur_j].extra.push(STACK_FRAME_COLOR.J_color);
      }

      // return stack_vis;
      return []; // clobber stack display for now
    }

    const refresh_stack = (vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {

      // XXX
      // We can't render the -1 index in the array
      // For now we display i==0/j==0 at left of array if appropriate
      let cur_i_too_low;
      let cur_j_too_low;
      if (cur_i === -1) {
        cur_i = undefined;
        cur_i_too_low = 0;
      } else {
        cur_i_too_low = undefined;
      }
      if (cur_j === -1) {
        cur_j = undefined;
        cur_j_too_low = 0;
      } else {
        cur_j_too_low = undefined;
      }

      assert(vis.array);
      assert(cur_real_stack && cur_finished_stack_frames);

      if (!isMergeCopyExpanded()) {
        // j should not show up in vis if partition is collapsed
        cur_j = undefined;
        cur_j_too_low = undefined;
      }

      if (!isMergeCopyExpanded() && !isRecursionExpanded()) {
        // i should not show up in vis if partition + recursion is collapsed
        cur_i = undefined;
        cur_i_too_low = undefined;
      }

      vis.array.setStackDepth(cur_real_stack.length);
      vis.array.setStack(
        derive_stack(cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth)
      );

      assignVarToA(vis, VIS_VARIABLE_STRINGS.i_left_index, cur_i);
      assignVarToA(vis, VIS_VARIABLE_STRINGS.i_eq_0, cur_i_too_low);
      assignVarToA(vis, VIS_VARIABLE_STRINGS.pivot, cur_pivot_index);
      assignVarToA(vis, VIS_VARIABLE_STRINGS.j_right_index, cur_j);
      assignVarToA(vis, VIS_VARIABLE_STRINGS.j_eq_0, cur_j_too_low);
    };


    function assignVarToA(vis, variable_name, index) {
      if (index === undefined)
        vis.array.removeVariable(variable_name);
      else
        vis.array.assignVariable(variable_name, index);
    }

    function assignVarToB(vis, variable_name, index) {
      if (index === undefined)
        vis.arrayB.removeVariable(variable_name);
      else
        vis.arrayB.assignVariable(variable_name, index);
    }

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define quicksort functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2) { 
      if (isMergeExpanded()) {
        vis.array.set(a, 'msort_arr_td');
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
        vis.arrayB.set(b, 'msort_arr_td');
        assignVarToB(vis, 'bp', cur_bp);
        for (let i=0; i < cur_bp; i++) {
          highlightB(vis, i, false);
        }
      }
    }

    function MergeSort(left, right, depth) { 


      //// start mergesort -------------------------------------------------------- 
// XXXXX

      real_stack.push([left, right, depth]);
      max_depth_index = Math.max(max_depth_index, depth);

      let pivot;

      // should show animation if doing high level steps for whole array OR if code is expanded to do all reccursive steps

      chunker.add('Main', (vis, a, b, cur_left, cur_right, cur_depth) => {
        vis.array.set(a, 'msort_arr_td');
        if (cur_depth === 0) {
          vis.array.setLargestValue(maxValue);
          vis.array.setStack([]); // used for a custom stack visualisation
          if (isMergeCopyExpanded()) {
            vis.arrayB.set(b, 'msort_arr_td');
            vis.arrayB.setLargestValue(maxValue);
           }
         }
        assignVarToA(vis, 'left', cur_left);
        assignVarToA(vis, 'right', cur_right);
        for (let i = cur_left; i <= cur_right; i++) {
          highlight(vis, i, true)
        }
        }, [A, B, left, right, depth], depth);

      chunker.add('left<right', (vis, a, cur_left, cur_right) => {
          // assignVarToA(vis, 'left', undefined);
          // assignVarToA(vis, 'right', undefined);
          for (let i = cur_left; i <= cur_right; i++) {
            // unhighlight(vis, i, true)
          }
        }, [A, left, right], depth);

      if (left < right) {
        let mid = Math.floor((left + right)/2);
        chunker.add('mid', (vis, a, cur_left, cur_mid, cur_right) => {
          for (let i = cur_mid+1; i <= cur_right; i++) {
            unhighlight(vis, i, true)
          }
          assignVarToA(vis, 'mid', cur_mid);
          }, [A, left, mid, right], depth);

        // dummy chunk for before recursive call - we need this so there
        // is a chunk at this recursion level as the first chunk in the
        // collapsed code for the recursive call
        chunker.add('preSortL', (vis, a, cur_left, cur_mid, cur_right) => {
          assignVarToA(vis, 'left', undefined);
          assignVarToA(vis, 'right', undefined);
          assignVarToA(vis, 'mid', undefined);
          for (let i = cur_mid+1; i <= right; i++) {
            // highlight(vis, i, true)
          }
          }, [A, left, mid, right], depth);

        MergeSort(left, mid, depth + 1);

        // chunk after recursive call - it's good to highlight the
        // recursive call once it has returned plus we need a chunk at
        // this level when the recursive code is collapsed
        chunker.add('sortL', (vis, a, cur_left, cur_mid, cur_right) => {
          vis.array.set(a, 'msort_arr_td');
          assignVarToA(vis, 'left', cur_left);
          assignVarToA(vis, 'mid', cur_mid);
          assignVarToA(vis, 'right', cur_right);
          for (let i = cur_left; i <= cur_mid; i++) {
            // unhighlight(vis, i, true);
            highlight(vis, i, false)
          }
          for (let i = cur_mid+1; i <= cur_right; i++) {
            highlight(vis, i, true);
          }
          }, [A, left, mid, right], depth);

        // dummy chunk before recursive call, as above
        chunker.add('preSortR', (vis, a, cur_left, cur_mid, cur_right) => {
          // vis.array.set(a, 'msort_arr_td');
          for (let i = cur_left; i <= cur_mid; i++) {
            unhighlight(vis, i, false);
          }
          assignVarToA(vis, 'left', undefined);
          assignVarToA(vis, 'mid', undefined);
          assignVarToA(vis, 'right', undefined);
          for (let i = cur_mid+1; i <= cur_right; i++) {
            // highlight(vis, i, true)
          }
          }, [A, left, mid, right], depth);

        MergeSort(mid+1, right, depth + 1);

        // chunk after recursive call
        chunker.add('sortR', (vis, a, cur_left, cur_mid, cur_right) => {
          assignVarToA(vis, 'left', cur_left);
          assignVarToA(vis, 'mid', cur_mid);
          assignVarToA(vis, 'right', cur_right);
          // for (let i = cur_mid+1; i <= cur_right; i++) {
            // unhighlight(vis, i, true);
            // unhighlight(vis, i, false)
          // }
          }, [A, left, mid, right], depth);

        // XXX should we shorten psuedocode? eg, (ap1,max1) <- (left,mid)
        let ap1 = left;
        let max1 = mid;
        let ap2 = mid+1;
        let max2 = right;
        let bp = left;

        chunker.add('ap1', (vis, a, cur_left, cur_mid, cur_right) => {
          for (let i = cur_mid+1; i <= cur_right; i++) {
            unhighlight(vis, i, false)
          }
          if (isMergeExpanded()) {
            assignVarToA(vis, 'left', undefined);
            assignVarToA(vis, 'ap1', cur_left);
            highlight(vis, cur_left, true);
          }
          }, [A, left, mid, right], depth);
        chunker.add('max1', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'mid', undefined);
            assignVarToA(vis, 'max1', cur_mid);
          }
          }, [A, left, mid, right], depth);
        chunker.add('ap2', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap2', cur_mid+1);
            highlight(vis, cur_mid+1, true);
          }
          }, [A, left, mid, right], depth);
        chunker.add('max2', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'right', undefined);
            assignVarToA(vis, 'max2', right);
          }
          }, [A, left, mid, right], depth);
        chunker.add('bp', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToB(vis, 'bp', left);
          }
          }, [A, left, mid, right], depth);

        // while (ap1 <= max1 && ap2 <= max2) {
        /* eslint-disable no-constant-condition */
        while (true) {
          chunker.add('MergeWhile', (vis, a, b, cur_ap1, cur_ap2,
cur_bp, cur_max1, cur_max2) => {
            renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2);
            }, [A, B, ap1, ap2, bp, max1, max2], depth);

         if (!(ap1 <= max1 && ap2 <= max2)) break;

           chunker.add('findSmaller', (vis, a, b, cur_ap1, cur_ap2,
cur_bp, cur_max1, cur_max2) => {
             renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2);
             }, [A, B, ap1, ap2, bp, max1, max2], depth);

           if (A[ap1] < A[ap2]) {
             B[bp] = A[ap1];
             A[ap1] = undefined;
             chunker.add('copyap1', (vis, a, b, cur_ap1, cur_ap2,
cur_bp, cur_max1, cur_max2) => {
               renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2);
               if (isMergeExpanded()) {
                 highlightB(vis, cur_bp, false);
               }
               }, [A, B, ap1, ap2, bp, max1, max2], depth);
             ap1 = ap1+1;
             chunker.add('ap1++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2) => {
               renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2);
               if (isMergeExpanded()) {
                 highlightB(vis, cur_bp, false);
               }
               }, [A, B, ap1, ap2, bp, max1, max2], depth);
             bp = bp+1;
             chunker.add('bp++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2) => {
               renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2);
               }, [A, B, ap1, ap2, bp, max1, max2], depth);
           } else {
             B[bp] = A[ap2];
             A[ap2] = undefined;
             chunker.add('copyap2', (vis, a, b, cur_ap1, cur_ap2,
cur_bp, cur_max1, cur_max2) => {
               renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2);
               if (isMergeExpanded()) {
                 highlightB(vis, cur_bp, false);
               }
               }, [A, B, ap1, ap2, bp, max1, max2], depth);
             ap2 = ap2+1;
             chunker.add('ap2++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2) => {
               renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2);
               if (isMergeExpanded()) {
                 highlightB(vis, cur_bp, false);
               }
               }, [A, B, ap1, ap2, bp, max1, max2], depth);
             bp = bp+1;
             chunker.add('bp++_2', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2) => {
               renderInMerge(vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2);
               }, [A, B, ap1, ap2, bp, max1, max2], depth);
           }
         }

         for (let i = ap1; i <= max1; i++) {
           B[bp] = A[i];
           A[i] = undefined;
           bp = bp+1;
         }

         chunker.add('CopyRest1', (vis, a, b, cur_left, cur_ap1,
cur_ap2, cur_max1, cur_max2, cur_bp) => {
          if (isMergeExpanded()) {
            vis.array.set(a, 'msort_arr_td');
            // unhighlight(vis, cur_ap1, true);
            // assignVarToA(vis, 'ap1', undefined);
            // assignVarToA(vis, 'max1', undefined);
            if (cur_ap2 < a.length)
              assignVarToA(vis, 'ap2', cur_ap2);
            assignVarToA(vis, 'max2', cur_max2);
            vis.arrayB.set(b, 'msort_arr_td');
            for (let i = cur_left; i <= cur_bp-1; i++) {
              highlightB(vis, i, false);
            }
            if (cur_bp < a.length) {
              assignVarToB(vis, 'bp', cur_bp);
            } else {
              assignVarToB(vis, 'bp', undefined);  // XXX anination unclear?
            }
          }
          }, [A, B, left, ap1, ap2, max1, max2, bp], depth);

         for (let i = ap2; i <= max2; i++) {
           B[bp] = A[i];
           A[i] = undefined;
           bp = bp+1;
         }

         chunker.add('CopyRest2', (vis, a, b, cur_left, cur_right, cur_ap2,
cur_max2, cur_bp) => {
          if (isMergeCopyExpanded()) {
            vis.array.set(a, 'msort_arr_td');
            vis.arrayB.set(b, 'msort_arr_td');
            for (let i = cur_left; i <= cur_right; i++) {
              highlightB(vis, i, false);
            }
          }
          if (isMergeExpanded()) {
            if (cur_ap2 < a.length) {
              unhighlight(vis, cur_ap2, true);
              assignVarToA(vis, 'ap2', undefined);
            }
            assignVarToA(vis, 'max2', undefined);
            assignVarToB(vis, 'bp', undefined);
          }
          }, [A, B, left, right, ap2, max2, bp], depth);

        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }
        chunker.add('copyBA', (vis, a, b, cur_left, cur_mid, cur_right) => {
          if (isMergeCopyExpanded()) {
            for (let i = cur_left; i <= cur_right; i++) {
              // unhighlightB(vis, i, false);
            }
            vis.arrayB.set(b, 'msort_arr_td');
          }
          vis.array.set(a, 'msort_arr_td');
          for (let i = cur_left; i <= cur_right; i++) {
            highlight(vis, i, false);
          }
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap1', undefined);
            assignVarToA(vis, 'max1', undefined);
            assignVarToA(vis, 'ap2', undefined);
            assignVarToA(vis, 'max2', undefined);
          }
          // XXX best highlight cur_mid+1..right from previous
          // recursion level?
          // for (let i = cur_mid+1; i <= right; i++) {
            // highlight(vis, i, true)
          // }
          }, [A, B, left, mid, right], depth);

        // chunk after recursive call, as above, after adjusting
        // stack frames/depth etc
      } else {
        chunker.add('Done', (vis, a, cur_left, cur_right) => {
          if (cur_left === cur_right) {
            unhighlight(vis, cur_left, true);
            highlight(vis, cur_left, false)
          }
          }, [A, left, right], depth);
      }

      return A; // Facilitates testing
    }


    // ----------------------------------------------------------------------------------------------------------------------------
    // Perform actual quicksort
    // ----------------------------------------------------------------------------------------------------------------------------

    // We compute and fix the max value in each array so they don't get re-scaled as we
    // shuffle elements between arrays
    const maxValue = entire_num_array.reduce(
      (acc, curr) => (acc < curr ? curr : acc), 0);
    
    const msresult = MergeSort(0, entire_num_array.length - 1, 0);
    // const result = QuickSort(entire_num_array, 0, entire_num_array.length - 1, 0);

    // assert(real_stack.length === 0);

    // Fade out final node - fixes up stack
    // chunker.add(
      // QS_BOOKMARKS.SHARED_done_qs,
      // (vis, idx) => {
        // vis.array.setStackDepth(0);
        // vis.array.fadeOut(idx);
        // // fade all elements back in for final sorted state
        // for (let i = 0; i < entire_num_array.length; i += 1) {
          // vis.array.fadeIn(i);
        // }
        // vis.array.clearVariables();
        // vis.array.setStack(derive_stack(real_stack, finished_stack_frames));
      // },
      // [entire_num_array.length - 1],
    // 0);

    return msresult;
  }
}

