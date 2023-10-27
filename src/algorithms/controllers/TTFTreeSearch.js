import { TTFExp } from '../explanations';
import VariableTreeNode from '../../components/DataStructures/Graph/NAryTreeTracer/NAryTreeVariable';
import TTFTreeInsertion from './TTFTreeInsertion'; // for highlighting
import { COLOUR_CODES } from './unionFindUnion';


export default {
  explanation: TTFExp,

  initVisualisers({ visualiser }) {
    visualiser.tree.instance.unfillAll();

    return {
      tree: {
        instance: visualiser.tree.instance,
        order: 0,
      },
    };
  },

  findChild(chunker, node, value) {
    if (node === null) return null;
    const nodeLength = node.getNodeLength();
    const values = node.getIDs();
    const children = node.children;

    chunker.add('if c is a two-node');
    if (nodeLength === 1) {
      chunker.add('if k < c.key1: if c is a two-node');
      if (value < values[0]) {
        return this.childOrNull(chunker, 'c <- c.child1: if c is a two-node', values[0], children, 0);
      }
      else {
        chunker.add('else: if c is a two-node');
        return this.childOrNull(chunker, 'c <- c.child2: if c is a two-node', values[0], children, 1);
      }
    }
    chunker.add('else: MoveToChild');
    if (nodeLength === 2) {
      chunker.add('if k < c.key1: else: MoveToChild');
      if (value < values[0]) {
        return this.childOrNull(chunker, 'c <- c.child1: else: MoveToChild', values[0], children, 0);
      }
      chunker.add('else if k < c.key2: else: MoveToChild');
      if (value < values[1]) {
        return this.childOrNull(chunker, 'c <- c.child2: else: MoveToChild', values[1], children, 1);
      }
      else {
        chunker.add('else: else: MoveToChild');
        return this.childOrNull(chunker, 'c <- c.child3', values[1], children, 2);
      }
    }
    // for search specifically:
    chunker.add('else: Find_child');
    if (nodeLength === 3) {
      chunker.add('if k < t.key1: else: Find_child');
      if (value < values[0]) {
        return this.childOrNull(chunker, 'c <- t.child1: else: Find_child', values[0], children, 0);
      }
      chunker.add('else if k < t.key2: else: Find_child');
      if (value < values[1]) {
        return this.childOrNull(chunker, 'c <- t.child2: else: Find_child', values[1], children, 1);
      }
      chunker.add('else if k < t.key3');
      if (value < values[2]) {
        return this.childOrNull(chunker, 'c <- t.child3: else: Find_child', values[2], children, 2);
      }
      else {
        chunker.add('else: else: Find_child');
        return this.childOrNull(chunker, 'c <- t.child4', values[2], children, 3);
      }
    }
  },

  childOrNull(chunker, bookmark, nodeValue, children, index) {
    if (children.length === 0) {
      chunker.add(bookmark);
      //chunker.add('until c is Empty (and p is a leaf node)');
      return null;
    }
    else {
      chunker.add(bookmark);
      return children[index];
    }
  },

  // returns if key is found
  returnIfKeyInNode(chunker, value, node) {
    chunker.add('if t is a two-node: Return_if_key_in_node');
    if (node.getNodeLength() === 1) {
      chunker.add('if t.key1 == k return t');
      if (value === node.getIDs()[0]) {
        return node;
      }
    }
    if (node.getNodeLength() === 2) {
      chunker.add('if t.key1 == k or t.key2 == k return t');
      if (value === node.getIDs()[0] || value === node.getIDs()[1]) {
        return node;
      }
    }
    if (node.getNodeLength() === 3) {
      chunker.add('if t.key1 == k or t.key2 == k or t.key3 == k return t');
      if (value === node.getIDs()[0] || value === node.getIDs()[1] || value === node.getIDs()[2]) {
        return node;
      }
    }
    return null;
  },

  // search for given value in tree
  search(chunker, tree, value) {
    let node = tree;

    chunker.add('while t not Empty');
    while (node !== null) {

      if (this.returnIfKeyInNode(chunker, value, node)) break;
      node = this.findChild(chunker, node, value);
    }

    if (node === null) chunker.add('return NotFound');

  },

  // restoring tree internal representation
  initTreeReturnRoot(realNodes, realEdges) {
    let tree = {};

    let nodes = realNodes.filter((node) => node.id !== 0)
    nodes.forEach((node) => {
      tree[node.id] = new VariableTreeNode(node.id);
    });

    nodes.forEach((node) => {
      const treeNode = tree[node.id];
      node.nodeIDs.forEach((nodeID) => {
        treeNode.addRelatedNodeID(nodeID);
      });
    });

    realEdges.forEach((edge) => {
      const parentTreeNode = tree[edge.source];
      const childTreeNode = tree[edge.target];

      if (parentTreeNode && childTreeNode) {
        parentTreeNode.children.push(childTreeNode);
        childTreeNode.parent = parentTreeNode;
      }
    });

    let root = Object.values(tree).filter((node) => node.parent === null)[0];

    return root;
  },

  run(chunker, { visualiser, target }) {
    let { 'realNodes': realNodes, 'realEdges': realEdges, 'nodes': renderedNodes, 'edges': renderedEdges } = visualiser.tree.instance.extractNTree();

    // restoring tree visualiser
    chunker.add('T234_Search(t, k)', (vis) => {
      vis.tree.setNTree(realNodes, realEdges, renderedNodes, renderedEdges);
      vis.tree.layout();
    },);

    let root = this.initTreeReturnRoot(realNodes, realEdges);

    // search tree
    this.search(chunker, root, target.arg1);
  },

};
