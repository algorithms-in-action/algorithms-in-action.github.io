/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */

import { QSExp } from '../explanations';
import GraphTracerRect from '../../components/DataStructures/Graph/GraphTracerRect';

export default {
  explanation: QSExp,

  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracerRect('bst', null, 'Brute force string search'),
        order: 0,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be sorted
   */
  // change from vis.graph to array equivalent
  run(chunker, { nodes }) {
    // initial state
    const searchString = nodes[0];
    const findString = nodes[1];
    // searchString and findString are stored in the same array
    // to get element in findString, add the length of searchString to the index
    chunker.add('1', (vis, n) => {
      vis.graph.addNode(0, searchString[0], 'box');
      for (let i = 1; i < searchString.length; i++) {
        vis.graph.addNode(i, searchString[i], 'box');
        vis.graph.addEdge(i, i - 1);
        vis.graph.addStringLen(searchString.length, i);
        vis.graph.addPatternLen(findString.length, i);
        vis.graph.addAlgorithm('bfsSearch', i);
      }
      vis.graph.addNode(searchString.length, findString[0]);
      const j = searchString.length;
      for (let i = 1; i < findString.length; i++) {
        vis.graph.addNode(j + i, findString[i], 'box');
        vis.graph.addEdge(j + i, j + i - 1);
      }
      vis.graph.shift(0, n);
    }, [nodes]);

    for (let shift_i = 0; shift_i < searchString.length - findString.length + 1; shift_i++) {
      chunker.add('2', (vis, i, n) => {
        vis.graph.shift(i, n);
      }, [shift_i, nodes]);
      for (let shift_j = 0; shift_j < findString.length; shift_j++) {
        chunker.add('3', (vis, i, j, n) => {
          vis.graph.addEdge(searchString.length + j, i + j);
          // visit - character not match, coloured in blue
          if (searchString[i + j] !== findString[j]) {
            vis.graph.visit(searchString.length + j);
            vis.graph.visit(i + j, null);
          } else {
            // select - character matches, coloured in red
            vis.graph.select(searchString.length + j, i + j);
            vis.graph.select(i + j, null);
          }
          vis.graph.shift(i, n);
        }, [shift_i, shift_j, nodes]);
        if (searchString[shift_i + shift_j] !== findString[shift_j]) {
          chunker.add('3', (vis, i, shift_j, n) => {
            for (let j = 0; j <= shift_j; j++) {
              // the current active character is visit (blue)
              if (j === shift_j) {
                vis.graph.leave(searchString.length + j);
                vis.graph.leave(i + j, null);
              } else {
                // all characters (if exist) before current active character are select (red)
                vis.graph.deselect(searchString.length + j);
                vis.graph.deselect(i + j, null);
              }
              vis.graph.removeEdge(searchString.length + j, i + j);
            }
            vis.graph.shift(i, n);
          }, [shift_i, shift_j, nodes]);
          break;
        } else if (shift_j === findString.length - 1) {
          // eslint-disable-next-line no-unused-vars
          chunker.add('5', (vis, i, j, n) => {
            const ResultStr = `Success: pattern found position ${i}`;
            // method1
            vis.graph.addResult(ResultStr, i);
            // method 2：
            // vis.array.addResult(ResultStr,i);
            // method 3：
            // eslint-disable-next-line max-len
            // const array1 = ["The pattern string("+findString+") is placed at postion "+ i +" of Search String ("+searchString+")"];
            // vis.array.set2(array1);
          }, [shift_i, shift_j, nodes]);
          return;
        } else {
          // eslint-disable-next-line no-unused-vars
          chunker.add('4', (vis, i, j, n) => {
          }, [shift_i, shift_j, nodes]);
        }
      }
    }
    const i = findString.length;
    chunker.add('6', (vis, i, n) => {
      const ResultStr = 'Pattern not found';
      vis.graph.addResult(ResultStr, i);
    }, [i, nodes]);
  },
};
