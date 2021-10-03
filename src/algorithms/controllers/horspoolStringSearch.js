
import { HSSExp } from '../explanations';
import GraphTracerRect from '../../components/DataStructures/Graph/GraphTracerRect';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import TwoArray2DTracer from '../../components/DataStructures/Array/TwoArray2DTracer';

export default {
    explanation: HSSExp,

    initVisualisers() {
        return {
            array: {
                instance: new TwoArray2DTracer('array', null, 'Shift Table'), 
                order: 0,
            },
            graph: {
                instance: new GraphTracerRect('hsp', null, 'Horspool String Search'),
                order: 1,
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
            const shiftTable=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','space'];
            vis.array.set([shiftTable.slice(0,13),new Array(13).fill(findString.length)],
                          [shiftTable.slice(13,27),new Array(14).fill(findString.length)],
                          'horspools');
            //temp,this block should be in chunker 2 with dispatch
            for (let i=0;i<findString.length-1;i++)
            {
              vis.array.patch(shiftTable.indexOf(findString[i].toUpperCase()),1,findString.length-(i+1));
            }

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