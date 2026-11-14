/* eslint-disable no-undef */
import { defaultHelpers, insertTree, searchTree } from './treeAlgorithms';

function build(keys, options = {}) {
  return keys.reduce((root, key) => insertTree(root, key, options), null);
}

function checkTree(root, expectedKeys, avl) {
  const keys = [];
  const seen = new Set();
  function visit(node) {
    if (node === null) return 0;
    expect(seen.has(node)).toBe(false);
    seen.add(node);
    const leftHeight = visit(node.left);
    keys.push(node.key);
    const rightHeight = visit(node.right);
    if (avl) {
      expect(node.height).toBe(1 + Math.max(leftHeight, rightHeight));
      expect(Math.abs(leftHeight - rightHeight)).toBeLessThanOrEqual(1);
    } else {
      expect(node).not.toHaveProperty('height');
    }
    return 1 + Math.max(leftHeight, rightHeight);
  }
  visit(root);
  expect(keys).toEqual([...new Set(expectedKeys)].sort((a, b) => a - b));
}

describe('pure tree algorithms', () => {
  it.each([
    ['LL', [3, 2, 1], ['right']],
    ['RR', [1, 2, 3], ['left']],
    ['LR', [3, 1, 2], ['left', 'right']],
    ['RL', [1, 3, 2], ['right', 'left']],
  ])('performs %s with primitive events and current heights', (balanceCase, keys, directions) => {
    const events = [];
    const root = build(keys, { avl: true, onEvent: event => events.push(event) });
    expect(root.key).toBe(2);
    checkTree(root, keys, true);
    const rotations = events.filter(event => event.type === 'rotation');
    expect(rotations.map(event => event.direction)).toEqual(directions);
    expect(rotations.every(event => event.balanceCase === balanceCase && event.depth === 1))
      .toBe(true);
    expect(rotations.map(event => event.isFinalRotation))
      .toEqual(directions.length === 1 ? [true] : [false, true]);
    expect(rotations[rotations.length - 1].globalRootKey).toBe(2);
    expect(rotations[rotations.length - 1].rootAfter.height).toBe(2);
    expect(events.filter(event => event.type === 'rotation-link'))
      .toHaveLength(directions.length - 1);
    if (directions.length === 2) {
      const firstIndex = events.indexOf(rotations[0]);
      expect(events[firstIndex + 1].type).toBe('rotation-link');
      expect(events[firstIndex + 1].child.key).toBe(2);
      expect(events[firstIndex + 2]).toBe(rotations[1]);
      expect(rotations[0].parentKey).toBe(keys[0]);
      expect(rotations[0].globalRootKey).toBe(keys[0]);
    }
  });

  it('keeps BST insertion unbalanced and does not add duplicate, zero or negative keys twice', () => {
    const events = [];
    const keys = [-2, -1, 0, 1, 2, 0, -2];
    const root = build(keys, { onEvent: event => events.push(event) });
    checkTree(root, keys, false);
    expect(root.key).toBe(-2);
    expect(root.right.right.key).toBe(0);
    expect(events.filter(event => event.type === 'rotation')).toEqual([]);
    expect(events.filter(event => event.type === 'height-update')).toEqual([]);
    expect(events.filter(event => event.type === 'duplicate')).toHaveLength(2);
    expect(events.filter(event => event.type === 'insertion')).toHaveLength(5);
  });

  it('emits complete nested call boundaries and detached snapshots before later mutations', () => {
    const events = [];
    const root = build([2, 1]);
    const result = insertTree(root, 0, { onEvent: event => events.push(event) });
    expect(events.map(event => [event.type, event.depth])).toEqual([
      ['call-enter', 1], ['compare', 1], ['call-before', 1],
      ['call-enter', 2], ['compare', 2], ['call-before', 2],
      ['call-enter', 3], ['insertion', 3], ['call-return', 3],
      ['call-after', 2], ['call-return', 2],
      ['call-after', 1], ['call-return', 1],
    ]);
    expect(events[0]).toMatchObject({
      key: 0, operation: 'insert', algorithm: 'bst', parentKey: null, globalRootKey: 2,
    });
    expect(events[6]).toMatchObject({ root: null, parentKey: 1 });
    expect(events[0].root.left.left).toBeNull();
    expect(events[9].child.key).toBe(0);
    const recorded = JSON.stringify(events);
    insertTree(result, -1);
    expect(JSON.stringify(events)).toBe(recorded);
    events[events.length - 1].root.left.key = 99;
    expect(result.left.key).toBe(1);
  });

  it('searches without mutation, preserving each caller subtree in return events', () => {
    const root = build([2, 0, -2, 4]);
    const before = JSON.stringify(root);
    const events = [];
    expect(searchTree(root, 0, { onEvent: event => events.push(event) })).toBe(root.left);
    expect(events.map(event => [event.type, event.depth])).toEqual([
      ['call-enter', 1], ['compare', 1], ['call-before', 1],
      ['call-enter', 2], ['search-result', 2], ['call-return', 2],
      ['call-after', 1], ['call-return', 1],
    ]);
    expect(events[events.length - 1]).toMatchObject({ found: true, root: { key: 2 } });
    expect(events[6].child.key).toBe(0);
    const missEvents = [];
    expect(searchTree(root, 1, { onEvent: event => missEvents.push(event) })).toBeNull();
    expect(missEvents.filter(event => event.type === 'search-result'))
      .toEqual([expect.objectContaining({ found: false, root: null, depth: 3 })]);
    expect(JSON.stringify(root)).toBe(before);
    expect(searchTree(null, 0)).toBeNull();
    const emptyEvents = [];
    searchTree(null, -1, { onEvent: event => emptyEvents.push(event) });
    expect(emptyEvents.map(event => event.type))
      .toEqual(['call-enter', 'search-result', 'call-return']);
  });

  it('uses structural helpers once per insertion and primitive rotation', () => {
    const helpers = Object.fromEntries(Object.entries(defaultHelpers)
      .map(([name, helper]) => [name, jest.fn(helper)]));
    const root = build([3, 1, 2, 2], { avl: true, helpers });
    checkTree(root, [1, 2, 3], true);
    expect(helpers.newNode).toHaveBeenCalledTimes(3);
    expect(helpers.leftRotate).toHaveBeenCalledTimes(1);
    expect(helpers.rightRotate).toHaveBeenCalledTimes(1);
    expect(() => insertTree(null, 0.5)).toThrow(TypeError);
    expect(() => searchTree(root, NaN)).toThrow(TypeError);
  });

  it('attaches an internal rotation before emitting it and preserves a zero-key transfer', () => {
    const root = build([10, 3, 20, -1, 4, 15, 25, -2, 0], { avl: true });
    const events = [];
    const result = insertTree(root, -3, { avl: true, onEvent: event => events.push(event) });
    const rotation = events.find(event => event.type === 'rotation');
    expect(rotation).toMatchObject({
      direction: 'right', depth: 2, parentKey: 10, globalRootKey: 10,
      pivotKey: 3, newRootKey: -1, transferredSubtreeKey: 0, outerChildKey: 4,
      rootBefore: { key: 3, left: { key: -1, right: { key: 0 } } },
      rootAfter: { key: -1, right: { key: 3, left: { key: 0 } } },
    });
    expect(events.filter(event => event.type === 'call-return' && event.created))
      .toEqual([expect.objectContaining({ root: { key: -3, left: null, right: null, height: 1 } })]);
    const callerReturn = events.find(event => event.type === 'call-after' && event.depth === 1);
    expect(callerReturn.root.left).toEqual(rotation.rootAfter);
    expect(callerReturn.child).toEqual(rotation.rootAfter);
    checkTree(result, [10, 3, 20, -1, 4, 15, 25, -2, 0, -3], true);
  });

  it('preserves invariants and search results across every order of five signed keys', () => {
    function permutations(values) {
      if (values.length === 0) return [[]];
      return values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index))
        .map(rest => [value, ...rest]));
    }
    for (const order of permutations([-2, -1, 0, 1, 2])) {
      for (const avl of [false, true]) {
        let root = null;
        const inserted = [];
        for (const key of [...order, 0, -2]) {
          root = insertTree(root, key, { avl });
          inserted.push(key);
          checkTree(root, inserted, avl);
        }
        for (const key of [-3, ...order, 3]) {
          expect(searchTree(root, key)?.key ?? null).toBe(order.includes(key) ? key : null);
        }
      }
    }
  });
});
