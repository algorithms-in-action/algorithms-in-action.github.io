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
/* eslint-disable-next-line max-classes-per-file */
import { node } from 'prop-types';
import Tracer from '../common/Tracer.jsx';
import { distance } from '../common/util';
import GraphRenderer from './GraphRenderer/index';
import TreeNode from './NAryTree';
import VariableTreeNode from './NAryTreeVariable';

export class Element {
  constructor() {
    this.variables = [];
  }
}

class NTreeTracer extends Tracer {
  getRendererClass() {
    return GraphRenderer;
  }

  init() {
    super.init();
    this.dimensions = {
      baseWidth: 1000,
      baseHeight: 480,
      padding: 32,
      nodeRadius: 20,
      arrowGap: 4,
      nodeWeightGap: 4,
      edgeWeightGap: 4,
    };
    this.isDirected = true;
    this.isWeighted = false;
    //this.shape = 'square';
    this.showSelfLoop = true;
    this.callLayout = { method: this.layoutNTree, args: [] };
    this.realEdges = [];
    this.realNodes = [];
    this.variableNodes = false;
    this.isReversed = false;

    this.logTracer = null;
    this.istc = false;
    this.SiblingSeparation = 50;
    this.xTopAdjustment = 0;
    this.yTopAdjustment = 0;
    this.maxDepth = 50000;
    this.SubtreeSeparation = 50;
    this.LevelSeparation = 100;
    this.levels = null;
    this.swap = false;
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
  }

