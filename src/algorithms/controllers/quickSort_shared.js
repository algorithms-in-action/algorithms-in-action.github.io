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

// XXX this code need a clean up - there is a bunch of stuff left over
// from a previous version that didn't encapsulate the recursive calls
// properly

// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  isPartitionExpanded,
  isRecursionExpanded,
} from './quickSortCollapseChunkPlugin';

// visualisation variable strings
// XXX for now we use a special case for i&j running off the left of the
// array since we can't easily render them in the right place
const VIS_VARIABLE_STRINGS = {
  i_left_index: 'i',
  j_right_index: 'j',
  i_eq_0: 'i=0',
  j_eq_0: 'j=0',
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

const QS_BOOKMARKS = {
  SHARED_quicksort_left_to_right: 1,
  SHARED_if_left_less_right: 2,
  SHARED_quicksort_left_to_i_minus_1: 3,
  SHARED_quicksort_i_plus_1_to_right: 4,
  RIGHT_P_set_pivot_to_value_at_array_indx_right: 5,
  MEDIAN3_set_pivot_to_value_at_array_indx_right_minus_1: 5, 
  SHARED_while_i_less_j: 6,
  SHARED_incri_i_until_array_index_i_greater_eq_pivot: 7,
  SHARED_decri_j_until: 8, // shortened name
  SHARED_if_j_greater_i: 9,
  SHARED_swap_array_i_j_vals: 10,
  RIGHT_P_set_i_left_minus_1: 11,
  MEDIAN3_set_i_left: 11,
  RIGHT_P_set_j_right: 12,
  MEDIAN3__set_j_right_minus_1: 12,
  SHARED_swap_pivot_into_position: 13,
  MEDIAN3_mid_to_middle_index: 14, 
  MEDIAN3_first_swap_A_idx_left_with_A_idx_mid: 15, 
  MEDIAN3_swap_A_idx_right_with_A_idx_mid: 16,
  MEDIAN3_second_swap_A_idx_left_with_A_idx_mid: 17,
  MEDIAN3_swap_A_idx_mid_with_A_idx_right_minus_1: 18,
  SHARED_pre_left: 300,
  SHARED_done_left: 301,
  SHARED_pre_right: 400,
  SHARED_done_right: 401,
  SHARED_done_qs: 19, // in expanded rec calls 
  SHARED_skip_step : 19, // idk how this works
  SHARED_done_top_level_qs: 50, // Done at end of top level
  MEDIAN3_first_if_A_idx_left_greater_A_idx_right: 20,
  MEDIAN3_if_A_idx_mid_greater_A_idx_right: 21,
  MEDIAN3_second_if_A_idx_left_greater_A_idx_right: 22,
};




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

const unhighlight = (vis, index, isPrimaryColor = true) => {
  if (isPrimaryColor) {
    vis.array.deselect(index);
  } else {
    vis.array.depatch(index);
  }
};


// ----------------------------------------------------------------------------------------------------------------------------



export function initVisualisers() {
  return {
    array: {
      instance: new ArrayTracer('array', null, 'Array view', {
        arrayItemMagnitudes: true,
      }), // Label the input array as array view
      order: 0,
    },
  };
}

/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_QS(is_qs_median_of_3) {

  return function run(chunker, { nodes }) {
    // can't rename from nodes

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define 'global' variables
    // ----------------------------------------------------------------------------------------------------------------------------

    const entire_num_array = nodes;
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
        return stack_vis;
      }

      if (cur_pivot_index !== undefined) {
        stack_vis[cur_depth][cur_pivot_index].extra.push(STACK_FRAME_COLOR.P_color);
      }

      if (!isPartitionExpanded()) { return stack_vis; }

      if (cur_i !== undefined) {
        stack_vis[cur_depth][cur_i].extra.push(STACK_FRAME_COLOR.I_color);
      }

      if (cur_j !== undefined) {
        stack_vis[cur_depth][cur_j].extra.push(STACK_FRAME_COLOR.J_color);
      }

      return stack_vis;
    }

    const refresh_stack = (vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {

      // TODO XXX
      // we can't render the -1 index 
      // so this is a workaround
      // if (cur_i === -1) { cur_i = 0 } 
      // if (cur_j === -1) { cur_j = 0 } 
      // if (cur_pivot_index === -1) { cur_pivot_index = 0 } 
      // better for things to vanish than be misleading?
      // Could we also have a var named 'i=0' for example?
      // Yes - see VIS_VARIABLE_STRINGS XXX
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
      // never occurs?
      // if (cur_pivot_index === -1) { cur_pivot_index = undefined }

      assert(vis.array);
      assert(cur_real_stack && cur_finished_stack_frames);

      if (!isPartitionExpanded()) {
        // j should not show up in vis if partition is collapsed
        cur_j = undefined
      }

      if (!isPartitionExpanded() && !isRecursionExpanded()) {
        // i should not show up in vis if partition + recursion is collapsed
        cur_i = undefined
      }

      vis.array.setStackDepth(cur_real_stack.length);
      vis.array.setStack(
        derive_stack(cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth)
      );

      assign_i_j(vis, VIS_VARIABLE_STRINGS.i_left_index, cur_i);
      assign_i_j(vis, VIS_VARIABLE_STRINGS.i_eq_0, cur_i_too_low);
      assign_i_j(vis, VIS_VARIABLE_STRINGS.pivot, cur_pivot_index);
      assign_i_j(vis, VIS_VARIABLE_STRINGS.j_right_index, cur_j);
      assign_i_j(vis, VIS_VARIABLE_STRINGS.j_eq_0, cur_j_too_low);
    };


    function assign_i_j(vis, variable_name, index) {

      if (index === undefined) { vis.array.removeVariable(variable_name); return; }

      // we just used undefined to stop var display since i and pivot
      // should be displayed even when !isPartitionExpanded()
      vis.array.assignVariable(variable_name, index);
/*
      if (isPartitionExpanded()) {
        vis.array.assignVariable(variable_name, index);
      } else {
        vis.array.removeVariable(variable_name);
      }
*/
    }

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define quicksort functions
    // ----------------------------------------------------------------------------------------------------------------------------


    function QuickSort(qs_num_array, left, right, depth) { 

      function boolShouldAnimate() {
        return true;
        // return depth === 0 || isRecursionExpanded();
      }

      function partition(partition_num_array, left, right) {
        // partition is defined inside of quicksort so it can have access to boolShouldAnimate
        
        const a = partition_num_array;

        // everything starts as undefined
        let i = undefined
        let j = undefined
        let pivot_index = undefined

  
        function swapAction(bookmark, n1, n2) {

          assert(bookmark !== undefined);
          assert(n1 !== undefined);
          assert(n2 !== undefined);
  
          [a[n1], a[n2]] = [a[n2], a[n1]]
  
          chunker.add(bookmark,
            (vis, _n1, _n2, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {

              vis.array.swapElements(_n1, _n2);
              if (boolShouldAnimate()) {
                refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth)
              }
            },
            [n1, n2, real_stack, finished_stack_frames, i, j, pivot_index, depth],
          depth);
        }

        /////

        function chunker_add_if(bookmark, f, args_array) {
          // add if you should animate a step

          assert(bookmark !== undefined); // helps catch bugs early, and trace them in stack

          if (boolShouldAnimate()) {

            if (args_array === undefined) {
              args_array = [real_stack, finished_stack_frames, i, j, pivot_index, depth]
            }

            chunker.add(bookmark, f, args_array, depth)
          }
        }

        /////
  
        function pivot_value() { return a[pivot_index] }
  
        // pick pivot --------
        
        if (is_qs_median_of_3) {

          const mid = Math.floor((left + right) / 2);

          // assigning the pivot as the midpoint calculated above
          chunker_add_if(QS_BOOKMARKS.MEDIAN3_mid_to_middle_index, (vis, cur_mid, cur_left, cur_right) => {
            highlight(vis, cur_mid, false);
            highlight(vis, cur_left, false);
            highlight(vis, cur_right, false);
          },
          [mid, left, right]); 

          chunker_add_if(QS_BOOKMARKS.MEDIAN3_first_if_A_idx_left_greater_A_idx_right); 
          if (a[left] > a[mid]) {
            swapAction(QS_BOOKMARKS.MEDIAN3_first_swap_A_idx_left_with_A_idx_mid, left, mid);
          }

          // if A[mid] > A[right]
          chunker_add_if(QS_BOOKMARKS.MEDIAN3_if_A_idx_mid_greater_A_idx_right);
          if (a[mid] > a[right]) {
            swapAction(QS_BOOKMARKS.MEDIAN3_swap_A_idx_right_with_A_idx_mid, right, mid);

            //if A[left] > A[mid]
            chunker_add_if(QS_BOOKMARKS.MEDIAN3_second_if_A_idx_left_greater_A_idx_right);
            if (a[left] > a[mid]) {
              swapAction(QS_BOOKMARKS.MEDIAN3_second_swap_A_idx_left_with_A_idx_mid, left, mid);
            }
          }

          // Swap(A[mid], A[right - 1])
          swapAction(QS_BOOKMARKS.MEDIAN3_swap_A_idx_mid_with_A_idx_right_minus_1, mid, right-1);

          // pivot <- A[right - 1]
          pivot_index = right-1
          chunker_add_if(QS_BOOKMARKS.MEDIAN3_set_pivot_to_value_at_array_indx_right_minus_1, 
            (vis, cur_right, cur_left, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {
            unhighlight(vis, cur_right, false);
            unhighlight(vis, cur_right -1, false);
            unhighlight(vis, cur_left, false);

            refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) // refresh stack to show pivot_index
          },
          [right, left, real_stack, finished_stack_frames, i, j, pivot_index, depth]);

        } else {

          pivot_index = right;

          chunker_add_if(
            QS_BOOKMARKS.RIGHT_P_set_pivot_to_value_at_array_indx_right,
            (vis, cur_right, cur_left, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {
            refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) // refresh stack to show pivot_index
         },
          [right, left, real_stack, finished_stack_frames, i, j, pivot_index, depth]);
            //refresh_stack);  
        }

        assert(pivot_index !== undefined);

        assert(i === undefined);
        assert(j === undefined);

        // pick pivot end --------

        if (is_qs_median_of_3) {

          i = left
          chunker_add_if(QS_BOOKMARKS.MEDIAN3_set_i_left, refresh_stack);
          j = right - 1
          chunker_add_if(QS_BOOKMARKS.MEDIAN3__set_j_right_minus_1, refresh_stack);

        } else {

          i = left - 1
          chunker_add_if(QS_BOOKMARKS.RIGHT_P_set_i_left_minus_1, refresh_stack);
          j = right
          chunker_add_if(QS_BOOKMARKS.RIGHT_P_set_j_right, refresh_stack);
        }


        assert(i !== undefined);
        assert(j !== undefined);


        while (i < j) {

          chunker_add_if(QS_BOOKMARKS.SHARED_while_i_less_j);
          
          do {
            i += 1;
  
            chunker_add_if(
              QS_BOOKMARKS.SHARED_incri_i_until_array_index_i_greater_eq_pivot,
              refresh_stack);
            
          } while (a[i] < pivot_value());
  
          do {
            j -= 1;

            chunker_add_if(
              QS_BOOKMARKS.SHARED_decri_j_until,
              refresh_stack);
            
          } while (i <= j && pivot_value() < a[j]);


          chunker_add_if(QS_BOOKMARKS.SHARED_if_j_greater_i);
          
          if (i < j) {
            swapAction(QS_BOOKMARKS.SHARED_swap_array_i_j_vals, i, j);
          }
        }
  
        pivot_index = i
  
        // swap pivot with i
        swapAction(QS_BOOKMARKS.SHARED_swap_pivot_into_position, i,
          is_qs_median_of_3 ? right-1 : right
        );

        chunker_add_if(
          QS_BOOKMARKS.SHARED_swap_pivot_into_position,
          (vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {
            vis.array.sorted(cur_pivot_index);
        });

        return [i, a]; // Return [pivot location, array partition_num_array]
      }

      //// start quicksort -------------------------------------------------------- 

      real_stack.push([left, right, depth]);
      max_depth_index = Math.max(max_depth_index, depth);

      let a = qs_num_array;
      let pivot;

      // should show animation if doing high level steps for whole array OR if code is expanded to do all reccursive steps

      if (boolShouldAnimate()) {
        chunker.add(QS_BOOKMARKS.SHARED_if_left_less_right, refresh_stack, [
          real_stack,
          finished_stack_frames,
        ], depth);
      }

      if (left < right) {
        // Code structure a bit sus here: normally choose pivot then call
        // partition with the pivot but we accomodate simple QS plus
        // M3QS so it's a bit weird, possibly for that reason.
        [pivot, a] = partition(a, left, right, depth);


        // dummy chunk for before recursive call - we need this so there
        // is a chunk at this recursion level as the first chunk in the
        // collapsed code for the recursive call
        // We no longer want to display 'pivot' or 'j' but want 'i'
        let pivot_index = undefined;
        let j = undefined;
        let i = pivot;
        if (boolShouldAnimate()) {
            chunker.add(QS_BOOKMARKS.SHARED_pre_left,
            (vis, cur_right, cur_left, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {
            refresh_stack(vis, cur_real_stack,
cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) // refresh shows i
         },
          [right, left, real_stack, finished_stack_frames, i, j, pivot_index, depth], depth);
          // chunker.add(QS_BOOKMARKS.SHARED_pre_left, refresh_stack, [
          // chunker.add(QS_BOOKMARKS.SHARED_quicksort_left_to_i_minus_1, refresh_stack, [
            // real_stack,
            // finished_stack_frames,
          // ], depth);
        } else {
          // this part animates the recursion when it is collapsed
          // can also add a function to animate the swap actions in one step here instead of in the partition function
          chunker.add(
            QS_BOOKMARKS.SHARED_quicksort_left_to_i_minus_1,
            (vis, low, high) => {
              for (let i = low; i <= high; i++) {
                // inclusive to make sure pivot is sorted at end
                vis.array.sorted(i);
              }
            },
            [left, pivot],
          depth);
        }

        QuickSort(a, left, pivot - 1, depth + 1);

        // dummy chunk after recursive call - it's good to highlight the
        // recursive call once it has returned plus we need a chunk at
        // this level when the recursive code is collapsed
        // XXX might rename bookmarks
        // XXX Should show 'i' if recursion is expanded
        if (boolShouldAnimate()) {
          chunker.add(QS_BOOKMARKS.SHARED_quicksort_left_to_i_minus_1,
          (vis, cur_right, cur_left, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) // refresh shows i
          },
          [right, left, real_stack, finished_stack_frames, i, j, pivot_index, depth], depth);
/*
          chunker.add(QS_BOOKMARKS.SHARED_quicksort_i_plus_1_to_right, refresh_stack, [
            real_stack,
            finished_stack_frames,
          ], depth);
*/
        } else {
          chunker.add(
            QS_BOOKMARKS.SHARED_quicksort_left_to_i_minus_1,
            (vis, low, high) => {
              for (let i = low; i < high; i++) {
                vis.array.sorted(i);
              }
            },
            [pivot, right],
          depth);
        }
        // dummy chunk before recursive call, as above
        // XXX Should show 'i' if recursion is expanded
          chunker.add(QS_BOOKMARKS.SHARED_pre_right,
          (vis, cur_right, cur_left, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) // refresh shows i
          },
          [right, left, real_stack, finished_stack_frames, i, j, pivot_index, depth], depth);
/*
        chunker.add(
          QS_BOOKMARKS.SHARED_pre_right,
          //QS_BOOKMARKS.SHARED_quicksort_left_to_i_minus_1,
          //QS_BOOKMARKS.SHARED_done_left,
          (vis) => { },
          [],
        depth);
*/
        QuickSort(a, pivot + 1, right, depth + 1);
        // dummy chunk after recursive call, as above, after adjusting
        // stack frames/depth etc
          chunker.add(QS_BOOKMARKS.SHARED_quicksort_i_plus_1_to_right, refresh_stack, [
            real_stack,
            finished_stack_frames,
          ], depth);
        finished_stack_frames.push(real_stack.pop());
/*
        chunker.add(
          QS_BOOKMARKS.SHARED_quicksort_i_plus_1_to_right,
          // QS_BOOKMARKS.SHARED_done_right,
          (vis) => { },
          [],
        depth);
*/
      }
      // array of size 1, already sorted
      // has a conditional to specify which line it jumps to depending on the expanding and collapsing
      else if (left < a.length) {
        finished_stack_frames.push(real_stack.pop());
        let size_one_bookmark = isRecursionExpanded()
          ? QS_BOOKMARKS.SHARED_quicksort_left_to_i_minus_1
          : QS_BOOKMARKS.SHARED_skip_step;

        chunker.add(
          size_one_bookmark,
          (vis, l) => {
            vis.array.sorted(l);
          },
          [left],
        depth);
      } else {
        finished_stack_frames.push(real_stack.pop());
        chunker.add(QS_BOOKMARKS.SHARED_done_qs, refresh_stack, [
          real_stack,
          finished_stack_frames,
        ], depth);
      }


/*
      // Add "do nothing" chunk for the "Done" line
      chunker.add(
        QS_BOOKMARKS.SHARED_done_qs,
        (vis) => { },
        [],
      depth);
*/

      return a; // Facilitates testing
    }

    // ----------------------------------------------------------------------------------------------------------------------------
    // Perform actual quicksort
    // ----------------------------------------------------------------------------------------------------------------------------

    chunker.add(
      QS_BOOKMARKS.SHARED_quicksort_left_to_right,
      (vis, array) => {
        vis.array.set(array, 'quicksort');
        vis.array.setStack([]); // used for a custom stack visualisation
      },
      [entire_num_array],
    0);

    const result = QuickSort(entire_num_array, 0, entire_num_array.length - 1, 0);

    assert(real_stack.length === 0);

    // Fade out final node - fixes up stack
    console.log(finished_stack_frames[finished_stack_frames.length-1]);
    console.log(finished_stack_frames[0]);
    chunker.add(
      QS_BOOKMARKS.SHARED_done_qs,
      (vis, idx) => {
        vis.array.setStackDepth(0);
        vis.array.fadeOut(idx);
        // fade all elements back in for final sorted state
        for (let i = 0; i < entire_num_array.length; i += 1) {
          vis.array.fadeIn(i);
        }
        vis.array.clearVariables();
        vis.array.setStack(derive_stack(real_stack, finished_stack_frames));
      },
      [entire_num_array.length - 1],
    0);

    return result;
  }
}

