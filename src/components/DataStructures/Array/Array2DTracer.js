// used to display graphs, such as in the case of:
// A*
// Breadth First Search
// Depth First Search
// Dijkstra's
// Kruskal
// Prim
// Warshall
// Union Find

// Or tables, such as in the case of:
// Horspool's
// Merge Sort List
// Union find

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
    // XXX should we have these also???
    this.selected1 = false;
    this.selected2 = false;
    this.selected3 = false;
    this.selected4 = false;
    this.selected5 = false;
    this.sorted = false;
    this.key = key;
    this.variables = [];
    this.stack = [];
    this.fill = 0;

    // Leak a little bit of CSS styling through to
    // the tracer layer, a CSS color property can be used here.
    // This includes css vars like --peach if you want.
    // It is not bad practice to do so, I am guessing this is why
    // the above became so convuluted because we did not want to leak
    // CSS props as input for the Tracer layer, but this is a case where
    // we want to break a general design principle. Controllers should
    // have a map that maps its specific algorithm semantics to colours
    // not the tracer. This is already what is being done in the refactor.
    this.color = undefined;
  }
}

class Array2DTracer extends Tracer {
  getRendererClass() {
    return Array2DRenderer;
  }

  init() {
    super.init();
  }

  /**
   * @param {array} array2d
   * @param {string} algo used to mark if it is a specific algorithm
   * @param {any} kth used to display kth
   * @param {number} highlightRow used mark the row to highlight
   * @param {Object} splitArray determine how to split the array
   * @param {number} splitArray.rowLength determine the length of a split array
   * @param {string[]} splitArray.rowHeader determine the header of each row of a split array
   */
  set(array2d = [], algo, kth = 1, highlightRow, splitArray) {
    // set the array2d based of the splitArray values
    if (splitArray === undefined || splitArray.rowLength < 1) {
      this.splitArray = {doSplit: false};

      // set the value of array cells
      this.data = array2d.map((array1d) =>
        [...array1d].map((value, i) => new Element(value, i))
      );
    } else {
      this.data = [];
      this.splitArray = splitArray;
      this.splitArray.doSplit = true;

      // check if the rows have headers
      if (Array.isArray(splitArray.rowHeader) && splitArray.rowHeader.length) {
        this.splitArray.hasHeader = true;
      } else {
        this.splitArray.hasHeader = false;
      }
      let split = [];

      // splitting the array into multiple arrays of length rowLength
      let step = 0;
      while (step < array2d[0].length) {
        // one smaller array
        let arr2d = [];
        for (let i = 0; i < array2d.length; i++ ) {
          arr2d.push([
            splitArray.rowHeader[i],
            ...array2d[i].slice(step, step + splitArray.rowLength),
            ...(
              (
                (array2d[0].length - step) > 0 &&
                (array2d[0].length - step) < splitArray.rowLength
              )
              ? Array(step + splitArray.rowLength - array2d[0].length)
              : Array(0)
            )
          ]);
        }

        step += splitArray.rowLength;

        // push to a main array of multiple split arrays
        split.push(arr2d);
      }

      // set the value of array cells
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
    this.highlightRow = highlightRow;
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

  nopatch(x, y) {
    this.data[x][y].patched = 0;
  }

  // used to highlight sorted elements
  sorted(x, y) {
    if (!this.data[x][y]) this.data[x][y] = new Element();
    this.data[x][y].sorted = true;
  }

  // FFS, why use *strings* that are single digits???
  // XXX and using integers for selected??? what does it mean for
  // something to be selected more than once???
  // But selected1, selected2 etc used Booleans????
  select(sx, sy, ex = sx, ey = sy, c = '0') {
    c = Number(c); // XXX support string and integers for now
    // Color blue
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        switch (c) {
          case 0:
            this.data[x][y].selected++;
            break;
          case 1:
            this.data[x][y].selected1 = true;
            break;
          case 2:
            this.data[x][y].selected2 = true;
            break;
          case 3:
            this.data[x][y].selected3 = true;
            break;
          case 4:
            this.data[x][y].selected4 = true;
            break;
          case 5:
            this.data[x][y].selected5 = true;
            break;
          case 6: // see src/components/DataStructures/colors.js
            this.data[x][y].sorted = true;
            break;

          default:
            this.data[x][y].selected = true;  // XXX Bool or int?????
            break;
        }
      }
    }
  }

