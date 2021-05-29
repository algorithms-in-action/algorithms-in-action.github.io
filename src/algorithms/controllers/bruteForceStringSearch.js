/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */

import { QSExp } from '../explanations';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';

export default {
  explanation: QSExp,

  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('bst', null, 'Brute force string search'),
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
          }, [shift_i, shift_j, nodes]);
          return;
        } else {
          // eslint-disable-next-line no-unused-vars
          chunker.add('4', (vis, i, j, n) => {
          }, [shift_i, shift_j, nodes]);
        }
      }
    }
  },
};
