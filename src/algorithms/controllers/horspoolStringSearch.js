
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
        
        const shiftTable=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','space'];
        // searchString and findString are stored in the same array
        // to get element in findString, add the length of searchString to the index
        chunker.add('1', (vis, n) => {
            vis.graph.addNode(0, searchString[0], 'box');
            
            for (let i = 1; i < searchString.length; i++) {
                vis.graph.addNode(i, searchString[i], 'box');
                vis.graph.addEdge(i, i - 1);
                vis.graph.addStringLen(searchString.length, i);
                vis.graph.addPatternLen(findString.length, i);
                vis.graph.addAlgorithm('horspools', i);
                
            }
            vis.graph.addNode(searchString.length, findString[0]);
            const j = searchString.length;
            for (let i = 1; i < findString.length; i++) {
                vis.graph.addNode(j+i, findString[i], 'box');
                vis.graph.addEdge(j + i, j + i - 1);
                
            }
            vis.graph.shift(0, n);
        }, [nodes]);

        chunker.add('2', (vis, n) => {
            vis.array.set([shiftTable.slice(0,13),new Array(13).fill(findString.length)],
            [shiftTable.slice(13,27),new Array(14).fill(findString.length)],
            'horspools');
        }, [nodes]);

        for (let j=0;j<findString.length-1;j++)
        {
            chunker.add('4', (vis,j) => {
                vis.array.patch(shiftTable.indexOf(findString[j].toUpperCase()),1,findString.length-(j+1));
            },[j]);

            chunker.add('3', (vis,j) => {
                vis.array.depatch(shiftTable.indexOf(findString[j].toUpperCase()),1);
            },[j]);
          
        }

    }
}