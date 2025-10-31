import Tracer from '../common/Tracer.jsx';
import LinkedListRenderer from "./LinkedListRenderer";
import ListNode from "./ListNode";

/**
 * LinkedListTracer (Pointer-only optimised)
 * Maintains linked list nodes + pointer connections.
 * Mutations call super.set() to trigger re-render.
 */
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
  setFillVariantByIndex(index, variant = 'gray') {
    const key = this.indexToKey.get(index);
    if (!key) return;
    const n = this.nodes.get(key);
    if (!n) return;
    n.fillVariant = variant;
    super.set();
  }

  clearAllFillVariants() {
    for (const n of this.nodes.values()) n.fillVariant = 'gray';
    super.set();
  }

  colorChainByVariant(startIndex, variant, tailsArray) {
    if (!startIndex || startIndex === 'Null') return;
    for (let i = startIndex; i !== 'Null'; i = tailsArray[i]) {
      const key = this.indexToKey.get(i);
      if (!key) break;
      const n = this.nodes.get(key);
      if (!n) break;
      n.fillVariant = variant;
    }
    super.set();
  }

  // Wrapper helpers matching pointer UI use
  resetColors() { this.clearAllFillVariants(); }
  colorChain(idx, variant, tailsArray) {
    if (!idx || idx === 'Null') return;
    this.colorChainByVariant(idx, variant, tailsArray);
  }

  colorMerged(M, E, tailsArray) {
    if (!M || M === 'Null') return;
    const T = tailsArray;
    for (let i = M; i !== 'Null'; i = T[i]) {
      this.setFillVariantByIndex(i, 'green');
      if (i === E) break;
    }
  }

  highlightHeads(L, R) {
    if (L && L !== 'Null') this.setFillVariantByIndex(L, 'red');
    if (R && R !== 'Null') this.setFillVariantByIndex(R, 'red');
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
  // Minimal variable tag assignment (index-based only)
  // ------------------------------------------------
  assignVariableByIndex(varName, index) {
    for (const node of this.nodes.values()) {
      node.variables = node.variables.filter(x => x !== varName);
    }
    if (index && index !== 'Null') {
      const key = this.indexToKey.get(index);
      if (key) this.nodes.get(key)?.variables.push(varName);
    }
    super.set();
  }
}

export default LinkedListTracer;
