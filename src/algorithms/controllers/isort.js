/* eslint-disable no-unused-vars */
/* eslint-disable no-multi-spaces,indent,prefer-destructuring,brace-style */
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer_insertionSort';
import { colors } from '../../components/DataStructures/colors';

const pivotColor = colors.apple;
const focusColor = colors.apple;
const leftColor  = colors.leaf;
const waitColor  = colors.sky;
const finalColor = colors.stone;

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
        instance: new ArrayTracer('array', null, 'Array view', {
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

    const A = [...nodes, null, null];

    chunker.add(
      BK.INIT,
      (vis, arr) => {
        vis.array.set(arr, 'insertion-sort');
        vis.array.setStack?.([]);
        vis.array.clearVariables?.();

        // if (N > 0) vis.array.selectColor(0, leftColor);
        for (let k = 0; k < N; k++) vis.array.selectColor(k, waitColor);
      },
      [A]
    );

    for (let i = 1; i < N; i++) {
      const key = A[i];

      // NOTE: current pseudocode has j one more than the j here (and
      // the original pseudocode), hence the use of jVal+1 in various
      // spots and XXX possibly lingering jVal >= 0 tests
      let j = i - 1;

      chunker.add(
        BK.OUTER,
        (vis, idx, n) => {
          vis.array.selectColor(idx, pivotColor);
          for (let t = 0; t < idx; t++) vis.array.selectColor(t, leftColor);
          for (let t = idx + 1; t < n; t++) vis.array.selectColor(t, waitColor);
          vis.array.assignVariable?.('i', idx);
        },
        [i, N]
      );

      chunker.add(
        BK.K2TEMP,
        (vis, from, to) => {
          vis.array.swapElements(from, to);
          // vis.array.assignVariable?.('key', to);
        },
        [i, TEMP]
      );

      chunker.add(
        BK.JSET,
        (vis, jVal) => {
          if (jVal >= 0) {
            vis.array.assignVariable?.('j', jVal+1);
          } else { // XXX delete
            vis.array.removeVariable?.('j');
          }
        },
        [j]
      );

      /* eslint-disable no-constant-condition */
      while (true) {
        chunker.add(
          BK.WHILE,
          (vis, jVal) => {
            if (jVal >= 0) {
              vis.array.assignVariable?.('j', jVal+1);
              vis.array.selectColor(jVal, focusColor);
            } else { // XXX delete
              vis.array.removeVariable?.('j');
            }
          },
          [j]
        );
        if (!(j >= 0 && A[j] > key)) break; // exit while loop

        chunker.add(
          BK.SHIFT,
          (vis, l, r) => {
            vis.array.swapElements(l, r);
            vis.array.selectColor(r, leftColor);
          },
          [j, j + 1]
        );
        [A[j], A[j + 1]] = [A[j + 1], A[j]];

        j -= 1;
        chunker.add(
          BK.JDEC,
          (vis, jVal) => {
            if (jVal >= 0) {
              vis.array.assignVariable?.('j', jVal+1);
              // vis.array.selectColor(jVal, focusColor);
            } else { // XXX delete
              vis.array.removeVariable?.('j');
            }
          },
          [j]
        );
      }

      const place = j + 1;
      chunker.add(
        BK.PLACE,
        (vis, tempIdx, targetIdx, upto, n) => {
          vis.array.swapElements(tempIdx, targetIdx);
          vis.array.removeVariable?.('j');
          // vis.array.assignVariable?.('key', targetIdx);
          for (let t = 0; t <= upto; t++) vis.array.selectColor(t, leftColor);
          for (let t = upto + 1; t < n; t++) vis.array.selectColor(t, waitColor);
        },
        [TEMP, place, i, N]
      );

      A[place] = key;
      A[TEMP]  = null;
      A[SPACER] = null;

/*
      chunker.add(
        BK.WHILE,
        (vis, upto, n) => {
          for (let t = 0; t <= upto; t++) vis.array.selectColor(t, leftColor);
          for (let t = upto + 1; t < n; t++) vis.array.selectColor(t, waitColor);
        },
        [i, N]
      );
*/
    }

    chunker.add(
      BK.FINISH,
      (vis, n) => {
        for (let i = 0; i < n; i++) {
          vis.array.selectColor(i, finalColor);
          vis.array.fadeIn?.(i);
        }
        vis.array.clearVariables?.();
        vis.array.setStack?.([]);
      },
      [N]
    );

    return A;
  },
};





















