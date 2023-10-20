import { TTFExp } from '../explanations';
import NTreeTracer from '../../components/DataStructures/Graph/NTreeTracer';
import VariableTreeNode from '../../components/DataStructures/Graph/NAryTreeVariable';
import { TREE_COLOUR_CODES } from './unionFindUnion';

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

  moveToChild(chunker, node, value) {
    if (node === null) {
      chunker.add('until c is Empty (and p is a leaf node)');
      return null;
    }

    const nodeLength = node.getNodeLength();
    const values = node.getIDs(); 

    chunker.add('if c is a two-node');
    if (nodeLength === 1) {
      chunker.add('if k < c.key1: if c is a two-node');
      if (value < values[0]) {
        chunker.add('c <- c.child1: if c is a two-node');
        return node.children[0];
      }
      else {
        chunker.add('else: if c is a two-node');
        chunker.add('c <- c.child2: if c is a two-node');
        return node.children[1];
      }
    }
    chunker.add('else if c is a three-node');
    if (nodeLength === 2) {
      chunker.add('if k < c.key1: else if c is a three-node');
      if (value < values[0]) {
        chunker.add('c <- c.child1: else if c is a three-node');
        return node.children[0];
      }
      chunker.add('else if k < c.key2: else if c is a three-node');
      if (value < values[1]) {
        chunker.add('c <- c.child2: else if c is a three-node');
        return node.children[1];
      }
      else {
        chunker.add('else: else if c is a three-node');
        chunker.add('c <- c.child3: else if c is a three-node');
        return node.children[2];
      }
    }
    // redundant code
    else {
      chunker.add('else: MoveToChild');
      chunker.add('if k < c.key1: else: MoveToChild');
      if (value < values[0]) {
        chunker.add('c <- c.child1: else: MoveToChild');
        return node.children[0];
      }
      chunker.add('else if k < c.key2: else: MoveToChild');
      if (value < values[1]) {
        chunker.add('c <- c.child2: else: MoveToChild');
        return node.children[1];
      }
      chunker.add('else if k < c.key3')
      if (value < values[2]) {
        chunker.add('c <- c.child3: else: MoveToChild');
        return node.children[2];
      }
      else {
        chunker.add('else: else: MoveToChild');
        chunker.add('c <- c.child4');
        return node.children[3];
      }
    }
  },

    // Highlight the current value.
    highlightValue(visObj, value, colour) {
      this.unhighlightValue(visObj, value);
      visObj.visit1(value, value, colour);
    },

    // Unhighlight the current value.
    unhighlightValue(visObj, value) {
      visObj.leave1(value, value, TREE_COLOUR_CODES.RED);
      visObj.leave1(value, value, TREE_COLOUR_CODES.ORANGE);
      visObj.leave1(value, value, TREE_COLOUR_CODES.GREEN);
    },

    // Highlight an entire 2-3-4 node.
    highlightNode(visObj, node, colour) {
      console.log("bbb", node);
      this.unhighlightNode(visObj, node);
      for (let i = 0; i < node.relatedNodeIDs.length; i++) {
        let value = node.relatedNodeIDs[i];
        visObj.visit1(value, value, colour);
      }
    },

    // Unhighlight an entire 2-3-4 node.
    unhighlightNode(visObj, node) {
      for (let i = 0; i < node.relatedNodeIDs.length; i++) {
        let value = node.relatedNodeIDs[i];
        visObj.leave1(value, value, TREE_COLOUR_CODES.RED);
        visObj.leave1(value, value, TREE_COLOUR_CODES.ORANGE);
        visObj.leave1(value, value, TREE_COLOUR_CODES.GREEN);
      }
    },

  // return tree and node id of inserted value. expands 4-nodes on the way
  traverseAndInsert(chunker, value, tree, newID) {
    chunker.add('if t = Empty');
    chunker.add('else: T234_Insert(t, k)');

    chunker.add('p <- Empty');
    let parent = null;
    chunker.add('c <- t');
    let child = tree;

    while (child != null) {
      chunker.add('repeat');
      let oldChild = child;
      // if we encounter a four node
      chunker.add('if c is a four-node');
      if (child.getNodeLength() === 3) {
        let child1, child2;
        ({ node: child1, id: newID } = this.createNodeAndIncrement(newID));
        ({ node: child2, id: newID } = this.createNodeAndIncrement(newID));

        if (child.children.length === 4) {
          child1.children.push(child.children[0]);
          child1.children.push(child.children[1]);
          child2.children.push(child.children[2]);
          child2.children.push(child.children[3]);
        }

        chunker.add('c1 <- new two-node with c.child1, c.key1 and c.child2');
        chunker.add('c2 <- new two-node with c.child3, c.key3 and c.child4');
        child1.addRelatedNodeID(child.getIDs()[0]);
        child2.addRelatedNodeID(child.getIDs()[2]);

        // splitting complete, forming new parent:
        chunker.add('if p = Empty');
        if (parent === null) {
          // form new root
          ({ node: tree, id: newID } = this.createNodeAndIncrement(newID));

          tree.children.push(child1);
          tree.children.push(child2);
          tree.addRelatedNodeID(child.getIDs()[1]);
          chunker.add('t <- new two-node with c1, c.key2 and c2', this.handleChunkerAdd, [
            tree.id,
            tree.getIDs()[0],
            child.id,
            [child1.id, child1.getIDs()[0], child1.children],
            [child2.id, child2.getIDs()[0], child2.children],
            true,
          ]);
          child = tree;
        } else if (parent.getNodeLength() === 1) {
          chunker.add('else if p is a two-node');
          let parentChildren = parent.children;
          let idx = this.formParentThreeNode(parent, child, child1, child2);

          chunker.add('Change p to a three-node, with c1, c.key2 and c2 replacing c', this.handleChunkerAdd, [
            parent.id,
            child.getIDs()[1],
            child.id,
            [child1.id, child1.getIDs()[0], child1.children],
            [child2.id, child2.getIDs()[0], child2.children],
            false,
            idx,
            parentChildren
          ]);
        } else {
          chunker.add('else: InsertParent');
          let parentChildren = parent.children;
          let idx = this.formParentFourNode(parent, child, child1, child2);

          chunker.add('Change p to a four-node, with c1, c.key2 and c2 replacing c', this.handleChunkerAdd, [
            parent.id,
            child.getIDs()[1],
            child.id,
            [child1.id, child1.getIDs()[0], child1.children],
            [child2.id, child2.getIDs()[0], child2.children],
            false,
            idx,
            parentChildren
          ]);
        }

        chunker.add('if k < c.key2: Split');
        if (value < oldChild.getIDs()[1]) {
          chunker.add('c <- c1');
          child = child1;
        } else {
          chunker.add('else: Split');
          chunker.add('c <- c2');
          child = child2;
        }
      }

      chunker.add('p <- c');
      parent = child;
      child = this.moveToChild(chunker, child, value);
    }

    // insertion
    parent.addRelatedNodeID(value);
    chunker.add('if p is a two-node');
    if (parent.getNodeLength() === 2) {
      chunker.add(
        'Change p to a three-node, containing the old p.key1 and k',
        (vis, parent, value) => {
          vis.tree.addVariableNode(parent.id, value);
          // this.highlightNode(vis.tree, parent, TREE_COLOUR_CODES.GREEN);
          vis.tree.layout();
        },
        [parent, value]
      );
    }
    else {
      chunker.add('else: Insert');
      chunker.add(
        'Change p to a four-node, containing the old p.key1 and p.key2 and k',
        (vis, parent, value) => {
          vis.tree.addVariableNode(parent.id, value);
          // this.highlightNode(vis.tree, parent, TREE_COLOUR_CODES.GREEN);
          vis.tree.layout();
        },
        [parent, value]
      );
    }

    // chunker.add(
    //   '1',
    //   (vis, parent) => {
    //     this.unhighlightNode(vis.tree, parent);
    //   },
    //   [parent]
    // );

    return { nTree: tree, id: newID };
  },

  formParentThreeNode(parent, child, child1, child2) {
    let parentnodeIDs = parent.getIDs();
    parent.clearRelatedNodeIDs();

    let childIdx = parent.children.indexOf(child);
    parent.children.splice(childIdx, 1, child1, child2);

    parent.addRelatedNodeID(child.getIDs()[1]);
    parent.addRelatedNodeID(parentnodeIDs[0]);
    return childIdx;
  },

  formParentFourNode(parent, child, child1, child2) {
    let parentnodeIDs = parent.getIDs();
    parent.clearRelatedNodeIDs();

    let childIdx = parent.children.indexOf(child);
    parent.children.splice(childIdx, 1, child1, child2);

    parent.addRelatedNodeID(child.getIDs()[1]);
    parent.addRelatedNodeID(parentnodeIDs[0]);
    parent.addRelatedNodeID(parentnodeIDs[1]);
    return childIdx;
  },

  createNodeAndIncrement(id) {
    if (id === null) id = 1;
    const node = new VariableTreeNode(id);
    id++;
    return { node, id };
  },

  handleChunkerAdd(
    vis,
    ParentID,
    newParentValue,
    oldChildID,
    child1Info,
    child2Info,
    newRoot = false,
    childIdx = null,
    parentChildren = null,
  ) {
    if (newRoot) {
      vis.tree.addVariableNode(ParentID, newParentValue);
      console.log('new root', newParentValue);
      vis.tree.addEdge(0, ParentID);
    }
    // remove old child
    vis.tree.removeFullNode(oldChildID);

    // add child1 and child2 which are new now to the tree
    vis.tree.addVariableNode(child1Info[0], child1Info[1]);
    console.log('child 1', child1Info[1]);
    vis.tree.addVariableNode(child2Info[0], child2Info[1]);
    console.log('child 2', child2Info[1]);

    // add to parent as well
    vis.tree.addVariableNode(ParentID, newParentValue);
    if (!newRoot) {
      for (let i = 0; i < parentChildren.length; i++) {
        if (i != childIdx) {
          vis.tree.removeEdge(ParentID, parentChildren[i].id);
        }
      }
    }

    // now connect them properly to new parent and also the original children

    if (!newRoot) {
      for (let i = 0; i < parentChildren.length; i++) {
        if (i != childIdx) {
          vis.tree.addEdge(ParentID, parentChildren[i].id);
        }
        else {
          vis.tree.addEdge(ParentID, child1Info[0]);
          vis.tree.addEdge(ParentID, child2Info[0]);
        }
      }
    }

    else {
      vis.tree.addEdge(ParentID, child1Info[0]);
      vis.tree.addEdge(ParentID, child2Info[0]);
    }

    for (let i = 0; i < child2Info[2].length; i++) {
      vis.tree.addEdge(child2Info[0], child2Info[2][i].id);
    }
    for (let i = 0; i < child1Info[2].length; i++) {
      vis.tree.addEdge(child1Info[0], child1Info[2][i].id);
    }
    vis.tree.layout();
  },
  // insertion of a node into tree. assumes the tree is not empty
  insert(chunker, value, tree, newID) {
    chunker.add('T234_Insert(t, k)');
    let newInfo = this.traverseAndInsert(chunker, value, tree, newID);
    return newInfo;
  },

  initTree(chunker, value, tree) {
    chunker.add('T234_Insert(t, k)');
    chunker.add('if t = Empty');
    tree.addRelatedNodeID(value);

    chunker.add(
      't <- a new two-node containing k and empty subtrees',
      (vis, nodeID, value) => {
        vis.tree.variableNodes = true;
        vis.tree.isDirected = false;
        vis.tree.addVariableNode(0, '0');
        vis.tree.addVariableNode(nodeID, value);
        vis.tree.addEdge(0, nodeID);
        vis.tree.layout();
      },
      [tree.id, tree.getIDs()[0]]
    );

    return tree;
  },

  run(chunker, { nodes }) {
    // node?
    if (nodes === null || nodes.length === 0) return;
    let { node: tree, id: newID } = this.createNodeAndIncrement(null);


    // initialising tree
    let treeStruct = this.initTree(chunker, nodes[0], tree);

    if (nodes.length === 1) return;

    treeStruct = this.insert(chunker, nodes[1], tree, newID);

    // remaining insertions
    for (let i = 2; i < nodes.length; i++) {
      treeStruct = this.insert(
        chunker,
        nodes[i],
        treeStruct['nTree'],
        treeStruct['id']
      );
    }
  },
};
