/* eslint-disable no-undef */

import SplayTreeInsertion from './splaytreeInsertion';
import SplayTree from './splaytree';
import { parseTreeInput } from '../parameters/helpers/treeInput';
import { BSTColors as colors } from './BSTColors';
import { initGlobalAlgorithmGetter } from './collapseChunkPlugin';
import { initGlobalAlgotithmGetter } from './transitiveClosureCollapseChunkPlugin';
import { GlobalActions } from '../../context/actions';
import splayPseudocode from '../pseudocode/splaytree';
import {
  addSplayRotationChunks,
  getSplayRecursionFrames,
} from './InsertionSharedCode';

// Keep the real playback actions and Splay modules without loading unrelated UI.
jest.mock('../index', () => ({
  __esModule: true,
  default: {
    splaytree: {
      name: 'Splay Tree',
      controller: { operations: require('./splaytreeInsertion').default },
      pseudocode: { operations: require('../pseudocode/splaytree').default },
    },
  },
}));

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

function createChunker(chunks = []) {
  return {
    add(bookmark, callback, args, recursionLevel = 0) {
      chunks.push({ bookmark: String(bookmark), callback, args, recursionLevel });
    },
  };
}

function makeNode(key, left = null, right = null) {
  return { key, left, right };
}

function cloneTree(root) {
  if (root === null) return null;
  return makeNode(root.key, cloneTree(root.left), cloneTree(root.right));
}

function flattenTree(root, tree = {}) {
  if (root === null) return tree;

  tree[root.key] = {};
  if (root.left !== null) tree[root.key].left = root.left.key;
  if (root.right !== null) tree[root.key].right = root.right.key;
  flattenTree(root.left, tree);
  flattenTree(root.right, tree);
  return tree;
}

function renderTree(graph, root) {
  if (root === null) return;

  graph.addNode(root.key, root.key);
  if (root.left !== null) {
    renderTree(graph, root.left);
    graph.addEdge(root.key, root.left.key);
  }
  if (root.right !== null) {
    renderTree(graph, root.right);
    graph.addEdge(root.key, root.right.key);
  }
  graph.layoutBST(root.key, true);
}

function getInsertionReturns(chunks) {
  return chunks.filter(
    chunk => ['insert-return-empty', 'insert-return'].includes(chunk.bookmark)
      && chunk.args
      && chunk.args[2]
      && chunk.args[2].type === 'insertion',
  );
}

function getInsertionBranchChunks(chunks) {
  return chunks.filter(
    chunk => [
      'insert-test-empty', 'insert-test-left', 'insert-test-right', 'insert-duplicate',
    ].includes(chunk.bookmark)
      && chunk.args
      && chunk.args[0]
      && chunk.args[0].type === 'insertion',
  );
}