  /**
   * a simple fill function based on aia themes
   * @param {number} sx the starting row to fill
   * @param {number} sy the starting row to fill
   * @param {number} ex the ending row to fill, defaults to sx
   * @param {number} ey the ending row to fill, defaults to sy
   * @param {number} c the color value, where green=1, yellow=2, and red=3
   */
  fill(sx, sy, ex = sx, ey = sy, c = 0) {
    if (!this.splitArray.doSplit) {
      for (let x = sx; x <= ex; x++) {
        for (let y = sy; y <= ey; y++) {
          this.data[x][y].fill = c === 1 || c === 2 || c === 3 ? c : 0;
        }
      }
    } else {
      for (let i = 0; i < this.data.length; i++) {
        // when it is just one cell for each row
        if (sy === ey) {
          let relativeY = sy + (this.splitArray.hasHeader ? 1 : 0);

          // if the relative start position is over the split array length, wrap to next split array
          if (relativeY > this.splitArray.rowLength) {
            sy -= this.splitArray.rowLength;
            ey -= this.splitArray.rowLength;
            continue;
          }

          for (let x = sx; x <= ex; x++) {
            this.data[i][x][relativeY].fill =
              c === 1 ||
              c === 2 ||
              c === 3 ?
              c : 0;
          }

          break;
        }


        // when there are multiple columns
        // if the relative start position is over the split array length, wrap to next split array
        let relativeSY = sy + (this.splitArray.hasHeader ? 1 : 0);
        if (relativeSY > this.splitArray.rowLength) {
          sy -= this.splitArray.rowLength;
          ey -= this.splitArray.rowLength;
          continue;
        }


        // if the relative start position is over the split array length, limit
        let relativeEY = ey + (this.splitArray.hasHeader ? 1 : 0);
        if (relativeEY > this.splitArray.rowLength) {
          relativeEY = this.splitArray.rowLength;
        }

        // out of range, stop
        if (relativeEY < 0) {
          break;
        }

        // start at the first index of subarray
        if (relativeSY < 0) {
          relativeSY = 0;
        }

        for (let x = sx; x <= ex; x++) {
          for (let y = relativeSY; y <= relativeEY; y++) {
            this.data[i][x][y].fill = c === 1 || c === 2 || c === 3 ? c : 0;
          }
        }

        sy -= this.splitArray.rowLength;
        ey -= this.splitArray.rowLength;
      }
    }
  }

