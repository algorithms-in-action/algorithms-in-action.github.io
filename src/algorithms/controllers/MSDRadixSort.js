import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import MaskTracer from '../../components/DataStructures/Mask/MaskTracer'
import {
  areExpanded,
} from './collapseChunkPlugin';

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

const VIS_VARIABLE_STRINGS = {
  i_left_index: 'i',
  j_right_index: 'j',
  i_eq_0: 'i==0',
  j_eq_0: 'j==0',
  left: 'left',
  right: 'right'
};

const MSD_BOOKMARKS = {
  start: 1,
  get_mask: 100,
  first_pass: 200,
  base_case: 300,
  set_i: 301,
  set_j: 302,
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


const update_vis_with_stack_frame = (a, stack_frame, stateVal) => {
  let left, right,  depth;
  [left, right,  depth] = stack_frame;

  for (let i = left; i <= right; i += 1) {
    // each element in the vis stack is a tuple:
    // 0th index is for base color,
    // 1th index is for pivot, i, j colors
    a[depth][i] = { base: stateVal, extra: [] };
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

const highlight = (vis, index, isPrimaryColor = true) => {
    if (isPrimaryColor) {
        vis.array.select(index);
    } else {
        vis.array.patch(index);
    }
};

const unhighlight = (vis, index, isPrimaryColor = true) => {
    if (isPrimaryColor) {
        vis.array.deselect(index);
    } else {
        vis.array.depatch(index);
    }
};

const updateMask = (vis, value) => {
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
              instance: new MaskTracer('mask', null, 'Mask'),
              order: 0,
            },
            array: {
              instance: new ArrayTracer('array', null, 'Array view', { arrayItemMagnitudes: true }), // Label the input array as array view
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
      const finished_stack_frames = []; // [ [left, right,  depth], ...]  (although depth could be implicit this is easier)
      const real_stack = []; // [ [left, right,  depth], ...]
      let leftCheck = false

      // ----------------------------------------------------------------------------------------------------------------------------
      // Define helper functions
      // ----------------------------------------------------------------------------------------------------------------------------

      // The main helper function that acts as an  interface into refreshStack
      // This function is the only way information is cached and incremented properly in the while loop
      const partitionChunker = (bookmark, i, j, left, right, depth, arr) => {
        assert(bookmark !== undefined); // helps catch bugs early, and trace them in stack
        const args_array = [real_stack, finished_stack_frames, i, j, left, right, depth, leftCheck, arr]
        chunker.add(bookmark, refreshStack, args_array, depth)
      }

      const refreshStack = (vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, left, right, cur_depth, checkingLeft, arr) => {
        // XXX
        // We can't render the -1 index in the array
        // For now we display i==0/j==0 at left of array if appropriate
        let cur_i_too_low;
        let cur_j_too_low;
        if (cur_i === -1) {
          cur_i = undefined;
          cur_i_too_low = 0;
        } else {
          cur_i_too_low = undefined;
        }
        if (cur_j === -1) {
          cur_j = undefined;
          cur_j_too_low = 0;
        } else {
          cur_j_too_low = undefined;
        }

        assert(vis.array);
        assert(cur_real_stack && cur_finished_stack_frames);

        if (!isPartitionExpanded()) {
          // j should not show up in vis if partition is collapsed
          cur_j = undefined;
          cur_j_too_low = undefined;
        }

        if (!isPartitionExpanded() && !isRecursionExpanded()) {
          // i should not show up in vis if partition + recursion is collapsed
          cur_i = undefined;
          cur_i_too_low = undefined;
        }

        vis.array.setStackDepth(cur_real_stack.length);
        vis.array.setStack(
          deriveStack(cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_depth)
        );

        // Show the binary representation for the current index
        if (checkingLeft) {
          if (cur_i > 0 && cur_i < n)
            unhighlight(vis, cur_i - 1)
          highlight(vis, cur_i)
          if (arr && cur_i)
            updateBinary(vis, arr[cur_i])
        } else {
          if (cur_j > 0 && cur_j < n)
            unhighlight(vis, cur_j - 1)
          highlight(vis, cur_j)
          if (arr && cur_j)
            updateBinary(vis, arr[cur_j])
        }
        assignVariable(vis, VIS_VARIABLE_STRINGS.left, left);
        assignVariable(vis, VIS_VARIABLE_STRINGS.right, right);
        assignVariable(vis, VIS_VARIABLE_STRINGS.i_left_index, cur_i);
        assignVariable(vis, VIS_VARIABLE_STRINGS.i_eq_0, cur_i_too_low);
        assignVariable(vis, VIS_VARIABLE_STRINGS.j_right_index, cur_j);
        assignVariable(vis, VIS_VARIABLE_STRINGS.j_eq_0, cur_j_too_low);
      };


      function deriveStack(cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_depth) {
        // return 2D array stack_vis containing color values corresponding to stack frame states and indexes in those stack frames
        // for visualise this data

        let stack_vis = [];

        for (let i = 0; i < max_depth_index + 1; i++) {
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
          );
        });

        cur_real_stack.forEach((stack_frame) => {
          stack_vis = update_vis_with_stack_frame(
            stack_vis,
            stack_frame,
            STACK_FRAME_COLOR.In_progress_stackFrame,
          );
        });

        if (cur_real_stack.length !== 0) {
          stack_vis = update_vis_with_stack_frame(
            stack_vis,
            cur_real_stack[cur_real_stack.length - 1],
            STACK_FRAME_COLOR.Current_stackFrame,
          );
        }

        if (cur_depth === undefined) {
          return stack_vis;
        }

        if (!isPartitionExpanded()) { return stack_vis; }

        // if (cur_i >= 0 && cur_i < n) {
        //   stack_vis[cur_depth][cur_i].extra.push(STACK_FRAME_COLOR.I_color);
        // }

        // if (cur_j >= 0 && cur_j < n) {
        //   stack_vis[cur_depth][cur_j].extra.push(STACK_FRAME_COLOR.J_color);
        // }

        return stack_vis;
      }

      const assignVariable = (vis, variable_name, index) => {
        if (index === undefined) { vis.array.removeVariable(variable_name); return; }
        vis.array.assignVariable(variable_name, index);
      }

      // ----------------------------------------------------------------------------------------------------------------------------
      // Real code goes here
      // ----------------------------------------------------------------------------------------------------------------------------
      const partition = (arr, left, right, mask, depth) => {
        let i = left
        let j = right

        const partitionChunkerWrapper = (bookmark) => {
          partitionChunker(bookmark, i, j, left, right, depth, arr)
        }

        function swapAction(bookmark, n1, n2) {
          assert(bookmark !== undefined);
          assert(n1 !== undefined);
          assert(n2 !== undefined);

          [arr[n1], arr[n2]] = [arr[n2], arr[n1]]

          chunker.add(bookmark,
            (vis, _n1, _n2, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_depth) => {

              vis.array.swapElements(_n1, _n2);
              refreshStack(vis, cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_depth)
              // After swap, unhighlight the swapped elements
              unhighlight(vis, n1)
              unhighlight(vis, n2)
            },
            [n1, n2, real_stack, finished_stack_frames, i, j, depth],
          depth);
        }

        partitionChunkerWrapper(MSD_BOOKMARKS.set_i)
        partitionChunkerWrapper(MSD_BOOKMARKS.set_j)
        while (i <= j) {
          // Build the left group until it reaches the mask (find the big element)
          // chunker.add(MSD_BOOKMARKS.partition_left)
          leftCheck = true
          while (i <= right && ((arr[i] >> mask & 1)) === 0) {
            partitionChunkerWrapper(MSD_BOOKMARKS.partition_right)
            i++
          }
          // chunker.add(MSD_BOOKMARKS.partition_right)
          // Build the right group until it fails the mask (find the small element)
          leftCheck = false
          while (j >= left && ((arr[j] >> mask & 1)) === 1) {
            partitionChunkerWrapper(MSD_BOOKMARKS.partition_right)
            j--
          }

          // Swap if the bigger element is not in the right place
          if (j > i) {
            swapAction(MSD_BOOKMARKS.swap, i, j)
          }
        }

        return i

      }

      const msdRadixSortRecursive = (arr, left, right, mask, depth) => {
        real_stack.push([left, right, depth]);
        max_depth_index = Math.max(max_depth_index, depth);
        // Base case: If the array has 1 or fewer elements or mask is less than 0, stop
        chunker.add(MSD_BOOKMARKS.base_case, (vis) => {
          if (left < n)
            assignVariable(vis, VIS_VARIABLE_STRINGS.left, left);
          if (right >= 0)
            assignVariable(vis, VIS_VARIABLE_STRINGS.right, right);
          updateMask(vis, mask)

          for (let i = 0; i < n; i++) {
            unhighlight(vis, i);
          }
        }, [left, right], depth)

        if (left < right && mask >= 0) {
          const mid = partition(arr, left, right, mask, depth)

          // Need a dummy chunk before the recursion call, and an actual call after the recursion call.
          // Each of them should hide the variables, hence the undefined calls.

          partitionChunker(MSD_BOOKMARKS.pre_sort_left, undefined, undefined, undefined, undefined, depth)
          msdRadixSortRecursive(arr, left, mid - 1, mask - 1, depth + 1)
          partitionChunker(MSD_BOOKMARKS.sort_left, left, right, undefined, undefined, depth)

          partitionChunker(MSD_BOOKMARKS.pre_sort_right, undefined, undefined, undefined, undefined, depth)
          msdRadixSortRecursive(arr, mid, right, mask - 1, depth + 1)
          partitionChunker(MSD_BOOKMARKS.sort_right, undefined, undefined, undefined, undefined, depth)

          // After the recursive call, we need to pop from the real stack to go back up one
          finished_stack_frames.push(real_stack.pop())
        } else {
          finished_stack_frames.push(real_stack.pop())
        }
      }

      // Initialise the array on start
      chunker.add(MSD_BOOKMARKS.start,
        (vis, array) => {
            vis.array.set(array, 'MSDRadixSort')
        },
        [nodes],
        0
      )

      const maxIndex = A.indexOf(Math.max(...A))
      const mask = getMaximumBit(A);

      // Highlight the index
      chunker.add(MSD_BOOKMARKS.get_mask,
          (vis) => {
            highlight(vis, maxIndex)
            vis.mask.setMaxBits(mask + 1)
            updateMask(vis, mask)
          },
          [maxIndex, mask],
          0
      )
      chunker.add(MSD_BOOKMARKS.first_pass,
        (vis) => {
          unhighlight(vis, maxIndex)
        }, [maxIndex],
        0
      )
      msdRadixSortRecursive(A, 0, n-1, mask, 0);


      chunker.add(MSD_BOOKMARKS.done,
        vis => {
          vis.array.setStackDepth(0)
          for (let i = 0; i < n; i++) {
            vis.array.sorted(i);
          }
          vis.array.clearVariables();
          vis.array.setStack(deriveStack(real_stack, finished_stack_frames));
        }, [],
        0
      );
      return A;
    }
};
