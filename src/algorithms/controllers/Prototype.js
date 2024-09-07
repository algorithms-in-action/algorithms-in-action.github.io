/* eslint-disable no-multi-spaces,indent,prefer-destructuring,brace-style */
/*
import {areExpanded} from './collapseChunkPlugin';
 */
import ListTracer from "../../components/DataStructures/List/ListTracer";





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

export default {

    initVisualisers() {
        return {
            list: {
                instance: new ListTracer('list', null, 'List Prototype', { arrayItemMagnitudes: true }),
                order: 0,
            }
        };
    },

    run(chunker, {nodes}) {
        chunker.add(
            1,
            (vis, list) => {
                vis.list.set(list);
            },
            [nodes]
        );
        const swapAction = (b, n1, n2) => {
            chunker.add(b, (vis, _n1, _n2) => {
                vis.list.swapElements(_n1, _n2);
            }, [n1, n2]);
        };

        swapAction(2,1,3);
    }


};