  /**
   * unfills the given element (used with fill)
   * @param {number} sx the starting row to unfill
   * @param {number} sy the starting row to unfill
   * @param {number} ex the ending row to unfill, defaults to sx
   * @param {number} ey the ending row to unfill, defaults to sy
   */
  unfill(sx, sy, ex = sx, ey = sy) {
    if (!this.splitArray.doSplit) {
      for (let x = sx; x <= ex; x++) {
        for (let y = sy; y <= ey; y++) {
          this.data[x][y].fill = 0;
        }
      }
    } else {
      for (let i = 0; i < this.data.length; i++) {
        if (sy === ey) {
          let relativeSY = sy + (this.splitArray.hasHeader ? 1 : 0);
          if (relativeSY > this.splitArray.rowLength) {
            sy -= this.splitArray.rowLength;
            continue;
          }

          for (let x = sx; x <= ex; x++) {
            this.data[i][x][relativeSY].fill = 0;
          }

          break;
        }


        let relativeSY = sy + (this.splitArray.hasHeader ? 1 : 0);
        if (relativeSY > this.splitArray.rowLength) {
          sy -= this.splitArray.rowLength;
          ey -= this.splitArray.rowLength;
          continue;
        }

        let relativeEY = ey + (this.splitArray.hasHeader ? 1 : 0);
        if (relativeEY > this.splitArray.rowLength) {
          relativeEY = this.splitArray.rowLength;
        }

        // out of range
        if (relativeEY < 0) {
          break;
        }

        // start at the first index of subarray
        if (relativeSY < 0) {
          relativeSY = 0;
        }

        for (let x = sx; x <= ex; x++) {
          for (let y = relativeSY; y <= relativeEY; y++) {
            this.data[i][x][y].fill = 0;
          }
        }

        sy -= this.splitArray.rowLength;
        ey -= this.splitArray.rowLength;
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
  assignVariable(v, row, idx, changeFrom) {
    // deep clone data so that changes to this.data are all made at the same time which will allow for tweening
    // eslint-disable-next-line consistent-return
    function customizer(val) {
      if (val instanceof Element) {
        const newEl = new Element(val.value, val.key);
        if (val.patched) newEl.patched = true;
        if (val.selected) newEl.selected = true;
        if (val.sorted) newEl.sorted = true;
        newEl.variables = val.variables;
        newEl.fill = val.fill;
        return newEl;
      }
    }

    if (!this.splitArray.doSplit) {
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
            (val) => val !== ((changeFrom !== undefined) ? changeFrom : v)
          );
        }

        // add variable to item if not undefined or null
        if (idx !== null && idx !== undefined) {
          // check if idx is in subarray
          // account for header offset
          let relativeIdx = idx + (this.splitArray.hasHeader ? 1 : 0);
          if (relativeIdx > 0 && relativeIdx <= this.splitArray.rowLength)
            _newData[row][relativeIdx].variables.push(v);
        }

        newData.push(_newData);
        idx -= this.splitArray.rowLength;
      }

      // update this.data
      this.data = newData;
    }
  }

