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

import Tracer from '../common/Tracer';
import TwoArray2DRenderer from './TwoArray2DRenderer';

class Element {
  constructor(value) {
    this.value = value;
    this.patched = false;
    this.selected = false;
    this.sorted = false;
  }
}

class TwoArray2DTracer extends Tracer {
  /*
  This class is for Horspool's shift table
  Reading Array2DTracer is advised if you need to modify this class
  */
  getRendererClass() {
    return TwoArray2DRenderer;
  }

  /**
   * @param {array} array2d
   * @param {string} algo used to mark if it is a specific algorithm
   */
  set(array2d = [],array2d1=[], algo) {
    this.data = array2d.map(array1d => [...array1d].map(value => new Element(value)));
    this.data1 = array2d1.map(array1d => [...array1d].map(value => new Element(value)));
    this.algo = algo;
    super.set();
  }

  getposition(x,y){
    let longestRow = this.data.reduce((longestRow, row) => longestRow.length < row.length ? row : longestRow, []);
    let len = longestRow.length;
    var xx=x;
    var pos=0;
    if (x>=len){xx=x-len;pos=1;}
    return [pos,xx,y];
  }

  patch(x, y, v = this.data[x][y].value) {
    let rr=this.getposition(x,y);
    var pos=rr[0];
    var xx = rr[2];//x is actually the vertical one
    var yy = rr[1];
    if (pos===0)
    {
      if (!this.data[xx][yy]) {this.data[xx][yy] = new Element();}
      this.data[xx][yy].value = v;
      this.data[xx][yy].patched = true;
    }
    else
    {
      if (!this.data1[xx][yy]) {this.data1[xx][yy] = new Element();}
      this.data1[xx][yy].value = v;
      this.data1[xx][yy].patched = true;
    }

  }

  depatch(x, y) {
    let rr=this.getposition(x,y);
    var pos=rr[0];
    var xx = rr[2];//x is actually the vertical one
    var yy = rr[1];
    if (pos===0)
    {
      if (!this.data[xx][yy]) {this.data[xx][yy] = new Element();}

      this.data[xx][yy].patched = false;
    }
    else
    {
      if (!this.data1[xx][yy]) {this.data1[xx][yy] = new Element();}

      this.data1[xx][yy].patched = false;
    }
  }
  select(x, y) {
    let rr=this.getposition(x,y);
    var pos=rr[0];
    var xx = rr[2];//x is actually the vertical one
    var yy = rr[1];
    if (pos===0)
    {
      if (!this.data[xx][yy]) {this.data[xx][yy] = new Element();}
      this.data[xx][yy].selected = true;
    }
    else
    {
      if (!this.data1[xx][yy]) {this.data1[xx][yy] = new Element();}
      this.data1[xx][yy].selected = true;
    }

  }

  deselect(x, y) {
    let rr=this.getposition(x,y);
    var pos=rr[0];
    var xx = rr[2];//x is actually the vertical one
    var yy = rr[1];
    if (pos===0)
    {
      this.data[xx][yy].selected = false;
    }
    else
    {
      this.data1[xx][yy].selected = false;
    }

  }

}

export default TwoArray2DTracer;
