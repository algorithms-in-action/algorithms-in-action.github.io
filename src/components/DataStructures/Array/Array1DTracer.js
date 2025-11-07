// used to display one array in the form of a single bar chart, such as 
// Binary Search Tree
// Heap Sort
// Merge Sort
// Quick Sort

/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import { cloneDeepWith } from 'lodash';
import Array2DTracer, { Element } from './Array2DTracer';
import Array1DRenderer from './Array1DRenderer/index';

class Array1DTracer extends Array2DTracer {
  getRendererClass() {
    return Array1DRenderer;
  }

  init() {
    super.init();
    this.chartTracer = null;
  }

  set(array1d = [], algo) {
    const array2d = [array1d];
    super.set(array2d, algo);
    this.syncChartTracer();
  }

  // Patches/highlights an element
  patch(x, v) {
    super.patch(0, x, v);
  }

  // Removes patch/highlight
  depatch(x) {
    super.depatch(0, x);
  }

  // used to highlight sorted elements
  sorted(x) {
    super.sorted(0, x);
  }

  select(sx, ex = sx) {
    super.select(0, sx, 0, ex);
  }

  // revised way of getting colors
  selectColor(sx, c) {
    if (c !== undefined) {
      super.deselect(0, sx, 0, sx);
      super.nopatch(0, sx);
      super.select(0, sx, 0, sx, c);
    }
  }

  styledSelect(style, sx, ex = sx) {
    super.styledSelect(style, 0, sx, 0, ex);
  }

  deselect(sx, ex = sx) {
    super.deselect(0, sx, 0, ex);
  }

  fadeOut(sx, ex = sx) {
    super.fadeOut(0, sx, 0, ex);
  }

  fadeIn(sx, ex = sx) {
    super.fadeIn(0, sx, 0, ex);
  }

  chart(key) {
    this.chartTracer = key ? this.getObject(key) : null;
    this.syncChartTracer();
  }

  syncChartTracer() {
    if (this.chartTracer) this.chartTracer.data = this.data;
  }

  // Swaps two elements in 1D array
  // XXX can be a bit glitchy with variables - see insertionSort version
  // for experimentation
  // Seems to trigger re-rendering after first assignment?
  swapElements(x, y) {
    const temp1 = { ...this.data[0][x], variables: this.data[0][y].variables };
    const temp2 = { ...this.data[0][y], variables: this.data[0][x].variables };
    this.data[0][x] = temp2;
    this.data[0][y] = temp1;
  }

  // Adds variable to specific element in array
  addVariable(v, sx) {
    this.data[0][sx].variables.push(v);
  }

  // Removes value from array
  removeVariable(v) {
    for (let y = 0; y < this.data[0].length; y++) {
      const newVars = this.data[0][y].variables.filter((val) => val !== v);
      this.data[0][y].variables = newVars;
    }
  }

  // Remove all variables from array
  clearVariables() {
    for (let y = 0; y < this.data[0].length; y++) {
      this.data[0][y].variables = [];
    }
  }

  // Removes "variable" from all elements in the array and assigns new "variable" to a specificed index
  assignVariable(v, idx) {
    // deep clone data so that changes to this.data are all made at the same time which will allow for tweening
    function customizer(val) {
      if (val instanceof Element) {
        const newEl = new Element(val.value, val.key);
        newEl.patched = val.patched;
        newEl.selected = val.selected;
        newEl.selected1 = val.selected1;
        newEl.selected2 = val.selected2;
        newEl.selected3 = val.selected3;
        newEl.selected4 = val.selected4;
        newEl.selected5 = val.selected5;
        newEl.sorted = val.sorted;
        newEl.faded = val.faded;
        newEl.variables = val.variables;
        newEl.stack = val.stack;
        newEl.stackDepth = val.stackDepth;
        newEl.largestValue = val.largestValue;
        newEl.color = val.color;
        return newEl;
      }
    }
    const newData = cloneDeepWith(this.data, customizer);

    // remove all current occurences of the variable
    for (let y = 0; y < newData[0].length; y++) {
      const newVars = newData[0][y].variables.filter((val) => val !== v);
      newData[0][y].variables = newVars;
    }

    // add variable to item if not undefined or null
    if (idx !== null && idx !== undefined)
      newData[0][idx].variables.push(v);

    // update this.data
    this.data = newData;
  }

  setStack(val) {
    this.stack = val;
  }

  setStackDepth(depth) {
    this.stackDepth = depth;
  }


  // default is to compute largestColumnValue but we can set it
  // explicitly so we can make two arrays look the same when moving
  // elements between them and avoid re-scaling
  setLargestValue(val) {
    this.largestValue = val;
  }

  stringTheContent() {
    return this.data;
  }

  setColor(colIdx, color) {
    super.setColor(0, colIdx, color);
  }
}

export default Array1DTracer;