  resetVariable(row) {
    // deep clone data so that changes to this.data are all made at the same time which will allow for tweening
    // eslint-disable-next-line consistent-return
    function customizer(val) {
      if (val instanceof Element) {
        const newEl = new Element(val.value, val.key);
        if (val.patched) newEl.patched = true;
        if (val.selected) newEl.selected = true;
        if (val.sorted) newEl.sorted = true;
        newEl.variables = val.variables;
        newEl.fill = val.fill;
        return newEl;
      }
    }

// <<<<<<< HEAD XXX merge BUP mergesort - first bit looks dodgy
//    // add variable to item if not undefined or null
//    if (idx !== null && idx !== undefined)
//      newData[row][idx].variables.push(v);
// =======
    if (!this.splitArray.doSplit) {
      const newData = cloneDeepWith(this.data, customizer);
// >>>>>>> 2024_sem2

      // remove all current occurences of the variable
      for (let y = 0; y < newData[row].length; y++) {
        newData[row][y].variables = []
      }

      this.data = newData;
    } else {
      let newData = [];
      for (let i = 0; i < this.data.length; i++) {
        let _newData = cloneDeepWith(this.data[i], customizer);

        // remove all current occurences of the variable
        for (let y = 0; y < _newData[row].length; y++) {
          _newData[row][y].variables = [];
        }

        newData.push(_newData);
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
        // XXX Boolean/integer/(un)defined???
        this.data[x][y].selected = 0;
        this.data[x][y].selected1 = false;
        this.data[x][y].selected2 = false;
        this.data[x][y].selected3 = false;
        this.data[x][y].selected4 = false;
        this.data[x][y].selected5 = false;
        this.data[x][y].sorted = false;
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
  updateValueAt(x, y, newValue) {
    if (!this.splitArray.doSplit) {
      if (!this.data[x] || !this.data[x][y]) {
        return;
      }
      this.data[x][y].value = newValue;
    } else {
      for (let i = 0; i < this.data.length; i++) {
        if (y !== null || y !== undefined || y >= 0) {
          // check if y is in subarray
          // add 1 to account for header offset
          let relativeY = y + (this.splitArray.hasHeader ? 1 : 0);
          if (relativeY > 0 && relativeY <= this.splitArray.rowLength) {
            if (!this.data[i][x] || !this.data[i][x][relativeY]) continue;
            this.data[i][x][relativeY].value = newValue;
          }
          y -= this.splitArray.rowLength;
        }
      }
    }
  }

  /**
   * Get the value at the given position of the array.
   * @param {*} x the row index.
   * @param {*} y the column index.
   */
  getValueAt(x, y) {
    if (!this.splitArray.doSplit) {
      if (!this.data[x] || !this.data[x][y]) {
        return;
      }

      return this.data[x][y].value;
    } else {
      for (let i = 0; i < this.data.length; i++) {
        if (y !== null || y !== undefined || y >= 0) {
          // check if y is in subarray
          // add 1 to account for header offset
          let relativeY = y + (this.splitArray.hasHeader ? 1 : 0);
          if (relativeY > 0 && relativeY <= this.splitArray.rowLength) {
            if (!this.data[i][x] || !this.data[i][x][relativeY]) continue;
            return this.data[i][x][relativeY].value;
          }
          y -= this.splitArray.rowLength;
        }
      }
    }
  }

  /**
   * Extract the array at the given row(s) of the array.
   * @param {*} row the row index(es).
   * @param {*} empty the character to change to empty.
   */
  extractArray(row, empty) {
    let extract = [];
    // currently does not support empty character replacement
    // to implement later
    if (!this.splitArray.doSplit) {
      if (Array.isArray(row) && row.length) {
        for (const i of row) {
          extract.push(this.data[i].map((e) => e.value));
        }
      } else {
        extract = this.data[row].map((e) => e.value);
      }

    } else {
      // combine the split array and remove the headers if exist
      let combined = [];
      if (this.splitArray.hasHeader) {
        for (const array of this.data) {
          // get the first subarray
          if (!combined.length) {
            combined = array.map((arr) => arr.slice(1));
            continue;
          }

          // append the next subarray
          for (let i = 0; i < combined.length; i++) {
            combined[i] = [...combined[i], ...array[i].slice(1)];
          }
        }
      } else {
        for (const array of this.data) {
          // get the first subarray
          if (!combined.length) {
            combined = array;
            continue;
          }

          // append the next subarray
          for (let i = 0; i < combined.length; i++) {
            combined[i] = [...combined[i], ...array[i]];
          }
        }
      }

      // extract the value array
      if (Array.isArray(row) && row.length) {
        // extracting multiple rows
        for (const i of row) {
          // get the value
          extract.push(combined[i].map((e) => e.value));
        }
      } else {
        // get the value
        extract = combined[row].map((e) => e.value);
      }
    }

    // change an empty character to undefined
    // also extract a chaining array for hash chaining
    for (let i = 0; i < extract.length; i++) {
      extract[i] = (extract[i] === empty) ? undefined : extract[i];
      if (typeof extract[i] === 'string') {
        if (extract[i].includes("..")) {
          let popper = document.getElementById('float_box_' + i);
          let array = popper.innerHTML.split(',').map(Number);
          extract[i] = array;
        }
      }
    }
    return extract;
  }

  setHighlightRow(row) {
    this.highlightRow = row;
  }

  /**
   * Sets the colour of the element at `rowIdx` `colIdx` in the array.
   */
  setColor(rowIdx, colIdx, color) {
    this.data[rowIdx][colIdx].color = color
  }

  /**
   * Assigns the colour property to the region defined by startCol + endCol, startRow + endRow.
   */
  myColorRegion(startCol, startRow, endCol = startCol, endRow = startRow, color = '#00f') {
    // Loop over every cell in the rectangular region
    for (let col = startCol; col <= endCol; col++) {
      for (let row = startRow; row <= endRow; row++) {
        const cell = this.data[col][row];
        if (!cell) continue;
        cell.color = color;
      }
    }
  }
}

export default Array2DTracer;
