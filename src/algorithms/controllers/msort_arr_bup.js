// Merge sort for arrays, bottom up
// Adapted code from merge sort, top down

import { msort_arr_bup } from '../explanations';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';


import {
  isMergeCopyExpanded,
  isMergeExpanded,
  highlight,
  highlightB,
  highlight2Runlength,
  assignVarToA,
  assignVarToB,
  displayMergeLabels,
  highlightAPointers,
  set_simple_stack,
  resetArrayA,
  highlightFromTo
} from './msort_shared.js';


const run = run_msort();

const apColor = "green";   // replace with red
const runAColor = "red";   // replace with orange
const runBColor = "green"; // replace with blue
const runCColor = "red";  // replace all instances of runCColor with runBColor
const sortColor = "green";


export default {
  explanation: msort_arr_bup,
  initVisualisers,
  run
};

// We hide array B entirely if things mergeCopy is collapsed
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

// -------------------------------------------------------------------------------
// Define helper functions
// -------------------------------------------------------------------------------


// Highlight entire array alternating colors for runlength
function highlightAllRunlengths(vis, runlength, runAColor, runBColor, size) {
  let toggle = 0; // 0 = runAColor, 1 = runBColor
  for (let i = 0; i < size; i++) {
    if (toggle == 0) highlight(vis, i, runAColor);
    if (toggle == 1) highlight(vis, i, runBColor);

    // Switch color after completing a run of length 'runlength'
    if ((i + 1) % runlength == 0) {
      toggle = 1 - toggle; // Flip toggle between 0 and 1
    }
  }
}



