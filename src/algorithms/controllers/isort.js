// insertion sort
// Adapted from student version that used wrong pseudocode; some names
// etc could be improved.

/* eslint-disable no-unused-vars */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring,brace-style */
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import {
  areExpanded,
} from './collapseChunkPlugin';

// Moving to new color scheme
// We use the color names directly rather than the trivial mapping here:
// ../../components/DataStructures/colors

const pivotColor = "var(--apple)";
const focusColor = "var(--peach)";
const leftColor  = "var(--leaf)";
const waitColor  = "var(--sky)";
const finalColor = "var(--stone)";

const BK = {
  INIT: 1,
  OUTER: 2,
  K2TEMP: 3,
  JSET: 4,
  WHILE: 5,
  SHIFT: 6,
  JDEC: 7,
  PLACE: 8,
  FINISH: 20,
};

export default {
  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array A', {
          arrayItemMagnitudes: true,
        }),
        order: 0,
      },
    };
  },

  run(chunker, { nodes }) {
    const N = nodes.length;

    const SPACER = N;
    const TEMP   = N + 1;

    const A = [...nodes];

    // If expanded, we have the input array then a gap then temp, so we
    // can swap elements with temp using tweening, otherwise we just
    // have the input array (and must avoid swaps with temp)
    chunker.add(
      BK.INIT,
      (vis, arr, s) => {
        if (areExpanded(['Insert'])) {
          vis.array.set([...arr, null, null], 'insertion-sort');
          vis.array.columnGap(s);
          vis.array.columnGapIndex('temp');
        } else {
          vis.array.set(arr, 'insertion-sort');
        }
        // for (let k = 0; k < N; k++)
          // vis.array.setColor(k, waitColor);
      },
      [A, SPACER]
    );
    // [A[0], A[1]] = [A[1], A[0]];

    for (let i = 1; i < N; i++) {
      const key = A[i];

      // NOTE: current pseudocode has j one more than the j here (and
      // the original pseudocode), hence the use of jVal+1 in various
      // spots
      let j = i - 1;

      chunker.add(
        BK.OUTER,
        (vis, idx, n) => {
          vis.array.setColor(idx, pivotColor);
          for (let t = 0; t < idx; t++) vis.array.setColor(t, leftColor);
          // for (let t = idx + 1; t < n; t++) vis.array.setColor(t, waitColor);
          vis.array.assignVariable?.('i', idx);
        },
        [i, N]
      );

      chunker.add(
        BK.K2TEMP,
        (vis, i, ti) => {
          if (areExpanded(['Insert'])) {
            vis.array.swapElements(i, ti);
          }
          // do we need to assign temp to array.???[i] - no:)
        },
        [i, TEMP]
      );

      chunker.add(
        BK.JSET,
        (vis, jVal) => {
          vis.array.assignVariable?.('j', jVal+1);
        },
        [j]
      );

      /* eslint-disable no-constant-condition */
      while (true) {
        chunker.add(
          BK.WHILE,
          (vis, jVal) => {
            vis.array.assignVariable?.('j', jVal+1);
            if (jVal >= 0) {
              vis.array.setColor(jVal, focusColor);
            }
          },
          [j]
        );
        if (!(j >= 0 && A[j] > key)) break; // exit while loop

        chunker.add(
          BK.SHIFT,
          (vis, l, r) => {
            vis.array.swapElements(l, r);
            vis.array.setColor(r, leftColor);
          },
          [j, j + 1]
        );
        [A[j], A[j + 1]] = [A[j + 1], A[j]];

        j -= 1;
        chunker.add(
          BK.JDEC,
          (vis, jVal) => {
            vis.array.assignVariable?.('j', jVal+1);
          },
          [j]
        );
      }

      const place = j + 1;
      chunker.add(
        BK.PLACE,
        (vis, tempIdx, targetIdx, upto, n) => {
          if (areExpanded(['Insert'])) {
            vis.array.swapElements(tempIdx, targetIdx);
          }
          vis.array.removeVariable?.('j');
          for (let t = 0; t <= upto; t++) vis.array.setColor(t, leftColor);
          // for (let t = upto + 1; t < n; t++) vis.array.setColor(t, waitColor);
        },
        [TEMP, place, i, N]
      );

      A[place] = key;
      A[TEMP]  = null;
      A[SPACER] = null;
    }

    chunker.add(
      BK.FINISH,
      (vis, n) => {
        for (let i = 0; i < n; i++) {
          vis.array.setColor(i, finalColor);
          vis.array.fadeIn?.(i);
        }
        vis.array.clearVariables?.();
      },
      [N]
    );

    return A;
  },
};





















