// Animation of merge sort for linked lists (array representation), top-down approach.
// Visualizes both pointer-based and array-based representations simultaneously.
// Shows recursive splitting, merging, and pointer manipulation during the sort process.

import { msort_lista_td } from '../explanations';
import { colors } from '../../components/DataStructures/colors';
import { areExpanded } from './collapseChunkPlugin';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import LinkedListTracer from '../../components/DataStructures/LinkedList/LinkedListTracer';

const apColor = colors.apple;    // Comparing elements
const runAColor = colors.peach;  // Left sublist L
const runBColor = colors.sky;    // Right sublist R
const sortColor = colors.leaf;   // Sorted/merged elements
const doneColor = colors.stone;  // Completely finished

// Global variables for list representation
let Indices;      // ['i',    1,   2,   3,   4]
let Heads;        // ['data', 5,   3,   8,   1]
let Tails;        // ['next', 2,   3,   4,   'Null']
let simple_stack; // Call stack representation

// Target visibility table: which tags should be visible now (index or undefined)
const desiredTags = { L: undefined, R: undefined, M: undefined, E: undefined, Mid: undefined };

const run = run_msort();

export default {
  explanation: msort_lista_td,
  initVisualisers,
  run
};

// Check if user has expanded recursion sections in UI
function isRecursionExpanded() {
  return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

/* --------------------------------------------------------------------------
   Tag helpers (only handle tag residue/sync; do not change other logic)
   -------------------------------------------------------------------------- */

// Completely remove a tag from Array2D and Pointer views
function removeTagEverywhere(vis, name) {
  // Array view
  vis.array.assignVariable(name, 2, undefined);
  vis.array.assignVariable(name + '=Null', 2, undefined);

  // Pointer view
  vis.list.nodes.forEach(node => {
    node.variables = node.variables.filter(
      v => v !== name && v !== (name + '=Null')
    );
  });
}

// Sync a tag to Array2D (table). If idx is 'Null' or undefined, clear the tag in table.
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
  // Update target truth table as well
  desiredTags[name] = (idx === 'Null' || idx === undefined) ? undefined : idx;
}

// Apply desiredTags to Pointer view with "stacked badge" to avoid overlap.
// For each index, merge tag names into a single string like "L|R|M".
function applyPointerTags(vis) {
  // 1) Clear all tag names from every node
  const names = Object.keys(desiredTags);
  vis.list.nodes.forEach(node => {
    node.variables = node.variables.filter(v => !names.includes(v) && !v.includes('|'));
  });

  // 2) Build index -> [names...] buckets
  const buckets = new Map(); // key: index, value: array of names
  names.forEach(name => {
    const idx = desiredTags[name];
    if (idx !== undefined && idx !== 'Null') {
      if (!buckets.has(idx)) buckets.set(idx, []);
      buckets.get(idx).push(name);
    }
  });

  // 3) Write exactly one stacked badge per index to avoid overlap
  buckets.forEach((tags, idx) => {
    const key = vis.list.indexToKey.get(idx);
    if (!key) return;
    const node = vis.list.nodes.get(key);
    if (!node) return;

    // Merge names into one compact string (e.g., "L|R" or "L|M|E")
    const stacked = tags.join('|');

    // Replace variables with a single stacked badge
    node.variables = (node.variables || []).filter(v => !names.includes(v) && !v.includes('|'));
    node.variables.push(stacked);
  });
}

// Force-hide R everywhere (strong guarantee to prevent residue)
function hideR(vis) {
  desiredTags.R = undefined;
  removeTagEverywhere(vis, 'R');
  applyPointerTags(vis);
}

/* -------------------------------------------------------------------------- */

// (Kept for compatibility with some array frames)
function assignMaybeNullVar(vis, variable_name, index) {
  vis.array.assignVariable(variable_name, 2, undefined);
  vis.array.assignVariable(variable_name + '=Null', 2, undefined);
  if (index === 'Null') {
    vis.array.assignVariable(variable_name, 2, undefined);
    vis.array.assignVariable(variable_name + '=Null', 2, 0);
  } else {
    vis.array.assignVariable(variable_name, 2, index);
  }
}

