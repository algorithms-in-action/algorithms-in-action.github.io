import { TreeNode, rotateLeft, rotateRight } from './helpers/treeUtils';

// Structural operations are deliberately a small dependency boundary. AVL
// height rules stay below; shared tree utilities can replace these helpers.
// newNode(key) returns { key, left: null, right: null }. Rotations mutate child
// links in place and return the promoted root; they do not maintain heights.
export const defaultHelpers = Object.freeze({
  newNode: key => new TreeNode(key),
  leftRotate: rotateLeft,
  rightRotate: rotateRight,
});

function cloneValue(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(cloneValue);
  return Object.fromEntries(Object.entries(value)
    .map(([name, child]) => [name, cloneValue(child)]));
}

function validateKey(key) {
  if (!Number.isInteger(key)) throw new TypeError('Tree keys must be integers');
}

function height(root) {
  return root === null ? 0 : root.height;
}

function updateHeight(root) {
  root.height = 1 + Math.max(height(root.left), height(root.right));
}

/**
 * Insert once into a nested BST or AVL tree, returning its possibly new root.
 * Children use null; keys may be zero or negative. Existing nodes are mutated.
 * An existing AVL input must already carry consistent height values (leaf 1).
 *
 * onEvent receives synchronous, detached records in execution order. Common
 * fields are type, key, depth, operation, algorithm, parentKey, globalRootKey.
 * Calls start at depth 1. A rotation's depth is its algorithm caller's depth,
 * including both primitives of a double rotation. No event contains UI state
 * or a live node reference. Helpers only create nodes or change child links.
 */
export function insertTree(root, key, {
  avl = false,
  onEvent = null,
  helpers = defaultHelpers,
} = {}) {
  validateKey(key);
  let globalRoot = root;

  function emit(type, depth, parent, details) {
    if (!onEvent) return;
    onEvent(cloneValue({
      type,
      key,
      depth,
      operation: 'insert',
      algorithm: avl ? 'avl' : 'bst',
      parentKey: parent === null ? null : parent.key,
      globalRootKey: globalRoot === null ? null : globalRoot.key,
      ...details,
    }));
  }

  function attach(parent, side, child) {
    if (parent === null) globalRoot = child;
    else parent[side] = child;
  }

  function rotate(current, direction, parent, side, depth, balanceCase, isFinalRotation) {
    const promoted = direction === 'left' ? current.right : current.left;
    const transfer = direction === 'left' ? promoted.left : promoted.right;
    const outer = direction === 'left' ? current.left : current.right;
    const rootBefore = onEvent ? cloneValue(current) : null;
    const pivotKey = current.key;
    const transferredSubtreeKey = transfer === null ? null : transfer.key;
    const outerChildKey = outer === null ? null : outer.key;
    const result = direction === 'left'
      ? helpers.leftRotate(current)
      : helpers.rightRotate(current);

    // The old pivot is now below the promoted node, so update it first.
    updateHeight(current);
    updateHeight(result);
    attach(parent, side, result);
    emit('rotation', depth, parent, {
      direction,
      pivotKey,
      newRootKey: result.key,
      transferredSubtreeKey,
      outerChildKey,
      rootBefore,
      rootAfter: result,
      balanceCase,
      isFinalRotation,
    });
    return result;
  }

  function insert(current, parent, side, depth) {
    emit('call-enter', depth, parent, { root: current });
    if (current === null) {
      const created = helpers.newNode(key);
      if (avl) created.height = 1;
      attach(parent, side, created);
      emit('insertion', depth, parent, { action: 'create', root: created });
      emit('call-return', depth, parent, { root: created, balanceCase: null, created: true });
      return created;
    }

    const comparison = key < current.key ? -1 : key > current.key ? 1 : 0;
    emit('compare', depth, parent, { root: current, comparison });
    if (comparison === 0) {
      emit('duplicate', depth, parent, { root: current });
    } else {
      const direction = comparison < 0 ? 'left' : 'right';
      emit('call-before', depth, parent, { direction, root: current });
      current[direction] = insert(current[direction], current, direction, depth + 1);
      emit('call-after', depth, parent, {
        direction, root: current, child: current[direction],
      });
    }

    let balanceCase = null;
    if (avl) {
      updateHeight(current);
      emit('height-update', depth, parent, { root: current });
      const balance = height(current.left) - height(current.right);
      balanceCase = 'Balanced';
      if (balance > 1) balanceCase = key < current.left.key ? 'LL' : 'LR';
      else if (balance < -1) balanceCase = key > current.right.key ? 'RR' : 'RL';
      emit('balance', depth, parent, { balance, balanceCase, root: current });

      if (balanceCase === 'LR' || balanceCase === 'RL') {
        const childSide = balanceCase === 'LR' ? 'left' : 'right';
        const firstDirection = balanceCase === 'LR' ? 'left' : 'right';
        current[childSide] = rotate(
          current[childSide], firstDirection, current, childSide,
          depth, balanceCase, false,
        );
        emit('rotation-link', depth, parent, {
          direction: childSide, root: current, child: current[childSide],
        });
      }
      if (balanceCase !== 'Balanced') {
        const direction = balanceCase === 'LL' || balanceCase === 'LR' ? 'right' : 'left';
        current = rotate(current, direction, parent, side, depth, balanceCase, true);
      }
    }

    emit('call-return', depth, parent, { root: current, balanceCase });
    return current;
  }

  return insert(root, null, null, 1);
}

/**
 * Search a nested BST (including an AVL tree) without changing its structure.
 * Returns the matching node or null. Event roots describe each original call's
 * subtree, while found describes the result propagated back to that caller.
 */
export function searchTree(root, key, { onEvent = null } = {}) {
  validateKey(key);
  const globalRootKey = root === null ? null : root.key;

  function emit(type, depth, parent, details) {
    if (!onEvent) return;
    onEvent(cloneValue({
      type,
      key,
      depth,
      operation: 'search',
      algorithm: 'bst',
      parentKey: parent === null ? null : parent.key,
      globalRootKey,
      ...details,
    }));
  }

  function search(current, parent, depth) {
    emit('call-enter', depth, parent, { root: current });
    if (current === null || current.key === key) {
      const found = current !== null;
      emit('search-result', depth, parent, { found, root: current });
      emit('call-return', depth, parent, { found, root: current, balanceCase: null });
      return current;
    }

    const comparison = key < current.key ? -1 : 1;
    const direction = comparison < 0 ? 'left' : 'right';
    emit('compare', depth, parent, { root: current, comparison });
    emit('call-before', depth, parent, { direction, root: current });
    const result = search(current[direction], current, depth + 1);
    emit('call-after', depth, parent, {
      direction, root: current, child: current[direction],
    });
    emit('call-return', depth, parent, {
      found: result !== null, root: current, balanceCase: null,
    });
    return result;
  }

  return search(root, null, 1);
}
