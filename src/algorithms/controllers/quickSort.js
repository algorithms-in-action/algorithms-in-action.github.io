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

const Stack_color = {
  Red: 1,
  Invisible: 0,
  Gray: -1,
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
    const highlight = (vis, index, primaryColor = true) => {
      if (primaryColor) {
        vis.array.select(index);
      } else {
        vis.array.patch(index);
      }
    };

    const unhighlight = (vis, index, primaryColor = true) => {
      if (primaryColor) {
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
        [n1, n2]
      );
    };

    const noOp = () => {}; // no operation

    function partition(values, left, right) {
      const a = values;
      let i = left - 1;
      let j = right;
      let tmp;

      const pivot = a[right];

      chunker.add(5, noOp); // prevent early highlight

      chunker.add(
        5,
        (vis, p) => {
          highlight(vis, p);
          vis.array.assignVariable(Variable_strings.pivot, p);
        },
        [right]
      );
      chunker.add(
        11,
        (vis, i1) => {
          if (i1 >= 0) {
            highlight(vis, i1, false);
            vis.array.assignVariable(Variable_strings.left_index, i1);
          }
        },
        [i]
      );
      chunker.add(
        12,
        (vis, j1) => {
          if (j1 >= 0) {
            highlight(vis, j1, false);
            vis.array.assignVariable(Variable_strings.right_index, j1);
          }
        },
        [j]
      );

      while (i < j) {
        chunker.add(6);
        do {
          i += 1;
          chunker.add(
            7,
            (vis, i1) => {
              if (i1 > 0) {
                unhighlight(vis, i1 - 1, false);
              }
              highlight(vis, i1, false);
              vis.array.assignVariable(Variable_strings.left_index, i1);
            },
            [i]
          );
        } while (a[i] < pivot);

        do {
          j -= 1;
          chunker.add(
            8,
            (vis, j1) => {
              unhighlight(vis, j1 + 1, false);
              if (j1 >= 0) {
                highlight(vis, j1, false);
                vis.array.assignVariable(Variable_strings.right_index, j1);
              } else {
                vis.array.removeVariable(Variable_strings.right_index);
              }
            },
            [j]
          );
        } while (i <= j && pivot < a[j]);

        chunker.add(9);
        if (i < j) {
          tmp = a[j];
          a[j] = a[i];
          a[i] = tmp;
          swapAction(10, i, j, { isPivotSwap: false });
        }
      }

      // swap pivot with i
      a[right] = a[i];
      a[i] = pivot;
      swapAction(13, i, right, { isPivotSwap: true });

      chunker.add(
        13,
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
        [i, j, right]
      );
      return [i, a]; // Return [pivot location, array values]
    }

    function QuickSort(array, left, right, _, depth) {
      let a = array;
      let p;
      chunker.add(2, (vis) => {
        let updatedStack = vis.array.stack;
        if (depth > vis.array.stack.length - 1) {
          updatedStack = updatedStack.concat([new Array(nodes.length).fill(Stack_color.Invisible)]);
        }

        updatedStack = updateStackElements(updatedStack, depth, Stack_color.Red, left, right);
        for (let i = 0; i < updatedStack.length; i += 1) {
          for (let j = 0; j < updatedStack[i].length; j += 1) {
            if (updatedStack[i][j] === Stack_color.Invisible) continue;
            if (
              i !== depth &&
              updatedStack[i][j] !== Stack_color.Invisible &&
              (j < left || j > right)
            ) {
              updatedStack[i][j] = Stack_color.Gray;
            }
            if (i !== depth && j >= left && j <= right) {
              updatedStack[i][j] = Stack_color.Invisible;
            }
          }
        }

        vis.array.setStack(updatedStack);
        vis.array.setStackDepth(depth);
      });
      if (left < right) {
        [p, a] = partition(a, left, right);

        chunker.add(
          3,
          (vis, pivot, arrayLen) => {
            vis.array.stack[depth][p] = Stack_color.Invisible;
            // fade out the part of the array that is not being sorted (i.e. right side)
            for (let i = pivot; i < arrayLen; i++) {
              vis.array.fadeOut(i);
            }
          },
          [p, right + 1]
        );
        QuickSort(a, left, p - 1, `${left}/${p - 1}`, depth + 1);

        chunker.add(
          4,
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
              1,
              left,
              right
            );
            for (let i = 0; i < updatedStack.length; i++) {
              for (let j = 0; j < updatedStack[i].length; j++) {
                if (j <= pivot) {
                  updatedStack[i][j] = Stack_color.Invisible;
                } else if (
                  i !== depth &&
                  updatedStack[i][j] !== Stack_color.Invisible &&
                  (j < left || j > right)
                ) {
                  updatedStack[i][j] = Stack_color.Gray;
                } else if (i !== depth && j >= left && j <= right) {
                  updatedStack[i][j] = Stack_color.Invisible;
                }
              }
            }
          },
          [p, right + 1]
        );
        QuickSort(a, p + 1, right, `${right}/${p + 1}`, depth + 1);
      }
      // array of size 1, already sorted
      else if (left < array.length) {
        chunker.add(
          2,
          (vis, l) => {
            vis.array.sorted(l);
          },
          [left]
        );
      }
      return a; // Facilitates testing
    }

    chunker.add(
      1,
      (vis, array) => {
        vis.array.set(array, 'quicksort');
        vis.array.setStack([new Array(nodes.length).fill(Stack_color.Invisible)]); // used for a custom stack visualisation
      },
      [nodes]
    );

    const result = QuickSort(
      nodes,
      0,
      nodes.length - 1,
      `0/${nodes.length - 1}`,
      0
    );
    // Fade out final node
    chunker.add(
      19,
      (vis, idx) => {
        vis.array.fadeOut(idx);
        // fade all elements back in for final sorted state
        for (let i = 0; i < nodes.length; i += 1) {
          vis.array.fadeIn(i);
        }
        vis.array.clearVariables();
        vis.array.setStack([]);
      },
      [nodes.length - 1]
    );
    return result;
  },
};
