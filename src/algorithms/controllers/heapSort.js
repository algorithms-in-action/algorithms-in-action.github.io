// Heapsort animation
// 
// It's worth looking at this code if you are planning to write any new
// modules.
// 
// This was the first animation done and the code is reasonably simple -
// the abstractions supported match what we need for this algorithm.
// For various other algorithms, the code seems much more messy - maybe
// the abstractions for the data structures/rendering are not quite what
// is needed or the coding is done with a sledgehammer, so to speak.
// 
// The original version of this code was not quite right in the way it
// adapted (or didn't adapt) to expansion/collapse of code blocks.  This
// was added later in a reasonably simple way (again, other algorithms
// may use the sledgehammer style).
// 
// One thing that could make the code here more readable is to use
// meaningful strings for bookmarks rather than numbers.
// The way colors are done could also be improved - currently moving to
// a less insane scheme so there is some consistency between colors for
// array elements and tree/graph nodes.

/* eslint-disable no-multi-spaces,indent,prefer-destructuring,brace-style */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import {areExpanded} from './collapseChunkPlugin';
import {colors} from '../../components/DataStructures/colors';

// currently colors for graphs (including trees) are still a mess; this
// is kind of a stub for when they are fixed up.  The code involving
// (un)highlight() and .sorted() should be fixed at this point also.
// We define colors for the array (_A) and tree (_T) views; note current and
// child nodes are swapped at times in downheap. At the start, nothing
// is selected but it turns out that whenever anything is de-selected it
// is part of a heap.
const HSColors = {
    CURRENT_A: colors.apple,
    CHILD_A: colors.sky,
    HEAP_A: colors.leaf,
    CURRENT_T: 3,  // Red (globalColors.apple)
    CHILD_T: 4,  // Blue (globalColors.sky)
    HEAP_T: 1, // Green (globalColors.leaf)
  }


// k displayed only if first BuildHeap is expanded
// Note: This is only needed in the last chunk of BuildHeap. The code
// looks like it displays k throughout BuildHeap but when BuildHeap is
// collapsed, only the last chunk is rendered so the other chunks don't
// matter and we can avoid testing what is expanded there.  Another
// approach would be to use a wrapper function for assigning to k, which
// checks isBuildHeapExpanded() (it doesn't generalise well for i and j
// though).
function isBuildHeapExpanded() {
  return areExpanded(['BuildHeap']);
}

// i, j (in build) displayed only if first DownHeap is expanded
// See Note in isBuildHeapExpanded()
function isDownHeapkExpanded() {
  return areExpanded(['BuildHeap', 'DownHeapk']);
}

// i, j (in sort) displayed only if second DownHeap is expanded
function isDownHeap1Expanded() {
  return areExpanded(['SortHeap', 'DownHeap1']);
}

