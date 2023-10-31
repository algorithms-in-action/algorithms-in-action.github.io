import { TTFExp } from '../explanations';
import NTreeTracer from '../../components/DataStructures/Graph/NAryTreeTracer/NTreeTracer';
import VariableTreeNode from '../../components/DataStructures/Graph/NAryTreeTracer/NAryTreeVariable';
import { COLOUR_CODES } from './unionFindUnion';
import TTFTreeSearch from './TTFTreeSearch';

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

  // highlights the current value
  highlightValue(tree, value, colour) {
    this.unhighlightValue(tree, value);
    tree.fill(value, colour);
  },

  // unhighlights the current value
  unhighlightValue(tree, value) {
    tree.unfill(value);
  },

  // highlight an entire variable node
  highlightNode(tree, node, colour) {
    this.unhighlightNode(tree, node);
    for (let i = 0; i < node.relatedNodeIDs.length; i++) {
      let value = node.relatedNodeIDs[i];
      tree.fill(value, colour);
    }
  },

  // unhighlight an entire variable node
  unhighlightNode(tree, node) {
    for (let i = 0; i < node.relatedNodeIDs.length; i++) {
      let value = node.relatedNodeIDs[i];
      tree.unfill(value);
    }
  },

  /**
   * Returns the tree and node id of inserted value, expanding 4-nodes on the way.
   * @param {*} chunker 
   * @param {*} value the value to be inserted into the tree.
   * @param {*} tree the tree.
   * @param {*} newID 'global' counter for variable node id. 
   * @returns the tree and updated variable node id. 
   */
  traverseAndInsert(chunker, value, tree, newID) {
    chunker.add('if t = Empty');
    chunker.add('else: T234_Insert(t, k)');

    chunker.add('p <- Empty');
    let parent = null;
    let child = tree;

    chunker.add('c <- t',
      (vis, child) => {
        this.highlightNode(vis.tree, child, COLOUR_CODES.ORANGE);
      },
      [child]);

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

        chunker.add('if k < c.key2: Split',
          (vis, child1, child2) => {
            this.unhighlightNode(vis.tree, child1);
            this.unhighlightNode(vis.tree, child2);
          },
          [child1, child2]);
        if (value < oldChild.getIDs()[1]) {
          chunker.add('c <- c1',
            (vis, newParentValue, child1) => {
              this.unhighlightValue(vis.tree, newParentValue);
              this.highlightNode(vis.tree, child1, COLOUR_CODES.ORANGE);
            },
            [oldChild.getIDs()[1], child1]);
          child = child1;
        } else {
          chunker.add('else: Split');
          chunker.add('c <- c2',
            (vis, newParentValue, child2) => {
              this.unhighlightValue(vis.tree, newParentValue);
              this.highlightNode(vis.tree, child2, COLOUR_CODES.ORANGE);
            },
            [oldChild.getIDs()[1], child2]);
          child = child2;
        }
      }

      chunker.add('p <- c');
      parent = child;
      child = TTFTreeSearch.findChild(chunker, child, value);
      if (child === null) {
        chunker.add('until c is Empty (and p is a leaf node)'); // try here
      }
    }

    // insertion
    parent.addRelatedNodeID(value);
    chunker.add('if p is a two-node');
    if (parent.getNodeLength() === 2) {
      chunker.add(
        'Change p to a three-node, containing the old p.key1 and k',
        (vis, parent, value) => {
          vis.tree.addVariableNode(parent.id, value);
          this.unhighlightNode(vis.tree, parent);
          this.highlightValue(vis.tree, value, COLOUR_CODES.GREEN);
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
          this.unhighlightNode(vis.tree, parent);
          this.highlightValue(vis.tree, value, COLOUR_CODES.GREEN);
          vis.tree.layout();
        },
        [parent, value]
      );
    }
    return { nTree: tree, id: newID };
  },

  // helper function for node splitting
  formParentThreeNode(parent, child, child1, child2) {
    let parentnodeIDs = parent.getIDs();
    parent.clearRelatedNodeIDs();

    let childIdx = parent.children.indexOf(child);
    parent.children.splice(childIdx, 1, child1, child2);

    parent.addRelatedNodeID(child.getIDs()[1]);
    parent.addRelatedNodeID(parentnodeIDs[0]);
    return childIdx;
  },

  // helper function for node splitting
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

  /**
   * Creates a new variable node and increments the id.
   * @param {*} id the current 'global' id counter. 
   * @returns the new node and the updated id.
   */
  createNodeAndIncrement(id) {
    // easiest way to keep variable node ids unique is to increment some counter
    if (id === null) id = 1;
    const node = new VariableTreeNode(id);
    id++;
    return { node, id };
  },

  // helper function to visualise node splitting
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
      vis.tree.addEdge(0, ParentID);
    }
    // remove old child
    vis.tree.removeFullNode(oldChildID);

    // add child1 and child2 which are new now to the tree
    vis.tree.addVariableNode(child1Info[0], child1Info[1]);
    vis.tree.addVariableNode(child2Info[0], child2Info[1]);

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
    chunker.add('T234_Insert(t, k)',
      (vis) => {
        vis.tree.unfillAll();
        vis.tree.setText(`(t, ${value})`);
      });
    let newInfo = this.traverseAndInsert(chunker, value, tree, newID);
    return newInfo;
  },

  initTree(chunker, value, tree) {
    chunker.add('T234_Insert(t, k)');
    chunker.add('if t = Empty',
      (vis) => {
        vis.tree.setFunctionName('T234_Insert');
        vis.tree.setText(`(t, ${value})`);
      });
    tree.addRelatedNodeID(value);

    chunker.add(
      't <- a new two-node containing k and empty subtrees',
      (vis, tree, nodeID, value) => {
        vis.tree.variableNodes = true;
        vis.tree.isDirected = false;
        vis.tree.addVariableNode(0, '0');
        vis.tree.addVariableNode(nodeID, value);
        vis.tree.addEdge(0, nodeID);
        this.highlightNode(vis.tree, tree, COLOUR_CODES.GREEN);
        vis.tree.layout();
      },
      [tree, tree.id, tree.getIDs()[0]]
    );

    return tree;
  },

  run(chunker, { nodes }) {
    if (nodes === null || nodes.length === 0) return;
    let { node: tree, id: newID } = this.createNodeAndIncrement(null);

    // initialising tree
    let treeStruct = this.initTree(chunker, nodes[0], tree);

    if (nodes.length === 1) return;

    treeStruct = this.insert(chunker, nodes[0], tree, newID);

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