describe('SplayTreeInsertion controller', () => {
  afterEach(() => {
    initGlobalAlgorithmGetter(() => null);
    initGlobalAlgotithmGetter(() => null, () => {});
  });

  describe('switch path highlighting', () => {
    it.each([
        ['empty search', [], 'search', 10, [[]]],
        ['target at root', [10], 'search', 10, [[]]],
        ['target at child', [10, 20], 'search', 10, [[[20, 10]]]],
        ['two edges together', [10, 20, 30], 'search', 10, [[[30, 20], [20, 10]], []]],
        ['nested left calls', [10, 20, 30, 40, 50], 'search', 10, [[[50, 40], [40, 30]], [[30, 20], [20, 10]], []]],
        ['nested right calls', [50, 40, 30, 20, 10], 'search', 50, [[[10, 20], [20, 30]], [[30, 40], [40, 50]], []]],
        ['missing target', [10, 20, 30], 'search', 5, [[[30, 20], [20, 10]], []]],
        ['insertion path', [10, 20, 30], 'insert', 5, [[[30, 20], [20, 10]], []]],
    ])('%s', (name, initialKeys, type, key, expectedSteps) => {
        const chunks = [];
        const graph = SplayTreeInsertion.initVisualisers({ visualiser: {} }).graph.instance;

        const operations = initialKeys.map(value => ({ type: 'insert', value }));
        operations.push({ type, value: key });

        SplayTreeInsertion.run(createChunker(chunks), { operations });

        const label = `${type === 'search' ? 'Search' : 'Insert'}: ${key}`;
        const actualSteps = [];
        const normalize = edges => edges.map(edge => edge.join('->')).sort();

        chunks.forEach(({ bookmark, callback, args = [] }) => {
            if (callback) { callback({ graph }, ...args); }

            // Record only the final operation's switch steps.
            if (bookmark === 'switchPath' && graph.functionName === label) {
                const highlightedEdges = graph.edges
                    .filter(edge => edge.color === colors.PATH_E)
                    .map(edge => [edge.source, edge.target]);

                expect(highlightedEdges.length).toBeLessThanOrEqual(2);
                actualSteps.push(normalize(highlightedEdges));
            }
        });

        expect(actualSteps).toEqual(expectedSteps.map(normalize));
    });
  });

  it('handles an empty input without registering animation chunks', () => {
    const chunks = [];

    const root = SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [] },
    );

    expect(root).toBeUndefined();
    expect(chunks).toEqual([]);
  });

  it('builds the final Splay tree through the shared insertion controller', () => {
    const input = [40, 20, 60, 10, 30, 50, 70, 25];

    const root = SplayTreeInsertion.run(createChunker(), { nodes: input });

    expect(root.key).toBe(25);
    expect(inOrder(root)).toEqual([10, 20, 25, 30, 40, 50, 60, 70]);
  });

  it('ignores duplicate values', () => {
    const chunks = [];
    const root = SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [40, 20, 60, 40] },
    );

    expect(root.key).toBe(40);
    expect(countNodes(root)).toBe(3);
    expect(inOrder(root)).toEqual([20, 40, 60]);
    expect(getInsertionBranchChunks(chunks).pop().args[0]).toMatchObject({
      action: 'duplicate',
      key: 40,
      rootKey: 40,
    });
  });

  it('registers insertion stages followed by an independent return for each insertion', () => {
    const chunks = [];

    SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [40, 20, 60] },
    );

    expect(chunks.map(chunk => chunk.bookmark)).toEqual([
      'Main',
      'insert-test-empty',
      'insert-return-empty',
      'Main',
      'pre-insert-splay',
      'splay-enter',
      'switchPath',
      'case-empty',
      'E-return',
      'DoneSplay',
      'insert-splay-call',
      'insert-test-left',
      'insert-left-save',
      'insert-left-detach',
      'insert-left-create',
      'insert-return',
      'Main',
      'pre-insert-splay',
      'splay-enter',
      'switchPath',
      'right-empty',
      'RE-rot1',
      'leftRotate(t2)',
      't6 = right(t2)',
      't4 = left(t6)',
      't6.left = t2',
      't2.right = t4',
      'return t6',
      'RE-rot1',
      'DoneSplay',
      'insert-splay-call',
      'insert-test-right',
      'insert-right-save',
      'insert-right-detach',
      'insert-right-create',
      'insert-return',
    ]);

    const insertionReturns = getInsertionReturns(chunks);

    expect(insertionReturns[0].args).toEqual([
      40,
      40,
      {
        type: 'insertion',
        action: 'empty-tree',
        bookmark: 'Main',
        key: 40,
        rootKey: null,
      },
    ]);
    expect(insertionReturns[1].args).toEqual([
      20,
      20,
      {
        type: 'insertion',
        action: 'insert-left',
        bookmark: 'Main',
        key: 20,
        rootKey: 40,
      },
    ]);
    expect(insertionReturns[2].args).toEqual([
      60,
      60,
      {
        type: 'insertion',
        action: 'insert-right',
        bookmark: 'Main',
        key: 60,
        rootKey: 40,
      },
    ]);
  });

  it('registers empty, left, and right insertion branch chunks', () => {
    const chunks = [];

    SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [40, 20, 60] },
    );

    const branchChunks = getInsertionBranchChunks(chunks);

    expect(branchChunks.map(chunk => chunk.bookmark)).toEqual([
      'insert-test-empty', 'insert-test-left', 'insert-test-right',
    ]);
    expect(branchChunks.every(chunk => chunk.recursionLevel === 0)).toBe(true);
    expect(branchChunks.map(chunk => chunk.args[0])).toEqual([
      {
        type: 'insertion',
        action: 'empty-tree',
        bookmark: 'Main',
        key: 40,
        rootKey: null,
      },
      {
        type: 'insertion',
        action: 'insert-left',
        bookmark: 'Main',
        key: 20,
        rootKey: 40,
      },
      {
        type: 'insertion',
        action: 'insert-right',
        bookmark: 'Main',
        key: 60,
        rootKey: 40,
      },
    ]);

    const graph = {
      nodes: [{ id: 20 }, { id: 40 }],
      edges: [{ source: 40, target: 20 }],
      setEdgeColor: jest.fn(),
      setFunctionInsertText: jest.fn(),
      setFunctionName: jest.fn(),
      setNodeColor: jest.fn(),
    };
    const insertRightChunk = branchChunks[2];

    insertRightChunk.callback({ graph }, ...insertRightChunk.args);

    expect(graph.setNodeColor.mock.calls).toEqual([
      [20, undefined],
      [40, undefined],
      [40, colors.PATH_N],
    ]);
    expect(graph.setEdgeColor).toHaveBeenCalledWith(40, 20, undefined);
    expect(graph.setFunctionName).toHaveBeenCalledWith(
      'Insert 60 above and right of 40',
    );
  });

  it('registers the search path and rotation chunks for a splay search operation', () => {
    const chunks = [];

    SplayTreeInsertion.run(
      createChunker(chunks),
      {
        operations: [
          { type: 'insert', value: 40 },
          { type: 'insert', value: 20 },
          { type: 'insert', value: 60 },
          { type: 'search', value: 20 },
        ],
      },
    );

    expect(chunks.some(chunk => chunk.bookmark === 'switchPath')).toBe(true);
    expect(chunks.some(chunk => (
      chunk.bookmark === 'leftRotate(t2)'
      || chunk.bookmark === 'rightRotate(t6)'
    ))).toBe(true);
  });

  it('registers one complete switch path before each Splay insertion', () => {
    const chunks = [];

    SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [40, 20, 60] },
    );

    const traversalChunks = chunks.filter(
      chunk => chunk.bookmark === 'switchPath',
    );

    expect(traversalChunks.map(chunk => chunk.args)).toEqual([
      [[40], 20],
      [[20, 40], 60],
    ]);

    const graph = {
      nodes: [{ id: 20 }, { id: 40 }],
      edges: [{ source: 20, target: 40 }],
      setEdgeColor: jest.fn(),
      setFunctionInsertText: jest.fn(),
      setFunctionName: jest.fn(),
      setNodeColor: jest.fn(),
    };
    const lastTraversalChunk = traversalChunks[1];

    lastTraversalChunk.callback(
      { graph },
      ...lastTraversalChunk.args,
    );

    expect(graph.setFunctionName).toHaveBeenCalledWith('Insert: 60');
    expect(graph.setEdgeColor).toHaveBeenCalledWith(
      20,
      40,
      colors.PATH_E,
    );
    expect(graph.setNodeColor.mock.calls).toEqual([
      [20, undefined],
      [40, undefined],
      [20, colors.PATH_N],
      [40, colors.PATH_N],
    ]);
  });

  it.each([
    { nodes: [40, 20, 30], side: 'left', left: 20, right: 40, detached: 20, oldRoot: 40 },
    { nodes: [20, 40, 30], side: 'right', left: 20, right: 40, detached: 40, oldRoot: 20 },
    { nodes: [40, 20], side: 'left', left: null, right: 40, detached: null, oldRoot: 40 },
    { nodes: [20, 40], side: 'right', left: 20, right: null, detached: null, oldRoot: 20 },
  ])('animates $side insertion stages for $nodes without rebuilding at return', ({ nodes, side, left, right, detached, oldRoot }) => {
    const chunks = [];
    const graph = SplayTreeInsertion.initVisualisers({ visualiser: {} }).graph.instance;
    SplayTreeInsertion.run(createChunker(chunks), { nodes });

    const finalEntry = chunks.map(chunk => chunk.bookmark).lastIndexOf('Main');
    const saveIndex = chunks.findIndex((chunk, index) => index > finalEntry && chunk.bookmark === `insert-${side}-save`);
    const stages = chunks.slice(saveIndex, saveIndex + 4);
    expect(stages.map(chunk => chunk.bookmark)).toEqual([
      `insert-${side}-save`, `insert-${side}-detach`, `insert-${side}-create`, 'insert-return',
    ]);
    expect(stages.every(chunk => chunk.recursionLevel === 0)).toBe(true);

    const play = ({ callback, args = [] }) => callback({ graph }, ...args);
    chunks.slice(0, saveIndex).forEach(play);
    const insertedKey = nodes[nodes.length - 1];
    const originalTree = graph.getTree();
    const positions = graph.nodes.map(({ id, x, y }) => ({ id, x, y }));
    expect(graph.findNode(insertedKey)).toBeUndefined();

    play(stages[0]);
    expect(graph.getTree()).toEqual(originalTree);
    if (left !== null) expect(graph.findNode(left).height).toBe('l');
    if (right !== null) expect(graph.findNode(right).height).toBe('r');

    const removeEdge = jest.spyOn(graph, 'removeEdge');
    play(stages[1]);
    if (detached !== null) {
      expect(removeEdge).toHaveBeenCalledWith(oldRoot, detached);
      expect(graph.findEdge(oldRoot, detached)).toBeUndefined();
    } else {
      expect(removeEdge).not.toHaveBeenCalled();
    }
    expect(graph.nodes.map(({ id, x, y }) => ({ id, x, y }))).toEqual(positions);
    expect(graph.findNode(insertedKey)).toBeUndefined();

    play(stages[2]);
    const expectedTree = {};
    nodes.forEach(key => { expectedTree[key] = {}; });
    if (left !== null) expectedTree[insertedKey].left = left;
    if (right !== null) expectedTree[insertedKey].right = right;
    expect(graph.getTree()).toEqual(expectedTree);
    expect(graph.getRoot()).toBe(insertedKey);
    expect(graph.findNode(insertedKey).color).toBe(colors.NEW_N);
    expect(graph.nodes.every(node => node.height === undefined)).toBe(true);

    const addNode = jest.spyOn(graph, 'addNode');
    const addEdge = jest.spyOn(graph, 'addEdge');
    const layout = jest.spyOn(graph, 'layoutAVL');
    removeEdge.mockClear();
    const finalPositions = graph.nodes.map(({ id, x, y }) => ({ id, x, y }));
    play(stages[3]);
    expect(addNode).not.toHaveBeenCalled();
    expect(addEdge).not.toHaveBeenCalled();
    expect(removeEdge).not.toHaveBeenCalled();
    expect(layout).not.toHaveBeenCalled();
    expect(graph.getTree()).toEqual(expectedTree);
    expect(graph.nodes.map(({ id, x, y }) => ({ id, x, y }))).toEqual(finalPositions);
    expect(graph.functionName).toBe(`Inserted: ${insertedKey}`);
  });

  it('turns a rotation event into staged GraphTracer updates', () => {
    const chunks = [];

    SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [40, 20, 60] },
    );

    const rotationChunks = chunks.filter(
      chunk => chunk.args
        && chunk.args[0]
        && chunk.args[0].type === 'rotation',
    );

    const rotationEvent = {
      type: 'rotation',
      direction: 'left',
      bookmark: 'RE-rot1',
      splayCase: 'RE',
      parentKey: null,
      depth: 1,
      pivotKey: 20,
      newRootKey: 40,
      transferredSubtreeKey: null,
    };

    expect(rotationChunks.map(chunk => chunk.bookmark)).toEqual([
      'RE-rot1',
      'leftRotate(t2)',
      't6 = right(t2)',
      't4 = left(t6)',
      't6.left = t2',
      't2.right = t4',
      'return t6',
      'RE-rot1',
    ]);
    expect(rotationChunks.filter(chunk => chunk.bookmark !== 'return t6')
      .map(chunk => chunk.args)).toEqual(
      Array(7).fill([rotationEvent]),
    );
    expect(rotationChunks[6].args).toEqual([rotationEvent, 40]);
    expect(rotationChunks.map(chunk => chunk.recursionLevel))
      .toEqual([1, 2, 2, 2, 2, 2, 2, 1]);

    const graph = {
      nodes: [{ id: 20, x: 0, y: 0 }, { id: 40, x: 100, y: 100 }],
      edges: [{ source: 20, target: 40 }],
      addEdge: jest.fn(),
      clearTID: jest.fn(),
      directed: jest.fn(),
      getRoot: jest.fn(() => 40),
      layoutAVL: jest.fn(),
      setMoveRatio: jest.fn(),
      rectangle_size: jest.fn(),
      removeEdge: jest.fn(),
      setEdgeColor: jest.fn(),
      setFunctionInsertText: jest.fn(),
      setFunctionName: jest.fn(),
      setNodeColor: jest.fn(),
      setPauseLayout: jest.fn(),
      setTagInfo: jest.fn(),
      updateTID: jest.fn(),
      findNode: jest.fn(id => graph.nodes.find(node => node.id === id)),
      getTree: jest.fn(() => ({ 20: { right: 40 }, 40: {} })),
      setRotPos: jest.fn(pos => { graph.rotPos = pos; }),
      getRotPos: jest.fn(() => graph.rotPos),
      setNodePosition: jest.fn((id, x, y) => { Object.assign(graph.findNode(id), { x, y }); }),
      moveNodePosition: jest.fn(),
    };

    rotationChunks.forEach(chunk => {
      chunk.callback({ graph }, ...chunk.args);
    });

    expect(graph.removeEdge).toHaveBeenCalledWith(20, 40);
    expect(graph.addEdge).toHaveBeenCalledWith(40, 20);
    expect(graph.setNodeColor.mock.calls).toEqual([
      [20, undefined],
      [40, undefined],
      [20, colors.ROT_N],
      [40, colors.ROT_N],
    ]);
    expect(graph.setEdgeColor.mock.calls).toEqual([
      [20, 40, undefined],
      [20, 40, colors.ROT_E],
      [40, 20, colors.ROT_E],
    ]);
    expect(graph.setPauseLayout.mock.calls).toEqual([[true], [false]]);
    expect(graph.clearTID).toHaveBeenCalledTimes(1);
    expect(graph.directed).toHaveBeenCalledWith(true);
    expect(graph.layoutAVL).toHaveBeenCalledWith(40, true);
    expect(graph.setMoveRatio).toHaveBeenCalledWith(3 / 6);
    expect(graph.getRoot).not.toHaveBeenCalled();
    expect(graph.updateTID.mock.calls).toEqual([
      [20, 't2'],
      [40, 't6'],
    ]);
    expect(graph.setFunctionName).toHaveBeenCalledWith('Left rotation: 20');
    expect(graph.setFunctionInsertText).toHaveBeenLastCalledWith(
      ' splayCase: Zig (RE)',
    );
  });

  it('tracks the rendered root during the 30,10,20 Right-Empty rotation', () => {
    const chunks = [];
    const visualisers = SplayTreeInsertion.initVisualisers({ visualiser: {} });
    const graph = visualisers.graph.instance;

    SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [30, 10, 20] },
    );

    const rotationChunks = chunks.filter(
      chunk => chunk.args
        && chunk.args[0]
        && chunk.args[0].type === 'rotation'
        && chunk.args[0].pivotKey === 10,
    );

    expect(rotationChunks.map(chunk => chunk.bookmark)).toEqual([
      'RE-rot1',
      'leftRotate(t2)',
      't6 = right(t2)',
      't4 = left(t6)',
      't6.left = t2',
      't2.right = t4',
      'return t6',
      'RE-rot1',
    ]);
    expect(rotationChunks.map(chunk => chunk.bookmark)).not.toContain(
      'RL-rot2',
    );

    const returnChunkIndex = chunks.indexOf(rotationChunks[6]);
    chunks.slice(0, returnChunkIndex + 1).forEach(({ callback, args = [] }) => {
      callback({ graph }, ...args);
    });

    expect(graph.getRoot()).toBe(30);
    expect(graph.root).toBe(30);
    expect(graph.getTree()).toEqual({
      10: {},
      30: { left: 10 },
    });
  });

  it.each([
    {
      name: 'LL',
      key: 25,
      caseBookmark: 'left-left',
      rotationBookmarks: ['rightRotate(t6)', 'rightRotate(t6)'],
      buildTree: () => makeNode(
        100,
        makeNode(
          50,
          makeNode(25, null, makeNode(40)),
          makeNode(75),
        ),
      ),
    },
    {
      name: 'LR',
      key: 75,
      caseBookmark: 'left-right',
      rotationBookmarks: ['leftRotate(t2)', 'rightRotate(t6)'],
      buildTree: () => makeNode(
        100,
        makeNode(
          50,
          null,
          makeNode(75, makeNode(60), makeNode(90)),
        ),
      ),
    },
    {
      name: 'RR',
      key: 100,
      caseBookmark: 'right-right',
      rotationBookmarks: ['leftRotate(t2)', 'leftRotate(t2)'],
      buildTree: () => makeNode(
        25,
        null,
        makeNode(
          75,
          makeNode(50),
          makeNode(100, makeNode(90)),
        ),
      ),
    },
    {
      name: 'RL',
      key: 75,
      caseBookmark: 'right-left',
      rotationBookmarks: ['rightRotate(t6)', 'leftRotate(t2)'],
      buildTree: () => makeNode(
        25,
        null,
        makeNode(
          100,
          makeNode(75, makeNode(60), makeNode(90)),
        ),
      ),
    },
  ])(
    'replays the $name double rotation with non-empty t4 subtrees',
    ({
      key,
      caseBookmark,
      rotationBookmarks,
      buildTree,
    }) => {
      const initialRoot = buildTree();
      const algorithmEvents = [];
      const result = SplayTree.splay(
        cloneTree(initialRoot),
        key,
        event => algorithmEvents.push(event),
      );
      const rotationEvents = algorithmEvents.filter(
        event => event.type === 'rotation',
      );
      const chunks = [];
      const visualisers = SplayTreeInsertion.initVisualisers({ visualiser: {} });
      const graph = visualisers.graph.instance;

      renderTree(graph, initialRoot);
      addSplayRotationChunks(
        createChunker(chunks),
        algorithmEvents,
        'search',
        initialRoot.key,
      );

      expect(rotationEvents).toHaveLength(2);
      expect(rotationEvents.every(
        event => event.transferredSubtreeKey !== null,
      )).toBe(true);
      expect(chunks.filter(
        chunk => chunk.bookmark === caseBookmark,
      )).toHaveLength(1);
      expect(chunks.filter(chunk => (
        chunk.bookmark === 'leftRotate(t2)'
        || chunk.bookmark === 'rightRotate(t6)'
      )).map(chunk => chunk.bookmark)).toEqual(rotationBookmarks);

      let beforeRotation;
      const hasEdge = (source, target) => graph.edges.some(
        edge => edge.source === source && edge.target === target,
      );
      chunks.forEach(({ bookmark, callback, args = [] }) => {
        callback({ graph }, ...args);

        const rotation = args[0];
        if (!rotation || rotation.type !== 'rotation') return;
        const { pivotKey, newRootKey, transferredSubtreeKey } = rotation;
        const pivot = graph.findNode(pivotKey);
        const newRoot = graph.findNode(newRootKey);

        if (bookmark === 'leftRotate(t2)' || bookmark === 'rightRotate(t6)') {
          beforeRotation = { pivotY: pivot.y, childY: newRoot.y };
        } else if (bookmark === 't6 = right(t2)' || bookmark === 't2 = left(t6)') {
          // The first movement raises the child and lowers the pivot while
          // keeping the original links until the pointer-assignment steps.
          expect(newRoot.y).toBeLessThan(beforeRotation.childY);
          expect(newRoot.y).toBeGreaterThan(beforeRotation.pivotY);
          expect(pivot.y).toBeGreaterThan(beforeRotation.pivotY);
          expect(pivot.y).toBeLessThan(beforeRotation.childY);
          expect(hasEdge(pivotKey, newRootKey)).toBe(true);
          expect(hasEdge(newRootKey, transferredSubtreeKey)).toBe(true);
        } else if (bookmark === 't4 = left(t6)' || bookmark === 't4 = right(t2)') {
          expect(newRoot.y).toBeCloseTo(beforeRotation.pivotY);
          expect(pivot.y).toBeGreaterThan(newRoot.y);
        } else if (bookmark === 't6.left = t2' || bookmark === 't2.right = t6') {
          expect(hasEdge(pivotKey, newRootKey)).toBe(false);
          expect(hasEdge(newRootKey, pivotKey)).toBe(true);
          expect(hasEdge(newRootKey, transferredSubtreeKey)).toBe(false);
          expect(hasEdge(pivotKey, transferredSubtreeKey)).toBe(false);
        } else if (bookmark === 't2.right = t4' || bookmark === 't6.left = t4') {
          expect(hasEdge(pivotKey, transferredSubtreeKey)).toBe(true);
        }
        expect(graph.nodes.every(node => Number.isFinite(node.x) && Number.isFinite(node.y)))
          .toBe(true);
      });

      expect(graph.getRoot()).toBe(result.key);
      expect(graph.getTree()).toEqual(flattenTree(result));
      expect(graph.isDirected).toBe(true);
    },
  );

  it('shows depth boxes and the Splay case only when recursion is expanded', () => {
    const expandedAlgorithm = {
      id: { name: 'splaytree' },
      collapse: {
        splaytree: {
          operations: {
            insert_splay: true,
            search_splay: true,
          },
        },
      },
    };
    initGlobalAlgorithmGetter(() => expandedAlgorithm);

    const chunks = [];
    SplayTreeInsertion.run(createChunker(chunks), { nodes: [40, 20, 40] });
    const entryChunk = chunks.find(
      chunk => chunk.bookmark === 'splay-enter'
        && chunk.args[0].rootKey === 20
        && chunk.args[1] === 40,
    );
    const graph = {
      pushRectStack: jest.fn(),
      rectangle_size: jest.fn(),
      setEdgeColor: jest.fn(),
      setFunctionInsertText: jest.fn(),
      setFunctionName: jest.fn(),
      setNodeColor: jest.fn(),
    };

    entryChunk.callback({ graph }, ...entryChunk.args);

    expect(graph.pushRectStack).toHaveBeenCalledWith([20, 40], 'Depth 1');
    expect(graph.rectangle_size).toHaveBeenCalled();
    expect(graph.setFunctionInsertText).toHaveBeenCalledWith(
      ' splayCase: Zig (RE)',
    );

    expandedAlgorithm.collapse.splaytree.operations.insert_splay = false;
    graph.pushRectStack.mockClear();
    graph.setFunctionInsertText.mockClear();
    entryChunk.callback({ graph }, ...entryChunk.args);

    expect(graph.pushRectStack).not.toHaveBeenCalled();
    expect(graph.setFunctionInsertText.mock.calls).toEqual([[]]);
  });

  it('shows depth boxes for Splay search when search recursion is expanded', () => {
    const expandedAlgorithm = {
      id: { name: 'splaytree' },
      collapse: {
        splaytree: {
          operations: {
            insert_splay: false,
            search_splay: true,
          },
        },
      },
    };
    initGlobalAlgorithmGetter(() => expandedAlgorithm);

    const chunks = [];
    SplayTreeInsertion.run(
      createChunker(chunks),
      {
        operations: [
          { type: 'insert', value: 40 },
          { type: 'insert', value: 20 },
          { type: 'search', value: 40 },
        ],
      },
    );
    const entryChunk = chunks.find(
      chunk => chunk.bookmark === 'splay-enter'
        && chunk.args[0].rootKey === 20
        && chunk.args[1] === 40,
    );
    const graph = {
      pushRectStack: jest.fn(),
      rectangle_size: jest.fn(),
      setEdgeColor: jest.fn(),
      setFunctionInsertText: jest.fn(),
      setFunctionName: jest.fn(),
      setNodeColor: jest.fn(),
    };

    entryChunk.callback({ graph }, ...entryChunk.args);

    expect(graph.pushRectStack).toHaveBeenCalledWith([20, 40], 'Depth 1');
    expect(graph.rectangle_size).toHaveBeenCalled();
    expect(graph.setFunctionInsertText).toHaveBeenCalledWith(
      ' splayCase: Zig (RE)',
    );

    expandedAlgorithm.collapse.splaytree.operations.search_splay = false;
    graph.pushRectStack.mockClear();
    graph.setFunctionInsertText.mockClear();
    entryChunk.callback({ graph }, ...entryChunk.args);

    expect(graph.pushRectStack).not.toHaveBeenCalled();
    expect(graph.setFunctionInsertText.mock.calls).toEqual([[]]);
  });

  it('maps actual Splay call entries to nested animation frames', () => {
    const root = {
      key: 100,
      left: {
        key: 50,
        left: {
          key: 25,
          left: { key: 10, left: null, right: null },
          right: null,
        },
        right: null,
      },
      right: null,
    };

    const calls = [];
    SplayTree.search(root, 10, null, event => calls.push(event));

    expect(getSplayRecursionFrames(calls)).toEqual([
      {
        depth: 1,
        nodeKeys: [100, 50, 25, 10],
        recursionBlock: null,
        rootKey: 100,
        splayCase: 'LL',
      },
      {
        depth: 2,
        nodeKeys: [25, 10],
        recursionBlock: 'LL-recurse',
        rootKey: 25,
        splayCase: 'LE',
      },
    ]);
  });

  it('replays traversal, rotation, and snapshot chunks on a real GraphTracer', () => {
    const chunks = [];
    const visualisers = SplayTreeInsertion.initVisualisers({ visualiser: {} });
    const graph = visualisers.graph.instance;

    SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [40, 20, 60] },
    );

    chunks.forEach(({ callback, args = [] }) => {
      callback({ graph }, ...args);
    });

    expect(graph.getRoot()).toBe(60);
    expect(graph.getTree()).toEqual({
      20: {},
      40: { left: 20 },
      60: { left: 40 },
    });
    expect(graph.findNode(60).color).toBe(colors.NEW_N);
    expect(graph.functionName).toBe('Inserted: 60');
    expect(graph.isDirected).toBe(true);
    expect(graph.nodes.every(node => node.height === undefined)).toBe(true);
  });

  it('clears temporary rotation roles without removing numeric heights', () => {
    const visualisers = SplayTreeInsertion.initVisualisers({ visualiser: {} });
    const graph = visualisers.graph.instance;

    graph.addNode(10, 10);
    graph.addNode(20, 20);
    graph.updateHeight(10, 2);
    graph.updateTID(20, 't2');

    graph.clearTID();

    expect(graph.findNode(10).height).toBe(2);
    expect(graph.findNode(20).height).toBeUndefined();
  });

  it('replays a duplicate insertion without creating a node', () => {
    const chunks = [];
    const visualisers = SplayTreeInsertion.initVisualisers({ visualiser: {} });
    const graph = visualisers.graph.instance;

    SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [40, 20, 60, 40] },
    );

    chunks.forEach(({ callback, args = [] }) => {
      callback({ graph }, ...args);
    });

    expect(graph.nodes).toHaveLength(3);
    expect(graph.getRoot()).toBe(40);
    expect(graph.findNode(40).color).toBe(colors.FOUND_N);
    expect(graph.functionName).toBe('Duplicate ignored: 40');
  });

  it('replays zero and negative integer insertions on a real GraphTracer', () => {
    const chunks = [];
    const visualisers = SplayTreeInsertion.initVisualisers({ visualiser: {} });
    const graph = visualisers.graph.instance;

    const root = SplayTreeInsertion.run(
      createChunker(chunks),
      { nodes: [0, -10, 10, 5] },
    );

    chunks.forEach(({ callback, args = [] }) => {
      callback({ graph }, ...args);
    });

    expect(inOrder(root)).toEqual([-10, 0, 5, 10]);
    expect(graph.getRoot()).toBe(5);
    expect(graph.nodes.map(node => node.id).sort((a, b) => a - b)).toEqual([
      -10,
      0,
      5,
      10,
    ]);
  });

  describe('combined operations', () => {
    const boundaryOperations = [
      { type: 'search', value: 10 },
      { type: 'insert', value: 10 },
      { type: 'search', value: 10 },
      { type: 'search', value: 99 },
      { type: 'insert', value: 10 },
      { type: 'insert', value: 20 },
    ];

    it('enters recursive Splay calls before their children and returns at caller levels', () => {
      const chunks = [];
      SplayTreeInsertion.run(createChunker(chunks), {
        operations: [
          ...[1, 2, 3, 4, 5, 6].map(value => ({ type: 'insert', value })),
          { type: 'search', value: 1 },
        ],
      });
      const searchChunks = chunks.slice(chunks.findIndex(chunk => chunk.bookmark === '1'));
      const callMarkers = new Set([
        'pre-search-splay', 'splay-enter', 'left-left', 'left-empty',
        'pre-recurseLL', 'recurse-LL', 'DoneSplay', 'search-splay-call',
      ]);
      expect(searchChunks.filter(chunk => callMarkers.has(chunk.bookmark))
        .map(chunk => [chunk.bookmark, chunk.recursionLevel])).toEqual([
        ['pre-search-splay', 0],
        ['splay-enter', 1], ['left-left', 1], ['pre-recurseLL', 1],
        ['splay-enter', 2], ['left-left', 2], ['pre-recurseLL', 2],
        ['splay-enter', 3], ['left-empty', 3], ['DoneSplay', 3],
        ['recurse-LL', 2], ['DoneSplay', 2],
        ['recurse-LL', 1], ['DoneSplay', 1],
        ['search-splay-call', 0],
      ]);
      expect(searchChunks.filter(chunk => chunk.bookmark === 'rightRotate(t6)')
        .map(chunk => chunk.recursionLevel)).toEqual([4, 3, 3, 2, 2]);
      expect(searchChunks.filter(chunk => chunk.bookmark === 'return t2')
        .map(chunk => chunk.recursionLevel)).toEqual([4, 3, 3, 2, 2]);
    });

    it.each(['insert', 'search'])(
      'steps over a collapsed %s Splay call and restores its tree when stepping back',
      (type) => {
        const collapse = Object.fromEntries(Object.keys(splayPseudocode)
          .map(block => [block, true]));
        collapse[`${type}_splay`] = false;
        let state = GlobalActions.RUN_ALGORITHM(
          { collapse: { splaytree: { operations: collapse } } },
          {
            name: 'splaytree', mode: 'operations', visualiser: {},
            operations: [
              ...[1, 2, 3, 4, 5, 6].map(value => ({ type: 'insert', value })),
              { type, value: type === 'insert' ? 0 : 1 },
            ],
          },
        );
        initGlobalAlgorithmGetter(() => state);
        initGlobalAlgotithmGetter(() => state, () => {});
        const entry = type === 'insert' ? 'Main' : '1';
        const entryIndex = state.chunker.chunks.map(chunk => chunk.bookmark).lastIndexOf(entry);
        while (state.chunker.currentChunk < entryIndex) {
          state = GlobalActions.NEXT_LINE(state, false);
        }
        const graph = () => state.chunker.visualisers.graph.instance;
        const beforeTree = graph().getTree();
        expect(graph().getRoot()).toBe(6);

        state = GlobalActions.NEXT_LINE(state, false);
        expect(state.bookmark).toBe(`${type}-splay-call`);
        expect(state.chunker.chunks[state.chunker.currentChunk].recursionLevel).toBe(0);
        expect(graph().getRoot()).toBe(1);
        expect(graph().nodes).toHaveLength(6);
        const afterTree = graph().getTree();

        state = GlobalActions.PREV_LINE(state, false);
        expect(state.chunker.currentChunk).toBe(entryIndex);
        expect(graph().getRoot()).toBe(6);
        expect(graph().getTree()).toEqual(beforeTree);
        state = GlobalActions.NEXT_LINE(state, false);
        expect(graph().getTree()).toEqual(afterTree);

        state = GlobalActions.PREV_LINE(state, false);
        state = GlobalActions.COLLAPSE(state, {
          codeblockname: `${type}_splay`, expandOrCollapase: true,
        });
        state = GlobalActions.NEXT_LINE(state, false);
        expect(state.bookmark).toBe(`pre-${type}-splay`);
        state = GlobalActions.NEXT_LINE(state, false);
        expect(state.bookmark).toBe('splay-enter');
        expect(state.chunker.chunks[state.chunker.currentChunk].recursionLevel).toBe(1);
      },
    );

    it('pairs every mixed operation entry with its own level-zero return', () => {
      const chunks = [];
      SplayTreeInsertion.run(createChunker(chunks), { operations: boundaryOperations });

      const boundaries = chunks.filter(({ bookmark }) => (
        bookmark === 'Main' || bookmark === '1' || bookmark.includes('-return')
      ) && bookmark !== 'E-return');

      expect(boundaries.map(({ bookmark }) => bookmark)).toEqual([
        '1', 'search-return-not-found',
        'Main', 'insert-return-empty',
        '1', 'search-return-found',
        '1', 'search-return-not-found',
        'Main', 'insert-return',
        'Main', 'insert-return',
      ]);
      expect(boundaries.every(({ recursionLevel }) => recursionLevel === 0)).toBe(true);
      expect(chunks[0]).toBe(boundaries[0]);
      expect(chunks[chunks.length - 1]).toBe(boundaries[boundaries.length - 1]);
    });

    it('shows search results at return and clears them at the next operation', () => {
      const chunks = [];
      const graph = SplayTreeInsertion.initVisualisers({ visualiser: {} }).graph.instance;
      SplayTreeInsertion.run(createChunker(chunks), { operations: boundaryOperations });
      const searchResults = [];
      let operationIndex = -1;

      chunks.forEach(({ bookmark, callback, args = [] }) => {
        callback({ graph }, ...args);
        if (bookmark === 'Main' || bookmark === '1') {
          operationIndex += 1;
          const { type, value } = boundaryOperations[operationIndex];
          expect(graph.functionName).toBe(`${type === 'insert' ? 'Insert' : 'Search'}: ${value}`);
          expect(graph.nodes.every(node => node.color === undefined)).toBe(true);
          expect(graph.edges.every(edge => edge.color === undefined)).toBe(true);
        } else if (bookmark.startsWith('search-return-')) {
          searchResults.push(graph.functionName);
        } else if (boundaryOperations[operationIndex].type === 'search') {
          expect(graph.functionName).not.toMatch(/^(Found|Not found):/);
        }
      });

      expect(operationIndex).toBe(boundaryOperations.length - 1);
      expect(searchResults).toEqual(['Not found: 10', 'Found: 10', 'Not found: 99']);
      expect(graph.getTree()).toEqual({ 10: {}, 20: { left: 10 } });
      expect(graph.functionName).toBe('Inserted: 20');
    });

    it('accepts insertion operations', () => {
      const root = SplayTreeInsertion.run(createChunker(), {
        operations: [
          { type: 'insert', value: 40 },
          { type: 'insert', value: 20 },
          { type: 'insert', value: 60 },
        ],
      });

      expect(root.key).toBe(60);
      expect(inOrder(root)).toEqual([20, 40, 60]);
    });

    it('carries the root from insertion into search', () => {
      const root = SplayTreeInsertion.run(createChunker(), {
        operations: [
          { type: 'insert', value: 40 },
          { type: 'insert', value: 20 },
          { type: 'insert', value: 60 },
          { type: 'search', value: 20 },
        ],
      });

      expect(root.key).toBe(20);
      expect(inOrder(root)).toEqual([20, 40, 60]);
    });

    it('animates a search after inserting 2, 10, and 34', () => {
      const chunks = [];

      SplayTreeInsertion.run(createChunker(chunks), {
        operations: [
          { type: 'insert', value: 2 },
          { type: 'insert', value: 10 },
          { type: 'insert', value: 34 },
          { type: 'search', value: 2 },
        ],
      });

      const firstSearchChunk = chunks.findIndex(
        chunk => chunk.bookmark === '1',
      );
      const searchChunks = chunks.slice(firstSearchChunk);

      expect(searchChunks.filter(chunk => chunk.bookmark === 'switchPath'))
        .toHaveLength(2);
      expect(searchChunks.map(chunk => chunk.bookmark)).toEqual([
        '1',
        'pre-search-splay',
        'splay-enter',
        'switchPath',
        'left-left',
        'pre-recurseLL',
        'splay-enter',
        'switchPath',
        'case-empty',
        'E-return',
        'DoneSplay',
        'recurse-LL',
        'LL-rot1',
        'rightRotate(t6)',
        't2 = left(t6)',
        't4 = right(t2)',
        't2.right = t6',
        't6.left = t4',
        'return t2',
        'LL-rot1',
        'LL-rot2',
        'rightRotate(t6)',
        't2 = left(t6)',
        't4 = right(t2)',
        't2.right = t6',
        't6.left = t4',
        'return t2',
        'LL-rot2',
        'DoneSplay',
        'search-splay-call',
        'search-return-found',
      ]);
      const finalSearchChunk = searchChunks[searchChunks.length - 1];
      expect(finalSearchChunk.args[2]).toBe(2);
      expect(finalSearchChunk.args[0]).toEqual([2, 10, 34]);
      expect(finalSearchChunk.args[1]).toEqual([
        [2, 10],
        [10, 34],
      ]);
      expect(finalSearchChunk.args[3]).toBe(2);
      expect(finalSearchChunk.args[4]).toBe(true);
    });

    it('inserts into the tree produced by the preceding search', () => {
      const root = SplayTreeInsertion.run(createChunker(), {
        operations: [
          { type: 'insert', value: 40 },
          { type: 'insert', value: 20 },
          { type: 'insert', value: 60 },
          { type: 'search', value: 20 },
          { type: 'insert', value: 30 },
        ],
      });

      expect(root.key).toBe(30);
      expect(inOrder(root)).toEqual([20, 30, 40, 60]);
    });

    it('handles a search on an empty tree', () => {
      const root = SplayTreeInsertion.run(createChunker(), {
        operations: [
          { type: 'search', value: 10 },
        ],
      });

      expect(root).toBeNull();
    });

    it('does not insert the target of a failed search', () => {
      const root = SplayTreeInsertion.run(createChunker(), {
        operations: [
          { type: 'insert', value: 20 },
          { type: 'insert', value: 40 },
          { type: 'search', value: 30 },
        ],
      });

      expect(root.key).toBe(20);
      expect(inOrder(root)).toEqual([20, 40]);
    });

    it('ignores duplicate insertions', () => {
      const root = SplayTreeInsertion.run(createChunker(), {
        operations: [
          { type: 'insert', value: 20 },
          { type: 'insert', value: 20 },
        ],
      });

      expect(root.key).toBe(20);
      expect(countNodes(root)).toBe(1);
    });

    it('carries state through multiple searches', () => {
      const root = SplayTreeInsertion.run(createChunker(), {
        operations: [
          { type: 'insert', value: 40 },
          { type: 'insert', value: 20 },
          { type: 'insert', value: 60 },
          { type: 'search', value: 20 },
          { type: 'search', value: 60 },
          { type: 'insert', value: 30 },
        ],
      });

      expect(root.key).toBe(30);
      expect(inOrder(root)).toEqual([20, 30, 40, 60]);
    });

    it('rejects unknown operations', () => {
      expect(() => SplayTreeInsertion.run(createChunker(), {
        operations: [
          { type: 'unsupported', value: 20 },
        ],
      })).toThrow('Unknown Splay Tree operation: unsupported');
    });

    it('accepts delete operations and executes Del_return4 callback', () => {
      const chunks = [];
      const graph = SplayTreeInsertion.initVisualisers({ visualiser: {} }).graph.instance;
      const operations = [
        { type: 'insert', value: 20 },
        { type: 'insert', value: 10 },
        { type: 'insert', value: 30 },
        { type: 'delete', value: 20 },
      ];
      expect(() => SplayTreeInsertion.run(createChunker(chunks), { operations })).not.toThrow();
      const return4Chunk = chunks.find(c => c.bookmark === 'Del_return4');
      expect(return4Chunk).toBeDefined();
      chunks.forEach(({ callback, args = [] }) => {
        if (callback) {
          callback({ graph }, ...args);
        }
      });
      expect(graph.functionName).toBe('Deleted: 20');
    });

    it('executes a mixed sequence of insert, search, and delete operations', () => {
      const chunks = [];
      const graph = SplayTreeInsertion.initVisualisers({visualiser: {} }).graph.instance;
      const operations = [
        {type: 'insert', value: 10},
        {type: 'insert', value: 5},
        {type: 'search', value: 5},
        {type: 'delete', value: 5},
        {type: 'search', value: 5},
      ];

      const root = SplayTreeInsertion.run(createChunker(chunks), {operations});

      expect(root.key).toBe(10);
      expect(inOrder(root)).toEqual([10]);
      expect(countNodes(root)).toBe(1);

      const searchChunks = chunks.filter(c => c.bookmark === 'search-return-found' ||
      c.bookmark === 'search-return-not-found');
      expect(searchChunks).toHaveLength(2);
      searchChunks[0].callback({graph}, ...searchChunks[0].args);
      expect(graph.functionName).toBe('Found: 5');

      expect(searchChunks[1].bookmark).toBe('search-return-not-found');
      searchChunks[1].callback({graph}, ...searchChunks[1].args);
      expect(graph.functionName).toBe('Not found: 5');
    });

    it('registers the complete chunk bookmark sequence for a two-subtree deletion',()=>{
      const chunks= [];
      const operations = [
        {type: 'insert', value: 20},
        {type: 'insert', value: 10},
        {type: 'insert', value: 30},
        {type: 'delete', value: 20},

      ];

      SplayTreeInsertion.run(createChunker(chunks), {operations});
      const bookmarks = chunks.map(c=>c.bookmark);

      expect(bookmarks).toContain('Del');
      expect(bookmarks).toContain('Del_splay1');
      expect(bookmarks).toContain('Del_init_temp');
      expect(bookmarks).toContain('Del_splay2');
      expect(bookmarks).toContain('Del_use_temp');
      expect(bookmarks).toContain('Del_return4');

      const delIdx = bookmarks.indexOf('Del');
      const splay1Idx = bookmarks.indexOf('Del_splay1', delIdx);
      const initTempIdx = bookmarks.indexOf('Del_init_temp', splay1Idx);
      const splay2Idx = bookmarks.indexOf('Del_splay2', initTempIdx);
      const useTempIdx = bookmarks.indexOf('Del_use_temp', splay2Idx);
      const return4Idx = bookmarks.indexOf('Del_return4', useTempIdx);

      expect(delIdx).toBeGreaterThanOrEqual(0);
      expect(splay1Idx).toBeGreaterThan(delIdx);
      expect(initTempIdx).toBeGreaterThan(splay1Idx);
      expect(splay2Idx).toBeGreaterThan(initTempIdx);
      expect(useTempIdx).toBeGreaterThan(splay2Idx);
      expect(return4Idx).toBeGreaterThan(useTempIdx);
    });


  });
});

