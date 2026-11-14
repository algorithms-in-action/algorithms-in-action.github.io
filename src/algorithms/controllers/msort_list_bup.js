/**
 * XXX rewrite document for bup
 *
 * XXX getting this into shape gradually. Some comments below are out of
 * date (eg, we don't hide lists).  Needs more work to apply colour
 * scheme used elsewhere, pretty up a few things and improve how list
 * variables are shown (plus the interface to the list tracer) - see
 * list_interface file.
 *
 * Merge Sort Linked List Animation — Bookmark & Chunker Guide
 * -----------------------------------------------------------
 *
 * This file implements the animated merge sort process for a linked list
 * using a direct mapping between the algorithm pseudocode and chunked
 * animation steps.
 *
 * Every chunker.add() call corresponds to a pseudocode "bookmark" label:
 *   - \B <BookmarkName>  in the pseudocode
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
 *    Search for \B or \Ref to find the canonical bookmark name.
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
 * Currently being used in LinkedListTracer directly, if want to
 * make coloring functions generic there, will need to pass in color
 * here in every coloring function call.
 *
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


import { msort_list_bup } from '../explanations';
import LinkedListTracer from '../../components/DataStructures/LinkedList/LinkedListTracer';
import {colors} from "../../components/DataStructures/colors";


// ---------- Colors ----------
const apColor = colors.apple;   // heads under comparison
const runAColor = colors.peach; // current L chain
const runBColor = colors.sky;   // current R chain
const sortColor = colors.leaf;  // already sorted portion
const doneColor = colors.stone; // default/idle color

// Internal data arrays encoding the linked list structure (NOT UI, don't delete)
let Heads;        // ['i.head (data)', ...]
let Tails;       // ['i.tail (next)', ...]

// ---------- Init visualiser (pointer only) ----------
export function initVisualisers() {
  return {
    list: {
      instance: new LinkedListTracer('list', null, 'List(s)'),
      order: 0,
    },
  }
}

export function run_msort() {
  // XXX could temporarily use depth = 0 (before complete rewrite) as there's no recursion for bup
  return function run(chunker, { nodes }) {
    const entire_num_array = nodes;
    const finished_stack_frames = []; // [ [left, right,  depth], ...]  (although depth could be implicit this is easier)
    const real_stack = []; // [ [left, right,  depth], ...]


    // XXX derived_stack function need to be rewritten to match bup (see msort_list_td)
    // XXX same with refresh_stack (due to usage of recursion)


    // kept, same as msort_list_td, per pseudocode
    function initializeListStructure() {
      Heads = ['i.head (data)'];
      Tails = ['i.tail (next)'];
      for (let i = 1; i <= entire_num_array.length; i++) {
        Heads.push(entire_num_array[i - 1]);
        Tails.push(i + 1);
      }
      Tails[entire_num_array.length] = 'Null';
    }

    let L = entire_num_array.length > 0 ? 1 : 'Null';
    let T;
    let LL = [];
    let LR = 0;

    // XXX need to be rewritten to replace recursion with iterative (remove depth)
    function setupInitialVisualization(L, len, depth) {
      chunker.add('Main', (vis, T, cur_L, cur_len, cur_depth, cur_real_stack, cur_finished_stack_frames) => {

        vis.list.set(entire_num_array, 'mergeSort list init');

        // XXX should colour list the cur_L colour and *remove* the
        // colour from the previous cur_L, if any
        // vis.list.showChain(cur_L, T);
        vis.list.resetColors(doneColor);
        vis.list.colorChain(cur_L, runAColor, T);
        // vis.list.setCaption(`len = ${cur_len}`);

        // Just L tag is known at this point
        vis.list.assignTag('L', cur_L);

        // refresh_stack(vis, cur_real_stack, cur_finished_stack_frames);
      }, [Tails.slice(), L, len, depth, real_stack, finished_stack_frames], depth);

      // This corresponds to pseudocode bookmark:
      // \B len>1 — later checked before recursion happens
      // chunker.add('len>1', () => { }, [], depth);
    }


    // XXX rewrite splitList function to split list into
    // lists of size-one (singular) elements for iterative sort
    // see msort_list_td for the original function
    function splitList(L, midNum, depth) {
      let Mid = L;
      let R = Tails[Mid];
      return { L, R, Mid };
    }


    // XXX removed performRecursiveSort function due to using iterative sort for bup
    // see msort_list_td for the original function
    function performRecursiveSort(L, R, midNum, len, depth) {
      return { L, R };
    }


    // XXX can have all these shared functions in the same file
    // (not main focus, can be done later)

    // kept, same as msort_list_td, per pseudocode
    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, T, cur_L, cur_R) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);

        vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
        vis.list.highlightHeads(cur_L, cur_R, apColor);
      }, [Tails.slice(), L, R], depth);

      if (Heads[L] < Heads[R]) {
        M = L;

        chunker.add('M<-L', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('M', cur_M);

          vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
          vis.list.colorMerged(cur_M, cur_M, T, sortColor);
        }, [Tails.slice(), L, R, M], depth);

        L = Tails[L];

        chunker.add('L<-tail(L)', (vis, _T, cur_L, _cur_R, _cur_M) => {
          vis.list.assignTag('L', cur_L);
        }, [Tails.slice(), L, R, M], depth);

      } else {
        M = R;

        chunker.add('M<-R', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('M', cur_M);
          vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
          vis.list.colorMerged(cur_M, cur_M, T, sortColor);
        }, [Tails.slice(), L, R, M], depth);

        R = Tails[R];

        chunker.add('R<-tail(R)', (vis, _T, _cur_L, cur_R, _cur_M) => {
          vis.list.assignTag('R', cur_R);
        }, [Tails.slice(), L, R, M], depth);
      }

      return { M, L, R };
    }


    // kept, same as msort_list_td, per pseudocode
    function mergeRemainingElements(L, R, M, depth) {
      let E = M;

      chunker.add('E', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('M', cur_M);
        vis.list.assignTag('E', cur_E);

        vis.list.updateConnections(T);

        vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
        vis.list.colorMerged(cur_M, cur_E, T, sortColor);
      }, [Tails.slice(), L, R, M, E], depth);

      while (L !== 'Null' && R !== 'Null') {

        chunker.add('whileNotNull', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
          vis.list.assignTag('L', cur_L);
          vis.list.assignTag('R', cur_R);
          vis.list.assignTag('M', cur_M);
          vis.list.assignTag('E', cur_E);
          vis.list.updateConnections(T);

          vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
          vis.list.highlightHeads(cur_L, cur_R, apColor);
          vis.list.colorMerged(cur_M, cur_E, T, sortColor);
        }, [Tails.slice(), L, R, M, E], depth);

        chunker.add('findSmaller', (vis, _T, cur_L, cur_R) => {
          vis.list.assignTag('L', cur_L);
          vis.list.assignTag('R', cur_R);
          vis.list.highlightHeads(cur_L, cur_R, apColor);
        }, [Tails.slice(), L, R], depth);

        if (Heads[L] <= Heads[R]) {
          Tails[E] = L;

          chunker.add('E.tail<-L', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
            vis.list.assignTag('L', cur_L);
            vis.list.assignTag('R', cur_R);
            vis.list.assignTag('M', cur_M);
            vis.list.assignTag('E', cur_E);

            vis.list.unhighlightHeads(cur_L, cur_R, runAColor, runBColor);
            vis.list.updateConnections(T);
            vis.list.colorMerged(cur_M, cur_E, T, sortColor);
          }, [Tails.slice(), L, R, M, E], depth);

          E = L;

          chunker.add('E<-L', (vis, T, _cur_L, _cur_R, cur_M, cur_E) => {
            vis.list.assignTag('E', cur_E);
            vis.list.colorMerged(cur_M, cur_E, T, sortColor);
          }, [Tails.slice(), L, R, M, E], depth);

          L = Tails[L];

          chunker.add('popL', (vis, _T, cur_L) => {
            vis.list.assignTag('L', cur_L);
          }, [Tails.slice(), L], depth);

        } else {
          Tails[E] = R;

          chunker.add('E.tail<-R', (vis, T, cur_L, cur_R, cur_M, cur_E) => {
            vis.list.assignTag('L', cur_L);
            vis.list.assignTag('R', cur_R);
            vis.list.assignTag('M', cur_M);
            vis.list.assignTag('E', cur_E);

            vis.list.unhighlightHeads(cur_L, cur_R, runAColor, runBColor);
            vis.list.updateConnections(T);
            vis.list.colorMerged(cur_M, cur_E, T, sortColor);
          }, [Tails.slice(), L, R, M, E], depth);

          E = R;

          chunker.add('E<-R', (vis, T, _cur_L, _cur_R, cur_M, cur_E) => {
            vis.list.assignTag('E', cur_E);
            vis.list.colorMerged(cur_M, cur_E, T, sortColor);
          }, [Tails.slice(), L, R, M, E], depth);

          R = Tails[R];

          chunker.add('popR', (vis, _T, cur_R) => {
            vis.list.assignTag('R', cur_R);
          }, [Tails.slice(), R], depth);
        }
      }

      if (L === 'Null') {
        Tails[E] = R;

        chunker.add('appendR', (vis, T, cur_E, cur_R, cur_M) => {
          vis.list.assignTag('E', undefined);
          vis.list.assignTag('R', undefined);
          vis.list.updateConnections(T);
          vis.list.colorChain(cur_M, sortColor, T);
        }, [Tails.slice(), E, R, M], depth);

      } else {
        Tails[E] = L;

        chunker.add('appendL', (vis, T, cur_E, cur_L, cur_M) => {
          vis.list.assignTag('E', undefined);
          vis.list.assignTag('L', undefined);
          vis.list.updateConnections(T);
          vis.list.colorChain(cur_M, sortColor, T);
        }, [Tails.slice(), E, L, M], depth);
      }

      return M;
    }


    function MergeSort(L, len, depth) {
      setupInitialVisualization(L, len, depth);

      if (len < 2) {
        chunker.add('returnL', (vis, T, cur_L) => {
          vis.list.assignTag('L', cur_L);
          vis.list.resetColors(doneColor);
          vis.list.colorMerged(cur_L, cur_L, T, sortColor);
        }, [Tails.slice(), L], depth);

        return L;
      }

      T = Tails[L];

      chunker.add('init_T', (vis, cur_T) => {
        vis.list.assignTag('T', cur_T);
      }, [T], depth);

      Tails[L] = 'Null';
      LL = [L];

      chunker.add('init_LL', (vis, cur_L, cur_LL, cur_T) => {
        vis.list.layoutRuns(cur_LL, cur_T);
        vis.list.assignTag('L', cur_L);
        vis.list.colorChain(cur_L, sortColor, cur_T);
        vis.list.updateConnections(cur_T);
      }, [L, LL.slice(), Tails.slice()], depth);

      L = T;

      chunker.add('use_T', (vis, cur_L, cur_Tails) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('T', undefined);
        vis.list.updateConnections(cur_Tails);
      }, [L, Tails.slice()], depth);

      LR = 0;

      chunker.add('init_LR_1', (vis, cur_LR) => {
        vis.list.assignReferenceTag('LR', cur_LR);
      }, [LR], depth);

      while (L !== 'Null') {
        chunker.add('WhileL', (vis, cur_L, cur_LR) => {
          vis.list.assignTag('L', cur_L);
          vis.list.assignReferenceTag('LR', cur_LR);
        }, [L, LR], depth);

        T = Tails[L];

        chunker.add('init_T_1', (vis, cur_T) => {
          vis.list.assignTag('T', cur_T);
        }, [T], depth);

        Tails[L] = 'Null';
        LL.push(L);

        chunker.add('assign_LRtail', (vis, cur_L, cur_LL, cur_T) => {
          vis.list.layoutRuns(cur_LL, cur_T);
          vis.list.assignTag('L', cur_L);
          vis.list.colorChain(cur_L, sortColor, cur_T);
          vis.list.updateConnections(cur_T);
        }, [L, LL.slice(), Tails.slice()], depth);

        L = T;

        chunker.add('use_T_1', (vis, cur_L) => {
          vis.list.assignTag('L', cur_L);
          vis.list.assignTag('T', undefined);
        }, [L], depth);

        LR = LL.length - 1;

        chunker.add('assign_LR', (vis, cur_LR) => {
          vis.list.assignReferenceTag('LR', cur_LR);
        }, [LR], depth);
      }

      while (LL.length > 1) {
        chunker.add('MainWhile', (vis, cur_LL, cur_T) => {
          vis.list.layoutRuns(cur_LL, cur_T);
          vis.list.resetColors(doneColor);

          for (const run of cur_LL)
            vis.list.colorChain(run, sortColor, cur_T);

          // vis.list.setCaption(`LL length = ${cur_LL.length}`);
          vis.list.updateConnections(cur_T);
        }, [LL.slice(), Tails.slice()], depth);

        LR = 0;

        chunker.add('init_LR', (vis, cur_LR) => {
          vis.list.assignReferenceTag('LR', cur_LR);
        }, [LR], depth);

        while (LR < LL.length - 1) {
          L = LL[LR];


          chunker.add('MergeAllWhile', () => {
          }, [], depth);

          chunker.add('init L', (vis, cur_L, cur_R, cur_T) => {
            vis.list.assignTag('L', cur_L);
            vis.list.assignTag('R', cur_R);

            vis.list.colorChains(
              cur_L,
              cur_R,
              cur_T,
              runAColor,
              runBColor,
              doneColor
            );
          }, [L, LL[LR + 1], Tails.slice()], depth);

          const R = LL[LR + 1];

          chunker.add('init R', (vis, cur_L, cur_R, cur_T) => {
            vis.list.assignTag('L', cur_L);
            vis.list.assignTag('R', cur_R);
            vis.list.moveChainBelow(cur_L, cur_R, cur_T, 100);
            vis.list.colorChains(
                cur_L,
                cur_R,
                cur_T,
                runAColor,
                runBColor,
                doneColor
            );
          }, [L, R, Tails.slice()], depth);

          const { M, L: remainingL, R: remainingR } =
              mergeHeads(L, R, depth);

          const mergedList =
              mergeRemainingElements(
                  remainingL,
                  remainingR,
                  M,
                  depth
              );

          chunker.add('returnM', (vis, T, cur_M) => {

            vis.list.assignTag('L', undefined);
            vis.list.assignTag('R', undefined);
            vis.list.assignTag('E', undefined);
            vis.list.assignTag('M', cur_M);

            vis.list.resetColors(doneColor);
            vis.list.colorChain(cur_M, sortColor, T);
            vis.list.updateConnections(T);
          }, [Tails.slice(), mergedList], depth);

          LL[LR] = mergedList;

          chunker.add('replace_head', (vis, cur_M, cur_LR, cur_T) => {
            vis.list.setMotion(true);
            vis.list.repositionMergedChain(cur_M, cur_T);

            // Point the first reference arrow to M.
            vis.list.setReferenceTarget(cur_LR, cur_M);

            // Hide the second arrow without removing its node.
            vis.list.hideReferenceArrow(cur_LR + 1);

            vis.list.assignReferenceTag('LR', cur_LR);
            vis.list.assignTag('M', cur_M);
            vis.list.updateConnections(cur_T);
          }, [mergedList, LR, Tails.slice()], depth);

          LL.splice(LR + 1, 1);

          chunker.add('skip_second', (vis, cur_LL, cur_LR, cur_T) => {
            vis.list.setMotion(false);

            // Remove the redundant reference node.
            vis.list.setRunReferences(cur_LL);

            vis.list.layoutRuns(cur_LL, cur_T);
            vis.list.assignReferenceTag('LR', cur_LR);
            vis.list.assignTag('M', undefined);
            vis.list.updateConnections(cur_T);
          }, [LL.slice(), LR, Tails.slice()], depth);

          LR++;

          chunker.add('next_pair', (vis, cur_LR) => {
            vis.list.setMotion(true);
            vis.list.assignTag('L', undefined);
            vis.list.assignTag('R', undefined);
            vis.list.assignReferenceTag('LR', cur_LR);
          }, [LR < LL.length ? LR : undefined], depth);

        }

        chunker.add('mergeDone', (vis, cur_LL, cur_T) => {
          vis.list.layoutRuns(cur_LL, cur_T);
          vis.list.assignReferenceTag('LR', undefined);
          vis.list.resetColors(doneColor);

          for (const run of cur_LL)
            vis.list.colorChain(run, sortColor, cur_T);

          vis.list.updateConnections(cur_T);
          // vis.list.setCaption(`LL length = ${cur_LL.length}`);
        }, [LL.slice(), Tails.slice()], depth);
      }

      const result = LL[0];

      chunker.add('Done', (vis, T, cur_M, cur_LL) => {
        vis.list.layoutRuns(cur_LL, T);
        vis.list.assignReferenceTag('LR', undefined);
        vis.list.assignTag('L', undefined);
        vis.list.assignTag('R', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.resetColors(doneColor);
        vis.list.colorChain(cur_M, sortColor, T);
        vis.list.updateConnections(T);
        vis.list.hideByKey('ll-0');
      }, [Tails.slice(), result, LL.slice()], depth);

      return result;
    }

    initializeListStructure();
    const msresult = MergeSort(L, entire_num_array.length, 0);

    // reset pointer colors once mergesort is complete
    const lastLine = (entire_num_array.length > 1 ? 'returnM' : 'returnL');
    chunker.add(lastLine, (vis) => {
      vis.list.resetColors(doneColor);
    }, [], 1);

    //return MergeSort(L, entire_num_array.length, 0);
    return msresult;
  }
}

export default {
  explanation: msort_list_bup,
  initVisualisers,
  run: run_msort()
};
