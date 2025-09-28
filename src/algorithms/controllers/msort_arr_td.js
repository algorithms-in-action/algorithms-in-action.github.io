// Merge sort for arrays, top down
// Adapted code from Quicksort...
// XXX Could do with a good clean up!
// Lots of crud, mostly abandoned attempt at QS-style stack display.
// Uses simple stack display like DFSrec; stack vanishes inside
// merge+copy because screen real-estate is limited and details of merge
// are independent of stack details anyway (may cause some surprise
// though) XXX would be nice to add QS/REX style stack display instead

import { msort_arr_td } from '../explanations';
import {colors} from '../../components/DataStructures/colors';

// Animation should be consistent with BUP/Nat merge sort
// XXX (could make code more similar and use shared code here)
const apColor = colors.apple;
const runAColor = colors.peach;
const runBColor = colors.sky;
const sortColor = colors.leaf;
const doneColor = colors.stone;

const run = run_msort();

export default {
  explanation: msort_arr_td,
  initVisualisers,
  run
};


// XXX (was) Quicksort common code
// Example of a recursive algorithm that could serve as a guide to
// implementing others.  Some things to note:
// 1) A depth parameter is added to the recursive code and also passed
// to chunker.add()
// 2) Recursive calls are in code blocks that can be collapsed, so the
// whole recursive call can be done in a single step. To do this we must
// have chunks at the recursion level of the call at the start and end
// of the collapsed computation. Here the start chunk is a comment line.
// It does nothing but notes that the call on the next line is recursive.
// At the next step control goes back to the start of the function so
// an extra comment is not a bad thing to do for clarity in any case.
// The chunk after the recursive computation is at the line of code with
// the call, so the call is highlighted when it returns, as we would
// want.
// 3) The stack is visualised in the animation, to help understanding of
// the algorithm overall and also where we are in the recursion.
// 4) There is chunk at the end of the whole computation that cleans up
// the final display a bit.

// There may be remnants of code from a previous version that didn't
// encapsulate the recursive calls properly

// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  areExpanded,
} from './collapseChunkPlugin';

/////////////////////////////////////////////////////
// arrayB exists and is displayed only if MergeCopy is expanded
function isMergeCopyExpanded() {
  return areExpanded(['MergeCopy']);
}

// We don't strictly need isMergeExpanded: only needed if last chunk of
// merge still had extra vars displayed.  Some code still needs
// isMergeCopyExpanded because it uses arrayB
function isMergeExpanded() {
  return areExpanded(['MergeCopy', 'Merge']); // MergeCopy contains Merge
}

// checks if either recursive call is expanded (otherwise stack is not
// displayed)
function isRecursionExpanded() {
  return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

// see stackFrameColour in index.js to find corresponding function mapping to css
const STACK_FRAME_COLOR = {
  No_color: 0,
  In_progress_stackFrame: 1,
  Current_stackFrame: 2,
  Finished_stackFrame: 3,
  I_color: 4,
  J_color: 5,
  P_color: 6, // pivot
};

// for simple DFS-like stack display
let simple_stack = [];


// ----------------------------------------------------------------------------------------------------------------------------

// Define helper functions
// without javascript Closure arguements (IE 'global variables')
// ----------------------------------------------------------------------------------------------------------------------------

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}


// 修复的 update_vis_with_stack_frame
// 修改 update_vis_with_stack_frame 函数（约第 99 行）
export function update_vis_with_stack_frame(a, stack_frame, stateVal, arrayValues, arrayLength) {
  let left, right, depth;
  [left, right, depth] = stack_frame;

  // 边界检查
  if (depth >= a.length || depth < 0) {
    return a;
  }

  // 确保该深度的数组存在
  if (!a[depth]) {
    a[depth] = [...Array.from({ length: arrayLength })].map(() => ({
      base: STACK_FRAME_COLOR.No_color,
      extra: [],
      value: undefined,
      isLeftBoundary: false,
      isRightBoundary: false
    }));
  }

  // 填充整个区间，并添加数值信息
  for (let i = left; i <= right && i < a[depth].length; i++) {
    if (i >= 0) {
      a[depth][i] = { 
        base: stateVal, 
        extra: [],
        value: arrayValues ? arrayValues[i] : undefined,
        isLeftBoundary: i === left,
        isRightBoundary: i === right
      };
    }
  }
  
  return a;
}


