// Animation of merge sort for linked lists, top-down approach (POINTER-ONLY)
// Visualizes pointer-based representation only. Array UI has been fully removed.
// Shows recursive splitting, merging, and pointer manipulation during the sort process.

import { msort_lista_td } from '../explanations';
import LinkedListTracer from '../../components/DataStructures/LinkedList/LinkedListTracer';

// ---------- Pointer-color mapping (must match LinkedListRenderer.module.scss variants) ----------
const ptrVariant = {
  runA: 'orange',   // L chain
  runB: 'blue',     // R chain
  merged: 'green',  // merged portion
  cmp: 'red',       // heads under comparison
  def: 'gray',      // default
};

// Internal data arrays encoding the linked list structure (NOT UI, don't delete)
let Heads;        // ['i.head (data)', ...]
let Tails;        // ['i.tail (next)', ...]

// Target visibility table: which tag should be visible where (index or undefined)
// NOTE: desiredTags remains here (we are NOT moving tags into tracer per user request).
const desiredTags = { L: undefined, R: undefined, M: undefined, E: undefined, Mid: undefined };

// Keep last vis for explicit redraws
let __currentVis = null; // holds the latest vis object for applyPointerTags
function setCurrentVis(vis) { __currentVis = vis; }

// Pointer-only tag assign helper (pure setter; redraws are explicit per-frame)
function setTag(name, idx) {
  desiredTags[name] = (idx === 'Null' || idx === undefined) ? undefined : idx;
}

// Remove a tag from pointer view (no array UI remains)
function removeTagEverywhere(vis, name) {
  vis.list.nodes.forEach(node => {
    node.variables = node.variables.filter(v => v !== name && v !== (name + '=Null'));
  });
}

