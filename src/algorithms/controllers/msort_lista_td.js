// Animation of merge sort for lists (represented using array), top down.
// Refactored version with cleaner code structure and better separation of concerns

import { msort_lista_td } from '../explanations';
import { colors } from '../../components/DataStructures/colors';
import { areExpanded } from './collapseChunkPlugin';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import LinkedListTracer from '../../components/DataStructures/LinkedList/LinkedListTracer';

// Color constants
const apColor = colors.apple;
const runAColor = colors.peach;
const runBColor = colors.sky;
const sortColor = colors.leaf;
const doneColor = colors.stone;

// Global variables for list representation
let Indices;
let Heads;
let Tails;
let simple_stack;

const run = run_msort();

export default {
  explanation: msort_lista_td,
  initVisualisers,
  run
};

// Expansion check functions
function isMergeCopyExpanded() {
  return areExpanded(['MergeCopy']);
}

function isMergeExpanded() {
  return areExpanded(['MergeCopy', 'Merge']);
}

function isRecursionExpanded() {
  return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

// Stack frame color constants
const STACK_FRAME_COLOR = {
  No_color: 0,
  In_progress_stackFrame: 1,
  Current_stackFrame: 2,
  Finished_stackFrame: 3,
  I_color: 4,
  J_color: 5,
  P_color: 6,
};

// Helper functions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assignMaybeNullVar(vis, variable_name, index) {
  if (index === 'Null') {
    vis.array.assignVariable(variable_name, 2, undefined);
    vis.array.assignVariable(variable_name + '=Null', 2, 0);
  } else {
    vis.array.assignVariable(variable_name, 2, index);
  }
}

function assignVarToA(vis, variable_name, index) {
  if (index === undefined) {
    vis.array.removeVariable(variable_name);
  } else {
    vis.array.assignVariable(variable_name, 0, index);
  }
}

const set_simple_stack = (vis_array, c_stk) => {
  if (isRecursionExpanded()) {
    vis_array.setList(c_stk);
  }
}

function colorList(vis, startIndex, color, Lists) {
  const Tails = Lists[2];
  for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
    vis.array.select(1, i, 1, i, color);
    vis.array.select(2, i, 2, i, color);
  }
}

