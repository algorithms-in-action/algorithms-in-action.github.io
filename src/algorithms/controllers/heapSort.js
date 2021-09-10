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

    const swapAction = (b1, b2, n1, n2) => {
      chunker.add(b1, (vis, _n1, _n2) => {
        vis.heap.visit(_n1 + 1);
        vis.heap.visit(_n2 + 1);
        vis.array.patch(_n1);
        vis.array.patch(_n2);
      }, [n1, n2]);

      chunker.add(b2, (vis, _n1, _n2) => {
        vis.heap.swapNodes(_n1 + 1, _n2 + 1);
        vis.heap.leave(_n1 + 1);
        vis.heap.leave(_n2 + 1);
        vis.array.swapElements(_n1, _n2);
        vis.array.depatch(_n2);
        vis.array.depatch(_n1);
        
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
      chunker.add(4, (vis, index) => {
        vis.array.select(index);
        vis.heap.select(index + 1);
        vis.array.assignVariable('k', index)
      }, [k]);

      let j;
      i = k;

      chunker.add(6, (vis, index) => {
        vis.array.assignVariable('i', index)
      }, [i]);

      heap = false;
      chunker.add(7);

      chunker.add(8);
      // if current node's left child's index is greater than array length,
      // then current node is a leaf
      while (!(2 * i + 1 >= n || heap)) {
        // chunker.add(10, (vis, index) => {
        //   vis.array.select(index);
        //   vis.heap.select(index + 1);
        // }, [i]);
        chunker.add(10);

        // left child is smaller than right child
        if (2 * i + 2 < n && A[2 * i + 1] < A[2 * i + 2]) {
          j = 2 * i + 2;
          chunker.add(11, (vis, index) => {
            vis.array.select(index);
            vis.heap.select(index + 1);
            vis.array.assignVariable('j', index)
          }, [j]);
        } else {
          j = 2 * i + 1;
          chunker.add(13, (vis, index) => {
            vis.array.select(index);
            vis.heap.select(index + 1);
            vis.array.assignVariable('j', index)
          }, [j]);
        }

        chunker.add(14);
        // parent is greater than largest child, so it is already a valid heap
        if (A[i] >= A[j]) {
          heap = true;
          chunker.add(15, (vis, p, c) => {
            vis.array.deselect(p);
            vis.array.deselect(c);
            vis.heap.deselect(p + 1);
            vis.heap.deselect(c + 1);
          }, [i, j]);
        } else {
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          swapAction(17, 17, i, j);
          chunker.add(18, (vis, p, c) => {
            vis.array.deselect(p);
            vis.array.deselect(c);
            vis.heap.deselect(p + 1);
            vis.heap.deselect(c + 1);
            vis.array.assignVariable('i', c)
          }, [i, j]);
          i = j;

          // if current node is a leaf, then do not highlight the node
          if (!(2 * i + 1 >= n)) {
            chunker.add(10, (vis, index) => {
              vis.array.select(index);
              vis.heap.select(index + 1);
            }, [i]);
          }
        }
      }
    }

    // sort heap
    while (n > 1) {
      chunker.add(20, (vis, nVal) => {
        // if first iteration of while loop - clear variables & show 'n' 
        if (nVal === nodes.length) { 
          vis.array.clearVariables();
          vis.array.assignVariable('n', nVal-1)
        }
        // else only clear 'j'
        else vis.array.removeVariable('j')
      }, [n]); 

      let j;
      swap = A[n - 1];
      A[n - 1] = A[0];
      A[0] = swap;
      swapAction(21, 21, 0, n - 1);

      // chunker.add(22, (vis, index) => {
      //   vis.array.patch(index);
      // }, [n - 1]);
      chunker.add(22, (vis, index) => {
        vis.array.sorted(index);
        vis.array.assignVariable('n', index-1);
      }, [n - 1]);
      n -= 1;

      i = 0;
      chunker.add(24, (vis, index) => {
        vis.array.select(index);
        vis.heap.select(index + 1);
        vis.array.assignVariable('i', index)
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
            vis.array.select(index);
            vis.heap.select(index + 1);
            vis.array.assignVariable('j', index)
          }, [j]);
        } else {
          j = 2 * i + 1;
          chunker.add(31, (vis, index) => {
            vis.array.select(index);
            vis.heap.select(index + 1);
            vis.array.assignVariable('j', index)
          }, [j]);
        }

        chunker.add(32);
        if (A[i] >= A[j]) {
          heap = true;
          chunker.add(33, (vis, p, c) => {
            vis.array.deselect(p);
            vis.array.deselect(c);
            vis.heap.deselect(p + 1);
            vis.heap.deselect(c + 1);
          }, [i, j]);
        } else {
          swap = A[i];
          A[i] = A[j];
          A[j] = swap;
          swapAction(35, 35, i, j);
          chunker.add(36, (vis, p, c) => {
            vis.array.deselect(p);
            vis.array.deselect(c);
            vis.heap.deselect(p + 1);
            vis.heap.deselect(c + 1);
            vis.array.assignVariable('i', c)
          }, [i, j]);
          i = j;

          // if current node is a leaf, then do not highlight the node
          if (!(2 * i + 1 >= n)) {
            chunker.add(28, (vis, index) => {
              vis.array.select(index);
              vis.heap.select(index + 1);
            }, [i]);
          }
        }
      }   
    }
    chunker.add(37, (vis) => {
      // Put in done state
      vis.array.clearVariables();
      vis.array.deselect(0);
      vis.array.sorted(0);
    });
    // for test
    return A;
  },
};
