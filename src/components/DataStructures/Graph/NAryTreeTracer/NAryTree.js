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


class TreeNode {
  constructor(id) {
    this.id = id;
    this.parent = null;
    this.children = [];
    this.x = null;
    this.y = null;
    this.level = null;
    this.prelimx = 0;
    this.modifier = 0;
    this.rank = 0;
  }

  /**
   * Getting the ID of the node.
   * @returns {number[]} the ID of the node in an array for compatibility.
   */
  getIDs() {
    return [this.id];
  }

  /**
   * Getting the node length.
   * @returns {number} 1.
   */
  getNodeLength() {
    return 1;
  }

  /**
   * Adding the child node to the node.
   * @param {*} childNode the child node to be added.
   */
  addChild(childNode) {
    childNode.parent = this;
    this.children.push(childNode);
  }

  /**
   * Getting the parent node of the node.
   * @returns {*} the parent node.
   */
  getParent() {
    return this.parent;
  }

  // for use in node placement algorithm
  getLeftSibling() {
    if (this.getParent() == null) {
      return null;
    }
    const myIndex = this.getParent().getChildIndex(this);
    if (myIndex - 1 >= 0) {
      return this.getParent().children[myIndex - 1];
    }
    return null;
  }

  /**
   * Gets the index of the child node.
   * @param {*} child the child node.
   * @returns {number} the index of the child node.
   */
  getChildIndex(child) {
    return this.children.findIndex((c) => c.id === child.id);
  }

  // for use in node placement algorithm
  getRightSibling() {
    if (this.getParent() == null) {
      return null;
    }
    const myIndex = this.getParent().getChildIndex(this);
    if (myIndex + 1 < this.getParent().children.length) {
      return this.getParent().children[myIndex + 1];
    }
    return null;
  }

  // for use in node placement algorithm
  getLeftNeighbour(hierarchy) {
    const leftSibling = this.getLeftSibling();
    if (leftSibling == null) {
      const levelList = hierarchy[this.level];
      const index = levelList.findIndex((n) => n.id === this.id);
      if (index !== 0) {
        return levelList[index - 1];
      }
      // if it is the first node on a level, will have no left neighbour
      return null;
    }
    return leftSibling;
  }

}
export default TreeNode;
