import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import MaskTracer from '../../components/DataStructures/Mask/MaskTracer';
import { ALGO_COLOR_PALLETE } from '../../components/DataStructures/colors';
import { createRadixTreeLayout } from './helpers/radixTreeLayout';
import { createMultiwayTreeLayout } from './helpers/multiwayTreeLayout';

const TRIE_NAMES = { 2: 'Binary', 4: 'Quaternary', 10: 'Decimal' };

// Mask value and highlighted bit positions for base-R digit `index`
// (counted from the right); R must be a power of two.
export const digitMask = (radix, index) => {
  const bitsPerDigit = Math.log2(radix);
  const bits = Array.from({ length: bitsPerDigit }, (_, i) => index * bitsPerDigit + bitsPerDigit - 1 - i);
  return [(radix - 1) * radix ** index, bits];
};

// Digits of a key, most significant first. Base 10 uses the raw decimal
// digits, so keys can differ in length and a key that is a prefix of
// another ends on an internal node; other radixes pad to a common width.
export const keyDigits = (key, radix, width) => (radix === 10
  ? String(key)
  : key.toString(radix).padStart(width, '0'));

export default {
  initVisualisers({ radix = 2 } = {}) {
    return {
      mask: { instance: new MaskTracer('mask', null, 'Current digit', { overlay: true }), order: 0 },
      graph: { instance: new GraphTracer('trie', null, `${TRIE_NAMES[radix]} trie (R = ${radix})`), order: 1 },
    };
  },

  // operations: insert/search steps, e.g. from "5,7,?5"
  // radix: 2 (default), 4 or 10; base 2 and 4 keys are zero-padded.
  run(chunker, { nodes = [], operations, radix = 2 }) {
    const operationList = operations
      || nodes.map(value => ({ type: 'insert', value }));
    const keys = operationList.map(({ value }) => value);
    const digits = Math.max(1, ...keys.map(key => key.toString(radix).length));
    const bits = radix === 10 ? digits : digits * Math.log2(radix);
    const toWord = key => keyDigits(key, radix, digits);
    // Mask for digit `depth` of a key: base 10 holds its place value,
    // base 2 and 4 hold the digit's bits.
    const maskFor = (key, depth) => {
      const index = toWord(key).length - depth - 1;
      return radix === 10 ? [10 ** index, index] : digitMask(radix, index);
    };
    const levelGap = 100;
    const root = { id: 'root', children: {} };
    // Reserve the final layout only. Animation still creates nodes one at a time.
    operationList.filter(({ type }) => type === 'insert').forEach(({ value }) => {
      const word = toWord(value);
      let node = root;
      [...word].forEach(digit => {
        if (!node.children[digit]) {
          node.children[digit] = { id: `${node.id}${digit}`, children: {} };
        }
        node = node.children[digit];
      });
    });
    const positions = radix === 10
      ? createMultiwayTreeLayout({
        root, getChildren: node => Object.keys(node.children).sort().map(d => node.children[d]),
        nodeGap: 75, levelGap, rootY: -digits * levelGap / 2,
      })
      : createRadixTreeLayout({
        root, radix, nodeGap: 100, slotGap: radix === 2 ? 110 : 70, levelGap, rootY: -digits * levelGap / 2,
      });
    const maxX = Math.max(...Array.from(positions.values(), p => Math.abs(p.x)));
    chunker.add('insert', vis => {
      vis.graph.setPauseLayout(true);
      vis.graph.setZoom(1);
      vis.graph.presentation = 'trie';
      vis.graph.weighted(true);
      vis.graph.dimensions.nodeRadius = 26;
      vis.graph.dimensions.baseWidth = Math.max(650, maxX * 2 + 150);
      vis.graph.dimensions.baseHeight = Math.max(350, digits * levelGap + 150);
      vis.graph.addNode('root', '');
      vis.graph.updateUpperLabel('root', 'root');
      const position = positions.get('root');
      vis.graph.setNodePosition('root', position.x, position.y);
      vis.graph.setNodePointerText('root', 't');
      vis.graph.setNodeColor('root', ALGO_COLOR_PALLETE.sky);
      vis.mask.setRadix(radix);
      vis.mask.setMaxBits(bits);
      vis.mask.setBinary(keys[0] || 0);
      vis.mask.setMask(...maskFor(keys[0] || 0, 0));
      vis.mask.setPointerStatus('Ready to insert');
    });

    const created = new Set(['root']);
    const terminals = new Set();
    // Reset colours and put t back at the root for the next operation.
    const start = (bookmark, status, key) => {
      chunker.add(bookmark, (vis, k, mask, text) => {
        vis.graph.nodes.forEach(node => {
          vis.graph.setNodePointerText(node.id, '');
          vis.graph.setNodeColor(node.id, undefined);
        });
        vis.graph.edges.forEach(edge => vis.graph.setEdgeColor(edge.source, edge.target, undefined));
        vis.graph.clearSelect_Circle_Count();
        vis.graph.setNodePointerText('root', 't');
        vis.graph.setNodeColor('root', ALGO_COLOR_PALLETE.sky);
        vis.mask.setBinary(k);
        vis.mask.setMask(...mask);
        vis.mask.setPointerStatus(text);
      }, [key, maskFor(key, 0), `${status}: ${key}`]);
    };

    const search = (key) => {
      start('search', 'Search', key);
      let node = root;
      const word = [...toWord(key)];
      for (let depth = 0; depth < word.length; depth += 1) {
        const digit = word[depth];
        chunker.add('search-digit', (vis, mask, d) => {
          vis.mask.setMask(...mask);
          vis.mask.setPointerStatus(`Examining digit ${d}`);
        }, [maskFor(key, depth), digit]);
        const next = node.children[digit];
        const missing = !next || !created.has(next.id);
        chunker.add('search-test-child', (vis, absent, d) => {
          vis.mask.setPointerStatus(absent ? `No child for ${d}` : `Follow existing ${d} child`);
        }, [missing, digit]);
        if (missing) {
          chunker.add('search-no-child', (vis, id, k) => {
            vis.graph.setNodeColor(id, ALGO_COLOR_PALLETE.apple);
            vis.mask.setPointerStatus(`Not found: ${k}`);
          }, [node.id, key]);
          return;
        }
        chunker.add('search-move', (vis, p, id, d) => {
          vis.graph.setNodePointerText(p, '');
          vis.graph.setNodePointerText(id, 't');
          vis.graph.setNodeColor(p, undefined);
          vis.graph.setNodeColor(id, ALGO_COLOR_PALLETE.sky);
          vis.graph.setEdgeColor(p, id, ALGO_COLOR_PALLETE.peach);
          vis.mask.setPointerStatus(`Moved t to ${d} child`);
        }, [node.id, next.id, digit]);
        node = next;
      }
      const found = terminals.has(node.id);
      chunker.add('search-test-end');
      chunker.add(found ? 'search-found' : 'search-not-end', (vis, id, k, isFound) => {
        vis.graph.setNodeColor(id, isFound ? ALGO_COLOR_PALLETE.leaf : ALGO_COLOR_PALLETE.apple);
        vis.mask.setPointerStatus(isFound ? `Found: ${k}` : `Not found: ${k}`);
      }, [node.id, key, found]);
    };

    const insert = (key) => {
      start('insert', 'Insert', key);
      let node = root;
      [...toWord(key)].forEach((digit, depth) => {
        const parent = node.id;
        node = node.children[digit];
        const child = node.id;
        chunker.add('insert-digit', (vis, mask, d) => {
          vis.mask.setMask(...mask);
          vis.mask.setPointerStatus(`Examining digit ${d}`);
        }, [maskFor(key, depth), digit]);
        const missing = !created.has(child);
        chunker.add('insert-test-child', (vis, absent, d) => {
          vis.mask.setPointerStatus(absent ? `No child for ${d}` : `Follow existing ${d} child`);
        }, [missing, digit]);
        if (missing) {
          created.add(child);
          chunker.add('insert-create-child', (vis, id, p, d, position, direction) => {
            vis.graph.addNode(id, '');
            vis.graph.setNodePosition(id, position.x, position.y);
            vis.graph.addEdge(p, id, { weight: d, direction });
            vis.graph.setNodeColor(id, ALGO_COLOR_PALLETE.leaf);
            vis.mask.setPointerStatus(`Created child for ${d}`);
          }, [child, parent, digit, positions.get(child), Number(digit) < radix / 2 ? 'left' : 'right']);
        }
        chunker.add('insert-move', (vis, p, id, d) => {
          vis.graph.setNodePointerText(p, '');
          vis.graph.setNodePointerText(id, 't');
          vis.graph.setNodeColor(p, undefined);
          vis.graph.setNodeColor(id, ALGO_COLOR_PALLETE.sky);
          vis.graph.setEdgeColor(p, id, ALGO_COLOR_PALLETE.peach);
          vis.mask.setPointerStatus(`Moved t to ${d} child`);
        }, [parent, child, digit]);
      });
      const duplicate = terminals.has(node.id);
      // Base 10 only: a prefix of a longer key ends on an existing internal
      // node, which keeps its children and also becomes an end node.
      const internal = Object.values(node.children).some(child => created.has(child.id));
      terminals.add(node.id);
      node.key = key;
      let message = `Inserted: ${key}`;
      if (duplicate) message = `Already inserted: ${key}`;
      else if (internal) message = `Inserted: ${key} (prefix of a longer key, no new node)`;
      chunker.add('insert-end', (vis, id, k, text) => {
        vis.graph.updateNode(id, String(k));
        vis.graph.findNode(id).isTerminal = true;
        vis.graph.setNodeColor(id, undefined);
        vis.graph.setSelect_Circle_Count(id);
        vis.mask.setPointerStatus(text);
      }, [node.id, key, message]);
    };

    operationList.forEach(({ type, value }) => {
      if (type === 'search') search(value);
      else insert(value);
    });
    return root;
  },
};
