/* eslint-disable no-multi-spaces,indent,prefer-destructuring */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

export default {
  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array view'), // Label the input array as array view
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

    chunker.add(1, (vis, array) => {
      vis.heap.setHeap(array);
      // tell the graph renderer that it is heapsort
      // so that the array index should start from 1
      vis.array.set(array, 'heapsort');
    }, [nodes]);

    const highlight = (vis, index, primaryColor = true) => {
      if (primaryColor) {
        vis.heap.visit(index + 1);
        vis.array.select(index);
      } else {
        vis.heap.select(index + 1);
        vis.array.patch(index);
      }
    };

    const unhighlight = (vis, index, primaryColor = true) => {
      if (primaryColor) {
        vis.heap.leave(index + 1);
        vis.array.deselect(index);
      } else {
        vis.heap.deselect(index + 1);
        vis.array.depatch(index);
      }
    };

    const swapAction = (b, n1, n2) => {
      chunker.add(b, (vis, _n1, _n2) => {
        vis.heap.swapNodes(_n1 + 1, _n2 + 1);
        vis.array.swapElements(_n1, _n2);
        unhighlight(vis, _n1);
        highlight(vis, _n1, false);
        unhighlight(vis, _n2, false);
        highlight(vis, _n2);
      }, [n1, n2]);
    };

    /** NOTE: In Linda's code, array index starts from 1
     * however, in JS, array index naturally starts from 0
     * index start from 0:
     * parent = k , left child = 2*k + 1, right child = 2*k + 2
     * index start from 1:
     * parent = k , left child = 2*k, right child = 2*k + 1
    */

    // build heap
    // start from the last non-leaf node, work backwards to maintain the heap
    for (let k = Math.floor(n / 2) - 1; k >= 0; k -= 1) {
      chunker.add(4, (vis, p, c) => {
        highlight(vis, p);
        if (c != null) {
          unhighlight(vis, c);
        }
      }, [k, i]);

      let j;
      i = k;
      chunker.add(6);
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
          }, [j]);
        } else {
          j = 2 * i + 1;
          chunker.add(13, (vis, index) => {
            highlight(vis, index, false);
          }, [j]);
        }

        chunker.add(14);
        // parent is greater than largest child, so it is already a valid heap
        if (A[i] >= A[j]) {
          heap = true;
          chunker.add(15, (vis, index) => {
            unhighlight(vis, index, false);
          }, [j]);
        } else {
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          swapAction(17, i, j);
          chunker.add(18, (vis, index) => {
            unhighlight(vis, index, false);
          }, [i]);
          i = j;
        }
      }
    }

    // sort heap
    chunker.add(20, (vis, index) => {
      unhighlight(vis, index);
    }, [i]);
    while (n > 0) {
      let j;
      swap = A[n - 1];
      A[n - 1] = A[0];
      A[0] = swap;

      chunker.add(21, (vis, index) => {
        highlight(vis, 0);
        highlight(vis, index, false);
      }, [n - 1]);
      swapAction(21, 0, n - 1);

      chunker.add(22, (vis, index) => {
        unhighlight(vis, index);
        unhighlight(vis, 0, false);
        vis.array.sorted(index);
      }, [n - 1]);
      n -= 1;

      i = 0;
      chunker.add(24, (vis, index) => {
        highlight(vis, index);
      }, [i]);

      chunker.add(25);
      heap = false;

      chunker.add(26);
      // need to maintain the heap after swap
      while (!(2 * i + 1 >= n || heap)) {
        chunker.add(28);

        if (2 * i + 2 < n && A[2 * i + 1] < A[2 * i + 2]) {
          j = 2 * i + 2;
          chunker.add(29, (vis, index) => {
            highlight(vis, index, false);
          }, [j]);
        } else {
          j = 2 * i + 1;
          chunker.add(31, (vis, index) => {
            highlight(vis, index, false);
          }, [j]);
        }

        chunker.add(32);
        if (A[i] >= A[j]) {
          heap = true;
          chunker.add(33, (vis, p, c) => {
            unhighlight(vis, p);
            unhighlight(vis, c, false);
          }, [i, j]);
        } else {
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          swapAction(35, i, j);
          chunker.add(36, (vis, p, c) => {
            unhighlight(vis, p, false);
            unhighlight(vis, c);
          }, [i, j]);
          i = j;

          // if current node is a leaf, then do not highlight the node
          if (!(2 * i + 1 >= n)) {
            chunker.add(28, (vis, index) => {
              highlight(vis, index);
            }, [i]);
          }
        }
      }
    }
    // for test
    return A;
  },
};
