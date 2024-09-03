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

// ----------------------------------------------------------------------------------------------------------------------------

// Define helper functions
// without javascript Closure arguements (IE 'global variables')
// ----------------------------------------------------------------------------------------------------------------------------

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

const unhighlight = (vis, index, isPrimaryColor = true) => {
  if (isPrimaryColor) {
    vis.array.deselect(index);
  } else {
    vis.array.depatch(index);
  }
};

const unhighlightB = (vis, index, isPrimaryColor = true) => {
  if (isPrimaryColor) {
    vis.arrayB.deselect(index);
  } else {
    vis.arrayB.depatch(index);
  }
};

// ----------------------------------------------------------------------------------------------------------------------------

// We hide array B entirely if things mergeCopy is collapsed
export function initVisualisers() {

  /*return {
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
    }
  }*/

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

/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_msort() {

  return function run(chunker, { nodes }) {
    // can't rename from nodes

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define 'global' variables
    // ----------------------------------------------------------------------------------------------------------------------------

    const entire_num_array = nodes;
    let A = nodes;
    let B = [...entire_num_array].fill(undefined);
    let runlength = 1; // length of run to merge
    let size = nodes.length - 1; // size of array

    console.log("runlength = " + runlength);


    // ----------------------------------------------------------------------------------------------------------------------------
    // Define helper functions
    // ----------------------------------------------------------------------------------------------------------------------------


    function assignVarToA(vis, variable_name, index) {
      if (index === undefined)
        vis.array.removeVariable(variable_name);
      else
        vis.array.assignVariable(variable_name, index);
    }

    function assignVarToB(vis, variable_name, index) {
      if (index === undefined)
        vis.arrayB.removeVariable(variable_name);
      else
        vis.arrayB.assignVariable(variable_name, index);
    }

    /*function displayRunlength(vis, runlength) {
      console.log("runlength = " + runlength);

      let str = 'runlength = '
      let text = str + runlength;
      let index = runlength - 1;

      assignVarToA(vis, text, index);
    }*/

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

    let runlengthString = 'runlength = ' + runlength;

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

    //let runlength_numb = runlength - 1;
    //let runlength_str = "runlength = ";
    //let runlength_text = runlength_str + runlength;

    chunker.add('runlength', (vis) => {
      //console.log("runlength = " + runlength);
      //displayRunlength(vis, runlength);
    });

    while (runlength < size + 1) {
      let left = 0;

      chunker.add('MainWhile', (vis, runlength) => {
        //displayRunlength(vis, runlength);
      }, [A, B, left, length]);

      chunker.add('left', (vis, a, cur_left, cur_mid, cur_right) => {
        /*for (let i = cur_left; i <= cur_right; i++) {
          unhighlight(vis, i, true);
        }*/
        assignVarToA(vis, 'left', cur_left);

      }, [A, left]);


      while ((left + runlength) < size + 1) {

        let mid = left + runlength - 1;
        let right = Math.min(mid + runlength, size);
        chunker.add('MergeAllWhile', (vis, cur_left, cur_mid) => {
          for (let i = cur_left; i <= right; i++) {
            highlight(vis, i, true)
          }

          for (let i = cur_left; i <= cur_mid; i++) {
            highlight(vis, i, true);
          }

        }, [A, B, left, mid, right, length]);





        chunker.add('mid', (vis, a, cur_left, cur_mid, cur_right) => {
          assignVarToA(vis, 'mid', cur_mid);
        }, [A, left, mid, right]);

        chunker.add('right', (vis, a, cur_left, cur_mid, cur_right) => {
          assignVarToA(vis, 'right', cur_right);
          //highlight(vis, cur_right, true);
          for (let i = cur_mid + 1; i <= cur_right; i++) {
            highlight(vis, i, false);
          }
        }, [A, left, mid, right]);

        let ap1 = left;
        let max1 = mid;
        let ap2 = mid + 1;
        let max2 = right;
        let bp = left;

        chunker.add('ap1', (vis, a, cur_left, cur_mid, cur_right) => {

          // vis.array.set(a, 'msort_arr_bup');
          // vis.arrayB.setList(runlength);

          if (isMergeExpanded()) {
            assignVarToA(vis, 'left', undefined);
            assignVarToA(vis, 'ap1', cur_left);
            //highlight(vis, cur_left, true);
          }
        }, [A, left, mid, right]);
        chunker.add('max1', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'mid', undefined);
            assignVarToA(vis, 'max1', cur_mid);
          }
        }, [A, left, mid, right]);
        chunker.add('ap2', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap2', cur_mid + 1);
            //123highlight(vis, cur_mid + 1, true);
          }
        }, [A, left, mid, right]);
        chunker.add('max2', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'right', undefined);
            assignVarToA(vis, 'max2', right);
          }
        }, [A, left, mid, right]);
        chunker.add('bp', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToB(vis, 'bp', cur_left);
          }
        }, [A, left, mid, right]);

        // while (ap1 <= max1 && ap2 <= max2) 
        /* eslint-disable no-constant-condition */
        while (true) {
          chunker.add('MergeWhile', (vis, a, b, cur_ap1, cur_ap2,
            cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
            /*renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
              cur_max2, cur_stk, cur_left);*/
          }, [A, B, ap1, ap2, bp, max1, max2, left]);

          if (!(ap1 <= max1 && ap2 <= max2)) break;

          chunker.add('findSmaller', (vis, a, b, cur_ap1, cur_ap2,
            cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
            renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left);
          }, [A, B, ap1, ap2, bp, max1, max2, left]);

          if (A[ap1] < A[ap2]) {
            B[bp] = A[ap1];
            A[ap1] = undefined;
            chunker.add('copyap1', (vis, a, b, cur_ap1, cur_ap2,
              cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, false);
              }
            }, [A, B, ap1, ap2, bp, max1, max2, left]);
            ap1 = ap1 + 1;
            chunker.add('ap1++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, false);
              }
            }, [A, B, ap1, ap2, bp, max1, max2, left]);
            bp = bp + 1;
            chunker.add('bp++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
            }, [A, B, ap1, ap2, bp, max1, max2, left]);
          } else {
            B[bp] = A[ap2];
            A[ap2] = undefined;
            chunker.add('copyap2', (vis, a, b, cur_ap1, cur_ap2,
              cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, false);
              }
            }, [A, B, ap1, ap2, bp, max1, max2, left]);
            ap2 = ap2 + 1;
            chunker.add('ap2++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, false);
              }
            }, [A, B, ap1, ap2, bp, max1, max2, left]);
            bp = bp + 1;
            chunker.add('bp++_2', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
            }, [A, B, ap1, ap2, bp, max1, max2, left]);
          }
        }

        for (let i = ap1; i <= max1; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest1', (vis, a, b, cur_left, cur_ap2, cur_max2, cur_bp) => {
          if (isMergeExpanded()) {
            vis.array.set(a, 'msort_arr_bup');

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
          }
        }, [A, B, left, ap1, ap2, max1, max2, bp]);

        for (let i = ap2; i <= max2; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest2', (vis, a, b, cur_left, cur_right, cur_ap2) => {
          if (isMergeCopyExpanded()) {
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
          }
        }, [A, B, left, right, ap2, max2, bp]);

        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }
        chunker.add('copyBA', (vis, a, b, cur_left, cur_right) => {
          if (isMergeCopyExpanded()) {
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
          }

        }, [A, B, left, mid, right]);

        left = right + 1;

        chunker.add('left2', (vis, cur_left) => {
          /*for (let i = pre_left; i <= pre_right; i++) {
            unhighlight(vis, i, false);
          }*/
          if (cur_left < size) {
            assignVarToA(vis, 'left', cur_left);
          }
          /*for (let i = left; i <= left + runlength - 1; i++) {
            highlight(vis, i, true);
          }*/
        }, [A, left, length]);


      }


      runlength = 2 * runlength;
      chunker.add('runlength2', (vis) => {

      }, [A, B, left, length]);
    }

    // We compute and fix the max value in each array so they don't get re-scaled as we
    // shuffle elements between arrays
    const maxValue = entire_num_array.reduce((acc, curr) => (acc < curr ? curr : acc), 0);

    return A;
  }
}

