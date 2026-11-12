// Splay tree implementation
// (XXX should add deletion?)
// Needs extra augmentation to make it into an AIA controller for
// animation (best merge AVL tree controller with this code as we want
// animations to be similar)

// The code is contributed by Nidhi goel to Geeks for Geeks
// Modified by Lee Naish

// Javascript code addition 

/**
 * Pure Splay Tree data structure used by the AIA controllers.
 *
 * This module deliberately contains no visualisation code. Controllers can
 * build animation chunks around these operations while the data-structure
 * behaviour remains independently testable.
 */

import {
  TreeNode as Node, rotateLeft, rotateRight, collectSubtreeKeys, getTreePath,
} from './helpers/treeUtils';

// Preserve the public Splay node constructor while sharing its representation.
export { Node };

// Call tracing is separate from the existing rotation/insertion event stream.
// Only keys are exposed, captured before the call mutates its subtree.
function reportCall(onCall, type, root, key, parentKey, depth, splayCase) {
  if (!onCall) return;
  const call = {
    type,
    algorithm: 'splay',
    operation: 'splay',
    key,
    depth,
    parentKey,
    rootKey: root === null ? null : root.key,
    splayCase,
  };
  if (type === 'call-enter') {
    call.nodeKeys = collectSubtreeKeys(root);
    call.pathKeys = getTreePath(root, key).slice(0, 3);
  }
  onCall(call);
}

class SplayTree {
  static newNode(key) {
    return new Node(key);
  }

  static reportInsertion(onEvent, action, key, rootKey) {
    if (onEvent) {
      onEvent({
        type: 'insertion',
        action,
        bookmark: 'Main',
        key,
        rootKey,
      });
    }
  }

  static reportDeletion(onEvent, action, key, rootKey, extra = {}) {
    if (onEvent) {
      onEvent({
        type: 'deletion',
        action,
        bookmark: 'Del',
        key,
        rootKey,
        ...extra,
      });
    }
  }

  static rightRotate(root) {
    return rotateRight(root);
  }

  static leftRotate(root) {
    return rotateLeft(root);
  }

  static rightRotateWithEvent(root, onEvent, eventDetails) {
    const pivotKey = root.key;
    const newRootKey = root.left.key;
    const transferredSubtreeKey = root.left.right === null
      ? null
      : root.left.right.key;
    const newRoot = SplayTree.rightRotate(root);

    if (onEvent) {
      onEvent({
        type: 'rotation',
        direction: 'right',
        ...eventDetails,
        pivotKey,
        newRootKey,
        transferredSubtreeKey,
      });
    }

    return newRoot;
  }

  static leftRotateWithEvent(root, onEvent, eventDetails) {
    const pivotKey = root.key;
    const newRootKey = root.right.key;
    const transferredSubtreeKey = root.right.left === null
      ? null
      : root.right.left.key;
    const newRoot = SplayTree.leftRotate(root);

    if (onEvent) {
      onEvent({
        type: 'rotation',
        direction: 'left',
        ...eventDetails,
        pivotKey,
        newRootKey,
        transferredSubtreeKey,
      });
    }

    return newRoot;
  }

