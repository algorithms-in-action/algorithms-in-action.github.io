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
import Tracer from '../../common/Tracer.jsx';
import NAryTreeRenderer from '../NAryTreeRenderer/index';
import TreeNode from './NAryTree.js';
import VariableTreeNode from './NAryTreeVariable.js';

export class Element {
  constructor() {
    this.variables = [];
  }
}

/**
 * The NTreeTracer class is used to represent NAry trees.
 * Utilises John Q. Walker II's "A node positioning algorithm for general trees" (1989).
 * @class
 */
class NTreeTracer extends Tracer {
  getRendererClass() {
    return NAryTreeRenderer;
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

    this.isDirected = true; // whether to display arrows
    this.showSelfLoop = true; // whether to display self-loop (see union-find)
    this.callLayout = { method: this.layoutNTree, args: [] };
    this.realEdges = []; // logical edges (for rendered edges, see edges)
    this.realNodes = []; // logical nodes (for rendered nodes, see nodes)
    this.variableNodes = false; // for logical variable size nodes (see 234 tree)
    this.isReversed = false; // whether to reverse the arrows

    // variables used in the tree placement algorithm
    this.SiblingSeparation = 50;
    this.xTopAdjustment = 0;
    this.yTopAdjustment = 0;
    this.maxDepth = 50000;
    this.SubtreeSeparation = 50;
    this.LevelSeparation = 100;
    this.levels = null;

    this.functionName = ''; // for fancy code style caption
    this.text = null;
    this.swap = false;

    this.baseOffset = 20; // used to position text/caption above base of rect
  }

  /**
   * This is the original function provided by Tracer.js,
   * but we add a second argument which accepts nodes' values.
   * @param {array} array2d 2D array of nodes.
   */
  set(array2d = [], values = []) {
    this.nodes = [];
    this.edges = [];
    for (let i = 0; i < array2d.length; i++) {
      this.addNode(i, values[i] ? values[i] : i);
      for (let j = 0; j < array2d.length; j++) {
        const value = array2d[i][j];
        if (value) {
          this.addEdge(i, j, null);
        }
      }
    }

    this.layout();

    super.set();
  }

  /**
   * Checks whether the tree is empty.
   * @returns {boolean} whether the tree is empty or not.
   */
  isEmpty() {
    return this.nodes.length === 0 && this.edges.length === 0;
  }

