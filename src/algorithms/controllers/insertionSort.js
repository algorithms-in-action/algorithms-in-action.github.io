import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { colors } from '../../components/DataStructures/colors';

const pivotColor   = colors.leaf;   // key (element which is currently handling)
const focusColor   = colors.apple;  // the position which is currently comparing with
const leftColor    = colors.peach;  // sorted portion
const rightColor   = colors.sky;    // unsorted portion
const sortedColor  = colors.stone;  // complete sorting

const IS = {
  INIT: 1,
  OUTER_I: 2,
  SET_KEY_J: 3,
  WHILE_CHECK: 4,
  SHIFT_SWAP: 5,
  INSERT_DONE: 6,
  MARK_PREFIX: 7,
  FINISH: 8,
};

export default {
  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array view', {
          arrayItemMagnitudes: true,
        }),
        order: 0,
      },
    };
  },

  /**
   * @param {object} chunker
   * @param {{nodes:number[]}} param1
   */
  run(chunker, { nodes }) {
    // operate directly on nodes to ensure animations synchronize with data
    const A = nodes;

    // initialize display
    chunker.add(
      IS.INIT,
      (vis, arr) => {
        vis.array.set(arr, 'insertion-sort');
        vis.array.setStack([]);
        vis.array.clearVariables?.();

        if (arr.length > 0) vis.array.selectColor(0, leftColor);
        for (let k = 1; k < arr.length; k++) vis.array.selectColor(k, rightColor);
      },
      [A]
    );

    // main loop
    for (let i = 1; i < A.length; i++) {
      const key = A[i];
      let j = i - 1;
      let kpos = i; // key's current position

      // Highlight the key and update the colors of the left and right areas.
      chunker.add(
        IS.OUTER_I,
        (vis, idx) => {
          vis.array.selectColor(idx, pivotColor);
          for (let t = 0; t < idx; t++) vis.array.selectColor(t, leftColor);
          for (let t = idx + 1; t < A.length; t++) vis.array.selectColor(t, rightColor);
        },
        [i]
      );

      // show variable
      chunker.add(
        IS.SET_KEY_J,
        (vis, _i, _j) => {
          vis.array.assignVariable?.('key', _i);
          vis.array.assignVariable?.('j', _j);
        },
        [i, j]
      );

      // Shift the key progressively to the left: Use swapElements for a unified animation.
      while (j >= 0 && A[j] > key) {
        // highlight comparation
        chunker.add(
          IS.WHILE_CHECK,
          (vis, _j, _kpos) => {
            vis.array.selectColor(_j, focusColor);
            vis.array.selectColor(_kpos, focusColor);
            vis.array.assignVariable?.('j', _j);
          },
          [j, kpos]
        );

        // Swap: Swap A[j] with the current position of key, equivalent to shifting key one position to the left.
        [A[j], A[kpos]] = [A[kpos], A[j]];
        const l = j, r = kpos;

        chunker.add(
          IS.SHIFT_SWAP,
          (vis, _l, _r) => {
            vis.array.swapElements(_l, _r);
          },
          [l, r]
        );

        kpos = j;
        j--;
      }

      // Clear temporary highlights and variables
      chunker.add(
        IS.INSERT_DONE,
        (vis, p) => {
          vis.array.deselect(p);
          vis.array.removeVariable?.('j');
          vis.array.assignVariable?.('key', p);
        },
        [kpos]
      );

      // Marked prefix [0..i] as sorted
      chunker.add(
        IS.MARK_PREFIX,
        (vis, upto) => {
          for (let t = 0; t <= upto; t++) vis.array.selectColor(t, sortedColor);
        },
        [i]
      );
    }

    // Final state: Set all to sortedColor, clean up variables and stack
    chunker.add(
      IS.FINISH,
      (vis, n) => {
        for (let i = 0; i < n; i++) {
          vis.array.selectColor(i, sortedColor);
          vis.array.fadeIn?.(i);
        }
        vis.array.clearVariables?.();
        vis.array.setStack([]);
      },
      [A.length]
    );

    return A;
  },
};
