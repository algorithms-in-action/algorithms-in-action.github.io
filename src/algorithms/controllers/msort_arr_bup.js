// Merge sort for arrays, bottom up
// Adapted code from merge sort, top down

import { msort_arr_bup } from '../explanations';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import {
  areExpanded,
} from './collapseChunkPlugin';


const run = run_msort();

// for changing colors in future, UI team?
const colorA = 'red';
const colorB = 'green';
const colorC = 'green';

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

// Highlights two runlengths two different colours
function highlight2Runlength(vis, left, mid, right, colorA, colorB) {
  // highlight first runlength color A
  for (let i = left; i <= mid; i++) highlight(vis, i, colorA);
  // highlight second runlength color B
  for (let j = mid + 1; j <= right; j++) highlight(vis, j, colorB);
}

// Highlight entire array alternating colors for runlength
function highlightAllRunlengths(vis, runlength, colorA, colorB, size) {
  let toggle = 0; // 0 = colorA, 1 = colorB

  for (let i = 0; i < size; i++) {
    if (toggle == 0) {
      highlight(vis, i, colorA);
      console.log("toggle == 0");
    }
    if (toggle == 1) {
      highlight(vis, i, colorB);
      console.log("toggle == 1");
    }
    console.log("(i + 1) % runlength = " + (runlength % (i + 1)));
    console.log("(runlength = " + (runlength));
    // Switch color after completing a run of length 'runlength'
    if ((i + 1) % runlength == 0) {

      console.log("(i + 1) % runlength == 0");

      toggle = 1 - toggle; // Flip toggle between 0 and 1

    } console.log("toggle = " + toggle);
  }
}

