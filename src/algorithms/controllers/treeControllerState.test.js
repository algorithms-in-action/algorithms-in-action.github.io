/* eslint-disable no-undef */
import Chunker from '../../context/chunker';
import avl from './AVLTreeInsertion';
import bst from './BSTrecInsertion';
import splay from './splaytreeInsertion';
import { initGlobalAlgorithmGetter } from './collapseChunkPlugin';

const controllers = { AVLTree: avl, BSTrec: bst, splaytree: splay };

function activate(run) {
  const blocks = new Proxy({}, { get: () => run.expanded });
  initGlobalAlgorithmGetter(() => ({
    id: { name: run.name },
    collapse: { [run.name]: { insertion: blocks, operations: blocks } },
  }));
  window.history.replaceState({}, '', `/?mode=${run.name === 'splaytree' ? 'operations' : 'insertion'}`);
}

function prepare(name, nodes, expanded) {
  const controller = controllers[name];
  const run = { name, expanded };
  activate(run);
  run.chunker = new Chunker(() => controller.initVisualisers({ visualiser: {} }));
  run.result = controller.run(run.chunker, { nodes });
  return run;
}

function capture(run) {
  const graph = run.chunker.visualisers.graph.instance;
  return JSON.parse(JSON.stringify({
    root: graph.root,
    nodes: graph.nodes,
    edges: graph.edges,
    rectangles: graph.rectangles,
    rectangle: graph.rectangle,
    radius: graph.radius,
    functionName: graph.functionName,
    functionInsertText: graph.functionInsertText,
    functionNode: graph.functionNode,
    functionBalance: graph.functionBalance,
    text: graph.text,
    tagInfo: graph.tagInfo,
  }));
}

function next(run) {
  activate(run);
  run.chunker.next();
  return capture(run);
}

afterEach(() => initGlobalAlgorithmGetter(() => null));

it('keeps AVL configuration independent of other controller initialization', () => {
  avl.initVisualisers({ visualiser: {} });
  bst.initVisualisers({ visualiser: {} });
  splay.initVisualisers({ visualiser: {} });
  const run = prepare('AVLTree', [1, 2, 3], true);
  expect(run.result.key).toBe(2);
  expect(run.result.height).toBe(2);
  run.chunker.chunks.forEach(() => next(run));
  expect(run.chunker.visualisers.graph.instance.isWeighted).toBe(true);
  expect(run.chunker.visualisers.graph.instance.getRoot()).toBe(2);
});

it.each([
  [[3, 2, 1], true],
  [[1, 2, 3], true],
  [[3, 1, 2], true],
  [[1, 3, 2], true],
  [[30, 20, 40, 10, 25, 5], true],
  [[0, -10, 10, -5, 5, 20, 15, 30, 25], true],
  [[10, 10, 5, 20], true],
  [[3, 2, 1], false],
  [[1, 3, 2], false],
  [[0, -10, 10, -5, 5], false],
])('isolates interleaved playback and replay for %j, expanded=%s', (nodes, expanded) => {
  const names = Object.keys(controllers);
  const expected = names.map(name => {
    const run = prepare(name, nodes, expanded);
    return run.chunker.chunks.map(() => next(run));
  });
  const runs = names.map(name => prepare(name, nodes, expanded));
  const longest = Math.max(...expected.map(frames => frames.length));
  for (let frame = 0; frame < longest; frame += 1) {
    runs.forEach((run, index) => {
      if (frame < expected[index].length) expect(next(run)).toEqual(expected[index][frame]);
    });
  }
  runs.forEach((run, index) => {
    for (const frame of [0, Math.floor(expected[index].length / 2), expected[index].length - 1]) {
      activate(run);
      run.chunker.goBackTo(frame);
      expect(capture(run)).toEqual(expected[index][frame]);
    }
  });
});