it('checks deletion against a set and graph replay against controller at every operation boundary', () => {
  let state = 123456;
  const rand = n => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state % n; };
  const ends = /^(insert-return.*|search-return.*|Del_return[1-4])$/;
  for (let run = 0; run < 100; run++) {
    const ops = Array.from({length: 40}, () => ({
      type: ['insert','search','delete'][rand(3)], value: rand(13)
    }));
    const chunks = [];
    const graph = SplayTreeInsertion.initVisualisers({ visualiser: {} }).graph.instance;
    const root = SplayTreeInsertion.run(createChunker(chunks), {operations: ops});
    const set = new Set();
    let i = 0;
    for (const c of chunks) {
      if (c.callback) c.callback({ graph }, ...(c.args || []));
      if (!ends.test(c.bookmark)) continue;
      const {type,value} = ops[i++];
      if (type === 'insert') set.add(value);
      if (type === 'delete') set.delete(value);
      expect(graph.nodes.map(n => n.id).sort((a,b)=>a-b)).toEqual([...set].sort((a,b)=>a-b));
      const expected = SplayTreeInsertion.run(createChunker(), {operations:ops.slice(0,i)});
      if (expected) expect(graph.getRoot()).toBe(expected.key);
      const edges = [];
      const traverse = n => { if (!n) return; for (const child of [n.left,n.right]) if (child) {edges.push([n.key,child.key].join(':'));traverse(child);} };
      traverse(expected);
      expect(graph.edges.map(e => [e.source,e.target].join(':')).sort()).toEqual(edges.sort());
    }
    expect(i).toBe(ops.length);
    expect(inOrder(root)).toEqual([...set].sort((a,b)=>a-b));
  }
});

