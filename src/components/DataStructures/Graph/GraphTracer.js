/* eslint-disable no-prototype-builtins */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-else-return */
/* eslint-disable no-confusing-arrow */
/* eslint-disable prefer-rest-params */
/* eslint-disable arrow-parens */
/* eslint-disable prefer-template */

import Tracer from '../common/Tracer';
import { distance } from '../common/util';
import GraphRenderer from './GraphRenderer/index';

class GraphTracer extends Tracer {
  getRendererClass() {
    return GraphRenderer;
  }

  init() {
    super.init();
    this.dimensions = {
      baseWidth: 320,
      baseHeight: 320,
      padding: 32,
      nodeRadius: 12,
      arrowGap: 4,
      nodeWeightGap: 4,
      edgeWeightGap: 4,
    };
    this.isDirected = true;
    this.isWeighted = false;
    this.callLayout = { method: this.layoutCircle, args: [] };
    this.text = null;
    this.logTracer = null;
  }


  /**
   * This is the original function provided by Tracer.js,
   * but we add a second argument which accepts nodes' values
   * @param {array} array2d 2D array of nodes
   */
  set(array2d = [], values = []) {
    this.nodes = [];
    this.edges = [];
    for (let i = 0; i < array2d.length; i++) {
      this.addNode(i, values[i] ? values[i] : i);
      for (let j = 0; j < array2d.length; j++) {
        const value = array2d[i][j];
        if (value) {
          this.addEdge(i, j, this.isWeighted ? value : null);
        }
      }
    }
    this.layout();
    super.set();
  }

  /**
   * clear existing trace, if any
   * nodes and edges remain unchanged
   */
  clear() {
    this.edges.forEach(edge => {
      edge.visitedCount = 0;
      edge.selectedCount = 0;
    });
    this.nodes.forEach(node => {
      node.visitedCount = 0;
      node.selectedCount = 0;
    });
    this.text = null;
  }

  isEmpty() {
    return this.nodes.length === 0 && this.edges.length === 0;
  }

  /**
   * extract a tree object from edges and nodes
   * @return {object} a tree object
   */
  getTree() {
    const tree = {};

    const setLeftOrRightChild = (t, parent, child) => {
      if (parent < child) {
        // right child
        t[parent].right = child;
      } else if (parent > child) {
        // left child
        t[parent].left = child;
      }
    };

    this.edges.forEach(obj => {
      if (!tree.hasOwnProperty(obj.source)) {
        tree[obj.source] = {};
        setLeftOrRightChild(tree, obj.source, obj.target);
      } else {
        setLeftOrRightChild(tree, obj.source, obj.target);
      }
      if (!tree.hasOwnProperty(obj.target)) {
        tree[obj.target] = {};
      }
    });

    this.nodes.forEach(obj => {
      if (!tree.hasOwnProperty(obj.id)) {
        tree[obj.id] = {};
      }
    });

    return tree;
  }

  /**
   * extract the root from edges and nodes
   * @return {number} root
   */
  getRoot() {
    // in case there is only a single node in the graph
    if (this.edges.length === 0 && this.nodes.length === 1) {
      return this.nodes[0].id;
    }
    const sources = this.edges.map(obj => obj.source);
    const targets = this.edges.map(obj => obj.target);
    const nodes = [...new Set([...sources, ...targets])];
    // the node that does not a source is the root
    return nodes.find(node => !targets.includes(node));
  }

  setHeap(nodes) {
    this.nodes = [];
    this.edges = [];
    // 1 is the id of the first element of the array
    for (let i = 1; i <= nodes.length; i++) {
      this.addNode(i, nodes[i - 1]);
      // left child
      if ((2 * i) <= nodes.length) {
        this.addEdge(i, 2 * i);
      }
      // right child
      if (((2 * i) + 1) <= nodes.length) {
        this.addEdge(i, (2 * i) + 1);
      }
    }

    // set the root node, 1 is the id of the first element of the array
    this.layoutTree(1);
    this.directed(false);
    this.layout();
    super.set();
  }

