import { QSM3Exp } from '../explanations';
// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { updateStackElements } from './quickSort';

export default {

  explanation: QSM3Exp,

  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array view', { arrayItemMagnitudes: true }), // Label the input array as array view
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

    const swapAction = (b, n1, n2) => {
      chunker.add(b, (vis, _n1, _n2) => {
        vis.array.swapElements(_n1, _n2);
      }, [n1, n2]);
    };

    const noOp = () => {}; // no operation

    function partition(values, left, right) {
      const a = values;
      let tmp;


      // Find median of 3 to assign as pivot
      const mid = Math.floor((left + right) / 2);
      chunker.add(14, (vis, index) => {
        highlight(vis, index);
      }, [mid]);
      chunker.add(20, (vis, index) => {
        highlight(vis, index, false);
      }, [left]);
      if (a[left] > a[mid]) {
        // Swap a[left] and a[mid]
        tmp = a[left];
        a[left] = a[mid];
        a[mid] = tmp;
        swapAction(15, left, mid);
        chunker.add(21, (vis, index1, index2, index3) => {
          unhighlight(vis, index1);
          unhighlight(vis, index2, false);
          highlight(vis, index2);
          highlight(vis, index3, false);
        }, [left, mid, right]);
      } else {
        chunker.add(21, (vis, index1, index2) => {
          unhighlight(vis, index1, false);
          highlight(vis, index2, false);
        }, [left, right]);
      }
      if (a[mid] > a[right]) {
        // Swap a[right] and a[mid]
        tmp = a[right];
        a[right] = a[mid];
        a[mid] = tmp;
        swapAction(16, right, mid);
        chunker.add(22, (vis, index1, index2, index3) => {
          unhighlight(vis, index1, false);
          unhighlight(vis, index2);
          highlight(vis, index1);
          highlight(vis, index3, false);
        }, [mid, right, left]);
        if (a[left] > a[mid]) {
          // Swap a[left] and a[mid]
          tmp = a[left];
          a[left] = a[mid];
          a[mid] = tmp;
          swapAction(17, left, mid);
          chunker.add(18, (vis, index1, index2, index3) => {
            unhighlight(vis, index2);
            unhighlight(vis, index3, false);
            highlight(vis, index1, false);
            highlight(vis, index3);
          }, [right - 1, left, mid]);
        } else {
          chunker.add(18, (vis, index1, index2) => {
            unhighlight(vis, index1, false);
            highlight(vis, index2, false);
          }, [left, right - 1]);
        }
      } else {
        chunker.add(18, (vis, index1, index2) => {
          unhighlight(vis, index1, false);
          highlight(vis, index2, false);
        }, [right, right - 1]);
      }
      // Swap a[mid] and a[right-1]
      tmp = a[mid];
      a[mid] = a[right - 1];
      a[right - 1] = tmp;
      swapAction(18, mid, right - 1);
      // assign pivot
      const pivot = a[right - 1];

      // Partition array segment
      let i = left - 1;
      let j = right - 1;
      chunker.add(5, noOp);
      chunker.add(5, (vis, m, p) => {
        unhighlight(vis, m, false);
        vis.array.assignVariable('pivot', p);
      }, [mid, right - 1]);
      chunker.add(11, (vis, i1) => {
        if (i1 >= 0) {
          highlight(vis, i1, false);
          vis.array.assignVariable('i', i1);
        }
      }, [i]);
      chunker.add(12, (vis, j1) => {
        if (j1 >= 0) {
          highlight(vis, j1, false);
          vis.array.assignVariable('j', j1);
        }
      }, [j]);

      while (i < j) {
        chunker.add(6);
        do {
          i += 1;
          chunker.add(7, (vis, i1) => {
            if (i1 > 0) {
              unhighlight(vis, i1 - 1, false);
            }
            highlight(vis, i1, false);
            vis.array.assignVariable('i', i1);
          }, [i]);
        } while (a[i] < pivot);

        do {
          j -= 1;
          chunker.add(8, (vis, j1) => {
            unhighlight(vis, j1 + 1, false);
            if (j1 >= 0) {
              highlight(vis, j1, false);
              vis.array.assignVariable('j', j1);
            } else {
              vis.array.removeVariable('j');
            }
          }, [j]);
        } while (i <= j && pivot < a[j]);

        chunker.add(9);
        if (i < j) {
          tmp = a[j];
          a[j] = a[i];
          a[i] = tmp;
          swapAction(10, i, j);
        }
      }
      a[right - 1] = a[i];
      a[i] = pivot;
      swapAction(13, i, right - 1);
      chunker.add(13, (vis, i1, j1, r) => {
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
      }, [i, j, right - 1]);
      return [i, a]; // Return [pivot index, array values]
    }


    function QuickSort(array, left, right, _, depth) {
      let a = array;
      let p;
      chunker.add(2, (vis) => {
        let updatedStack = vis.array.stack;
        if (depth > vis.array.stack.length - 1) {
          updatedStack = updatedStack.concat([new Array(nodes.length).fill(0)]);
        }

        updatedStack = updateStackElements(updatedStack, depth, 1, left, right);
        for (let i = 0; i < updatedStack.length; i++) {
          for (let j = 0; j < updatedStack[i].length; j++) {
            if (updatedStack[i][j] === 0) continue;
            // eslint-disable-next-line max-len
            if (i !== depth && updatedStack[i][j] !== 0 && (j < left || j > right)) { updatedStack[i][j] = -1; }
            if (i !== depth && (j >= left && j <= right)) { updatedStack[i][j] = 0; }
          }
        }

        vis.array.setStack(updatedStack);
        vis.array.setStackDepth(depth);
      });
      if (left < right) {
        [p, a] = partition(a, left, right);

        chunker.add(3, (vis, pivot, arrayLen) => {
          vis.array.stack[depth][p] = 0;
          // fade out the part of the array that is not being sorted (i.e. right side)
          for (let i = pivot; i < arrayLen; i++) {
            vis.array.fadeOut(i);
          }
        }, [p, right + 1]);
        QuickSort(a, left, p - 1, `${left}/${p - 1}`, depth + 1);

        chunker.add(4, (vis, pivot, arrayLen) => {
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
          // eslint-disable-next-line max-len
          // note that this is just setting the state of elements in a 2D array which represents a stack and corresponding elements in the real array positionally in a row
          const updatedStack = updateStackElements(vis.array.stack, depth, 1, left, right);
          for (let i = 0; i < updatedStack.length; i++) {
            for (let j = 0; j < updatedStack[i].length; j++) {
              // eslint-disable-next-line max-len
              if (j <= pivot) { updatedStack[i][j] = 0; } else if (i !== depth && updatedStack[i][j] !== 0 && (j < left || j > right)) { updatedStack[i][j] = -1; } else if (i !== depth && (j >= left && j <= right)) { updatedStack[i][j] = 0; }
            }
          }
        }, [p, right + 1]);
        QuickSort(a, p + 1, right, `${right}/${p + 1}`, depth + 1);
      }
      // array of size 1, already sorted
      else if (left < array.length) {
        chunker.add(2, (vis, l) => {
          vis.array.sorted(l);
        }, [left]);
      }
      return a; // Facilitates testing
    }

    chunker.add(
      1,
      (vis, array) => {
        vis.array.set(array, 'quicksort');
        // eslint-disable-next-line max-len
        vis.array.setStack([new Array(nodes.length).fill(0)]); // used for a custom stack visualisation
      },
      [nodes],
    );

    const result = QuickSort(nodes, 0, nodes.length - 1, `0/${nodes.length - 1}`, 0);
    // Fade out final node
    chunker.add(19, (vis, idx) => {
      vis.array.fadeOut(idx);
      vis.array.clearVariables();
    }, [nodes.length - 1]);
    return result;
  },
};
