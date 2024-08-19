/* eslint-disable import/no-unresolved */

import Tracer from '../common/Tracer';

class ListTracer extends Tracer {
    getRendererClass() {
        return ListTracer;
    }

    init() {
        super.init();
    }
    set(array1d = [], algo) {
        const array2d=array1d;
        super.set(array2d, algo);}

    syncChartTracer() {
        if (this.chartTracer) this.chartTracer.data = this.data;
    }
}

export default ListTracer