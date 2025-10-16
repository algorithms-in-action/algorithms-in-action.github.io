// Animation of merge sort for lists (represented using array), top down.
// Refactored version with cleaner code structure and better separation of concerns

import { msort_lista_td } from '../explanations';
import { colors } from '../../components/DataStructures/colors';
import { areExpanded } from './collapseChunkPlugin';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import LinkedListTracer from '../../components/DataStructures/LinkedList/LinkedListTracer';
import { List } from '@mui/material';

// Color constants
const apColor = colors.apple;    // Comparing elements (red-ish)
const runAColor = colors.peach;  // Left sublist L (orange-ish)
const runBColor = colors.sky;    // Right sublist R (blue-ish)
const sortColor = colors.leaf;   // Sorted/merged elements (green-ish)
const doneColor = colors.stone;  // Completely finished (gray-ish)

// Global variables for list representation
let Indices; // ['i',    1,   2,   3,   4]
let Heads;   // ['data', 5,   3,   8,   1]
let Tails;   // ['next', 2,   3,   4,   'Null']
let simple_stack; // Call stack representation

const run = run_msort();

export default {
  explanation: msort_lista_td,
  initVisualisers,
  run
};

function isRecursionExpanded() {
  return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

/**
 * Assign a variable label to a node or show "variable=Null" when pointer is null
 * 
 * Purpose: Display pointer variables (L, R, E, M) on the array view.
 * Shows special "L=Null" notation when a pointer reaches the end of the list.
 * 
 * @param {object} vis - Visualization object containing array tracer
 * @param {string} variable_name - Name of the variable ('L', 'R', 'E', 'M')
 * @param {number|string} index - Node index (1,2,3...) or 'Null'
 * 
 * Example:
 *   assignMaybeNullVar(vis, 'L', 2)      // Shows 'L' at node 2
 *   assignMaybeNullVar(vis, 'L', 'Null') // Shows 'L=Null' at column 0
 */
function assignMaybeNullVar(vis, variable_name, index) {
  if (index === 'Null') {
    // Remove variable from any node
    vis.array.assignVariable(variable_name, 2, undefined);
    // Show "variable=Null" label at header position (row 2, column 0)
    vis.array.assignVariable(variable_name + '=Null', 2, 0);
  } else {
    // Point variable to the specified node index on row 2 (Tails row)
    vis.array.assignVariable(variable_name, 2, index);
  }
}

/**
 * Display the recursion call stack if the user has expanded the recursion section
 * 
 * Purpose: Show depth of recursion to help users understand recursive calls.
 * Only displays when recursion code is expanded (saves screen space).
 * 
 * @param {object} vis_array - Array visualizer instance
 * @param {Array<string>} c_stk - Call stack array, e.g. ['([5..],4)', '([3..],2)']
 * 
 * Example display:
 *   ([5..],4)  ← Current: sort list starting at value 5, length 4
 *   ([3..],2)  ← Parent: sort sublist starting at 3, length 2
 */
const set_simple_stack = (vis_array, c_stk) => {
  // Only show stack if user expanded the recursion section in the UI
  if (isRecursionExpanded()) {
    vis_array.setList(c_stk);
  }
}

/**
 * Color all nodes in a linked list chain
 * 
 * Purpose: Highlight sublists with different colors during sorting.
 * Colors left sublist (peach), right sublist (blue), or merged result (green).
 * 
 * @param {object} vis - Visualization object
 * @param {number|string} startIndex - Starting node index
 * @param {string} color - Color constant (runAColor, runBColor, sortColor, etc.)
 * @param {Array} Lists - The [Indices, Heads, Tails] structure
 * 
 * Example:
 *   colorList(vis, 1, runAColor, Lists) // Colors nodes 1→2→3→... in peach
 *   colorList(vis, 5, runBColor, Lists) // Colors nodes 5→6→... in blue
 */
function colorList(vis, startIndex, color, Lists) {
  const Tails = Lists[2]; // Extract the 'next' pointers array

  // Traverse the list following next pointers until reaching 'Null'
  for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
    // Color row 1 (Heads - the data values)
    vis.array.select(1, i, 1, i, color);
    // Color row 2 (Tails - the next pointers)
    vis.array.select(2, i, 2, i, color);
  }
}

