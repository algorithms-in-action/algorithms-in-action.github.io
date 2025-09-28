// Complete LinkedListTracer.js file
// Path: src/components/DataStructures/LinkedList/LinkedListTracer.js

import { cloneDeepWith } from 'lodash'

import Tracer from '../common/Tracer.jsx';
import LinkedListRenderer from "./LinkedListRenderer";
import ListNode from "./ListNode";

class LinkedListTracer extends Tracer {
  getRendererClass() { return LinkedListRenderer; }

  init() {
    super.init();
    this.nodes = new Map();    // key -> ListNode
    this.headKey = null;
    this.tailKey = null;
    this.motionOn = true;      // 与数组保持一致
    this.layout = { direction: 'horizontal', gap: 65, start: { x: 0, y: 0 } };
    this.algo = undefined;
    this.listOfNumbers = '';   // 可重用 caption
  }

  // 设置链表（支持数组初始化或节点列表）
  set(list = [], algo) {
    this.algo = algo;
    this.nodes.clear();
    let prevKey = null;

    list.forEach((v, i) => {
      const k = `n${i}_${Date.now()}`;       // 简易 key
      const node = new ListNode(v, k);
      node.pos.x = this.layout.start.x + i * this.layout.gap;
      node.pos.y = this.layout.start.y;
      if (prevKey) {
        this.nodes.get(prevKey).nextKey = k;
      }
      this.nodes.set(k, node);
      prevKey = k;
    });
    this.headKey = list.length ? [...this.nodes.keys()][0] : null;
    this.tailKey = list.length ? [...this.nodes.keys()][list.length - 1] : null;

    // 增加head 标签
    if (this.headKey) this.nodes.get(this.headKey).variables.push('head');

    super.set(); // 通知渲染
  }

  // —— 通用高亮/选择（与 Array2DTracer 同名便于统一调用）——
  selectByKey(k, c = '0') { this._mark(k, c, true); }
  deselectByKey(k) { this._clearSelect(k); }

  patchByKey(k, v = this.nodes.get(k)?.value) { const n = this.nodes.get(k); if (!n) return; n.value = v; n.patched++; super.set(); }
  depatchByKey(k, v = this.nodes.get(k)?.value) { const n = this.nodes.get(k); if (!n) return; n.patched = Math.max(0, n.patched - 1); n.value = v; super.set(); }
  fadeOutByKey(k) { const n = this.nodes.get(k); if (n) { n.faded = true; super.set(); } }
  fadeInByKey(k) { const n = this.nodes.get(k); if (n) { n.faded = false; super.set(); } }
  sortedByKey(k) { const n = this.nodes.get(k); if (n) { n.sorted = true; super.set(); } }

  // —— Hide/Show methods (NEW) ——

  // Hide a single node by key
  hideByKey(k) {
    const n = this.nodes.get(k);
    if (n) {
      n.hidden = true;
      super.set();
    }
  }

  // Show a single node by key
  showByKey(k) {
    const n = this.nodes.get(k);
    if (n) {
      n.hidden = false;
      super.set();
    }
  }

  // Hide all nodes from a specific node to the end of the list
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

  // Show all nodes from a specific node to the end of the list
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

  // Hide nodes in a range (useful for hiding the "right" part during recursion)
  hideRange(keys) {
    keys.forEach(k => {
      const n = this.nodes.get(k);
      if (n) n.hidden = true;
    });
    super.set();
  }

  // Show nodes in a range
  showRange(keys) {
    keys.forEach(k => {
      const n = this.nodes.get(k);
      if (n) n.hidden = false;
    });
    super.set();
  }

  // Hide all nodes except the specified keys
  hideExcept(keepKeys) {
    for (const [key, node] of this.nodes.entries()) {
      node.hidden = !keepKeys.includes(key);
    }
    super.set();
  }

  // Show all nodes
  showAll() {
    for (const node of this.nodes.values()) {
      node.hidden = false;
      node.faded = false;  // Also unfade when showing all
    }
    super.set();
  }

  // Fade instead of hide (for softer visual effect)
  fadeRange(keys) {
    keys.forEach(k => {
      const n = this.nodes.get(k);
      if (n) n.faded = true;
    });
    super.set();
  }

  // Unfade nodes
  unfadeRange(keys) {
    keys.forEach(k => {
      const n = this.nodes.get(k);
      if (n) n.faded = false;
    });
    super.set();
  }

  // —— 变量/指针标签（head/cur/left/right…）——
  assignVariableAtKey(v, k) {
    // 清同名变量
    for (const node of this.nodes.values()) {
      node.variables = node.variables.filter(x => x !== v);
    }
    if (k) this.nodes.get(k)?.variables.push(v);
    super.set();
  }
  clearVariables() { for (const n of this.nodes.values()) n.variables = []; super.set(); }

  // —— 结构操作（插入/删除/断开/连接）——
  insertAfter(afterKey, value, newKey = `n_${Date.now()}`) {
    const newNode = new ListNode(value, newKey);
    // 布局：先放在 after 后一格，Renderer 会 tween 到位
    const after = this.nodes.get(afterKey);
    newNode.pos.x = (after?.pos.x ?? 0) + this.layout.gap;
    newNode.pos.y = (after?.pos.y ?? 0);
    // 接 pointer
    newNode.nextKey = after?.nextKey ?? null;
    if (after) after.nextKey = newKey;
    // 尾指针
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

  // 把节点 newHead 设为链表开头（用于 merge 时拼接）
  rehead(newHeadKey) { this.headKey = newHeadKey ?? null; super.set(); }

  // 移动节点"视觉位置"（逻辑 nextKey 不变）—用于有序合并时的视觉移动
  moveNodeTo(k, x, y) { const n = this.nodes.get(k); if (!n) return; n.pos = { x, y }; super.set(); }

  // —— 辅助 —— //
  setMotion(b = true) { this.motionOn = b; }     // 与 Array2DTracer 对齐
  setLayout(layout) { this.layout = { ...this.layout, ...layout }; super.set(); }
  setList(arr) { this.listOfNumbers = arr ? arr.join(', ') : undefined; } // 复用 caption

  // —— 私有 —— //
  _mark(k, c, on) {
    const n = this.nodes.get(k); if (!n) return;
    const color = Number(c);
    if (on) {
      if (color === 0) n.selected++;
      else if (color >= 1 && color <= 5) n[`selected${color}`] = true;
      else n.selected = 1;
    } else {
      n.selected = 0; for (let i = 1; i <= 5; i++) n[`selected${i}`] = false;
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