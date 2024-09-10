/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-mixed-operators */
/* eslint-disable arrow-parens */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable import/no-unresolved */

import { cloneDeepWith } from 'lodash';
import Tracer from '../common/Tracer';
import Array2DRenderer from './Array2DRenderer';

export class Element {
  constructor(value, key) {
    this.value = value;
    this.patched = 0;
    this.selected = 0;
    this.sorted = false;
    this.key = key;
    this.variables = [];
    this.stack = [];
    this.fill = 0;
  }
}

class Array2DTracer extends Tracer {
  getRendererClass() {
    return Array2DRenderer;
  }

  /**
   * @param {array} array2d
   * @param {string} algo used to mark if it is a specific algorithm
   */
  set(array2d = [], algo, kth = 1, splitArray = null) {
    if (splitArray === null || splitArray.rowLength < 1) {
      this.data = array2d.map((array1d) =>
        [...array1d].map((value, i) => new Element(value, i))
      );
    } else {
      let split = [];

      let step = 0;
      while (step < array2d[0].length) {
        let arr2d = [];
        for (let i = 0; i < array2d.length; i++ ) {
          arr2d.push([
            splitArray.rowHeader[i],
            ...array2d[i].slice(step, step + splitArray.rowLength)
          ]);
        }

        step += splitArray.rowLength;
        split.push(arr2d);
      }

      for (const item of split) {
        this.data.push(item.map((array1d) =>
          [...array1d].map((value, i) => new Element(value, i))
        ));
      }
    }
    this.algo = algo;
    this.kth = kth;
    this.motionOn = true; // whether to use animation
    this.hideArrayAtIdx = null; // to hide array at given index
    this.listOfNumbers = '';
    this.splitArray = splitArray;
    super.set();
  }

  patch(x, y, v = this.data[x][y].value) {
    if (!this.data[x][y]) this.data[x][y] = new Element();
    this.data[x][y].value = v;
    this.data[x][y].patched++;
  }

  depatch(x, y, v = this.data[x][y].value) {
    this.data[x][y].patched--;
    this.data[x][y].value = v;
  }

  // used to highlight sorted elements
  sorted(x, y) {
    if (!this.data[x][y]) this.data[x][y] = new Element();
    this.data[x][y].sorted = true;
  }

