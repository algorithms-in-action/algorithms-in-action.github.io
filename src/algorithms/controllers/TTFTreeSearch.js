import { TTFExp } from '../explanations';
import VariableTreeNode from '../../components/DataStructures/Graph/NAryTreeTracer/NAryTreeVariable';
import TTFTreeInsertion from './TTFTreeInsertion';
import { COLOUR_CODES } from './unionFindUnion';


export default {
  explanation: TTFExp,

  // initialising the visualiser from insert
  initVisualisers({ visualiser }) {
    // removing highlights
    visualiser.tree.instance.unfillAll();
    visualiser.tree.instance.setFunctionName(null);

    return {
      tree: {
        instance: visualiser.tree.instance,
        order: 0,
      },
    };
  },

  /**
   * Finding the child node that may contain the value.
   * @param {*} chunker 
   * @param {*} node the node to search for the child.
   * @param {*} value the value to search for.
   * @returns the node, if exists, that may contain the value, else null.
   */
  findChild(chunker, node, value) {
    if (node === null) return null;
    const nodeLength = node.getNodeLength();
    const values = node.getIDs();
    const children = node.children;

    chunker.add('if t is a two-node');
    if (nodeLength === 1) {
      chunker.add('if k < t.key1: if t is a two-node');
      if (value < values[0]) {
        return this.childOrNull(chunker, 'c <- t.child1: if t is a two-node', values[0], children, 0);
      }
      else {
        chunker.add('else: if t is a two-node');
        return this.childOrNull(chunker, 'c <- t.child2: if t is a two-node', values[0], children, 1);
      }
    }
    chunker.add('else if t is a three-node');
    if (nodeLength === 2) {
      chunker.add('if k < t.key1: else if t is a three-node',
        (vis, node, value1) => {
          TTFTreeInsertion.unhighlightNode(vis.tree, node);
          TTFTreeInsertion.highlightValue(vis.tree, value1, COLOUR_CODES.ORANGE);
        },
        [node, values[0]]);
      if (value < values[0]) {
        return this.childOrNull(chunker, 'c <- t.child1: else if t is a three-node', values[0], children, 0);
      }
      chunker.add('else if k < t.key2: else if t is a three-node',
        (vis, value1, value2) => {
          TTFTreeInsertion.unhighlightValue(vis.tree, value1);
          TTFTreeInsertion.highlightValue(vis.tree, value2, COLOUR_CODES.ORANGE);
        },
        [values[0], values[1]]);
      if (value < values[1]) {
        return this.childOrNull(chunker, 'c <- t.child2: else if t is a three-node', values[1], children, 1);
      }
      else {
        chunker.add('else: else if t is a three-node');
        return this.childOrNull(chunker, 'c <- t.child3: else if t is a three-node', values[1], children, 2);
      }
    }
    // for search specifically (as insert splits 4 nodes, rather than searches them):
    chunker.add('else: Find_child');
    if (nodeLength === 3) {
      chunker.add('if k < t.key1: else: Find_child',
        (vis, node, value1) => {
          TTFTreeInsertion.unhighlightNode(vis.tree, node);
          TTFTreeInsertion.highlightValue(vis.tree, value1, COLOUR_CODES.ORANGE);
        },
        [node, values[0]]);
      if (value < values[0]) {
        return this.childOrNull(chunker, 'c <- t.child1: else: Find_child', values[0], children, 0);
      }
      chunker.add('else if k < t.key2: else: Find_child',
        (vis, value1, value2) => {
          TTFTreeInsertion.unhighlightValue(vis.tree, value1);
          TTFTreeInsertion.highlightValue(vis.tree, value2, COLOUR_CODES.ORANGE);
        },
        [values[0], values[1]]);
      if (value < values[1]) {
        return this.childOrNull(chunker, 'c <- t.child2: else: Find_child', values[1], children, 1);
      }
      chunker.add('else if k < t.key3',
        (vis, value2, value3) => {
          TTFTreeInsertion.unhighlightValue(vis.tree, value2);
          TTFTreeInsertion.highlightValue(vis.tree, value3, COLOUR_CODES.ORANGE);
        },
        [values[1], values[2]]);
      if (value < values[2]) {
        return this.childOrNull(chunker, 'c <- t.child3: else: Find_child', values[2], children, 2);
      }
      else {
        chunker.add('else: else: Find_child');
        return this.childOrNull(chunker, 'c <- t.child4', values[2], children, 3);
      }
    }
  },

  /**
   * Helper function for findChild. 
   * Adds bookmark and highlights the child node if it exists, else returns null.
   * @param {*} chunker 
   * @param {*} bookmark 
   * @param {*} nodeValue the value of the parent node.
   * @param {*} children the children of the parent node.
   * @param {*} index the index of the child node within parent.
   * @returns 
   */
  childOrNull(chunker, bookmark, nodeValue, children, index) {
    if (children.length === 0) {
      chunker.add(bookmark);
      return null;
    }
    else {
      chunker.add(bookmark,
        (vis, nodeValue, child) => {
          TTFTreeInsertion.unhighlightValue(vis.tree, nodeValue);
          TTFTreeInsertion.highlightNode(vis.tree, child, COLOUR_CODES.ORANGE);
        },
        [nodeValue, children[index]]);
      return children[index];
    }
  },

  /**
   * Helper function for search.
   * Returns the node if it contains the value being searched for, else null.
   * @param {*} chunker
   * @param {*} value the value to search for.
   * @param {*} node the node to search in.
   * @returns the node if it contains the value, else null.
   */
  returnIfKeyInNode(chunker, value, node) {
    chunker.add('if t is a two-node: Return_if_key_in_node',
      (vis, node) => {
        TTFTreeInsertion.highlightNode(vis.tree, node, COLOUR_CODES.ORANGE);
      },
      [node]);
    if (node.getNodeLength() === 1) {
      if (value === node.getIDs()[0]) {
        chunker.add('if t.key1 == k return t',
          (vis, node) => {
            TTFTreeInsertion.highlightNode(vis.tree, node, COLOUR_CODES.GREEN);
          },
          [node]);
        return node;
      } else {
        chunker.add('if t.key1 == k return t');
        return null;
      }
    }
    chunker.add('if t is a three-node: Return_if_key_in_node');
    if (node.getNodeLength() === 2) {
      if (value === node.getIDs()[0] || value === node.getIDs()[1]) {
        chunker.add('if t.key1 == k or t.key2 == k return t',
          (vis, node) => {
            TTFTreeInsertion.highlightNode(vis.tree, node, COLOUR_CODES.GREEN);
          },
          [node]);
        return node;
      } else {
        chunker.add('if t.key1 == k or t.key2 == k return t');
        return null;
      }
    }
    chunker.add('else: Return_if_key_in_node');
    if (node.getNodeLength() === 3) {
      if (value === node.getIDs()[0] || value === node.getIDs()[1] || value === node.getIDs()[2]) {
        chunker.add('if t.key1 == k or t.key2 == k or t.key3 == k return t',
          (vis, node) => {
            TTFTreeInsertion.highlightNode(vis.tree, node, COLOUR_CODES.GREEN);
          },
          [node]);
        return node;
      } else {
        chunker.add('if t.key1 == k or t.key2 == k or t.key3 == k return t');
        return null;
      }
    }
    return null; // just in case
  },

  /**
   * Searches the tree for the value. 
   * Outputs the node if found, else outputs NotFound.
   * @param {*} chunker
   * @param {*} tree the (root of the) tree to search in.
   * @param {*} value the value to search for.
   */
  search(chunker, tree, value) {
    let node = tree;
    let prev;

    chunker.add('while t not Empty');
    while (node !== null) {

      if (this.returnIfKeyInNode(chunker, value, node)) break; // root of subtree contains value
      prev = node; // for highlighting if not found
      node = this.findChild(chunker, node, value); // find child that may contain value

    }

    if (node === null) {
      chunker.add('return NotFound',
        (vis, node) => {
          TTFTreeInsertion.highlightNode(vis.tree, node, COLOUR_CODES.RED);
        }, [prev]);
    }

  },

  /**
   * Restores the internal tree representation given the nodes and edges.
   * @param {*} realNodes the logical nodes in the tree.
   * @param {*} realEdges the logical edges in the tree.
   * @returns the root of the tree.
   */
  initTreeReturnRoot(realNodes, realEdges) {
    let tree = {};

    // creating the variable tree nodes
    let nodes = realNodes.filter((node) => node.id !== 0)
    nodes.forEach((node) => {
      tree[node.id] = new VariableTreeNode(node.id);
    });

    // adding the visual nodes to the logical variable nodes
    nodes.forEach((node) => {
      const treeNode = tree[node.id];
      node.nodeIDs.forEach((nodeID) => {
        treeNode.addRelatedNodeID(nodeID);
      });
    });

    // adding the edges to the logical variable nodes
    realEdges.forEach((edge) => {
      const parentTreeNode = tree[edge.source];
      const childTreeNode = tree[edge.target];

      if (parentTreeNode && childTreeNode) {
        parentTreeNode.children.push(childTreeNode);
        childTreeNode.parent = parentTreeNode;
      }
    });

    // finding the root of the tree
    let root = Object.values(tree).filter((node) => node.parent === null)[0];

    // remove parent relationship, otherwise run into max stack error when passing node into chunker
    Object.values(tree).forEach((node) => {
      node.parent = null;
    });

    return root;
  },

  /**
   * Running the algorithm.
   * @param {*} chunker 
   * @param {*} param1 the insertion visualiser and value to search for.
   */
  run(chunker, { visualiser, target }) {
    let { 'realNodes': realNodes, 'realEdges': realEdges, 'nodes': renderedNodes, 'edges': renderedEdges } = visualiser.tree.instance.extractNTree();

    // restoring the tree visualiser
    chunker.add('T234_Search(t, k)', (vis) => {
      vis.tree.setNTree(realNodes, realEdges, renderedNodes, renderedEdges);
      vis.tree.layout();
    },);

    // restoring the tree internal representation
    let root = this.initTreeReturnRoot(realNodes, realEdges);

    // searching tree
    this.search(chunker, root, target);
  },

};