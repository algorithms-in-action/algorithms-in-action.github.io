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

// Assign variable label in array view, handling null pointers with special notation
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
 * Display recursion call stack if expanded by user
 * Example display:
 *   ([5..],4)  ← Current: sort list starting at value 5, length 4
 *   ([3..],2)  ← Parent: sort sublist starting at 3, length 2
 */
const set_simple_stack = (vis_array, c_stk) => {
  if (isRecursionExpanded()) {
    vis_array.setList(c_stk);
  }
}

/**
 * Color a chain of nodes in the array view by traversing next pointers
 * Example:
 *   colorList(vis, 1, runAColor, Lists) // Colors nodes 1→2→3→... in peach
 *   colorList(vis, 5, runBColor, Lists) // Colors nodes 5→6→... in blue
 */
function colorList(vis, startIndex, color, Lists) {
  const Tails = Lists[2]; // Extract the 'next' pointers array

  // Traverse the list following next pointers until reaching 'Null'
  for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
    // Color row 1
    vis.array.select(1, i, 1, i, color);
    // Color row 2
    vis.array.select(2, i, 2, i, color);
  }
}

// Initialize both visualizers: array representation and pointer representation
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

    // Initialize the three parallel arrays representing the linked list
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

    // Set up initial visualization at start of each recursive call
    function setupInitialVisualization(L, len, depth) {
      simple_stack.unshift('([' + Heads[L] + '..],' + len + ')'); // Add current call to stack for visualization

      chunker.add('Main', (vis, Lists, cur_L, cur_len, cur_depth, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');

        // For recursive calls, hide all nodes then show only current sublist
        if (cur_depth > 0) {
          hideAllNodes(vis);
          showList(vis, cur_L, Lists); // Show only current sublist
        } else {
          vis.list.set(entire_num_array, 'mergeSort list init');
        }

        vis.array.assignVariable('L', 2, cur_L);
        vis.list.assignVariableByIndex('L', cur_L);
        // colorPointerList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_L, runAColor, Lists);
        set_simple_stack(vis.array, c_stk);
      }, [[Indices, Heads, Tails], L, len, depth, simple_stack], depth);

      chunker.add('len>1', (vis, Lists, cur_L, cur_len) => {
        // Checkpoint for base case check
      }, [[Indices, Heads, Tails], L, len], depth);
    }

    // Split list at midpoint into left (L) and right (R) sublists
    function splitList(L, midNum, depth) {
      let Mid = L;

      // Show initial Mid position at head of list
      chunker.add('Mid', (vis, Lists, cur_L, cur_Mid, c_stk) => {
        vis.array.assignVariable('Mid', 2, cur_Mid);
        vis.list.assignVariableByIndex('Mid', cur_Mid);
      }, [[Indices, Heads, Tails], L, Mid, simple_stack], depth);

      // Advance Mid pointer to midpoint
      for (let i = 1; i < midNum; i++) {
        Mid = Tails[Mid];
      }

      let R = Tails[Mid];
      Tails[Mid] = 'Null'; // Disconnect left and right halves

      chunker.add('tail(Mid)<-Null', (vis, Lists, cur_L, cur_Mid, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        // assign variables in array view
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.assignVariable('Mid', 2, cur_Mid);
        vis.array.assignVariable('R', 2, cur_R);

        // update pointer connections to show split
        vis.list.updateConnections(Lists[2]);

        // assign variables in pointer view, hidden from renderer atm
        vis.list.assignVariableByIndex('L', cur_L);
        vis.list.assignVariableByIndex('Mid', cur_Mid);
        vis.list.assignVariableByIndex('R', cur_R);

        showList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);

        // colorPointerList(vis, cur_L, runAColor, Lists);
        // colorPointerList(vis, cur_R, runBColor, Lists);

        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
        
      }, [[Indices, Heads, Tails], L, Mid, R, simple_stack], depth);


      return { L, R, Mid };
    }

    // Move right half below left half visually to show separation
    function moveRightHalfBelow(vis, leftStart, rightStart, Lists) {
      if (rightStart === 'Null') return;

      const Tails = Lists[2];
      const VERTICAL_GAP = 70; // Distance

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

    // Deselect all nodes in a list (fade to grey)
    /* function fadeListToGrey(vis, startIndex, Lists) {
      if (startIndex === 'Null') return;
      const Tails = Lists[2];
      for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
        vis.list.deselectByIndex(i);
      }
    } */

    // Color nodes in pointer list view based on state
    /* function colorPointerList(vis, startIndex, color, Lists) {
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
    } */

    // Recursively sort left and right halves
    function performRecursiveSort(L, R, midNum, len, depth) {
      // prepare to sort left half
      chunker.add('preSortL', (vis, Lists, cur_L, cur_R, c_stk) => {
          // Hide the mid after split the array
          vis.array.assignVariable('Mid', 2, undefined);
          vis.array.assignVariable('Mid=Null', 2, undefined);
          vis.list.nodes.forEach(node => {
            node.variables = node.variables.filter(v => v !== 'Mid' && v !== 'Mid=Null');
          });
          
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.select(1, cur_L, 1, cur_L, runAColor);
        vis.array.select(2, cur_L, 2, cur_L, runAColor);

        moveRightHalfBelow(vis, cur_L, cur_R, Lists);
        hideList(vis, cur_R, Lists);
        // fadeListToGrey(vis, cur_L, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      L = MergeSort(L, midNum, depth + 1); // Recurse on left half

      // After left recursion returns
      chunker.add('sortL', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.assignVariable('R', 2, cur_R);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
        vis.array.select(1, cur_R, 1, cur_R, runBColor);
        vis.array.select(2, cur_R, 2, cur_R, runBColor);

        // Show left (sorted)
        showList(vis, cur_L, Lists);
        // colorPointerList(vis, cur_L, sortColor, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      // Sort right half
      chunker.add('preSortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('R', 2, cur_R);
        vis.array.select(1, cur_R, 1, cur_R, runBColor);
        vis.array.select(2, cur_R, 2, cur_R, runBColor);

        // hide left half to focus on right
        hideList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);
        // fadeListToGrey(vis, cur_R, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      R = MergeSort(R, len - midNum, depth + 1);

      // After right recursion returns
      chunker.add('sortR', (vis, Lists, cur_L, cur_R, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('L', 2, cur_L);
        vis.array.assignVariable('R', 2, cur_R);
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);
        // Show both halves ready for merging
        showList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);

        // colorPointerList(vis, cur_L, runAColor, Lists);
        // colorPointerList(vis, cur_R, runBColor, Lists);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      return { L, R };
    }

    // Hide all nodes in pointer view
    function hideAllNodes(vis) {
      vis.list.nodes.forEach((node, key) => {
        vis.list.hideByKey(key);
      });
    }

    // Hide a list chain in pointer view
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

    // Show a list chain in pointer view
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

    // Initialize merge by choosing smaller head as M, advance that pointer
    function mergeHeads(L, R, depth) {
      let M;

      // Compare the first elements of both lists
      chunker.add('compareHeads', (vis, Lists, cur_L, cur_R, c_stk) => {
        // Highlight both heads in red to show comparison
        vis.array.deselect(1, cur_L);
        vis.array.select(1, cur_L, 1, cur_L, apColor);
        vis.array.deselect(1, cur_R);
        vis.array.select(1, cur_R, 1, cur_R, apColor);

        // Highlight comparison in pointer view
        colorSingleNodePointer(vis, cur_L, apColor);
        colorSingleNodePointer(vis, cur_R, apColor);
      }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

      if (Heads[L] <= Heads[R]) {
        M = L;

        // Show M <- L step
        chunker.add('M<-L', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          vis.array.assignVariable('M', 2, cur_M);
          vis.list.assignVariableByIndex('M', cur_M);
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);

        L = Tails[L]; // Advance L to next element

        chunker.add('L<-tail(L)', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          assignMaybeNullVar(vis, 'L', cur_L);  // Handles Null case
          if (cur_L !== 'Null') {
            vis.list.assignVariableByIndex('L', cur_L);
          } else {
            // Clear L variable from pointer view when Null
            vis.list.nodes.forEach(node => {
              node.variables = node.variables.filter(v => v !== 'L');
            });
          }
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);

      } else {
        M = R;

        // Show M <- R step
        chunker.add('M<-R', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          vis.array.assignVariable('M', 2, cur_M);
          vis.list.assignVariableByIndex('M', cur_M);
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);

        R = Tails[R];

        chunker.add('R<-tail(R)', (vis, Lists, cur_L, cur_R, cur_M, c_stk) => {
          assignMaybeNullVar(vis, 'R', cur_R);  // Handles Null case
          if (cur_R !== 'Null') {
            vis.list.assignVariableByIndex('R', cur_R);
          } else {
            // Clear R variable from pointer view when Null
            vis.list.nodes.forEach(node => {
              node.variables = node.variables.filter(v => v !== 'R');
            });
          }
        }, [[Indices, Heads, Tails], L, R, M, simple_stack], depth);
      }

      return { M, L, R };
    }

    // Merge remaining elements by comparing heads and redirecting pointers
    function mergeRemainingElements(L, R, M, depth) {
      let E = M; // E tracks the end of the merged list

      // Initialize E to point to M 
      chunker.add('E', (vis, Lists, cur_L, cur_R, cur_M, cur_E, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);

        // Assign all variables in array view
        assignMaybeNullVar(vis, 'L', cur_L);
        assignMaybeNullVar(vis, 'R', cur_R);
        vis.array.assignVariable('M', 2, cur_M);
        vis.array.assignVariable('E', 2, cur_E);

        // Color lists accordingly
        colorList(vis, cur_L, runAColor, Lists);
        colorList(vis, cur_R, runBColor, Lists);

        // Color merged portion (just M at this point)
        vis.array.select(1, cur_M, 1, cur_M, sortColor);
        vis.array.select(2, cur_M, 2, cur_M, sortColor);

        showList(vis, cur_L, Lists);
        showList(vis, cur_R, Lists);
        showList(vis, cur_M, Lists);

        // Update pointer connections
        vis.list.updateConnections(Lists[2]);
        vis.list.assignVariableByIndex('L', cur_L);
        vis.list.assignVariableByIndex('R', cur_R);
        vis.list.assignVariableByIndex('M', cur_M);
        vis.list.assignVariableByIndex('E', cur_E);
        // colorPointerList(vis, cur_L, runAColor, Lists);
        // colorPointerList(vis, cur_R, runBColor, Lists);
        // colorPointerList(vis, cur_M, sortColor, Lists);
      }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);

      // Merge loop: compare and append smaller element
      while (L !== 'Null' && R !== 'Null') {
        // Show current state before comparison
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
          vis.list.updateConnections(Lists[2]);
          vis.list.nodes.forEach(node => {
            node.variables = node.variables.filter(v => v !== 'R');
          });
          updatePointerVariables(vis, cur_L, cur_R, cur_M, cur_E);
          // colorPointerList(vis, cur_L, runAColor, Lists);
          // colorPointerList(vis, cur_R, runBColor, Lists);
          // colorMergedListPointer(vis, cur_M, cur_E, sortColor, Lists);
        }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);

        // Highlight the two elements being compared
        chunker.add('findSmaller', (vis, Lists, cur_L, cur_R, c_stk) => {
          vis.array.deselect(1, cur_L);
          vis.array.select(1, cur_L, 1, cur_L, apColor);
          vis.array.deselect(1, cur_R);
          vis.array.select(1, cur_R, 1, cur_R, apColor);

          if (cur_L !== 'Null') colorSingleNodePointer(vis, cur_L, apColor);
          if (cur_R !== 'Null') colorSingleNodePointer(vis, cur_R, apColor);
        }, [[Indices, Heads, Tails], L, R, simple_stack], depth);

        // Append smaller element to merged list
        if (Heads[L] <= Heads[R]) {
          Tails[E] = L; // Redirect E's next pointer to L
          E = L;        // E now points to this newly appended node
          L = Tails[L]; // Advance L to next element
          addMergeVisualization('popL', L, R, M, E, depth);
        } else {
          Tails[E] = R; // Redirect E's next pointer to R
          E = R;
          R = Tails[R];
          addMergeVisualization('popR', L, R, M, E, depth);
        }
      }

      // Append remaining elements from non-empty list
      if (L === 'Null') {
        Tails[E] = R;
        addFinalVisualization('appendR', M, depth);
      } else {
        Tails[E] = L;
        addFinalVisualization('appendL', M, depth);
      }

      return M;
    }

    // Color merged portion in array view
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

    // Add visualization step during merge (after appending element)
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

        vis.list.updateConnections(Lists[2]);
        vis.list.nodes.forEach(node => {
          node.variables = node.variables.filter(v => v !== 'R');
        });
        updatePointerVariables(vis, cur_L, cur_R, cur_M, cur_E);
        // colorPointerList(vis, cur_L, runAColor, Lists);
        // colorPointerList(vis, cur_R, runBColor, Lists);
        // colorMergedListPointer(vis, cur_M, cur_E, sortColor, Lists);
      }, [[Indices, Heads, Tails], L, R, M, E, simple_stack], depth);
    }

    // Add final visualization after appending remaining elements
    function addFinalVisualization(stepName, M, depth) {
      chunker.add(stepName, (vis, Lists, cur_M, c_stk) => {
        vis.array.set(Lists, 'msort_lista_td');
        set_simple_stack(vis.array, c_stk);
        vis.array.assignVariable('M', 2, cur_M);
        colorList(vis, cur_M, sortColor, Lists);

        vis.list.updateConnections(Lists[2]);
        vis.list.assignVariableByIndex('M', cur_M);
        // colorPointerList(vis, cur_M, sortColor, Lists);
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
    /* function colorMergedListPointer(vis, cur_M, cur_E, color, Lists) {
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
    } */

    // Color a single node (for comparison highlighting)
    function colorSingleNodePointer(vis, index, color) {
      if (index === 'Null') return;
      const colorMapping = { [apColor]: '2' }; // apColor -> selected2 (red)
      const colorState = colorMapping[color] || '2';
      vis.list.selectByIndex(index, colorState);
    }

    // Main recursive merge sort function
    function MergeSort(L, len, depth) {
      setupInitialVisualization(L, len, depth);

      if (len > 1) {
        let midNum = Math.floor(len / 2);
        const { L: newL, R, Mid } = splitList(L, midNum, depth);
        const { L: sortedL, R: sortedR } = performRecursiveSort(newL, R, midNum, len, depth);
        const { M, L: remainingL, R: remainingR } = mergeHeads(sortedL, sortedR, depth);
        const mergedList = mergeRemainingElements(remainingL, remainingR, M, depth);

        // Return merged result and reposition nodes in sorted order
        chunker.add('returnM', (vis, Lists, cur_L, cur_M, c_stk, cur_depth) => {
          vis.array.set(Lists, 'msort_lista_td');
          set_simple_stack(vis.array, c_stk);
          vis.array.assignVariable('L', 2, undefined);
          vis.array.assignVariable('R', 2, undefined);
          vis.array.assignVariable('E', 2, undefined);
          vis.array.assignVariable('M', 2, cur_M);
          colorList(vis, cur_M, sortColor, Lists);

          repositionMergedList(vis, cur_M, Lists, cur_depth);

          vis.list.updateConnections(Lists[2]);
          vis.list.assignVariableByIndex('M', cur_M);
          // colorPointerList(vis, cur_M, sortColor, Lists);
        }, [[Indices, Heads, Tails], newL, mergedList, simple_stack, depth], depth);

        simple_stack.shift();
        return mergedList;
      } else {
        // Base case: single element is already sorted
        chunker.add('returnL', (vis, a, cur_L) => {
          vis.array.select(1, cur_L, 1, cur_L, '1');
          vis.array.select(2, cur_L, 2, cur_L, '1');

          // Single element no repositioning needed
        }, [A, L], depth);

        simple_stack.shift();
        return L;
      }
    }

    // Reposition merged nodes horizontally in sorted order
    function repositionMergedList(vis, startIndex, Lists, depth) {
      if (startIndex === 'Null') return;

      const Tails = Lists[2];
      const mergedNodes = []; // To store nodes in merged list

      for (let i = startIndex; i !== 'Null'; i = Tails[i]) {
        const key = vis.list.indexToKey.get(i);
        if (key) {
          mergedNodes.push({ index: i, key, node: vis.list.nodes.get(key) });
        }
      }

      if (mergedNodes.length === 0) return;

      // Use the leftmost position and Y level of the merged nodes
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