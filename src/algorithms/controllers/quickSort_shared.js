// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  isPartitionExpanded,
  isRecursionExpanded,
} from './quickSortCollapseChunkPlugin';

// visualisation variable strings
const VIS_VARIABLE_STRINGS = {
  i_left_index: 'i',
  j_right_index: 'j',
  pivot: 'pivot',
};

// see stackFrameColour in index.js to find corresponding function mapping to css
const STACK_FRAME_COLOR = {
  Not_started: 0,
  In_progress: 1,
  Current: 2,
  Finished: 3,
  I_color: 4,
  J_color: 5,
  P_color: 6, // pivot
};

// bookmarks (id) into the REAL file for quicksort
// (search \\B and find quicksort)
// keep up to date with this file, ideally this would auto generate
// tagged with M3 if only in median of 3
const QS_BOOKMARKS = {
  quicksort_left_to_right: 1,
  if_left_less_right: 2,
  quicksort_left_to_i_minus_1: 3,
  quicksort_i_plus_1_to_right: 4,
  set_pivot_to_value_at_array_indx_right: 5,
  while_i_less_j: 6,
  incri_i_until_array_index_i_greater_eq_pivot: 7,
  decri_j_until_array_index_j_less_i: 8,
  if_j_greater_i: 9,
  swap_array_i_j_vals: 10,
  set_i_left_minus_1: 11,
  set_j_right: 12,
  swap_pivot_into_correct_position: 13,
  M3_mid_to_middle_index: 14, // M3
  M3_first_swap_A_idx_left_with_A_idx_mid: 15, // 
  M3_swap_A_idx_right_with_A_idx_mid: 16,
  M3_second_swap_A_idx_left_with_A_idx_mid: 17,
  M3_swap_A_idx_mid_with_A_idx_right_minus_1: 18,
  done_qs: 19,
  M3_first_if_A_idx_left_greater_A_idx_right: 20,
  M3_if_A_idx_mid_greater_A_idx_right: 21,
  M3_second_if_A_idx_left_greater_A_idx_right: 22,
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

// stackframe : [left, right,  depth]
const STACK_FRAME_LEFT_INDEX = 0;
const STACK_FRAME_RGHT_INDEX = 1;
const STACK_FRAME_DPTH_INDEX = 2;

export function update_vis_with_stack_frame(a, stack_frame, stateVal) {
  let depth = stack_frame[STACK_FRAME_DPTH_INDEX];
  let left = stack_frame[STACK_FRAME_LEFT_INDEX];
  let right = stack_frame[STACK_FRAME_RGHT_INDEX];

  for (let i = left; i <= right; i += 1) {
    // each element in the vis stack is a tuple:
    // 0th index is for base color,
    // 1th index is for pivot, i, j colors
    a[depth][i] = { base: stateVal, extra: [] };
  }
  return a;
}

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
    let max_depth_index = -1;
    const finished_stack_frames = []; // [ [left, right,  depth], ...]  (although depth could be implicit this is easier)
    const real_stack = []; // [ [left, right,  depth], ...]

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define helper functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function derive_stack(
      Cur_real_stack,
      Cur_finished_stack_frames,
      cur_i,
      cur_j,
      cur_pivot_index,
      cur_depth,
    ) {
      // pass in curr_i, curr_j, curr_depth as -1 if they are not to be rendered

      let stack = [];

      for (let i = 0; i < max_depth_index + 1; i++) {
        // for whatever reason fill() does not work here... JavaScript
        stack.push(
          [...Array.from({ length: entire_num_array.length })].map(() => ({
            base: STACK_FRAME_COLOR.Not_started,
            extra: [],
          })),
        );
      }

      Cur_finished_stack_frames.forEach((stack_frame) => {
        stack = update_vis_with_stack_frame(
          stack,
          stack_frame,
          STACK_FRAME_COLOR.Finished,
        );
      });

      Cur_real_stack.forEach((stack_frame) => {
        stack = update_vis_with_stack_frame(
          stack,
          stack_frame,
          STACK_FRAME_COLOR.In_progress,
        );
      });

      if (Cur_real_stack.length !== 0) {
        stack = update_vis_with_stack_frame(
          stack,
          Cur_real_stack[Cur_real_stack.length - 1],
          STACK_FRAME_COLOR.Current,
        );
      }

      if (cur_depth === undefined) {
        return stack;
      }

      if (cur_pivot_index !== undefined && cur_pivot_index !== -1) {

        stack[cur_depth][cur_pivot_index].extra.push(STACK_FRAME_COLOR.P_color);
      }

      if (!isPartitionExpanded()) { return stack; }

      if (cur_i !== undefined && cur_i !== -1) {

        stack[cur_depth][cur_i].extra.push(STACK_FRAME_COLOR.I_color);
      }

      if (cur_j !== undefined && cur_j !== -1) {

        stack[cur_depth][cur_j].extra.push(STACK_FRAME_COLOR.J_color);
      }

      return stack;
    }

    const refresh_stack = (vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth) => {

      // TODO
      // we can't render the -1 index 
      // so this is a workaround
      if (cur_i === -1) { cur_i = 0 } 
      if (cur_j === -1) { cur_j = 0 } 

      assert(vis.array);
      assert(Cur_real_stack && Cur_finished_stack_frames);

      vis.array.setStackDepth(Cur_real_stack.length);
      vis.array.setStack(
      derive_stack(Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth)
      );
    };


    function assign_i_j(vis, variable_name, index) {
      if (isPartitionExpanded()) {
        vis.array.assignVariable(variable_name, index);
      } else {
        vis.array.removeVariable(variable_name);
      }
    }

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define quicksort functions
    // ----------------------------------------------------------------------------------------------------------------------------

    // any if statements with depth === 0 and isQuicksort...Expanded is related to the independent recursion animation
    // it prevents some chunkers to be added so that some animation can be done in one step.
    // Refer to the quicksort function for more information
    function partition(partition_num_array, left, right, depth) {
      
      const a = partition_num_array;
      let i = left - 1;
      let j = is_qs_median_of_3 ? right-1 : right;
      let pivot_index = is_qs_median_of_3 ? right-1 : right;


      function swapAction(bookmark, n1, n2) {

        [a[n1], a[n2]] = [a[n2], a[n1]]

        chunker.add(
          bookmark,
          (vis, _n1, _n2, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth) => {
            vis.array.swapElements(_n1, _n2);
            vis.array.assignVariable(VIS_VARIABLE_STRINGS.pivot, cur_pivot_index);
            
            refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth)
  
          },
          [n1, n2, real_stack, finished_stack_frames, i, j, pivot_index, depth],
        );
      };

      function pivot_value() { return a[pivot_index] }; 

      function boolShouldAnimate() {
        return depth === 0 || isRecursionExpanded();
      }

      if (boolShouldAnimate()) {


        // pick pivot --------
        
        if (is_qs_median_of_3) {

          // TODO placeholder
          // TODO put in asserts
          const mid = Math.floor((left + right) / 2);

          // assigning the pivot as the midpoint calculated above
          chunker.add(QS_BOOKMARKS.M3_mid_to_middle_index, (vis, cur_right, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth) => {

            vis.array.assignVariable(VIS_VARIABLE_STRINGS.pivot, mid);
            pivot_index = mid;
            refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth);
          },
          [mid, real_stack, finished_stack_frames, undefined, undefined, pivot_index, depth],); 

          // if a[left] > a[mid]
          chunker.add(QS_BOOKMARKS.M3_first_if_A_idx_left_greater_A_idx_right); 
          if (a[left] > a[mid]) {
            swapAction(QS_BOOKMARKS.M3_first_swap_A_idx_left_with_A_idx_mid, left, mid);
          }

          // if A[mid] > A[right]
          chunker.add(QS_BOOKMARKS.M3_if_A_idx_mid_greater_A_idx_right);
          if (a[mid] > a[right]) {
            swapAction(QS_BOOKMARKS.M3_swap_A_idx_right_with_A_idx_mid, right, mid);

            //if A[left] > A[mid]
            chunker.add(QS_BOOKMARKS.M3_second_if_A_idx_left_greater_A_idx_right);
            if (a[left] > a[mid]) {
              swapAction(QS_BOOKMARKS.M3_second_swap_A_idx_left_with_A_idx_mid, left, mid);
            }
          }

          // Swap(A[mid], A[right - 1])
          swapAction(QS_BOOKMARKS.M3_swap_A_idx_mid_with_A_idx_right_minus_1, mid, right-1);

          // pivot <- A[right - 1]
          chunker.add(QS_BOOKMARKS.set_pivot_to_value_at_array_indx_right, (vis, cur_right, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth) => {

            vis.array.assignVariable(VIS_VARIABLE_STRINGS.pivot, right-1);
            pivot_index = right-1;
            refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth);
          },
          [right-1, real_stack, finished_stack_frames, undefined, undefined, pivot_index, depth],);

        } else {
          chunker.add(
            QS_BOOKMARKS.set_pivot_to_value_at_array_indx_right,
            (vis, cur_right, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth) => {

              assert(cur_right === cur_pivot);
              vis.array.assignVariable(VIS_VARIABLE_STRINGS.pivot, cur_right);
              refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth);
            },
            [right, real_stack, finished_stack_frames, undefined, undefined, pivot_index, depth],
          );  
        }

        // pick pivot end --------

        chunker.add(
          QS_BOOKMARKS.set_i_left_minus_1,
          (vis, i1, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth) => {

            if (i1 >= 0) {
              assign_i_j(vis, VIS_VARIABLE_STRINGS.i_left_index, i1);
            } else {
              assign_i_j(vis, VIS_VARIABLE_STRINGS.i_left_index, 0);
            }

            refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth);
          },
          [i, real_stack, finished_stack_frames, i, undefined, right, depth],
        );

        chunker.add(
          QS_BOOKMARKS.set_j_right,
          (vis, j1, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth) => {

            if (j1 >= 0) {
              assign_i_j(vis, VIS_VARIABLE_STRINGS.j_right_index, j1);
            }

            refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth);
          },
          [j, real_stack, finished_stack_frames, i, j, right, depth],
        );
      }

      while (i < j) {
        if (boolShouldAnimate()) {
          chunker.add(QS_BOOKMARKS.while_i_less_j);
        }
        do {
          i += 1;

          if (boolShouldAnimate()) {
            chunker.add(
              QS_BOOKMARKS.incri_i_until_array_index_i_greater_eq_pivot,
              (vis, i1, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth) => {

                // assign_i_j already takes into account the isPartitionExpanded
                assign_i_j(vis, VIS_VARIABLE_STRINGS.i_left_index, i1);
                refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth);
              },
              [i, real_stack, finished_stack_frames, i, j, right, depth],
            );
          }
        } while (a[i] < pivot_value());

        do {
          j -= 1;
          if (boolShouldAnimate()) {
            chunker.add(
              QS_BOOKMARKS.decri_j_until_array_index_j_less_i,
              (vis, j1, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth) => {

                if (j1 >= 0) {
                  assign_i_j(vis, VIS_VARIABLE_STRINGS.j_right_index, j1);
                } else {
                  vis.array.removeVariable(VIS_VARIABLE_STRINGS.j_right_index);
                }

                refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth);
              },
              [j, real_stack, finished_stack_frames, i, j, right, depth],
            );
          }
        } while (i <= j && pivot_value() < a[j]);

        if (boolShouldAnimate()) {
          chunker.add(QS_BOOKMARKS.if_j_greater_i);
        }
        if (i < j) {

          swapAction(
            boolShouldAnimate()
              ? QS_BOOKMARKS.swap_array_i_j_vals
              : QS_BOOKMARKS.done_qs,
            i,
            j
          );
        }
      }

      pivot_index = i

      // swap pivot with i
      swapAction(
        boolShouldAnimate()
          ? QS_BOOKMARKS.swap_pivot_into_correct_position
          : QS_BOOKMARKS.done_qs,
        i,
        is_qs_median_of_3 ? right-1 : right
      );



      if (boolShouldAnimate()) {
        chunker.add(
          QS_BOOKMARKS.swap_pivot_into_correct_position,
          (vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_depth, cur_pivot) => {

            vis.array.sorted(cur_pivot);

            if (isPartitionExpanded()) {
              vis.array.assignVariable(VIS_VARIABLE_STRINGS.pivot, cur_pivot);
              refresh_stack(vis, Cur_real_stack, Cur_finished_stack_frames, cur_i, cur_j, cur_pivot, cur_depth);
            }
          },
          
          
          [real_stack, finished_stack_frames, i, j, depth, pivot_index],
        );
      }


      

      return [i, a]; // Return [pivot location, array partition_num_array]
    }

    function QuickSort(qs_num_array, left, right, _, depth) {
      real_stack.push([left, right, depth]);
      max_depth_index = Math.max(max_depth_index, depth);

      let a = qs_num_array;
      let pivot;

      // should show animation if doing high level steps for whole array OR if code is expanded to do all reccursive steps
      function boolShouldAnimate() {
        return depth === 0 || isRecursionExpanded();
      }

      if (boolShouldAnimate()) {
        chunker.add(QS_BOOKMARKS.if_left_less_right, refresh_stack, [
          real_stack,
          finished_stack_frames,
        ]);
      }

      if (left < right) {
        [pivot, a] = partition(a, left, right, depth);

        if (depth === 0 || isRecursionExpanded()) {
          chunker.add(QS_BOOKMARKS.quicksort_left_to_i_minus_1, refresh_stack, [
            real_stack,
            finished_stack_frames,
          ]);
        } else {
          // this part animates the recursion when it is collapsed
          // can also add a function to animate the swap actions in one step here instead of in the partition function
          chunker.add(
            QS_BOOKMARKS.quicksort_left_to_i_minus_1,
            (vis, low, high) => {
              for (let i = low; i <= high; i++) {
                // inclusive to make sure pivot is sorted at end
                vis.array.sorted(i);
              }
            },
            [left, pivot],
          );
        }

        QuickSort(a, left, pivot - 1, `${left}/${pivot - 1}`, depth + 1);

        if (depth === 0 || isRecursionExpanded()) {
          chunker.add(QS_BOOKMARKS.quicksort_i_plus_1_to_right, refresh_stack, [
            real_stack,
            finished_stack_frames,
          ]);
        } else {
          chunker.add(
            QS_BOOKMARKS.quicksort_left_to_i_minus_1,
            (vis, low, high) => {
              for (let i = low; i < high; i++) {
                vis.array.sorted(i);
              }
            },
            [pivot, right],
          );
        }
        QuickSort(a, pivot + 1, right, `${right}/${pivot + 1}`, depth + 1);
      }
      // array of size 1, already sorted
      // has a conditional to specify which line it jumps to depending on the expanding and collapsing
      else if (left < a.length) {
        let size_one_bookmark = isRecursionExpanded()
          ? QS_BOOKMARKS.quicksort_left_to_i_minus_1
          : QS_BOOKMARKS.done_qs;

        chunker.add(
          size_one_bookmark,
          (vis, l) => {
            vis.array.sorted(l);
          },
          [left],
        );
      }

      finished_stack_frames.push(real_stack.pop());

      return a; // Facilitates testing
    }

    // ----------------------------------------------------------------------------------------------------------------------------
    // Perform actual quicksort
    // ----------------------------------------------------------------------------------------------------------------------------

    chunker.add(
      QS_BOOKMARKS.quicksort_left_to_right,
      (vis, array) => {
        vis.array.set(array, 'quicksort');
        vis.array.setStack([]); // used for a custom stack visualisation
      },
      [entire_num_array],
    );

    const result = QuickSort(
      entire_num_array,
      0,
      entire_num_array.length - 1,
      `0/${entire_num_array.length - 1}`,
      0,
    );

    assert(real_stack.length === 0);

    // Fade out final node
    chunker.add(
      QS_BOOKMARKS.done_qs,
      (vis, idx) => {
        vis.array.fadeOut(idx);
        // fade all elements back in for final sorted state
        for (let i = 0; i < entire_num_array.length; i += 1) {
          vis.array.fadeIn(i);
        }
        vis.array.clearVariables();
        vis.array.setStack(derive_stack(real_stack, finished_stack_frames));
      },
      [entire_num_array.length - 1],
    );

    return result;
  }
}

