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
  set(array2d = [], algo) {
    this.data = array2d.map(array1d => [...array1d].map((value, i) => new Element(value, i)));
    this.algo = algo;
    this.kth = '1'; 
    this.listOfNumbers = '';
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

  select(sx, sy, ex = sx, ey = sy, c = '0') { // Color blue
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

  assignVariable(v, row, idx) {
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
    const newData = cloneDeepWith(this.data, customizer);

    // remove all current occurences of the variable
    for (let y = 0; y < newData[row].length; y++) {
      newData[row][y].variables = newData[row][y].variables.filter((val) => val !== v);
    }

    // add variable to item
    newData[row][idx].variables.push(v);

    // update this.data
    this.data = newData;
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
   
  setList(array) {
    this.listOfNumbers = array.join(', ');
}
}

export default Array2DTracer;
