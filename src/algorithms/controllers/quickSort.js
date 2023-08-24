/*

The 'stack' in this file is simply for the visualisation and does perform push and pop as such.
It is used to visualise how reccursion sorts increasingly smaller parts of the array.
It is not possible to replace it with an actual stack without limiting functionality.

*/

import { QSExp } from '../explanations';
// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

const Variable_strings = {
  left_index: 'i',
  right_index: 'j',
  pivot: 'pivot',
};

// TODO - changes names to conceptual states
// In_progress, Current, Finished, Not_started + comment default comments in enum

// search stackFrameColour to find corresponding function
const stackFrameColour = {
	Invisible: 0,
  Red: 1,
  Gray: 2,
	New_color: 3, // example
};


// bookmarks (id) into the REAL file for quicksort
// (search \\B and find quicksort)
// keep up to date with this file, ideally this would auto generate
const qsBookmarks = {
	quicksort_left_to_right:                      1,
	if_left_less_right:                           2,
	quicksort_left_to_i_minus_1:                  3,
	quicksort_i_plus_1_to_right:                  4,
	set_pivot_to_value_at_array_indx_right:       5,
	while_i_less_j:                               6,
	incri_i_until_array_index_i_greater_eq_pivot: 7,
	decri_j_until_array_index_j_less_i:           8,
	if_j_greater_i:                               9,
	swap_array_i_j_vals:                         10,
  set_i_left_minus_1:                          11,
	set_j_right:                                 12,
	swap_pivot_into_correct_position:            13,
	// 14
	// 15
	// 16
	// 17
	done_qs_second_half:                         19,
	
};





/**
 * @param {*} arr
 * @param {*} depth
 * @param {*} stateVal
 * @param {*} left
 * @param {*} right
 * @returns
 */
