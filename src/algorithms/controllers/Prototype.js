/* eslint-disable no-multi-spaces,indent,prefer-destructuring,brace-style */
/*
import {areExpanded} from './collapseChunkPlugin';
 */
import ListTracer from "../../components/DataStructures/List/ListTracer";
import LinkedListTracer from "../../components/DataStructures/LinkedList/LinkedListTracer";





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
                instance: new LinkedListTracer('list', null, 'List Prototype', { arrayItemMagnitudes: true }),
                order: 0,
            }
        };
    },


    run(chunker, { nodes }) {

        const A = [...nodes];
        let n = nodes.length;
        let slow;
        const swapAction = (bookmark, n1, n2) => {
            chunker.add(bookmark, (vis, _n1, _n2) => {
                vis.list.swapElements(_n1, _n2);
            }, [n1, n2]);
        };

        // Initialise
        chunker.add(
            1,
            (vis, list) => {
                vis.list.addList(list);},
            [nodes]
        );

        // Split List into two sections
        for (let i= 0; i <= 2; i++) {
            chunker.add(
                2,
                (vis) => {
                    vis.list.splitList(vis.list.findList(0, 0).size / 2, 0, 0);
                },
            );
        }

        chunker.add(
            3,
            (vis) => {
                vis.list.moveList(1,0,0, 'stack');
            },
        );

        chunker.add(
            4,
            (vis) => {
                vis.list.select(0);
                vis.list.select(0,0,0,1);
            },
        );

        chunker.add(
            5,
            (vis) => {
                vis.list.setArrow(0,0,0,90);
            },
        );

        chunker.add(
            6,
            (vis) => {
                vis.list.patch(0,0,0);
            },
        );
    }
};