export function initVisualisers() {
  return {
    array: {
      instance: new Array2DTracer('array', null, 'Array representation of linked list'),
      order: 1,
    },
    list: {
      instance: new LinkedListTracer('list', null, 'Pointer representation of linked list'),
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
        Heads.push(entire_num_array[i-1]);
        Tails.push(i+1);
      }
      Tails[entire_num_array.length] = 'Null';
    }

    function setupInitialVisualization(L, len, depth) {
      simple_stack.unshift('([' + Heads[L] + '..],' + len + ')');

      chunker.add('Main', (vis, Lists, cur_L, cur_len, cur_depth, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        vis.list.set(entire_num_array, 'mergeSort list init');
        vis.array.assignVariable('L', 2, cur_L);
        // pointer list vis
        vis.list.assignVariableByIndex('L', cur_L);
        colorList(vis, cur_L, runAColor, Lists);
        set_simple_stack(vis.array, c_stk);
      }, [[Indices, Heads, Tails], L, len, depth, simple_stack], depth);

      /* chunker.add('len>1', (vis, a) => {
      }, [[Indices, Heads, Tails]], depth); */
      // STEP 2: Check if len > 1
      chunker.add('len>1', (vis, Lists, cur_L, cur_len) => {
        // Just a logical checkpoint, no visual change needed
        // Could add a highlight or pause here if desired
      }, [[Indices, Heads, Tails], L, len], depth);
    }

    function splitList(L, midNum, depth) {
      let Mid = L;

      chunker.add('Mid', (vis, Lists, cur_L, cur_Mid, c_stk) => {
        vis.array.assignVariable('Mid', 2, cur_Mid);
        // For pointer list: assign Mid variable to the head node
        vis.list.assignVariableByIndex('Mid', cur_Mid);
      }, [[Indices, Heads, Tails], L, Mid, simple_stack], depth);

      for (let i = 1; i < midNum; i++) {
        Mid = Tails[Mid];
      }

      let R = Tails[Mid];
      Tails[Mid] = 'Null';

      chunker.add('tail(Mid)<-Null', (vis, Lists, cur_L, cur_Mid, cur_R, c_stk) => {
        // update array view
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.assignVariable('Mid', 2, cur_Mid);
        vis.array.assignVariable('R', 2, cur_R);

        // update pointer list view
        // update connections
        vis.list.updateConnections(Lists[2]);
        // assign variables in pointer view
        vis.list.assignVariableByIndex('L', cur_L);
        vis.list.assignVariableByIndex('Mid', cur_Mid);
        vis.list.assignVariableByIndex('R', cur_R);

        // Color the left part (L to Mid) orange
        colorListPointer(vis, cur_L, runAColor, Lists);

        // Color the right part (R onwards) blue
        colorListPointer(vis, cur_R, runBColor, Lists);

        // color array view
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
      }, [[Indices, Heads, Tails], L, Mid, R, simple_stack], depth);

      return { L, R, Mid };
    }

    // NEW HELPER FUNCTION: Move right half below left half
    function moveRightHalfBelow(vis, leftStart, rightStart, Lists) {
      if (rightStart === 'Null') return;

      const Tails = Lists[2];
      const VERTICAL_GAP = 70; // Distance below the left half

      // Calculate the leftmost position of the left half for alignment
      const leftKey = vis.list.indexToKey.get(leftStart);
      const firstLeftNode = vis.list.nodes.get(leftKey);
      const startX = firstLeftNode ? firstLeftNode.pos.x : 0;
      const startY = firstLeftNode ? firstLeftNode.pos.y + VERTICAL_GAP : VERTICAL_GAP;

      // Move each node in the right half
      let xOffset = 0;
      for (let i = rightStart; i !== 'Null'; i = Tails[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) {
          vis.list.moveNodeTo(key, startX + xOffset, startY);
          xOffset += vis.list.layout.gap; // Use the same horizontal gap
        }
      }
    }

    // Helper function to fade list to grey
    function fadeListToGrey(vis, startIndex, Lists) {
      if (startIndex === 'Null') return;

      const Tails = Lists[2];

      for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
        vis.list.deselectByIndex(i);
      }
    }

    // NEW HELPER FUNCTION: Color nodes in pointer list view
    function colorListPointer(vis, startIndex, color, Lists) {
      if (startIndex === 'Null') return;

      const Tails = Lists[2];
      const colorMapping = {
        [runAColor]: '3',  // Orange - use selected3
        [runBColor]: '0',  // Blue - use selected (default blue)
        [sortColor]: '1',  // Green - use selected1
        [apColor]: '2',    // Red - use selected2
        [doneColor]: 'sorted', // Gray - use sorted state
      };

      const colorState = colorMapping[color] || '0';

      // Traverse and color each node
      for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
        if (colorState === 'sorted') {
          vis.list.sortedByIndex(i);
        } else {
          vis.list.selectByIndex(i, colorState);
        }
      }
    }

    function performRecursiveSort(L, R, midNum, len, depth) {
      // **NEW: Move right half down AND fade to grey before processing left**
      // Sort left half
      chunker.add('preSortL', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.select(1, cur_L, 1, cur_L, runAColor);
        vis.array.select(2, cur_L, 2, cur_L, runAColor);

        // **Move right half below left half**
        moveRightHalfBelow(vis, cur_L, cur_R, Lists);

        // **Fade right half to grey**
        fadeListToGrey(vis, cur_R, Lists);
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

        // **Restore right half color in pointer view**
        colorListPointer(vis, cur_R, runBColor, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      // Sort right half
      chunker.add('preSortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('R', 2, cur_R);
        vis.array.select(1, cur_R, 1, cur_R, runBColor);
        vis.array.select(2, cur_R, 2, cur_R, runBColor);

        // **Optional: Fade left half now (or keep it visible)**
        // fadeListToGrey(vis, cur_L, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      R = MergeSort(R, len - midNum, depth + 1);

      chunker.add('sortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.assignVariable('R', 2, cur_R);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);

        // **Restore both halves colors in pointer view**
        colorListPointer(vis, cur_L, runAColor, Lists);
        colorListPointer(vis, cur_R, runBColor, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      return { L, R };
    }

    // Update mergeHeads function to include pointer visualization
    function mergeHeads(L, R, depth) {
      let M;

      chunker.add('compareHeads', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.deselect(1, cur_L);
        vis.array.select(1, cur_L, 1, cur_L, apColor);
        vis.array.deselect(1, cur_R);
        vis.array.select(1, cur_R, 1, cur_R, apColor);

        // **NEW: Highlight comparison in pointer view**
        colorSingleNodePointer(vis, cur_L, apColor);
        colorSingleNodePointer(vis, cur_R, apColor);
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

        // **NEW: Update pointer list view**
        vis.list.updateConnections(Lists[2]);
        vis.list.assignVariableByIndex('L', cur_L);
        vis.list.assignVariableByIndex('R', cur_R);
        vis.list.assignVariableByIndex('M', cur_M);
        vis.list.assignVariableByIndex('E', cur_E);
        colorListPointer(vis, cur_L, runAColor, Lists);
        colorListPointer(vis, cur_R, runBColor, Lists);
        colorListPointer(vis, cur_M, sortColor, Lists);
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

          // **NEW: Update pointer list view**
          vis.list.updateConnections(Lists[2]);
          updatePointerVariables(vis, cur_L, cur_R, cur_M, cur_E);
          colorListPointer(vis, cur_L, runAColor, Lists);
          colorListPointer(vis, cur_R, runBColor, Lists);
          colorMergedListPointer(vis, cur_M, cur_E, sortColor, Lists);
        }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);

        chunker.add('findSmaller', (vis, Lists, cur_L, cur_R, c_stk) => {
          vis.array.deselect(1, cur_L);
          vis.array.select(1, cur_L, 1, cur_L, apColor);
          vis.array.deselect(1, cur_R);
          vis.array.select(1, cur_R, 1, cur_R, apColor);

          // **NEW: Highlight comparison in pointer view**
          if (cur_L !== 'Null') {
            colorSingleNodePointer(vis, cur_L, apColor);
          }
          if (cur_R !== 'Null') {
            colorSingleNodePointer(vis, cur_R, apColor);
          }
        }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

        if (Heads[L] <= Heads[R]) {
          Tails[E] = L;    // Update pointer
          E = L;
          L = Tails[L];
          addMergeVisualization('popL', L, R, M, E, depth);
        } else {
          Tails[E] = R;    // Update pointer
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

        // **NEW: Update pointer list - arrows will redirect!**
        vis.list.updateConnections(Lists[2]);
        updatePointerVariables(vis, cur_L, cur_R, cur_M, cur_E);
        colorListPointer(vis, cur_L, runAColor, Lists);
        colorListPointer(vis, cur_R, runBColor, Lists);
        colorMergedListPointer(vis, cur_M, cur_E, sortColor, Lists);
      }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);
    }

    function addFinalVisualization(stepName, M, depth) {
      chunker.add(stepName, (vis, Lists, cur_M, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('M', 2, cur_M);
        colorList(vis, cur_M, sortColor, Lists);

        // **NEW: Final pointer update**
        vis.list.updateConnections(Lists[2]);
        vis.list.assignVariableByIndex('M', cur_M);
        colorListPointer(vis, cur_M, sortColor, Lists);
      }, [[Indices, Heads, Tails], M, simple_stack], depth);
    }

    // Update pointer variables with null handling
    function updatePointerVariables(vis, cur_L, cur_R, cur_M, cur_E) {
      // Clear all merge-related variables first
      vis.list.nodes.forEach(node => {
        node.variables = node.variables.filter(v => !['L', 'R', 'M', 'E'].includes(v));
      });

      // Assign variables (skip if null)
      if (cur_L !== 'Null') vis.list.assignVariableByIndex('L', cur_L);
      if (cur_R !== 'Null') vis.list.assignVariableByIndex('R', cur_R);
      if (cur_M !== 'Null') vis.list.assignVariableByIndex('M', cur_M);
      if (cur_E !== 'Null') vis.list.assignVariableByIndex('E', cur_E);
    }

    // Color merged portion of list (from M to E)
    function colorMergedListPointer(vis, cur_M, cur_E, color, Lists) {
      if (cur_M === 'Null' || cur_E === 'Null') return;

      const Tails = Lists[2];
      const colorState = '1'; // sortColor -> selected1 (green)

      // Color from M to E (inclusive)
      for (let i = cur_M; i !== cur_E && i !== 'Null'; i = Tails[i]) {
        vis.list.selectByIndex(i, colorState);
      }
      // Color E itself
      if (cur_E !== 'Null') {
        vis.list.selectByIndex(cur_E, colorState);
      }
    }

    // Color a single node (for comparison highlighting)
    function colorSingleNodePointer(vis, index, color) {
      if (index === 'Null') return;

      const colorMapping = {
        [apColor]: '2',  // Red - selected2
      };

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
    const msresult = MergeSort(1, entire_num_array.length, 0);

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