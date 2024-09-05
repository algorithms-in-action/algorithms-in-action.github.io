// Merge sort for arrays, top down
// Adapted code from Quicksort...
// XXX Could do with a good clean up!
// Lots of crud, mostly abandonned attempt at QS-style stack display.
// Uses simple stack display like DFSrec; stack vanishes inside
// merge+copy because screen real-estate is limited and details of merge
// are independent of stack details anyway (may cause some surprise
// though)

import { msort_arr_bup } from '../explanations';

const run = run_msort();

export default {
  explanation: msort_arr_bup,
  initVisualisers,
  run
};


// XXX (was) Quicksort common code
// Example of a recursive algorithm that could serve as a guide to
// implementing others.  Some things to note:
// 1) A depth parameter is added to the recursive code and also passed
// to chunker.add()
// 2) Recursive calls are in code blocks that can be collapsed, so the
// whole recursive call can be done in a single step. To do this we must
// have chunks at the recursion level of the call at the start and end
// of the collapsed computation. Here the start chunk is a comment line.
// It does nothing but notes that the call on the next line is recursive.
// At the next step control goes back to the start of the function so
// an extra comment is not a bad thing to do for clarity in any case.
// The chunk after the recursive computation is at the line of code with
// the call, so the call is highlighted when it returns, as we would
// want.
// 4) There is chunk at the end of the whole computation that cleans up
// the final display a bit.

// There may be remnants of code from a previous version that didn't
// encapsulate the recursive calls properly

// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  areExpanded,
} from './collapseChunkPlugin';
import { node } from 'prop-types';

/////////////////////////////////////////////////////

// arrayB exists and is displayed only if MergeCopy is expanded
function isMergeCopyExpanded() {
  return areExpanded(['MergeCopy']);
}

// We don't strictly need isMergeExpanded: only needed if last chunk of
// merge still had extra vars displayed.  Some code still needs
// isMergeCopyExpanded because it uses arrayB
function isMergeExpanded() {
  return areExpanded(['MergeCopy', 'Merge']); // MergeCopy contains Merge
}

// -------------------------------------------------------------------------------

// Define helper functions
// without javascript Closure arguements (IE 'global variables')
// -----------------------------------------------------------------------------------

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

const highlight = (vis, index, isPrimaryColor = true) => {
  if (isPrimaryColor) {
    vis.array.select(index);
  } else {
    vis.array.patch(index);
  }
};

const highlightB = (vis, index, isPrimaryColor = true) => {
  if (isPrimaryColor) {
    vis.arrayB.select(index);
  } else {
    vis.arrayB.patch(index);
  }
};

// ----------------------------------------------------------------------

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

function assignVarToA(vis, variable_name, index) {
  if (index === undefined)
    vis.array.removeVariable(variable_name);
  else if (index > 11)
    vis.array.assignVariable(variable_name, 11)
  else
    vis.array.assignVariable(variable_name, index);
}

function displayRunlength(vis, runlength, size) {

  let text = 'runlength = ' + runlength;
  let index = runlength - 1;
  if (runlength > size) {
    assignVarToA(vis, text, size);
  }
  else {
    assignVarToA(vis, text, index);
  }
}

function assignVarToB(vis, variable_name, index) {
  if (index === undefined)
    vis.arrayB.removeVariable(variable_name);
  else
    vis.arrayB.assignVariable(variable_name, index);
}

function displayMergeLabels(vis, ap1, max1, ap2, max2, bp, size) {
  assignVarToA(vis, 'ap1', ap1);
  assignVarToA(vis, 'max1', max1);
  if (ap2 < size) {
    assignVarToA(vis, 'ap2', ap2);
  } else {
    assignVarToA(vis, 'ap2', size);
  }
  assignVarToA(vis, 'max2', max2);
  if (isMergeExpanded()) assignVarToB(vis, 'bp', bp);
}

const unhighlight = (vis, index, isPrimaryColor = true) => {
  if (isPrimaryColor) {
    vis.array.deselect(index);
  } else {
    vis.array.depatch(index);
  }
};

