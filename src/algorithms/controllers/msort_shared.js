// Functions used in both natural merge sort and bottom up merge sort


import { areExpanded } from './collapseChunkPlugin';


// arrayB exists and is displayed only if MergeCopy is expanded
export function isMergeCopyExpanded() {
    return areExpanded(['MergeCopy']);
}

// We don't strictly need isMergeExpanded: only needed if last chunk of
// merge still had extra vars displayed.  Some code still needs
// isMergeCopyExpanded because it uses arrayB
export function isMergeExpanded() {
    return areExpanded(['MergeCopy', 'Merge']); // MergeCopy contains Merge
}

// Highlights Array A either red or green
// future color: Can add more colours in future
export function highlight(vis, index, color) {
    if (color == 'red') {
        vis.array.select(index);
    }
    if (color == 'green') {
        vis.array.patch(index);
    }
}

// Same as highlight() but checks isMergeExpanded()/arrayB is displayed, otherwise does nothing
export function highlightB(vis, index, color) {
    if (isMergeExpanded()) {
        if (color == 'red') {
            vis.arrayB.select(index);
        }
        if (color == 'green') {
            vis.arrayB.patch(index);
        }
    }
}

// unhighlights arrayA
export function unhighlight(vis, index, color) {
    if (color == 'red') {
        vis.array.deselect(index);
    }
    if (color == 'green') {
        vis.array.depatch(index);
    }
}

// Highlights one runlength 
export function highlightFromTo(vis, from, to, color) {
    // highlight first runlength color A
    for (let i = from; i <= to; i++) {
        highlight(vis, i, color);
    }
}

// Highlights two runlengths two colours
export function highlight2Runlength(vis, left, mid, right, colorA, colorB) {
    // highlight first runlength color A
    for (let i = left; i <= mid; i++) highlight(vis, i, colorA);
    // highlight second runlength color B
    for (let j = mid + 1; j <= right; j++) highlight(vis, j, colorB);
}

// Assigns label to array A at index, checks if index is greater than size of array
// if index is greater than size, assign label to last element in array
export function assignVarToA(vis, variable_name, index, size) {
    if (index === undefined)
        vis.array.removeVariable(variable_name);
    else if (index >= size)
        vis.array.assignVariable(variable_name, size - 1)
    else
        vis.array.assignVariable(variable_name, index);
}

// Same as above function bet also checks if array B is displayed
export function assignVarToB(vis, variable_name, index, size) {
    if (isMergeExpanded()) {
        if (index === undefined)
            vis.arrayB.removeVariable(variable_name);
        else if (index >= size)
            vis.arrayB.assignVariable(variable_name, size - 1);
        else
            vis.arrayB.assignVariable(variable_name, index);
    }
}

// Display all the labels needed for Merge()
export function displayMergeLabels(vis, ap1, max1, ap2, max2, bp, size) {
    assignVarToA(vis, 'ap1', ap1, size);
    assignVarToA(vis, 'max1', max1, size);
    assignVarToA(vis, 'ap2', ap2, size);
    assignVarToA(vis, 'max2', max2, size);
    if (isMergeExpanded()) assignVarToB(vis, 'bp', bp, size);
}

// highlight the ap1 and ap2 pointers, used when comparing the two elements
export function highlightAPointers(vis, ap1, max1, ap2, max2, color) {
    if (ap1 <= max1) {
        highlight(vis, ap1, color);
    }
    if (ap2 <= max2) {
        highlight(vis, ap2, color);
    }
}

// for displaying the runlength / runcount
export function set_simple_stack(vis_array, c_stk) {
    vis_array.setList(c_stk);
}

// this function sets array a, highlighting two runlengths, and set the stack
export function resetArrayA(vis, arr_type, A, left, mid, right, stack, colorA, colorB) {

    if (arr_type === "bup") vis.array.set(A, 'msort_arr_bup');
    if (arr_type === "nat") vis.array.set(A, 'msort_arr_nat');

    highlight2Runlength(vis, left, mid, right, colorA, colorB);


    if (arr_type === "bup") set_simple_stack(vis.array, [`runlength = ${stack}`]);
    if (arr_type === "nat") set_simple_stack(vis.array, [`runcount = ${stack}`]);
}