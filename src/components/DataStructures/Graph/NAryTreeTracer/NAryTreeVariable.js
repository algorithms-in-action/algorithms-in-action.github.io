import TreeNode from './NAryTree';

/**
 * The VariableTreeNode class is used to represent the variable node.
 * A variable node is a node that contains some number of rendered nodes.
 * Note that the variable node itself is not rendered - it is a purely logical 
 * construct, similiar to 'realNodes', for use in the node placement algorithm.
 */

class VariableTreeNode extends TreeNode {
  constructor(id) {
    super(id);
    this.relatedNodeIDs = [];
  }

  /**
   * Getting the ID of the variable node.
   * @returns {number} the ID of the variable node.
   */
  getNodeId() {
    return this.id;
  }

  /**
   * Getting the IDs of the rendered nodes within the variable node.
   * @returns {number[]} the IDs of the rendered nodes.
   */
  getIDs() {
    return this.relatedNodeIDs;
  }

  /**
   * Adding the ID of the rendered node to the variable node.
   * @param {number} nodeID the ID of the rendered node.
   */
  addRelatedNodeID(nodeID) {
    if (this.relatedNodeIDs.includes(nodeID)) {
      return;
    }
    this.relatedNodeIDs.push(nodeID);
    this.relatedNodeIDs.sort((a, b) => a - b);
  }

  /**
   * Removing the ID of the rendered node from the variable node.
   * @param {number} nodeID the ID of the rendered node.
   */
  removeRelatedNodeID(nodeID) {
    const index = this.relatedNodeIDs.indexOf(nodeID);
    if (index !== -1) {
      this.relatedNodeIDs.splice(index, 1);
    }
  }

  /**
   * Clearing the IDs of the rendered nodes from the variable node.
   */
  clearRelatedNodeIDs() {
    this.relatedNodeIDs = [];
  }

  /**
   * Getting the variable node length.
   * @returns {number} the number of rendered nodes within the variable node.
   */
  getNodeLength() {
    return this.relatedNodeIDs.length;
  }

  /**
   * Checks whether the variable node contains some rendered node.
   * @param {number} nodeID the ID of the rendered node.
   * @returns {boolean} whether the variable node contains the rendered node.
   */
  hasRelatedNodeID(nodeID) {
    return this.relatedNodeIDs.includes(nodeID);
  }
}

export default VariableTreeNode;