  /**
   * Extracts a n-tree object from edges and nodes.
   * @return {object} a tree object.
   */
  getNTree() {
    // handle for the tree (and theoretical root node)
    const nodeMap = {};
    const rootNodes = new Set(this.realNodes.map((node) => node.id));
    if (this.realNodes.length === 0) {
      return null;
    }
    // create tree node instances and map them by their id
    this.realNodes.forEach((node) => {
      let treeNode;
      if (this.variableNodes) {
        treeNode = new VariableTreeNode(node.id);
        node.nodeIDs.forEach((nodeID) => treeNode.addRelatedNodeID(nodeID));
      } else {
        treeNode = new TreeNode(node.id);
      }
      treeNode.x = 0; // node.x;
      treeNode.y = 0; // node.y;
      nodeMap[node.id] = treeNode;
    });

    // use edges to establish parent-child relationships
    this.realEdges.forEach((edge) => {
      const parent = nodeMap[edge.source];
      const child = nodeMap[edge.target];

      // ensuring this is a new child relationship
      if (parent && child && !parent.children.includes(child)) {
        parent.children.push(child);
        child.parent = parent;

        // no longer a root candidate as have found parent
        rootNodes.delete(child.id);
      }
    });

    // for the BFS
    const queue = [];
    const levels = [];

    // assuming a single root for simplicity (but can adjust if multiple)
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

      current.children.forEach((child) => {
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
   * Extracts the root from edges and nodes.
   * @return {*} the root.
   */
  getRoot() {
    // in case there is only a single node in the graph
    if (this.edges.length === 0 && this.realNodes.length === 1) {
      return this.realNodes[0].id;
    }
    const sources = this.edges.map((obj) => obj.source);
    const targets = this.edges.map((obj) => obj.target);
    const nodes = [...new Set([...sources, ...targets])];
    // the node that does not have a source is the root
    return nodes.find((node) => !targets.includes(node));
  }

  /**
   * Swaps two nodes given their IDs.
   * @param {number} nodeId1 id of the first node to be swapped.
   * @param {number} nodeId2 id of the second node to be swapped.
   */
  swapNodes(nodeId1, nodeId2) {
    this.swap = true;
    const node1 = this.findNode(nodeId1.toString());
    const node2 = this.findNode(nodeId2.toString());

    // swap them by changing the out-going edges and in-going edges

    //  swap edges
    for (const edge of this.realEdges) {
      // swap sources
      if (edge.source === node1.id) {
        edge.source = node2.id;
      } else if (edge.source === node2.id) {
        edge.source = node1.id;
      }

      // swap targets
      if (edge.target === node1.id) {
        edge.target = node2.id;
      } else if (edge.target === node2.id) {
        edge.target = node1.id;
      }
    }

    // repeating with the visible (i.e., rendered) edge list
    for (const edge of this.edges) {
      // swap sources
      if (edge.source === node1.id) {
        edge.source = node2.id;
      } else if (edge.source === node2.id) {
        edge.source = node1.id;
      }

      // swap targets
      if (edge.target === node1.id) {
        edge.target = node2.id;
      } else if (edge.target === node2.id) {
        edge.target = node1.id;
      }
    }
  }

  /**
   * For NAry trees, used to decide whether the arrows are displayed.
   * @param {boolean} isDirected whether arrows are shown or not.
   */
  directed(isDirected = true) {
    this.isDirected = isDirected;
  }

  /**
   * Checks whether the parent-child node relationship holds.
   * @param {*} parent the parent node.
   * @param {*} child the child node.
   * @returns {boolean} whether the parent-child node relationship holds.
   */
  isParent(parent, child) {
    for (const edge of this.realEdges) {
      if (edge.source === parent && edge.target === child) {
        return true;
      }
    }
    return false;
  }

  /**
   * Adds a node to the tree.
   * @param {number} id the id of the node to be added.
   * @param {number} value the value of the node to be added.
   * @param {string} shape the shape of the node to be added (circle or square).
   * @param {number} fill the colour of the node to be added (default is white, but see fill).
   * @param {number} x default is 0, will be updated during layout.
   * @param {number} y default is 0, will be updated during layout.
   */
  addNode(
    id,
    value = undefined,
    shape = 'circle',
    fill = 0,
    x = 0,
    y = 0,
  ) {
    if (this.findNode(id)) return;
    value = value === undefined ? id : value;
    // eslint-disable-next-line max-len
    if (!this.variableNodes) {
      this.realNodes.push({ id, x, y });
    }
    const key = id;
    if (id !== '0') { // hidden root node
      this.nodes.push({
        id,
        value,
        shape,
        fill,
        x,
        y,
        key
      });
    }
  }

  /**
   * Adds a variable node to the tree.
   * @param {number} varID the variable node id,
   * @param {number} nodeID the node id to be added to the variable node.
   */
  addVariableNode(varID, nodeID) {
    if (!this.variableNodes) return;
    const index = this.realNodes.findIndex((node) => node.id === varID);

    if (index === -1) {
      // the variable node does not exist yet
      this.realNodes.push({ id: varID, x: 0, y: 0, nodeIDs: [nodeID] });
    } else {
      // the variable node already exists
      this.realNodes[index].nodeIDs.push(nodeID);
      this.realNodes[index].nodeIDs.sort((a, b) => a - b);
    }

    this.addNode(nodeID, undefined, 'square');
  }

  /**
   * Removes the whole variable node from the tree given its id.
   * For removing a single (rendered) node, use removeNode.
   * @param {number} id the id of the variable node to be removed.
   */
  removeFullNode(id) {
    if (!this.variableNodes) return;

    // remove edges that point to such a node or point out from it
    this.realNodes = this.realNodes.filter(node => node.id !== id);
    this.realEdges = this.realEdges.filter(edge => edge.source !== id && edge.target !== id);
    this.edges = this.edges.filter(edge => edge.source !== id && edge.target !== id);
  }

  /**
   * Remove a single (rendered) node given its id. 
   * @param {number} id the id of the node to be removed.
   */
  removeNode(id) {
    if (this.variableNodes) {
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

  /**
   * Adds an edge to the tree given the source and target nodes.
   * @param {*} source the source node.
   * @param {*} target the target node.
   */
  addEdge(source, target) {
    if (this.findEdge(source, target)) return;

    if (source !== '0') { // if the source is not the 'hidden' node
      this.edges.push({
        source,
        target,
      });
    }

    if (!(source === target)) { // else introduces infinite loop
      this.realEdges.push({
        source,
        target,
      });
    }
  }

  /**
   * Removes an edge from the tree given the source and target nodes.
   * @param {*} source the source node.
   * @param {*} target the target node.
   */
  removeEdge(source, target) {
    const newEdges = this.edges.filter(
      (edge) => !(edge.source === source && edge.target === target)
    );

    const newRealEdges = this.realEdges.filter(
      (edge) => !(edge.source === source && edge.target === target)
    );

    this.edges = newEdges;
    this.realEdges = newRealEdges;
  }


  /**
   * Finds the value of the node given the node id.
   * @param {number} id the node id.
   * @returns {number} the value of the node.
   */
  findValue(id) {
    return this.findNode(id).value;
  }

  /**
   * Finds the node given the node id.
   * @param {number} id the node id.
   * @returns {*} the node.
   */
  findNode(id) {
    return this.nodes.find((node) => node.id === id);
  }

  /**
   * Finds the variable node given the node id.
   * @param {number} varID the variable node id.
   * @returns {*} the variable node.
   */
  findVariableNode(varID) {
    if (!this.variableNodes) return;
    return this.realNodes.find((node) => node.id === varID);
  }

  /**
   * Finds the edge given the source and target nodes.
   * @param {*} source the source node.
   * @param {*} target the target node.
   * @param {boolean} isDirected whether the graph is directed or not.
   * @returns {*} the edge if found. 
   */
  findEdge(source, target, isDirected = this.isDirected) {
    if (isDirected) {
      return this.edges.find(
        (edge) => edge.source === source && edge.target === target
      );
    } else {
      return this.edges.find(
        (edge) =>
          (edge.source === source && edge.target === target) ||
          (edge.source === target && edge.target === source)
      );
    }
  }

  /**
   * Gets the dimensions of the tree 'container'.
   * @returns {number[]} the dimensions of the container.
   */
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

  // intermediary function
  layout() {
    const { method, args } = this.callLayout;
    method.apply(this, args);
  }

  /**
   * This function returns the average size of two nodes.
   * @param {*} leftNode the left node.
   * @param {*} rightNode the right node.
   * @returns {number} the average size of the two given nodes.
   */
  meanNodeSize(leftNode, rightNode) {
    const leftNodeSize =
      leftNode.getNodeLength() * (this.dimensions.nodeRadius * 2);
    const rightNodeSize =
      rightNode.getNodeLength() * (this.dimensions.nodeRadius * 2);

    return (leftNodeSize + rightNodeSize) / 2;
  }

  /**
   * This function returns the leftmost descendant of a node at the given depth.
   * @param {*} node the node to find descendent of. 
   * @param {number} lvl the relative level below the node where the function was originally called on.
   * @param {number} depth the absolute depth where the leftmost descendent is to be found.
   * @returns {*} the descendent.
   */
  getLeftMost(node, lvl, depth) {
    if (lvl >= depth) {
      return node;
    } else if (node.children.length === 0) {
      return null;
    } else {
      let rightmost = node.children[0];
      let leftmost = this.getLeftMost(rightmost, lvl + 1, depth);
      // do postorder traversal of the subtree below the current node
      while (!leftmost && rightmost.getRightSibling()) {
        rightmost = rightmost.getRightSibling();
        leftmost = this.getLeftMost(rightmost, lvl + 1, depth);
      }

      return leftmost;
    }
  }

  /**
   * Cleans up positioning of small subtrees that are siblings of each other.
   * The purpose is to avoid the problem of small subtrees having a large gap between them and the larger subtrees
   * surrounding them. To avoid this, this function moves the interior subtrees to the right.
   * @param {*} node starting point of the subtree to be cleaned up.
   * @param {number} lvl the level of the node.
   * @returns modifies tree in-place.
   */
  apportion(node, lvl) {

    let leftmost = node.children[0];
    let neighbour = leftmost.getLeftNeighbour(this.levels);

    let compareDepth = 1;
    const depthToStop = this.maxDepth - lvl;

    while (leftmost && neighbour && compareDepth <= depthToStop) {
      // calculate where leftmost should be with respect to neighbour
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
      // calculate the movedistance and apply it to the node's subtrees
      // making sure to add appropriate portions to smaller subtrees
      let moveDistance =
        neighbour.prelimx +
        leftModsum +
        this.SubtreeSeparation +
        this.meanNodeSize(leftmost, neighbour) -
        (leftmost.prelimx + rightModsum);

      if (moveDistance > 0) {
        let tempPtr = node;
        let leftSiblings = 0;
        // count interior sibling subtrees 
        while (tempPtr && tempPtr !== ancestorNeighbour) {
          leftSiblings++;
          tempPtr = tempPtr.getLeftSibling();
        }

        if (tempPtr) {
          // apply portions to appropriate subtrees of the left sibling
          const portion = moveDistance / leftSiblings;
          tempPtr = node;

          while (tempPtr !== ancestorNeighbour) {
            tempPtr.prelimx += moveDistance;
            tempPtr.modifier += moveDistance;
            moveDistance -= portion;
            tempPtr = tempPtr.getLeftSibling();
          }
        } else {
          // don't need to move anything, as movement should be done by ancestor 
          // ancestor neighbour and ancestor leftmost aren't siblings

          return;
        }
      }
      // determine leftmost descendant of the current node at the level below, and compare 
      // the positioning of it against its neighbour
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

  /** 
   * Walks through tree in a postorder fashion and assigns preliminary x coordinates to nodes, 
   * along with modifiers that are used to move children of the node to the right.
   * @param {*} node the current node.
   * @param {number} lvl the current level where the node is at.
  */
  firstWalk(node, lvl) {

    // check if the node is a leaf node
    if (node.children.length === 0) {

      const leftSibling = node.getLeftSibling();
      if (leftSibling !== null) {
        // calculate preliminary x coordinate based on preliminary x coord of left sibling, sibling separation length
        // and the the mean size of the left sibling and the current node

        node.prelimx =
          leftSibling.prelimx +
          this.SiblingSeparation +
          this.meanNodeSize(leftSibling, node);
      } else {
        // there is no sibling on the left of the node to worry about, so don't need to change anything 
        node.prelimx = 0;
      }
    } else {
      // since this node is not a leaf node, call the function recursively on the children 
      // and perform calculations for the preliminary x values
      node.children.forEach((child) => this.firstWalk(child, lvl + 1));
      // find midpoint value of the children once you've assigned preliminary x coords
      const midpoint =
        (node.children[0].prelimx +
          node.children[node.children.length - 1].prelimx) /
        2;

      if (node.getLeftSibling() !== null) {
        // node has a left sibling, so calculate preliminary x coordinate based on left sibling, sibling separation
        // and mean node size of left sibling and node, then subtract the midpoint to ensure the node
        // is placed in the middle of it's children
        node.prelimx =
          node.getLeftSibling().prelimx +
          this.SiblingSeparation +
          this.meanNodeSize(node.getLeftSibling(), node);
        node.modifier = node.prelimx - midpoint;
        this.apportion(node, lvl);
      } else {
        // otherwise, if it has no left sibling we simply place it in the middle of its children as normal
        node.prelimx = midpoint;
      }
    }
  }

  /** 
   * Walks through tree in preorder fashion, assigning a final x coordinate to each node based on adding
   * it's preliminary coordinate and the modifier values of all its ancestors.
   * @param {*} node the current node.
   * @param {number} lvl current level.
   * @param {number} modsum the current sum of all the modifier values of the ancestors of this node.
   * @returns {boolean} true if no errors, false otherwise.
  */
  secondWalk(node, lvl, modsum) {
    let result = true;
    if (lvl <= this.maxDepth) {
      const xTemp = this.xTopAdjustment + node.prelimx + modsum;
      const yTemp = this.yTopAdjustment + lvl * this.LevelSeparation;

      node.x = xTemp;
      node.y = yTemp;

      if (node.children.length !== 0) {
        result = this.secondWalk(
          node.children[0],
          lvl + 1,
          modsum + node.modifier
        );
      }
      if (result && node.getRightSibling() !== null) {
        result = this.secondWalk(node.getRightSibling(), lvl, modsum);
      }

    }
    return result;
  }

  /**
   * Returns the variable node given the node id.
   * @param {number} varID the variable node id.
   * @returns {*} the variable node.
   */
  getVariableNode(varID) {
    if (!this.variableNodes) return;
    return this.realNodes.find((node) => node.varID === varID);
  }

  /**
   * This function converts the internal node representation which is covered by the NAryTree class,
   * and converts it into a set of nodes that can be rendered, adjusting the coordinates if the current tree
   * is a 2-3-4 tree, including accounting for the tree rising in size rather than falling.
   */
  translateCoords() {
    const flattenedLevels = [].concat(...this.levels);
    let offset = 308 - (this.levels.length - 2) * 100; // for 2-3-4 trees/variable nodes to grow upwards (as top-down implementation)

    flattenedLevels.forEach((levelNode) => {
      // might want to implement treeBaseY for caption for regular nodes
      if (!this.variableNodes) {
        const nodeToUpdate = this.nodes.find(
          (node) => node.id === levelNode.id
        );

        if (nodeToUpdate) {
          nodeToUpdate.x = levelNode.x;
          nodeToUpdate.y = levelNode.y;
        }
      } else {
        // getting coordinates for variable node
        const updateXandY = this.findVariableNode(levelNode.id);
        updateXandY.x = levelNode.x;
        updateXandY.y = levelNode.y + (offset) - (this.baseOffset * 1.5);

        let nodeLength = levelNode.getNodeLength();

        const nodesToUpdate = this.nodes.filter(node => levelNode.getIDs().includes(node.id));

        // sort to account for later insertions
        nodesToUpdate.sort((a, b) => a.id - b.id);

        if (nodesToUpdate) {
          const nodeRadius = this.dimensions.nodeRadius;
          const halfWidth = nodeRadius * nodeLength;

          // determines the coordinates of the variable node given its size
          nodesToUpdate.forEach((nodeToUpdate, i) => {
            let valueX;

            if (nodeLength === 1) {
              valueX = levelNode.x;
            }
            if (nodeLength === 2) {
              valueX = levelNode.x + (i * nodeRadius * 2) - nodeRadius;
            } else if (nodeLength === 3) {
              valueX = levelNode.x + ((i - 1) * nodeRadius * 2);
            } else {
              valueX = levelNode.x - halfWidth + (i * nodeRadius * 2) + nodeRadius;
            }
            nodeToUpdate.x = valueX;
            // would need to adjust 'offset' if don't want variable node tree growing from base
            // baseoffset used to account for the caption
            nodeToUpdate.y = levelNode.y + (offset) - (this.baseOffset * 1.5);

          });
        }
      }
    });
  }


  /**
   * Determines coordinates of every node so that the tree can be rendered 
   * in an aesthetic fashion, with even gaps between nodes and levels.
   */
  layoutNTree() {
    this.callLayout = { method: this.layoutNTree, args: arguments };
    const rect = this.getRect();

    // no tree to layout
    if (this.realNodes.length === 0) return;

    // if there is only one node, place it in the middle
    if (this.realNodes.length === 1 && !this.variableNodes) {
      const [node] = this.realNodes;
      node.x = (rect.left + rect.right) / 2;
      node.y = (rect.top + rect.bottom) / 2;
      return;
    }

    // getting the tree
    const { tree, levels } = this.getNTree();
    this.levels = levels;
    tree.x = (rect.left + rect.right) / 2;
    tree.y = rect.top

    // adjusting node positions 
    if (tree !== null) {
      this.firstWalk(tree, 0);

      this.xTopAdjustment = tree.x - tree.prelimx;
      this.yTopAdjustment = tree.y;

      this.secondWalk(tree, 0, 0);

      // move the node coordinates over
      this.translateCoords();
    }

  }

  /**
   * Add a self loop to a node (i.e., arrow pointing to self).
   * @param {number} nodeId the node to be self-looped.
   */
  addSelfLoop(nodeId) {
    if (!this.findNode(nodeId)) {
      return;
    }
    // adding solely to rendered edges
    // adding to logical would introduce infinite loop
    this.addEdge(
      nodeId,
      nodeId,
    );
  }

  /**
   * A simple node fill to work with the AiA themes.
   * Mapping 1=green, 2=yellow and 3=red under the default theme.
   * @param {*} target the node to be coloured.
   * @param {number} colourIndex the colour code.
   */
  fill(target, colourIndex = 0) {
    const node = this.findNode(target);
    if (!node) return;
    node.fill =
      (colourIndex === 1 || // green
        colourIndex === 2 || // orange/yellow
        colourIndex === 3) ? // red
        colourIndex : 0; // no colour
  }

  /**
   * A simple node unfill.
   * @param {*} target node to be uncoloured.
   */
  unfill(target) {
    const node = this.findNode(target);
    if (!node) return;
    node.fill = 0;
  }

  /**
   * Checks whether two nodes are connected.
   * @param {*} source the source node.
   * @param {*} target the target node.
   * @returns whether the two nodes are connected.
   */
  isInterConnected(source, target) {
    return (
      this.edges.find(
        (edge) => edge.source === source && edge.target === target
      ) &&
      this.edges.find(
        (edge) => edge.source === target && edge.target === source
      )
    );
  }

  /**
   * To use with setNTree. Extracts edges and nodes (i.e., the tree).
   * @returns the extracted tree object.
   */
  extractNTree() {
    this.unfillAll();
    return {
      'realNodes': this.realNodes,
      'realEdges': this.realEdges,
      'nodes': this.nodes,
      'edges': this.edges,
    };
  }

  /**
   * To use with extractNTree. Sets edges and nodes (i.e., the tree).
   * @param {*} realNodes the logical nodes of the tree.
   * @param {*} realEdges the logical edges of the tree.
   * @param {*} nodes the rendered nodes of the tree.
   * @param {*} edges the rendered edges of the tree.
   */
  setNTree(realNodes, realEdges, nodes, edges) {
    this.realNodes = realNodes;
    this.realEdges = realEdges;
    this.nodes = nodes;
    this.edges = edges;
  }

  /**
   * Unfill all nodes of the tree.
   */
  unfillAll() {
    this.text = null;
    this.nodes.forEach((node) => {
      node.fill = 0;
    });
  }

  /**
   * Sets the tree 'caption'.
   * @param {string} text the text to be displayed.
   */
  setText(text) {
    this.text = text;
  }

  /**
   * Sets the function name to be displayed in a code style.
   * See example at T234_Insert.
   * @param {string} name the function name.
   */
  setFunctionName(name) {
    this.functionName = name;
  }

}

export default NTreeTracer;
