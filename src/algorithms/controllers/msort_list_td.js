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

// New helper to simplify repeated color logic
function colorRuns(vis, L, R, T) {
  vis.list.resetColors(ptrVariant.def);
  if (L && L !== 'Null') vis.list.colorChain(L, ptrVariant.runA, T);
  if (R && R !== 'Null') vis.list.colorChain(R, ptrVariant.runB, T);
}

// Internal data arrays encoding the linked list structure (NOT UI, don't delete)
let Heads;        // ['i.head (data)', ...]
let Tails;        // ['i.tail (next)', ...]

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

        if (cur_depth > 0) {
          vis.list.hideAll();
          vis.list.showChain(cur_L, T);
        } else {
          vis.list.set(entire_num_array, 'mergeSort list init');
          vis.list.colorChain(1, ptrVariant.def, T);
        }

        // tags
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);
        vis.list.assignTag('Mid', undefined);

        // pointer: reset + color L orange
        vis.list.resetColors(ptrVariant.def);
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
      }, [Tails, L, len, depth], depth);

      chunker.add('len>1', () => { }, [], depth);
    }

    function splitList(L, midNum, depth) {
      // 1️⃣ Show Mid <- L (bookmark: Mid)
      let Mid = L;
      chunker.add('Mid', (vis, T, cur_L, cur_Mid) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('Mid', cur_Mid);
        vis.list.assignTag('R', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.showChain(cur_L, T);
        vis.list.updateConnections(T);
        vis.list.resetColors(ptrVariant.def);
        vis.list.colorChain(cur_L, ptrVariant.runA, T);
      }, [Tails, L, Mid], depth);

      // 2️⃣ Animate Mid walking through list: Mid <- Mid.tail (bookmark: MidNext)
      for (let i = 1; i < midNum; i++) {
        Mid = Tails[Mid];

        chunker.add('MidNext', (vis, T, cur_L, cur_Mid) => {
          vis.list.assignTag('L', cur_L);
          vis.list.assignTag('Mid', cur_Mid);
          vis.list.assignTag('R', undefined);
          vis.list.assignTag('M', undefined);
          vis.list.assignTag('E', undefined);

          vis.list.showChain(cur_L, T);
          vis.list.updateConnections(T);
          vis.list.resetColors(ptrVariant.def);
          vis.list.colorChain(cur_L, ptrVariant.runA, T);

          // Optional visual emphasis:
          vis.list.highlightHeads(cur_Mid, undefined, ptrVariant.cmp);
        }, [Tails, L, Mid], depth);
      }

      // 3️⃣ Split step 1: R <- Mid.tail (bookmark: R<-tail(Mid))
      let R = Tails[Mid];
      chunker.add('R<-tail(Mid)', (vis, T, cur_L, cur_Mid, cur_R) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('Mid', cur_Mid);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.updateConnections(T);
        vis.list.showChain(cur_L, T);
        if (cur_R && cur_R !== 'Null') vis.list.showChain(cur_R, T);

        vis.list.resetColors(ptrVariant.def);
        if (cur_L && cur_L !== 'Null') vis.list.colorChain(cur_L, ptrVariant.runA, T);
        if (cur_R && cur_R !== 'Null') vis.list.colorChain(cur_R, ptrVariant.runB, T);
      }, [Tails, L, Mid, R], depth);

      // 4️⃣ Split step 2: Mid.tail <- Null (bookmark: tail(Mid)<-Null)
      Tails[Mid] = 'Null';
      chunker.add('tail(Mid)<-Null', (vis, T, cur_L, cur_Mid, cur_R) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('Mid', cur_Mid);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.updateConnections(T);
        vis.list.showChain(cur_L, T);
        if (cur_R && cur_R !== 'Null') vis.list.showChain(cur_R, T);

        vis.list.resetColors(ptrVariant.def);
        if (cur_L && cur_L !== 'Null') vis.list.colorChain(cur_L, ptrVariant.runA, T);
        if (cur_R && cur_R !== 'Null') vis.list.colorChain(cur_R, ptrVariant.runB, T);
      }, [Tails, L, Mid, R], depth);

      return { L, R, Mid };
    }


    function performRecursiveSort(L, R, midNum, len, depth) {

      // ----- focus left -----
      chunker.add('preSortL', (vis, T, cur_L, cur_R) => {

        vis.list.assignTag('Mid', undefined);
        vis.list.hideTag('R');
        vis.list.assignTag('L', cur_L);

        colorRuns(vis, cur_L, undefined, T);

        vis.list.moveChainBelow(cur_L, cur_R, T);
        vis.list.hideChain(cur_R, T);
      }, [Tails, L, R], depth);

      L = MergeSort(L, midNum, depth + 1);

      chunker.add('sortL', (vis, T, cur_L) => {

        vis.list.hideTag('R');
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.showChain(cur_L, T);
        colorRuns(vis, cur_L, undefined, T);
      }, [Tails, L], depth);

      // ----- focus right -----
      chunker.add('preSortR', (vis, T, cur_L, cur_R) => {

        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('L', undefined);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.hideChain(cur_L, T);
        vis.list.showChain(cur_R, T);
        colorRuns(vis, undefined, cur_R, T);
      }, [Tails, L, R], depth);

      R = MergeSort(R, len - midNum, depth + 1);

      chunker.add('sortR', (vis, T, cur_L, cur_R) => {

        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.showChain(cur_L, T);
        vis.list.showChain(cur_R, T);
        colorRuns(vis, cur_L, cur_R, T);
      }, [Tails, L, R], depth);

      return { L, R };
    }

    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, T, cur_L, cur_R) => {

        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);

        colorRuns(vis, cur_L, cur_R, T);
        vis.list.highlightHeads(cur_L, cur_R, ptrVariant.cmp);
      }, [Tails, L, R], depth);

      if (Heads[L] <= Heads[R]) {
        M = L;

        chunker.add('M<-L', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('M', cur_M);

          colorRuns(vis, cur_L, cur_R, T);
          vis.list.colorMerged(cur_M, cur_M, ptrVariant.merged, T);
        }, [Tails, L, R, M], depth);

        L = Tails[L];

        chunker.add('L<-tail(L)', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('L', cur_L);
        }, [Tails, L, R, M], depth);

      } else {
        M = R;

        chunker.add('M<-R', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('M', cur_M);

          colorRuns(vis, cur_L, cur_R, T);
          vis.list.colorMerged(cur_M, cur_M, ptrVariant.merged, T);
        }, [Tails, L, R, M], depth);

        R = Tails[R];

        chunker.add('R<-tail(R)', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('R', cur_R);
        }, [Tails, L, R, M], depth);
      }

      return { M, L, R };
    }

    function mergeRemainingElements(L, R, M, depth) {
      let E = M;

      // seed E=M frame
      chunker.add('E', (vis, T, cur_L, cur_R, cur_M, cur_E) => {

        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('M', cur_M);
        vis.list.assignTag('E', cur_E);

        vis.list.showChain(cur_L, T);
        vis.list.showChain(cur_R, T);
        vis.list.showChain(cur_M, T);
        vis.list.updateConnections(T);

        colorRuns(vis, cur_L, cur_R, T);
        vis.list.colorMerged(cur_M, cur_E, ptrVariant.merged, T);
      }, [Tails, L, R, M, E], depth);

      while (L !== 'Null' && R !== 'Null') {
        chunker.add('whileNotNull', (vis, T, cur_L, cur_R, cur_M, cur_E) => {

          vis.list.assignTag('L', cur_L);
          vis.list.assignTag('R', cur_R);
          vis.list.assignTag('M', cur_M);
          vis.list.assignTag('E', cur_E);

          vis.list.updateConnections(T);
          colorRuns(vis, cur_L, cur_R, T);
          vis.list.colorMerged(cur_M, cur_E, ptrVariant.merged, T);
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
        const { L: newL, R, Mid } =
          splitList(L, midNum, depth);
        const { L: sortedL, R: sortedR } =
          performRecursiveSort(newL, R, midNum, len, depth);
        const { M, L: remainingL, R: remainingR } =
          mergeHeads(sortedL, sortedR, depth);
        const mergedList =
          mergeRemainingElements(remainingL, remainingR, M, depth);

        chunker.add('returnM', (vis, T, cur_L, cur_M) => {

          vis.list.assignTag('L', undefined);
          vis.list.assignTag('R', undefined);
          vis.list.assignTag('E', undefined);
          vis.list.assignTag('Mid', undefined);
          vis.list.assignTag('M', cur_M);

          vis.list.resetColors(ptrVariant.def);
          vis.list.colorChain(cur_M, ptrVariant.merged, T);

          vis.list.repositionMergedChain(cur_M, T);
          vis.list.updateConnections(T);
        }, [Tails, newL, mergedList], depth);

        return mergedList;
      } else {
        chunker.add('returnL', (vis, T, cur_L) => {

          vis.list.assignTag('Mid', undefined);
          vis.list.assignTag('R', undefined);
          vis.list.hideTag('R');

          vis.list.resetColors(ptrVariant.def);
          vis.list.colorMerged(cur_L, cur_L, ptrVariant.merged, Tails);
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
      vis.list.resetColors(ptrVariant.def);
    }, [], 1);

    return msresult;
  }
}

export default {
  explanation: msort_lista_td,
  initVisualisers,
  run: run_msort()
};