/**
 * Display recursion call stack if expanded by user
 */
const set_simple_stack = (vis_array, c_stk) => {
  if (isRecursionExpanded()) {
    vis_array.setList(c_stk);
  }
}

/**
 * Color a chain of nodes in the array view by traversing next pointers
 */
function colorList(vis, startIndex, color, Lists) {
  const Tails = Lists[2];
  for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
    vis.array.select(1, i, 1, i, color);
    vis.array.select(2, i, 2, i, color);
  }
}

// Initialize both visualizers
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
          vis.list.set(entire_num_array, 'mergeSort list init');
        }

        // Table shows L; Pointer stacked badge mirrors L only (no overlap)
        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'R', undefined);
        syncVarToArray(vis, 'M', undefined);
        syncVarToArray(vis, 'E', undefined);
        syncVarToArray(vis, 'Mid', undefined);
        applyPointerTags(vis);

        colorList(vis, cur_L, runAColor, Lists);
        set_simple_stack(vis.array, c_stk);
      }, [[Indices, Heads, Tails], L, len, depth, simple_stack], depth);

      chunker.add('len>1', (vis, Lists, cur_L, cur_len) => {
        // No tag change
      }, [[Indices, Heads, Tails], L, len], depth);
    }

    function splitList(L, midNum, depth) {
      let Mid = L;

      // Show initial Mid at head
      chunker.add('Mid', (vis, Lists, cur_L, cur_Mid, c_stk) => {
        syncVarToArray(vis, 'Mid', cur_Mid);
        applyPointerTags(vis);
      }, [[Indices, Heads, Tails], L, Mid, simple_stack], depth);

      // Advance Mid pointer
      for (let i = 1; i < midNum; i++) {
        Mid = Tails[Mid];
      }

      let R = Tails[Mid];
      Tails[Mid] = 'Null';

      chunker.add('tail(Mid)<-Null', (vis, Lists, cur_L, cur_Mid, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        // Sync table tags; pointer uses stacked badge separately
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
      }, [[Indices, Heads, Tails], L, Mid, R, simple_stack], depth);

      return { L, R, Mid };
    }

    function moveRightHalfBelow(vis, leftStart, rightStart, Lists) {
      if (rightStart === 'Null') return;

      const Tails = Lists[2];
      const VERTICAL_GAP = 70;

      const leftKey = vis.list.indexToKey.get(leftStart);
      const firstLeftNode = vis.list.nodes.get(leftKey);
      const startX = firstLeftNode ? firstLeftNode.pos.x : 0;
      const startY = firstLeftNode ? firstLeftNode.pos.y + VERTICAL_GAP : VERTICAL_GAP;

      let xOffset = 0;
      for (let i = rightStart; i !== 'Null'; i = Tails[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) {
          vis.list.moveNodeTo(key, startX + xOffset, startY);
          xOffset += vis.list.layout.gap;
        }
      }
    }

    function performRecursiveSort(L, R, midNum, len, depth) {
      // Focus on left half
      chunker.add('preSortL', (vis, Lists, cur_L, cur_R, c_stk) => {
        syncVarToArray(vis, 'Mid', undefined);
        hideR(vis); // strong guarantee

        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        syncVarToArray(vis, 'L', cur_L);
        applyPointerTags(vis);

        vis.array.select(1, cur_L, 1, cur_L, runAColor);
        vis.array.select(2, cur_L, 2, cur_L, runAColor);

        moveRightHalfBelow(vis, cur_L, cur_R, Lists);
        hideList(vis, cur_R, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      L = MergeSort(L, midNum, depth + 1);

      // After left recursion returns
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
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      // Focus on right half
      chunker.add('preSortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        syncVarToArray(vis, 'Mid', undefined);
        syncVarToArray(vis, 'L', undefined);
        syncVarToArray(vis, 'R', cur_R);
        syncVarToArray(vis, 'M', undefined);
        syncVarToArray(vis, 'E', undefined);
        applyPointerTags(vis);

        vis.array.select(1, cur_R, 1, cur_R, runBColor);
        vis.array.select(2, cur_R, 2, cur_R, runBColor);

        hideList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      R = MergeSort(R, len - midNum, depth + 1);

      // After right recursion returns
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
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      return { L, R };
    }

    // Pointer view helpers
    function hideAllNodes(vis) {
      vis.list.nodes.forEach((node, key) => {
        vis.list.hideByKey(key);
      });
    }

    function hideList(vis, startIndex, Lists) {
      if (startIndex === 'Null') return;
      const Tails = Lists[2];
      for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) {
          vis.list.hideByKey(key);
        }
      }
    }

    function showList(vis, startIndex, Lists) {
      if (startIndex === 'Null') return;
      const Tails = Lists[2];
      for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) {
          vis.list.showByKey(key);
        }
      }
    }

    // Choose first head as M, advance one pointer
    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.deselect(1, cur_L);
        vis.array.select(1, cur_L, 1, cur_L, apColor);
        vis.array.deselect(1, cur_R);
        vis.array.select(1, cur_R, 1, cur_R, apColor);

        colorSingleNodePointer(vis, cur_L, apColor);
        colorSingleNodePointer(vis, cur_R, apColor);

        syncVarToArray(vis, 'L', cur_L);
        syncVarToArray(vis, 'R', cur_R);
        applyPointerTags(vis);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      if (Heads[L] <= Heads[R]) {
        M = L;

        chunker.add('M<-L', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          syncVarToArray(vis, 'M', cur_M);
          applyPointerTags(vis);
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
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);

        R = Tails[R];

        chunker.add('R<-tail(R)', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          syncVarToArray(vis, 'R', cur_R);
          applyPointerTags(vis);
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);
      }

      return { M, L, R };
    }

    function mergeRemainingElements(L, R, M, depth) {
      let E = M;

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
        }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);

        chunker.add('findSmaller', (vis, Lists, cur_L, cur_R, c_stk) => {
          vis.array.deselect(1, cur_L);
          vis.array.select(1, cur_L, 1, cur_L, apColor);
          vis.array.deselect(1, cur_R);
          vis.array.select(1, cur_R, 1, cur_R, apColor);

          if (cur_L !== 'Null') colorSingleNodePointer(vis, cur_L, apColor);
          if (cur_R !== 'Null') colorSingleNodePointer(vis, cur_R, apColor);
        }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

        if (Heads[L] <= Heads[R]) {
          Tails[E] = L;
          E = L;
          L = Tails[L];
          addMergeVisualization('popL', L, R, M, E, depth);
        } else {
          Tails[E] = R;
          E = R;
          R = Tails[R];
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
      const Tails = Lists[2];
      for (let i = cur_M; i !== cur_E; i = Tails[i]) {
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
        hideR(vis); // ensure no residue
        applyPointerTags(vis);

        colorList(vis, cur_M, sortColor, Lists);
        vis.list.updateConnections(Lists[2]);
      }, [[Indices, Heads, Tails], M, simple_stack], depth);
    }

    function colorSingleNodePointer(vis, index, color) {
      if (index === 'Null') return;
      const colorMapping = { [apColor]: '2' }; // apColor -> selected2 (red)
      const colorState = colorMapping[color] || '2';
      vis.list.selectByIndex(index, colorState);
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
        }, [A, L], depth);

        simple_stack.shift();
        return L;
      }
    }

    function repositionMergedList(vis, startIndex, Lists, depth) {
      if (startIndex === 'Null') return;

      const Tails = Lists[2];
      const mergedNodes = [];

      for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) {
          mergedNodes.push({ index: i, key, node: vis.list.nodes.get(key) });
        }
      }

      if (mergedNodes.length === 0) return;

      const leftmostX = Math.min(...mergedNodes.map(n => n.node.pos.x));
      const averageY = mergedNodes.reduce((sum, n) => sum + n.node.pos.y, 0) / mergedNodes.length;
      const NODE_GAP = 65;

      mergedNodes.forEach((item, position) => {
        const newX = leftmostX + (position * NODE_GAP);
        vis.list.moveNodeTo(item.key, newX, averageY);
      });
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // Main execution
    initializeListStructure();
    const msresult = MergeSort(1, entire_num_array.length, 0);

    // Final step: mark entire list as complete
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
