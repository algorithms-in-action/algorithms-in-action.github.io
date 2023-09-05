import { QSExp } from '../explanations';
// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  isPartitionExpanded,
  isIJVarExpanded,
  isQuicksortFirstHalfExpanded,
  isQuicksortSecondHalfExpanded,
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
};

// bookmarks (id) into the REAL file for quicksort
// (search \\B and find quicksort)
// keep up to date with this file, ideally this would auto generate
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
  // 14
  // 15
  // 16
  // 17
  done_qs_left: 18,
  done_qs_right: 19,
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
    a[depth][i] = stateVal;
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

export default {
  explanation: QSExp,

  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array view', {
          arrayItemMagnitudes: true,
        }), // Label the input array as array view
        order: 0,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   */

  run(chunker, { nodes }) {
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

    function derive_stack(Cur_real_stack, Cur_finished_stack_frames) {
      let stack = [];
      for (let i = 0; i < max_depth_index + 1; i++) {
        stack.push(
          new Array(entire_num_array.length).fill(
            STACK_FRAME_COLOR.Not_started,
          ),
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

      return stack;
    }

    const refresh_stack = (vis, Cur_real_stack, Cur_finished_stack_frames) => {
      vis.array.setStackDepth(Cur_real_stack.length);
      vis.array.setStack(derive_stack(Cur_real_stack, Cur_finished_stack_frames));
    };

    ///

    const swapAction = (b, n1, n2, { isPivotSwap }) => {
      chunker.add(
        b,
        (vis, _n1, _n2) => {
          vis.array.swapElements(_n1, _n2);
          if (isPivotSwap) {
            vis.array.assignVariable(VIS_VARIABLE_STRINGS.pivot, n1);
          }
        },
        [n1, n2],
      );
    };

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define quicksort functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function partition(partition_num_array, left, right) {
      const a = partition_num_array;
      let i = left - 1;
      let j = right;

      const pivot = a[right];

      /*
      chunker.add(
        QS_BOOKMARKS.set_pivot_to_value_at_array_indx_right, 
        noOp
      ); // prevent early highlight
      */

      chunker.add(
        QS_BOOKMARKS.set_pivot_to_value_at_array_indx_right,
        (vis, p) => {
          highlight(vis, p);
          vis.array.assignVariable(VIS_VARIABLE_STRINGS.pivot, p);
        },
        [right],
      );

      // At the start of algorithm, i = 0 - 1
      // Hence cannot be drawn at any index
      // So in that case, it is displayed at index 0
      chunker.add(
        QS_BOOKMARKS.set_i_left_minus_1,
        (vis, i1) => {
          if (i1 >= 0) {
            highlight(vis, i1, false);
            isPartitionExpanded() &&
              vis.array.assignVariable(VIS_VARIABLE_STRINGS.i_left_index, i1);
          } else if (i1 === -1) {
            isPartitionExpanded() && highlight(vis, 0, false);
            isPartitionExpanded() &&
              vis.array.assignVariable(VIS_VARIABLE_STRINGS.i_left_index, 0);
          }
        },
        [i],
      );

      chunker.add(
        QS_BOOKMARKS.set_j_right,
        (vis, j1) => {
          if (j1 >= 0) {
            highlight(vis, j1, false);
            isPartitionExpanded() &&
              vis.array.assignVariable(VIS_VARIABLE_STRINGS.j_right_index, j1);
          }
        },
        [j],
      );

      while (i < j) {
        chunker.add(QS_BOOKMARKS.while_i_less_j);
        do {
          i += 1;
          chunker.add(
            QS_BOOKMARKS.incri_i_until_array_index_i_greater_eq_pivot,
            (vis, i1) => {
              if (i1 > 0) {
                unhighlight(vis, i1 - 1, false);
              } else if (i1 === -1) {
                unhighlight(vis, 0, false);
              }
              if (i1 > 0) highlight(vis, i1, false);
              else if (!isPartitionExpanded() && i1 === 0)
                highlight(vis, i1, false);
              isPartitionExpanded() &&
                vis.array.assignVariable(VIS_VARIABLE_STRINGS.i_left_index, i1);
            },
            [i],
          );
        } while (a[i] < pivot);

        do {
          j -= 1;
          chunker.add(
            QS_BOOKMARKS.decri_j_until_array_index_j_less_i,
            (vis, j1) => {
              unhighlight(vis, j1 + 1, false);
              if (j1 >= 0) {
                highlight(vis, j1, false);
                isPartitionExpanded() &&
                  vis.array.assignVariable(
                    VIS_VARIABLE_STRINGS.j_right_index,
                    j1,
                  );
              } else {
                vis.array.removeVariable(VIS_VARIABLE_STRINGS.j_right_index);
              }
            },
            [j],
          );
        } while (i <= j && pivot < a[j]);

        chunker.add(QS_BOOKMARKS.if_j_greater_i);
        if (i < j) {
          [a[j], a[i]] = [a[i], a[j]]; // swap a[j], a[i]
          swapAction(QS_BOOKMARKS.swap_array_i_j_vals, i, j, {
            isPivotSwap: false,
          });
        }
      }

      // swap pivot with i
      a[right] = a[i];
      a[i] = pivot;
      swapAction(QS_BOOKMARKS.swap_pivot_into_correct_position, i, right, {
        isPivotSwap: true,
      });

      chunker.add(
        QS_BOOKMARKS.swap_pivot_into_correct_position,
        (vis, i1, j1, r) => {
          isPartitionExpanded() &&
            vis.array.assignVariable(VIS_VARIABLE_STRINGS.pivot, i);
          unhighlight(vis, i1);
          if (j1 >= 0) {
            if (j1 === i1) {
              unhighlight(vis, r, false);
            } else {
              unhighlight(vis, j1, false);
            }
          }
          unhighlight(vis, r, false);
          vis.array.sorted(i1);
        },
        [i, j, right],
      );
      return [i, a]; // Return [pivot location, array partition_num_array]
    }

    function QuickSort(qs_num_array, left, right, _, depth) {
      real_stack.push([left, right, depth]);
      max_depth_index = Math.max(max_depth_index, depth);

      let a = qs_num_array;
      let pivot;
      if (depth < 1 || (isQuicksortFirstHalfExpanded() && isQuicksortSecondHalfExpanded())) {
        chunker.add(QS_BOOKMARKS.if_left_less_right, refresh_stack, [
          real_stack,
          finished_stack_frames,
        ]);
      }

      if (left < right) {
        [pivot, a] = partition(a, left, right);
          
        if (depth < 1 || isQuicksortFirstHalfExpanded()) {
          chunker.add(QS_BOOKMARKS.quicksort_left_to_i_minus_1, refresh_stack, [
          real_stack,
          finished_stack_frames,
          ]);
        } else {
          chunker.add(QS_BOOKMARKS.quicksort_left_to_i_minus_1, () => {}, []);
        }
        QuickSort(a, left, pivot - 1, `${left}/${pivot - 1}`, depth + 1);

        if (depth < 1 || isQuicksortSecondHalfExpanded()) {
          chunker.add(QS_BOOKMARKS.quicksort_i_plus_1_to_right, refresh_stack, [
          real_stack,
          finished_stack_frames,
          ]);
        } else {
          chunker.add(QS_BOOKMARKS.quicksort_left_to_i_minus_1, () => {}, []);
        }
        QuickSort(a, pivot + 1, right, `${right}/${pivot + 1}`, depth + 1);
      }
      // array of size 1, already sorted
      else if (left < a.length) {
        let size_one_bookmark = QS_BOOKMARKS.if_left_less_right;
        if (!isQuicksortFirstHalfExpanded() && !isQuicksortSecondHalfExpanded()) {
          size_one_bookmark = QS_BOOKMARKS.quicksort_left_to_i_minus_1;
        } else if (!isQuicksortSecondHalfExpanded()) {
          size_one_bookmark = QS_BOOKMARKS.quicksort_i_plus_1_to_right;
        }
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
      QS_BOOKMARKS.done_qs_right,
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
  },
};
