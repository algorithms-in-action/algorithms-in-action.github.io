/* eslint-env jest */
import Chunker from '../../context/chunker';
import { AVLTreeOperations, BSTOperations, BSTrecOperations } from './treeOperations';
import {
  AVLTreeOperations as avlCode, BSTOperations as bstCode, BSTrecOperations as recursiveCode,
} from '../pseudocode/treeOperations';
import { initGlobalAlgorithmGetter } from './collapseChunkPlugin';
import { parseTreeInput } from '../parameters/helpers/treeInput';
import { toFlatTree } from './helpers/treeUtils';
import { GlobalActions } from '../../context/actions';
import { initGlobalAlgotithmGetter } from './transitiveClosureCollapseChunkPlugin';

jest.mock('../../components/DataStructures/Graph/GraphRenderer', () => () => null);
jest.mock('../../components/top/Settings', () => ({ mode: () => 0 }));
jest.mock('../index', () => ({
  __esModule: true,
  default: Object.fromEntries([
    ['AVLTree', 'AVLTreeOperations'], ['binarySearchTree', 'BSTOperations'], ['BSTrec', 'BSTrecOperations'],
  ].map(([name, key]) => [name, {
    name,
    controller: { operations: require('./treeOperations')[key] },
    pseudocode: { operations: require('../pseudocode/treeOperations')[key] },
  }])),
}));

const cases = [
  ['AVLTree', 'AVLTreeOperations'],
  ['binarySearchTree', 'BSTOperations'],
  ['BSTrec', 'BSTrecOperations'],
];
const controllers = { AVLTreeOperations, BSTOperations, BSTrecOperations };
const pseudocode = { AVLTreeOperations: avlCode, BSTOperations: bstCode, BSTrecOperations: recursiveCode };

function snapshot(chunker) {
  const graph = chunker.visualisers.graph.instance;
  return JSON.parse(JSON.stringify({
    root: graph.root, nodes: graph.nodes, edges: graph.edges,
    rectangles: graph.rectangles, functionName: graph.functionName,
    functionInsertText: graph.functionInsertText, text: graph.text,
    functionNode: graph.functionNode, functionBalance: graph.functionBalance,
  }));
}

function prepare(name, key, input, expanded) {
  const blocks = Object.fromEntries(Object.keys(pseudocode[key]).map(block => [block, expanded]));
  blocks.Main = true;
  initGlobalAlgorithmGetter(() => ({
    id: { name, mode: 'operations' }, collapse: { [name]: { operations: blocks } },
  }));
  const controller = controllers[key];
  const chunker = new Chunker(controller.initVisualisers);
  const root = controller.run(chunker, { operations: parseTreeInput(input) });
  const bookmarks = new Set(Object.values(pseudocode[key]).flat().map(line => line.bookmark));
  chunker.chunks.forEach(chunk => expect(bookmarks.has(chunk.bookmark)).toBe(true));
  return { chunker, root };
}

afterEach(() => {
  initGlobalAlgorithmGetter(() => null);
  initGlobalAlgotithmGetter(() => null);
});

describe.each(cases)('%s combined operations', (name, key) => {
  test.each([true, false])('handles misses, hits, duplicate inserts and replay; expanded=%s', expanded => {
    const { chunker, root } = prepare(name, key, '?4,4,?4,6,?9,0,-2,?0,4,5,?-2', expanded);
    const frames = [];
    chunker.chunks.forEach(() => {
      chunker.next();
      frames.push(snapshot(chunker));
    });
    const graph = chunker.visualisers.graph.instance;
    expect(graph.getTree()).toEqual(toFlatTree(root));
    expect(graph.nodes.map(node => node.id).sort((a, b) => a - b)).toEqual([-2, 0, 4, 5, 6]);
    expect(graph.functionName).toBe('Found: -2');
    expect(frames.some(frame => frame.functionName === 'Not found: 4')).toBe(true);
    expect(frames.some(frame => frame.functionName === 'Found: 4')).toBe(true);
    expect(frames.some(frame => frame.functionName === 'Not found: 9')).toBe(true);
    expect(frames.some(frame => frame.functionName === 'Already exists: 4')).toBe(true);
    for (const index of [0, Math.floor(frames.length / 2), frames.length - 1, 1]) {
      chunker.goBackTo(index);
      expect(snapshot(chunker)).toEqual(frames[index]);
    }
  });

  test('runs a search-only sequence against an empty tree', () => {
    const { chunker, root } = prepare(name, key, '?0,?-5,?7', true);
    chunker.chunks.forEach(() => chunker.next());
    expect(root).toBeNull();
    expect(chunker.visualisers.graph.instance.nodes).toHaveLength(0);
    expect(chunker.visualisers.graph.instance.functionName).toBe('Not found: 7');
  });

  test('steps through collapsed operations and refreshes expanded recursion', () => {
    let state = GlobalActions.RUN_ALGORITHM(undefined, {
      name, mode: 'operations', operations: parseTreeInput('3,1,?1,2,?9'),
    });
    initGlobalAlgorithmGetter(() => state);
    initGlobalAlgotithmGetter(() => state, () => {});
    let steps = 0;
    while (!state.finished && steps < 500) {
      state = GlobalActions.NEXT_LINE(state, false);
      steps += 1;
    }
    expect(state.finished).toBe(true);
    expect(state.chunker.visualisers.graph.instance.functionName).toBe('Not found: 9');
    const finalTree = state.chunker.visualisers.graph.instance.getTree();
    state = GlobalActions.PREV_LINE(state, false);
    if (name !== 'binarySearchTree') {
      state = GlobalActions.COLLAPSE(state, { codeblockname: 'insert_recurseLeft', expandOrCollapase: true });
      expect(state.collapse[name].operations.insert_recurseLeft).toBe(true);
    }
    while (!state.finished && steps < 1000) {
      state = GlobalActions.NEXT_LINE(state, false);
      steps += 1;
    }
    expect(state.finished).toBe(true);
    expect(state.chunker.visualisers.graph.instance.getTree()).toEqual(finalTree);
  });
});

test.each(['3,2,1', '1,2,3', '3,1,2', '1,3,2'])(
  'preserves AVL balance and heights for %s with interleaved searches', input => {
    const mixed = input.split(',').map(value => `${value},?${value},?99`).join(',');
    const { chunker, root } = prepare('AVLTree', 'AVLTreeOperations', mixed, true);
    expect(root.key).toBe(2);
    expect(root.height).toBe(2);
    expect(root.left.height).toBe(1);
    expect(root.right.height).toBe(1);
    chunker.chunks.forEach(() => chunker.next());
    expect(chunker.visualisers.graph.instance.getTree()).toEqual(toFlatTree(root));
    expect(chunker.visualisers.graph.instance.isWeighted).toBe(true);
  },
);
