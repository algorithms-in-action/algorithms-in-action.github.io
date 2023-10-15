import { TTFExp } from '../explanations';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';

import VariableTreeNode from '../../components/DataStructures/Graph/NAryTreeVariable'; 

export default {
    explanation: TTFExp,

    initVisualisers() {
      return {
        tree: {
          instance: new NTreeTracer('n-tree', null, 'Tree View'),
          order: 0,
        },
      };
    },
  
  findChild(child, value){
    if (child === null) return null;

    for (let i = 0; i < child.getNodeLength(); i++) {
      if (value < child.getIDs()[i]) {
          return child.children[i];
      }
  }
  return child.children[child.getNodeLength()];
  },

  // return tree and node id of inserted value. expands 4-nodes on the way
  traverseAndInsert(chunker, value, tree, newID) {
    let parent = null;
    let child = tree;

    while (child != null) {

      // if we encounter a four node
      if (child.getNodeLength() === 3) { 

        let child1, child2;
        ({ node: child1, id: newID } = this.createNodeAndIncrement(newID));
        ({ node: child2, id: newID } = this.createNodeAndIncrement(newID));
        
        if (child.children.length === 4){
          child1.children.push(child.children[0]);
          child1.children.push(child.children[1]);
          child2.children.push(child.children[2]);
          child2.children.push(child.children[3]);
        }
        
        child1.addRelatedNodeID(child.getIDs()[0]);
        child2.addRelatedNodeID(child.getIDs()[2]);
       
        // splitting complete, forming new parent:
        if (parent === null) { // form new root
          ({ node: tree, id: newID } = this.createNodeAndIncrement(newID));

          tree.children.push(child1);
          tree.children.push(child2);
          tree.addRelatedNodeID(child.getIDs()[1]);

          chunker.add(
            '1',
            this.handleChunkerAdd,
            [tree.id, tree.getIDs()[0],child.id,[child1.id, child1.getIDs()[0], child1.children], [child2.id, child2.getIDs()[0], child2.children], true]
          );
          child = tree;
        }
        else if (parent.getNodeLength() === 1) { 
          parent = this.formParentThreeNode(parent, child, child1, child2);

          chunker.add(
            '1',
            this.handleChunkerAdd,
            [tree.id, child.getIDs()[1], child.id, [child1.id, child1.getIDs()[0], child1.children], [child2.id, child2.getIDs()[0], child2.children]]
        );

        }
        else {
          parent = this.formParentFourNode(parent, child, child1, child2);
          
          chunker.add(
            '1',
            this.handleChunkerAdd,
            [tree.id, child.getIDs()[1], child.id, [child1.id, child1.getIDs()[0], child1.children], [child2.id, child2.getIDs()[0], child2.children]]
          );
        }

        if (value < child.getIDs()[1]){
          child = child1;
        }
        else {
          child = child2;
        }

      }

      parent = child;
      child = this.findChild(child, value);  

    }
    // insertion  
    parent.addRelatedNodeID(value);
    chunker.add(
      '1',
      (vis, id, value) => {
        vis.tree.addVariableNode(id, value);
        vis.tree.layout();
      }, [parent.id, value]
    );
    return {nTree: tree, id: newID};
  },

  formParentThreeNode(parent, child, child1, child2) {
    let parentnodeIDs = parent.getIDs();
    parent.clearRelatedNodeIDs();

    let childIdx = parent.children.indexOf(child);
    parent.children.splice(childIdx, 1, child1, child2);

    parent.addRelatedNodeID(child.getIDs()[1]);
    parent.addRelatedNodeID(parentnodeIDs[0]);
  },

  formParentFourNode(parent, child, child1, child2) {
    let parentnodeIDs = parent.getIDs();
    parent.clearRelatedNodeIDs();

    let childIdx = parent.children.indexOf(child);
    parent.children.splice(childIdx, 1, child1, child2);

    parent.addRelatedNodeID(child.getIDs()[1]); 
    parent.addRelatedNodeID(parentnodeIDs[0]); 
    parent.addRelatedNodeID(parentnodeIDs[1]); 
  },

  createNodeAndIncrement(id) {
    if (id === null) id = 1;
    const node = new VariableTreeNode(id);
    id ++;
    return { node, id };
  },

  handleChunkerAdd(vis, ParentID, newParentValue, oldChildID, child1Info, child2Info, newRoot=false) {
    if (newRoot){
      vis.tree.addVariableNode(ParentID, newParentValue);
      vis.tree.addEdge(0, ParentID);
    }
    // remove old child
    vis.tree.removeFullNode(oldChildID);
    
    // add child1 and child2 which are new now to the tree
    vis.tree.addVariableNode(child1Info[0], child1Info[1]);
    vis.tree.addVariableNode(child2Info[0], child2Info[1]);
    
    // add to parent as well
    vis.tree.addVariableNode(ParentID, newParentValue);
    
    // now connect them properly to new parent and also the original children
    vis.tree.addEdge(ParentID, child1Info[0]);
    vis.tree.addEdge(ParentID, child2Info[0]);
    
    for (let i = 0; i < child2Info[2].length; i++) {
        vis.tree.addEdge(child2Info[0], child2Info[2][i].id);
    }
    for (let i = 0; i < child1Info[2].length; i++) {
        vis.tree.addEdge(child1Info[0], child1Info[2][i].id);
    }
    vis.tree.layout();
},
  // insertion of a node into tree. assumes the tree is not empty
  insert(chunker, value, tree, newID){
    let newInfo = this.traverseAndInsert(chunker, value, tree, newID);
    return newInfo
  },

  initTree(chunker, value, tree){
    tree.addRelatedNodeID(value);

    chunker.add(
      '1',
      (vis, nodeID, value) => {
        vis.tree.variableNodes = true;
        vis.tree.isDirected = false;
        vis.tree.addVariableNode(0, '0');
        vis.tree.addVariableNode(nodeID, value);
        vis.tree.addEdge(0, nodeID);
        vis.tree.layout();
    
      },[tree.id, tree.getIDs()[0]]
    );

    return tree;

  },

  run(chunker, { ignore }) {

    let { node: tree, id: newID } = this.createNodeAndIncrement(null);

    let values = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // initialising tree
    let treeStruct = this.initTree(chunker, values[0], tree);

    if (values.length === 1) return;

    treeStruct = this.insert(chunker, values[1], tree, newID);
    
    // remaining insertions
    for (let i = 2; i < values.length; i++) {
        treeStruct = this.insert(chunker, values[i], treeStruct["nTree"], treeStruct["id"]);
    }
  },

};