export function updateStackElements(arr, depth, stateVal, left, right) {
  for (let i = left; i <= right; i += 1) {
    arr[depth][i] = stateVal;
  }
  return arr;
}

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

    const swapAction = (b, n1, n2, { isPivotSwap }) => {
      chunker.add(
        b,
        (vis, _n1, _n2) => {
          vis.array.swapElements(_n1, _n2);
          if (isPivotSwap) {
            vis.array.assignVariable(Variable_strings.pivot, n1);
          }
        },
        [n1, n2],
      );
    };

    function partition(values, left, right) {
      const a = values;
      let i = left - 1;
      let j = right;
      let tmp;

      const pivot = a[right];

      /*
      chunker.add(
        qsBookmarks.set_pivot_to_value_at_array_indx_right, 
        noOp
      ); // prevent early highlight
      */

      chunker.add(
        qsBookmarks.set_pivot_to_value_at_array_indx_right,
        (vis, p) => {
          highlight(vis, p);
          vis.array.assignVariable(Variable_strings.pivot, p);
        },
        [right],
      );

      // i IS NOT being drawn correctly at this point
      chunker.add(
        qsBookmarks.set_i_left_minus_1,
        (vis, i1) => {
          if (i1 >= 0) {
            highlight(vis, i1, false);
            vis.array.assignVariable(Variable_strings.left_index, i1);
          }
        },
        [i],
      );

      // i IS being drawn correctly at this point
      chunker.add(
        qsBookmarks.set_j_right,
        (vis, j1) => {
          if (j1 >= 0) {
            highlight(vis, j1, false);
            vis.array.assignVariable(Variable_strings.right_index, j1);
          }
        },
        [j],
      );

      while (i < j) {
        chunker.add(qsBookmarks.while_i_less_j);
        do {
          i += 1;
          chunker.add(
            qsBookmarks.incri_i_until_array_index_i_greater_eq_pivot,
            (vis, i1) => {
              if (i1 > 0) {
                unhighlight(vis, i1 - 1, false);
              }
              highlight(vis, i1, false);
              vis.array.assignVariable(Variable_strings.left_index, i1);
            },
            [i],
          );
        } while (a[i] < pivot);

        do {
          j -= 1;
          chunker.add(
            qsBookmarks.decri_j_until_array_index_j_less_i,
            (vis, j1) => {
              unhighlight(vis, j1 + 1, false);
              if (j1 >= 0) {
                highlight(vis, j1, false);
                vis.array.assignVariable(Variable_strings.right_index, j1);
              } else {
                vis.array.removeVariable(Variable_strings.right_index);
              }
            },
            [j],
          );
        } while (i <= j && pivot < a[j]);

        chunker.add(qsBookmarks.if_j_greater_i);
        if (i < j) {
          tmp = a[j];
          a[j] = a[i];
          a[i] = tmp;
          swapAction(qsBookmarks.swap_array_i_j_vals, i, j, { isPivotSwap: false });
        }
      }

      // swap pivot with i
      a[right] = a[i];
      a[i] = pivot;
      swapAction(qsBookmarks.swap_pivot_into_correct_position, i, right, { isPivotSwap: true });

      chunker.add(
        qsBookmarks.swap_pivot_into_correct_position,
        (vis, i1, j1, r) => {
          vis.array.assignVariable(Variable_strings.pivot, i);
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
      return [i, a]; // Return [pivot location, array values]
    }

    function QuickSort(array, left, right, _, depth) {
      let a = array;
      let p;
      chunker.add(qsBookmarks.if_left_less_right, (vis) => {
        let updatedStack = vis.array.stack;
        if (depth > vis.array.stack.length - 1) {
          updatedStack = updatedStack.concat([
            new Array(nodes.length).fill(stackFrameColour.Invisible),
          ]);
        }

        updatedStack = updateStackElements(
          updatedStack,
          depth,
          stackFrameColour.Red,
          left,
          right,
        );
        for (let i = 0; i < updatedStack.length; i += 1) {
          for (let j = 0; j < updatedStack[i].length; j += 1) {
            if (updatedStack[i][j] === stackFrameColour.Invisible) continue;
            if (
              i !== depth &&
              updatedStack[i][j] !== stackFrameColour.Invisible &&
              (j < left || j > right)
            ) {
              updatedStack[i][j] = stackFrameColour.Gray;
            }
            if (i !== depth && j >= left && j <= right) {
              updatedStack[i][j] = stackFrameColour.Invisible;
            }
          }
        }

        vis.array.setStack(updatedStack);
        vis.array.setStackDepth(depth);
      });
      if (left < right) {
        [p, a] = partition(a, left, right);

        chunker.add(
          qsBookmarks.quicksort_left_to_i_minus_1,
          (vis, pivot, arrayLen) => {
            vis.array.stack[depth][p] = stackFrameColour.Invisible;
            // fade out the part of the array that is not being sorted (i.e. right side)
            for (let i = pivot; i < arrayLen; i++) {
              vis.array.fadeOut(i);
            }
          },
          [p, right + 1],
        );
        QuickSort(a, left, p - 1, `${left}/${p - 1}`, depth + 1);

        chunker.add(
          qsBookmarks.quicksort_i_plus_1_to_right,
          (vis, pivot, arrayLen) => {
            vis.array.setStackDepth(depth);

            // fade out the part of the array that is not being sorted (i.e. left side)
            for (let i = 0; i <= pivot; i++) {
              vis.array.fadeOut(i);
            }
            // fade in part of the array that is now being sorted (i.e. right side)
            for (let i = pivot + 1; i < arrayLen; i++) {
              vis.array.fadeIn(i);
            }

            // do some somewhat hacky changes to the 'stack' array
            // note that this is just setting the state of elements in a 2D array which represents a stack and corresponding elements in the real array positionally in a row
            let updatedStack = updateStackElements(
              vis.array.stack,
              depth,
              stackFrameColour.Red,
              left,
              right,
            );
            for (let i = 0; i < updatedStack.length; i++) {
              for (let j = 0; j < updatedStack[i].length; j++) {
                if (j <= pivot) {
                  updatedStack[i][j] = stackFrameColour.Invisible;
                } else if (
                  i !== depth &&
                  updatedStack[i][j] !== stackFrameColour.Invisible &&
                  (j < left || j > right)
                ) {
                  updatedStack[i][j] = stackFrameColour.Gray;
                } else if (i !== depth && j >= left && j <= right) {
                  updatedStack[i][j] = stackFrameColour.Invisible;
                }
              }
            }
          },
          [p, right + 1],
        );
        QuickSort(a, p + 1, right, `${right}/${p + 1}`, depth + 1);
      }
      // array of size 1, already sorted
      else if (left < array.length) {
        chunker.add(
          qsBookmarks.if_left_less_right,
          (vis, l) => {
            vis.array.sorted(l);
          },
          [left],
        );
      }
      return a; // Facilitates testing
    }

    chunker.add(
      qsBookmarks.quicksort_left_to_right,
      (vis, array) => {
        vis.array.set(array, 'quicksort');
        vis.array.setStack([
          new Array(nodes.length).fill(stackFrameColour.Invisible),
        ]); // used for a custom stack visualisation
      },
      [nodes],
    );

    const result = QuickSort(
      nodes,
      0,
      nodes.length - 1,
      `0/${nodes.length - 1}`,
      0,
    );
    // Fade out final node
    chunker.add(
      qsBookmarks.done_qs_second_half,
      (vis, idx) => {
        vis.array.fadeOut(idx);
        // fade all elements back in for final sorted state
        for (let i = 0; i < nodes.length; i += 1) {
          vis.array.fadeIn(i);
        }
        vis.array.clearVariables();
        vis.array.setStack([]);
      },
      [nodes.length - 1],
    );
    return result;
  },
};
