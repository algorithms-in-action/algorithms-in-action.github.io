// Merge sort for arrays, natural
// Adapted code from merge sort, top down

import { msort_arr_nat } from '../explanations';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  isMergeCopyExpanded,
  isMergeExpanded,
  highlight,
  highlightB,
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
const runCColor = "red"; // replace all instances with runBColor
const sortColor = "green";

export default {
  explanation: msort_arr_nat,
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

// This function highlights all the runs alternating colours, kudos to chatgpt
function highlightNaturalRuns(vis, array, runAColor, runBColor) {
  let toggle = 0; // 0 = runAColor, 1 = runBColor
  let i = 0;

  while (i < array.length) {
    let start = i;

    // Find the length of the increasing run
    while (i < array.length - 1 && array[i] <= array[i + 1]) {
      i++;
    }

    // Highlight the run
    for (let j = start; j <= i; j++) {
      highlight(vis, j, toggle == 0 ? runAColor : runBColor);
    }

    // Flip toggle between 0 and 1 for the next run
    toggle = 1 - toggle;

    // Move to the next element after the current run
    i++;
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
    let runcount = 0; // number of runs merged


    //let setLargestValue = 0;

    chunker.add('Main', (vis, a, b, c_rcount) => {
      vis.array.set(a, 'msort_arr_nat');
      if (c_rcount === 0) {
        vis.array.setLargestValue(maxValue);
      } if (isMergeCopyExpanded()) {
        vis.arrayB.set(b, 'msort_arr_nat');
        vis.arrayB.setLargestValue(maxValue);
      }
    }, [A, B, runcount]);

    do {

      chunker.add('MainWhile', (vis, a) => {
        // no animation
        highlightNaturalRuns(vis, a, runAColor, runBColor);
      }, [A]);



      runcount = 0;
      let left = 0;

      chunker.add('runcount', (vis, a, c_rcount) => {
        vis.array.set(a, 'msort_arr_nat');
        set_simple_stack(vis.array, [`runcount = ${c_rcount}`]);

      }, [A, runcount]);

      chunker.add('left', (vis, c_left) => {
        assignVarToA(vis, 'left', c_left, size);
        // assignVarToA(vis, "size", size, size);
      }, [left]);

      do {
        chunker.add('MergeAllWhile', () => {
          // no animation
        }, []);

        // finding the first run, A[left..mid]
        let mid = left;
        chunker.add('mid', (vis, c_mid) => {
          if (mid < size) {
            assignVarToA(vis, 'mid', c_mid, size);
            highlight(vis, c_mid, runAColor);
          }
        }, [mid]);
        while (mid < size && A[mid] <= A[mid + 1]) {
          chunker.add('FirstRunWhile', () => {
            //no animation
          }, []);
          mid = mid + 1;
          chunker.add('mid++', (vis, c_mid) => {
            assignVarToA(vis, 'mid', c_mid, size);
            highlight(vis, (c_mid), runAColor);
          }, [mid]);
        }

        // finding the second run, A[mid+1..right]
        let right = mid + 1;
        chunker.add('right', (vis, c_right) => {
          if (right < size) {
            assignVarToA(vis, 'right', c_right, size);
            highlight(vis, c_right, runBColor);
          }
        }, [right]);
        while (right < size & A[right] <= A[right + 1]) {
          chunker.add('SecondRunWhile', () => {
            // no animation
          }, []);
          right = right + 1
          chunker.add('right++', (vis, c_right) => {
            assignVarToA(vis, 'right', c_right, size);
            highlight(vis, (c_right), runBColor);
          }, [right]);
        }

        if (mid < size - 1) {
          chunker.add('ifmidsize', (vis, a, c_left, c_mid, c_right, c_rcount) => {
            // future color: should be runAColor & runBColor
            resetArrayA(vis, "nat", a, c_left, c_mid, c_right, c_rcount, runAColor, runCColor);
            assignVarToA(vis, 'left', c_left, size);
            assignVarToA(vis, 'mid', c_mid, size);
            assignVarToA(vis, 'right', c_right, size);
          }, [A, left, mid, right, runcount]);

          // start merge[left, mid, right] ------------------------------------------------------------
          let ap1 = left;
          let max1 = mid;
          let ap2 = mid + 1;
          let max2 = right;
          let bp = left;

          chunker.add('ap1', (vis, c_ap1) => {
            if (isMergeExpanded()) {
              assignVarToA(vis, 'left', undefined, size); // ap1 replaces left
              assignVarToA(vis, 'ap1', c_ap1, size);
            }
          }, [ap1]);
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
          chunker.add('max2', (vis, c_max2) => {
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
          // compare ap1 with ap2
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
              chunker.add('copyap1', (vis, a, b, c_ap1, c_max1, c_ap2, c_max2, c_bp, c_left, c_right, c_mid, c_rcount) => {
                // future color: should be runAColor & runBColor
                resetArrayA(vis, "nat", a, c_left, c_mid, c_right, c_rcount, runAColor, runCColor);
                if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_nat');
                displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
                highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
                // highlight sorted elements green
                for (let i = c_left; i <= c_bp; i++) highlightB(vis, i, sortColor);
              }, [A, B, ap1, max1, ap2, max2, bp, left, right, mid, runcount]);
              ap1 = ap1 + 1;
              chunker.add('ap1++', (vis, a, c_left, c_mid, c_right, c_rcount,
                c_ap1, c_max1, c_ap2, c_max2, c_bp) => {
                // future color: should be runAColor & runBColor
                resetArrayA(vis, "nat", a, c_left, c_mid, c_right, c_rcount, runAColor, runCColor);
                displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
                highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
              }, [A, left, mid, right, runcount, ap1, max1, ap2, max2, bp]);
              bp = bp + 1;
              chunker.add('bp++', (vis, c_bp) => {
                assignVarToB(vis, 'bp', c_bp, size);
              }, [bp]);
            }

            else {
              chunker.add('findSmallerB', () => {
                //no animation
              }, []);
              B[bp] = A[ap2];
              A[ap2] = undefined;
              chunker.add('copyap2', (vis, a, b, c_ap1, c_ap2, c_bp, c_max1, c_max2, c_left, c_right, c_mid, c_rcount) => {
                // future color: should be runAColor & runBColor
                resetArrayA(vis, "nat", a, c_left, c_mid, c_right, c_rcount, runAColor, runCColor);
                if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_nat');
                displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
                highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
                // highlight sorted elements green / colorB
                for (let i = c_left; i <= c_bp; i++) highlightB(vis, i, sortColor)
              }, [A, B, ap1, ap2, bp, max1, max2, left, right, mid, runcount]);
              ap2 = ap2 + 1;
              chunker.add('ap2++', (vis, a, c_left, c_mid, c_right, c_rlength,
                c_ap1, c_max1, c_ap2, c_max2, c_bp) => {
                // future color: should be runAColor & runBColor
                resetArrayA(vis, "nat", a, c_left, c_mid, c_right, c_rlength, runAColor, runCColor);
                displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
                highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, apColor);
              }, [A, left, mid, right, runcount, ap1, max1, ap2, max2, bp]);
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
          chunker.add('CopyRest1', (vis, a, b, c_ap1, c_max1, c_left, c_right, c_mid, c_bp, c_rcount) => {
            // future color: should be runAColor & runBColor
            resetArrayA(vis, "nat", a, c_left, c_mid, c_right, c_rcount, runAColor, runCColor);
            if (isMergeExpanded()) {
              vis.arrayB.set(b, 'msort_arr_nat');
              assignVarToB(vis, 'bp', c_bp, size);
            }
            assignVarToA(vis, 'ap1', c_ap1, size);
            assignVarToA(vis, 'max1', c_max1, size);

            // to highlight the solrted elements of B array green / colorC
            for (let i = c_left; i < c_bp; i++) highlightB(vis, i, sortColor);
          }, [A, B, ap1, max1, left, right, mid, bp, runcount]);

          // copying A[ap2..max2]
          for (let i = ap2; i <= max2; i++) {
            B[bp] = A[i];
            A[i] = undefined;
            bp = bp + 1;
          }
          chunker.add('CopyRest2', (vis, a, b, c_ap2, c_max2, c_left, c_right, c_mid, c_rcount, c_bp) => {
            // future color: should be runAColor & runBColor
            resetArrayA(vis, "nat", a, c_left, c_mid, c_right, c_rcount, runAColor, runCColor);
            if (isMergeCopyExpanded()) {
              vis.arrayB.set(b, 'msort_arr_nat');
              assignVarToB(vis, 'bp', c_bp, size);

            }
            assignVarToA(vis, 'ap2', c_ap2, size);
            assignVarToA(vis, 'max2', c_max2, size);
            // highlight sorted elements green
            for (let i = c_left; i <= c_right; i++) highlightB(vis, i, sortColor);
          }, [A, B, ap2, max2, left, right, mid, runcount, bp]);

          // copy merged elements from B to A
          for (let i = left; i <= right; i++) {
            A[i] = B[i];
            B[i] = undefined;
          }
          chunker.add('copyBA', (vis, a, b, c_left, c_right, c_rcount) => {
            vis.array.set(a, 'msort_arr_nat');
            if (isMergeCopyExpanded()) vis.arrayB.set(b, 'msort_arr_nat');
            // highlight all sorted elements green
            for (let i = c_left; i <= c_right; i++) highlight(vis, i, sortColor);
            set_simple_stack(vis.array, [`runcount = ${c_rcount}`]);

            assignVarToA(vis, "left", c_left, size);
            assignVarToA(vis, "right", c_right, size);

          }, [A, B, left, right, runcount]);
        }

        runcount = runcount + 1;
        chunker.add('runcount+', (vis, c_left, c_mid, c_rcount) => {
          highlightFromTo(vis, c_left, c_mid, sortColor);
          set_simple_stack(vis.array, [`runcount = ${c_rcount}`]);
        }, [left, mid, runcount]);

        left = right + 1;
        chunker.add('left2', (vis, a, c_left, c_right, c_rcount) => {
          vis.array.set(a, 'msort_arr_nat'); // unhighlight array a
          set_simple_stack(vis.array, [`runcount = ${c_rcount}`]);
          if (c_left < size) {
            assignVarToA(vis, 'left', c_left, size);
            assignVarToA(vis, "right", c_right, size);
          }
          // assignVarToA(vis, "size", size, size);


        }, [A, left, right, runcount]);

      } while (left < size);

      chunker.add('mergeDone', (vis, a) => {
        highlightNaturalRuns(vis, a, runAColor, runBColor);
      }, [A])

    } while (runcount > 1);

    chunker.add('Done', (vis, a) => {
      vis.array.set(a, 'msort_arr_nat');
      for (let i = 0; i < size; i++) {
        highlight(vis, i, sortColor);
      }

      set_simple_stack(vis.array, ["DONE"]);
    }, [A]);

    const maxValue = entire_num_array.reduce((acc, curr) => (acc < curr ? curr : acc), 0);

    return A;
  }
}