  clearHighlights() {
    this.nodes.forEach(node => {
      this.leave(node.id, node.id);
      // If want to generalise, may need to add more leave1 with different colour values.
      this.leave1(node.id, node.id, 2);
      this.deselect(node.id, node.id);
    })
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
   * extract a n-tree object from the edges and nodes given
   * @return {object} a tree object
   */
  getNTree() {
    // this will be the theoretical root node, and the handle for the tree
    const nodeMap = {};
    const rootNodes = new Set(this.realNodes.map(node => node.id));

    // Create the TreeNode instances and map them by their ID.
    this.realNodes.forEach(node => {
      let treeNode;
      if (this.variableNodes) {
        treeNode = new VariableTreeNode(node.id);
        node.nodeIDs.forEach(nodeID => treeNode.addRelatedNodeID(nodeID));
      } else {
        treeNode = new TreeNode(node.id);
    }
    //console.log("THIS IS THE IMPORTANT ONE", treeNode.getIDs());
      treeNode.x = 0; // node.x;
      treeNode.y = 0; // node.y;
      //console.log("node id", node.id);
      nodeMap[node.id] = treeNode;
    });
    //console.log("nodeMap", nodeMap);

    // Use edges to establish parent-child relationships.
    //console.log("edges", this.realEdges);
    this.realEdges.forEach(edge => {
      const parent = nodeMap[edge.source];
      const child = nodeMap[edge.target];
      //console.log("parent", parent, "child", child);

      // Make sure this is a new child relationship
      if (parent && child && !parent.children.includes(child)) {
        parent.children.push(child);
        child.parent = parent;

        // Once we determine the parent of a node, it's no longer a root candidate
        rootNodes.delete(child.id);
      }
    });

    // For the BFS
    const queue = [];
    const levels = [];

    // Assuming a single root for simplicity, but you can adjust if there are multiple roots


    const root = nodeMap[Array.from(rootNodes)[0]];
    root.level = 0;
    queue.push(root);

    while (queue.length) {
      const current = queue.shift();

      if (levels[current.level]) {
        levels[current.level].push(current);
      } else {
        levels[current.level] = [current];
      }

      current.children.forEach(child => {
        child.level = current.level + 1;
        queue.push(child);
      });
    }

    return {
      tree: root,
      levels,
    };
  }

  /**
   * extract the root from edges and nodes
   * @return {number} root
   */
  getRoot() {
    // in case there is only a single node in the graph
    if (this.edges.length === 0 && this.realNodes.length === 1) {
      return this.realNodes[0].id;
    }
    const sources = this.edges.map(obj => obj.source);
    const targets = this.edges.map(obj => obj.target);
    const nodes = [...new Set([...sources, ...targets])];
    // the node that does not a source is the root
    return nodes.find(node => !targets.includes(node));
  }


  swapNodes(nodeId1, nodeId2) {
    this.swap = true;
    const node1 = this.findNode(nodeId1.toString());
    const node2 = this.findNode(nodeId2.toString());
    // after tracking both nodes, we need to now swap them by changing the outging edges and ingoing edges


    //  swap edges
    for (const edge of this.realEdges) {
      // Swap sources
      if (edge.source === node1.id) {
        edge.source = node2.id;
      } else if (edge.source === node2.id) {
        edge.source = node1.id;
      }

      // Swap targets
      if (edge.target === node1.id) {
        edge.target = node2.id;
      } else if (edge.target === node2.id) {
        edge.target = node1.id;
      }
    }
    // make sure you do this with the visible edge list as well
    for (const edge of this.edges) {
      // Swap sources
      if (edge.source === node1.id) {
        edge.source = node2.id;
      } else if (edge.source === node2.id) {
        edge.source = node1.id;
      }

      // Swap targets
      if (edge.target === node1.id) {
        edge.target = node2.id;
      } else if (edge.target === node2.id) {
        edge.target = node1.id;
      }
    }
    
  }

  directed(isDirected = true) {
    this.isDirected = isDirected;
  }

  weighted(isWeighted = true) {
    this.isWeighted = isWeighted;
  }

  isParent(parent, child) {
    // This function will check if parent is actually a parent of child node
    for (const edge of this.realEdges) {
      if (edge.source === parent && edge.target === child) {
        return true;
      }
    }
    return false;
  }

  addNode(id, value = undefined, shape = 'circle', color = 'blue', weight = null,
    x = 0, y = 0, visitedCount = 0, selectedCount = 0, visitedCount1 = 0) {
    if (this.findNode(id)) return;
    value = (value === undefined ? id : value);
    const key = id;
    // eslint-disable-next-line max-len
    if (!this.variableNodes) {
      this.realNodes.push({id, x, y});
    }
    if (id !== '0') {
      this.nodes.push({ id, value, shape, color, weight, x, y, visitedCount, selectedCount, key, visitedCount1});
    }
    // this.layout();
  }

  // solely for real nodes
  addVariableNode(varID, nodeID) {
    if (!this.variableNodes) return;
    const index = this.realNodes.findIndex(node => node.id === varID);

    if (index === -1) {
      // this means that the variable node does not exist yet
      this.realNodes.push({id: varID, x: 0, y: 0, nodeIDs: [nodeID]});
    } else {
      // this means that the variable node already exists
      this.realNodes[index].nodeIDs.push(nodeID);
    }

    this.addNode(nodeID, undefined, 'square');

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
    if(this.variableNodes) {
      for (const node of this.realNodes) {
        if (node.nodeIDs.includes(id)) {
          const index = node.nodeIDs.indexOf(id);
          node.nodeIDs.splice(index, 1);
        }
      }
    }
    const node = this.findNode(id);
    if (!node) return;
    const index = this.nodes.indexOf(node);
    this.nodes.splice(index, 1);
    this.layout();
  }

  addEdge(source, target, weight = null, visitedCount = 0, selectedCount = 0, visitedCount1 = 0) {
    if (this.findEdge(source, target)) return;
    // for the sake of coding, check if the edge passed in involves the "hidden" node as a parent
    if (source !== '0') { // and not visited?
      this.edges.push({ source, target, weight, visitedCount, selectedCount, visitedCount1 });
    }

    if (!(source === target)) {
    this.realEdges.push({ source, target, weight, visitedCount, selectedCount, visitedCount1 });
    }

    // this.layout();
  }

  removeEdge(source, target) {

    const newEdges = this.edges.filter(edge => !(edge.source === source && edge.target === target));

    const newRealEdges = this.realEdges.filter(edge => !(edge.source === source && edge.target === target));

    this.edges = newEdges;
    this.realEdges = newRealEdges;
    
}


  updateEdge(source, target, weight, visitedCount, selectedCount) {
    const edge = this.findEdge(source, target);
    const update = { weight, visitedCount, selectedCount };
    Object.keys(update).forEach(key => {
      if (update[key] === undefined) delete update[key];
    });
    Object.assign(edge, update);
  }


  findValue(id) {
    return this.findNode(id).value;
  }

  findNode(id) {
    return this.nodes.find(node => node.id === id);
  }

  findVariableNode(varID) {
    if (!this.variableNodes) return;
    return this.realNodes.find(node => node.id === varID);
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

  meanNodeSize(leftNode, rightNode) {
    // need to consider changing this
    const leftNodeSize = leftNode.getNodeLength() * (this.dimensions.nodeRadius*2);
    const rightNodeSize = rightNode.getNodeLength() * (this.dimensions.nodeRadius*2);
    
    return (leftNodeSize + rightNodeSize) / 2;
  }

  getLeftMost(node, lvl, depth) {
    if (lvl >= depth) {
      return node;
    } else if (node.children.length === 0) {
      return null;
    } else {
      let rightmost = node.children[0];
      let leftmost = this.getLeftMost(rightmost, lvl + 1, depth);

      while (!leftmost && rightmost.getRightSibling()) {
        rightmost = rightmost.getRightSibling();
        leftmost = this.getLeftMost(rightmost, lvl + 1, depth);
      }

      return leftmost;
    }
  }

  apportion(node, lvl) {
    let leftmost = node.children[0];
    let neighbour = leftmost.getLeftNeighbour(this.levels);
    // console.log("why does it look weird", leftmost.value, neighbour.value);

    let compareDepth = 1;
    const depthToStop = this.maxDepth - lvl;

    while (leftmost && neighbour && compareDepth <= depthToStop) {
      let leftModsum = 0;
      let rightModsum = 0;
      let ancestorLeftmost = leftmost;
      let ancestorNeighbour = neighbour;

      for (let i = 0; i < compareDepth; i++) {
        ancestorLeftmost = ancestorLeftmost.getParent();
        ancestorNeighbour = ancestorNeighbour.getParent();

        rightModsum += ancestorLeftmost.modifier;
        leftModsum += ancestorNeighbour.modifier;
      }

      let moveDistance = (neighbour.prelimx + leftModsum + this.SubtreeSeparation + this.meanNodeSize(leftmost, neighbour)) - (leftmost.prelimx + rightModsum);
      // console.log("movedist", moveDistance, node.value);

      if (moveDistance > 0) {
        let tempPtr = node;
        let leftSiblings = 0;

        while (tempPtr && tempPtr !== ancestorNeighbour) {
          leftSiblings++;
          tempPtr = tempPtr.getLeftSibling();
        }

        // console.log("leftsiblings", leftSiblings);

        if (tempPtr) {
          const portion = moveDistance / leftSiblings;
          tempPtr = node;

          while (tempPtr !== ancestorNeighbour) {
            // console.log("ancestor neighbour", portion);
            tempPtr.prelimx += moveDistance;
            tempPtr.modifier += moveDistance;
            moveDistance -= portion;
            tempPtr = tempPtr.getLeftSibling();
          }
        } else {
          return;
        }
      }

      compareDepth++;
      if (leftmost.children.length === 0) {
        leftmost = this.getLeftMost(node, 0, compareDepth);
      } else {
        leftmost = leftmost.children[0];
      }

      if (leftmost) {
        neighbour = leftmost.getLeftNeighbour(this.levels);
      }
    }
  }

  firstWalk(node, lvl) {
    if (node.children.length === 0) {
      const leftSibling = node.getLeftSibling();
      if (leftSibling !== null) {
        node.prelimx = leftSibling.prelimx + this.SiblingSeparation + this.meanNodeSize(leftSibling, node);
      } else {
        node.prelimx = 0;
      }
    } else {
      node.children.forEach(child => this.firstWalk(child, lvl + 1));
      const midpoint = (node.children[0].prelimx + node.children[node.children.length - 1].prelimx) / 2;
      if (node.getLeftSibling() !== null) {
        node.prelimx = node.getLeftSibling().prelimx + this.SiblingSeparation + this.meanNodeSize(node.getLeftSibling(), node);
        node.modifier = node.prelimx - midpoint;
        this.apportion(node, lvl);
      } else {
        node.prelimx = midpoint;
      }
    }
  }

  checkExtentsRange(x, y) {
    const rect = this.getRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  secondWalk(node, lvl, modsum) {
    let result = true;
    if (lvl <= this.maxDepth) {
      const xTemp = this.xTopAdjustment + node.prelimx + modsum;
      const yTemp = this.yTopAdjustment + (lvl * this.LevelSeparation);

      if (this.checkExtentsRange(xTemp, yTemp)) {
        node.x = xTemp;
        node.y = yTemp;

        if (node.children.length !== 0) {
          result = this.secondWalk(node.children[0], lvl + 1, modsum + node.modifier);
        }
        if (result && node.getRightSibling() !== null) {
          result = this.secondWalk(node.getRightSibling(), lvl, modsum);
        }
      } else {
        result = false;
      }
    }
    return result;
  }

  getVariableNode(varID) {
    if (!this.variableNodes) return;
    return this.realNodes.find(node => node.varID === varID);
  }

  translateCoords() {
    const flattenedLevels = [].concat(...this.levels);

    flattenedLevels.forEach(levelNode => {

      if (!this.variableNodes) {
        const nodeToUpdate = this.nodes.find(node => node.id === levelNode.id);

        if (nodeToUpdate) {
          nodeToUpdate.x = levelNode.x;
          nodeToUpdate.y = levelNode.y;
        }
      } else {
        // Updating x and y in realNodes for rendering in variable:
        const updateXandY = this.findVariableNode(levelNode.id);
        updateXandY.x = levelNode.x;
        updateXandY.y = levelNode.y;


        let nodeLength = levelNode.getNodeLength();
        console.log(levelNode);

          const nodesToUpdate = this.nodes.filter(node => levelNode.getIDs().includes(node.id));
          //console.log(nodesToUpdate);
          // might want to sort here?

          if (nodesToUpdate) {
            const nodeRadius = this.dimensions.nodeRadius;
            const halfWidth = nodeRadius * nodeLength;
            nodesToUpdate.forEach((nodeToUpdate, i) => {
              let valueX;

              if (nodeLength === 1) {
                valueX = levelNode.x ;
              }
              if (nodeLength === 2) {
                valueX = levelNode.x + (i * nodeRadius * 2) - nodeRadius;
              } else if (nodeLength === 3) {
                valueX = levelNode.x + ((i - 1) * nodeRadius * 2);
              } else {
                valueX = levelNode.x - halfWidth + (i * nodeRadius * 2) + nodeRadius;
              }
              nodeToUpdate.x = valueX;
              nodeToUpdate.y = levelNode.y;
            });
          }
      }
    });
  }

  layoutNTree() {
    // Note that this function as of right now (haven't fully decided)
    // will work only with a root that connects to the rest of the tree
    this.callLayout = { method: this.layoutNTree, args: arguments };
    const rect = this.getRect();

    if (this.realNodes.length === 0) {
      //console.log("no nodes");
      // this means there is no tree to layout, so just return

      return;
    }
    //console.log("real nodes", this.realNodes);
    if (this.realNodes.length === 1 && !this.variableNodes) {
      const [node] = this.realNodes;
      node.x = (rect.left + rect.right) / 2;
      node.y = (rect.top + rect.bottom) / 2;
      return;
    }

    // also note that root node should start at (240,0)
    // now we need to grab the tree here
    const { tree, levels } = this.getNTree();
    this.levels = levels;
    tree.x = (rect.left + rect.right) / 2;
    tree.y = rect.top;

    if (tree !== null) {
      this.firstWalk(tree, 0);
      this.xTopAdjustment = tree.x - tree.prelimx;
      this.yTopAdjustment = tree.y;

      const outcome = this.secondWalk(tree, 0, 0);
      // move the node coordinates over
      this.translateCoords();


      return outcome;
    } else {
      return true;
    }
  }

  addSelfLoop(nodeId, weight = null, visitedCount = 0, selectedCount = 0, visitedCount1 = 0) {
    if (!this.findNode(nodeId)) {
      return;
    }
    this.addEdge(nodeId, nodeId, weight, visitedCount, selectedCount, visitedCount1);
  }
  

  visit0(target, source, weight) {
    this.visitOrLeave0(true, target, source, weight);
  }

  visit(target, source, weight) {
    this.visitOrLeave(true, target, source, weight);
  }

  leave(target, source, weight) {
    this.visitOrLeave(false, target, source, weight);
  }

  allLeave(target, sources, weight) {
    for (let i = 0; i < sources.length; i += 1) {
      this.visitOrLeave(false, target, sources[i], weight);
    }
  }

  visitOrLeave0(visit, target, source = null, weight) {
    const edge = this.findEdge(source, target);
    const node = this.findNode(target);
    if (weight) node.weight = weight;
    if (!this.istc) {
      node.visitedCount0 += visit ? 1 : -1;
      if (edge && !(source === target)) edge.visitedCount0 += visit ? 1 : -1;
    } else {
      node.visitedCount0 = visit ? 1 : 0;
      if (edge && !(source === target)) edge.visitedCount0 = visit ? 1 : 0;
    }
    if (this.logTracer) {
      this.logTracer.println(visit ? (source || '') + ' -> ' + target : (source || '') + ' <- ' + target);
    }
  }

  visitOrLeave(visit, target, source = null, weight) {
    const edge = this.findEdge(source, target);
    const node = this.findNode(target);
    if (weight) node.weight = weight;
    if (visit == false){
     // console.log(node);
    }
    if (!this.istc) {
      node.visitedCount += visit ? 1 : -1;
      if (edge && !(source === target)) edge.visitedCount += visit ? 1 : -1;
    } else {
      node.visitedCount = visit ? 1 : 0;
      if (edge && ! (source === target)) edge.visitedCount = visit ? 1 : 0;
    }
    if (this.logTracer){
      this.logTracer.println(visit ? (source || '') + ' -> ' + target : (source || '') + ' <- ' + target);
    }
  }

  select(target, source) {
    this.selectOrDeselect(true, target, source);
  }

  styledSelect(style, target, source) {
    this.styledSelectOrDeselect(style, true, target, source);
  }

  styledDeselect(style, target, source) {
    this.styledSelectOrDeselect(style, false, target, source);
  }

  deselect(target, source) {
    this.selectOrDeselect(false, target, source);
  }

  visit1(target, source, colorIndex, weight) {
    this.visitOrLeave1(true, target, source, weight, colorIndex);
  }

  leave0(target, source, colorIndex = 1, weight) {
    this.visitOrLeave0(false, target, source, weight, colorIndex);
  }

  leave1(target, source, colorIndex = 1, weight) {
    this.visitOrLeave1(false, target, source, weight, colorIndex);
  }

  visitOrLeave1(visit, target, source = null, weight = null, colorIndex = 1) {
    const edge = this.findEdge(source, target);
    const node = this.findNode(target);
    if (weight) node.weight = weight;

    const node1 = this.findNode(source);
    if (colorIndex === 1) {
      if (edge && !(source === target)) edge.visitedCount1 = visit ? 1 : 0;
      node.visitedCount1 = visit ? 1 : 0;
      if (node1) node1.visitedCount1 = visit ? 1 : 0;
    } else if (colorIndex === 2) {
      if (edge && !(source === target)) edge.visitedCount2 = visit ? 1 : 0;
      node.visitedCount2 = visit ? 1 : 0;
      if (node1) node1.visitedCount2 = visit ? 1 : 0;
    } else if (colorIndex === 3) { // For red
      node.visitedCount = visit ? 1: 0;
    }
    if (this.logTracer) {
      this.logTracer.println(visit ? (source || '') + ' -> ' + target : (source || '') + ' <- ' + target);
    }
  }

  selectOrDeselect(select, target, source = null) {
    const edge = this.findEdge(source, target);
    if (edge && !(source === target)) edge.selectedCount += select ? 1 : -1;
    const node = this.findNode(target.toString());
    node.selectedCount += select ? 1 : -1;
    if (this.logTracer) {
      this.logTracer.println(select ? (source || '') + ' => ' + target : (source || '') + ' <= ' + target);
    }
  }

  sorted(target) {
    const node = this.findNode(target);
    node.sorted = true;
  }

  // style = { backgroundStyle: , textStyle: }
  styledSelectOrDeselect(style, select, target, source) {
    this.selectOrDeselect(select, target, source);
    const node = this.findNode(target);
    node.style = style;
  }

  resetSelect(target, source) {
    const edge = this.findEdge(source, target);
    if (edge) edge.selectedCount = 0;
    const node = this.findNode(target);
    node.selectedCount = 0;
  }

  isInterConnected(source, target) {
    return this.edges.find(edge => edge.source === source && edge.target === target)
        && this.edges.find(edge => edge.source === target && edge.target === source);
  }

  log(key) {
    this.logTracer = key ? this.getObject(key) : null;
  }

  setIstc() {
    this.istc = true;
  }
}

export default NTreeTracer;
