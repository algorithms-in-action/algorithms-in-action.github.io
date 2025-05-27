// Some color code could be cleaned up
// Could share some code with straight radix sort and quicksort
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import MaskTracer from '../../components/DataStructures/Mask/MaskTracer'
import {
  areExpanded,
} from './collapseChunkPlugin';
import { createPopper } from '@popperjs/core';
import {colors} from '../../components/DataStructures/colors';

const partLColor = colors.peach;
const partRColor = colors.sky;
const sortedColor = colors.stone;
const highlightColor = colors.apple; // for i,j in partition,...

// see stackFrameColour in Array1DRenderer/index.js to find corresponding function mapping to css
const STACK_FRAME_COLOR = {
  No_color: 0,
  In_progress_stackFrame: 1,
  Current_stackFrame: 2,
  Finished_stackFrame: 3,
  I_color: 4, // not currently used
  J_color: 5, // not currently used
  P_color: 6, // pivot, left-over from quicksort
  // Because MSD radix sort doesn't have a pivot splitting the two
  // halves of a partition, it was hard to reconsruct recursion after
  // the fact.  The solution here is to have a separate colour for the
  // right part of each partition (when known)
  In_progress_stackFrameR: 7,
  Current_stackFrameR: 8,
  Finished_stackFrameR: 9,
};

const VIS_VARIABLE_STRINGS = {
  i_left_index: 'i',
  j_right_index: 'j',
  i_eq_0: 'i==0',
  i_gt_n: 'i==n+1',
  j_eq_0: 'j==0',
  j_gt_n: 'j==n+1',
  left: 'left',
  right: 'right',
  right_eq_0: 'right==0'
};

const MSD_BOOKMARKS = {
  start: 1,
  get_mask: 100,
  rec_function: 200,
  top_call: 201,
  base_case: 300,
  set_i: 301,
  // set_j: 302, // deleted
  partition_while: 303,
  partition_left: 304,
  partition_right: 305,
  swap_condition: 309,
  swap: 310,
  pre_sort_left: 400,
  sort_left: 401,
  pre_sort_right: 500,
  sort_right: 501,
  done: 5000
};


// update stack frame left..right with new value(s)
// If mid is defined and index >= mid use stateValR, otherwise stateVal
// Stack frames are all [left, right, mid, depth],
const FRAME_MID = 2;
const FRAME_DEPTH = 3;
const update_vis_with_stack_frame = (a, stack_frame, stateVal, stateValR) => {
  let left, right, mid, depth;
  [left, right, mid, depth] = stack_frame;

  for (let k = left; k <= right; k += 1) {
    // each element in the vis stack is a tuple:
    // 0th index is for base color,
    // 1th index is for pivot, i, j colors (not used here)
    a[depth][k] = { base: (k >= mid? stateValR: stateVal), extra: [] };
  }
  return a;
}

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

const isPartitionExpanded = () => {
  return areExpanded(['Partition'])
}

const isRecursionExpanded = () => {
  return areExpanded(['MSDRadixSortLeft']) || areExpanded(['MSDRadixSortRight']);
}

const highlight = (vis, index) => {
    vis.array.selectColor(index, highlightColor);
};  

const unhighlight = (vis, index) => {
    vis.array.deselect(index);
};

const updateMask = (vis, value) => {
  if (value < 0)
    vis.mask.setMask(0, value)
  else
    vis.mask.setMask(2 ** value, value)
}

const updateBinary = (vis, value) => {
  vis.mask.setBinary(value)
}

// Helper function to determine the number of bits needed
const getMaximumBit = (arr) => {
    let max = Math.max(...arr);
    let maxBit = -1;

    while (max > 0) {
        max = Math.floor(max / 2);
        maxBit++;
    }

    return maxBit
}

