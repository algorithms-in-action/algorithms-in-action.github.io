// Merge sort for arrays, bottom up
// Adapted code from merge sort, top down

import { msort_arr_bup } from '../explanations';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import {
  areExpanded,
} from './collapseChunkPlugin';


const run = run_msort();

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
// -------------------------------------------------------------------------------

// Highlights Array A either red or green
// Can add more colours in future
function highlight(vis, index, color) {
  if (color == 'red') {
    vis.array.select(index);
  }
  if (color == 'green') {
    vis.array.patch(index);
  }
}
// Same as highlight() but checks isMergeExpanded()/arrayB is displayed, otherwise does nothing
function highlightB(vis, index, color) {
  if (isMergeExpanded()) {
    if (color == 'red') {
      vis.arrayB.select(index);
    }
    if (color == 'green') {
      vis.arrayB.patch(index);
    }
  }
}

// unhighlights arrayA
function unhighlight(vis, index, color) {
  if (color == 'red') {
    vis.array.deselect(index);
  }
  if (color == 'green') {
    vis.array.depatch(index);
  }
}

// Assigns label to array A at index, checks if index is greater than size of array
// if index is greater than size, assign label to last element in array
function assignVarToA(vis, variable_name, index, size) {
  if (index === undefined)
    vis.array.removeVariable(variable_name);
  else if (index >= size)
    vis.array.assignVariable(variable_name, size - 1)
  else
    vis.array.assignVariable(variable_name, index);
}