  swapNodes(nodeId1, nodeId2) {
    const node1 = this.findNode(nodeId1);
    const temp = node1.value;
    const node2 = this.findNode(nodeId2);
    node1.value = node2.value;
    node2.value = temp;
    this.layoutTree(this.root);
  }

  directed(isDirected = true) {
    this.isDirected = isDirected;
  }

  weighted(isWeighted = true) {
    this.isWeighted = isWeighted;
  }

  addNode(id, value = undefined, shape = 'circle', color = 'blue', weight = null, x = 0, y = 0, visitedCount = 0, selectedCount = 0) {
    if (this.findNode(id)) return;
    value = (value === undefined ? id : value);
    this.nodes.push({ id, value, shape, color, weight, x, y, visitedCount, selectedCount });
    this.layout();
  }

  updateNode(id, value, weight, x, y, visitedCount, selectedCount) {
    const node = this.findNode(id);
    const update = { value, weight, x, y, visitedCount, selectedCount };
    Object.keys(update).forEach(key => {
      if (update[key] === undefined) delete update[key];
    });
    Object.assign(node, update);
  }

  removeNode(id) {
    const node = this.findNode(id);
    if (!node) return;
    const index = this.nodes.indexOf(node);
    this.nodes.splice(index, 1);
    this.layout();
  }

  addEdge(source, target, weight = null, visitedCount = 0, selectedCount = 0) {
    if (this.findEdge(source, target)) return;
    this.edges.push({ source, target, weight, visitedCount, selectedCount });
    this.layout();
  }

  updateEdge(source, target, weight, visitedCount, selectedCount) {
    const edge = this.findEdge(source, target);
    const update = { weight, visitedCount, selectedCount };
    Object.keys(update).forEach(key => {
      if (update[key] === undefined) delete update[key];
    });
    Object.assign(edge, update);
  }

  removeEdge(source, target) {
    const edge = this.findEdge(source, target);
    if (!edge) return;
    const index = this.edges.indexOf(edge);
    this.edges.splice(index, 1);
    this.layout();
  }

  findValue(id) {
    return this.findNode(id).value;
  }

  findNode(id) {
    return this.nodes.find(node => node.id === id);
  }

  findEdge(source, target, isDirected = this.isDirected) {
    if (isDirected) {
      return this.edges.find(edge => edge.source === source && edge.target === target);
    } else {
      return this.edges.find(edge =>
        (edge.source === source && edge.target === target) ||
        (edge.source === target && edge.target === source));
    }
  }

  findLinkedEdges(source, isDirected = this.isDirected) {
    if (isDirected) {
      return this.edges.filter(edge => edge.source === source);
    } else {
      return this.edges.filter(edge => edge.source === source || edge.target === source);
    }
  }

  findLinkedNodeIds(source, isDirected = this.isDirected) {
    const edges = this.findLinkedEdges(source, isDirected);
    return edges.map(edge => edge.source === source ? edge.target : edge.source);
  }

  findLinkedNodes(source, isDirected = this.isDirected) {
    const ids = this.findLinkedNodeIds(source, isDirected);
    return ids.map(id => this.findNode(id));
  }

  getRect() {
    const { baseWidth, baseHeight, padding } = this.dimensions;
    const left = -baseWidth / 2 + padding;
    const top = -baseHeight / 2 + padding;
    const right = baseWidth / 2 - padding;
    const bottom = baseHeight / 2 - padding;
    const width = right - left;
    const height = bottom - top;
    return { left, top, right, bottom, width, height };
  }

  layout() {
    const { method, args } = this.callLayout;
    method.apply(this, args);
  }

  layoutCircle() {
    this.callLayout = { method: this.layoutCircle, args: arguments };
    const rect = this.getRect();
    const unitAngle = 2 * Math.PI / this.nodes.length;
    let angle = -Math.PI / 2;
    for (const node of this.nodes) {
      const x = Math.cos(angle) * rect.width / 2;
      const y = Math.sin(angle) * rect.height / 2;
      node.x = x;
      node.y = y;
      angle += unitAngle;
    }
  }


