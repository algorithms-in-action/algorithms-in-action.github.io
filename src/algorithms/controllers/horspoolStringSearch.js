
import { HSSExp } from '../explanations';
import GraphTracerRect from '../../components/DataStructures/Graph/GraphTracerRect';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

export default {
    explanation: HSSExp,

    initVisualisers() {
        return {
            graph: {
                instance: new GraphTracerRect('hsp', null, 'Horspool String Search'),
                order: 0,
            },
            /*array: {
                instance: new Array2DTracer('array', null, 'Matrix'),
                order: 1,
            },*/
            
        };
    },

    
    // change from vis.graph to array equivalent
    run(chunker, { nodes }) {
        // initial state
        const searchString = nodes[0];
        const findString = nodes[1];
        let stringCount = 0;
        // searchString and findString are stored in the same array
        // to get element in findString, add the length of searchString to the index
        chunker.add('1', (vis, n) => {
            vis.graph.addNode(stringCount, searchString[0], 'box');
            stringCount++;
            for (let i = 1; i < searchString.length; i++) {
                vis.graph.addNode(stringCount, searchString[i], 'box');
                vis.graph.addEdge(stringCount, stringCount - 1);
                stringCount++;
            }
            vis.graph.addNode(stringCount, findString[0]);
            stringCount++;
            for (let i = 1; i < findString.length; i++) {
                vis.graph.addNode(stringCount, findString[i], 'box');
                vis.graph.addEdge(stringCount, stringCount - 1);
                stringCount++;
            }
            vis.graph.shift(0, n);
        }, [nodes]);
    }
}