const highlight = (vis, index, color) => {
  vis.array.selectColor(index, color);
};

const highlightB = (vis, index, color) => {
  vis.arrayB.selectColor(index, color);
};

// XXX third arg unused
const unhighlight = (vis, index, isPrimaryColor = true) => {
  vis.array.deselect(index);
};

// XXX third arg unused
const unhighlightB = (vis, index, isPrimaryColor = true) => {
  vis.arrayB.deselect(index);
};


// ----------------------------------------------------------------------------------------------------------------------------


// We hide array B entirely if things mergeCopy is collapsed
export function initVisualisers() {
  if (isMergeCopyExpanded()) {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array A', {
          arrayItemMagnitudes: true,
        }),
        order: 0,
      },
      arrayB: {
        instance: new ArrayTracer('arrayB', null, 'Array B', {
          arrayItemMagnitudes: true,
        }),
        order: 1,
      },
    }
  } else {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array A', {
          arrayItemMagnitudes: true,
        }),
        order: 0,
      },
    }
  }
}


/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_msort() {

  return function run(chunker, { nodes }) {
    // can't rename from nodes

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define 'global' variables
    // ----------------------------------------------------------------------------------------------------------------------------

    const entire_num_array = nodes;
    const original_array = [...nodes];
    let A = nodes;
    let B = [...entire_num_array].fill(undefined);
    let max_depth_index = -1; // indexes into 2D array, starts at zero
    const finished_stack_frames = []; // [ [left, right,  depth], ...]  (although depth could be implicit this is easier)
    const real_stack = []; // [ [left, right,  depth], ...]
    let HIDE_STACKS_DURING_MERGE = [];

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define helper functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function derive_stack(cur_real_stack, cur_finished_stack_frames, cur_i, cur_j, cur_pivot_index, cur_depth, arrayValues) {
      // 递归折叠时，不显示栈
      if (!isRecursionExpanded()) {
        return [];
      }
    
      let stack_vis = [];
      const displayValues = original_array;
      const arrayLen = entire_num_array.length;  // 获取数组长度
    
      // 初始化栈可视化数组
      for (let i = 0; i < max_depth_index + 1; i++) {
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
    
      // 先显示所有已完成的栈帧（灰色）
      cur_finished_stack_frames.forEach((stack_frame) => {
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          stack_frame,
          STACK_FRAME_COLOR.Finished_stackFrame,
          displayValues,
          arrayLen  // 传递数组长度
        );
      });
    
      // 然后显示当前活动的栈帧
      cur_real_stack.forEach((stack_frame, index) => {
        const color = (index === cur_real_stack.length - 1) 
          ? STACK_FRAME_COLOR.Current_stackFrame
          : STACK_FRAME_COLOR.In_progress_stackFrame;
        
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          stack_frame,
          color,
          displayValues,
          arrayLen  // 传递数组长度
        );
      });
    
      return stack_vis;
    }
    
    
    const refresh_stack = (
      vis, cur_real_stack, cur_finished_stack_frames,
      cur_i, cur_j, cur_pivot_index, cur_depth, cur_array, cur_B
    ) => {
      console.log(`Depth ${cur_depth}: Real stack has ${cur_real_stack.length} frames`);
      for (let i = 0; i < cur_real_stack.length; i++) {
        console.log(`  Frame ${i}: [${cur_real_stack[i]}]`);
      }
      if (cur_i === -1) cur_i = undefined;
      if (cur_j === -1) cur_j = undefined;
    
      assert(vis.array);
      assert(cur_real_stack && cur_finished_stack_frames);
    
      // 递归折叠：不显示栈
      if (!isRecursionExpanded()) {
        vis.array.setStackDepth(0);
        vis.array.setStack(undefined);
        if (vis.arrayB) {
          vis.arrayB.setStackDepth(0);
          vis.arrayB.setStack(undefined);
        }
        return;
      }
    
      // ✅ 合并阶段总开关：一旦打开，无论 B 有没有值，都隐藏栈
// 检查当前深度的合并标志
      if (HIDE_STACKS_DURING_MERGE[cur_depth]) {  // 使用当前深度的标志
        vis.array.setStackDepth(0);
        vis.array.setStack(undefined);
        if (vis.arrayB) {
          vis.arrayB.setStackDepth(0);
          vis.arrayB.setStack(undefined);
        }
        return;
      }
          
      // B 有内容：也隐藏（双保险）
      let arrayBHasContent = false;
      if (cur_B && isMergeCopyExpanded()) {
        arrayBHasContent = cur_B.some(val => val !== undefined);
      }
      if (arrayBHasContent) {
        vis.array.setStackDepth(0);
        vis.array.setStack(undefined);
        if (vis.arrayB) {
          vis.arrayB.setStackDepth(0);
          vis.arrayB.setStack(undefined);
        }
        return;
      }
    
      // B 为空且非合并阶段：正常显示栈
      const stack_data = derive_stack(
        cur_real_stack,
        cur_finished_stack_frames,
        cur_i,
        cur_j,
        cur_pivot_index,
        cur_depth,
        original_array
      );
    
      if (isMergeCopyExpanded() && vis.arrayB) {
        vis.arrayB.setStackDepth(cur_real_stack.length);
        vis.arrayB.setStack(stack_data);
        vis.array.setStackDepth(0);
        vis.array.setStack(undefined);
      } else {
        vis.array.setStackDepth(cur_real_stack.length);
        vis.array.setStack(stack_data);
      }
    };
    

    function assignVarToA(vis, variable_name, index) {
      if (index === undefined)
        vis.array.removeVariable(variable_name);
      else
        vis.array.assignVariable(variable_name, index);
    }

    function assignVarToB(vis, variable_name, index) {
      if (index === undefined)
        vis.arrayB.removeVariable(variable_name);
      else
        vis.arrayB.assignVariable(variable_name, index);
    }

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define quicksort functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function renderInMerge(
      vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, 
      cur_max1, cur_max2, c_stk, cur_depth  // 添加 cur_depth
    ) {
      // 正常的数组与变量/高亮逻辑
      if (isMergeExpanded()) {
        vis.array.set(a, 'msort_arr_td');
        
        assignVarToA(vis, 'ap1', cur_ap1);
        assignVarToA(vis, 'max1', cur_max1);
        
        for (let i = cur_left; i <= cur_max1; i++) {
          if (i === cur_ap1) highlight(vis, i, apColor);
          else highlight(vis, i, runAColor);
        }
        for (let i = cur_max1 + 1; i <= cur_max2; i++) {
          if (i === cur_ap2) highlight(vis, i, apColor);
          else highlight(vis, i, runBColor);
        }
        
        if (cur_ap2 < a.length) {
          assignVarToA(vis, 'ap2', cur_ap2);
          assignVarToA(vis, 'ap2=' + (a.length + 1), undefined);
        } else {
          assignVarToA(vis, 'ap2=' + (a.length + 1), a.length - 1);
          assignVarToA(vis, 'ap2', undefined);
        }
        assignVarToA(vis, 'max2', cur_max2);
        
        if (isMergeCopyExpanded()) {
          vis.arrayB.set(b, 'msort_arr_td');
          assignVarToB(vis, 'bp', cur_bp);
          for (let i = cur_left; i < cur_bp; i++) {
            highlightB(vis, i, sortColor);
          }
        }
      } else {
        vis.array.set(a, 'msort_arr_td');
      }
      
      // 调用 set_simple_stack 来处理栈列表的显示/隐藏
      set_simple_stack(vis.array, c_stk, vis, b, cur_depth);
    }
    

    // calls vis.array.setList(c_stk) to display simple stack but only
    // if recursion is expanded (otherwise stack is never displayed)
    // XXX is this confusing if we run the algorithm a bit with
    // recursion expanded then collapse recursion? I guess if you are
    // doing that you have a pretty good understanding anyway?
    
    const set_simple_stack = (vis_array, c_stk, vis, cur_B, cur_depth) => {
      // 递归折叠：不显示栈列表
      if (!isRecursionExpanded()) {
        vis_array.setList(undefined);
        if (vis && vis.arrayB) vis.arrayB.setList(undefined);
        return;
      }
    
      // 合并阶段总开关：隐藏
      if (HIDE_STACKS_DURING_MERGE[cur_depth]) {
        vis_array.setList(undefined);
        if (vis && vis.arrayB) vis.arrayB.setList(undefined);
        return;
      }
    
      // B 有内容：隐藏（双保险）
      let arrayBHasContent = false;
      if (cur_B && isMergeCopyExpanded()) {
        arrayBHasContent = cur_B.some(val => val !== undefined);
      }
      if (arrayBHasContent) {
        vis_array.setList(undefined);
        if (vis && vis.arrayB) vis.arrayB.setList(undefined);
        return;
      }
    
      // B 为空：不再设置栈列表，只清除
      vis_array.setList(undefined);
      if (vis && vis.arrayB) vis.arrayB.setList(undefined);
    };
    
    
          
    

    function MergeSort(left, right, depth) {


      //// start mergesort -------------------------------------------------------- 
      // XXXXX

      real_stack.push([left, right, depth]);
      max_depth_index = Math.max(max_depth_index, depth);
      simple_stack.unshift('(' + (left + 1) + ',' + (right + 1) + ')');

      let pivot;

      // should show animation if doing high level steps for whole array OR if code is expanded to do all reccursive steps
      
      chunker.add('Main', (vis, a, b, cur_left, cur_right, cur_depth,
  cur_real_stack, cur_finished_stack_frames, c_stk) => {
  vis.array.set(a, 'msort_arr_td');
  
  if (cur_depth === 0) {
    vis.array.setLargestValue(maxValue);
    // 不要在这里清除栈
    
    if (isMergeCopyExpanded()) {
      vis.arrayB.set(b, 'msort_arr_td');
      vis.arrayB.setLargestValue(maxValue);
      // 同样不要清除 arrayB 的栈
    }
  }
  
  assignVarToA(vis, 'left', cur_left);
  assignVarToA(vis, 'right', cur_right);
  for (let i = cur_left; i <= cur_right; i++) {
    highlight(vis, i, runAColor)
  }
  
  refresh_stack(
    vis,
    cur_real_stack,
    cur_finished_stack_frames,
    cur_left,
    cur_right,
    Math.floor((cur_left + cur_right)/2),
    cur_depth,
    A,  // 改为大写
    B   // 改为大写
  );
  
  // 传递当前区间的左右边界
  set_simple_stack(vis.array, c_stk, vis, b, cur_depth);
}, [A, B, left, right, depth, real_stack, finished_stack_frames, simple_stack], depth);
      
      function refreshStackAt(vis, left, right, depth, real_stack, finished_stack_frames, array, arrayB) {
        refresh_stack(
          vis,
          real_stack,
          finished_stack_frames,
          left,
          right,
          undefined,
          depth,
          array,
          arrayB  // 添加数组参数
        );
      }
        

      chunker.add('left<right', (vis, a, b, cur_left, cur_right) => {
        // assignVarToA(vis, 'left', undefined);
        // assignVarToA(vis, 'right', undefined);
        for (let i = cur_left; i <= cur_right; i++) {
          // unhighlight(vis, i, true)
        }
      }, [A, B, left, right], depth);

      if (left < right) {
        let mid = Math.floor((left + right) / 2);
        chunker.add('mid', (vis, a, b, cur_left, cur_mid, cur_right) => {
          for (let i = cur_mid + 1; i <= cur_right; i++) {
            unhighlight(vis, i, true)
            highlight(vis, i, runBColor)
          }
          assignVarToA(vis, 'mid', cur_mid);
        }, [A, B, left, mid, right], depth);

        // dummy chunk for before recursive call - we need this so there
        // is a chunk at this recursion level as the first chunk in the
        // collapsed code for the recursive call
        chunker.add('preSortL', (vis, a, b, cur_left, cur_mid, cur_right) => {
          assignVarToA(vis, 'left', undefined);
          assignVarToA(vis, 'right', undefined);
          assignVarToA(vis, 'mid', undefined);
          // for (let i = cur_mid + 1; i <= right; i++) {
            // highlight(vis, i, true)
          // }
        }, [A, B, left, mid, right], depth);

        MergeSort(left, mid, depth + 1);

        // chunk after recursive call - it's good to highlight the
        // recursive call once it has returned plus we need a chunk at
        // this level when the recursive code is collapsed
        chunker.add('sortL', (
          vis, a, b, cur_left, cur_mid, cur_right, c_stk,  // 改为 c_stk
          cur_real_stack, cur_finished_stack_frames, cur_depth
        ) => {
          refreshStackAt(vis, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames, A, B);
          vis.array.set(a, 'msort_arr_td');  // 使用小写 a
          set_simple_stack(vis.array, c_stk, vis, b, cur_depth);  
        
          assignVarToA(vis, 'left', cur_left);
          assignVarToA(vis, 'mid', cur_mid);
          assignVarToA(vis, 'right', cur_right);
        
          for (let i = cur_left; i <= cur_mid; i++) {
            highlight(vis, i, runAColor);
          }
          for (let i = cur_mid + 1; i <= cur_right; i++) {
            highlight(vis, i, runBColor);
          }
        }, [A, B, left, mid, right, simple_stack, real_stack, finished_stack_frames, depth], depth);
        
        // dummy chunk before recursive call, as above
        chunker.add('sortR', (vis, a, b, cur_left, cur_mid, cur_right, c_stk,
          cur_real_stack, cur_finished_stack_frames, cur_depth) => {
            refreshStackAt(vis, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames, A, B);
            // vis.array.set(a, 'msort_arr_td');
            for (let i = cur_left; i <= cur_mid; i++) {
              unhighlight(vis, i, false);
            }
            assignVarToA(vis, 'left', undefined);
            assignVarToA(vis, 'mid', undefined);
            assignVarToA(vis, 'right', undefined);
        }, [A, B, left, mid, right, simple_stack, real_stack, finished_stack_frames, depth], depth);

        MergeSort(mid + 1, right, depth + 1);

        // chunk after recursive call
        chunker.add('sortR', (vis, a, b, cur_left, cur_mid, cur_right, c_stk, cur_depth) => {
          // vis.array.set(a, 'msort_arr_td');
          set_simple_stack(vis.array, c_stk, vis, b, cur_depth);  // 使用 cur_depth
          assignVarToA(vis, 'left', cur_left);
          assignVarToA(vis, 'mid', cur_mid);
          assignVarToA(vis, 'right', cur_right);
          for (let i = cur_left; i <= cur_mid; i++) {
            // unhighlight(vis, i, true);
            highlight(vis, i, runAColor)
          }
          for (let i = cur_mid+1; i <= cur_right; i++) {
            // unhighlight(vis, i, true);
            highlight(vis, i, runBColor)
          }
        }, [A, B, left, mid, right, simple_stack, depth], depth);

        // XXX should we shorten psuedocode? eg, (ap1,max1) <- (left,mid)
        let ap1 = left;
        let max1 = mid;
        let ap2 = mid + 1;
        let max2 = right;
        let bp = left;
        
        chunker.add('ap1', (vis, a, b, cur_left, cur_mid, cur_right, c_stk, cur_depth) => {  // 添加 cur_depth
          set_simple_stack(vis.array, c_stk, vis, b, cur_depth);
          // disable stack display during merge: hopefully its not
          // confusing, it avoids extra distraction and the position of
          // the stack and array B can sometimes overlap:(
          // vis.array.set(a, 'msort_arr_td');
          if (isMergeExpanded()) {
            assignVarToA(vis, 'left', undefined);
            assignVarToA(vis, 'ap1', cur_left);
            highlight(vis, cur_left, apColor);
          }
        }, [A, B, left, mid, right, simple_stack, depth], depth);
        chunker.add('max1', (vis, a, b, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'mid', undefined);
            assignVarToA(vis, 'max1', cur_mid);
          }
        }, [A, B, left, mid, right], depth);
        chunker.add('ap2', (vis, a, b, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap2', cur_mid + 1);
            highlight(vis, cur_mid + 1, apColor);
          }
        }, [A, B, left, mid, right], depth);
        chunker.add('max2', (vis, a, b, cur_left, cur_mid, cur_right, c_stk, cur_depth) => {  // 添加 cur_depth
          if (isMergeExpanded()) {
            assignVarToA(vis, 'right', undefined);
            assignVarToA(vis, 'max2', right);
          }
          set_simple_stack(vis.array, c_stk, vis, b, cur_depth);// 添加这行
        }, [A, B, left, mid, right, simple_stack, depth], depth);  // 添加 simple_stack 参数
        
        chunker.add('bp', (vis, a, b, cur_left, cur_mid, cur_right, c_stk, cur_depth) => {  // 添加 cur_depth
          if (isMergeExpanded()) {
            assignVarToB(vis, 'bp', left);
          }
          set_simple_stack(vis.array, c_stk, vis, b, cur_depth);
        }, [A, B, left, mid, right, simple_stack, depth], depth);  // 添加 simple_stack 参数

        // while (ap1 <= max1 && ap2 <= max2) 
        /* eslint-disable no-constant-condition */
        while (true) {
          chunker.add('MergeWhile', (vis, a, b, cur_ap1, cur_ap2,
            cur_bp, cur_max1, cur_max2, cur_stk, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
                cur_max2, cur_stk, cur_depth);
              refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, 
                cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, a, b)
          }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left, right, depth, real_stack, finished_stack_frames], depth);

          if (!(ap1 <= max1 && ap2 <= max2)) break;

          chunker.add('findSmaller', () => {
             // no animation 
          }, [], depth);
          if (A[ap1] < A[ap2]) {
            B[bp] = A[ap1];
            A[ap1] = undefined;
            chunker.add('copyap1', (vis, a, b, cur_ap1, cur_ap2,
              cur_bp, cur_max1, cur_max2, cur_stk, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
                HIDE_STACKS_DURING_MERGE[cur_depth] = true;  // 在这里添加这行
                renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
                  cur_max2, cur_stk, cur_depth);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, sortColor);
              }
              // 关键：B 方才写入，立刻评估并隐藏栈
              refresh_stack(vis, cur_real_stack, cur_finished_stack_frames,
                cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, a, b);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left, right, depth, real_stack, finished_stack_frames], depth);
            ap1 = ap1 + 1; 
            chunker.add('ap1++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
                renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
                  cur_max2, cur_stk, cur_depth);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, sortColor);
              }
              refresh_stack(vis, cur_real_stack, cur_finished_stack_frames,
                cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, a, b);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left, right, depth, real_stack, finished_stack_frames], depth);
            
            bp = bp + 1;
            chunker.add('bp++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
                renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
                  cur_max2, cur_stk, cur_depth);
              refresh_stack(vis, cur_real_stack, cur_finished_stack_frames,
                cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, a, b);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left, right, depth, real_stack, finished_stack_frames], depth);
            
          } else {
            B[bp] = A[ap2];
            A[ap2] = undefined;
            chunker.add('copyap2', (vis, a, b, cur_ap1, cur_ap2,
              cur_bp, cur_max1, cur_max2, cur_stk, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
                HIDE_STACKS_DURING_MERGE[cur_depth] = true;
                renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
                  cur_max2, cur_stk, cur_depth);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, sortColor);
              }
              refresh_stack(vis, cur_real_stack, cur_finished_stack_frames,
                cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, a, b);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left, right, depth, real_stack, finished_stack_frames], depth);
            
            ap2 = ap2 + 1;
            chunker.add('ap2++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
                renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
                  cur_max2, cur_stk, cur_depth);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, sortColor);
              }
              refresh_stack(vis, cur_real_stack, cur_finished_stack_frames,
                cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, a, b);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left, right, depth, real_stack, finished_stack_frames], depth);
            
            bp = bp + 1;
            chunker.add('bp++_2', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
                renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
                  cur_max2, cur_stk, cur_depth);
              refresh_stack(vis, cur_real_stack, cur_finished_stack_frames,
                cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, a, b);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left, right, depth, real_stack, finished_stack_frames], depth);            
          }
        }

        for (let i = ap1; i <= max1; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest1', (vis, a, b, cur_left, cur_ap1,
          cur_ap2, cur_max1, cur_max2, cur_bp, c_stk, cur_right, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
          if (isMergeExpanded()) {
            vis.array.set(a, 'msort_arr_td');
            if (cur_ap2 < a.length) assignVarToA(vis, 'ap2', cur_ap2);
            assignVarToA(vis, 'max2', cur_max2);
            for (let i = cur_left; i <= cur_max1; i++) highlight(vis, i, runAColor);
            for (let i = cur_max1 + 1; i <= cur_max2; i++) highlight(vis, i, runBColor);
            vis.arrayB.set(b, 'msort_arr_td');
            for (let i = cur_left; i <= cur_bp - 1; i++) highlightB(vis, i, sortColor);
            if (cur_bp < a.length) assignVarToB(vis, 'bp', cur_bp); else assignVarToB(vis, 'bp', undefined);
          }
          set_simple_stack(vis.array, c_stk, vis, b, cur_depth);
          // 关键：补一次刷新，防止剩余批量复制阶段露栈
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames,
            cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, A, B);
        }, [A, B, left, ap1, ap2, max1, max2, bp, simple_stack, right, depth, real_stack, finished_stack_frames], depth);
        

        for (let i = ap2; i <= max2; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest2', (vis, a, b, cur_left, cur_right, cur_ap2,
          cur_max2, cur_bp, c_stk, cur_depth, cur_real_stack, cur_finished_stack_frames) => {
          if (isMergeCopyExpanded()) {
            vis.array.set(a, 'msort_arr_td');
            vis.arrayB.set(b, 'msort_arr_td');
            for (let i = cur_left; i <= cur_right; i++) highlightB(vis, i, sortColor);
          }
          if (isMergeExpanded()) {
            if (cur_ap2 < a.length) {
              unhighlight(vis, cur_ap2, true);
              assignVarToA(vis, 'ap2', undefined);
            }
            assignVarToA(vis, 'max2', undefined);
            assignVarToB(vis, 'bp', undefined);
          }
          set_simple_stack(vis.array, c_stk, vis, b, cur_depth);
          // 关键：复制剩余第二段后也立即评估隐藏
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames,
            cur_left, cur_right, Math.floor((cur_left + cur_right)/2), cur_depth, A, B);
        }, [A, B, left, right, ap2, max2, bp, simple_stack, depth, real_stack, finished_stack_frames], depth);
        

        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }
        // 修改 copyBA chunk
        // 修改 copyBA chunk
      // 修改 copyBA chunk - 直接隐藏栈列表
      chunker.add('copyBA', (vis, a, b, cur_left, cur_mid, cur_right, c_stk, 
        cur_real_stack, cur_finished_stack_frames, cur_depth) => {
          HIDE_STACKS_DURING_MERGE[cur_depth] = false;
        if (isMergeCopyExpanded()) {
          vis.arrayB.set(b, 'msort_arr_td');
        }
        vis.array.set(a, 'msort_arr_td');
        
        // 高亮已排序的元素
        for (let i = cur_left; i <= cur_right; i++) {
          highlight(vis, i, sortColor);
        }
        
        // 关键：刷新栈显示
        refresh_stack(
          vis,
          cur_real_stack,
          cur_finished_stack_frames,
          cur_left,
          cur_right,
          Math.floor((cur_left + cur_right)/2),
          cur_depth,
          A,
          B
        );
        
        // 设置简单栈列表
        set_simple_stack(vis.array, c_stk, vis, b, cur_depth);
        
        // 清理变量
        if (isMergeExpanded()) {
          assignVarToA(vis, 'ap1', undefined);
          assignVarToA(vis, 'max1', undefined);
          assignVarToA(vis, 'ap2', undefined);
          assignVarToA(vis, 'max2', undefined);
        }
      }, [A, B, left, mid, right, simple_stack, real_stack, finished_stack_frames, depth], depth);
        

        // chunk after recursive call, as above, after adjusting
        // stack frames/depth etc
        
      }
      // XXX should we delete 'else' and always go to the 'Done' line
      // even for non-trivial array segments? (might need to
      // generalise (un)highlight code below
      else {
        // Base case: left >= right  
        chunker.add('Done', (vis, a, b, cur_left, cur_right, c_stk, cur_depth) => {  // 添加 cur_depth
          if (cur_left === cur_right) {
            unhighlight(vis, cur_left, true);
            highlight(vis, cur_left, sortColor);
            // 删除 sortedRanges.add 这行
          }
          
          // 关键：继续显示栈列表！
          set_simple_stack(vis.array, c_stk, vis, b, cur_depth);
          
        }, [A, B, left, right, simple_stack, depth], depth);// 确保传递 simple_stack
      }
      const frame = real_stack.pop();
      if (frame) {
        finished_stack_frames.push(frame);
      }
      simple_stack.shift();
      return A; // Facilitates testing
    }


    // ----------------------------------------------------------------------------------------------------------------------------
    // Perform actual quicksort
    // ----------------------------------------------------------------------------------------------------------------------------
    //chunker.add('Main', (vis, a, b, cur_real_stack, cur_finished_stack_frames) => {
    //vis.array.set(a, 'msort_arr_td');
    // vis.array.setStack([]); // used for QS-like stack visualisation
    //}, [A, B, real_stack, finished_stack_frames], 0);


    // We compute and fix the max value in each array so they don't get re-scaled as we
    // shuffle elements between arrays
    const maxValue = entire_num_array.reduce(
      (acc, curr) => (acc < curr ? curr : acc), 0);

    const msresult = MergeSort(0, entire_num_array.length - 1, 0);
    // const result = QuickSort(entire_num_array, 0, entire_num_array.length - 1, 0);

    // assert(real_stack.length === 0);

    // Fade out final node - fixes up stack
    // chunker.add(
    // QS_BOOKMARKS.SHARED_done_qs,
    // (vis, idx) => {
    // vis.array.setStackDepth(0);
    // vis.array.fadeOut(idx);
    // // fade all elements back in for final sorted state
    // for (let i = 0; i < entire_num_array.length; i += 1) {
    // vis.array.fadeIn(i);
    // }
    // vis.array.clearVariables();
    // vis.array.setStack(derive_stack(real_stack, finished_stack_frames));
    // },
    // [entire_num_array.length - 1],
    // 0);
    chunker.add('Done', (vis, cur_finished_stack_frames, cur_array) => {
      HIDE_STACKS_DURING_MERGE = [];  // 清空数组，重置所有深度的标志
    
      // 最终高亮（保留你原来的逻辑）
      for (let i = 0; i < entire_num_array.length; i++) {
        highlight(vis, i, doneColor);
      }
    
      // 递归面板展开时，计算“最终栈”
      if (isRecursionExpanded()) {
        const finalStack = derive_stack(
          [],                       // 最终态不需要当前 real_stack
          cur_finished_stack_frames,
          undefined, undefined, undefined, undefined,
          cur_array                 // 当前最终数组
        );
        const depth = Array.isArray(finalStack) ? finalStack.length : 0;
    
        // 根据是否展开 Merge Copy 决定挂到 A 还是 B
        if (isMergeCopyExpanded() && vis.arrayB) {
          // 只在 B 显示
          vis.array.setStackDepth(0);
          vis.array.setStack(undefined);
    
          vis.arrayB.setStackDepth(depth);
          vis.arrayB.setStack(finalStack);
        } else {
          // 只在 A 显示
          if (vis.arrayB) {
            vis.arrayB.setStackDepth(0);
            vis.arrayB.setStack(undefined);
          }
    
          vis.array.setStackDepth(depth);
          vis.array.setStack(finalStack);
        }
      } else {
        // 面板折叠：都隐藏
        vis.array.setStackDepth(0);
        vis.array.setStack(undefined);
        if (vis.arrayB) {
          vis.arrayB.setStackDepth(0);
          vis.arrayB.setStack(undefined);
        }
      }
    }, [finished_stack_frames, A], 0);

    return msresult;
  }
}