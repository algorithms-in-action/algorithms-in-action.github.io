/**
 * Purpose:
 *   Visual tracer for pointer-based linked list algorithms.
 *   Supports dynamic node repositioning, highlighting, and pointer tags.
 *
 * Node Class:
 *   Each list node is represented by a ListNode instance with:
 *     - num (displayed value)
 *     - nextKey (pointer to next visible node)
 *     - fillVariant (color for visual state)
 *     - pos (x,y position on canvas)
 *     - variables (badges / stacked pointer labels)
 *
 * Index Mapping:
 *   The algorithm uses 1-based integer indices for list structure (Tails array).
 *   This tracer maps indices <-> visual node keys using indexToKey.
 *
 *   Example:
 *     index 1 => key "n0_123456"
 *     index 2 => key "n1_789012"
 *
 *   updateConnections() must be called after pointer updates to refresh edges.
 *
 * Tags:
 *   assignTag(tagName, index)
 *     - If index is undefined or 'Null', the tag is removed
 *     - Otherwise tag is positioned on the node mapped from index
 *     - Tags may stack (e.g. "L|E") if multiple point to same node
 *
 *   applyTags() centralizes rendering of all active tags
 *   desiredTags stores the live association: tag -> list index
 *
 * Color Functions:
 *   resetColors(variant)     — set every node to default (idle) color
 *   colorChain(start, variant, Tails)
 *       marks all nodes reachable from start index
 *   colorMerged(M, E, variant, Tails)
 *       marks only the merged portion of list during merge sort
 *   highlightHeads(L, R, variant)
 *       temporarily highlights one or two nodes under comparison
 *
 * Visibility Control:
 *   hideChain(start, Tails)  — hide nodes in a pointer chain
 *   showChain(start, Tails)  — show nodes in a pointer chain
 *   hideAll() / showByKey() — global or selective control
 *
 * Node Positioning:
 *   moveNodeTo(key, x, y)        — reposition single node
 *   moveChainBelow(L, R, Tails)  — vertically separate right chain during recursion
 *   repositionMergedChain(M, Tails)
 *       layout merged output as a continuous chain
 *
 * Requirements for Algorithm Integration:
 *   - After each pointer mutation in algorithm, call updateConnections(Tails)
 *   - After any color or visibility change, call super.set() (handled internally)
 *   - Tag updates must always use assignTag(tag, index) only
 *
 * Maintenance:
 *   - assignTag(undefined) should always be used to clear tags
 *
 * Intended Usage:
 *   Designed specifically for mergesort linked list animation,
 *   but general enough for any singly-linked list visualization.
 */

import Tracer from '../common/Tracer.jsx';
import LinkedListRenderer from "./LinkedListRenderer";
import ListNode from "./ListNode";

class LinkedListTracer extends Tracer {

  // ------------------------------------------------
  // Constructor helpers
  // ------------------------------------------------
  getRendererClass() {
    return LinkedListRenderer;
  }

  init() {
    super.init();
    this.nodes = new Map();
    this.headKey = null;
    this.tailKey = null;
    this.motionOn = true;

    this.layout = {
      direction: 'horizontal',
      gap: 65,
      start: { x: 0, y: 0 },
      nodeW: 50,
      baselineY: 0,
      rowWidth: 720,
      rowGap: 36,
    };

    this.algo = undefined;
    this.listOfNumbers = '';
    this.indexToKey = new Map();

    // tagName -> index (1-based)
    this.desiredTags = {
      L: undefined,
      R: undefined,
      M: undefined,
      E: undefined,
      Mid: undefined
    };
  }

  // ------------------------------------------------
  // Build linked list from numeric array
  // ------------------------------------------------
  set(list = [], algo) {
    this.algo = algo;
    this.nodes.clear();
    this.indexToKey.clear();

    let prevKey = null;
    list.forEach((v, i) => {
      const k = `n${i}_${Date.now()}`;
      const node = new ListNode(v, k);

      node.pos.x = this.layout.start.x + i * this.layout.gap;
      node.pos.y = this.layout.start.y;

      if (prevKey) this.nodes.get(prevKey).nextKey = k;
      this.nodes.set(k, node);
      this.indexToKey.set(i + 1, k);
      prevKey = k;
    });

    this.headKey = list.length ? [...this.nodes.keys()][0] : null;
    this.tailKey = list.length ? [...this.nodes.keys()][list.length - 1] : null;
    super.set();
  }

  // ------------------------------------------------
  // Update pointer connectivity using tails array
  // ------------------------------------------------
  updateConnections(tailsArray) {
    for (const [index, key] of this.indexToKey.entries()) {
      const node = this.nodes.get(key);
      if (!node) continue;
      const nextIndex = tailsArray[index];
      node.nextKey =
        (nextIndex === 'Null' || nextIndex == null)
          ? null
          : this.indexToKey.get(nextIndex);
    }
    super.set();
  }

  // ------------------------------------------------
  // Coloring and merging visuals
  // ------------------------------------------------
  resetColors(variant) {
    for (const n of this.nodes.values()) {
      n.fillVariant = variant;
    }
    super.set();
  }