/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_msort() {

  return function run(chunker, { nodes }) {
    // can't rename from nodes

    // ----------------------------------------------------------------
    // Define 'global' variables
    // -----------------------------------------------------------------

    const entire_num_array = nodes;

    // ----------------------------------------------------------------
    // Define helper functions
    // ----------------------------------------------------------------

    function renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2) {
      if (isMergeExpanded()) {
        vis.array.set(a, 'msort_arr_bup');
        assignVarToA(vis, 'ap1', cur_ap1);
        assignVarToA(vis, 'max1', cur_max1);
        highlight(vis, cur_ap1, true);
        if (cur_ap2 < a.length) { // XXX 
          assignVarToA(vis, 'ap2', cur_ap2);
          highlight(vis, cur_ap2, true);
        } else {
          assignVarToA(vis, 'ap2', undefined);
        }
        assignVarToA(vis, 'max2', cur_max2);
        vis.arrayB.set(b, 'msort_arr_bup');
        assignVarToB(vis, 'bp', cur_bp);
        for (let i = cur_left; i < cur_bp; i++) {
          highlightB(vis, i, false);
        }
      }
    }

    //// start mergesort --------------------------------------------------------

    let A = nodes;
    let B = [...entire_num_array].fill(undefined);
    let runlength = 1; // length of run to merge
    const size = nodes.length - 1; // size of array

    chunker.add('Main', (vis, a, b, cur_length) => {
      vis.array.set(a, 'msort_arr_bup');
      if (cur_length === 1) {
        vis.array.setLargestValue(maxValue);
      }
      if (isMergeCopyExpanded()) {
        vis.arrayB.set(b, 'msort_arr_bup');
        vis.arrayB.setLargestValue(maxValue);
      }
    }, [A, B, size], length);

    chunker.add('runlength', (vis, cur_rlength, cur_size) => {
      displayRunlength(vis, cur_rlength, cur_size);
      highlight(vis, 0, true);
      highlight(vis, 1, false);
    }, [runlength, size]);

    while (runlength < size + 1) {
      let left = 0;

      chunker.add('MainWhile', (vis, cur_size) => {
        let size_txt = "size = " + (cur_size + 1);
        assignVarToA(vis, size_txt, cur_size);
      }, [size]);

      chunker.add('left', (vis, cur_left) => {
        assignVarToA(vis, 'left', cur_left);
      }, [left]);


      while ((left + runlength) < size + 1) {

        let mid = left + runlength - 1;
        let right = Math.min(mid + runlength, size);
        let ap1 = left;

        let max1 = mid;
        let ap2 = mid + 1;
        let max2 = right;
        let bp = left;

        chunker.add('MergeAllWhile', (vis, cur_left, cur_mid, cur_right) => {
          // note: need to generalise this in future
          // displayRunlength(vis, cur_rlength, cur_size);
          //assignVarToA(vis, 'runlength = 1', undefined);
          //assignVarToA(vis, 'size = 12', undefined);

          for (let i = cur_left; i <= cur_mid; i++) {
            highlight(vis, i, true);
          }
          for (let j = cur_mid + 1; j <= cur_right; j++) {
            highlight(vis, j, false);
          }

        }, [left, mid, right]);

        chunker.add('mid', (vis, cur_mid, cur_rlength, cur_size) => {
          // remove runlength and size labels

          console.log('size = ' + cur_size);
          assignVarToA(vis, ('runlength = ' + cur_rlength), undefined);
          assignVarToA(vis, ('size = ' + (cur_size + 1)), undefined);

          console.log("cur_mid = " + cur_mid);
          assignVarToA(vis, 'mid', cur_mid);
        }, [mid, runlength, size]);

        chunker.add('right', (vis, cur_right) => {
          assignVarToA(vis, 'right', cur_right);
        }, [right]);

        chunker.add('ap1', (vis, cur_ap1) => {
          console.log("cur_ap1 = " + cur_ap1);
          if (isMergeExpanded()) {
            assignVarToA(vis, 'left', undefined); // ap1 replaces left
            assignVarToA(vis, 'ap1', cur_ap1);
          }
        }, [ap1]);

        chunker.add('max1', (vis, cur_max1) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'mid', undefined); // max1 replaces mid
            assignVarToA(vis, 'max1', cur_max1);
          }
        }, [max1]);

        chunker.add('ap2', (vis, cur_ap2) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap2', cur_ap2);
          }
        }, [ap2]);

        chunker.add('max2', (vis, cur_max2) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'right', undefined); // max2 replaces right
            assignVarToA(vis, 'max2', cur_max2);
          }
        }, [max2]);

        chunker.add('bp', (vis, cur_bp) => {
          if (isMergeExpanded()) {
            assignVarToB(vis, 'bp', cur_bp);
          }
        }, [bp]);

        // while (ap1 <= max1 && ap2 <= max2) 
        /* eslint-disable no-constant-condition */
        while (true) {
          if (!(ap1 <= max1 && ap2 <= max2)) break;

          chunker.add('MergeWhile', (vis, cur_ap2, cur_max2) => {
            // turn all the elements from ap2 to max2 red
            // these are the elements that you are merging
            unhighlight(vis, cur_ap2, false);
            highlight(vis, cur_ap2, true);
          }, [ap2, max2]);

          chunker.add('findSmaller', () => {
            // no animation 
          }, []);

          if (A[ap1] < A[ap2]) {

            B[bp] = A[ap1];
            A[ap1] = undefined;

            chunker.add('copyap1', (vis, a, b, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp) => {

              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
              vis.array.set(a, 'msort_arr_bup');

              displayMergeLabels(vis, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp, size);

              for (let i = cur_ap1; i <= cur_max2; i++) {
                highlight(vis, i, true);
              }

              if (isMergeExpanded()) highlightB(vis, cur_bp, false); // the copied element should be highlighted green

            }, [A, B, ap1, max1, ap2, max2, bp]);

            ap1 = ap1 + 1;
            chunker.add('ap1++', (vis, cur_ap1) => {
              assignVarToA(vis, 'ap1', cur_ap1);
            }, [ap1]);

            bp = bp + 1;
            chunker.add('bp++', (vis, cur_bp) => {
              if (isMergeExpanded()) assignVarToB(vis, 'bp', cur_bp);
            }, [bp]);
          }

          else {
            chunker.add('findSmallerB', () => {
              // no animation
            }, []);

            B[bp] = A[ap2];
            A[ap2] = undefined;

            chunker.add('copyap2', (vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2) => {
              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
              vis.array.set(a, 'msort_arr_bup');
              displayMergeLabels(vis, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp, size);

              for (let i = cur_ap1; i <= cur_max2; i++) {
                highlight(vis, i, true);
              }
              if (isMergeExpanded()) highlightB(vis, cur_bp, false);
            }, [A, B, ap1, ap2, bp, max1, max2]);

            ap2 = ap2 + 1;
            chunker.add('ap2++', (vis, cur_ap2) => {
              assignVarToA(vis, "ap2", cur_ap2);
            }, [ap2]);

            bp = bp + 1;
            chunker.add('bp++_2', (vis, cur_bp) => {
              if (isMergeExpanded()) assignVarToB(vis, 'bp', cur_bp)
            }, [bp]);
          }
        }

        for (let i = ap1; i <= max1; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest1', (vis, a, b, cur_ap1, cur_max1) => {

          vis.array.set(a, 'msort_arr_bup');
          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
          assignVarToA(vis, 'ap1', cur_ap1);
          assignVarToA(vis, 'max1', cur_max1);

          /*if (isMergeExpanded()) {
            // vis.array.set(a, 'msort_arr_bup');

            // unhighlight(vis, cur_ap1, true);
            // assignVarToA(vis, 'ap1', undefined);
            // assignVarToA(vis, 'max1', undefined);
            if (cur_ap2 < a.length)
              assignVarToA(vis, 'ap2', cur_ap2);
            assignVarToA(vis, 'max2', cur_max2);
            vis.arrayB.set(b, 'msort_arr_bup');
            for (let i = cur_left; i <= cur_bp - 1; i++) {
              highlightB(vis, i, true);
            }
            if (cur_bp < a.length) {
              assignVarToB(vis, 'bp', cur_bp);
            } else {
              assignVarToB(vis, 'bp', undefined);  // XXX anination unclear?
            }
          }*/
        }, [A, B, ap1, max1]);

        for (let i = ap2; i <= max2; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest2', (vis, a, b, cur_ap2, cur_max2) => {
          vis.array.set(a, 'msort_arr_bup');
          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
          assignVarToA(vis, 'ap2', cur_ap2);
          assignVarToA(vis, 'max2', cur_max2);

          /*if (isMergeCopyExpanded()) {
            vis.array.set(a, 'msort_arr_bup');
            vis.arrayB.set(b, 'msort_arr_bup');
            for (let i = cur_left; i <= cur_right; i++) {
              highlightB(vis, i, false);
            }
          }
          if (isMergeExpanded()) {
            if (cur_ap2 < a.length) {
              //123unhighlight(vis, cur_ap2, true);
              assignVarToA(vis, 'ap2', undefined);
            }
            assignVarToA(vis, 'max2', undefined);
            assignVarToB(vis, 'bp', undefined);
          }*/
        }, [A, B, ap2, max2]);

        // copy merged elements from B to A
        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }
        chunker.add('copyBA', (vis, a, b, cur_left, cur_right) => {
          vis.array.set(a, 'msort_arr_bup');
          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');

          console.log("cur_left = " + cur_left);
          console.log("cur_right = " + cur_right);

          for (let i = cur_left; i <= cur_right; i++) {
            highlight(vis, i, false);
          }

          /*if (isMergeCopyExpanded()) {
            for (let i = cur_left; i <= cur_right; i++) {
              // unhighlightB(vis, i, false);
            }
            vis.arrayB.set(b, 'msort_arr_bup');
          }
          vis.array.set(a, 'msort_arr_bup');

          for (let i = cur_left; i <= cur_right; i++) {
            highlight(vis, i, false);
          }
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap1', undefined);
            assignVarToA(vis, 'max1', undefined);
            assignVarToA(vis, 'ap2', undefined);
            assignVarToA(vis, 'max2', undefined);
          }*/

        }, [A, B, left, right]);

        left = right + 1;

        chunker.add('left2', (vis, cur_left) => {
          assignVarToA(vis, 'left', cur_left);
          /*if (cur_left < size) {
            assignVarToA(vis, 'left', cur_left);
          }*/
        }, [left]);


      }


      runlength = 2 * runlength;
      chunker.add('runlength2', (vis, runlength) => {
        displayRunlength(vis, runlength, size);
      }, [runlength]);
    }

    // We compute and fix the max value in each array so they don't get re-scaled as we
    // shuffle elements between arrays
    const maxValue = entire_num_array.reduce((acc, curr) => (acc < curr ? curr : acc), 0);

    return A;
  }
}

