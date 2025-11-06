/**
 * Merge Sort Linked List Animation — Bookmark & Chunker Guide
 * -----------------------------------------------------------
 *
 * This file implements the animated merge sort process for a linked list
 * using a direct mapping between the algorithm pseudocode and chunked
 * animation steps.
 *
 * Every chunker.add() call corresponds to a pseudocode "bookmark" label:
 *   - \\B <BookmarkName>  in the pseudocode
 *   - chunker.add('<BookmarkName>', ...) in this file
 *
 * Maintaining a 1:1 mapping ensures:
 *   1) The animation always follows the exact published algorithm flow
 *   2) The step navigation UI correctly aligns with algorithm theory
 *
 * -----------------------------------------------------------
 * How to Add or Modify Animation Steps
 * -----------------------------------------------------------
 * 1. Open the pseudocode in: src/algorithms/pseudocode/msort_list_td.js
 *    Search for \\B or \\Ref to find the canonical bookmark name.
 *
 * 2. Add (or update) a chunker.add() step in this file
 *    The bookmark string must match exactly.
 * 
 * -----------------------------------------------------------
 * Tags and Pointers Used
 * -----------------------------------------------------------
 * L   Remaining left sublist to merge
 * R   Remaining right sublist to merge
 * M   First element of the merged chain (head of result)
 * E   Current end of merged chain (tail pointer)
 *
 * -----------------------------------------------------------
 * Colors
 * -----------------------------------------------------------
 * runA   Orange = current L chain
 * runB   Blue = current R chain
 * merged Green = already merged portion (M..E)
 * cmp    Red = elements under comparison (heads of L and R)
 * def    Gray = default/idle color
 *
 * Important:
 *   Do visual updates after pointer updates.
 *   Call vis.list.updateConnections(T) after mutating Tails.
 *
 * -----------------------------------------------------------
 * Bookmark → Visual Mapping
 * -----------------------------------------------------------
 * Bookmark              UI
 * -----------------------------------------------------------
 * Main                  Show full list initially
 * len>1                 Check for recursion condition
 * Mid                   Place Mid pointer at head (start scan)
 * MidNext               Move Mid to its tail during split scan
 * R<-tail(Mid)          Show R starting at Mid.tail
 * tail(Mid)<-Null       Visually split list at Mid
 *
 * preSortL              Focus on L (hide right)
 * sortL                 Show sorted result of left recursion
 * preSortR              Focus on R (hide left)
 * sortR                 Show sorted result of right recursion
 *
 * compareHeads          Highlight L.head and R.head for comparison
 * M<-L                  Set merged head from L
 * L<-tail(L)            Advance pointer L after selecting L.head
 * M<-R                  Set merged head from R
 * R<-tail(R)            Advance pointer R after selecting R.head
 *
 * E                     Initialize E = M
 * whileNotNull          Loop while both lists still have elements
 * findSmaller           Decide which list contributes next element
 *
 * E.tail<-L             Append L.head to merged chain
 * E<-L                  Move E to follow appended element
 * popL                  Advance L after append
 *
 * E.tail<-R             Append R.head to merged chain
 * E<-R                  Move E to follow appended element
 * popR                  Advance R after append
 *
 * appendR               Append remaining R when L is Null
 * appendL               Append remaining L when R is Null
 *
 * returnM               Final merged list returned upward recursion
 *
 * -----------------------------------------------------------
 * Notes
 * -----------------------------------------------------------
 * • Each mutation of (L, R, E, M, Tails) must be followed by a chunk.
 * • Avoid adding chunks that do not exist in the pseudocode.
 *
 * If pseudocode changes, update the chunk order to match.
 */


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
      chunker.add('Main', (vis, T, cur_L, _cur_len, cur_depth) => {

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
        vis.list.resetColors();
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
        vis.list.resetColors();
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
          vis.list.resetColors();
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

        vis.list.resetColors();
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

        vis.list.resetColors();
        if (cur_L && cur_L !== 'Null') vis.list.colorChain(cur_L, ptrVariant.runA, T);
        if (cur_R && cur_R !== 'Null') vis.list.colorChain(cur_R, ptrVariant.runB, T);
      }, [Tails, L, Mid, R], depth);

      return { L, R, Mid };
    }


    function performRecursiveSort(L, R, midNum, len, depth) {

      // ----- focus left -----
      chunker.add('preSortL', (vis, T, cur_L, cur_R) => {

        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('R', undefined);
        vis.list.assignTag('L', cur_L);

        vis.list.colorChains(cur_L, undefined, T);

        vis.list.moveChainBelow(cur_L, cur_R, T);
        vis.list.hideChain(cur_R, T);
      }, [Tails, L, R], depth);

      L = MergeSort(L, midNum, depth + 1);

      chunker.add('sortL', (vis, T, cur_L) => {

        vis.list.assignTag('R', undefined);
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.showChain(cur_L, T);
        vis.list.colorChains(cur_L, undefined, T);
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
        vis.list.colorChains(undefined, cur_R, T);
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
        vis.list.colorChains(cur_L, cur_R, T);
      }, [Tails, L, R], depth);

      return { L, R };
    }

    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, T, cur_L, cur_R) => {

        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);

        vis.list.colorChains(cur_L, cur_R, T);
        vis.list.highlightHeads(cur_L, cur_R);
      }, [Tails, L, R], depth);

      if (Heads[L] < Heads[R]) {
        M = L;

        chunker.add('M<-L', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('M', cur_M);

          vis.list.colorChains(cur_L, cur_R, T);
          vis.list.colorMerged(cur_M, cur_M, T);
        }, [Tails, L, R, M], depth);

        L = Tails[L];

        chunker.add('L<-tail(L)', (vis, _T, cur_L, _cur_R, _cur_M) => {
          vis.list.assignTag('L', cur_L);
        }, [Tails, L, R, M], depth);

      } else {
        M = R;

        chunker.add('M<-R', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('M', cur_M);

          vis.list.colorChains(cur_L, cur_R, T);
          vis.list.colorMerged(cur_M, cur_M, T);
        }, [Tails, L, R, M], depth);

        R = Tails[R];

        chunker.add('R<-tail(R)', (vis, _T, _cur_L, cur_R, _cur_M) => {
          vis.list.assignTag('R', cur_R);
        }, [Tails, L, R, M], depth);
      }

      return { M, L, R };
    }

    function mergeRemainingElements(L, R, M, depth) {
      // Merge the rest of L and R starting from M
      let E = M;

      // Bookmark: E <- M
      chunker.add('E', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('M', cur_M);
        vis.list.assignTag('E', cur_E);

        vis.list.updateConnections(T);
        vis.list.colorChains(cur_L, cur_R, T);
        vis.list.colorMerged(cur_M, cur_E, T);
      }, [Tails, L, R, M, E], depth);


      // ---------- WHILE LOOP ----------
      while (L !== 'Null' && R !== 'Null') {

        // Bookmark: while L != Null && R != Null
        chunker.add('whileNotNull', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
          vis.list.assignTag('L', cur_L);
          vis.list.assignTag('R', cur_R);
          vis.list.assignTag('M', cur_M);
          vis.list.assignTag('E', cur_E);

          vis.list.updateConnections(T);
          vis.list.colorChains(cur_L, cur_R, T);
          vis.list.highlightHeads(cur_L, cur_R);
          vis.list.colorMerged(cur_M, cur_E, T);
        }, [Tails, L, R, M, E], depth);

        // Bookmark: findSmaller
        chunker.add('findSmaller', (vis, _T, cur_L, cur_R) => {
          vis.list.assignTag('L', cur_L);
          vis.list.assignTag('R', cur_R);
          vis.list.highlightHeads(cur_L, cur_R);
        }, [Tails, L, R], depth);

        if (Heads[L] <= Heads[R]) {
          // Bookmark: E.tail <- L, E <- L, L <- L.tail
          // Bookmark: E.tail <- L
          Tails[E] = L;
          chunker.add('E.tail<-L', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
            vis.list.assignTag('L', cur_L);
            vis.list.assignTag('R', cur_R);
            vis.list.assignTag('M', cur_M);
            vis.list.assignTag('E', cur_E);
            vis.list.unhighlightHeads(cur_L, cur_R);
            vis.list.updateConnections(T);
            vis.list.colorMerged(cur_M, cur_E, T);
          }, [Tails, L, R, M, E], depth);

          // Bookmark: E <- L
          E = L;
          chunker.add('E<-L', (vis, T, _cur_L, _cur_R, cur_M, cur_E) => {
            vis.list.assignTag('E', cur_E);
            vis.list.colorMerged(cur_M, cur_E, T);
          }, [Tails, L, R, M, E], depth);

          // Bookmark: L <- L.tail
          L = Tails[L];
          chunker.add('popL', (vis, _T, cur_L) => {
            vis.list.assignTag('L', cur_L);
          }, [Tails, L], depth);


        } else {
          // Bookmark: E.tail <- R
          Tails[E] = R;
          chunker.add('E.tail<-R', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
            vis.list.assignTag('L', cur_L);
            vis.list.assignTag('R', cur_R);
            vis.list.assignTag('M', cur_M);
            vis.list.assignTag('E', cur_E);
            vis.list.unhighlightHeads(cur_L, cur_R);
            vis.list.updateConnections(T);
            vis.list.colorMerged(cur_M, cur_E, T);
          }, [Tails, L, R, M, E], depth);

          // Bookmark: E <- R
          E = R;
          chunker.add('E<-R', (vis, T, _cur_L, _cur_R, cur_M, cur_E) => {
            vis.list.assignTag('E', cur_E);
            vis.list.colorMerged(cur_M, cur_E, T);
          }, [Tails, L, R, M, E], depth);

          // Bookmark: R <- R.tail
          R = Tails[R];
          chunker.add('popR', (vis, _T, cur_R) => {
            vis.list.assignTag('R', cur_R);
          }, [Tails, R], depth);

        }
      }


      // ---------- APPEND REMAINDER ----------
      if (L === 'Null') {

        Tails[E] = R;
        chunker.add('appendR', (vis, T, cur_E, cur_R) => {
          vis.list.assignTag('E', cur_E);
          vis.list.assignTag('R', cur_R);

          vis.list.updateConnections(T);
          vis.list.colorMerged(cur_E, cur_R, T);
        }, [Tails, E, R], depth);

      } else {

        Tails[E] = L;
        chunker.add('appendL', (vis, T, cur_E, cur_L) => {
          vis.list.assignTag('E', cur_E);
          vis.list.assignTag('L', cur_L);

          vis.list.updateConnections(T);
          vis.list.colorMerged(cur_E, cur_L, T);
        }, [Tails, E, L], depth);
      }


      // ---------- FINAL RETURN M STEP ----------
      chunker.add('returnM', (vis, T, cur_M) => {
        vis.list.assignTag('M', cur_M);
        vis.list.resetColors();
        vis.list.colorChain(cur_M, ptrVariant.merged, T);
        vis.list.updateConnections(T);
      }, [Tails, M], depth);

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

        chunker.add('returnM', (vis, T, _cur_L, cur_M) => {

          vis.list.assignTag('L', undefined);
          vis.list.assignTag('R', undefined);
          vis.list.assignTag('E', undefined);
          vis.list.assignTag('Mid', undefined);
          vis.list.assignTag('M', cur_M);

          vis.list.resetColors();
          vis.list.colorChain(cur_M, ptrVariant.merged, T);

          vis.list.repositionMergedChain(cur_M, T);
          vis.list.updateConnections(T);
        }, [Tails, newL, mergedList], depth);

        return mergedList;
      } else {
        chunker.add('returnL', (vis, _T, cur_L) => {

          vis.list.assignTag('Mid', undefined);
          vis.list.assignTag('R', undefined);
          vis.list.assignTag('R', undefined);

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