  select(sx, sy, ex = sx, ey = sy, c = '0') {
    // Color blue
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        switch (c) {
          case '0':
            this.data[x][y].selected++;
            break;
          case '1':
            this.data[x][y].selected1 = true;
            break;
          case '2':
            this.data[x][y].selected2 = true;
            break;
          case '3':
            this.data[x][y].selected3 = true;
            break;
          case '4':
            this.data[x][y].selected4 = true;
            break;
          case '5':
            this.data[x][y].selected5 = true;
            break;

          default:
            this.data[x][y].selected = true;
            break;
        }
      }
    }
  }

  // a simple fill function based on aia themes
  // where green=1, yellow=2, and red=3
  fill(sx, sy, ex = sx, ey = sy, c = 0) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].fill = c === 1 || c === 2 || c === 3 ? c : 0;
      }
    }
  }

  // unfills the given element (used with fill)
  unfill(sx, sy, ex = sx, ey = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].fill = 0;
      }
    }
  }

  // Set opacity to 0.3
  fadeOut(sx, sy, ex = sx, ey = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].faded = true;
      }
    }
  }

  // Set opacity to 1
  fadeIn(sx, sy, ex = sx, ey = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].faded = false;
      }
    }
  }

  // XXX for some reason, variables only seem to be displayed if
  // row==2, and if you don't have enough rows in the table you are
  // stuck unless you add an extra dummy row and hide it using hideArrayAtIndex
  assignVariable(v, row, idx, changeFrom = null) {
    // deep clone data so that changes to this.data are all made at the same time which will allow for tweening
    // eslint-disable-next-line consistent-return
    function customizer(val) {
      if (val instanceof Element) {
        const newEl = new Element(val.value, val.key);
        if (val.patched) newEl.patched = true;
        if (val.selected) newEl.selected = true;
        if (val.sorted) newEl.sorted = true;
        newEl.variables = val.variables;
        return newEl;
      }
    }
    if (this.splitArray === null || this.splitArray.rowLength < 1) {
      const newData = cloneDeepWith(this.data, customizer);

      // remove all current occurences of the variable
      for (let y = 0; y < newData[row].length; y++) {
        newData[row][y].variables = newData[row][y].variables.filter(
          (val) => val !== v
        );
      }

      // add variable to item if not undefined or null
      if (idx !== null && idx !== undefined)
         newData[row][idx].variables.push(v);

      // update this.data
      this.data = newData;

    } else {
      let newData = [];
      for (let i = 0; i < this.data.length; i++) {
        let _newData = cloneDeepWith(this.data[i], customizer);

        // remove all current occurences of the variable
        for (let y = 0; y < _newData[row].length; y++) {
          _newData[row][y].variables = _newData[row][y].variables.filter(
            (val) => val !== ((changeFrom !== null) ? changeFrom : v)
          );
        }

        // add variable to item if not undefined or null
        if (idx !== null && idx !== undefined) {
          // check if idx is in subarray
          // add i to account for header offset
          let relativeIdx = idx + 1;
          if (relativeIdx > 0 && relativeIdx < this.splitArray.rowLength)
            _newData[row][relativeIdx].variables.push(v);
        }

        newData.push(_newData);
        idx -= this.splitArray.rowLength;
      }

      // update this.data
      this.data = newData;
    }
  }

  /**
   * Whether to use animation. Could be used to immediately update the state.
   * For instance, where there are two 'distinct' operation and the sliding motion complicates.
   * @param {*} bool
   */
  setMotion(bool = true) {
    this.motionOn = bool;
  }

  // style = { backgroundStyle: , textStyle: }
  styledSelect(style, sx, sy, ex = sx, ey = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].selected++;
        this.data[x][y].style = style;
      }
    }
  }

  selectRow(x, sy, ey, c = '0') {
    this.select(x, sy, x, ey, c);
  }

  selectCol(y, sx, ex, c = '0') {
    this.select(sx, y, ex, y, c);
  }

  deselect(sx, sy, ex = sx, ey = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].selected = false;
        this.data[x][y].selected1 = false;
        this.data[x][y].selected2 = false;
        this.data[x][y].selected3 = false;
        this.data[x][y].selected4 = false;
        this.data[x][y].selected5 = false;
        this.data[x][y].style = undefined;
      }
    }
  }

  deselectRow(x, sy, ey) {
    this.deselect(x, sy, x, ey);
  }

  deselectCol(y, sx, ex) {
    this.deselect(sx, y, ex, y);
  }

  showKth(k = '0') {
    this.kth = k;
  }

  // caption for arrays (undefined means no caption, [] may result in a blank
  // caption, depending on the algorithm - there may be extra text)
  setList(array) {
    if (array)
      this.listOfNumbers = array.join(', ');
    else
      this.listOfNumbers = undefined;
  }

  getKth() {
    return this.kth;
  }

  /**
   * Hides the array at the given index.
   * @param {*} index the index of the array to hide.
   */
  hideArrayAtIndex(index) {
    this.hideArrayAtIdx = index;
  }

  /**
   * Updates the value at the given position of the array.
   * @param {*} x the row index.
   * @param {*} y the column index.
   * @param {*} newValue the new value.
   */
  updateValueAt(row, idx, newValue) {
    if (this.splitArray === null || this.splitArray.rowLength < 1) {
      if (!this.data[row] || !this.data[row][idx]) {
        return;
      }
      this.data[row][idx].value = newValue;
    } else {
      for (let i = 0; i < this.data.length; i++) {
        if (idx !== null || idx !== undefined || idx >= 0) {
          // check if idx is in subarray
          // add 1 to account for header offset
          let relativeIdx = idx + 1;
          if (relativeIdx > 0 && relativeIdx < this.splitArray.rowLength) {
            if (!this.data[i][row] || !this.data[i][row][relativeIdx]) continue;
            this.data[i][row][relativeIdx].value = newValue;
          }
          idx -= this.splitArray.rowLength;
        }
      }
    }
  }
}

export default Array2DTracer;
