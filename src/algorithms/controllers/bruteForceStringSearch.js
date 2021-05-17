import ArrayGraphTracer from '../../components/DataStructures/ArrayGraph/ArrayGraphTracer';
import { QSExp } from '../explanations';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import TwoArray1DTracer from '../../components/DataStructures/Array/Array1DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
export default {
  explanation: QSExp,

  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('bst', null, 'Binary tree'),
        order: 0,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   */
  
  run(chunker, { nodes }, vis) {
    //initial state
    const searchString = nodes[0];
    const findString = nodes[1];
    var string_count = 0;
    chunker.add('1', (vis, n) => {
      vis.graph.addNode(string_count,searchString[0],'box' );
      string_count ++;
      for (var i=1; i<searchString.length; i++){
        vis.graph.addNode(string_count, searchString[i], 'box');
        vis.graph.addEdge(string_count, string_count-1);
        string_count ++;
      }
      vis.graph.addNode(string_count,findString[0]);      
      string_count ++;
      for (var i=1; i<findString.length; i++){
        vis.graph.addNode(string_count, findString[i], 'box');
        vis.graph.addEdge(string_count, string_count-1);
        string_count ++;
      }
      vis.graph.shift(0,n)
    }, [nodes]);

    for (var shift_i=0; shift_i<searchString.length-findString.length+1; shift_i++){
    chunker.add('2', (vis, i, n) => {
      vis.graph.shift(i, n);
    }, [shift_i, nodes]);
      for(var shift_j=0; shift_j<findString.length; shift_j++){
        chunker.add('2', (vis, i, j, n) => {
          vis.graph.addEdge(searchString.length + j, i + j);
          vis.graph.select(searchString.length + j, i + j)
          vis.graph.select(i+j, null); 
          vis.graph.shift(i, n);
        }, [shift_i, shift_j,nodes]);
      }
      chunker.add('2', (vis, i, n) => {
        for(var j=0; j<findString.length; j++){
          vis.graph.removeEdge(searchString.length + j, i + j);
          vis.graph.deselect(searchString.length + j, i + j)
          vis.graph.deselect(i+j, null); 
          vis.graph.shift(i, n);
        }
      }, [shift_i, nodes]);
      
    }
    return 0;
  },
};
