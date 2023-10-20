/* eslint-disable no-undef */

import TTFTreeInsertion from './TTFTreeInsertion';
import TTFTreeSearch from './TTFTreeSearch';
import VariableTreeNode from '../../components/DataStructures/Graph/NAryTreeVariable';

// simple stub for the chunker
const chunker = {
  add: () => { },
};

describe('2-3-4 Tree', () => {
  describe('findChild', () => {
    it('should return null when child is null', () => {
      const child = null;
      const value = 5;
      const result = TTFTreeInsertion.findChild(child, value);
      expect(result).toBeNull();

    });
    it('should return first child for simple example', () => {
      const child = new VariableTreeNode(0);
      const child1ofChild = new VariableTreeNode(1);
      const child2ofChild = new VariableTreeNode(2);
      child.addRelatedNodeID(3);
      child1ofChild.addRelatedNodeID(2);
      child2ofChild.addRelatedNodeID(4);
      const value = 1;
      child.addChild(child1ofChild);
      child.addChild(child2ofChild);
      const result = TTFTreeInsertion.findChild(child, value);
      expect(result.id).toStrictEqual(1);

    });
    it('should return third child in more complex example', () => {
      const child = new VariableTreeNode(0);
      const child1ofChild = new VariableTreeNode(1);
      const child2ofChild = new VariableTreeNode(2);
      const child3ofChild = new VariableTreeNode(3);
      const child4ofChild = new VariableTreeNode(4);

      child.addRelatedNodeID(55);
      child.addRelatedNodeID(65);
      child.addRelatedNodeID(103);

      child1ofChild.addRelatedNodeID(35);
      child1ofChild.addRelatedNodeID(45);
      child1ofChild.addRelatedNodeID(24);


      child2ofChild.addRelatedNodeID(57);
      child2ofChild.addRelatedNodeID(60);
      child2ofChild.addRelatedNodeID(63);

      child3ofChild.addRelatedNodeID(72);
      child3ofChild.addRelatedNodeID(82);
      child3ofChild.addRelatedNodeID(87);

      child4ofChild.addRelatedNodeID(106);
      child4ofChild.addRelatedNodeID(112);
      child4ofChild.addRelatedNodeID(115);

      const value = 84;
      child.addChild(child1ofChild);
      child.addChild(child2ofChild);
      child.addChild(child3ofChild);
      child.addChild(child4ofChild);
      const result = TTFTreeInsertion.findChild(child, value);
      expect(result.id).toStrictEqual(3);

    });
  });
  describe('formParentThreeNode', () => {
    it('should return -1 as child doesnt exist in parent', () => {
      const child = new VariableTreeNode(1);
      const parent = new VariableTreeNode(2);
      parent.addRelatedNodeID(6);
      parent.addRelatedNodeID(10);
      child.addRelatedNodeID(2);
      child.addRelatedNodeID(3);
      child.addRelatedNodeID(4);

      const result = TTFTreeInsertion.formParentThreeNode(parent, child, null, null);
      expect(result).toStrictEqual(-1);

    });
    it('should return 2 as child is second child in parent', () => {
      const child = new VariableTreeNode(1);
      const child1 = new VariableTreeNode(3);
      const child2 = new VariableTreeNode(4);
      const parent = new VariableTreeNode(2);

      parent.addRelatedNodeID(6);
      parent.addRelatedNodeID(10);
      child.addRelatedNodeID(2);
      child.addRelatedNodeID(3);
      child.addRelatedNodeID(4);
      child1.addRelatedNodeID(8);
      child2.addRelatedNodeID(12);
      parent.addChild(child);
      parent.addChild(child1);
      parent.addChild(child2);
      const result = TTFTreeInsertion.formParentThreeNode(parent, child1, null, null);
      expect(result).toStrictEqual(1);

    });


  });
});
