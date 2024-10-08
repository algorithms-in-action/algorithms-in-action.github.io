// Merge sort for arrays, natural
// Adapted code from merge sort, top down

import { msort_arr_nat } from '../explanations';
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
  vis_array.setList(c_stk);
}

/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_msort() {

  return function run(chunker, { nodes }) {
    console.log("start run()");
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
    let runcount = 0; // number of runs merged
    // let left = 0;

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

      console.log("inside the first do ... while");

      chunker.add('MainWhile', () => {
        // no animation
      }, []);



      runcount = 0;
      let left = 0;

      chunker.add('runcount', (vis, c_rcount) => {
        set_simple_stack(vis.array, [c_rcount]);
      }, [runcount]);

      chunker.add('left', (vis, c_left) => {
        assignVarToA(vis, 'left', c_left, size);
        assignVarToA(vis, "size", size, size);
      }, [left]);

      do {
        chunker.add('MergeAllWhile', () => {
          // no animation
        }, []);

        let mid = left;

        chunker.add('mid', (vis, c_mid) => {
          assignVarToA(vis, 'mid', c_mid, size);
          highlight(vis, c_mid, 'red');
        }, [mid]);

        // finding the first runlength
        while (mid < size && A[mid] <= A[mid + 1]) {
          chunker.add('FirstRunWhile', (vis, c_mid) => {
          }, [mid]);

          mid = mid + 1;

          chunker.add('mid++', (vis, c_mid) => {
            assignVarToA(vis, 'mid', c_mid, size);
            highlight(vis, (c_mid), 'red');
          }, [mid]);
        }

        // find the second runlength
        let right = mid + 1;

        chunker.add('right', (vis, c_right) => {
          if (right < size) {
            assignVarToA(vis, 'right', c_right, size);
            highlight(vis, c_right, 'green');
          }
        }, [right]);

        while (right < size & A[right] <= A[right + 1]) {
          chunker.add('SecondRunWhile', (vis, c_right) => {
          }, [right]);
          right = right + 1
          chunker.add('right++', (vis, c_right) => {
            assignVarToA(vis, 'right', c_right, size);
            highlight(vis, (c_right), 'green');
          }, [right]);
        }

        console.log("mid = " + mid + " size = " + size);

        if (mid < size - 1) { // merge[left, mid, right]
          chunker.add('ifmidsize', (vis, c_mid, c_size) => {
          }, [mid, size]);

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
          /* eslint-disable no-constant-condition */
          while (true) {
            if (!(ap1 <= max1 && ap2 <= max2)) break;

            chunker.add('MergeWhile', (vis, a, c_left, c_right, c_mid, c_ap1, c_max1, c_ap2, c_max2, c_bp, c_rcount) => {
              vis.array.set(a, 'msort_arr_nat');
              displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
              highlight2Runlength(vis, c_left, c_mid, c_right, colorA, colorA);
              set_simple_stack(vis.array, [c_rcount]);

            }, [A, left, right, mid, ap1, max1, ap2, max2, bp, runcount]);

            chunker.add('findSmaller', () => {
              // no animation 
            }, []);

            if (A[ap1] < A[ap2]) {

              B[bp] = A[ap1];
              A[ap1] = undefined;

              chunker.add('copyap1', (vis, a, b, c_ap1, c_max1, c_ap2, c_max2, c_bp, c_left, c_right, c_mid, c_rcount) => {

                if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_nat');
                vis.array.set(a, 'msort_arr_nat');

                displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
                // future color: should be colorA & colorB
                highlight2Runlength(vis, c_left, c_mid, c_right, colorA, colorA);
                // highlight sorted elements green (colorC)
                for (let i = c_left; i <= c_bp; i++) highlightB(vis, i, colorC);
                set_simple_stack(vis.array, [c_rcount]);
              }, [A, B, ap1, max1, ap2, max2, bp, left, right, mid, runcount]);

              ap1 = ap1 + 1;
              chunker.add('ap1++', (vis, c_ap1) => {
                assignVarToA(vis, 'ap1', c_ap1, size);
              }, [ap1]);

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
                if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_nat');
                vis.array.set(a, 'msort_arr_nat');
                displayMergeLabels(vis, c_ap1, c_max1, c_ap2, c_max2, c_bp, size);
                // future color: should be colorA & colorB
                highlight2Runlength(vis, c_left, c_mid, c_right, colorA, colorA);
                // highlight sorted elements green / colorB
                for (let i = c_left; i <= c_bp; i++) highlightB(vis, i, 'green')
                set_simple_stack(vis.array, [c_rcount]);
              }, [A, B, ap1, ap2, bp, max1, max2, left, right, mid, runcount]);

              ap2 = ap2 + 1;
              chunker.add('ap2++', (vis, c_ap2) => {
                assignVarToA(vis, "ap2", c_ap2, size);
              }, [ap2]);

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
          chunker.add('CopyRest1', (vis, a, b, c_ap1, c_max1, c_left, c_right, c_mid, c_bp, c_rcount) => {

            vis.array.set(a, 'msort_arr_nat');
            if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_nat');

            // copying A[ap1..max1]
            assignVarToA(vis, 'ap1', c_ap1, size);
            assignVarToA(vis, 'max1', c_max1, size);
            assignVarToB(vis, 'bp', c_bp, size);

            // to highlight the solrted elements of B array green / colorC
            for (let i = c_left; i < c_bp; i++) highlightB(vis, i, colorC);

            // future color: should be colorA & colorB
            highlight2Runlength(vis, c_left, c_mid, c_right, colorA, colorA);
            set_simple_stack(vis.array, [c_rcount]);
          }, [A, B, ap1, max1, left, right, mid, bp, runcount]);

          for (let i = ap2; i <= max2; i++) {
            B[bp] = A[i];
            A[i] = undefined;
            bp = bp + 1;
          }
          chunker.add('CopyRest2', (vis, a, b, c_ap2, c_max2, c_left, c_right, c_mid, c_rcount) => {
            vis.array.set(a, 'msort_arr_nat');
            if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_nat');
            assignVarToA(vis, 'ap2', c_ap2, size);
            assignVarToA(vis, 'max2', c_max2, size);

            // highlight sorted elements green
            for (let i = c_left; i <= c_right; i++) highlightB(vis, i, colorC);

            // future color: should be colorA & colorB
            highlight2Runlength(vis, c_left, c_mid, c_right, colorA, colorA);
            set_simple_stack(vis.array, [c_rcount]);
          }, [A, B, ap2, max2, left, right, mid, runcount]);

          // copy merged elements from B to A
          for (let i = left; i <= right; i++) {
            A[i] = B[i];
            B[i] = undefined;
          }
          chunker.add('copyBA', (vis, a, b, c_left, c_right, c_rcount) => {
            vis.array.set(a, 'msort_arr_nat');
            if (isMergeExpanded()) vis.arrayB.set(b, 'msort_arr_nat');

            // highlight all sorted elements green
            for (let i = c_left; i <= c_right; i++) highlight(vis, i, colorC);
            set_simple_stack(vis.array, [c_rcount]);
          }, [A, B, left, right, runcount]);


        }
        runcount = runcount + 1;
        chunker.add('runcount+', (vis, c_rcount) => {
          set_simple_stack(vis.array, [c_rcount]);
        }, [runcount]);

        let left2 = left;
        left = right + 1;
        chunker.add('left2', (vis, a, c_left, c_rcount) => {
          vis.array.set(a, 'msort_arr_nat');

          set_simple_stack(vis.array, [c_rcount]);


          if (c_left < size) assignVarToA(vis, 'left', c_left);
        }, [A, left, runcount]);

        console.log("size = " + size + " left = " + left);


      } while (left < size);

      // runcount++;

    } while (runcount > 1);

    chunker.add('Done', (vis) => {
      for (let i = 0; i < size; i++) {
        highlight(vis, i, colorC);
      }
      assignVarToA(vis, 'done', size, size);
    }, []);

    const maxValue = entire_num_array.reduce((acc, curr) => (acc < curr ? curr : acc), 0);

    return A;
  }

}








//   } while (left < size - 1);

// } while (runcount > 1);




// We compute and fix the max value in each array so they don't get re-scaled as we
// shuffle elements between arrays
//  const maxValue = entire_num_array.reduce((acc, curr) => (acc < curr ? curr : acc), 0);

//   return A;
//  }
//}

