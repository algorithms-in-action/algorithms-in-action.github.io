/* eslint-disable arrow-parens */
/* eslint-disable no-param-reassign */
/* eslint-disable indent */

import GraphTracer from '../Graph/GraphTracer';

class HeapTracer extends GraphTracer {
    layoutTree(root = 0, sorted = false) {
        this.root = root;
        super.layoutTree(root, sorted);
    }

    swapNodes(node1, node2) {
        let newRoot = this.root;
        if (node1 === this.root) newRoot = node2;
        else if (node2 === this.root) newRoot = node1;

        // console.log('this.edges:', this.edges);
        this.edges.forEach(edge => {
          // console.log("source ", source, " target ", target);
          if (edge.source === node1) edge.source = node2;
          else if (edge.source === node2) edge.source = node1;
          if (edge.target === node1) edge.target = node2;
          else if (edge.target === node2) edge.target = node1;
        });
        // console.log('this.edges:', this.edges);
        this.layoutTree(newRoot);
      }
}

export default HeapTracer;
