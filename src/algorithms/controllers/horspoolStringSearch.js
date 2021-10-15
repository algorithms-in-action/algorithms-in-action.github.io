
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
        const shiftTable=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','space'];
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
            vis.array.set([shiftTable.slice(0,13),new Array(13)],
            [shiftTable.slice(13,27),new Array(14)],
            'horspools');
        }, [nodes]);

        //incrementally fill inital shifttable
        for (let a=0; a<shiftTable.length; a++)
        {
            chunker.add('3', (vis, n) => {
                vis.array.patch(shiftTable.indexOf(shiftTable[a]),1,findString.length);
            }, [nodes]);
            chunker.add('2', (vis, n) => {
                vis.array.depatch(shiftTable.indexOf(shiftTable[a]),1,findString.length);
            }, [nodes]);
            
        }

        //initial the shifttable with searchstring
        for (let j=0;j<findString.length-1;j++)
        {
            //assign value for shift table
            
            //【j pointer】
            //【Pattern select】
            let c = findString[j].toLowerCase()
            if (c===" ")
            {
                c='space';
            }
            
            shiftTableValue[shiftTable.indexOf(c)]=findString.length-(j+1);
            
            chunker.add('5', (vis,j) => {
                vis.graph.select(searchString.length+j);
                vis.array.patch(shiftTable.indexOf(c),1,findString.length-(j+1));
            },[j]);

            chunker.add('4', (vis,j) => {
                vis.graph.deselect(searchString.length+j);
                vis.array.depatch(shiftTable.indexOf(c),1);
            },[j]);
          
        }
        let m = findString.length;//m=3
        let i = m;
        chunker.add('6', (vis, n) => {
            //window.alert("findString is : "+findString.length);
            //window.alert("searchString is : "+searchString.length);//n=8
            //TODO:move i pointer
        }, [nodes]);

        let shift_distance = 0;
        let shift_list = new Array();
        let shift_ilist= new Array();
        let shift_cur=0;
        let shift_pre=0;

        
        for (let shift_i = m;shift_i < searchString.length + 1;shift_i +=shift_distance) {
            let c =searchString[shift_i-1].toLowerCase();
            if (c===" ")
            {
                c="space";
            }
            shift_distance = shiftTableValue[shiftTable.indexOf(c)];
            shift_list.push(shift_cur+shift_distance);
            shift_ilist.push(shift_distance);
            shift_cur=shift_cur+shift_distance;
          }

        //Start Searching
        for (let shift_i = m; shift_i < searchString.length + 1; shift_i+=shift_ilist.shift()) {
            chunker.add('11', (vis,j) => {
                if(j !== -1){
                    const c = searchString[j];
                    if (c===" "){
                        c='space';
                    }
                    vis.array.deselect(shiftTable.indexOf(c),1);
                }
            }, [shift_pre-1]);

            chunker.add('13', (vis, n) => {
            }, [nodes]);

            for (let shift_j = 0; shift_j < findString.length; shift_j++) {
                
                chunker.add('8', (vis, i, j, n) => {
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
                    chunker.add('8', (vis, i, j, n) => {
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
                    chunker.add('10', (vis, i, j, n) => {
                        //window.alert("it is a equal2");
                        const ResultStr = `Success: pattern found position ${i-j}`;
                        // method1
                        vis.graph.addResult(ResultStr, i);
                    }, [shift_i, shift_j, nodes]);
                    return;
                }else{
                    // eslint-disable-next-line no-unused-vars
                    chunker.add('9', (vis, i, j, n) => {
                    }, [shift_i, shift_j, nodes]);
                }
            }
            chunker.add('14', (vis, n) => {
            }, [nodes]);
            chunker.add('15', (vis, n) => {
            }, [nodes]);
            chunker.add('7', (vis, i, j, n) => {
                const c = searchString[j];
                if(i+m<=searchString.length){
                     vis.graph.shift(i, n);
                }
                if (c===" ")
                {
                    c='space';
                }
                vis.array.select(shiftTable.indexOf(c),1);
                
            }, [shift_list.shift(),shift_i-1, nodes]);
            shift_pre=shift_i;
        }
        chunker.add('12', (vis) => {
            const ResultStr = "Pattern not found";
            vis.graph.addResult(ResultStr, i);
        }, []);
    }
}