  colorChain(startIndex, variant, tailsArray) {
    if (!startIndex || startIndex === 'Null') return;
    for (let i = startIndex; i !== 'Null'; i = tailsArray[i]) {
      const key = this.indexToKey.get(i);
      if (!key) break;
      const node = this.nodes.get(key);
      if (!node) break;
      node.fillVariant = variant;
    }
    super.set();
  }

  colorMerged(M, E, variant, tailsArray) {
    if (!M || M === 'Null') return;
    for (let i = M; i !== 'Null'; i = tailsArray[i]) {
      const key = this.indexToKey.get(i);
      if (!key) break;
      const node = this.nodes.get(key);
      if (!node) break;
      node.fillVariant = variant;
      if (i === E) break;
    }
    super.set();
  }

  highlightHeads(L, R, variant) {
    if (L && L !== 'Null') {
      const key = this.indexToKey.get(L);
      const node = this.nodes.get(key);
      if (node) node.fillVariant = variant;
    }
    if (R && R !== 'Null') {
      const key = this.indexToKey.get(R);
      const node = this.nodes.get(key);
      if (node) node.fillVariant = variant;
    }
    super.set();
  }

  // ------------------------------------------------
  // Visibility control
  // ------------------------------------------------
  hideAll() {
    for (const key of this.nodes.keys()) this.hideByKey(key);
  }

  hideByKey(k) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.hidden = true;
    super.set();
  }

  showByKey(k) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.hidden = false;
    super.set();
  }

  hideChain(startIndex, tailsArray = []) {
    if (!startIndex || startIndex === 'Null') return;
    const T = tailsArray;
    for (let i = startIndex; i !== 'Null'; i = T[i]) {
      const key = this.indexToKey.get(i);
      if (key) this.hideByKey(key);
    }
  }

  showChain(startIndex, tailsArray = []) {
    if (!startIndex || startIndex === 'Null') return;
    const T = tailsArray;
    for (let i = startIndex; i !== 'Null'; i = T[i]) {
      const key = this.indexToKey.get(i);
      if (key) this.showByKey(key);
    }
  }

  // ------------------------------------------------
  // Node positioning (used by recursive split + merge visuals)
  // ------------------------------------------------
  moveNodeTo(k, x, y) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.pos = { x, y };
    super.set();
  }

  moveChainBelow(leftStart, rightStart, tailsArray = [], verticalGap = 60) {
    if (!rightStart || rightStart === 'Null') return;
    const T = tailsArray;

    const leftKey = this.indexToKey.get(leftStart);
    const firstLeft = this.nodes.get(leftKey);

    const startX = firstLeft ? firstLeft.pos.x : 0;
    const startY = firstLeft ? firstLeft.pos.y + verticalGap : verticalGap;

    let xOffset = 0;
    for (let i = rightStart; i !== 'Null'; i = T[i]) {
      const key = this.indexToKey.get(i);
      if (key) {
        this.moveNodeTo(key, startX + xOffset, startY);
        xOffset += this.layout.gap;
      }
    }
  }

  repositionMergedChain(startIndex, tailsArray = [], gap = 65) {
    if (!startIndex || startIndex === 'Null') return;
    const T = tailsArray;

    const merged = [];
    for (let i = startIndex; i !== 'Null'; i = T[i]) {
      const key = this.indexToKey.get(i);
      if (key) merged.push({ key, node: this.nodes.get(key) });
    }
    if (!merged.length) return;

    const leftmostX = Math.min(...merged.map(n => n.node.pos.x));
    const avgY = merged.reduce((s, n) => s + n.node.pos.y, 0) / merged.length;

    merged.forEach((item, idx) => {
      this.moveNodeTo(item.key, leftmostX + idx * gap, avgY);
    });
  }

  // ------------------------------------------------
  // Tag & badge assignment (pointer variables)
  // ------------------------------------------------

  // Assign or clear a tag
  assignTag(tagName, index) {
    this.desiredTags[tagName] =
      (index === 'Null' || index === undefined) ? undefined : index;
    this.applyTags();
  }

  // Apply stacked tags to nodes
  applyTags() {
    const names = Object.keys(this.desiredTags);

    // Remove old stacked and simple name badges
    for (const node of this.nodes.values()) {
      node.variables = node.variables.filter(v => {
        return !names.includes(v) && !v.includes('|');
      });
    }

    // Bucket: index -> [tag names]
    const buckets = new Map();
    names.forEach(name => {
      const idx = this.desiredTags[name];
      if (idx !== undefined && idx !== 'Null') {
        if (!buckets.has(idx)) buckets.set(idx, []);
        buckets.get(idx).push(name);
      }
    });

    // Write back stacked variables (badge)
    for (const [idx, tags] of buckets.entries()) {
      const key = this.indexToKey.get(idx);
      if (!key) continue;
      const n = this.nodes.get(key);
      if (!n) continue;

      const stacked = tags.join('|');
      n.variables = n.variables.filter(v => !names.includes(v) && !v.includes('|'));
      n.variables.push(stacked);
    }

    super.set();
  }
}

export default LinkedListTracer;
