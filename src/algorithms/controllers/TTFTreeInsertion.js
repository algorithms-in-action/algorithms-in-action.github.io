import { TTFExp } from '../explanations';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';

import VariableTreeNode from '../../components/DataStructures/Graph/NAryTreeVariable'; 


export default {
    explanation: TTFExp,
    
  
    initVisualisers() {
      return {
        tree: {
          instance: new NTreeTracer('n-tree', null, 'Tree View'),
          order: 0,
        },
      };
    },

    /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be inserted
   */
  run(chunker, { ignore }) {
    const nodes = [5, 3, 7, 2, 4, 6, 8, 1, 9, 10];

    chunker.add(
      '1',
      (vis ) => {
        vis.tree.variableNodes = true;
        vis.tree.isDirected = false;
        vis.tree.addVariableNode(0, '0');
        vis.tree.addVariableNode(10, nodes[0]);
        vis.tree.addEdge(0, 10);
        vis.tree.layout();
      },
    );

    chunker.add(
      '1',
      (vis ) => {
        vis.tree.addVariableNode(10, nodes[1]);
        vis.tree.layout();
      },
    );

    chunker.add(
      '1',
      (vis ) => {
        vis.tree.addVariableNode(10, nodes[2]);
        vis.tree.layout();
      },
    );

    chunker.add(
      '1',
      (vis ) => {
        vis.tree.addVariableNode(20, nodes[3]);
        vis.tree.addEdge(10, 20);
        vis.tree.layout();
      },
    );

    chunker.add(
      '1',
      (vis ) => {
        vis.tree.addVariableNode(20, nodes[4]);
        vis.tree.layout();
      },
    );

    chunker.add(
      '1',
      (vis ) => {
        vis.tree.addVariableNode(30, nodes[5]);
        vis.tree.addEdge(10, 30);
        vis.tree.layout();
      },
    );

    chunker.add(
      '1',
      (vis ) => {
        vis.tree.addVariableNode(30, nodes[6]);
        vis.tree.removeNode(2);
        vis.tree.layout();
      },
    );


  },



};

