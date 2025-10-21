// Fixed LinkedListTracer.js with connection update support

import { cloneDeepWith } from 'lodash'

import Tracer from '../common/Tracer.jsx';
import LinkedListRenderer from "./LinkedListRenderer";
import ListNode from "./ListNode";

/**
 * LinkedListTracer
 * - Maintains a linked list model (nodes map + head/tail/next pointers).
 * - Exposes helper methods to mutate state (select, patch, fade, hide, etc.).
 * - Calls super.set() after any mutation to trigger a re-render.
 * - Renders via LinkedListRenderer.
 */
class LinkedListTracer extends Tracer {
  // Provide the renderer class used by this tracer
  getRendererClass() { return LinkedListRenderer; }

  // Initialize runtime state and default layout
  init() {
    super.init();
    this.nodes = new Map();                  // key => ListNode
    this.headKey = null;                     // key of head node
    this.tailKey = null;                     // key of tail node
    this.motionOn = true;                    // toggle motion animations
    this.layout = { direction: 'horizontal', gap: 65, start: { x: 0, y: 0 } };
    this.algo = undefined;                   // optional algorithm tag/name
    this.listOfNumbers = '';                 // optional text snapshot
    this.indexToKey = new Map();             // Map(1-based index => node key)
  }

  /**
   * Build the list from an array of values.
   * Also fills indexToKey for 1-based indexing.
   */
  // Set up with index mapping
  set(list = [], algo) {
    this.algo = algo;
    this.nodes.clear();
    this.indexToKey.clear();
    let prevKey = null;

    list.forEach((v, i) => {
      const k = `n${i}_${Date.now()}`;       // unique-ish key
      const node = new ListNode(v, k);
      node.pos.x = this.layout.start.x + i * this.layout.gap;
      node.pos.y = this.layout.start.y;
      if (prevKey) {
        this.nodes.get(prevKey).nextKey = k; // link previous to this
      }
      this.nodes.set(k, node);
      this.indexToKey.set(i + 1, k);         // 1-based index mapping
      prevKey = k;
    });
    this.headKey = list.length ? [...this.nodes.keys()][0] : null;
    this.tailKey = list.length ? [...this.nodes.keys()][list.length - 1] : null;

    // if (this.headKey) this.nodes.get(this.headKey).variables.push('head');

    super.set();                              // trigger render
  }

  /**
   * Update next pointers using a "tailsArray":
   * - tailsArray[index] gives the 1-based index of the next node
   * - 'Null' or null means no next
   */
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

  /**
   * Update a node's value by its 1-based index.
   */
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

  /**
   * Assign a "variable" label to a node by 1-based index.
   * Ensures the same varName exists on only one node at a time.
   */
  // NEW: Assign variable by array index
  assignVariableByIndex(varName, index) {
    // Remove the same variable from all nodes first
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

  /**
   * Selection helpers using 1-based indices.
   * color: '0' for default, or '1'..'5' for colored slots.
   */
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

  // ---- Selection helpers by key ----
  // Existing methods
  selectByKey(k, c = '0') { this._mark(k, c, true); }
  deselectByKey(k) { this._clearSelect(k); }

  /**
   * Mark node as "patched" (e.g., temporarily updated) and optionally set value.
   * Increments patched counter to allow nested patching.
   */
  patchByKey(k, v = this.nodes.get(k)?.value) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.value = v;
    n.patched++;
    super.set();
  }

  /**
   * Reverse one patch level (decrement patched), keep value in sync.
   */
  depatchByKey(k, v = this.nodes.get(k)?.value) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.patched = Math.max(0, n.patched - 1);
    n.value = v;
    super.set();
  }

  // Visual emphasis helpers
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

  // Mark a node as sorted (e.g., final positioning)
  sortedByKey(k) {
    const n = this.nodes.get(k);
    if (n) {
      n.sorted = true;
      super.set();
    }
  }

  // Visibility toggles for a single node
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

  /**
   * Hide an entire chain starting from startKey (following next pointers).
   */
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

  /**
   * Show an entire chain starting from startKey (following next pointers).
   */
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

  // Batch visibility helpers
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

  /**
   * Hide everything except the provided keys.
   */
  hideExcept(keepKeys) {
    for (const [key, node] of this.nodes.entries()) {
      node.hidden = !keepKeys.includes(key);
    }
    super.set();
  }

  /**
   * Reset visibility and emphasis for all nodes.
   */
  showAll() {
    for (const node of this.nodes.values()) {
      node.hidden = false;
      node.faded = false;
    }
    super.set();
  }

  // Batch emphasis toggles
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

  /**
   * Assign a variable label to a specific node by key,
   * ensuring uniqueness of that label across all nodes.
   */
  assignVariableAtKey(v, k) {
    for (const node of this.nodes.values()) {
      node.variables = node.variables.filter(x => x !== v);
    }
    if (k) this.nodes.get(k)?.variables.push(v);
    super.set();
  }

  /**
   * Remove all variable labels from all nodes.
   */
  clearVariables() {
    for (const n of this.nodes.values()) n.variables = [];
    super.set();
  }

  /**
   * Insert a new node after a given node key.
   * Positions the new node one gap to the right of the reference.
   */
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

  /**
   * Delete the node immediately after prevKey (if any).
   */
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

  /**
   * Set a new head (by key). Does not change positions or next pointers.
   */
  rehead(newHeadKey) {
    this.headKey = newHeadKey ?? null;
    super.set();
  }

  /**
   * Move a node to an absolute (x, y) position.
   */
  moveNodeTo(k, x, y) {
    const n = this.nodes.get(k);
    if (!n) return;
    n.pos = { x, y };
    super.set();
  }

  // Toggle motion animations (does not trigger render by itself)
  setMotion(b = true) {
    this.motionOn = b;
  }

  // Merge provided layout properties into current layout
  setLayout(layout) {
    this.layout = { ...this.layout, ...layout };
    super.set();
  }

  // Save a human-readable snapshot of the list values
  setList(arr) {
    this.listOfNumbers = arr ? arr.join(', ') : undefined;
  }

  /**
   * Internal selection marker:
   * - c: '0' increments the generic selected counter
   * - c: '1'..'5' toggles named selection flags (selected1..selected5)
   * - on=false clears all selection flags
   */
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

  /**
   * Clear all selection flags on a node and unset "sorted".
   */
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