export default {
    initVisualisers() {
        return {
            mask: {
              instance: new MaskTracer('mask', null, 'Key + Mask'),
              order: 0,
            },
            array: {
              instance: new ArrayTracer('array', null, 'Array', { arrayItemMagnitudes: true }), // Label the input array as array view
              order: 1,
            },
        }
    },

    /**
     *
     * @param {object} chunker
     * @param {array} nodes array of numbers needs to be sorted
     */
    run(chunker, { nodes }) {
      let A = [...nodes]
      let n = A.length

      // ----------------------------------------------------------------------------------------------------------------------------
      // Define 'global' variables
      // ----------------------------------------------------------------------------------------------------------------------------

      const entire_num_array = nodes;
      let max_depth_index = -1; // indexes into 2D array, starts at zero
      // stack frames are all [left, right, mid, depth],
      // where mid is undefined until after partition
      const finished_stack_frames = [];
      const real_stack = [];

      // ----------------------------------------------------------------------------------------------------------------------------
      // Define helper functions
      // ----------------------------------------------------------------------------------------------------------------------------

      // The main helper function that acts as an  interface into refreshStack
      // This function is the only way information is cached and incremented properly in the while loop
      const partitionChunker = (bookmark, i, j, prev_i, prev_j, left, right, depth, arr, mask) => {
        assert(bookmark !== undefined); // helps catch bugs early, and trace them in stack
        const args_array = [real_stack, finished_stack_frames, i, j, prev_i, prev_j, left, right, depth, bookmark, maxIndex, arr, mask]
        chunker.add(bookmark, refreshStack, args_array, depth)
      }

      const refreshStack = (vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, prev_i, prev_j, left, right, cur_depth, whereAreWe, maxIndex, arr, mask) => {
        // If we fall off the start/end of the array we just use the
        // first/last element and give the actual value of j/i
        let cur_i_too_low;
        let cur_i_too_high;
        let cur_j_too_low;
        let cur_j_too_high;
        let tmp_j = cur_j; // used to determine context later
        if (cur_i === A.length) {
          cur_i = undefined;
          cur_i_too_high = A.length - 1;
        } else if (cur_i === -1) {
          cur_i = undefined;
          cur_i_too_low = 0;
        }
        if (cur_j === A.length) {
          cur_j = undefined;
          cur_j_too_high = A.length - 1;
        } else if (cur_j === -1) {
          cur_j = undefined;
          cur_j_too_low = 0;
        }

        assert(vis.array);
        assert(cur_real_stack && cur_finished_stack_frames);

        // This was getting very messy - colors depends a
        // lot on where we are and we had a bunch of tricky testing of
        // various vars to determine that.  Now we use whereAreWe
        // (current bookmark) simplify some things at least.
        // XXX prev_i and prev_j are no longer used so could be deleted
        // as parameters and elsewhere

        // Show the binary representation for the current index
        // plus color appropriate element(s)
        updateMask(vis, mask) // needed at call/return of recursive function
        if (whereAreWe === MSD_BOOKMARKS.rec_function) {
          // top level call to recursive fn
          unhighlight(vis, maxIndex)
          updateBinary(vis, 0)
	}
        if (whereAreWe === MSD_BOOKMARKS.pre_sort_left) {
          // just before first recursive call
          for (let k = cur_i; k <= right; k++)
            vis.array.deselect(k);
        } else if (whereAreWe === MSD_BOOKMARKS.partition_left) {
          // note i can fall off RHS of array...
          if (cur_i !== undefined && cur_i <= right ) {
            updateBinary(vis, arr[cur_i]);
            if ((arr[cur_i] >> mask & 1) === 1)
              vis.array.selectColor(cur_i, partRColor)
            else {
              vis.array.selectColor(cur_i, partLColor);
            }
          }
        } else if (whereAreWe === MSD_BOOKMARKS.partition_right) {
          // note j can fall off LHS of array...
          if (cur_j !== undefined && cur_j >= left ) {
            updateBinary(vis, arr[cur_j]);
            if ((arr[cur_j] >> mask & 1) === 0)
              vis.array.selectColor(cur_j, partLColor)
            else {
              vis.array.selectColor(cur_j, partRColor);
            }
          }
        }

        vis.array.setStackDepth(cur_real_stack.length);
        vis.array.setStack(
          deriveStack(cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_depth)
        );
        if (left < A.length) // shouldn't happen with initial mask choice
          assignVariable(vis, VIS_VARIABLE_STRINGS.left, left);
        if (right >= 0) {
          assignVariable(vis, VIS_VARIABLE_STRINGS.right, right);
          assignVariable(vis, VIS_VARIABLE_STRINGS.right_eq_0, undefined);
        } else {
          assignVariable(vis, VIS_VARIABLE_STRINGS.right, undefined);
          assignVariable(vis, VIS_VARIABLE_STRINGS.right_eq_0, 0);
        }
        if (isPartitionExpanded() || isRecursionExpanded()) {
          assignVariable(vis, VIS_VARIABLE_STRINGS.i_left_index, cur_i);
          assignVariable(vis, VIS_VARIABLE_STRINGS.i_eq_0, cur_i_too_low);
          assignVariable(vis, VIS_VARIABLE_STRINGS.i_gt_n, cur_i_too_high);
	}
        if (isPartitionExpanded()) {
          assignVariable(vis, VIS_VARIABLE_STRINGS.j_right_index, cur_j);
          assignVariable(vis, VIS_VARIABLE_STRINGS.j_eq_0, cur_j_too_low);
          assignVariable(vis, VIS_VARIABLE_STRINGS.j_gt_n, cur_j_too_high);
        }
      };


      function deriveStack(cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_depth) {
        // return 2D array stack_vis containing color values corresponding to stack frame states and indexes in those stack frames
        // for visualise this data

        let stack_vis = [];

        for (let k = 0; k < max_depth_index + 1; k++) {
          // for whatever reason fill() does not work here... JavaScript
          stack_vis.push(
            [...Array.from({ length: entire_num_array.length })].map(() => ({
              base: STACK_FRAME_COLOR.No_color,
              extra: [],
            })),
          );
        }

        cur_finished_stack_frames.forEach((stack_frame) => {
          stack_vis = update_vis_with_stack_frame(
            stack_vis,
            stack_frame,
            STACK_FRAME_COLOR.Finished_stackFrame,
            STACK_FRAME_COLOR.Finished_stackFrameR,
          );
        });

        cur_real_stack.forEach((stack_frame) => {
          stack_vis = update_vis_with_stack_frame(
            stack_vis,
            stack_frame,
            STACK_FRAME_COLOR.In_progress_stackFrame,
            STACK_FRAME_COLOR.In_progress_stackFrameR,
          );
        });

        if (cur_real_stack.length !== 0) {
          stack_vis = update_vis_with_stack_frame(
            stack_vis,
            cur_real_stack[cur_real_stack.length - 1],
            STACK_FRAME_COLOR.Current_stackFrame,
            STACK_FRAME_COLOR.Current_stackFrameR,
          );
        }
        return stack_vis;
      }

      const assignVariable = (vis, variable_name, index) => {
        if (index === undefined) { vis.array.removeVariable(variable_name); return; }
        vis.array.assignVariable(variable_name, index);
      }

      // ----------------------------------------------------------------------------------------------------------------------------
      // Real code goes here
      // ----------------------------------------------------------------------------------------------------------------------------
      // index of max number for determinine number of mask bits,
      // defined here so we can highlight it outside
      // msdRadixSortRecursive then unhighlight it at in the first call
      let maxIndex;
      let i;  // moved outside partition because they are needed in
      let j;  // the recursive calls; XX best rename - "i" too generic
      let prev_i;  // for unhighlighting
      let prev_j;  // for unhighlighting
      // search for POPPERS: below for more detailed comments
      let floatingBoxes = new Array(n); // XXX popper instances (rename)
      let DELAY_POPPER_CREATE = 600;
      let DELAY_POPPER_RESET = 700;
      let DELAY_POPPER_SWAP = 700;

      const partition = (arr, left, right, mask, depth) => {
        i = left-1
        j = right+1

        const partitionChunkerWrapper = (bookmark) => {
          partitionChunker(bookmark, i, j, prev_i, prev_j, left, right, depth, arr, mask)
        }

        function swapAction(bookmark, n1, n2) {
          assert(bookmark !== undefined);
          assert(n1 !== undefined);
          assert(n2 !== undefined);

          [arr[n1], arr[n2]] = [arr[n2], arr[n1]]

          chunker.add(bookmark,
            (vis, _n1, _n2, cur_real_stack, cur_finished_stack_frames,
cur_i, cur_j, cur_depth, A) => {

              vis.array.swapElements(_n1, _n2);
              refreshStack(vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, prev_i, prev_j, left, right, cur_depth, false, undefined, A, mask)
              // redo poppers: swapping the elements keeps the
              // contents of the poppers correct but the position needs
              // to change. The documentation suggests update()
              // should work and it does partially but it also screws up
              // the position sometimes, particularly for _n1; it
              // returns a promise but we can't use await here. The
              // contents also gets screwed up sometimes stepping
              // backwards (stepping backwards again seems to help). The
              // wonders of asynchronous programming...
              // The solution we use here is to schedule a forceUpdate()
              // after a bit of a delay - seems to work ok on some
              // devices at least...
              setTimeout( () => floatingBoxes[_n1].forceUpdate(), DELAY_POPPER_SWAP);
              setTimeout( () => floatingBoxes[_n2].forceUpdate(), DELAY_POPPER_SWAP);
            },
            [n1, n2, real_stack, finished_stack_frames, i, j, depth,
arr],
          depth);
        }

        partitionChunkerWrapper(MSD_BOOKMARKS.set_i);
        // partitionChunkerWrapper(MSD_BOOKMARKS.set_j)
        while (i < j) {
          prev_i = i; // save prev value for unhighlighting
          prev_j = j;
          // Build the left group until it reaches the mask (find the big element)
          i++;
          partitionChunkerWrapper(MSD_BOOKMARKS.partition_left)
          while (i < j && (arr[i] >> mask & 1) === 0) {
            i++
            partitionChunkerWrapper(MSD_BOOKMARKS.partition_left)
          }
          // Build the right group until it fails the mask (find the small element)
          j--;
          partitionChunkerWrapper(MSD_BOOKMARKS.partition_right)
          while (j > i && (arr[j] >> mask & 1) === 1) {
            j--
            partitionChunkerWrapper(MSD_BOOKMARKS.partition_right)
          }

          // Swap if the bigger element is not in the right place
          if (i < j) {
            partitionChunkerWrapper(MSD_BOOKMARKS.swap_condition)
            swapAction(MSD_BOOKMARKS.swap, i, j)
          } else {
            // about to return i from partition.  We update the "mid" of
            // the partition on the stack here so it is displayed at the
            // last chunk of partition
            real_stack[real_stack.length - 1][FRAME_MID] = i;
            partitionChunkerWrapper(MSD_BOOKMARKS.swap_condition)
          }
        }

        prev_i = i;
        prev_j = j;
        return i

      }

      const msdRadixSortRecursive = (arr, left, right, mask, depth) => {
        real_stack.push([left, right, undefined, depth]);
        max_depth_index = Math.max(max_depth_index, depth);
        // Base case: If the array has 1 or fewer elements or mask is less than 0, stop
        partitionChunker(MSD_BOOKMARKS.rec_function, undefined, undefined, undefined, undefined, left, right, depth, arr, mask)
        maxIndex = undefined; // defined only for top level call
        chunker.add(MSD_BOOKMARKS.base_case, (vis, l, r) => {
           if (left < right && mask >= 0)
               // need to sort -> remove color
               for (let k = left; k <= right && k < n; k++) {
                   vis.array.deselect(k);
               }
           else
               // done -> sortedColor
               for (let k = left; k <= right && k < n; k++) {
                   vis.array.selectColor(k, sortedColor);
               }
        }, [left, right], depth)

        if (left < right && mask >= 0) {
          // partition leaves final i and j highlighted, sets prev_i,
          // prev_j
          const mid = partition(arr, left, right, mask, depth)

          // Need a dummy chunk before the recursion call, and an actual call after the recursion call.
          // j is no longer needed but i is

          partitionChunker(MSD_BOOKMARKS.pre_sort_left, i, undefined, prev_i, prev_j, left, right, depth, arr, mask)
          prev_i = undefined; // i, j now unhighlighted
          prev_j = undefined;
          let saved_i = i;  // needed for second recursive call
          msdRadixSortRecursive(arr, left, mid - 1, mask - 1, depth + 1)
          i = saved_i;
          partitionChunker(MSD_BOOKMARKS.sort_left, i, undefined, undefined, undefined,left, right, depth, arr, mask)

          partitionChunker(MSD_BOOKMARKS.pre_sort_right, i, undefined, undefined, undefined, left, right, depth, arr, mask)
          msdRadixSortRecursive(arr, mid, right, mask - 1, depth + 1)
          partitionChunker(MSD_BOOKMARKS.sort_right, undefined, undefined, undefined, undefined, left, right, depth, arr, mask)

        }
        // After the recursive call, we need to pop from the real stack to go back up one
        finished_stack_frames.push(real_stack.pop());
      }

      // XXX probably should rename floatingBoxes to something like poppers.
      // POPPERS:
      // Handling is rather tricky. We have the global array of poppers,
      // which display the binary version of the data when the mouse is
      // over the data.  They are derived from the HTML displayed (the
      // array renderer puts wrappers around array elements). However,
      // the display of HTML is asynchronous, making things a bit of a
      // nightmare, to put it mildly. When the algorithm is initially
      // loaded/run, the array is filled with nulls. When the first
      // chunk is executed for the first time, a popper is created for
      // each data item and put in the array. A carefully crafted delay
      // (using setTimeout) is inserted before popper creation to allow
      // the HTML array contents to be rendered first.  When array
      // elements are swapped, the wrappers that the poppers rely on are
      // swapped with them so the poppers automatically follow the data
      // around... almost. They need to update their location (so the
      // popper appears next to the current location of the data, not
      // where the data used to be or some other random point); we use
      // forceUpdate(), which also needs to be inside a setTimeout to
      // allow rendering to take place first.  Just to add to the
      // complexity, if the execution steps backwards, all the chunks
      // are re-executed, starting from the first one.  The first chunk
      // therefore checks if poppers have already been created and, if
      // so, calls forceUpdate() (inside setTimeout of course) for each
      // popper so it gets the right screen location.
      // XXX It would probably be nicer to allow users to click on a
      // data element and have that displayed with the mask etc.  This
      // was implemented in the BROKEN-radix-click4binary branch but it
      // somehow breaks react - no further stepping through the
      // animation is possible after a click:(
      floatingBoxes.fill(null);

      // We don't display maxIndex yet but use it for creating poppers
      // with the desired number of bits.  We want to create the poppers
      // in the first chunk so there is a bit of a delay before anything
      // else happens. 
      maxIndex = A.indexOf(Math.max(...A))
      const mask = getMaximumBit(A);

      // Initialise the array on start
      chunker.add(MSD_BOOKMARKS.start,
        (vis, array, mask) => {
            vis.array.set(array, 'MSDRadixSort')
            vis.array.setSize(5);  // more space for array
            vis.array.setZoom(0.90);
            // set up poppers
            // A bit of a nightmare due to asynchronous programming. The
            // first time this is called we create the poppers (after a
            // delay); subsequently we just update them (after a delay).
            // XXX could just use one setTimeout for all the poppers
            for (let idx = 0; idx < array.length; idx++) {
              if (floatingBoxes[idx] === null) {
                setTimeout( () => {
                  const popper = document.getElementById('float_box_' + idx);
                  const slot = document.getElementById('chain_' + idx);
                  floatingBoxes[idx] =  createPopper(slot, popper, {
                      placement: "right-start",
                      strategy: "fixed",
                      modifiers: [
                          {
                              removeOnDestroy: true, // doesn't work well?
                              name: 'preventOverflow',
                              options: {
                                // XXX popper_boundary not defined for 1D
                                // array - maybe it should be??
                                boundary: document.getElementById('popper_boundary'),
                              },
                          },
                      ]
                  });
                  popper.innerHTML = array[idx].toString(2).padStart(mask + 1, "0");
                }, DELAY_POPPER_CREATE);
              } else {
                setTimeout( () => floatingBoxes[idx].forceUpdate(), DELAY_POPPER_RESET);
              }
            }
        },
        [A, mask],
        0
      )

      // Highlight the index of the max element + init mask
      chunker.add(MSD_BOOKMARKS.get_mask,
          (vis, maxIndex, mask, A) => {
            highlight(vis, maxIndex)
            vis.mask.setMaxBits(mask + 1)
            updateMask(vis, mask)
            updateBinary(vis, A[maxIndex])
          },
          [maxIndex, mask, A],
          0
      )
      msdRadixSortRecursive(A, 0, n-1, mask, 0);

      chunker.add(MSD_BOOKMARKS.done,
        vis => {
          vis.array.setStackDepth(0)
          for (let k = 0; k < n; k++) {
            vis.array.sorted(k);
          }
          vis.array.clearVariables();
          vis.array.setStack(deriveStack(real_stack, finished_stack_frames));
        }, [],
        0
      );
      return A;
    }
};