export function initVisualisers() {
  return {
    array: {
      instance: new Array2DTracer('array', null, 'Array representation of linked list'),
      order: 0,
    },
    list: {
      instance: new LinkedListTracer('list', null, 'Pointer representation of linked list'),
      order: 1,
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

      for (let i = 1; i < entire_num_array.length; i++) {
        Indices.push(i);
        Heads.push(entire_num_array[i - 1]);
        Tails.push(i + 1);
      }
      Tails[entire_num_array.length - 1] = 'Null';
    }

    function setupInitialVisualization(L, len, depth) {
      simple_stack.unshift('([' + Heads[L] + '..],' + len + ')');

      chunker.add('Main', (vis, Lists, cur_L, cur_len, cur_depth, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        vis.list.set(entire_num_array, 'mergeSort list init');
        vis.array.assignVariable('L', 2, cur_L);
        colorList(vis, cur_L, runAColor, Lists);
        set_simple_stack(vis.array, c_stk);
      }, [[Indices, Heads, Tails], L, len, depth, simple_stack], depth);

      chunker.add('len>1', (vis, a) => {
      }, [[Indices, Heads, Tails]], depth);
    }

    function splitList(L, midNum, depth) {
      let Mid = L;

      chunker.add('Mid', (vis, Lists, cur_L, cur_Mid, c_stk) => {
        vis.array.assignVariable('Mid', 2, cur_Mid);
      }, [[Indices, Heads, Tails], L, Mid, simple_stack], depth);

      for (let i = 1; i < midNum; i++) {
        Mid = Tails[Mid];
      }

      let R = Tails[Mid];
      Tails[Mid] = 'Null';

      chunker.add('tail(Mid)<-Null', (vis, Lists, cur_L, cur_Mid, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.assignVariable('Mid', 2, cur_Mid);
        vis.array.assignVariable('R', 2, cur_R);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
      }, [[Indices, Heads, Tails], L, Mid, R, simple_stack], depth);

      return { L, R, Mid };
    }

    function performRecursiveSort(L, R, midNum, len, depth) {
      // Sort left half
      chunker.add('preSortL', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.select(1, cur_L, 1, cur_L, runAColor);
        vis.array.select(2, cur_L, 2, cur_L, runAColor);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      L = MergeSort(L, midNum, depth + 1);

      chunker.add('sortL', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.assignVariable('R', 2, cur_R);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
        vis.array.select(1, cur_R, 1, cur_R, runBColor);
        vis.array.select(2, cur_R, 2, cur_R, runBColor);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      // Sort right half
      chunker.add('preSortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('R', 2, cur_R);
        vis.array.select(1, cur_R, 1, cur_R, runBColor);
        vis.array.select(2, cur_R, 2, cur_R, runBColor);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      R = MergeSort(R, len - midNum, depth + 1);

      chunker.add('sortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.assignVariable('R', 2, cur_R);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      return { L, R };
    }

    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.deselect(1, cur_L);
        vis.array.select(1, cur_L, 1, cur_L, apColor);
        vis.array.deselect(1, cur_R);
        vis.array.select(1, cur_R, 1, cur_R, apColor);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      if (Heads[L] <= Heads[R]) {
        M = L;
        L = Tails[L];
      } else {
        M = R;
        R = Tails[R];
      }

      return { M, L, R };
    }

    function mergeRemainingElements(L, R, M, depth) {
      let E = M;

      chunker.add('E', (vis, Lists, cur_L, cur_R, cur_M, cur_E, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        assignMaybeNullVar(vis, 'L', cur_L);
        assignMaybeNullVar(vis, 'R', cur_R);
        vis.array.assignVariable('M', 2, cur_M);
        vis.array.assignVariable('E', 2, cur_E);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
        vis.array.select(1, cur_M, 1, cur_M, sortColor);
        vis.array.select(2, cur_M, 2, cur_M, sortColor);
      }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);

      // Merge loop
      while (L !== 'Null' && R !== 'Null') {
        chunker.add('whileNotNull', (vis, Lists, cur_L, cur_R, cur_M, cur_E, c_stk) => {
          vis.array.set(Lists, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);
          assignMaybeNullVar(vis, 'L', cur_L);
          assignMaybeNullVar(vis, 'R', cur_R);
          vis.array.assignVariable('M', 2, cur_M);
          assignMaybeNullVar(vis, 'E', cur_E);
          colorList(vis, cur_L, runAColor, Lists);
          colorList(vis, cur_R, runBColor, Lists);
          colorMergedList(vis, cur_M, cur_E, sortColor, Lists);
        }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);

        chunker.add('findSmaller', (vis, Lists, cur_L, cur_R, c_stk) => {
          vis.array.deselect(1, cur_L);
          vis.array.select(1, cur_L, 1, cur_L, apColor);
          vis.array.deselect(1, cur_R);
          vis.array.select(1, cur_R, 1, cur_R, apColor);
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

      // Append remaining elements
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
        assignMaybeNullVar(vis, 'L', cur_L);
        assignMaybeNullVar(vis, 'R', cur_R);
        vis.array.assignVariable('M', 2, cur_M);
        assignMaybeNullVar(vis, 'E', cur_E);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
        colorMergedList(vis, cur_M, cur_E, sortColor, Lists);
      }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);
    }

    function addFinalVisualization(stepName, M, depth) {
      chunker.add(stepName, (vis, Lists, cur_M, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('M', 2, cur_M);
        colorList(vis, cur_M, sortColor, Lists);
      }, [[Indices, Heads, Tails], M, simple_stack], depth);
    }

    function MergeSort(L, len, depth) {
      setupInitialVisualization(L, len, depth);

      if (len > 1) {
        let midNum = Math.floor(len / 2);
        const { L: newL, R, Mid } = splitList(L, midNum, depth);
        const { L: sortedL, R: sortedR } = performRecursiveSort(newL, R, midNum, len, depth);
        const { M, L: remainingL, R: remainingR } = mergeHeads(sortedL, sortedR, depth);
        const mergedList = mergeRemainingElements(remainingL, remainingR, M, depth);

        chunker.add('returnM', (vis, Lists, cur_L, cur_M, c_stk) => {
          vis.array.set(Lists, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);
          vis.array.assignVariable('L', 2, undefined);
          vis.array.assignVariable('R', 2, undefined);
          vis.array.assignVariable('E', 2, undefined);
          vis.array.assignVariable('M', 2, cur_M);
          colorList(vis, cur_M, sortColor, Lists);
        }, [[Indices, Heads, Tails], newL, mergedList, simple_stack], depth);

        simple_stack.shift();
        return mergedList;
      } else {
        chunker.add('returnL', (vis, a, cur_L) => {
          vis.array.select(1, cur_L, 1, cur_L, '1');
          vis.array.select(2, cur_L, 2, cur_L, '1');
        }, [A, L], depth);

        simple_stack.shift();
        return L;
      }
    }

    // Main execution
    initializeListStructure();
    const msresult = MergeSort(1, entire_num_array.length - 1, 0);

    let lastLine = (entire_num_array.length > 1 ? 'returnM' : 'returnL');
    chunker.add(lastLine, (vis, a) => {
      for (let i = 1; i < entire_num_array.length; i++) {
        vis.array.select(1, i, 1, i, doneColor);
        vis.array.select(2, i, 2, i, doneColor);
      }
    }, [A], 1);

    return msresult;
  }
}