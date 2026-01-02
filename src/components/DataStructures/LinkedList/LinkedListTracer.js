/**
 * Purpose:
 *   Visual tracer for pointer-based linked list algorithms.
 *   Supports dynamic node repositioning, highlighting, and pointer tags.
 *
 * Original interface not great and very tied to top-down merge sort
 * with not so good positioning of lists etc. Moving it in the right
 * direction but still a way to go and there may be lefover junk XXX
 *
 * Node Class:
 *   Each list node is represented by a ListNode instance with:
 *     - num (displayed value)
 *     - nextKey (pointer to next visible node)
 *     - fillVariant (color for visual state)
 *     - pos (x,y position on canvas)
 *     - variables (badges / stacked pointer labels)
 *       XXX want to move away from this to separate boxes and arrows
 *
 * Index Mapping:
 *   The algorithm uses 1-based integer indices for list structure (Tails array).
 *   This tracer maps indices <-> visual node keys using indexToKey.
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
 *   resetColors()
 *       reset all nodes to default gray
 *   colorChain(start, variant, Tails)
 *       marks all nodes reachable from start index with variant color
 *       or split to colorLeft/colorRight if to hardcode colors inside
 *   colorChains(L, R, Tails, leftColor, rightColor, defaultColor)
 *       resets all to defaultColor first, then colors L-chain and R-chain
 *   colorMerged(M, E, Tails)
 *       marks only the merged portion of list during merge sort
 *   highlightHeads(L, R)
 *       temporarily highlights one or two nodes under comparison to red
 *   unhighlightHeads(L, R)
 *       restores head colors after highlight to their chain colors
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
 *   - Tag updates must use assignTag(tag, index)
 *
 * Maintenance:
 *   - assignTag(undefined) should be used to clear tags
 *
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

  // Generic two-chain coloring helper.
  // Tracer visual only; colors are provided by caller (algorithm-level).
  colorChains(L, R, tailsArray, leftColor = 'orange', rightColor = 'blue', defaultColor = 'gray') {
    // Reset all nodes to default first
      this.resetColors(defaultColor);

    // Apply left chain color
    if (L && L !== 'Null') {
      this.colorChain(L, leftColor, tailsArray);
    }

    // Apply right chain color
    if (R && R !== 'Null') {
      this.colorChain(R, rightColor, tailsArray);
    }
  }

  resetColors() {
    for (const n of this.nodes.values()) {
      n.fillVariant = 'gray';
    }
    super.set();
  }

  colorChain(startIndex, varient, tailsArray) {
    if (!startIndex || startIndex === 'Null') return;
    for (let i = startIndex; i !== 'Null'; i = tailsArray[i]) {
      const key = this.indexToKey.get(i);
      if (!key) break;
      const node = this.nodes.get(key);
      if (!node) break;
      node.fillVariant = varient;
    }
    super.set();
  }

  colorMerged(M, E, tailsArray) {
    if (!M || M === 'Null') return;
    for (let i = M; i !== 'Null'; i = tailsArray[i]) {
      const key = this.indexToKey.get(i);
      if (!key) break;
      const node = this.nodes.get(key);
      if (!node) break;
      node.fillVariant = 'green';
      if (i === E) break;
    }
    super.set();
  }

  highlightHeads(L, R) {
    if (L && L !== 'Null') {
      const key = this.indexToKey.get(L);
      const node = this.nodes.get(key);
      if (node) node.fillVariant = 'red';
    }
    if (R && R !== 'Null') {
      const key = this.indexToKey.get(R);
      const node = this.nodes.get(key);
      if (node) node.fillVariant = 'red';
    }
    super.set();
  }

  // Remove highlight by directly restoring head colors (no other recoloring)
  unhighlightHeads(L, R) {
    if (L && L !== 'Null') {
      const kL = this.indexToKey.get(L);
      const nL = this.nodes.get(kL);
      if (nL) nL.fillVariant = 'orange'; // left head back to orange
    }
    if (R && R !== 'Null') {
      const kR = this.indexToKey.get(R);
      const nR = this.nodes.get(kR);
      if (nR) nR.fillVariant = 'blue';   // right head back to blue
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

  moveChainBelow(leftStart, rightStart, tailsArray = [], verticalGap = 90) {
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
    const topY = Math.min(...merged.map(n => n.node.pos.y));
    // const avgY = merged.reduce((s, n) => s + n.node.pos.y, 0) / merged.length;

    merged.forEach((item, idx) => {
      this.moveNodeTo(item.key, leftmostX + idx * gap, topY);
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