export default {
  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array view', { arrayItemMagnitudes: true }), // Label the input array as array view
        order: 0,
      },
      heap: {
        instance: new GraphTracer('heap', null, 'Tree view'), // Label the animation of the heap as tree view
        order: 1,
      },
    };
  },


  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   */
  run(chunker, { nodes }) {
    // create a copy, can't simply let A = nodes because it creates a reference
    // sort A in-place will cause nodes sorted as well
    const A = [...nodes];
    let n = nodes.length;
    let i;
    let heap;
    let swap;

    chunker.add(
      1,
      (vis, array) => {
        vis.heap.setHeap(array);
        // tell the graph renderer that it is heapsort
        // so that the array index should start from 1
        vis.array.set(array, 'heapsort');
      },
      [nodes],
    );

    const highlight = (vis, index, primaryColor = true) => {
      if (primaryColor) {
        vis.heap.colorNode(index + 1, HSColors.CURRENT_T);
        vis.array.selectColor(index, colors.apple);
      } else {
        vis.heap.colorNode(index + 1, HSColors.CHILD_T);
        vis.array.selectColor(index, colors.sky);
      }
    };

    const unhighlight = (vis, index, primaryColor = true) => {
      if (primaryColor) {
        vis.heap.colorNode(index + 1, HSColors.HEAP_T);
      } else {
        vis.heap.colorNode(index + 1, HSColors.HEAP_T);
      }
     vis.array.selectColor(index, HSColors.HEAP_T);
    };

    const swapAction = (b, n1, n2) => {
      chunker.add(b, (vis, _n1, _n2) => {
        vis.heap.swapNodes(_n1 + 1, _n2 + 1);
        vis.array.swapElements(_n1, _n2);
      }, [n1, n2]);
    };

    /** NOTE: In Lee's code, array index starts from 1
     * however, in JS, array index naturally starts from 0
     * index start from 0:
     * parent = k , left child = 2*k + 1, right child = 2*k + 2
     * index start from 1:
     * parent = k , left child = 2*k, right child = 2*k + 1
     */

    // keep track of last node highlighted due to i (or k) so we can
    // unhighlight it of buildHeap is collapsed
    let lastiHighlight;

    // build heap
    // start from the last non-leaf node, work backwards to maintain the heap
    let lastNonLeaf = Math.floor(n / 2) - 1;
    for (let k = lastNonLeaf; k >= 0; k -= 1) {

      let j;
      const tmp = i;
      i = k;

      chunker.add(4, (vis, index1, index2, first, max) => {
        vis.array.assignVariable('k', index1);
        if (index1 === first) { // done the first time we reach here
          for (let l = index1 + 1; l <= max; l++) { // color leaves
            vis.heap.colorNode(l + 1, HSColors.HEAP_T);
            vis.array.selectColor(l, HSColors.HEAP_T);
          }
        }
        if (index2 != null) {
          unhighlight(vis, index2);
          vis.array.removeVariable('j');
        }
        highlight(vis, index1);
      }, [i, tmp, lastNonLeaf, n - 1]);

      chunker.add(6, (vis, index1, index2) => {
        vis.array.assignVariable('i', index1);
      }, [i, tmp]);

      lastiHighlight = k;
      heap = false;
      chunker.add(7);

      chunker.add(8);
      // if current node's left child's index is greater than array length,
      // then current node is a leaf
      while (!(2 * i + 1 >= n || heap)) {
        chunker.add(10);

        // left child is smaller than right child
        if (2 * i + 2 < n && A[2 * i + 1] < A[2 * i + 2]) {
          j = 2 * i + 2;
          chunker.add(11, (vis, index) => {
            highlight(vis, index, false);
            vis.array.assignVariable('j', index);
          }, [j]);
        } else {
          j = 2 * i + 1;
          chunker.add(13, (vis, index) => {
            highlight(vis, index, false);
            vis.array.assignVariable('j', index);
          }, [j]);
        }

        chunker.add(14);
        // parent is greater than largest child, so it is already a valid heap
        if (A[i] >= A[j]) {
          heap = true;
          chunker.add(15, (vis, index, lastH, cur_k) => {
            unhighlight(vis, index, false);
            // possible last chunk in BuildHeap/DownHeapk
            // remove i, j if !isDownHeapkExpanded
            if (!isDownHeapkExpanded()) {
              vis.array.removeVariable('i');
              vis.array.removeVariable('j');
            }
            // remove k+highlighting if !isBuildHeapExpanded & last
            // chunk of BuildHeap
            if (!isBuildHeapExpanded() && cur_k === 0) {
              vis.array.removeVariable('k');
              if (lastH !== index)
                unhighlight(vis, lastH);
            }
          }, [j, lastiHighlight, k]);
        } else {
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          swapAction(17, i, j);
          lastiHighlight = j;
          chunker.add(18, (vis, p, c, lastH, cur_k) => {
            unhighlight(vis, p, false);
            vis.array.assignVariable('i', c);
            // remove i, j if !isDownHeapkExpanded
            if (!isDownHeapkExpanded()) {
              vis.array.removeVariable('i');
              vis.array.removeVariable('j');
            }
            // remove k+highlighting if !isDownHeapkExpanded & last
            // chunk of BuildHeap
            if (!isBuildHeapExpanded() && cur_k === 0) {
              vis.array.removeVariable('k');
              if (lastH !== p)
                unhighlight(vis, lastH);
            }
          }, [i, j, lastiHighlight, k]);
          i = j;
        }
      }
    }

    // sort heap

    while (n > 1) {
      chunker.add(20, (vis, nVal, index) => {
        // clear variables & show 'n'
        vis.array.clearVariables();
        vis.array.assignVariable('n', nVal - 1);
        unhighlight(vis, index);
      }, [n, i]);

      let j;
      swap = A[n - 1];
      A[n - 1] = A[0];
      A[0] = swap;

      chunker.add(21, (vis, index) => {
        highlight(vis, index);
        highlight(vis, 0, false);
      }, [n - 1]);
      swapAction(21, 0, n - 1);

      chunker.add(22, (vis, index) => {
        unhighlight(vis, index, false);
        vis.array.sorted(index);
        vis.heap.removeNodeColor(index + 1);
        vis.heap.sorted(index + 1);

        vis.array.assignVariable('n', index - 1);
      }, [n - 1]);
      n -= 1;

      i = 0;
      chunker.add(24, (vis, index1, nVal) => {
        vis.array.assignVariable('i', index1);
      }, [i, n]);

      chunker.add(25);
      heap = false;

      chunker.add(26, (vis, nVal) => {
        // if (nVal === 0) vis.array.clearVariables();
      }, [n]);
      // need to maintain the heap after swap
      while (!(2 * i + 1 >= n || heap)) {
        chunker.add(28);

        if (2 * i + 2 < n && A[2 * i + 1] < A[2 * i + 2]) {
          j = 2 * i + 2;
          chunker.add(29, (vis, index) => {
            highlight(vis, index, false);
            vis.array.assignVariable('j', index);
          }, [j]);
        } else {
          j = 2 * i + 1;
          chunker.add(31, (vis, index) => {
            highlight(vis, index, false);
            vis.array.assignVariable('j', index);
          }, [j]);
        }

        chunker.add(32);
        if (A[i] >= A[j]) {
          heap = true;
          chunker.add(33, (vis, index) => {
            unhighlight(vis, index, false);
          }, [j]);
        } else {
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          swapAction(35, i, j);
          chunker.add(36, (vis, p, c) => {
            unhighlight(vis, p, false);
            vis.array.assignVariable('i', c);
            // remove i, j if !isDownHeap1Expanded
            if (!isDownHeap1Expanded()) {
              vis.array.removeVariable('i');
              vis.array.removeVariable('j');
            }
          }, [i, j]);
          i = j;
        }
      }
    }
    chunker.add(37, (vis) => {
      // Put in done state
      vis.array.clearVariables();
      // vis.array.deselect(0);
      unhighlight(vis, 0, true);
      vis.array.sorted(0);
      vis.heap.removeNodeColor(1);
      vis.heap.sorted(1);
    });
    // for test
    return A;
  },
};
