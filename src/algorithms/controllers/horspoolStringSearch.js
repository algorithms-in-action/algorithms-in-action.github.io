
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
        const shiftTableValue=new Array(shiftTable.length).fill(findString.length);
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
            //initialize shift table
            vis.array.set([shiftTable.slice(0,13),new Array(13).fill(findString.length)],
            [shiftTable.slice(13,27),new Array(14).fill(findString.length)],
            'horspools');
        }, [nodes]);

        for (let j=0;j<findString.length-1;j++)
        {
            //assign value for shift table
            
            //【j pointer】
            //【Pattern select】
            shiftTableValue[shiftTable.indexOf(findString[j].toUpperCase())]=findString.length-(j+1);
            chunker.add('4', (vis,j) => {
                vis.array.patch(shiftTable.indexOf(findString[j].toUpperCase()),1,findString.length-(j+1));
            },[j]);

            chunker.add('3', (vis,j) => {
                vis.array.depatch(shiftTable.indexOf(findString[j].toUpperCase()),1);
            },[j]);
          
        }
        let m = findString.length;
        let i = m;
        //【i pointer】

        while (i-1<searchString.length)
        {
            let j = 0;
            //【del j pointer, create j value】
            while ((j<m) && (findString[(m-j-1)] == searchString[(i-j-1)] ))
            {
                //【[m-j]pointer】
                //【[i-j]pointer】
                //【String[i-j] and Pattern[m-j] do select(), matched color】
                j=j+1
                //【j value】
            }
            
            if (j == m)
            {
                
                //【succ msg here, return result=(i-m+1)】
                return;
            }
            else
            {
                //【String[i-j] and Pattern[m-j] do select(), unmatched color】

                chunker.add('6', (vis,i) => {
                    vis.array.select(shiftTable.indexOf(searchString[i-1].toUpperCase()),0);
                    vis.array.select(shiftTable.indexOf(searchString[i-1].toUpperCase()),1);
                },[i]);
                chunker.add('6', (vis,i) => {
                    vis.array.deselect(shiftTable.indexOf(searchString[i-1].toUpperCase()),0);
                    vis.array.deselect(shiftTable.indexOf(searchString[i-1].toUpperCase()),1);
                },[i]); 

                i=i+shiftTableValue[shiftTable.indexOf(searchString[i-1].toUpperCase())]
                //【ij pointer】
                //【Pattern move】
            }
        }
        //【fail msg 】
        return;
    }
}