// Same as above function bet also checks if array B is displayed
function assignVarToB(vis, variable_name, index, size) {
  if (isMergeExpanded()) {
    if (index === undefined)
      vis.arrayB.removeVariable(variable_name);
    else if (index >= size)
      vis.arrayB.assignVariable(variable_name, size - 1);
    else
      vis.arrayB.assignVariable(variable_name, index);
  }
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



function displayMergeLabels(vis, ap1, max1, ap2, max2, bp, size) {
  assignVarToA(vis, 'ap1', ap1, size);
  assignVarToA(vis, 'max1', max1, size);
  assignVarToA(vis, 'ap2', ap2, size);
  assignVarToA(vis, 'max2', max2, size);
  if (isMergeExpanded()) assignVarToB(vis, 'bp', bp, size);
}



/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_msort() {

  return function run(chunker, { nodes }) {
    // can't rename from nodes

    // ----------------------------------------------------------------
    // Define define global variables
    // ----------------------------------------------------------------

    const entire_num_array = nodes;
    const size = nodes.length; // size of array

    //// start mergesort --------------------------------------------------------

    let A = nodes;
    let B = [...entire_num_array].fill(undefined);
    let runlength = 1; // length of run to merge


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
    }, [runlength, size]);

    while (runlength < size) {
      let left = 0;

      chunker.add('MainWhile', (vis, cur_size, cur_rlength) => {
        let size_txt = "size = " + (cur_size);
        assignVarToA(vis, size_txt, cur_size, size);

        for (let i = 0; i < cur_rlength; i++) {
          highlight(vis, i, 'red');
        }
        for (let j = cur_rlength; j < Math.min(cur_rlength * 2, cur_size); j++) {
          highlight(vis, j, 'green');
        }

      }, [size, runlength]);


      chunker.add('left', (vis, cur_left) => {
        assignVarToA(vis, 'left', cur_left, size);
      }, [left]);


      while ((left + runlength) <= size) {

        let mid = left + runlength - 1;
        let right = Math.min(mid + runlength, (size - 1));
        let ap1 = left;

        let max1 = mid;
        let ap2 = mid + 1;
        let max2 = right;
        let bp = left;

        chunker.add('MergeAllWhile', (vis, cur_left, cur_mid, cur_right) => {
          // note: need to generalise this in future
          // displayRunlength(vis, cur_rlength, cur_size);

          for (let i = cur_left; i <= cur_mid; i++) {
            highlight(vis, i, 'red');
          }
          for (let j = cur_mid + 1; j <= cur_right; j++) {
            highlight(vis, j, 'green');
          }

        }, [left, mid, right]);

        chunker.add('mid', (vis, cur_mid, cur_rlength, cur_size) => {
          // remove runlength and size labels

          assignVarToA(vis, ('runlength = ' + cur_rlength), undefined, size);
          assignVarToA(vis, ('size = ' + (cur_size)), undefined, size);

          assignVarToA(vis, 'mid', cur_mid, size);
        }, [mid, runlength, size]);

        chunker.add('right', (vis, cur_right) => {
          assignVarToA(vis, 'right', cur_right, size);
        }, [right]);

        chunker.add('ap1', (vis, cur_ap1) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'left', undefined, size); // ap1 replaces left
            assignVarToA(vis, 'ap1', cur_ap1, size);
          }
        }, [ap1]);

        chunker.add('max1', (vis, cur_max1) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'mid', undefined, size); // max1 replaces mid
            assignVarToA(vis, 'max1', cur_max1, size);
          }
        }, [max1]);

        chunker.add('ap2', (vis, cur_ap2) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap2', cur_ap2, size);
          }
        }, [ap2]);

        chunker.add('max2', (vis, cur_max2) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'right', undefined, size); // max2 replaces right
            assignVarToA(vis, 'max2', cur_max2, size);
          }
        }, [max2]);

        chunker.add('bp', (vis, cur_bp) => {
          if (isMergeExpanded()) {
            assignVarToB(vis, 'bp', cur_bp, size);
          }
        }, [bp]);

        // while (ap1 <= max1 && ap2 <= max2) 
        /* eslint-disable no-constant-condition */
        while (true) {
          if (!(ap1 <= max1 && ap2 <= max2)) break;

          chunker.add('MergeWhile', (vis, a, cur_left, cur_right, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp,) => {
            vis.array.set(a, 'msort_arr_bup');
            displayMergeLabels(vis, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp, size);


            // turn all the elements from ap1 to max2 red

            for (let i = cur_left; i <= cur_right; i++) {
              highlight(vis, i, 'red');
            }

          }, [A, left, right, ap1, max1, ap2, max2, bp]);

          chunker.add('findSmaller', () => {
            // no animation 
          }, []);

          if (A[ap1] < A[ap2]) {

            B[bp] = A[ap1];
            A[ap1] = undefined;

            chunker.add('copyap1', (vis, a, b, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp, cur_left, cur_right) => {

              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
              vis.array.set(a, 'msort_arr_bup');

              displayMergeLabels(vis, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp, size);

              for (let i = cur_left; i <= cur_right; i++) {
                highlight(vis, i, 'red');
              }
              for (let i = cur_left; i <= cur_bp; i++) {
                highlightB(vis, i, 'green');
              }

            }, [A, B, ap1, max1, ap2, max2, bp, left, right]);

            ap1 = ap1 + 1;
            chunker.add('ap1++', (vis, cur_ap1) => {
              assignVarToA(vis, 'ap1', cur_ap1, size);
            }, [ap1]);

            bp = bp + 1;
            chunker.add('bp++', (vis, cur_bp) => {
              if (isMergeExpanded()) assignVarToB(vis, 'bp', cur_bp, size);
            }, [bp]);
          }

          else {
            chunker.add('findSmallerB', () => {
              // no animation
            }, []);

            B[bp] = A[ap2];
            A[ap2] = undefined;

            chunker.add('copyap2', (vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2, cur_left, cur_right) => {
              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
              vis.array.set(a, 'msort_arr_bup');
              displayMergeLabels(vis, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp, size);

              for (let i = cur_left; i <= cur_right; i++) {
                highlight(vis, i, 'red');
              }
              for (let i = cur_left; i <= cur_bp; i++) {
                highlightB(vis, i, 'green');
              }

            }, [A, B, ap1, ap2, bp, max1, max2, left, right]);

            ap2 = ap2 + 1;
            chunker.add('ap2++', (vis, cur_ap2) => {
              assignVarToA(vis, "ap2", cur_ap2, size);
            }, [ap2]);

            bp = bp + 1;
            chunker.add('bp++_2', (vis, cur_bp) => {
              if (isMergeExpanded()) assignVarToB(vis, 'bp', cur_bp, size)
            }, [bp]);
          }
        }

        for (let i = ap1; i <= max1; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest1', (vis, a, b, cur_ap1, cur_max1, cur_left, cur_right, cur_bp) => {

          vis.array.set(a, 'msort_arr_bup');
          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
          assignVarToA(vis, 'ap1', cur_ap1, size);
          assignVarToA(vis, 'max1', cur_max1, size);
          assignVarToB(vis, 'bp', cur_bp, size);

          // to highlight the solrted elements of B array green
          for (let i = cur_left; i < cur_bp; i++) {
            highlightB(vis, i, 'green');
          }
          for (let i = cur_left; i <= cur_right; i++) {
            highlight(vis, i, 'red');
          }

        }, [A, B, ap1, max1, left, right, bp]);

        for (let i = ap2; i <= max2; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest2', (vis, a, b, cur_ap2, cur_max2, cur_left, cur_right) => {
          vis.array.set(a, 'msort_arr_bup');
          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
          assignVarToA(vis, 'ap2', cur_ap2, size);
          assignVarToA(vis, 'max2', cur_max2, size);

          for (let i = cur_left; i <= cur_right; i++) {
            highlightB(vis, i, 'green');
          }
          for (let i = cur_left; i <= cur_right; i++) {
            //highlightB(vis, i, false);
            highlight(vis, i, 'red');
          }

        }, [A, B, ap2, max2, left, right]);

        // copy merged elements from B to A
        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }
        chunker.add('copyBA', (vis, a, b, cur_left, cur_right) => {
          vis.array.set(a, 'msort_arr_bup');
          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');

          for (let i = cur_left; i <= cur_right; i++) {
            highlight(vis, i, 'green');
          }

        }, [A, B, left, right]);

        let left2 = left; // this is the old left before it was updated

        left = right + 1;

        chunker.add('left2', (vis, old_left, cur_left, cur_right) => {
          // unhighlight all elements in A
          for (let i = old_left; i <= cur_right; i++) {
            unhighlight(vis, i, 'green');
          }

          assignVarToA(vis, 'left', cur_left, size);

        }, [left2, left, right]);

      }


      runlength = 2 * runlength;
      chunker.add('runlength2', (vis, runlength) => {
        assignVarToA(vis, 'left', undefined, size);
        if (runlength > size) {
          assignVarToA(vis, 'done', size, size);
        }
        else {
          displayRunlength(vis, runlength, size);

        }

      }, [runlength]);
    }

    // We compute and fix the max value in each array so they don't get re-scaled as we
    // shuffle elements between arrays
    const maxValue = entire_num_array.reduce((acc, curr) => (acc < curr ? curr : acc), 0);

    return A;
  }
}

