/**
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
 * Colors are defined once below (same as array-based merge sorts),
 * using theme colors and passed to LinkedListTracer call.
 * Renderer then maps them to CSS variables so they follow color options in Setting
 * 
 * runA   peach (orange by default) = current L chain
 * runB   sky (blue by default) = current R chain
 * merged leaf (green by default) = already merged portion (M..E)
 * cmp    apple (red by default) = elements under comparison (heads of L and R)
 * def    stone (grey) = default/idle color
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
import {colors} from "../../components/DataStructures/colors";

// ---------- Colors ----------
const apColor = colors.apple;   // heads under comparison
const runAColor = colors.peach; // current L chain
const runBColor = colors.sky;   // current R chain
const sortColor = colors.leaf;  // already sorted portion
const doneColor = colors.stone; // default/idle color

// import 1D tracer to generate array for stack visualisation
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  areExpanded,
} from './collapseChunkPlugin';


// see stackFrameColour in Array1DRenderer/index.js for corresponding function mapping to CSS
// CSS variables are now based on global color palette (src/styles/global.scss)
// so the call stack visualisations follows color options in Setting, same as list color above
const STACK_FRAME_COLOR = {
  No_color: 0,
  In_progress_stackFrame: 1,
  Current_stackFrame: 2,
  Finished_stackFrame: 3,
  I_color: 4,
  J_color: 5,
  P_color: 6, // pivot
}

// Internal data arrays encoding the linked list structure (NOT UI, don't delete)
let Heads;        // ['i.head (data)', ...]
let Tails;        // ['i.tail (next)', ...]




// Stack Visualisation Helper functions
// checks if either recursive call is expanded (otherwise stack is not
// displayed)

// Hides stack array and subheading
function hideArrayRows() {
  document.querySelectorAll('[class*="Array1DRenderer_row__"]').forEach(el => {
    el.style.visibility = 'hidden';
  });

  document.querySelectorAll('[class*="Ellipsis_ellipsis__"]').forEach(el => {
    console.log("hi")
    if (el.textContent.trim() === 'Call Stack') {
      el.style.visibility = 'hidden';
    }
  })

  // Move stack visualisation up from -50px to -125px
  const stack = document.querySelector('[class*="Array1DRenderer_stack__"]')
  if (stack){
    stack.style.marginTop = '-125px';
  }
}

function isRecursionExpanded() {
  return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

import { update_vis_with_stack_frame } from './msort_arr_td';


    
// ---------- Init visualiser (pointer only) ----------
export function initVisualisers() {
  // MutationObserver triggers callback function on every DOM change
  // (e.g. toggling Collapsed/Expanded)
  const observer = new MutationObserver(hideArrayRows)
  observer.observe(document.body, {subtree: true, childList: true});

  if (isRecursionExpanded()){
    return {
      list: {
        instance: new LinkedListTracer('list', null, 'List(s)'),
        order: 0,
      },
      stack: { // To store linked list values for stack vis
        instance: new ArrayTracer('stack', null, 'Call Stack'),
        order: 1,
      },
    }
  } else{
     return {
      list: {
        instance: new LinkedListTracer('list', null, 'List(s)'),
        order: 0,
      },
    }
  }
}
export function run_msort() {
  return function run(chunker, { nodes }) {
    const entire_num_array = nodes;
    const finished_stack_frames = []; // [ [left, right,  depth], ...]  (although depth could be implicit this is easier)
    const real_stack = []; // [ [left, right,  depth], ...]

    // Given current and completed stack frames, derive the visualisation 
    function derive_stack(cur_real_stack, cur_finished_stack_frames) {
      // Don't display stack when recursion is collapsed
      if (!isRecursionExpanded()) {
        return [];
      }

      let stack_vis = [];
      const arrayLen = entire_num_array.length;
      // Calculate depth based on actual stack content
      let actualMaxDepth = 0;
      // Calculate maximum depth from finished_stack_frames

      cur_finished_stack_frames.forEach(frame => {
        if (frame[2] > actualMaxDepth) actualMaxDepth = frame[2];
      });
      // Calculate maximum depth from real_stack  
      cur_real_stack.forEach(frame => {
        if (frame[2] > actualMaxDepth) actualMaxDepth = frame[2];
      });
      const stackDepth = actualMaxDepth + 1;
      
      // Initialize stack visualization array
      for (let i = 0; i < stackDepth; i++) {
        stack_vis.push(
          [...Array.from({ length: arrayLen })].map(() => ({
            base: STACK_FRAME_COLOR.No_color,
            extra: [],
            value: undefined,
            isLeftBoundary: false,
            isRightBoundary: false
          })),
        );
      }

      // First display all completed stack frames (gray)
      cur_finished_stack_frames.forEach((stack_frame) => {
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          stack_frame,
          STACK_FRAME_COLOR.Finished_stackFrame,
          entire_num_array,
          arrayLen
        );
      });

      // Then display current active stack frames
      cur_real_stack.forEach((stack_frame, index) => {
        const color = (index === cur_real_stack.length - 1) 
          ? STACK_FRAME_COLOR.Current_stackFrame
          : STACK_FRAME_COLOR.In_progress_stackFrame;
        
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          stack_frame,
          color,
          entire_num_array,
          arrayLen
        );
      });

      return stack_vis;
    }

    // Refreshes stack vis at every Main call
    const refresh_stack = (vis, cur_real_stack, cur_finished_stack_frames) => {
      if (!vis.stack) return;  // Guards against vis.stack being undefined

      if (!isRecursionExpanded()) {
        vis.stack.setStackDepth(0);
        vis.stack.setStack(undefined);
        return;
      }
      
      const stack_data = derive_stack(
        cur_real_stack,
        cur_finished_stack_frames
      );

      vis.stack.setStackDepth(cur_real_stack.length);
      vis.stack.setStack(stack_data);
    } 

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
      chunker.add('Main', (vis, T, cur_L, cur_len, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
        // Depth 0: show full original list (top-level call)
        // Deeper recursion: hide other sublists and focus only on this L-chain
        if (cur_depth > 0) {
          // vis.list.hideAll();
          // vis.list.showChain(cur_L, T);
        } else {
          vis.list.set(entire_num_array, 'mergeSort list init');
          if(vis.stack){
            vis.stack.set(entire_num_array, 'mergeSort list init')
          }
          // vis.list.colorChain(1, ptrVariant.runA, T);
        }
        // XXX should colour list the cur_L colour and *remove* the
        // colour from the previous cur_L, if any
        // vis.list.showChain(cur_L, T);
        vis.list.resetColors(doneColor);
        vis.list.colorChain(cur_L, runAColor, T);
        vis.list.setCaption(`len = ${cur_len}`);

        // Just L tag is known at this point
        vis.list.assignTag('L', cur_L);

        refresh_stack(vis, cur_real_stack, cur_finished_stack_frames);
      }, [Tails, L, len, depth, real_stack, finished_stack_frames], depth);
      
      // This corresponds to pseudocode bookmark:
      // \B len>1 — later checked before recursion happens
      chunker.add('len>1', () => { }, [], depth);
    }

    function splitList(L, midNum, depth) {
      // Show Mid <- L (bookmark: Mid)
      let Mid = L;
      chunker.add('Mid', (vis, T, cur_L, cur_Mid) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('Mid', cur_Mid);
        vis.list.assignTag('R', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.showChain(cur_L, T);
        vis.list.updateConnections(T);

        // vis.list.resetColors(doneColor);
        // vis.list.colorChain(cur_L, runAColor, T);
      }, [Tails, L, Mid], depth);

      // Mid walking through list: Mid <- Mid.tail (bookmark: MidNext)
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

          vis.list.resetColors(doneColor);
          vis.list.colorChain(cur_L, runAColor, T);
          vis.list.highlightHeads(cur_Mid, undefined, apColor);
        }, [Tails, L, Mid], depth);
      }

      // Split step 1: R <- Mid.tail (bookmark: R<-tail(Mid))
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
        if (cur_L && cur_L !== 'Null') vis.list.colorChain(cur_L, runAColor, T);
        if (cur_R && cur_R !== 'Null') vis.list.colorChain(cur_R, runBColor, T);
      }, [Tails, L, Mid, R], depth);

      // Split step 2: Mid.tail <- Null (bookmark: tail(Mid)<-Null)
      Tails[Mid] = 'Null';
      chunker.add('tail(Mid)<-Null', (vis, T, cur_L, cur_Mid, cur_R) => {
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.updateConnections(T);
        vis.list.showChain(cur_L, T);
        if (cur_R && cur_R !== 'Null') vis.list.showChain(cur_R, T);

        vis.list.resetColors();
        if (cur_L && cur_L !== 'Null') vis.list.colorChain(cur_L, runAColor, T);
        if (cur_R && cur_R !== 'Null') vis.list.colorChain(cur_R, runBColor, T);
      }, [Tails, L, Mid, R], depth);

      return { L, R, Mid };
    }


    function performRecursiveSort(L, R, midNum, len, depth) {
      // ----- focus left -----
      chunker.add('preSortL', (vis, T, cur_L, cur_R, cur_depth, cur_real_stack, cur_finished_stack_frames) => {

        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('R', undefined);
        vis.list.assignTag('L', cur_L);

        vis.list.colorChains(cur_L, undefined, T, runAColor, runBColor, doneColor);

        // vis.list.moveChainBelow(cur_L, cur_R, T);
        // vis.list.hideChain(cur_R, T);
        refresh_stack(vis, cur_real_stack, cur_finished_stack_frames);
      }, [Tails, L, R, depth, real_stack, finished_stack_frames], depth);

      L = MergeSort(L, midNum, depth + 1);

      chunker.add('sortL', (vis, T, cur_L, cur_R, cur_len, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.showChain(cur_L, T);
        vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
        vis.list.setCaption(`len = ${cur_len}`);
        refresh_stack(vis, cur_real_stack, cur_finished_stack_frames);
      }, [Tails, L, R, len, depth, real_stack, finished_stack_frames], depth);

      // ----- focus right -----
      chunker.add('preSortR', (vis, T, cur_L, cur_R, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
        // vis.list.assignTag('Mid', undefined);
        // vis.list.assignTag('L', undefined);
        // vis.list.assignTag('R', cur_R);
        // vis.list.assignTag('M', undefined);
        // vis.list.assignTag('E', undefined);

        // vis.list.hideChain(cur_L, T);
        // vis.list.showChain(cur_R, T);

        // vis.list.colorChains(undefined, cur_R, T);
        refresh_stack(vis, cur_real_stack, cur_finished_stack_frames);
      }, [Tails, L, R, depth, real_stack, finished_stack_frames], depth);

      R = MergeSort(R, len - midNum, depth + 1);

      chunker.add('sortR', (vis, T, cur_L, cur_R, cur_len, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
        vis.list.setCaption(`len = ${cur_len}`);
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);
        vis.list.assignTag('Mid', undefined);
        vis.list.assignTag('M', undefined);
        vis.list.assignTag('E', undefined);

        vis.list.showChain(cur_L, T);
        vis.list.showChain(cur_R, T);

        vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
        refresh_stack(vis, cur_real_stack, cur_finished_stack_frames);

        }, [Tails, L, R, len, depth, real_stack, finished_stack_frames], depth);

      return { L, R };
    }

    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, T, cur_L, cur_R) => {
        vis.list.moveChainBelow(cur_L, cur_R, T);
        vis.list.assignTag('L', cur_L);
        vis.list.assignTag('R', cur_R);

        vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
        vis.list.highlightHeads(cur_L, cur_R, apColor);
      }, [Tails, L, R], depth);

      if (Heads[L] < Heads[R]) {
        M = L;

        chunker.add('M<-L', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('M', cur_M);

          vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
          vis.list.colorMerged(cur_M, cur_M, T, sortColor);
        }, [Tails, L, R, M], depth);

        L = Tails[L];

        chunker.add('L<-tail(L)', (vis, _T, cur_L, _cur_R, _cur_M) => {
          vis.list.assignTag('L', cur_L);
        }, [Tails, L, R, M], depth);

      } else {
        M = R;

        chunker.add('M<-R', (vis, T, cur_L, cur_R, cur_M) => {
          vis.list.assignTag('M', cur_M);
          vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
          vis.list.colorMerged(cur_M, cur_M, T, sortColor);
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

        vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
        vis.list.colorMerged(cur_M, cur_E, T, sortColor);
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

          vis.list.colorChains(cur_L, cur_R, T, runAColor, runBColor, doneColor);
          vis.list.highlightHeads(cur_L, cur_R, apColor);
          vis.list.colorMerged(cur_M, cur_E, T, sortColor);
        }, [Tails, L, R, M, E], depth);

        // Bookmark: findSmaller
        chunker.add('findSmaller', (vis, _T, cur_L, cur_R) => {
          vis.list.assignTag('L', cur_L);
          vis.list.assignTag('R', cur_R);
          vis.list.highlightHeads(cur_L, cur_R, apColor);
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

            vis.list.unhighlightHeads(cur_L, cur_R, runAColor, runBColor);
            vis.list.updateConnections(T);
            vis.list.colorMerged(cur_M, cur_E, T, sortColor);
          }, [Tails, L, R, M, E], depth);

          // Bookmark: E <- L
          E = L;
          chunker.add('E<-L', (vis, T, _cur_L, _cur_R, cur_M, cur_E) => {
            vis.list.assignTag('E', cur_E);
            vis.list.colorMerged(cur_M, cur_E, T, sortColor);
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
            vis.list.unhighlightHeads(cur_L, cur_R, runAColor, runBColor);
            vis.list.updateConnections(T);
            vis.list.colorMerged(cur_M, cur_E, T, sortColor);
          }, [Tails, L, R, M, E], depth);

          // Bookmark: E <- R
          E = R;
          chunker.add('E<-R', (vis, T, _cur_L, _cur_R, cur_M, cur_E) => {
            vis.list.assignTag('E', cur_E);
            vis.list.colorMerged(cur_M, cur_E, T, sortColor);
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
          vis.list.assignTag('E', undefined);
          vis.list.assignTag('R', undefined);
          vis.list.updateConnections(T);
          // vis.list.colorMerged(cur_E, cur_R, T);
          vis.list.colorChain(cur_E, sortColor, T);
        }, [Tails, E, R], depth);

      } else {
        Tails[E] = L;
        chunker.add('appendL', (vis, T, cur_E, cur_L) => {
          vis.list.assignTag('E', undefined);
          vis.list.assignTag('L', undefined);
          vis.list.updateConnections(T);
          // vis.list.colorMerged(cur_E, cur_L, T);
          vis.list.colorChain(cur_E, sortColor, T);
        }, [Tails, E, L], depth);
      }

      return M;
    }

    function MergeSort(L, len, depth) {
      const left = L - 1;
      const right = L + len - 2;
      
      // Initialises new stack frame
      real_stack.push([left, right, depth])

      setupInitialVisualization(L, len, depth);
      
      let result;
      if (len > 1) {
        let midNum = Math.ceil(len / 2);
        const { L: newL, R, Mid } =
          splitList(L, midNum, depth);
        const { L: sortedL, R: sortedR } =
          performRecursiveSort(newL, R, midNum, len, depth);
        const { M, L: remainingL, R: remainingR } =
          mergeHeads(sortedL, sortedR, depth);
        const mergedList =
          mergeRemainingElements(remainingL, remainingR, M, depth);

        chunker.add('returnM', (vis, T, _cur_L, cur_M, cur_real_stack, cur_finished_stack_frames) => {

          vis.list.assignTag('L', undefined);
          vis.list.assignTag('R', undefined);
          vis.list.assignTag('E', undefined);
          vis.list.assignTag('Mid', undefined);
          vis.list.assignTag('M', cur_M);

          vis.list.resetColors(doneColor);
          vis.list.colorChain(cur_M, sortColor, T);

          vis.list.repositionMergedChain(cur_M, T);
          vis.list.updateConnections(T);
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames);
        }, [Tails, newL, mergedList, real_stack, finished_stack_frames], depth);

        result = mergedList;
      } else {
        chunker.add('returnL', (vis, _T, cur_L, cur_real_stack, cur_finished_stack_frames) => {

          vis.list.assignTag('Mid', undefined);
          vis.list.assignTag('R', undefined);
          vis.list.assignTag('R', undefined);

          vis.list.resetColors(doneColor);
          vis.list.colorMerged(cur_L, cur_L, Tails, sortColor);
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames);

          }, [Tails, L, real_stack, finished_stack_frames], depth);

          result = L;
          }

      // At each completion of each recursive call of merge sort, pop a frame from call stack
      const frame = real_stack.pop();
      if (frame){
        finished_stack_frames.push(frame);
      }
      return result;
    }

    // ---- main ----
    initializeListStructure();
    const msresult = MergeSort(1, entire_num_array.length, 0);

    // reset pointer colors once (array UI removed)
    const lastLine = (entire_num_array.length > 1 ? 'returnM' : 'returnL');

    chunker.add(lastLine, (vis) => {
        vis.list.resetColors(doneColor);
        refresh_stack(vis, [], finished_stack_frames);
    }, [], 1);

    return msresult;
  }
}

export default {
  explanation: msort_lista_td,
  initVisualisers,
  run: run_msort()
};
