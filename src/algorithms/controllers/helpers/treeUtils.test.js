/* eslint-disable no-undef */
import {
  TreeNode, traversePreOrder, collectSubtreeKeys, fromFlatTree, toFlatTree,
  createTreeSnapshot, getTreePath, rotateLeft, rotateRight,
} from './treeUtils';

describe('tree representation and traversal', () => {
  const flat = {
    5: { left: 0, right: 9 },
    0: { left: -2, right: 3 },
    '-2': {},
    3: {},
    9: {},
  };

  it('round trips keys, children, and leaves without mutating either tree', () => {
    const input = JSON.parse(JSON.stringify(flat));
    const root = fromFlatTree(5, input);
    expect(root).toBeInstanceOf(TreeNode);
    expect(root.left.key).toBe(0);
    expect(root.left.left.left).toBeNull();
    expect(toFlatTree(root)).toEqual(flat);
    expect(input).toEqual(flat);
    const output = toFlatTree(root);
    output[0].left = 99;
    expect(root.left.left.key).toBe(-2);
  });

  it('supports zero as the root and as either child', () => {
    expect(toFlatTree(fromFlatTree(0, { 0: {} }))).toEqual({ 0: {} });
    expect(fromFlatTree(-1, { '-1': { right: 0 }, 0: {} }).right.key).toBe(0);
  });

  it('normalizes omitted, null, and undefined children and absent leaf entries', () => {
    const root = fromFlatTree(5, {
      5: { left: 0, right: 9 },
      0: { left: undefined, right: null },
    });
    expect(root.left).toEqual(new TreeNode(0));
    expect(root.right).toEqual(new TreeNode(9));
    expect(toFlatTree(root)).toEqual({ 5: { left: 0, right: 9 }, 0: {}, 9: {} });
  });

  it('lets the caller initialize algorithm metadata on every node', () => {
    const factory = jest.fn(key => ({ key, height: 1 }));
    const root = fromFlatTree(5, flat, factory);
    expect(factory.mock.calls.map(([key]) => key)).toEqual([5, 0, -2, 3, 9]);
    traversePreOrder(root, node => expect(node.height).toBe(1));
    expect(root.left.left.left).toBeNull();
  });

  it('visits nodes and parents in preorder without changing links', () => {
    const root = fromFlatTree(5, flat);
    const visits = [];
    traversePreOrder(root, (node, parent) => visits.push([node.key, parent ? parent.key : null]));
    expect(visits).toEqual([[5, null], [0, 5], [-2, 0], [3, 0], [9, 5]]);
    expect(collectSubtreeKeys(root)).toEqual([5, 0, -2, 3, 9]);
    expect(toFlatTree(root)).toEqual(flat);
  });

  it.each([null, undefined])('handles an empty tree (%s)', empty => {
    const factory = jest.fn();
    expect(fromFlatTree(empty, {}, factory)).toBeNull();
    expect(factory).not.toHaveBeenCalled();
    expect(toFlatTree(empty)).toEqual({});
    expect(collectSubtreeKeys(empty)).toEqual([]);
    expect(getTreePath(empty, 0)).toEqual([]);
    expect(createTreeSnapshot(empty)).toEqual({ nodeKeys: [], edges: [], rootKey: null });
  });

  it('finds a BST path or stops at the last node on a miss', () => {
    const root = fromFlatTree(5, flat);
    expect(getTreePath(root, 0)).toEqual([5, 0]);
    expect(getTreePath(root, 3)).toEqual([5, 0, 3]);
    expect(getTreePath(root, 2)).toEqual([5, 0, 3]);
    expect(getTreePath({ key: 0 }, 1)).toEqual([0]);
  });

  it('captures independent snapshots with the existing edge ordering', () => {
    const root = fromFlatTree(5, flat);
    const snapshot = createTreeSnapshot(root);
    const second = createTreeSnapshot(root);
    rotateRight(root);
    root.key = 100;
    expect(snapshot).toEqual({
      nodeKeys: [5, 0, -2, 3, 9],
      edges: [[5, 0], [5, 9], [0, -2], [0, 3]],
      rootKey: 5,
    });
    snapshot.edges[0][0] = 99;
    snapshot.nodeKeys.push(99);
    expect(second.edges[0]).toEqual([5, 0]);
    expect(second.nodeKeys).toEqual([5, 0, -2, 3, 9]);
  });

  it('snapshots a singleton with zero as its key', () => {
    expect(createTreeSnapshot(new TreeNode(0))).toEqual({ nodeKeys: [0], edges: [], rootKey: 0 });
  });
});

describe.each([
  ['right', rotateRight, rotateLeft, 30, 20, 25, 'left', 'right'],
  ['left', rotateLeft, rotateRight, 20, 30, 25, 'right', 'left'],
])('%s structural rotation', (name, rotate, undo, pivotKey, childKey, middleKey, childSide, transferSide) => {
  it('preserves the middle subtree, node identities, ordering, and metadata', () => {
    const pivot = Object.assign(new TreeNode(pivotKey), { height: 7 });
    const child = Object.assign(new TreeNode(childKey), { height: 4 });
    const middle = new TreeNode(middleKey);
    const outer = new TreeNode(name === 'right' ? 10 : 40);
    child[childSide] = outer;
    child[transferSide] = middle;
    pivot[childSide] = child;
    const before = toFlatTree(pivot);
    const newRoot = rotate(pivot);
    expect(newRoot).toBe(child);
    expect(child[transferSide]).toBe(pivot);
    expect(pivot[childSide]).toBe(middle);
    expect(child[childSide]).toBe(outer);
    expect(pivot.height).toBe(7);
    expect(child.height).toBe(4);
    const inorder = node => (node ? [...inorder(node.left), node.key, ...inorder(node.right)] : []);
    expect(inorder(newRoot)).toEqual(Object.keys(before).map(Number).sort((a, b) => a - b));
    expect(undo(newRoot)).toBe(pivot);
    expect(toFlatTree(pivot)).toEqual(before);
  });

  it('normalizes a missing transferred subtree to null', () => {
    const pivot = new TreeNode(pivotKey);
    pivot[childSide] = { key: 0 };
    const newRoot = rotate(pivot);
    expect(newRoot.key).toBe(0);
    expect(pivot[childSide]).toBeNull();
  });

  it('rejects a missing pivot or required child without changing the tree', () => {
    expect(() => rotate(null)).toThrow(TypeError);
    expect(() => rotate(undefined)).toThrow(TypeError);
    const leaf = new TreeNode(0);
    expect(() => rotate(leaf)).toThrow(TypeError);
    expect(leaf).toEqual(new TreeNode(0));
  });
});
