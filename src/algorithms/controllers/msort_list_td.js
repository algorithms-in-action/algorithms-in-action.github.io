// Animation of merge sort for linked lists (array representation), top-down approach.
// Visualizes both pointer-based and array-based representations simultaneously.
// Shows recursive splitting, merging, and pointer manipulation during the sort process.

import { msort_lista_td } from '../explanations';
import { colors } from '../../components/DataStructures/colors';
import { areExpanded } from './collapseChunkPlugin';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import LinkedListTracer from '../../components/DataStructures/LinkedList/LinkedListTracer';

const apColor = colors.apple;    // Comparing elements (table red)
const runAColor = colors.peach;  // Left sublist L   (table orange)
const runBColor = colors.sky;    // Right sublist R  (table blue)
const sortColor = colors.leaf;   // Merged/placed     (table green)
const doneColor = colors.stone;  // Completed

// ---------- Pointer-color mapping (must match LinkedListRenderer.module.scss variants) ----------
const ptrVariant = {
  runA: 'orange',   // L chain
  runB: 'blue',     // R chain
  merged: 'green',  // merged portion
  cmp: 'red',       // heads under comparison
  def: 'gray',      // default
};

// Global arrays that encode the linked list in table view
let Indices;      // ['i', 1..n]
let Heads;        // ['i.head (data)', ...]
let Tails;        // ['i.tail (next)', ...]
let simple_stack; // call stack text

// Target visibility table: which tag should be visible where (index or undefined)
const desiredTags = { L: undefined, R: undefined, M: undefined, E: undefined, Mid: undefined };

const run = run_msort();

export default {
  explanation: msort_lista_td,
  initVisualisers,
  run
};

