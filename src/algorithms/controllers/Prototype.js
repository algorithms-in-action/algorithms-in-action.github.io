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