/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_msort() {

  return function run(chunker, { nodes }) { // cannot rename nodes

    // ----------------------------------------------------------------
    // Define define global variables
    // ----------------------------------------------------------------

    const entire_num_array = nodes;
    const size = nodes.length; // size of the array

    //// start mergesort --------------------------------------------------------

    let A = nodes;
    let B = [...entire_num_array].fill(undefined);
    let runlength = 1; // length of run to merge

    chunker.add('Main', (vis, a, b, c_length) => {
      vis.array.set(a, 'msort_arr_bup');
      if (c_length === 1) {
        vis.array.setLargestValue(maxValue);
      } if (isMergeCopyExpanded()) {
        vis.arrayB.set(b, 'msort_arr_bup');
        vis.arrayB.setLargestValue(maxValue);
      }
    }, [A, B, runlength]);

    chunker.add('runlength', (vis, c_rlength) => {
      assignVarToA(vis, "runlength", c_rlength - 1, size);
      set_simple_stack(vis.array, [`runlength = ${c_rlength}`]);
      highlightAllRunlengths(vis, c_rlength, runAColor, runBColor, size);
    }, [runlength]);

    while (runlength < size) {

      let left = 0;

      chunker.add('MainWhile', (vis) => {
        assignVarToA(vis, "size", size, size);
      }, []);

      chunker.add('left', (vis, a, c_left, c_rlength) => {
        vis.array.set(a, 'msort_arr_bup'); // unhighlight arrayA
        assignVarToA(vis, 'left', c_left, size);
        set_simple_stack(vis.array, [`runlength = ${c_rlength}`]);
        let left_2 = c_left;
        let mid_2 = (c_rlength + c_left - 1);
        let right_2 = (Math.min(c_rlength * 2, size) - 1);
        // highlight2Runlength(vis, left_2, mid_2, right_2, runAColor, runBColor);
      }, [A, left, runlength]);

      while ((left + runlength) <= size) {
        chunker.add('MergeAllWhile', () => {
          //no animation
        }, []);

        let mid = left + runlength - 1;
        let right = Math.min(mid + runlength, (size - 1));
        chunker.add('mid', (vis, c_mid, c_left) => {
          assignVarToA(vis, 'mid', c_mid, size);
          highlightFromTo(vis, c_left, c_mid, runAColor);
        }, [mid, left]);
        chunker.add('right', (vis, c_right, c_mid) => {
          assignVarToA(vis, 'right', c_right, size);
          highlightFromTo(vis, c_mid + 1, c_right, runBColor);

        }, [right, mid]);

        // start merge[left, mid, right] ------------------------------------------------------------
        let ap1 = left;
        let max1 = mid;
        let ap2 = mid + 1;
        let max2 = right;
        let bp = left;


        chunker.add('ap1', (vis, a, c_ap1, c_left, c_mid, c_right, c_rlength) => {
          // future color: should be runAColor & runBColor
          resetArrayA(vis, "bup", a, c_left, c_mid, c_right, c_rlength, runAColor, runCColor);
          if (isMergeExpanded()) {
            assignVarToA(vis, 'left', undefined, size); // ap1 replaces left
            assignVarToA(vis, 'ap1', c_ap1, size);
            assignVarToA(vis, 'mid', c_mid, size);
            assignVarToA(vis, 'right', c_right, size);
          }
        }, [A, ap1, left, mid, right, runlength]);
        chunker.add('max1', (vis, c_max1) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'mid', undefined, size); // max1 replaces mid
            assignVarToA(vis, 'max1', c_max1, size);
          }
        }, [max1]);
        chunker.add('ap2', (vis, c_ap2) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap2', c_ap2, size);
          }
        }, [ap2]);
        chunker.add('max2', (vis, c_max2, c) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'right', undefined, size); // max2 replaces right
            assignVarToA(vis, 'max2', c_max2, size);
          }
        }, [max2]);
        chunker.add('bp', (vis, c_bp) => {
          if (isMergeExpanded()) {
            assignVarToB(vis, 'bp', c_bp, size);
          }
        }, [bp]);

        // while (ap1 <= max1 && ap2 <= max2)
        /* eslint-disable no-constant-condition */
        while (true) {
          if (!(ap1 <= max1 && ap2 <= max2)) break;

          chunker.add('MergeWhile', (vis, c_ap1, c_max1, c_ap2, c_max2) => {
            highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
          }, [ap1, max1, ap2, max2]);

          if (A[ap1] < A[ap2]) {
            chunker.add('findSmaller', () => {
              // no animation 
            }, []);
            B[bp] = A[ap1];
            A[ap1] = undefined;
            chunker.add('copyap1', (vis, a, b, c_ap1, c_max1, c_ap2, c_max2, c_bp, c_left, c_right, c_mid, c_rlength) => {
              // future color: should be runAColor & runBColor
              resetArrayA(vis, "bup", a, c_left, c_mid, c_right, c_rlength, runAColor, runCColor);
              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
              for (let i = c_left; i <= c_bp; i++) highlightB(vis, i, sortColor); // sorted in B highligted green
            }, [A, B, ap1, max1, ap2, max2, bp, left, right, mid, runlength]);
            ap1 = ap1 + 1;
            chunker.add('ap1++', (vis, a, c_left, c_mid, c_right, c_rlength, c_ap1, c_max1, c_ap2, c_max2, c_bp) => {
              // future color: should be runAColor & runBColor
              resetArrayA(vis, "bup", a, c_left, c_mid, c_right, c_rlength, runAColor, runCColor);
              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
            }, [A, left, mid, right, runlength, ap1, max1, ap2, max2, bp]);
            bp = bp + 1;
            chunker.add('bp++', (vis, c_bp) => {
              assignVarToB(vis, 'bp', c_bp, size);
            }, [bp]);
          }

          else {
            chunker.add('findSmallerB', () => {
              // no animation
            }, []);
            B[bp] = A[ap2];
            A[ap2] = undefined;
            chunker.add('copyap2', (vis, a, b, c_ap1, c_ap2, c_bp, c_max1, c_max2, c_left, c_right, c_mid, c_rlength) => {
              // future color: should be runAColor & runBColor
              resetArrayA(vis, "bup", a, c_left, c_mid, c_right, c_rlength, runAColor, runCColor);
              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
              // highlight sorted elements green / colorB
              for (let i = c_left; i <= c_bp; i++) highlightB(vis, i, sortColor)
            }, [A, B, ap1, ap2, bp, max1, max2, left, right, mid, runlength]);
            ap2 = ap2 + 1;
            chunker.add('ap2++', (vis, a, c_left, c_mid, c_right, c_rlength,
              c_ap1, c_max1, c_ap2, c_max2, c_bp) => {
              // future color: should be runAColor & runBColor
              resetArrayA(vis, "bup", a, c_left, c_mid, c_right, c_rlength, runAColor, runCColor);
              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
            }, [A, left, mid, right, runlength, ap1, max1, ap2, max2, bp]);
            bp = bp + 1;
            chunker.add('bp++_2', (vis, c_bp) => {
              assignVarToB(vis, 'bp', c_bp, size)
            }, [bp]);
          }
        }

        // copying A[ap1..max1]
        for (let i = ap1; i <= max1; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }
        chunker.add('CopyRest1', (vis, a, b, c_ap1, c_max1, c_left, c_right, c_mid, c_bp, c_rlength) => {
          // future color: should be runAColor & runBColor
          resetArrayA(vis, "bup", a, c_left, c_mid, c_right, c_rlength, runAColor, runCColor);
          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
          assignVarToA(vis, 'ap1', c_ap1, size);
          assignVarToA(vis, 'max1', c_max1, size);
          // to highlight the solrted elements of B array green / colorC
          for (let i = c_left; i < c_bp; i++) highlightB(vis, i, sortColor);
        }, [A, B, ap1, max1, left, right, mid, bp, runlength]);

        for (let i = ap2; i <= max2; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest2', (vis, a, b, c_ap2, c_max2, c_left, c_right, c_mid, c_rlength) => {
          // future color: should be runAColor & runBColor
          resetArrayA(vis, "bup", a, c_left, c_mid, c_right, c_rlength, runAColor, runCColor);

          if (isMergeCopyExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
          assignVarToA(vis, 'ap2', c_ap2, size);
          assignVarToA(vis, 'max2', c_max2, size);

          // highlight sorted elements green
          for (let i = c_left; i <= c_right; i++) highlightB(vis, i, sortColor);

        }, [A, B, ap2, max2, left, right, mid, runlength]);

        // copy merged elements from B to A
        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }

        chunker.add('copyBA', (vis, a, b, c_left, c_right, c_rlength) => {
          vis.array.set(a, 'msort_arr_bup');
          set_simple_stack(vis.array, [`runlength = ${c_rlength}`]);

          if (isMergeCopyExpanded()) {
            vis.arrayB.set(b, 'msort_arr_bup');
          }

          // highlight all sorted elements green

          for (let i = c_left; i <= c_right; i++) highlight(vis, i, sortColor);

          assignVarToA(vis, "left", c_left, size);
          assignVarToA(vis, "right", c_right, size);

        }, [A, B, left, right, runlength]);

        left = right + 1;

        chunker.add('left2', (vis, a, c_left, c_right, c_rlength) => {
          vis.array.set(a, 'msort_arr_bup'); //unhighlight array a
          set_simple_stack(vis.array, [`runlength = ${c_rlength}`]);

          if (c_left < size) assignVarToA(vis, 'left', c_left, size);
          assignVarToA(vis, "right", c_right, size);

        }, [A, left, right, runlength]);

      }

      runlength = 2 * runlength;

      chunker.add('mergeDone', (vis, c_rlength) => {
        assignVarToA(vis, "right", undefined, size);
        highlightAllRunlengths(vis, c_rlength, runAColor, runBColor, size);
      }, [runlength])

      chunker.add('runlength2', (vis, c_rlength) => {

        assignVarToA(vis, 'left', undefined, size);
        set_simple_stack(vis.array, [`runlength = ${c_rlength}`]);

        if (c_rlength < size) {
          assignVarToA(vis, "runlength", c_rlength - 1, size);
        }


      }, [runlength]);
    }

    chunker.add('Done', (vis) => {
      for (let i = 0; i < size; i++) {
        highlight(vis, i, sortColor);
      }

      set_simple_stack(vis.array, ["DONE"]);

    }, []);


    // We compute and fix the max value in each array so they don't get re-scaled as we
    // shuffle elements between arrays
    const maxValue = entire_num_array.reduce((acc, curr) => (acc < curr ? curr : acc), 0);

    return A;
  }
}

