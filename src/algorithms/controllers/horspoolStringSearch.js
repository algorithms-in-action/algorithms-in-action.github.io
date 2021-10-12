
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
        //initial the shifttable with searchstring
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
        let m = findString.length;//m=3
        let i = m;
        chunker.add('5', (vis, n) => {
            //window.alert("findString is : "+findString.length);
            //window.alert("searchString is : "+searchString.length);//n=8
            //TODO:move i pointer
        }, [nodes]);

        let shift_distance = 0;
        let shift_list = new Array();
        let shift_ilist= new Array();
        let shift_cur=0;

        
        for (let shift_i = m;shift_i < searchString.length + 1;shift_i +=shift_distance) {
            
            shift_distance = shiftTableValue[shiftTable.indexOf(searchString[shift_i-1].toUpperCase())];
            shift_list.push(shift_cur+shift_distance);
            shift_ilist.push(shift_distance);
            shift_cur=shift_cur+shift_distance;
          }
        
        //window.alert("the ilist is : "+shift_ilist); 
        //Start Searching
        for (let shift_i = m; shift_i < searchString.length + 1; shift_i+=shift_ilist.shift()) {
            
            
            for (let shift_j = 0; shift_j < findString.length; shift_j++) {
                
                chunker.add('7', (vis, i, j, n) => {
                    //window.alert("the shift_i is:"+shift_i+" the character is"+searchString[shift_i-shift_j-1]);
                    //window.alert("j is : "+(findString.length-shift_j)+" the character is"+findString[findString.length-shift_j-1]);
                    // visit - character not match, coloured in blue
                    if (searchString[i - j-1] !== findString[m-j-1]) {
                        vis.graph.visit(searchString.length + m-j-1);
                        vis.graph.visit(i - j-1, null);
                    } else {
                        //window.alert("it is a equal");
                        // select - character matches, coloured in red
                        vis.graph.select(searchString.length + m-j-1,i - j-1);
                        vis.graph.select(i - j-1, null);      
                    }
                    
                }, [shift_i, shift_j, nodes]);
                if (searchString[shift_i - shift_j-1] !== findString[m-shift_j-1]) {
                    chunker.add('7', (vis, i, j, n) => {
                        for (let j = 0; j <= shift_j; j++){
                            if (j === shift_j) {
                                vis.graph.leave(searchString.length + m-j-1);
                                vis.graph.leave(i - j-1, null);
                            } else {
                                // all characters (if exist) before current active character are select (red)
                                vis.graph.deselect(searchString.length +m-j-1);
                                vis.graph.deselect(i - j-1, null);
                            }
                            vis.graph.removeEdge(searchString.length + m-j-1, i - j-1);
                        }
                        
                    }, [shift_i, shift_j, nodes]);        
                    break;
                } else if (shift_j === findString.length - 1)  {
                  
                    // select - character matches, coloured in red
                    chunker.add('9', (vis, i, j, n) => {
                        //window.alert("it is a equal2");
                        const ResultStr = `Success: pattern found position ${i-j}`;
                        // method1
                        vis.graph.addResult(ResultStr, i);
                    }, [shift_i, shift_j, nodes]);
                    return;
                }else{
                    // eslint-disable-next-line no-unused-vars
                    chunker.add('8', (vis, i, j, n) => {
                    }, [shift_i, shift_j, nodes]);
                }
            }
            chunker.add('6', (vis, i, n) => {
                if(i+m<=searchString.length){
                     //window.alert("the i is:"+i);
                     vis.graph.shift(i, n);
                }
                
            }, [shift_list.shift(), nodes]);

        }
        chunker.add('10', (vis) => {
            const ResultStr = "Pattern not found";
            vis.graph.addResult(ResultStr, i);
        }, []);
    }
}