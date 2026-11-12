/* eslint-disable no-undef */
import Chunker from '../../../context/chunker';
import GraphTracer from '../../../components/DataStructures/Graph/GraphTracer';
import SplayTreeSearch from '../splaytreeSearch';
import { Node, default as SplayTree } from '../splaytree';
import { createTreeSearchController, getSplayTreePath } from '../InsertionSharedCode';
import { TreeNode, fromFlatTree, toFlatTree, traversePreOrder } from './treeUtils';

// Exercise real tree controllers and GraphTracer without the algorithm UI registry.
jest.mock('../../index', () => ({ __esModule: true, default: {} }));

function makeVisualiser(rootKey, flat) {
  const graph = new GraphTracer('tree', null, 'Tree');
  traversePreOrder(fromFlatTree(rootKey, flat), (node, parent) => {
    graph.addNode(node.key, node.key);
    if (parent) graph.addEdge(parent.key, node.key);
  });
  if (rootKey !== undefined) graph.layoutBST(rootKey, true);
  return { graph: { instance: graph } };
}

it('preserves the public Splay Node constructor and factory compatibility', () => {
  const node = SplayTree.newNode(0);
  expect(node).toBeInstanceOf(Node);
  expect(node).toBeInstanceOf(TreeNode);
  expect(new Node(0)).toEqual(node);
});

it.each([
  [5, { 5: { left: 0 }, 0: {} }],
  [-5, { '-5': { right: 0 }, 0: {} }],
  [0, { 0: {} }],
])('preserves zero in recursive BST search from root %s', (rootKey, flat) => {
  const visualiser = makeVisualiser(rootKey, flat);
  const controller = createTreeSearchController();
  controller.initVisualisers({ visualiser });
  const chunks = [];
  controller.run({ add: (bookmark, callback, args) => chunks.push({ bookmark, callback, args }) }, {
    visualiser, target: 0,
  });
  expect(chunks.some(chunk => chunk.bookmark === 'return t' && chunk.args[0] === 0)).toBe(true);
  expect(chunks.some(chunk => chunk.bookmark === 'return NotFound')).toBe(false);
  expect(visualiser.graph.instance.getTree()).toEqual(flat);
});

it('searches an empty recursive BST without constructing an undefined-key node', () => {
  const visualiser = makeVisualiser(undefined, {});
  const controller = createTreeSearchController();
  controller.initVisualisers({ visualiser });
  const bookmarks = [];
  controller.run({ add: bookmark => bookmarks.push(bookmark) }, { visualiser, target: 0 });
  expect(bookmarks).toContain('return NotFound');
});

it.each([
  [5, { 5: { left: 0 }, 0: {} }, { 0: { right: 5 }, 5: {} }],
  [-5, { '-5': { right: 0 }, 0: {} }, { 0: { left: -5 }, '-5': {} }],
  [0, { 0: {} }, { 0: {} }],
])('searches zero using the legacy Splay controller from root %s', (rootKey, flat, expected) => {
  const visualiser = makeVisualiser(rootKey, flat);
  const params = { visualiser, target: 0 };
  const chunker = new Chunker(() => SplayTreeSearch.initVisualisers(params));
  const result = SplayTreeSearch.run(chunker, params);
  expect(result).toBe('success');
  expect(visualiser.graph.instance.getRoot()).toBe(rootKey);
  expect(visualiser.graph.instance.getTree()).toEqual(flat);
  chunker.chunks.forEach(() => chunker.next());
  const graph = chunker.visualisers.graph.instance;
  expect(graph.getRoot()).toBe(0);
  expect(graph.getTree()).toEqual(expected);
  expect(chunker.chunks[chunker.chunks.length - 1].bookmark).toBe('search-return-found');
});

it('keeps the exported Splay path helper compatible', () => {
  const flat = { 5: { left: 0 }, 0: {} };
  const root = fromFlatTree(5, flat);
  expect(getSplayTreePath(root, 0)).toEqual([5, 0]);
  expect(getSplayTreePath(root, -1)).toEqual([5, 0]);
  expect(toFlatTree(root)).toEqual(flat);
});