// Write stacked badges in pointer view so multiple tags on the same node won't overlap
function applyPointerTags(vis) {
  const names = Object.keys(desiredTags);
  // clear all existing badges/tags (including legacy single-name badges and stacked ones)
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

// ---------- Init visualiser (pointer only) ----------
export function initVisualisers() {
  return {
    list: {
      instance: new LinkedListTracer('list', null, 'Pointer representation of linked list (Expand all code to see full animation)'),
      order: 0,
    },
  }
}

export function run_msort() {
  return function run(chunker, { nodes }) {
    const entire_num_array = nodes;

    function initializeListStructure() {
      Heads = ['i.head (data)'];
      Tails = ['i.tail (next)'];
      for (let i = 1; i <= entire_num_array.length; i++) {
        Heads.push(entire_num_array[i - 1]);
        Tails.push(i + 1);
      }
      Tails[entire_num_array.length] = 'Null';
    }

    function setupInitialVisualization(L, len, depth) {
      chunker.add('Main', (vis, T, cur_L, cur_len, cur_depth) => {
        setCurrentVis(vis); // keep vis available for tag rendering

        if (cur_depth > 0) {
          vis.list.hideAll();
          vis.list.showChain(cur_L, T);
        } else {
          // initialize pointer view
          vis.list.set(entire_num_array, 'mergeSort list init');
          // make all nodes gray at start
          vis.list.colorChain(1, ptrVariant.def, T);
        }

        // tags
        setTag('L', cur_L);
        setTag('R', undefined);
        setTag('M', undefined);
        setTag('E', undefined);
        setTag('Mid', undefined);
        applyPointerTags(vis);

        // pointer: reset + color L orange
        vis.list.resetColors();
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
      }, [Tails, L, len, depth], depth);

      chunker.add('len>1', (vis) => {
        setCurrentVis(vis);
        // base-case check only
      }, [], depth);
    }

    function splitList(L, midNum, depth) {
      let Mid = L;

      chunker.add('Mid', (vis, T, cur_L, cur_Mid) => {
        setCurrentVis(vis);
        setTag('Mid', cur_Mid);
        applyPointerTags(vis);
        vis.list.resetColors();
      }, [Tails, L, Mid], depth);

      for (let i = 1; i < midNum; i++) Mid = Tails[Mid];

      let R = Tails[Mid];
      Tails[Mid] = 'Null';

      chunker.add('tail(Mid)<-Null', (vis, T, cur_L, cur_Mid, cur_R) => {
        setCurrentVis(vis);
        // tags
        setTag('L', cur_L);
        setTag('Mid', cur_Mid);
        setTag('R', cur_R);
        setTag('M', undefined);
        setTag('E', undefined);
        applyPointerTags(vis);

        vis.list.updateConnections(T);
        vis.list.showChain(cur_L, T);
        vis.list.showChain(cur_R, T);

        // pointer: paint L orange, R blue
        vis.list.resetColors();
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
        vis.list.colorChain(cur_R, ptrVariant.runB, T);
      }, [Tails, L, Mid, R], depth);

      return { L, R, Mid };
    }

    function performRecursiveSort(L, R, midNum, len, depth) {
      // ----- focus on left half -----
      chunker.add('preSortL', (vis, T, cur_L, cur_R) => {
        setCurrentVis(vis);
        setTag('Mid', undefined);
        hideR(vis);
        setTag('L', cur_L);
        applyPointerTags(vis);

        // pointer: reset then keep L=orange; move R below & hide R chain
        vis.list.resetColors();
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
        vis.list.moveChainBelow(cur_L, cur_R, T);
        vis.list.hideChain(cur_R, T);
      }, [Tails, L, R], depth);

      L = MergeSort(L, midNum, depth + 1);

      // ----- left done -----
      chunker.add('sortL', (vis, T, cur_L) => {
        setCurrentVis(vis);
        hideR(vis);
        setTag('L', cur_L);
        setTag('Mid', undefined);
        setTag('M', undefined);
        setTag('E', undefined);
        applyPointerTags(vis);

        // show L chain and color it
        vis.list.showChain(cur_L, T);
        vis.list.resetColors();
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
      }, [Tails, L], depth);

      // ----- focus on right half -----
      chunker.add('preSortR', (vis, T, cur_L, cur_R) => {
        setCurrentVis(vis);
        setTag('Mid', undefined);
        setTag('L', undefined);
        setTag('R', cur_R);
        setTag('M', undefined);
        setTag('E', undefined);
        applyPointerTags(vis);

        // hide L chain, show R chain and color it
        vis.list.hideChain(cur_L, T);
        vis.list.showChain(cur_R, T);
        vis.list.resetColors();
        vis.list.colorChain(cur_R, ptrVariant.runB, T);
      }, [Tails, L, R], depth);

      R = MergeSort(R, len - midNum, depth + 1);

      // ----- right done -----
      chunker.add('sortR', (vis, T, cur_L, cur_R) => {
        setCurrentVis(vis);
        setTag('L', cur_L);
        setTag('R', cur_R);
        setTag('Mid', undefined);
        setTag('M', undefined);
        setTag('E', undefined);
        applyPointerTags(vis);

        vis.list.showChain(cur_L, T);
        vis.list.showChain(cur_R, T);
        vis.list.resetColors();
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
        vis.list.colorChain(cur_R, ptrVariant.runB, T);
      }, [Tails, L, R], depth);

      return { L, R };
    }

    // ----- merge: choose M -----
    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, T, cur_L, cur_R) => {
        setCurrentVis(vis);

        // pointer: keep chain colors + mark heads red (via tracer API)
        vis.list.resetColors();
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
        vis.list.colorChain(cur_R, ptrVariant.runB, T);
        vis.list.highlightHeads(cur_L, cur_R);

        setTag('L', cur_L);
        setTag('R', cur_R);
        applyPointerTags(vis);
      }, [Tails, L, R], depth);

      if (Heads[L] <= Heads[R]) {
        M = L;

        chunker.add('M<-L', (vis, T, cur_L, cur_R, cur_M) => {
          setCurrentVis(vis);
          setTag('M', cur_M);
          applyPointerTags(vis);

          vis.list.colorChain(cur_L, ptrVariant.runA, T);
          vis.list.colorChain(cur_R, ptrVariant.runB, T);
          vis.list.colorMerged(cur_M, cur_M, T);
        }, [Tails, L, R, M], depth);

        L = Tails[L];

        chunker.add('L<-tail(L)', (vis, T, cur_L, cur_R, cur_M) => {
          setCurrentVis(vis);
          setTag('L', cur_L);
          applyPointerTags(vis);
        }, [Tails, L, R, M], depth);

      } else {
        M = R;

        chunker.add('M<-R', (vis, T, cur_L, cur_R, cur_M) => {
          setCurrentVis(vis);
          setTag('M', cur_M);
          applyPointerTags(vis);

          vis.list.colorChain(cur_L, ptrVariant.runA, T);
          vis.list.colorChain(cur_R, ptrVariant.runB, T);
          vis.list.colorMerged(cur_M, cur_M, T);
        }, [Tails, L, R, M], depth);

        R = Tails[R];

        chunker.add('R<-tail(R)', (vis, T, cur_L, cur_R, cur_M) => {
          setCurrentVis(vis);
          setTag('R', cur_R);
          applyPointerTags(vis);
        }, [Tails, L, R, M], depth);
      }

      return { M, L, R };
    }

    // ----- merge: extend M with the rest -----
    function mergeRemainingElements(L, R, M, depth) {
      let E = M;

      // seed E=M frame
      chunker.add('E', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
        setCurrentVis(vis);

        setTag('L', cur_L);
        setTag('R', cur_R);
        setTag('M', cur_M);
        setTag('E', cur_E);
        applyPointerTags(vis);

        vis.list.showChain(cur_L, T);
        vis.list.showChain(cur_R, T);
        vis.list.showChain(cur_M, T);
        vis.list.updateConnections(T);

        vis.list.resetColors();
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
        vis.list.colorChain(cur_R, ptrVariant.runB, T);
        vis.list.colorMerged(cur_M, cur_E, T);
      }, [Tails, L, R, M, E], depth);

      while (L !== 'Null' && R !== 'Null') {
        chunker.add('whileNotNull', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
          setCurrentVis(vis);

          setTag('L', cur_L);
          setTag('R', cur_R);
          setTag('M', cur_M);
          setTag('E', cur_E);
          applyPointerTags(vis);

          vis.list.updateConnections(T);
          vis.list.resetColors();
          vis.list.colorChain(cur_L, ptrVariant.runA, T);
          vis.list.colorChain(cur_R, ptrVariant.runB, T);
          vis.list.colorMerged(cur_M, cur_E, T);
        }, [Tails, L, R, M, E], depth);

        if (Heads[L] <= Heads[R]) {
          Tails[E] = L; E = L; L = Tails[L];
        } else {
          Tails[E] = R; E = R; R = Tails[R];
        }
      }

      if (L === 'Null') {
        Tails[E] = R;
      } else {
        Tails[E] = L;
      }

      return M;
    }

    function MergeSort(L, len, depth) {
      setupInitialVisualization(L, len, depth);

      if (len > 1) {
        let midNum = Math.floor(len / 2);
        const { L: newL, R, Mid } = splitList(L, midNum, depth);
        const { L: sortedL, R: sortedR } = performRecursiveSort(newL, R, midNum, len, depth);
        const { M, L: remainingL, R: remainingR } = mergeHeads(sortedL, sortedR, depth);
        const mergedList = mergeRemainingElements(remainingL, remainingR, M, depth);

        chunker.add('returnM', (vis, T, cur_L, cur_M) => {
          setCurrentVis(vis);

          setTag('L', undefined);
          setTag('R', undefined);
          setTag('E', undefined);
          setTag('Mid', undefined);
          setTag('M', cur_M);
          hideR(vis);
          applyPointerTags(vis);

          vis.list.resetColors();
          vis.list.colorChain(cur_M, ptrVariant.merged, T);
          vis.list.repositionMergedChain(cur_M, T);

          vis.list.updateConnections(T);
        }, [Tails, newL, mergedList], depth);

        return mergedList;
      } else {
        chunker.add('returnL', (vis, T, cur_L) => {
          setCurrentVis(vis);
          setTag('Mid', undefined);
          setTag('R', undefined);
          hideR(vis);
          applyPointerTags(vis);

          vis.list.resetColors();
          vis.list.colorMerged(cur_L, cur_L, Tails);
        }, [Tails, L], depth);

        return L;
      }
    }

    // ---- main ----
    initializeListStructure();
    const msresult = MergeSort(1, entire_num_array.length, 0);

    // reset pointer colors once (array UI removed)
    const lastLine = (entire_num_array.length > 1 ? 'returnM' : 'returnL');
    chunker.add(lastLine, (vis) => {
      vis.list.resetColors();
    }, [], 1);

    return msresult;
  }
}

export default {
  explanation: msort_lista_td,
  initVisualisers,
  run: run_msort()
};