  /**
   * Move the requested key, or the last node reached while looking for it,
   * to the root of the tree.
   *
   * The recursive structure follows the existing AIA pseudocode: it examines
   * two levels at a time and performs rotations as recursive calls return.
   *
   * onEvent retains the existing rotation records. Optional onCall receives
   * paired call-enter/call-return records at the actual call boundaries.
   * Entry nodeKeys and pathKeys are detached snapshots; pathKeys contains at
   * most the first two edges. Cases are reported by the executing branch.
   */
  static splay(root, key, onEvent = null, parentKey = null, depth = 1, onCall = null) {
    const enter = splayCase => reportCall(
      onCall, 'call-enter', root, key, parentKey, depth, splayCase,
    );
    const finish = (result, splayCase) => {
      reportCall(onCall, 'call-return', result, key, parentKey, depth, splayCase);
      return result;
    };
    if (root === null || root.key === key) {
      enter('E');
      return finish(root, 'E');
    }

    if (key < root.key) {
      if (root.left === null) {
        enter('E');
        return finish(root, 'E');
      }

      let splayCase = 'LE';

      // Two-edge cases require the second edge to exist. A missing
      // grandchild is Left-Empty, just like finding k at the left child.
      if (key < root.left.key && root.left.left !== null) {
        splayCase = 'LL';
        enter(splayCase);
        // Left-left: first splay inside the left-left subtree.
        root.left.left = SplayTree.splay(
          root.left.left,
          key,
          onEvent,
          root.left.key,
          depth + 1,
          onCall,
        );
        root = SplayTree.rightRotateWithEvent(root, onEvent, {
          bookmark: 'LL-rot1',
          splayCase,
          parentKey,
          depth,
        });
      } else if (key > root.left.key && root.left.right !== null) {
        splayCase = 'LR';
        enter(splayCase);
        // Left-right: first splay inside the left-right subtree.
        root.left.right = SplayTree.splay(
          root.left.right,
          key,
          onEvent,
          root.left.key,
          depth + 1,
          onCall,
        );
        if (root.left.right !== null) {
          root.left = SplayTree.leftRotateWithEvent(root.left, onEvent, {
            bookmark: 'LR-rot1',
            splayCase,
            parentKey: root.key,
            depth,
          });
        }
      } else {
        enter(splayCase);
      }

      // This is also the single-rotation case when the key is the left child.
      if (root.left === null) return finish(root, splayCase);

      return finish(SplayTree.rightRotateWithEvent(root, onEvent, {
        bookmark: splayCase === 'LE' ? 'LE-rot1' : `${splayCase}-rot2`,
        splayCase,
        parentKey,
        depth,
      }), splayCase);
    }

    if (root.right === null) {
      enter('E');
      return finish(root, 'E');
    }

    let splayCase = 'RE';

    // Mirror the Left-Empty rule when the requested right grandchild is absent.
    if (key > root.right.key && root.right.right !== null) {
      splayCase = 'RR';
      enter(splayCase);
      // Right-right: first splay inside the right-right subtree.
      root.right.right = SplayTree.splay(
        root.right.right,
        key,
        onEvent,
        root.right.key,
        depth + 1,
        onCall,
      );
      root = SplayTree.leftRotateWithEvent(root, onEvent, {
        bookmark: 'RR-rot1',
        splayCase,
        parentKey,
        depth,
      });
    } else if (key < root.right.key && root.right.left !== null) {
      splayCase = 'RL';
      enter(splayCase);
      // Right-left: first splay inside the right-left subtree.
      root.right.left = SplayTree.splay(
        root.right.left,
        key,
        onEvent,
        root.right.key,
        depth + 1,
        onCall,
      );
      if (root.right.left !== null) {
        root.right = SplayTree.rightRotateWithEvent(root.right, onEvent, {
          bookmark: 'RL-rot1',
          splayCase,
          parentKey: root.key,
          depth,
        });
      }
    } else {
      enter(splayCase);
    }

    // This is also the single-rotation case when the key is the right child.
    if (root.right === null) return finish(root, splayCase);

    return finish(SplayTree.leftRotateWithEvent(root, onEvent, {
      bookmark: splayCase === 'RE' ? 'RE-rot1' : `${splayCase}-rot2`,
      splayCase,
      parentKey,
      depth,
    }), splayCase);
  }

  static search(root, key, onEvent = null, onCall = null) {
    const observer = onCall ? call => onCall({ ...call, operation: 'search' }) : null;
    return SplayTree.splay(root, key, onEvent, null, 1, observer);
  }

  static insert(root, key, onEvent = null, onCall = null) {
    if (root === null) {
      SplayTree.reportInsertion(onEvent, 'empty-tree', key, null);
      return SplayTree.newNode(key);
    }

    const observer = onCall ? call => onCall({ ...call, operation: 'insert' }) : null;
    const splayedRoot = SplayTree.splay(root, key, onEvent, null, 1, observer);

    // Duplicate keys are ignored. Splaying still moves the existing node to
    // the root, which is the expected Splay Tree access behaviour.
    if (splayedRoot.key === key) {
      SplayTree.reportInsertion(
        onEvent,
        'duplicate',
        key,
        splayedRoot.key,
      );
      return splayedRoot;
    }

    const newRoot = SplayTree.newNode(key);

    if (key < splayedRoot.key) {
      SplayTree.reportInsertion(
        onEvent,
        'insert-left',
        key,
        splayedRoot.key,
      );
      newRoot.left = splayedRoot.left;
      newRoot.right = splayedRoot;
      splayedRoot.left = null;
    } else {
      SplayTree.reportInsertion(
        onEvent,
        'insert-right',
        key,
        splayedRoot.key,
      );
      newRoot.left = splayedRoot;
      newRoot.right = splayedRoot.right;
      splayedRoot.right = null;
    }

    return newRoot;
  }

  /**
   * Delete key from the tree and return the resulting root.
   * If key is absent, splay still moves the last accessed node to the
   * root. When key is present, the maximum node in its left subtree becomes
   * the new root before the original right subtree is reattached.
   */
  static delete(root, key, onEvent = null, onCall = null) {
    if (root === null){
      SplayTree.reportDeletion(onEvent, 'empty-tree', key, null);
      return root;
    }

    const splayedRoot = SplayTree.splay(root, key, onEvent, null, 1, onCall);

    if (splayedRoot.key !== key) {
      SplayTree.reportDeletion(onEvent, 'not-found', key, splayedRoot.key);
      return splayedRoot;
    }
    if (splayedRoot.left === null) {
      SplayTree.reportDeletion(onEvent, 'left-empty', key, splayedRoot.key);
      return splayedRoot.right;
    }

    const rightSubtree = splayedRoot.right;
    SplayTree.reportDeletion(onEvent, 'detach-right', key, splayedRoot.key,
      { rightSubtreeKey: rightSubtree ? rightSubtree.key : null});

    const newRoot = SplayTree.splay(splayedRoot.left, key, onEvent, null, 1, onCall);
    newRoot.right = rightSubtree;

    SplayTree.reportDeletion(onEvent, 'reattach-right', key, newRoot.key,
      { rightSubtreeKey: rightSubtree ? rightSubtree.key : null});
    return newRoot;
  }
}
export default SplayTree;
