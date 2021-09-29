
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
        const shiftTable=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','space'];
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

        chunker.add('2', (vis, n) => {
            vis.array.set([shiftTable.slice(0,13),new Array(13).fill(findString.length)],
            [shiftTable.slice(13,27),new Array(14).fill(findString.length)],
            'horspools');
        }, [nodes]);

        for (let shift_i=0;shift_i<findString.length-1;shift_i++)
        {
            chunker.add('3', (vis,shift_i) => {
                vis.array.patch(shiftTable.indexOf(findString[shift_i].toUpperCase()),1,findString.length-(shift_i+1));
            },[shift_i]);

            chunker.add('4', (vis,shift_i) => {
                vis.array.depatch(shiftTable.indexOf(findString[shift_i].toUpperCase()),1);
            },[shift_i]);
          
        }

    }
}