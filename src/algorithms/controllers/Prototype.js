import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

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
};
