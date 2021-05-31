/* eslint-disable class-methods-use-this */

/* draw two arrays in the same box */

import Array2DTracer from './Array2DTracer';
import Array1DRenderer from './Array1DRenderer/index';

class TwoArray1DTracer extends Array2DTracer {
  getRendererClass() {
    return Array1DRenderer;
  }

  init() {
    super.init();
    this.chartTracer = null;
  }

  set(array1d1 = [], array1d2 = [], algo) {
    const array1 = [array1d1];
    const array2 = [array1d2];
    super.set(array1, algo);
    super.set(array2, algo);
    this.syncChartTracer();
  }

  patch(x, v) {
    super.patch(0, x, v);
  }

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

  deselect(sx, ex = sx) {
    super.deselect(0, sx, 0, ex);
  }

  chart(key) {
    this.chartTracer = key ? this.getObject(key) : null;
    this.syncChartTracer();
  }

  syncChartTracer() {
    if (this.chartTracer) this.chartTracer.data = this.data;
  }

  swapElements(x, y) {
    const temp = this.data[0][x].value;
    this.data[0][x].value = this.data[0][y].value;
    this.data[0][y].value = temp;
  }
}

export default TwoArray1DTracer;