it.each([false,true])('deletion playback expanded=%s', expanded => {
  const collapse = Object.fromEntries(Object.keys(splayPseudocode).map(block => [block, expanded]));
  const operations = [...[1,2,3,4,5,6].map(value=>({type:'insert',value})), {type:'delete',value:3}];
  let state = GlobalActions.RUN_ALGORITHM({collapse:{splaytree:{operations:collapse}}}, {
    name:'splaytree',mode:'operations',visualiser:{},operations,
  });
  initGlobalAlgorithmGetter(()=>state);
  initGlobalAlgotithmGetter(()=>state,()=>{});
  const bookmarks=[];
  const graph=()=>state.chunker.visualisers.graph.instance;
  for(let i=0;i<1000 && state.bookmark!=='Del_return4';i++){
    const previousIndex=state.chunker.currentChunk;
    state=GlobalActions.NEXT_LINE(state,false);
    if(state.chunker.currentChunk===previousIndex) break;
    bookmarks.push(state.bookmark);
  }
  expect(bookmarks).toContain('Del_return4');
  expect(graph().getRoot()).toBe(2);
  expect(graph().nodes.map(n=>n.id).sort()).toEqual([1,2,4,5,6]);
  const deletionSteps=bookmarks.slice(bookmarks.indexOf('Del'));
  if (!expanded) expect(deletionSteps).toEqual(['Del_return4']);
  else expect(deletionSteps.filter(s=>s==='splay-enter').length).toBeGreaterThanOrEqual(2);
  const tree=graph().getTree();
  state=GlobalActions.PREV_LINE(state,false);
  state=GlobalActions.NEXT_LINE(state,false);
  expect(graph().getTree()).toEqual(tree);
});


it('uses the signed Splay delete syntax through search, delete and continued insertion', () => {
  const operations = parseTreeInput('-4,4,?-4,!-4,?-4,!4,4,?4', { allowDelete: true });
  const chunks = [];
  const graph = SplayTreeInsertion.initVisualisers({ visualiser: {} }).graph.instance;
  const root = SplayTreeInsertion.run(createChunker(chunks), { operations });
  const results = [];
  chunks.forEach(({ bookmark, callback, args = [] }) => {
    if (callback) callback({ graph }, ...args);
    if (/^(search-return|Del_return)/.test(bookmark)) results.push(graph.functionName);
  });
  expect(results).toEqual(['Found: -4', 'Deleted: -4', 'Not found: -4', 'Deleted: 4', 'Found: 4']);
  expect(inOrder(root)).toEqual([4]);
  expect(graph.nodes.map(node => node.id)).toEqual([4]);
});
