// Merge sort for lists (represented using array), top down
// Prototype for pointer version. Adapted code from array version.
// XXX Could do with a good clean up!
// Lots of crud - may include some quicksort remnants also; probably
// should have cleaned up mergesort array code before copying it...
// Uses simple stack display like DFSrec

import { msort_lista_td } from '../explanations';

const run = run_msort();

export default {
    explanation: msort_lista_td,
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
// 3) The stack is visualised in the animation, to help understanding of
// the algorithm overall and also where we are in the recursion.
// 4) There is chunk at the end of the whole computation that cleans up
// the final display a bit.

// There may be remnants of code from a previous version that didn't
// encapsulate the recursive calls properly

// import 2D tracer to generate array in the middle panel
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

import {
  areExpanded,
} from './collapseChunkPlugin';

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

// checks if either recursive call is expanded (otherwise stack is not
// displayed)
function isRecursionExpanded() {
  return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

// see stackFrameColour in index.js to find corresponding function mapping to css
const STACK_FRAME_COLOR = {
  No_color: 0,
  In_progress_stackFrame: 1,
  Current_stackFrame: 2,
  Finished_stackFrame: 3,
  I_color: 4,
  J_color: 5,
  P_color: 6, // pivot
};

let Indices;
let Heads;
let Tails;
let simple_stack;


// ----------------------------------------------------------------------------------------------------------------------------

// Define helper functions
// without javascript Closure arguements (IE 'global variables')
// ----------------------------------------------------------------------------------------------------------------------------

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}


export function update_vis_with_stack_frame(a, stack_frame, stateVal) {
  let left, right,  depth;
  [left, right,  depth] = stack_frame;

  for (let i = left; i <= right; i += 1) {
    // each element in the vis stack is a tuple:
    // 0th index is for base color,
    // 1th index is for pivot, i, j colors
    a[depth][i] = { base: stateVal, extra: [] };
  }
  let mid = Math.floor((left + right)/2);
  // a[depth][mid] = { base: STACK_FRAME_COLOR.P_color, extra: [] };
  a[depth][mid] = { base: STACK_FRAME_COLOR.Current_stackFrame, extra: [] };
  return a;
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


// Just use a single 2D array to represent lists for now.  Could
// possibly add a 1D array with arrayItemMagnitudes: true and rearrange
// data at the end to show sortedness XXX
export function initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Array representation of lists'),
        order: 0,
      },
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

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define quicksort functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2, c_stk) { 
      if (isMergeExpanded()) {
        vis.array.set(a, 'msort_lista_td');
        // set_simple_stack(vis.array, c_stk);
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
        vis.arrayB.set(b, 'msort_lista_td');
        assignVarToB(vis, 'bp', cur_bp);
        for (let i=cur_left; i < cur_bp; i++) {
          highlightB(vis, i, false);
        }
      }
    }

    // calls vis.array.setList(c_stk) to display simple stack but only
    // if recursion is expanded (otherwise stack is never displayed)
    // XXX is this confusing if we run the algorithm a bit with
    // recursion expanded then collapse recursion? I guess if you are
    // doing that you have a pretty good understanding anyway?
    const set_simple_stack = (vis_array, c_stk) => {
    if (isRecursionExpanded())
      vis_array.setList(c_stk);
    }

    function MergeSort(L, len, depth) {


      //// start mergesort -------------------------------------------------------- 
// XXXXX

      // XXX defined function to display first couple of list elements
      simple_stack.unshift('(['+Heads[L]+'..],'+len+')');

      // should show animation if doing high level steps for whole array OR if code is expanded to do all reccursive steps

      chunker.add('Main', (vis, Lists, cur_L, cur_len, cur_depth, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
            vis.array.assignVariable('L', 2, cur_L);
        // if (cur_depth === 0) {
           // }
        // for (let i = cur_left; i <= cur_right; i++) {
          // highlight(vis, i, true)
        // }
        set_simple_stack(vis.array, c_stk);
        }, [[Indices, Heads, Tails], L, len, depth, simple_stack], depth);

      chunker.add('len>1', (vis, a) => {
        }, [[Indices, Heads, Tails]], depth);

      if (len > 1) {
        let midNum = Math.floor(len/2);
        // chunker.add('mid', (vis, a, cur_left, cur_mid, cur_right) => {
          // for (let i = cur_mid+1; i <= cur_right; i++) {
            // unhighlight(vis, i, true)
          // }
          // assignVarToA(vis, 'mid', cur_mid);
          // }, [A, left, mid, right], depth);

        let Mid = L;
        chunker.add('Mid', (vis, Lists, cur_L, cur_Mid, c_stk) => {
          // vis.array.set(Lists, 'msort_lista_td');
          // set_simple_stack(vis.array, c_stk);
          vis.array.assignVariable('Mid', 2, cur_Mid);
          }, [[Indices, Heads, Tails], L, Mid, simple_stack], depth);
          // XXX chunker.add...
        for (let i = 1; i < midNum; i++) {
          Mid = Tails[Mid];
          // XXX chunker.add...
        }
        // split L into lists L and R at (after) mid point
        let R = Tails[Mid];
        Tails[Mid] = 'Null';
        chunker.add('tail(Mid)<-Null', (vis, Lists, cur_L, cur_Mid,
cur_R, c_stk) => {
          vis.array.set(Lists, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);
          vis.array.assignVariable('L', 2, cur_L);
          vis.array.assignVariable('Mid', 2, cur_Mid);
          vis.array.assignVariable('R', 2, cur_R);
          }, [[Indices, Heads, Tails], L, Mid, R, simple_stack], depth);

        // dummy chunk for before recursive call - we need this so there
        // is a chunk at this recursion level as the first chunk in the
        // collapsed code for the recursive call
        chunker.add('preSortL', (vis, Lists, cur_L, cur_Mid, cur_R) => {
          // vis.array.set(Lists, 'msort_lista_td');
          // set_simple_stack(vis.array, c_stk);
          vis.array.assignVariable('Mid', 2, undefined);
          vis.array.assignVariable('R', 2, undefined);
          }, [[Indices, Heads, Tails], L, Mid, R], depth);


        L = MergeSort(L, midNum, depth + 1);

        // chunk after recursive call - it's good to highlight the
        // recursive call once it has returned plus we need a chunk at
        // this level when the recursive code is collapsed
        chunker.add('sortL', (vis, Lists, cur_L, cur_R, cur_Mid, c_stk) => {
          vis.array.set(Lists, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);
          vis.array.assignVariable('L', 2, cur_L);
          vis.array.assignVariable('R', 2, cur_R);
          // for (let i = cur_left; i <= cur_mid; i++) {
            // unhighlight(vis, i, true);
            // highlight(vis, i, false)
          // }
          // for (let i = cur_mid+1; i <= cur_right; i++) {
            // highlight(vis, i, true);
          // }
          }, [[Indices, Heads, Tails], L, R, Mid, simple_stack], depth);

        // dummy chunk before recursive call, as above
        chunker.add('preSortR', (vis, a, cur_L, cur_Mid, cur_R) => {
          // vis.array.set(a, 'msort_lista_td');
          // for (let i = cur_left; i <= cur_mid; i++) {
            // unhighlight(vis, i, false);
          // }
          vis.array.assignVariable('L', 2, undefined);
          vis.array.assignVariable('R', 2, cur_R);
          }, [[Indices, Heads, Tails], L, Mid, R], depth);

        R = MergeSort(R, len - midNum, depth + 1);

        // chunk after recursive call
        chunker.add('sortR', (vis, Lists, cur_L, cur_R,
c_stk) => {
          // vis.array.set(a, 'msort_lista_td');
          vis.array.set(Lists, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);
          vis.array.assignVariable('L', 2, cur_L);
          vis.array.assignVariable('R', 2, cur_R);
          // for (let i = cur_mid+1; i <= cur_right; i++) {
            // unhighlight(vis, i, true);
            // unhighlight(vis, i, false)
          // }
          }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

          // Merge L and R
          let M; // result
          if (Heads[L] <= Heads[R]) {
              M = L;
              L = Tails[L];
          } else {
              M = R;
              R = Tails[R];
          }
          // scan through adding elements to the end of M
          let E = M;
          while (L !== 'Null' && R !== 'Null') {
              if (Heads[L] <= Heads[R]) {
                  Tails[E] = L;
                  E = L;
                  L = Tails[L];
              } else {
                  Tails[E] = R;
                  E = R;
                  R = Tails[R];
              }
          }
          // add any elements not scanned to the end of M
          if (L === 'Null')
              Tails[E] = R;
          else
              Tails[E] = L;
          chunker.add('returnM', (vis, Lists, cur_L, cur_M, c_stk) => {
            vis.array.set(Lists, 'msort_lista_td');
            set_simple_stack(vis.array, c_stk);
            vis.array.assignVariable('L', 2, undefined);
            vis.array.assignVariable('R', 2, undefined);
            vis.array.assignVariable('M', 2, cur_M);
            }, [[Indices, Heads, Tails], L, M, simple_stack], depth);


/*
        // XXX should we shorten psuedocode? eg, (ap1,max1) <- (left,mid)
        let ap1 = left;
        let max1 = mid;
        let ap2 = mid+1;
        let max2 = right;
        let bp = left;

        chunker.add('ap1', (vis, a, cur_left, cur_mid, cur_right) => {
          // disable stack display during merge: hopefully its not
          // confusing, it avoids extra distraction and the position of
          // the stack and array B can sometimes overlap:(
          // vis.array.set(a, 'msort_lista_td');
          set_simple_stack(vis.array, undefined);
          for (let i = cur_mid+1; i <= cur_right; i++) {
            unhighlight(vis, i, false)
          }
          if (isMergeExpanded()) {
            assignVarToA(vis, 'left', undefined);
            assignVarToA(vis, 'ap1', cur_left);
            highlight(vis, cur_left, true);
          }
          }, [A, left, mid, right], depth);
        chunker.add('max1', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'mid', undefined);
            assignVarToA(vis, 'max1', cur_mid);
          }
          }, [A, left, mid, right], depth);
        chunker.add('ap2', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap2', cur_mid+1);
            highlight(vis, cur_mid+1, true);
          }
          }, [A, left, mid, right], depth);
        chunker.add('max2', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'right', undefined);
            assignVarToA(vis, 'max2', right);
          }
          }, [A, left, mid, right], depth);
        chunker.add('bp', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToB(vis, 'bp', left);
          }
          }, [A, left, mid, right], depth);

        // while (ap1 <= max1 && ap2 <= max2) 
        // eslint-disable no-constant-condition
        while (true) {
          chunker.add('MergeWhile', (vis, a, b, cur_ap1, cur_ap2,
cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
            renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
cur_max2, cur_stk, cur_left);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);

         if (!(ap1 <= max1 && ap2 <= max2)) break;

           chunker.add('findSmaller', (vis, a, b, cur_ap1, cur_ap2,
cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
             renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left);
             }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);

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
               }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
             ap1 = ap1+1;
             chunker.add('ap1++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left) => {
               renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left);
               if (isMergeExpanded()) {
                 highlightB(vis, cur_bp, false);
               }
               }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
             bp = bp+1;
             chunker.add('bp++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left) => {
               renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left);
               }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
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
               }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
             ap2 = ap2+1;
             chunker.add('ap2++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left) => {
               renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left);
               if (isMergeExpanded()) {
                 highlightB(vis, cur_bp, false);
               }
               }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
             bp = bp+1;
             chunker.add('bp++_2', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left) => {
               renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
cur_max1, cur_max2, cur_stk, cur_left);
               }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
           }
         }

         for (let i = ap1; i <= max1; i++) {
           B[bp] = A[i];
           A[i] = undefined;
           bp = bp+1;
         }

         chunker.add('CopyRest1', (vis, a, b, cur_left, cur_ap1,
cur_ap2, cur_max1, cur_max2, cur_bp, c_stk) => {
          if (isMergeExpanded()) {
            vis.array.set(a, 'msort_lista_td');
            // set_simple_stack(vis.array, c_stk);
            // unhighlight(vis, cur_ap1, true);
            // assignVarToA(vis, 'ap1', undefined);
            // assignVarToA(vis, 'max1', undefined);
            if (cur_ap2 < a.length)
              assignVarToA(vis, 'ap2', cur_ap2);
            assignVarToA(vis, 'max2', cur_max2);
            vis.arrayB.set(b, 'msort_lista_td');
            for (let i = cur_left; i <= cur_bp-1; i++) {
              highlightB(vis, i, false);
            }
            if (cur_bp < a.length) {
              assignVarToB(vis, 'bp', cur_bp);
            } else {
              assignVarToB(vis, 'bp', undefined);  // XXX anination unclear?
            }
          }
          }, [A, B, left, ap1, ap2, max1, max2, bp, simple_stack], depth);

         for (let i = ap2; i <= max2; i++) {
           B[bp] = A[i];
           A[i] = undefined;
           bp = bp+1;
         }

         chunker.add('CopyRest2', (vis, a, b, cur_left, cur_right, cur_ap2,
cur_max2, cur_b, c_stk) => {
          if (isMergeCopyExpanded()) {
            vis.array.set(a, 'msort_lista_td');
            // set_simple_stack(vis.array, c_stk);
            vis.arrayB.set(b, 'msort_lista_td');
            for (let i = cur_left; i <= cur_right; i++) {
              highlightB(vis, i, false);
            }
          }
          if (isMergeExpanded()) {
            if (cur_ap2 < a.length) {
              unhighlight(vis, cur_ap2, true);
              assignVarToA(vis, 'ap2', undefined);
            }
            assignVarToA(vis, 'max2', undefined);
            assignVarToB(vis, 'bp', undefined);
          }
          }, [A, B, left, right, ap2, max2, bp, simple_stack], depth);

        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }
        chunker.add('copyBA', (vis, a, b, cur_left, cur_mid,
cur_right, c_stk) => {
          if (isMergeCopyExpanded()) {
            for (let i = cur_left; i <= cur_right; i++) {
              // unhighlightB(vis, i, false);
            }
            vis.arrayB.set(b, 'msort_lista_td');
          }
          vis.array.set(a, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);
          for (let i = cur_left; i <= cur_right; i++) {
            highlight(vis, i, false);
          }
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap1', undefined);
            assignVarToA(vis, 'max1', undefined);
            assignVarToA(vis, 'ap2', undefined);
            assignVarToA(vis, 'max2', undefined);
          }
          // XXX best highlight cur_mid+1..right from previous
          // recursion level?
          // for (let i = cur_mid+1; i <= right; i++) {
            // highlight(vis, i, true)
          // }
          }, [A, B, left, mid, right, simple_stack], depth);
*/
        // chunk after recursive call, as above, after adjusting
        // stack frames/depth etc
        L = M;  // just for return below
      }
        // XXX should we delete 'else' and always go to the 'Done' line
        // even for non-trivial array segments? (might need to
        // generalise (un)highlight code below
        else
      {
        chunker.add('returnL', (vis, a, cur_L) => {
          // if (cur_left === cur_right) {
            // unhighlight(vis, cur_left, true);
            // highlight(vis, cur_left, false)
          // }
          }, [A, L], depth);
      }

      simple_stack.shift();
      return L;
    }


    // ----------------------------------------------------------------------------------------------------------------------------
    // Perform actual mergesort
    // ----------------------------------------------------------------------------------------------------------------------------

    // XXXXXXXXX
    Indices = ['i'];
    Heads = ['Head(i) (data)'];
    Tails = ['Tail(i) (next)'];
    simple_stack = [];
 
    for (let i = 1; i<entire_num_array.length; i++) {
      Indices.push(i);
      Heads.push(entire_num_array[i-1]);
      Tails.push(i+1);
    }
    Tails[entire_num_array.length-1] = 'Null';
    const msresult = MergeSort(1, entire_num_array.length - 1, 0);
    // const msresult = 0;

    return msresult;
  }
}