// Whether recursion code blocks are expanded in UI (to show call stack)
function isRecursionExpanded() {
  return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

/* ------------------------------------------------------------------------------------------
   Tag helpers (only handle tag residue/sync; do not change algorithm logic)
   ------------------------------------------------------------------------------------------ */

// Remove a tag from both views
function removeTagEverywhere(vis, name) {
  vis.array.assignVariable(name, 2, undefined);
  vis.array.assignVariable(name + '=Null', 2, undefined);
  vis.list.nodes.forEach(node => {
    node.variables = node.variables.filter(v => v !== name && v !== (name + '=Null'));
  });
}

// Sync tag position in the table; also update desiredTags for pointer stacked badges
function syncVarToArray(vis, name, idx, { showEqualNull = false } = {}) {
  if (idx === 'Null' || idx === undefined) {
    vis.array.assignVariable(name, 2, undefined);
    if (showEqualNull && idx === 'Null') {
      vis.array.assignVariable(name + '=Null', 2, 0);
    } else {
      vis.array.assignVariable(name + '=Null', 2, undefined);
    }
  } else {
    vis.array.assignVariable(name, 2, idx);
    vis.array.assignVariable(name + '=Null', 2, undefined);
  }
  desiredTags[name] = (idx === 'Null' || idx === undefined) ? undefined : idx;
}

// Write stacked badges in pointer view so multiple tags on the same node won't overlap
function applyPointerTags(vis) {
  const names = Object.keys(desiredTags);
  // clear all existing badges/tags
  vis.list.nodes.forEach(node => {
    node.variables = node.variables.filter(v => !names.includes(v) && !v.includes('|'));
  });
  // bucket: index -> [tag names...]
  const buckets = new Map();
  names.forEach(name => {
    const idx = desiredTags[name];
    if (idx !== undefined && idx !== 'Null') {
      if (!buckets.has(idx)) buckets.set(idx, []);
      buckets.get(idx).push(name);
    }
  });
  // write one stacked badge per index
  buckets.forEach((tags, idx) => {
    const key = vis.list.indexToKey.get(idx);
    if (!key) return;
    const node = vis.list.nodes.get(key);
    if (!node) return;
    const stacked = tags.join('|');
    node.variables = (node.variables || []).filter(v => !names.includes(v) && !v.includes('|'));
    node.variables.push(stacked);
  });
}

// Strong guarantee to hide R everywhere (avoid residue)
function hideR(vis) {
  desiredTags.R = undefined;
  removeTagEverywhere(vis, 'R');
  applyPointerTags(vis);
}

/* ------------------------------------------------------------------------------------------
   Pointer COLOR helpers (keep pointer coloring = table coloring)
   These rely on LinkedListTracer extra methods:
   - setFillVariantByIndex(index, variantName)
   - colorChainByVariant(startIndex, variantName, Tails)
   - clearAllFillVariants()
   ------------------------------------------------------------------------------------------ */

/** Color an entire chain in pointer view by following Tails[] from startIndex. */
function colorPointerChain(vis, startIndex, variantName, Lists) {
  if (!startIndex || startIndex === 'Null') return;
  vis.list.colorChainByVariant(startIndex, variantName, Lists[2]);
}

/** Color the merged portion [M .. E] (inclusive) in pointer view as green. */
function colorPointerMerged(vis, M, E, Lists) {
  if (!M || M === 'Null') return;
  const T = Lists[2];
  for (let i = M; i !== 'Null'; i = T[i]) {
    vis.list.setFillVariantByIndex(i, ptrVariant.merged);
    if (i === E) break;
  }
}

/** Temporarily mark two heads (L and R) under comparison as red. */
function colorPointerCompareHeads(vis, Lidx, Ridx) {
  if (Lidx && Lidx !== 'Null') vis.list.setFillVariantByIndex(Lidx, ptrVariant.cmp);
  if (Ridx && Ridx !== 'Null') vis.list.setFillVariantByIndex(Ridx, ptrVariant.cmp);
}

/** Reset all pointer capsule fills back to gray (use when entering a new phase). */
function resetPointerColors(vis) {
  vis.list.clearAllFillVariants();
}

/* ---------------------------------------------------------------------------------------- */

function assignMaybeNullVar(vis, variable_name, index) {
  vis.array.assignVariable(variable_name, 2, undefined);
  vis.array.assignVariable(variable_name + '=Null', 2, undefined);
  if (index === 'Null') {
    vis.array.assignVariable(variable_name + '=Null', 2, 0);
  } else {
    vis.array.assignVariable(variable_name, 2, index);
  }
}

const set_simple_stack = (vis_array, c_stk) => {
  if (isRecursionExpanded()) vis_array.setList(c_stk);
};

// Table coloring (follow Tails)
function colorList(vis, startIndex, color, Lists) {
  const T = Lists[2];
  for (let i = startIndex; i !== 'Null'; i = T[i]) {
    vis.array.select(1, i, 1, i, color);
    vis.array.select(2, i, 2, i, color);
  }
}

// ---------- Init both visualizers ----------
export function initVisualisers() {
  return {
    array: {
      instance: new Array2DTracer('array', null, 'Array representation of linked list (Expand all code to see full animation)'),
      order: 1,
    },
    list: {
      instance: new LinkedListTracer('list', null, 'Pointer representation of linked list (Expand all code to see full animation)'),
      order: 0,
    },
  }
}

export function run_msort() {
  return function run(chunker, { nodes }) {
    const entire_num_array = nodes;
    let A = nodes;

    function initializeListStructure() {
      Indices = ['i'];
      Heads = ['i.head (data)'];
      Tails = ['i.tail (next)'];
      simple_stack = [];
      for (let i = 1; i <= entire_num_array.length; i++) {
        Indices.push(i);
        Heads.push(entire_num_array[i - 1]);
        Tails.push(i + 1);
      }
      Tails[entire_num_array.length] = 'Null';
    }

    function setupInitialVisualization(L, len, depth) {
      simple_stack.unshift('([' + Heads[L] + '..],' + len + ')');

      chunker.add('Main', (vis, Lists, cur_L, cur_len, cur_depth, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');

        if (cur_depth > 0) {
          hideAllNodes(vis);
          showList(vis, cur_L, Lists);
        } else {
          // initialize pointer view
          vis.list.set(entire_num_array, 'mergeSort list init');

          // --- NEW: make all nodes gray at start ---
          vis.list.colorChainByVariant(1, ptrVariant.def, Lists[2]);
        }

        // table: L label & color
        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'R', undefined);
        syncVarToArray(vis, 'M', undefined);
        syncVarToArray(vis, 'E', undefined);
        syncVarToArray(vis, 'Mid', undefined);
        applyPointerTags(vis);

        // table coloring (L orange)
        colorList(vis, cur_L, runAColor, Lists);

        // pointer: reset + color L orange
        resetPointerColors(vis);
        colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);

        set_simple_stack(vis.array, c_stk);
      }, [[Indices, Heads, Tails], L, len, depth, simple_stack], depth);

      chunker.add('len>1', (vis, Lists, cur_L, cur_len) => {
        // base-case check only
      }, [[Indices, Heads, Tails], L, len], depth);
    }


    function splitList(L, midNum, depth) {
      let Mid = L;

      chunker.add('Mid', (vis, Lists, cur_L, cur_Mid, c_stk) => {
        syncVarToArray(vis, 'Mid', cur_Mid);
        applyPointerTags(vis);
      }, [[Indices, Heads, Tails], L, Mid, simple_stack], depth);

      for (let i = 1; i < midNum; i++) Mid = Tails[Mid];

      let R = Tails[Mid];
      Tails[Mid] = 'Null';

      chunker.add('tail(Mid)<-Null', (vis, Lists, cur_L, cur_Mid, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        // table tags & colors
        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'Mid', cur_Mid);
        syncVarToArray(vis, 'R', cur_R);
        syncVarToArray(vis, 'M', undefined);
        syncVarToArray(vis, 'E', undefined);
        applyPointerTags(vis);

        vis.list.updateConnections(Lists[2]);
        showList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);

        // pointer: paint L orange, R blue
        resetPointerColors(vis);
        colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
        colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
      }, [[Indices, Heads, Tails], L, Mid, R, simple_stack], depth);

      return { L, R, Mid };
    }

    function moveRightHalfBelow(vis, leftStart, rightStart, Lists) {
      if (rightStart === 'Null') return;
      const T = Lists[2];
      const VERTICAL_GAP = 60;
      const leftKey = vis.list.indexToKey.get(leftStart);
      const firstLeftNode = vis.list.nodes.get(leftKey);
      const startX = firstLeftNode ? firstLeftNode.pos.x : 0;
      const startY = firstLeftNode ? firstLeftNode.pos.y + VERTICAL_GAP : VERTICAL_GAP;
      let xOffset = 0;
      for (let i = rightStart; i !== 'Null'; i = T[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) {
          vis.list.moveNodeTo(key, startX + xOffset, startY);
          xOffset += vis.list.layout.gap;
        }
      }
    }

    function performRecursiveSort(L, R, midNum, len, depth) {
      // ----- focus on left half -----
      chunker.add('preSortL', (vis, Lists, cur_L, cur_R, c_stk) => {
        syncVarToArray(vis, 'Mid', undefined);
        hideR(vis);

        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        syncVarToArray(vis, 'L', cur_L);
        applyPointerTags(vis);

        colorList(vis, cur_L, runAColor, Lists);

        // pointer: reset then keep L=orange
        resetPointerColors(vis);
        colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);

        moveRightHalfBelow(vis, cur_L, cur_R, Lists);
        hideList(vis, cur_R, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      L = MergeSort(L, midNum, depth + 1);

      // ----- left done -----
      chunker.add('sortL', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        hideR(vis);
        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'Mid', undefined);
        syncVarToArray(vis, 'M', undefined);
        syncVarToArray(vis, 'E', undefined);
        applyPointerTags(vis);

        colorList(vis, cur_L, runAColor, Lists);
        showList(vis, cur_L, Lists);

        // pointer: reset then L=orange
        resetPointerColors(vis);
        colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      // ----- focus on right half -----
      chunker.add('preSortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        syncVarToArray(vis, 'Mid', undefined);
        syncVarToArray(vis, 'L', undefined);
        syncVarToArray(vis, 'R', cur_R);
        syncVarToArray(vis, 'M', undefined);
        syncVarToArray(vis, 'E', undefined);
        applyPointerTags(vis);

        colorList(vis, cur_R, runBColor, Lists);
        hideList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);

        // pointer: reset then R=blue
        resetPointerColors(vis);
        colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      R = MergeSort(R, len - midNum, depth + 1);

      // ----- right done -----
      chunker.add('sortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'R', cur_R);
        syncVarToArray(vis, 'Mid', undefined);
        syncVarToArray(vis, 'M', undefined);
        syncVarToArray(vis, 'E', undefined);
        applyPointerTags(vis);

        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
        showList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);

        // pointer: both chains visible with their colors
        resetPointerColors(vis);
        colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
        colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      return { L, R };
    }

    // ----- pointer-show/hide helpers -----
    function hideAllNodes(vis) {
      vis.list.nodes.forEach((node, key) => {
        vis.list.hideByKey(key);
      });
    }
    function hideList(vis, startIndex, Lists) {
      if (startIndex === 'Null') return;
      const T = Lists[2];
      for (let i = startIndex; i !== 'Null'; i = T[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) vis.list.hideByKey(key);
      }
    }
    function showList(vis, startIndex, Lists) {
      if (startIndex === 'Null') return;
      const T = Lists[2];
      for (let i = startIndex; i !== 'Null'; i = T[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) vis.list.showByKey(key);
      }
    }

    // ----- merge: choose M -----
    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, Lists, cur_L, cur_R, c_stk) => {
        // table: mark heads red
        vis.array.deselect(1, cur_L);
        vis.array.select(1, cur_L, 1, cur_L, apColor);
        vis.array.deselect(1, cur_R);
        vis.array.select(1, cur_R, 1, cur_R, apColor);

        // pointer: keep chain colors + mark heads red
        resetPointerColors(vis);
        colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
        colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
        colorPointerCompareHeads(vis, cur_L, cur_R);

        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'R', cur_R);
        applyPointerTags(vis);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      if (Heads[L] <= Heads[R]) {
        M = L;

        chunker.add('M<-L', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          syncVarToArray(vis, 'M', cur_M);
          applyPointerTags(vis);

          // pointer: L orange, R blue, M green
          colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
          colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
          vis.list.setFillVariantByIndex(cur_M, ptrVariant.merged);
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);

        L = Tails[L];

        chunker.add('L<-tail(L)', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          syncVarToArray(vis, 'L', cur_L);
          applyPointerTags(vis);
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);

      } else {
        M = R;

        chunker.add('M<-R', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          syncVarToArray(vis, 'M', cur_M);
          applyPointerTags(vis);

          // pointer: L orange, R blue, M green
          colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
          colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
          vis.list.setFillVariantByIndex(cur_M, ptrVariant.merged);
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);

        R = Tails[R];

        chunker.add('R<-tail(R)', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          syncVarToArray(vis, 'R', cur_R);
          applyPointerTags(vis);
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);
      }

      return { M, L, R };
    }

    // ----- merge: extend M with the rest -----
    function mergeRemainingElements(L, R, M, depth) {
      let E = M;

      // seed E=M frame
      chunker.add('E', (vis, Lists, cur_L, cur_R, cur_M, cur_E, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'R', cur_R);
        syncVarToArray(vis, 'M', cur_M);
        syncVarToArray(vis, 'E', cur_E);
        applyPointerTags(vis);

        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);

        vis.array.select(1, cur_M, 1, cur_M, sortColor);
        vis.array.select(2, cur_M, 2, cur_M, sortColor);

        showList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);
        showList(vis, cur_M, Lists);
        vis.list.updateConnections(Lists[2]);

        // pointer: L orange, R blue, merged [M..E] green
        resetPointerColors(vis);
        colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
        colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
        colorPointerMerged(vis, cur_M, cur_E, Lists);
      }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);

      while (L !== 'Null' && R !== 'Null') {
        chunker.add('whileNotNull', (vis, Lists, cur_L, cur_R, cur_M, cur_E, c_stk) => {
          vis.array.set(Lists, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);

          syncVarToArray(vis, 'L', cur_L);
          syncVarToArray(vis, 'R', cur_R);
          syncVarToArray(vis, 'M', cur_M);
          syncVarToArray(vis, 'E', cur_E);
          applyPointerTags(vis);

          colorList(vis, cur_L, runAColor, Lists);
          colorList(vis, cur_R, runBColor, Lists);
          colorMergedList(vis, cur_M, cur_E, sortColor, Lists);
          vis.list.updateConnections(Lists[2]);

          // pointer: L orange, R blue, merged [M..E] green
          resetPointerColors(vis);
          colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
          colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
          colorPointerMerged(vis, cur_M, cur_E, Lists);
        }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);

        chunker.add('findSmaller', (vis, Lists, cur_L, cur_R, c_stk) => {
          // table: compare heads = red
          vis.array.deselect(1, cur_L);
          vis.array.select(1, cur_L, 1, cur_L, apColor);
          vis.array.deselect(1, cur_R);
          vis.array.select(1, cur_R, 1, cur_R, apColor);

          // pointer: keep chains then mark the two heads red
          colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
          colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
          colorPointerCompareHeads(vis, cur_L, cur_R);
        }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

        if (Heads[L] <= Heads[R]) {
          Tails[E] = L;  E = L;  L = Tails[L];
          addMergeVisualization('popL', L, R, M, E, depth);
        } else {
          Tails[E] = R;  E = R;  R = Tails[R];
          addMergeVisualization('popR', L, R, M, E, depth);
        }
      }

      if (L === 'Null') {
        Tails[E] = R;
        addFinalVisualization('appendR', M, depth);
      } else {
        Tails[E] = L;
        addFinalVisualization('appendL', M, depth);
      }

      return M;
    }

    function colorMergedList(vis, cur_M, cur_E, color, Lists) {
      const T = Lists[2];
      for (let i = cur_M; i !== cur_E; i = T[i]) {
        vis.array.select(1, i, 1, i, color);
        vis.array.select(2, i, 2, i, color);
      }
      if (cur_E !== 'Null') {
        vis.array.select(1, cur_E, 1, cur_E, color);
        vis.array.select(2, cur_E, 2, cur_E, color);
      }
    }

    function addMergeVisualization(stepName, L, R, M, E, depth) {
      chunker.add(stepName, (vis, Lists, cur_L, cur_R, cur_M, cur_E, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'R', cur_R);
        syncVarToArray(vis, 'M', cur_M);
        syncVarToArray(vis, 'E', cur_E);
        applyPointerTags(vis);

        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
        colorMergedList(vis, cur_M, cur_E, sortColor, Lists);
        vis.list.updateConnections(Lists[2]);

        // pointer: L orange, R blue, merged [M..E] green
        resetPointerColors(vis);
        colorPointerChain(vis, cur_L, ptrVariant.runA, Lists);
        colorPointerChain(vis, cur_R, ptrVariant.runB, Lists);
        colorPointerMerged(vis, cur_M, cur_E, Lists);
      }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);
    }

    function addFinalVisualization(stepName, M, depth) {
      chunker.add(stepName, (vis, Lists, cur_M, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        // Only keep M in both views
        syncVarToArray(vis, 'L', undefined);
        syncVarToArray(vis, 'R', undefined);
        syncVarToArray(vis, 'E', undefined);
        syncVarToArray(vis, 'Mid', undefined);
        syncVarToArray(vis, 'M', cur_M);
        hideR(vis);
        applyPointerTags(vis);

        colorList(vis, cur_M, sortColor, Lists);
        vis.list.updateConnections(Lists[2]);

        // pointer: at least M is green
        resetPointerColors(vis);
        colorPointerMerged(vis, cur_M, cur_M, Lists);
      }, [[Indices, Heads, Tails], M, simple_stack], depth);
    }

    function colorSingleNodePointer(vis, index, color) {
      if (index === 'Null') return;
      const map = { [apColor]: '2' }; // apColor -> selected2 (red outline)
      const state = map[color] || '2';
      vis.list.selectByIndex(index, state);
    }

    function MergeSort(L, len, depth) {
      setupInitialVisualization(L, len, depth);

      if (len > 1) {
        let midNum = Math.floor(len / 2);
        const { L: newL, R, Mid } = splitList(L, midNum, depth);
        const { L: sortedL, R: sortedR } = performRecursiveSort(newL, R, midNum, len, depth);
        const { M, L: remainingL, R: remainingR } = mergeHeads(sortedL, sortedR, depth);
        const mergedList = mergeRemainingElements(remainingL, remainingR, M, depth);

        chunker.add('returnM', (vis, Lists, cur_L, cur_M, c_stk, cur_depth) => {
          vis.array.set(Lists, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);

          syncVarToArray(vis, 'L', undefined);
          syncVarToArray(vis, 'R', undefined);
          syncVarToArray(vis, 'E', undefined);
          syncVarToArray(vis, 'Mid', undefined);
          syncVarToArray(vis, 'M', cur_M);
          hideR(vis);
          applyPointerTags(vis);

          colorList(vis, cur_M, sortColor, Lists);
          repositionMergedList(vis, cur_M, Lists, cur_depth);
          vis.list.updateConnections(Lists[2]);

          // pointer: entire merged chain green
          resetPointerColors(vis);
          colorPointerChain(vis, cur_M, ptrVariant.merged, Lists);
        }, [[Indices, Heads, Tails], newL, mergedList, simple_stack, depth], depth);

        simple_stack.shift();
        return mergedList;
      } else {
        chunker.add('returnL', (vis, a, cur_L) => {
          syncVarToArray(vis, 'Mid', undefined);
          syncVarToArray(vis, 'R', undefined);
          hideR(vis);
          applyPointerTags(vis);

          vis.array.select(1, cur_L, 1, cur_L, '1');
          vis.array.select(2, cur_L, 2, cur_L, '1');

          // pointer: single element considered placed (green)
          resetPointerColors(vis);
          vis.list.setFillVariantByIndex(cur_L, ptrVariant.merged);
        }, [A, L], depth);

        simple_stack.shift();
        return L;
      }
    }

    function repositionMergedList(vis, startIndex, Lists, depth) {
      if (startIndex === 'Null') return;
      const T = Lists[2];
      const mergedNodes = [];
      for (let i = startIndex; i !== 'Null'; i = T[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) mergedNodes.push({ index: i, key, node: vis.list.nodes.get(key) });
      }
      if (mergedNodes.length === 0) return;

      const leftmostX = Math.min(...mergedNodes.map(n => n.node.pos.x));
      const averageY = mergedNodes.reduce((s, n) => s + n.node.pos.y, 0) / mergedNodes.length;
      const NODE_GAP = 65;

      mergedNodes.forEach((item, position) => {
        const newX = leftmostX + (position * NODE_GAP);
        vis.list.moveNodeTo(item.key, newX, averageY);
      });
    }

    // ---- main ----
    initializeListStructure();
    const msresult = MergeSort(1, entire_num_array.length, 0);

    // Final: color all table cells as done
    let lastLine = (entire_num_array.length > 1 ? 'returnM' : 'returnL');
    chunker.add(lastLine, (vis, a) => {
      for (let i = 1; i <= entire_num_array.length; i++) {
        vis.array.select(1, i, 1, i, doneColor);
        vis.array.select(2, i, 2, i, doneColor);
      }
    }, [A], 1);

    return msresult;
  }
}
