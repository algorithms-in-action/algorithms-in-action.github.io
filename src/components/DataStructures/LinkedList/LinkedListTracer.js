// Fixed LinkedListTracer.js with connection update support

import { cloneDeepWith } from 'lodash'

import Tracer from '../common/Tracer.jsx';
import LinkedListRenderer from "./LinkedListRenderer";
import ListNode from "./ListNode";

class LinkedListTracer extends Tracer {
  getRendererClass() { return LinkedListRenderer; }

  init() {
    super.init();
    this.nodes = new Map();
    this.headKey = null;
    this.tailKey = null;
    this.motionOn = true;
    this.layout = { direction: 'horizontal', gap: 65, start: { x: 0, y: 0 } };
    this.algo = undefined;
    this.listOfNumbers = '';
    this.indexToKey = new Map(); // NEW: Map array indices to node keys
  }

  // Set up with index mapping
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
      if (prevKey) {
        this.nodes.get(prevKey).nextKey = k;
      }
      this.nodes.set(k, node);
      this.indexToKey.set(i + 1, k); // Map 1-based index to key
      prevKey = k;
    });
    this.headKey = list.length ? [...this.nodes.keys()][0] : null;
    this.tailKey = list.length ? [...this.nodes.keys()][list.length - 1] : null;

    if (this.headKey) this.nodes.get(this.headKey).variables.push('head');

    super.set();
  }

  // NEW: Update node connections based on Tails array
  updateConnections(tailsArray) {
    for (const [index, key] of this.indexToKey.entries()) {
      const node = this.nodes.get(key);
      if (node) {
        const nextIndex = tailsArray[index];
        if (nextIndex === 'Null' || nextIndex === null) {
          node.nextKey = null;
        } else {
          const nextKey = this.indexToKey.get(nextIndex);
          node.nextKey = nextKey || null;
        }
      }
    }
    super.set();
  }

  // NEW: Update node value by index
  updateValueByIndex(index, value) {
    const key = this.indexToKey.get(index);
    if (key) {
      const node = this.nodes.get(key);
      if (node) {
        node.value = value;
        super.set();
      }
    }
  }

  // NEW: Assign variable by array index
  assignVariableByIndex(varName, index) {
    // Clear same variable from all nodes
    for (const node of this.nodes.values()) {
      node.variables = node.variables.filter(x => x !== varName);
    }

    if (index && index !== 'Null') {
      const key = this.indexToKey.get(index);
      if (key) {
        this.nodes.get(key)?.variables.push(varName);
      }
    }
    super.set();
  }

  // NEW: Select by array index
  selectByIndex(index, color = '0') {
    const key = this.indexToKey.get(index);
    if (key) this.selectByKey(key, color);
  }

  // NEW: Deselect by array index
  deselectByIndex(index) {
    const key = this.indexToKey.get(index);
    if (key) this.deselectByKey(key);
  }

  // Existing methods
  selectByKey(k, c = '0') { this._mark(k, c, true); }
  deselectByKey(k) { this._clearSelect(k); }

  patchByKey(k, v = this.nodes.get(k)?.value) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.value = v;
    n.patched++;
    super.set();
  }

  depatchByKey(k, v = this.nodes.get(k)?.value) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.patched = Math.max(0, n.patched - 1);
    n.value = v;
    super.set();
  }

  fadeOutByKey(k) {
    const n = this.nodes.get(k);
    if (n) {
      n.faded = true;
      super.set();
    }
  }

  fadeInByKey(k) {
    const n = this.nodes.get(k);
    if (n) {
      n.faded = false;
      super.set();
    }
  }

  sortedByKey(k) {
    const n = this.nodes.get(k);
    if (n) {
      n.sorted = true;
      super.set();
    }
  }

  hideByKey(k) {
    const n = this.nodes.get(k);
    if (n) {
      n.hidden = true;
      super.set();
    }
  }

  showByKey(k) {
    const n = this.nodes.get(k);
    if (n) {
      n.hidden = false;
      super.set();
    }
  }

  hideFromNode(startKey) {
    let current = startKey;
    while (current !== null && current !== 'Null') {
      const node = this.nodes.get(current);
      if (!node) break;
      node.hidden = true;
      current = node.nextKey;
    }
    super.set();
  }

  showFromNode(startKey) {
    let current = startKey;
    while (current !== null && current !== 'Null') {
      const node = this.nodes.get(current);
      if (!node) break;
      node.hidden = false;
      current = node.nextKey;
    }
    super.set();
  }

  hideRange(keys) {
    keys.forEach(k => {
      const n = this.nodes.get(k);
      if (n) n.hidden = true;
    });
    super.set();
  }

  showRange(keys) {
    keys.forEach(k => {
      const n = this.nodes.get(k);
      if (n) n.hidden = false;
    });
    super.set();
  }

  hideExcept(keepKeys) {
    for (const [key, node] of this.nodes.entries()) {
      node.hidden = !keepKeys.includes(key);
    }
    super.set();
  }

  showAll() {
    for (const node of this.nodes.values()) {
      node.hidden = false;
      node.faded = false;
    }
    super.set();
  }

  fadeRange(keys) {
    keys.forEach(k => {
      const n = this.nodes.get(k);
      if (n) n.faded = true;
    });
    super.set();
  }

  unfadeRange(keys) {
    keys.forEach(k => {
      const n = this.nodes.get(k);
      if (n) n.faded = false;
    });
    super.set();
  }

  assignVariableAtKey(v, k) {
    for (const node of this.nodes.values()) {
      node.variables = node.variables.filter(x => x !== v);
    }
    if (k) this.nodes.get(k)?.variables.push(v);
    super.set();
  }

  clearVariables() {
    for (const n of this.nodes.values()) n.variables = [];
    super.set();
  }

  insertAfter(afterKey, value, newKey = `n_${Date.now()}`) {
    const newNode = new ListNode(value, newKey);
    const after = this.nodes.get(afterKey);
    newNode.pos.x = (after?.pos.x ?? 0) + this.layout.gap;
    newNode.pos.y = (after?.pos.y ?? 0);
    newNode.nextKey = after?.nextKey ?? null;
    if (after) after.nextKey = newKey;
    if (this.tailKey === afterKey) this.tailKey = newKey;
    this.nodes.set(newKey, newNode);
    super.set();
  }

  deleteAfter(prevKey) {
    const prev = this.nodes.get(prevKey);
    if (!prev || !prev.nextKey) return;
    const delKey = prev.nextKey;
    const delNode = this.nodes.get(delKey);
    prev.nextKey = delNode?.nextKey ?? null;
    if (this.tailKey === delKey) this.tailKey = prevKey;
    this.nodes.delete(delKey);
    super.set();
  }

  rehead(newHeadKey) {
    this.headKey = newHeadKey ?? null;
    super.set();
  }

  moveNodeTo(k, x, y) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.pos = { x, y };
    super.set();
  }

  setMotion(b = true) {
    this.motionOn = b;
  }

  setLayout(layout) {
    this.layout = { ...this.layout, ...layout };
    super.set();
  }

  setList(arr) {
    this.listOfNumbers = arr ? arr.join(', ') : undefined;
  }

  _mark(k, c, on) {
    const n = this.nodes.get(k);
    if (!n) return;
    const color = Number(c);
    if (on) {
      if (color === 0) n.selected++;
      else if (color >= 1 && color <= 5) n[`selected${color}`] = true;
      else n.selected = 1;
    } else {
      n.selected = 0;
      for (let i = 1; i <= 5; i++) n[`selected${i}`] = false;
    }
    super.set();
  }

  _clearSelect(k) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.selected = 0;
    for (let i = 1; i <= 5; i++) n[`selected${i}`] = false;
    n.sorted = false;
    super.set();
  }
}

export default LinkedListTracer;