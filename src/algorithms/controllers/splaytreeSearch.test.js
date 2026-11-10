/* eslint-disable no-undef */
import Chunker from '../../context/chunker';
import { GlobalActions } from '../../context/actions';
import insertion from './splaytreeInsertion';
import search from './splaytreeSearch';
import SplayTree from './splaytree';
import pseudocode from '../pseudocode/splaytreeSearch';
import { BSTColors as colors } from './BSTColors';
import { initGlobalAlgorithmGetter } from './collapseChunkPlugin';
import { initGlobalAlgotithmGetter } from './transitiveClosureCollapseChunkPlugin';

jest.mock('../index', () => ({
  __esModule: true,
  default: {
    splaytree: {
      name: 'Splay Tree',
      controller: { search: require('./splaytreeSearch').default },
      pseudocode: { search: require('../pseudocode/splaytreeSearch').default },
    },
  },
}));

function build(nodes) {
  const chunker = new Chunker(() => insertion.initVisualisers({ visualiser: {} }));
  insertion.run(chunker, { nodes });
  if (chunker.chunks.length === 0) return insertion.initVisualisers({ visualiser: {} });
  chunker.chunks.forEach(() => chunker.next());
  return chunker.visualisers;
}

function snapshot(graph) {
  return {
    root: graph.getRoot(),
    nodes: graph.nodes.map(node => ({ ...node })),
    edges: graph.edges.map(edge => ({ ...edge })),
    rectangles: graph.rectangles.map(rectangle => ({ ...rectangle })),
    functionName: graph.functionName,
  };
}

function flatten(root, tree = {}) {
  if (!root) return tree;
  tree[root.key] = {};
  if (root.left) tree[root.key].left = root.left.key;
  if (root.right) tree[root.key].right = root.right.key;
  flatten(root.left, tree);
  flatten(root.right, tree);
  return tree;
}

beforeEach(() => {
  window.history.replaceState({}, '', '/?alg=splaytree&mode=search');
  initGlobalAlgorithmGetter(() => null);
});

afterEach(() => initGlobalAlgorithmGetter(() => null));

it.each([
  [[1, 2, 3, 4, 5, 6], 1],
  [[6, 5, 4, 3, 2, 1], 6],
  [[3, 1, 2], 1],
  [[1, 3, 2], 3],
  [[0, -10, 10, -5, 5], 0],
  [[0], 0],
  [[0], 99],
  [[1, 2, 3, 4, 5, 6], 99],
  [[], 1],
])('replays standalone search on %j for %i without changing the source graph', (nodes, target) => {
  const visualiser = build(nodes);
  const source = snapshot(visualiser.graph.instance);
  let expected = null;
  nodes.forEach(key => { expected = SplayTree.insert(expected, key); });
  expected = SplayTree.search(expected, target);
  const params = { visualiser, target };
  const chunker = new Chunker(() => search.initVisualisers(params));
  const result = search.run(chunker, params);
  expect(snapshot(visualiser.graph.instance)).toEqual(source);
  expect(result).toBe(expected && expected.key === target ? 'success' : 'fail');
  const bookmarks = new Set(Object.values(pseudocode).flat().map(line => line.bookmark));
  expect(chunker.chunks.every(chunk => bookmarks.has(chunk.bookmark))).toBe(true);
  expect(chunker.chunks[0]).toMatchObject({ bookmark: '1', recursionLevel: 0 });
  const frames = [];
  let firstPath = true;
  chunker.chunks.forEach(chunk => {
    chunker.next();
    const graph = chunker.visualisers.graph.instance;
    frames.push(snapshot(graph));
    if (chunk.bookmark === 'switchPath') {
      expect(graph.edges.filter(edge => edge.color === colors.PATH_E).length).toBeLessThanOrEqual(2);
      if (firstPath && nodes.length === 6 && target === 1) {
        expect(graph.edges.filter(edge => edge.color === colors.PATH_E)
          .map(edge => [edge.source, edge.target]))
          .toEqual(expect.arrayContaining([[6, 5], [5, 4]]));
      }
      firstPath = false;
    }
  });
  expect(chunker.visualisers.graph.instance.getTree()).toEqual(flatten(expected));
  expect(chunker.visualisers.graph.instance.rectangles).toHaveLength(0);
  expect(chunker.visualisers.graph.instance.functionName)
    .toBe(`${expected && expected.key === target ? 'Found' : 'Not found'}: ${target}`);
  for (let index = frames.length - 1; index >= 0; index -= 1) {
    chunker.goBackTo(index);
    expect(snapshot(chunker.visualisers.graph.instance)).toEqual(frames[index]);
  }
  expect(snapshot(visualiser.graph.instance)).toEqual(source);
});

it('steps over a collapsed standalone Splay call and restores it when expanded', () => {
  const collapse = Object.fromEntries(Object.keys(pseudocode).map(block => [block, true]));
  collapse.search_splay = false;
  let state = GlobalActions.RUN_ALGORITHM(
    { collapse: { splaytree: { search: collapse } } },
    { name: 'splaytree', mode: 'search', visualiser: build([1, 2, 3, 4, 5, 6]), target: 1 },
  );
  initGlobalAlgorithmGetter(() => state);
  initGlobalAlgotithmGetter(() => state, () => {});
  expect(state.chunker.visualisers.graph.instance.getRoot()).toBe(6);
  state = GlobalActions.NEXT_LINE(state, false);
  expect(state.bookmark).toBe('search-splay-call');
  expect(state.chunker.visualisers.graph.instance.getRoot()).toBe(1);
  state = GlobalActions.PREV_LINE(state, false);
  expect(state.bookmark).toBe('1');
  expect(state.chunker.visualisers.graph.instance.getRoot()).toBe(6);
  state = GlobalActions.COLLAPSE(state, { codeblockname: 'search_splay', expandOrCollapase: true });
  state = GlobalActions.NEXT_LINE(state, false);
  expect(state.bookmark).toBe('pre-search-splay');
  state = GlobalActions.NEXT_LINE(state, false);
  expect(state.bookmark).toBe('splay-enter');
  expect(state.chunker.chunks[state.chunker.currentChunk].recursionLevel).toBe(1);
  expect(state.chunker.visualisers.graph.instance.rectangles).toHaveLength(1);
  state = GlobalActions.PREV_LINE(state, false);
  expect(state.bookmark).toBe('pre-search-splay');
  expect(state.chunker.visualisers.graph.instance.rectangles).toHaveLength(0);
});