  shift(space = 0, nodes) {
    const searchString = nodes[0];
    const findString = nodes[1];
    let stringCount = 0;
    const xSpacing = 25;
    const ySpacing = 30;
    let startFindString = -1;
    for (let i = 0; i < searchString.length; i++) {
      const thisNode = this.findNode(stringCount);
      thisNode.shape = 'box';
      thisNode.x = (i - searchString.length / 2) * xSpacing;
      if (i === 0) {
        startFindString = thisNode.x;
      }
      thisNode.y = ySpacing / 2;
      stringCount++;
    }
    for (let i = 0; i < findString.length; i++) {
      const thisNode = this.findNode(stringCount);
      thisNode.shape = 'box';
      thisNode.x = startFindString + (i + space) * (xSpacing);
      thisNode.y = -1 * (ySpacing / 2);
      stringCount++;
    }
  }

  layoutBFSS(shift = 0, nodes) {
    this.callLayout = { method: this.layoutBFSS, args: arguments };
    const searchString = nodes[0];
    const findString = nodes[1];
    let stringCount = 0;
    const xSpacing = 25;
    const ySpacing = 30;
    let startFindString = -1;
    for (let i = 0; i < searchString.length; i++) {
      const thisNode = this.findNode(stringCount);
      thisNode.shape = 'square';
      thisNode.x = (i - searchString.length / 2) * xSpacing;
      if (i === 0) {
        startFindString = thisNode.x;
      }
      thisNode.y = ySpacing / 2;
      stringCount++;
    }
    for (let i = 0; i < findString.length; i++) {
      const thisNode = this.findNode(stringCount);
      thisNode.shape = 'square';
      thisNode.x = startFindString + (i * xSpacing + (shift * 25));
      thisNode.y = -1 * (ySpacing / 2);
      stringCount++;
    }
  }

  layoutTree(root = 0, sorted = false) {
    this.root = root;
    this.callLayout = { method: this.layoutTree, args: arguments };
    const rect = this.getRect();

    // If there is a sole node, it centers it.
    if (this.nodes.length === 1) {
      const [node] = this.nodes;
      node.x = (rect.left + rect.right) / 2;
      node.y = (rect.top + rect.bottom) / 2;
      return;
    }

    // Traversal of the entire tree, counting number of leaves.
    let maxDepth = 0;
    const leafCounts = {};
    let marked = {};
    const recursiveAnalyze = (id, depth) => {
      marked[id] = true;
      leafCounts[id] = 0;
      if (maxDepth < depth) maxDepth = depth;
      const linkedNodeIds = this.findLinkedNodeIds(id, false);
      for (const linkedNodeId of linkedNodeIds) {
        if (marked[linkedNodeId]) continue;
        leafCounts[id] += recursiveAnalyze(linkedNodeId, depth + 1);
      }
      if (leafCounts[id] === 0) leafCounts[id] = 1;
      return leafCounts[id];
    };
    recursiveAnalyze(root, 0);

    // Calculates node's x and y.
    const hGap = rect.width / leafCounts[root];
    const vGap = rect.height / maxDepth;
    marked = {};
    const recursivePosition = (node, h, v) => {
      marked[node.id] = true;
      node.x = rect.left + (h + leafCounts[node.id] / 2) * hGap;
      node.y = rect.top + v * vGap;
      const linkedNodes = this.findLinkedNodes(node.id, false);
      if (sorted) linkedNodes.sort((a, b) => a.id - b.id);
      for (const linkedNode of linkedNodes) {
        if (marked[linkedNode.id]) continue;
        recursivePosition(linkedNode, h, v + 1);
        h += leafCounts[linkedNode.id];
      }
    };
    const rootNode = this.findNode(root);
    recursivePosition(rootNode, 0, 0);
  }

