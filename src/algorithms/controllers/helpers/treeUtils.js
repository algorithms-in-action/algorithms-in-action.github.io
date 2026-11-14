/**
 * Structural helpers for rooted binary trees with unique numeric keys.
 * No controller state, visualisation, algorithm events, or AVL height rules.
 * Inputs must be acyclic trees. Null/undefined children both mean empty;
 * constructed nodes always use null. Key 0 is a valid node key.
 */
export class TreeNode {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

/** Visit root, left, then right. The callback receives (node, parent). */
export function traversePreOrder(root, visit) {
  const pending = [[root, null]];
  while (pending.length > 0) {
    const [node, parent] = pending.pop();
    if (node) {
      visit(node, parent);
      pending.push([node.right, node], [node.left, node]);
    }
  }
}

export function collectSubtreeKeys(root) {
  const keys = [];
  traversePreOrder(root, node => keys.push(node.key));
  return keys;
}

/**
 * Read GraphTracer's key-to-children mapping without mutating it.
 * Missing entries describe leaves, as do empty entries. The optional factory
 * owns algorithm-specific metadata (for example AVL's initial height).
 */
export function fromFlatTree(rootKey, flatTree, createNode = key => new TreeNode(key)) {
  if (rootKey === null || rootKey === undefined) return null;
  const node = createNode(rootKey);
  const entry = flatTree[rootKey] || {};
  node.left = fromFlatTree(entry.left, flatTree, createNode);
  node.right = fromFlatTree(entry.right, flatTree, createNode);
  return node;
}

/** Produce GraphTracer's mapping, including leaves and omitting absent links. */
export function toFlatTree(root) {
  const tree = {};
  traversePreOrder(root, node => {
    const entry = {};
    if (node.left) entry.left = node.left.key;
    if (node.right) entry.right = node.right.key;
    tree[node.key] = entry;
  });
  return tree;
}

/**
 * Capture keys only, so later pointer changes cannot alter playback data.
 * Node order is preorder; each node's left edge precedes its right edge.
 */
export function createTreeSnapshot(root) {
  const nodeKeys = [];
  const edges = [];
  traversePreOrder(root, node => {
    nodeKeys.push(node.key);
    if (node.left) edges.push([node.key, node.left.key]);
    if (node.right) edges.push([node.key, node.right.key]);
  });
  return { nodeKeys, edges, rootKey: root ? root.key : null };
}

/** BST access path, including the last visited node when the key is absent. */
export function getTreePath(root, key) {
  const path = [];
  let current = root;
  while (current) {
    path.push(current.key);
    if (current.key === key) break;
    current = key < current.key ? current.left : current.right;
  }
  return path;
}

/**
 * Mutate links and return the new subtree root; a right child is required.
 * Callers reconnect the parent/global root and update algorithm metadata.
 */
export function rotateLeft(root) {
  if (!root || !root.right) {
    throw new TypeError('rotateLeft requires a root with a right child');
  }
  const newRoot = root.right;
  root.right = newRoot.left || null;
  newRoot.left = root;
  return newRoot;
}

/** Same contract as rotateLeft, requiring a left child. */
export function rotateRight(root) {
  if (!root || !root.left) {
    throw new TypeError('rotateRight requires a root with a left child');
  }
  const newRoot = root.left;
  root.left = newRoot.right || null;
  newRoot.right = root;
  return newRoot;
}
