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

/* eslint-disable no-multi-spaces,indent,prefer-destructuring,brace-style */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import {areExpanded} from './collapseChunkPlugin';

const LL_BOOKMARKS = {
    LL_default: 1,
    LL_if_left_less_right: 2,
    LL_left_to_mid: 3,
    LL_mid_to_end: 4,
    LL_sort_left: 5,
    LL_sort_right: 6,
    LL_result: 7,
    LL_done: 8,
    LL_middle: 9,
    LL_pre_left: 300,
    LL_pre_right: 400,
};











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
import ListTracer from '../../components/DataStructures/List/ListTracer.js';

export default {
    initVisualisers() {
        return {
            list: {
                instance: new ListTracer('array', null, 'List Prototype', { arrayItemMagnitudes: true }), // Label the input array as array view
                order: 0,
            }
        };
    },

    run(chunker, {values}) {

        chunker.add(
            0,
            (vis, list) => {
                vis.list.set(list, "Prototype");
            },
            [values]
        );
    }
};