  layoutBST(root = 0, sorted = false) {
    this.root = root;
    this.callLayout = { method: this.layoutBST, args: arguments };
    const rect = this.getRect();
    // If there is a sole node, it centers it.
    const middleX = (rect.left + rect.right) / 2;
    const middleY = (rect.top + rect.bottom) / 2;
    if (this.nodes.length === 1) {
      const [node] = this.nodes;
      node.x = middleX;
      node.y = middleY;
      return;
    }

    // Traversal of the entire tree, counting number of nodes.
    let maxDepth = 0;
    const nodeDepth = {};
    let marked = {};
    const recursiveAnalyze = (id, depth) => {
      marked[id] = true;
      nodeDepth[id] = depth;
      if (maxDepth < depth) maxDepth = depth;
      const linkedNodeIds = this.findLinkedNodeIds(id, false);
      for (const linkedNodeId of linkedNodeIds) {
        if (marked[linkedNodeId]) continue;
        recursiveAnalyze(linkedNodeId, depth + 1);
      }
    };
    recursiveAnalyze(root, 0);

    // Calculates node's x and y.
    // adjust hGap to some function of node number later//
    const hGap = 80;
    const vGap = rect.height / maxDepth;
    marked = {};
    const recursivePosition = (node, h, v) => {
      marked[node.id] = true;
      // 120 magic number to center root node//
      node.x = rect.left + h * hGap + 120;
      node.y = rect.top + v * vGap;
      /* used to debug, delete in merge
      console.log(node.x + " " +  node.y + " "  + node.id );
      console.log(middle_x + " " + h + " " + hGap + " " +node.id);
      console.log(middle_y + " " + v + " " + vGap + " " +node.id);
      */
      const linkedNodes = this.findLinkedNodes(node.id, false);
      if (sorted) linkedNodes.sort((a, b) => a.id - b.id);
      for (const linkedNode of linkedNodes) {
        if (marked[linkedNode.id]) continue;
        if (linkedNode.id > node.id) {
          if (node.id > this.root) {
            recursivePosition(linkedNode, h + 1 / (v * v + 1), v + 1);
          } else {
            recursivePosition(linkedNode, h + 1 / (v * v + 1), v + 1);
          }
        } else if (linkedNode.id < node.id) {
          if (node.id < this.root) {
            recursivePosition(linkedNode, h - 1 / (v * v + 1), v + 1);
          } else {
            recursivePosition(linkedNode, h - 1 / (2 * v + 1), v + 1);
          }
        }
      }
    };
    const rootNode = this.findNode(root);
    recursivePosition(rootNode, 0, 0);
  }


  layoutRandom() {
    this.callLayout = { method: this.layoutRandom, args: arguments };
    const rect = this.getRect();
    const placedNodes = [];
    for (const node of this.nodes) {
      do {
        node.x = rect.left + Math.random() * rect.width;
        node.y = rect.top + Math.random() * rect.height;
      } while (placedNodes.find(placedNode => distance(node, placedNode) < 48));
      placedNodes.push(node);
    }
  }

  visit(target, source, weight) {
    this.visitOrLeave(true, target, source, weight);
  }

  leave(target, source, weight) {
    this.visitOrLeave(false, target, source, weight);
  }

  visitOrLeave(visit, target, source = null, weight) {
    const edge = this.findEdge(source, target);
    if (edge) edge.visitedCount += visit ? 1 : -1;
    const node = this.findNode(target);
    if (weight !== undefined) node.weight = weight;
    node.visitedCount += visit ? 1 : -1;
    if (this.logTracer) {
      this.logTracer.println(visit ? (source || '') + ' -> ' + target : (source || '') + ' <- ' + target);
    }
  }

  select(target, source) {
    this.selectOrDeselect(true, target, source);
  }

  deselect(target, source) {
    this.selectOrDeselect(false, target, source);
  }

  resetSelect(target, source) {
    const edge = this.findEdge(source, target);
    if (edge) edge.selectedCount = 0;
    const node = this.findNode(target);
    node.selectedCount = 0;
  }

  selectOrDeselect(select, target, source = null) {
    const edge = this.findEdge(source, target);
    if (edge) edge.selectedCount += select ? 1 : -1;
    const node = this.findNode(target);
    node.selectedCount += select ? 1 : -1;
    if (this.logTracer) {
      this.logTracer.println(select ? (source || '') + ' => ' + target : (source || '') + ' <= ' + target);
    }
  }

  log(key) {
    this.logTracer = key ? this.getObject(key) : null;
  }

  setText(text) {
    this.text = text;
  }
}

export default GraphTracer;