// Unhighlight entire array alternating colors for runlength
function unhighlightAllRunlengths(vis, runlength, colorA, colorB, size) {
  let toggle = 0; // 0 = colorA, 1 = colorB

  for (let i = 0; i < size; i++) {
    if (toggle == 0) {
      unhighlight(vis, i, colorA);
      console.log("toggle == 0");
    }
    if (toggle == 1) {
      unhighlight(vis, i, colorB);
      console.log("toggle == 1");
    }
    console.log("(i + 1) % runlength = " + (runlength % (i + 1)));
    console.log("(runlength = " + (runlength));
    // Switch color after completing a run of length 'runlength'
    if ((i + 1) % runlength == 0) {

      console.log("(i + 1) % runlength == 0");

      toggle = 1 - toggle; // Flip toggle between 0 and 1

    } console.log("toggle = " + toggle);
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

function highlightAPointers(vis, ap1, max1, ap2, max2, color) {
  if (ap1 <= max1) {
    highlight(vis, ap1, color);
  }
  if (ap2 <= max2) {
    highlight(vis, ap2, color);
  }
}

// this function sets array a, highlighting from left to mid red, and set the stack
function resetArrayA(vis, A, left, mid, right, runlength) {
  vis.array.set(A, 'msort_arr_bup');
  highlight2Runlength(vis, left, mid, right, colorA, colorA);
  set_simple_stack(vis.array, [runlength]);
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

// Display the runlength of the array at the runlength'th element
function displayRunlength(vis, runlength, size) {
  let text = 'runlength = ' + runlength;
  let index = runlength - 1;

  assignVarToA(vis, text, index, size);
}

// Display all the labels needed for Merge()
function displayMergeLabels(vis, ap1, max1, ap2, max2, bp, size) {
  assignVarToA(vis, 'ap1', ap1, size);
  assignVarToA(vis, 'max1', max1, size);
  assignVarToA(vis, 'ap2', ap2, size);
  assignVarToA(vis, 'max2', max2, size);
  if (isMergeExpanded()) assignVarToB(vis, 'bp', bp, size);
}



function set_simple_stack(vis_array, c_stk) {
  console.log("set_simple_stack" + c_stk);
  console.log(c_stk);
  vis_array.setList(c_stk);
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
    const size = nodes.length; // size of the array
    let simple_stack = [];

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

    }, [A, B, size], length);

    chunker.add('runlength', (vis, c_rlength) => {
      displayRunlength(vis, c_rlength, size);

      set_simple_stack(vis.array, [c_rlength]);
      highlightAllRunlengths(vis, c_rlength, colorA, colorB, size);
    }, [runlength, simple_stack]);

    while (runlength < size) {
      let left = 0;

      chunker.add('MainWhile', (vis, c_rlength, c_left) => {

        // display size label
        assignVarToA(vis, ("size = " + size), size, size);



      }, [runlength, left]);

      chunker.add('left', (vis, c_left, c_rlength) => {
        assignVarToA(vis, 'left', c_left, size);

        unhighlightAllRunlengths(vis, c_rlength, colorA, colorB, size);

        let left_2 = c_left;
        let mid_2 = (c_rlength + c_left - 1);
        let right_2 = (Math.min(c_rlength * 2, size) - 1);

        highlight2Runlength(vis, left_2, mid_2, right_2, colorA, colorB);
      }, [left, runlength]);

      while ((left + runlength) <= size) {

        let mid = left + runlength - 1;
        let right = Math.min(mid + runlength, (size - 1));
        let ap1 = left;
        let max1 = mid;
        let ap2 = mid + 1;
        let max2 = right;
        let bp = left;

        chunker.add('MergeAllWhile', (vis, c_left, c_mid, c_right) => {
          highlight2Runlength(vis, c_left, c_mid, c_right, colorA, colorB);
        }, [left, mid, right]);

        chunker.add('mid', (vis, c_mid, c_rlength) => {
          // remove runlength and size labels
          assignVarToA(vis, ('runlength = ' + c_rlength), undefined, size);
          assignVarToA(vis, ('size = ' + (size)), undefined, size);

          assignVarToA(vis, 'mid', c_mid, size);
        }, [mid, runlength]);

        chunker.add('right', (vis, c_right) => {
          assignVarToA(vis, 'right', c_right, size);

        }, [right]);

        chunker.add('ap1', (vis, a, c_ap1, c_left, c_mid, c_right, c_rlength) => {
          if (isMergeExpanded()) {

            // now in the nitty gritty of Merge
            // highlight the two parts you want to merge red
            resetArrayA(vis, a, c_left, c_mid, c_right, c_rlength);

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

          chunker.add('MergeWhile', (vis, a, c_left, c_right, c_mid, c_ap1, c_max1, c_ap2, c_max2, c_bp, c_rlength) => {

            resetArrayA(vis, a, c_left, c_mid, c_right, c_rlength);

            displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);

            // future color: should be colorA & colorB
            highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, colorB);

          }, [A, left, right, mid, ap1, max1, ap2, max2, bp, runlength]);

          chunker.add('findSmaller', (vis, c_ap1, c_max1, c_ap2, c_max2) => {
            // no animation 
          }, [ap1, max1, ap2, max2]);

          if (A[ap1] < A[ap2]) {

            B[bp] = A[ap1];
            A[ap1] = undefined;

            chunker.add('copyap1', (vis, a, b, c_ap1, c_max1, c_ap2, c_max2, c_bp, c_left, c_right, c_mid, c_rlength) => {

              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');

              resetArrayA(vis, a, c_left, c_mid, c_right, c_rlength);


              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
              // future color: should be colorA & colorB

              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, colorB);
              // highlight sorted elements green (colorC)
              for (let i = c_left; i <= c_bp; i++) highlightB(vis, i, colorC);

            }, [A, B, ap1, max1, ap2, max2, bp, left, right, mid, runlength]);

            ap1 = ap1 + 1;
            chunker.add('ap1++', (vis, a, c_left, c_mid, c_right, c_rlength,
              c_ap1, c_max1, c_ap2, c_max2, c_bp) => {
              resetArrayA(vis, a, c_left, c_mid, c_right, c_rlength);
              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);

              assignVarToA(vis, 'ap1', c_ap1, size);
              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, colorB);
            }, [A, left, mid, right, runlength, ap1, max1, ap2, max2, bp]);

            bp = bp + 1;
            chunker.add('bp++', (vis, c_bp) => {
              assignVarToB(vis, 'bp', c_bp, size);
            }, [bp]);
          }

          else {
            chunker.add('findSmallerB', (vis, c_ap1, c_max1, c_ap2, c_max2) => {
              // no animation
              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, colorB);

            }, [ap1, max1, ap2, max2]);

            B[bp] = A[ap2];
            A[ap2] = undefined;

            chunker.add('copyap2', (vis, a, b, c_ap1, c_ap2, c_bp, c_max1, c_max2, c_left, c_right, c_mid, c_rlength) => {
              if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
              resetArrayA(vis, a, c_left, c_mid, c_right, c_rlength);

              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);

              // future color: should be colorA & colorB

              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, colorB);

              // highlight sorted elements green / colorB
              for (let i = c_left; i <= c_bp; i++) highlightB(vis, i, 'green')

            }, [A, B, ap1, ap2, bp, max1, max2, left, right, mid, runlength]);

            ap2 = ap2 + 1;
            chunker.add('ap2++', (vis, a, c_left, c_mid, c_right, c_rlength,
              c_ap1, c_max1, c_ap2, c_max2, c_bp) => {
              resetArrayA(vis, a, c_left, c_mid, c_right, c_rlength);
              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);

              assignVarToA(vis, "ap2", c_ap2, size);
              highlightAPointers(vis, c_ap1, c_max1, c_ap2, c_max2, colorB);

            }, [A, left, mid, right, runlength, ap1, max1, ap2, max2, bp]);

            bp = bp + 1;
            chunker.add('bp++_2', (vis, c_bp) => {
              assignVarToB(vis, 'bp', c_bp, size)
            }, [bp]);
          }
        }

        for (let i = ap1; i <= max1; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest1', (vis, a, b, c_ap1, c_max1, c_left, c_right, c_mid, c_bp, c_rlength) => {

          resetArrayA(vis, a, c_left, c_mid, c_right, c_rlength);

          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');

          // copying A[ap1..max1]
          assignVarToA(vis, 'ap1', c_ap1, size);
          assignVarToA(vis, 'max1', c_max1, size);
          assignVarToB(vis, 'bp', c_bp, size);

          // to highlight the solrted elements of B array green / colorC
          for (let i = c_left; i < c_bp; i++) highlightB(vis, i, colorC);


        }, [A, B, ap1, max1, left, right, mid, bp, runlength]);

        for (let i = ap2; i <= max2; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest2', (vis, a, b, c_ap2, c_max2, c_left, c_right, c_mid, c_rlength) => {
          resetArrayA(vis, a, c_left, c_mid, c_right, c_rlength);

          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');
          assignVarToA(vis, 'ap2', c_ap2, size);
          assignVarToA(vis, 'max2', c_max2, size);

          // highlight sorted elements green
          for (let i = c_left; i <= c_right; i++) highlightB(vis, i, colorC);

          // future color: should be colorA & colorB

        }, [A, B, ap2, max2, left, right, mid, runlength]);

        // copy merged elements from B to A
        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }

        chunker.add('copyBA', (vis, a, b, c_left, c_right, c_rlength) => {

          vis.array.set(a, 'msort_arr_bup');
          set_simple_stack(vis.array, [c_rlength]);

          if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_bup');

          // highlight all sorted elements green
          for (let i = c_left; i <= c_right; i++) highlight(vis, i, colorC);

        }, [A, B, left, right, runlength]);

        let left2 = left; // this is the old left before it was updated

        left = right + 1;

        chunker.add('left2', (vis, old_left, c_left, c_right, c_rlength) => {
          // unhighlight all elements in A
          for (let i = old_left; i <= c_right; i++) {
            unhighlight(vis, i, colorC);
          }
          if (c_left < size) {
            assignVarToA(vis, 'left', c_left, size);
          }

        }, [left2, left, right, runlength]);

      }
      runlength = 2 * runlength;

      chunker.add('mergeDone', (vis, c_rlength) => {
        highlightAllRunlengths(vis, c_rlength, colorA, colorB, size);
      }, [runlength])


      chunker.add('runlength2', (vis, c_rlength) => {

        // highlightAllRunlengths(vis, c_rlength, colorA, colorB, size);
        assignVarToA(vis, 'left', undefined, size);
        set_simple_stack(vis.array, [c_rlength]);

        if (c_rlength < size) {
          displayRunlength(vis, c_rlength, size);
        }

      }, [runlength]);
    }

    chunker.add('Done', (vis) => {
      for (let i = 0; i < size; i++) {
        highlight(vis, i, colorC);
      }
      assignVarToA(vis, 'done', size, size);
    }, []);


    // We compute and fix the max value in each array so they don't get re-scaled as we
    // shuffle elements between arrays
    const maxValue = entire_num_array.reduce((acc, curr) => (acc < curr ? curr : acc), 0);

    return A;
  }
}

