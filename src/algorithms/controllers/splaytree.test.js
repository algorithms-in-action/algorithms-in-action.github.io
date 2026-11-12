/* eslint-disable no-undef */

import SplayTree, { Node } from './splaytree';

function inOrder(root, keys = []) {
  if (root === null) return keys;

  inOrder(root.left, keys);
  keys.push(root.key);
  inOrder(root.right, keys);

  return keys;
}

function countNodes(root) {
  if (root === null) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

describe('SplayTree rotations', () => {
  it('performs a right rotation without losing the middle subtree', () => {
    const root = new Node(30);
    root.left = new Node(20);
    root.left.right = new Node(25);

    const result = SplayTree.rightRotate(root);

    expect(result).toEqual({
      key: 20,
      left: null,
      right: {
        key: 30,
        left: {
          key: 25,
          left: null,
          right: null,
        },
        right: null,
      },
    });
  });

  it('performs a left rotation without losing the middle subtree', () => {
    const root = new Node(20);
    root.right = new Node(30);
    root.right.left = new Node(25);

    const result = SplayTree.leftRotate(root);

    expect(result).toEqual({
      key: 30,
      left: {
        key: 20,
        left: null,
        right: {
          key: 25,
          left: null,
          right: null,
        },
      },
      right: null,
    });
  });
});

describe('SplayTree.splay', () => {
  it('handles the left-left case', () => {
    const root = new Node(100);
    root.left = new Node(50);
    root.left.left = new Node(25);

    const result = SplayTree.splay(root, 25);

    expect(result.key).toBe(25);
    expect(inOrder(result)).toEqual([25, 50, 100]);
  });

  it('handles the left-right case', () => {
    const root = new Node(100);
    root.left = new Node(50);
    root.left.right = new Node(75);

    const result = SplayTree.splay(root, 75);

    expect(result.key).toBe(75);
    expect(inOrder(result)).toEqual([50, 75, 100]);
  });

  it('handles the right-right case', () => {
    const root = new Node(25);
    root.right = new Node(50);
    root.right.right = new Node(100);

    const result = SplayTree.splay(root, 100);

    expect(result.key).toBe(100);
    expect(inOrder(result)).toEqual([25, 50, 100]);
  });

  it('handles the right-left case', () => {
    const root = new Node(25);
    root.right = new Node(100);
    root.right.left = new Node(75);

    const result = SplayTree.splay(root, 75);

    expect(result.key).toBe(75);
    expect(inOrder(result)).toEqual([25, 75, 100]);
  });

  it('uses one right rotation when the target is the left child', () => {
    const root = new Node(100);
    root.left = new Node(50);
    root.left.right = new Node(75);

    const result = SplayTree.splay(root, 50);

    expect(result.key).toBe(50);
    expect(inOrder(result)).toEqual([50, 75, 100]);
  });

  it('uses one left rotation when the target is the right child', () => {
    const root = new Node(25);
    root.right = new Node(75);
    root.right.left = new Node(50);

    const result = SplayTree.splay(root, 75);

    expect(result.key).toBe(75);
    expect(inOrder(result)).toEqual([25, 50, 75]);
  });

  it('returns null for an empty tree', () => {
    expect(SplayTree.splay(null, 10)).toBeNull();
  });

  it('splays the last visited node when searching beyond the maximum key', () => {
    const root = new Node(40);
    root.left = new Node(20);
    root.left.right = new Node(30);
    root.right = new Node(60);
    root.right.left = new Node(50);
    root.right.right = new Node(80);
    root.right.right.left = new Node(70);
    const originalKeys = inOrder(root);

    const result = SplayTree.search(root, 90);

    expect(result.key).toBe(80);
    expect(inOrder(result)).toEqual(originalKeys);
  });

  it('splays the last visited node when searching below the minimum key', () => {
    const root = new Node(40);
    root.left = new Node(20);
    root.left.left = new Node(10);
    root.right = new Node(60);
    const originalKeys = inOrder(root);

    const result = SplayTree.search(root, 5);

    expect(result.key).toBe(10);
    expect(inOrder(result)).toEqual(originalKeys);
  });
});

describe('SplayTree.insert', () => {
  it('inserts into an empty tree', () => {
    const result = SplayTree.insert(null, 10);

    expect(result).toEqual({
      key: 10,
      left: null,
      right: null,
    });
  });

  it('makes every newly inserted key the root and preserves BST order', () => {
    const input = [40, 20, 60, 10, 30, 50, 70, 25];
    let root = null;
    const inserted = [];

    input.forEach((key) => {
      root = SplayTree.insert(root, key);
      inserted.push(key);

      expect(root.key).toBe(key);
      expect(inOrder(root)).toEqual([...inserted].sort((a, b) => a - b));
    });
  });

  it('ignores a duplicate without creating another node', () => {
    const input = [40, 20, 60, 10, 30, 50, 70];
    let root = input.reduce((tree, key) => SplayTree.insert(tree, key), null);
    const nodeCount = countNodes(root);

    root = SplayTree.insert(root, 40);

    expect(root.key).toBe(40);
    expect(countNodes(root)).toBe(nodeCount);
    expect(inOrder(root)).toEqual([10, 20, 30, 40, 50, 60, 70]);
  });
});

describe('SplayTree.delete', () => {
  it('returns null when deleting from an empty tree', () => {
    expect(SplayTree.delete(null, 10)).toBeNull();
  });

  it('returns null when deleting the only node', () => {
    expect(SplayTree.delete(new Node(10), 10)).toBeNull();
  });

  it('keeps every key when the target is absent', () => {
    const root = new Node(40);
    root.left = new Node(20);
    root.right = new Node(60);

    const result = SplayTree.delete(root, 50);

    expect(result.key).toBe(60);
    expect(inOrder(result)).toEqual([20, 40, 60]);
  });

  it('returns the right subtree when the deleted root has no left child', () => {
    const root = new Node(10);
    root.right = new Node(20);

    const result = SplayTree.delete(root, 10);

    expect(result).toEqual({
      key: 20,
      left: null,
      right: null,
    });
  });

  it('deletes a non-root leaf after splaying it to the root', () => {
    const root = new Node(40);
    root.left = new Node(20);
    root.right = new Node(60);

    const result = SplayTree.delete(root, 20);

    expect(result.key).toBe(40);
    expect(result.left).toBeNull();
    expect(result.right.key).toBe(60);
    expect(inOrder(result)).toEqual([40, 60]);
  });

  it('deletes a root with a left subtree and no right subtree', () => {
    const root = new Node(50);
    root.left = new Node(30);
    root.left.left = new Node(20);
    root.left.right = new Node(40);

    const result = SplayTree.delete(root, 50);

    expect(result.key).toBe(40);
    expect(result.right).toBeNull();
    expect(inOrder(result)).toEqual([20, 30, 40]);
  });

  it('replaces a deleted root with the maximum of its left subtree', () => {
    const root = new Node(50);
    root.left = new Node(30);
    root.left.left = new Node(20);
    root.left.right = new Node(40);
    root.right = new Node(70);
    const events = [];

    const result = SplayTree.delete(
      root,
      50,
      event => events.push(event),
    );

    expect(result.key).toBe(40);
    expect(inOrder(result)).toEqual([20, 30, 40, 70]);
    expect(events.filter(event => event.type === 'rotation').map(event => event.direction)).toEqual(['left']);
  });
});

describe('SplayTree rotation events', () => {
  it('reports Left-Empty and Right-Empty when the target is a direct child', () => {
    const rightRoot = new Node(100);
    rightRoot.left = new Node(50);
    rightRoot.left.right = new Node(75);
    const rightEvents = [];

    SplayTree.splay(rightRoot, 50, event => rightEvents.push(event));

    expect(rightEvents).toEqual([{
      type: 'rotation',
      direction: 'right',
      bookmark: 'LE-rot1',
      splayCase: 'LE',
      parentKey: null,
      depth: 1,
      pivotKey: 100,
      newRootKey: 50,
      transferredSubtreeKey: 75,
    }]);

    const leftRoot = new Node(25);
    leftRoot.right = new Node(75);
    leftRoot.right.left = new Node(50);
    const leftEvents = [];

    SplayTree.splay(leftRoot, 75, event => leftEvents.push(event));

    expect(leftEvents).toEqual([{
      type: 'rotation',
      direction: 'left',
      bookmark: 'RE-rot1',
      splayCase: 'RE',
      parentKey: null,
      depth: 1,
      pivotKey: 25,
      newRootKey: 75,
      transferredSubtreeKey: 50,
    }]);
  });

  it.each([
    ['left-left', 100, 'left', 50, 'right', 75, 25, 'LE', 'right'],
    ['left-right', 100, 'left', 50, 'left', 25, 75, 'LE', 'right'],
    ['right-right', 50, 'right', 100, 'left', 75, 125, 'RE', 'left'],
    ['right-left', 50, 'right', 100, 'right', 125, 75, 'RE', 'left'],
  ])(
    'reports a single Empty case when the searched %s grandchild is missing',
    (
      missingPath, rootKey, childSide, childKey, otherSide, otherKey,
      target, splayCase, direction,
    ) => {
      const root = new Node(rootKey);
      root[childSide] = new Node(childKey);
      root[childSide][otherSide] = new Node(otherKey);
      const originalKeys = inOrder(root);
      const events = [];

      const result = SplayTree.search(root, target, event => events.push(event));

      expect(result.key).toBe(childKey);
      expect(inOrder(result)).toEqual(originalKeys);
      expect(countNodes(result)).toBe(3);
      expect(events).toEqual([{
        type: 'rotation',
        direction,
        bookmark: `${splayCase}-rot1`,
        splayCase,
        parentKey: null,
        depth: 1,
        pivotKey: rootKey,
        newRootKey: childKey,
        transferredSubtreeKey: childSide === otherSide ? null : otherKey,
      }]);
    },
  );

  it.each([
    ['an empty tree', () => null, 50],
    ['a root hit', () => {
      const root = new Node(50);
      root.left = new Node(25);
      root.right = new Node(75);
      return root;
    }, 50],
    ['a missing left child', () => {
      const root = new Node(50);
      root.right = new Node(75);
      return root;
    }, 25],
    ['a missing right child', () => {
      const root = new Node(50);
      root.left = new Node(25);
      return root;
    }, 75],
  ])('does not report rotations for %s', (description, createRoot, target) => {
    const root = createRoot();
    const originalKeys = inOrder(root);
    const events = [];

    const result = SplayTree.search(root, target, event => events.push(event));

    expect(result).toBe(root);
    expect(inOrder(result)).toEqual(originalKeys);
    expect(events).toEqual([]);
  });

  it('reports both rotations in left-left and right-right cases', () => {
    const leftLeftRoot = new Node(100);
    leftLeftRoot.left = new Node(50);
    leftLeftRoot.left.left = new Node(25);
    const leftLeftEvents = [];

    SplayTree.splay(
      leftLeftRoot,
      25,
      event => leftLeftEvents.push(event),
    );

    expect(leftLeftEvents.map(event => ({
      direction: event.direction,
      bookmark: event.bookmark,
      splayCase: event.splayCase,
      parentKey: event.parentKey,
      depth: event.depth,
      pivotKey: event.pivotKey,
      newRootKey: event.newRootKey,
    }))).toEqual([
      {
        direction: 'right',
        bookmark: 'LL-rot1',
        splayCase: 'LL',
        parentKey: null,
        depth: 1,
        pivotKey: 100,
        newRootKey: 50,
      },
      {
        direction: 'right',
        bookmark: 'LL-rot2',
        splayCase: 'LL',
        parentKey: null,
        depth: 1,
        pivotKey: 50,
        newRootKey: 25,
      },
    ]);

    const rightRightRoot = new Node(25);
    rightRightRoot.right = new Node(50);
    rightRightRoot.right.right = new Node(100);
    const rightRightEvents = [];

    SplayTree.splay(
      rightRightRoot,
      100,
      event => rightRightEvents.push(event),
    );

    expect(rightRightEvents.map(event => ({
      direction: event.direction,
      bookmark: event.bookmark,
      splayCase: event.splayCase,
      parentKey: event.parentKey,
      depth: event.depth,
      pivotKey: event.pivotKey,
      newRootKey: event.newRootKey,
    }))).toEqual([
      {
        direction: 'left',
        bookmark: 'RR-rot1',
        splayCase: 'RR',
        parentKey: null,
        depth: 1,
        pivotKey: 25,
        newRootKey: 50,
      },
      {
        direction: 'left',
        bookmark: 'RR-rot2',
        splayCase: 'RR',
        parentKey: null,
        depth: 1,
        pivotKey: 50,
        newRootKey: 100,
      },
    ]);
  });

  it('reports both rotations in left-right and right-left cases', () => {
    const leftRightRoot = new Node(100);
    leftRightRoot.left = new Node(50);
    leftRightRoot.left.right = new Node(75);
    const leftRightEvents = [];

    SplayTree.splay(
      leftRightRoot,
      75,
      event => leftRightEvents.push(event),
    );

    expect(leftRightEvents.map(event => ({
      direction: event.direction,
      bookmark: event.bookmark,
      splayCase: event.splayCase,
      parentKey: event.parentKey,
      depth: event.depth,
      pivotKey: event.pivotKey,
      newRootKey: event.newRootKey,
    }))).toEqual([
      {
        direction: 'left',
        bookmark: 'LR-rot1',
        splayCase: 'LR',
        parentKey: 100,
        depth: 1,
        pivotKey: 50,
        newRootKey: 75,
      },
      {
        direction: 'right',
        bookmark: 'LR-rot2',
        splayCase: 'LR',
        parentKey: null,
        depth: 1,
        pivotKey: 100,
        newRootKey: 75,
      },
    ]);

    const rightLeftRoot = new Node(25);
    rightLeftRoot.right = new Node(100);
    rightLeftRoot.right.left = new Node(75);
    const rightLeftEvents = [];

    SplayTree.splay(
      rightLeftRoot,
      75,
      event => rightLeftEvents.push(event),
    );

    expect(rightLeftEvents.map(event => ({
      direction: event.direction,
      bookmark: event.bookmark,
      splayCase: event.splayCase,
      parentKey: event.parentKey,
      depth: event.depth,
      pivotKey: event.pivotKey,
      newRootKey: event.newRootKey,
    }))).toEqual([
      {
        direction: 'right',
        bookmark: 'RL-rot1',
        splayCase: 'RL',
        parentKey: 25,
        depth: 1,
        pivotKey: 100,
        newRootKey: 75,
      },
      {
        direction: 'left',
        bookmark: 'RL-rot2',
        splayCase: 'RL',
        parentKey: null,
        depth: 1,
        pivotKey: 25,
        newRootKey: 75,
      },
    ]);
  });

  it('records the parent of a rotation inside a recursive subtree', () => {
    const root = new Node(100);
    root.left = new Node(50);
    root.left.left = new Node(25);
    root.left.left.left = new Node(10);
    const events = [];

    const result = SplayTree.splay(root, 10, event => events.push(event));

    expect(result.key).toBe(10);
    expect(inOrder(result)).toEqual([10, 25, 50, 100]);
    expect(events[0]).toMatchObject({
      direction: 'right',
      bookmark: 'LE-rot1',
      splayCase: 'LE',
      depth: 2,
      parentKey: 50,
      pivotKey: 25,
      newRootKey: 10,
    });
  });
});

describe('SplayTree insertion branch events', () => {
  it('reports empty-tree, left, and right insertion decisions', () => {
    const emptyEvents = [];
    SplayTree.insert(null, 40, event => emptyEvents.push(event));

    expect(emptyEvents).toEqual([{
      type: 'insertion',
      action: 'empty-tree',
      bookmark: 'Main',
      key: 40,
      rootKey: null,
    }]);

    const leftEvents = [];
    SplayTree.insert(
      new Node(40),
      20,
      event => leftEvents.push(event),
    );

    expect(leftEvents).toEqual([{
      type: 'insertion',
      action: 'insert-left',
      bookmark: 'Main',
      key: 20,
      rootKey: 40,
    }]);

    const rightEvents = [];
    SplayTree.insert(
      new Node(40),
      60,
      event => rightEvents.push(event),
    );

    expect(rightEvents).toEqual([{
      type: 'insertion',
      action: 'insert-right',
      bookmark: 'Main',
      key: 60,
      rootKey: 40,
    }]);
  });

  it('reports a duplicate after any rotations used to access it', () => {
    const root = new Node(20);
    root.right = new Node(40);
    const events = [];

    const result = SplayTree.insert(
      root,
      40,
      event => events.push(event),
    );

    expect(result.key).toBe(40);
    expect(events.map(event => ({
      type: event.type,
      action: event.action,
      direction: event.direction,
      bookmark: event.bookmark,
    }))).toEqual([
      {
        type: 'rotation',
        action: undefined,
        direction: 'left',
        bookmark: 'RE-rot1',
      },
      {
        type: 'insertion',
        action: 'duplicate',
        direction: undefined,
        bookmark: 'Main',
      },
    ]);
  });
});

describe('SplayTree call observer', () => {
  it.each([
    ['LL/LR', [1, 3, 4, 5, 2, 6], 3, ['LL', 'LR', 'E'], [[6, 5, 4], [4, 2, 3], [3]], [null, 5, 2]],
    ['RR/RL', [6, 4, 3, 2, 5, 1], 4, ['RR', 'RL', 'E'], [[1, 2, 3], [3, 5, 4], [4]], [null, 2, 5]],
  ])('traces nested %s calls without changing existing events', (_, keys, target, cases, paths, parents) => {
    const build = () => keys.reduce((root, key) => SplayTree.insert(root, key), null);
    const originalEvents = [];
    const expected = SplayTree.search(build(), target, event => originalEvents.push(event));
    const events = [];
    const calls = [];
    const result = SplayTree.search(
      build(), target, event => events.push(event), call => calls.push(call),
    );
    expect(result).toEqual(expected);
    expect(events).toEqual(originalEvents);
    expect(calls.map(call => [call.type, call.depth, call.splayCase])).toEqual([
      ...cases.map((splayCase, index) => ['call-enter', index + 1, splayCase]),
      ...[...cases].reverse().map((splayCase, index) => ['call-return', 3 - index, splayCase]),
    ]);
    const entries = calls.filter(call => call.type === 'call-enter');
    expect(entries.map(call => call.pathKeys)).toEqual(paths);
    expect(entries.map(call => call.parentKey)).toEqual(parents);
    expect(entries.every(call => call.nodeKeys.includes(target))).toBe(true);
    expect(calls.every(call => call.algorithm === 'splay'
      && call.operation === 'search' && call.key === target)).toBe(true);
    expect(calls.filter(call => call.type === 'call-return').map(call => call.rootKey))
      .toEqual([target, target, target]);
  });

  it.each([
    ['LE', 30, 'left', 10],
    ['RE', 10, 'right', 30],
  ])('records a missing-grandchild %s call at the supplied depth', (splayCase, rootKey, side, childKey) => {
    const root = new Node(rootKey);
    root[side] = new Node(childKey);
    const calls = [];
    const events = [];
    const result = SplayTree.splay(root, 20, event => events.push(event), 99, 4, call => calls.push(call));
    expect(calls).toEqual([
      {
        type: 'call-enter', algorithm: 'splay', operation: 'splay', key: 20,
        depth: 4, parentKey: 99, rootKey, splayCase,
        nodeKeys: [rootKey, childKey], pathKeys: [rootKey, childKey],
      },
      {
        type: 'call-return', algorithm: 'splay', operation: 'splay', key: 20,
        depth: 4, parentKey: 99, rootKey: childKey, splayCase,
      },
    ]);
    expect(result.key).toBe(childKey);
    expect(events).toHaveLength(1);
    expect(events[0].bookmark).toBe(`${splayCase}-rot1`);
  });

  it('distinguishes empty search, empty insertion and duplicate insertion calls', () => {
    const searchCalls = [];
    const searchEvents = [];
    expect(SplayTree.search(null, 0, event => searchEvents.push(event), call => searchCalls.push(call)))
      .toBeNull();
    expect(searchEvents).toEqual([]);
    expect(searchCalls).toEqual([
      {
        type: 'call-enter', algorithm: 'splay', operation: 'search', key: 0,
        depth: 1, parentKey: null, rootKey: null, splayCase: 'E', nodeKeys: [], pathKeys: [],
      },
      {
        type: 'call-return', algorithm: 'splay', operation: 'search', key: 0,
        depth: 1, parentKey: null, rootKey: null, splayCase: 'E',
      },
    ]);
    const insertCalls = [];
    const insertEvents = [];
    const root = SplayTree.insert(null, 0, event => insertEvents.push(event), call => insertCalls.push(call));
    expect(insertCalls).toEqual([]);
    expect(SplayTree.insert(root, 0, event => insertEvents.push(event), call => insertCalls.push(call)))
      .toBe(root);
    expect(insertCalls.map(call => [call.type, call.operation, call.splayCase]))
      .toEqual([['call-enter', 'insert', 'E'], ['call-return', 'insert', 'E']]);
    expect(insertCalls[0].pathKeys).toEqual([0]);
    expect(insertEvents.map(event => event.action)).toEqual(['empty-tree', 'duplicate']);
  });

  it('captures zero-key paths and detached subtree arrays before rotations', () => {
    const root = new Node(4);
    root.left = new Node(0);
    root.left.left = new Node(-2);
    root.left.right = new Node(2);
    const calls = [];
    const result = SplayTree.splay(root, 2, null, null, 1, call => calls.push(call));
    expect(calls[0].nodeKeys).toEqual([4, 0, -2, 2]);
    expect(calls[0].pathKeys).toEqual([4, 0, 2]);
    expect(calls.filter(call => call.type === 'call-enter')
      .every(call => call.pathKeys.length <= 3)).toBe(true);
    const recorded = JSON.stringify(calls);
    SplayTree.insert(result, -3);
    expect(JSON.stringify(calls)).toBe(recorded);
    expect(calls[0]).not.toHaveProperty('root');
  });
});

describe('SplayTree deletion branch events', () => {
  it('returns null and reports empty-tree when deleting from an empty tree', () => {
    const events = [];
    const result = SplayTree.delete(null, 50, event => events.push(event));

    expect(result).toBeNull();
    expect(events).toEqual([{
      type: 'deletion',
      action: 'empty-tree',
      bookmark: 'Del',
      key: 50,
      rootKey: null,
    }]);
  });

  it('splays closest key to root and reports not-found when key does not exist', () => {
    let root = SplayTree.insert(null, 20);
    root = SplayTree.insert(root, 40);
    const events = [];
    const result = SplayTree.delete(root, 30, event => events.push(event));

    expect(result.key).not.toBe(30);
    expect(inOrder(result)).toEqual([20, 40]);

    const deletionEvent = events.find(event => event.type === 'deletion');
    expect(deletionEvent).toEqual({
      type: 'deletion',
      action: 'not-found',
      bookmark: 'Del',
      key: 30,
      rootKey: result.key,
    });
  });

  it('promotes right child and reports left-empty when deleting a root with no left child', () => {
    const root = new Node(20);
    root.right = new Node(30);
    const events = [];
    const result = SplayTree.delete(root, 20, event => events.push(event));

    expect(result.key).toBe(30);
    expect(result.left).toBeNull();
    expect(inOrder(result)).toEqual([30]);

    expect(events).toEqual([{
      type: 'deletion',
      action: 'left-empty',
      bookmark: 'Del',
      key: 20,
      rootKey: 20,
    }]);
  });

  it('removes single node when deleting only node in the tree', () => {
    const root = new Node(10);
    const events = [];
    const result = SplayTree.delete(root, 10, event => events.push(event));

    expect(result).toBeNull();
    expect(events).toEqual([{
      type: 'deletion',
      action: 'left-empty',
      bookmark: 'Del',
      key: 10,
      rootKey: 10,
    }]);
  });

  it('splays, detaches right subtree, splays left subtree to max, and reattaches right subtree', () => {
    const root = new Node(50);
    root.left = new Node(30);
    root.left.left = new Node(20);
    root.left.right = new Node(40);
    root.right = new Node(70);
    root.right.left = new Node(60);
    root.right.right = new Node(80);
    // Tree for reference:
    //         50
    //       /    \
    //      30     70
    //     /  \   /  \
    //    20  40 60  80

    const events = [];
    const result = SplayTree.delete(root, 50, event => events.push(event));

    expect(result.key).toBe(40);
    expect(inOrder(result)).toEqual([20, 30, 40, 60, 70, 80]);
    expect(countNodes(result)).toBe(6);

    const deletionEvent = events.filter(event => event.type === 'deletion');
    expect(deletionEvent).toEqual([{
      type: 'deletion',
      action: 'detach-right',
      bookmark: 'Del',
      key: 50,
      rootKey: 50,
      rightSubtreeKey: 70,
    },
    {
      type: 'deletion',
      action: 'reattach-right',
      bookmark: 'Del',
      key: 50,
      rootKey: 40,
      rightSubtreeKey: 70,
    },]);

  });

  it('splays target from deep in tree to root before deleting',() => {
    let root = SplayTree.insert(null, 10);
    root = SplayTree.insert(root, 20);
    root = SplayTree.insert(root, 30);
    const events = [];
    const result = SplayTree.delete(root, 10, event => events.push(event));

    expect(inOrder(result)).toEqual([20, 30]);
    expect(countNodes(result)).toBe(2);

    const rotationEvents = events.filter(event => event.type === 'rotation');
    expect(rotationEvents).toHaveLength(2);
  });


  it('preserves BST invariant across sequential and random deletions', () => {
    const keys = [50, 20, 80, 10, 30, 70, 90, 25, 35, 65, 75, 85, 95];
    let root = null;
    keys.forEach((key) => {
      root = SplayTree.insert(root, key);
    });

    expect(inOrder(root)).toEqual([...keys].sort((a, b) => a - b));
    expect(countNodes(root)).toBe(keys.length);

    const toDelete = [20, 90, 50, 35, 80];
    let remaining = [...keys];

    toDelete.forEach(k => {
      root = SplayTree.delete(root, k);
      remaining = remaining.filter(x => x !== k)

      const currentInOrder = inOrder(root);

      expect(currentInOrder).toEqual([...remaining].sort((a, b) => a - b));
      expect(countNodes(root)).toBe(remaining.length);

      function verifyBST(node){
        if(!node) return;
        if(node.left) {
          expect(node.left.key).toBeLessThan(node.key);
          verifyBST(node.left);
        }
        if(node.right){
          expect(node.right.key).toBeGreaterThan(node.key);
          verifyBST(node.right);
        }
      }
      verifyBST(root);
    });
    [...remaining].forEach(k => {root = SplayTree.delete(root, k)});
    expect(root).toBeNull();
  });

});
