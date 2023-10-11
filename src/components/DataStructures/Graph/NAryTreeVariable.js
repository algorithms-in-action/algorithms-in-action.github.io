import TreeNode from './NAryTree';

class VariableTreeNode extends TreeNode {
  constructor(id) {
    super(id);
    this.relatedNodeIDs = [];
  }

  getNodeId() {
    return this.id;
  }

  getIDs() {
    return this.relatedNodeIDs;
  }

  addRelatedNodeID(nodeID) {
    if (this.relatedNodeIDs.includes(nodeID)) {
      return;
    }

    this.relatedNodeIDs.push(nodeID);
  }

  removeRelatedNodeID(nodeID) {
    const index = this.relatedNodeIDs.indexOf(nodeID);
    if (index !== -1) {
      this.relatedNodeIDs.splice(index, 1);
    }
  }

  getNodeLength() {
    return this.relatedNodeIDs.length;
  }

  hasRelatedNodeID(nodeID) {
    return this.relatedNodeIDs.includes(nodeID);
  }
}

export default VariableTreeNode;
