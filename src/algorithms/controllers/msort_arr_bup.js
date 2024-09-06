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

const highlight = (vis, index, isPrimaryColor = true) => {
  if (isPrimaryColor) {
    vis.array.select(index);
  } else {
    vis.array.patch(index);
  }
};

const highlightB = (vis, index, isPrimaryColor = true) => {
  if (isMergeExpanded()) {
    if (isPrimaryColor) {
      vis.arrayB.select(index);
    } else {
      vis.arrayB.patch(index);
    }
  }
};



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
  if (isMergeExpanded()) {
    if (index === undefined)
      vis.arrayB.removeVariable(variable_name);
    else if (index > 11)
      vis.arrayB.assignVariable(variable_name, 11);
    else
      vis.arrayB.assignVariable(variable_name, index);
  }

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

          for (let i = cur_left; i <= cur_mid; i++) {
            highlight(vis, i, true);
          }
          for (let j = cur_mid + 1; j <= cur_right; j++) {
            highlight(vis, j, false);
          }

        }, [left, mid, right]);

        chunker.add('mid', (vis, cur_mid, cur_rlength, cur_size) => {
          // remove runlength and size labels

          assignVarToA(vis, ('runlength = ' + cur_rlength), undefined);
          assignVarToA(vis, ('size = ' + (cur_size + 1)), undefined);

          assignVarToA(vis, 'mid', cur_mid);
        }, [mid, runlength, size]);

        chunker.add('right', (vis, cur_right) => {
          assignVarToA(vis, 'right', cur_right);
        }, [right]);

        chunker.add('ap1', (vis, cur_ap1) => {
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

          let is_red = 1; // this is to help with the 'mergewhile' highlighting

          chunker.add('MergeWhile', (vis, a, cur_left, cur_right, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp,) => {
            vis.array.set(a, 'msort_arr_bup');
            displayMergeLabels(vis, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp, size);


            // turn all the elements from ap1 to max2 red

            for (let i = cur_left; i <= cur_right; i++) {
              highlight(vis, i, true);
            }

            //unhighlight(vis, cur_ap2, false);
            //highlight(vis, cur_ap2, true);
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
                highlight(vis, i, true);
              }
              for (let i = cur_left; i <= cur_bp; i++) {
                highlightB(vis, i, false);
              }

            }, [A, B, ap1, max1, ap2, max2, bp, left, right]);

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

            chunker.add('copyap2', (vis, a, b, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2, cur_left, cur_right) => {
              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
              vis.array.set(a, 'msort_arr_bup');
              displayMergeLabels(vis, cur_ap1, cur_max1, cur_ap2, cur_max2, cur_bp, size);

              for (let i = cur_left; i <= cur_right; i++) {
                highlight(vis, i, true);
              }
              for (let i = cur_left; i <= cur_bp; i++) {
                highlightB(vis, i, false);
              }

            }, [A, B, ap1, ap2, bp, max1, max2, left, right]);

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

        chunker.add('CopyRest1', (vis, a, b, cur_ap1, cur_max1, cur_left, cur_right, cur_bp) => {

          vis.array.set(a, 'msort_arr_bup');
          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
          assignVarToA(vis, 'ap1', cur_ap1);
          assignVarToA(vis, 'max1', cur_max1);
          assignVarToB(vis, 'bp', cur_bp);

          // to highlight the solrted elements of B array green
          for (let i = cur_left; i < cur_bp; i++) {
            highlightB(vis, i, false);
            // highlight(vis, i, true);
          }
          for (let i = cur_left; i <= cur_right; i++) {
            //highlightB(vis, i, false);
            highlight(vis, i, true);
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
          assignVarToA(vis, 'ap2', cur_ap2);
          assignVarToA(vis, 'max2', cur_max2);

          for (let i = cur_left; i <= cur_right; i++) {
            highlightB(vis, i, false);
          }
          for (let i = cur_left; i <= cur_right; i++) {
            //highlightB(vis, i, false);
            highlight(vis, i, true);
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
            highlight(vis, i, false);
          }

        }, [A, B, left, right]);

        let left2 = left; // this is the old left before it was updated

        left = right + 1;

        chunker.add('left2', (vis, old_left, cur_left, cur_right) => {
          // unhighlight all elements in A
          for (let i = old_left; i <= cur_right; i++) {
            unhighlight(vis, i, false);
          }

          assignVarToA(vis, 'left', cur_left);

        }, [left2, left, right]);


      }


      runlength = 2 * runlength;
      chunker.add('runlength2', (vis, runlength) => {
        assignVarToA(vis, 'left', undefined);
        if (runlength >= size) {
          assignVarToA(vis, 'done', size);
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

