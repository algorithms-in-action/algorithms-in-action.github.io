/* eslint-disable import/no-unresolved */
import Tracer from '../common/Tracer';
import ListRenderer from './ListRenderer/index';


export class Element {
    constructor(value, key) {
        this.value = value;
        this.patched = 0;
        this.selected = 0;
        this.sorted = false;
        this.key = key;
    }
}

class ListTracer extends Tracer {

    getRendererClass() {
        return ListRenderer;
    }


    init() {

        super.init();
        this.dimensions = {
            baseWidth: 480,
            baseHeight: 480,
        };
        this.isDirected = true;
        this.isWeighted = false;
        this.callLayout = { method: this.layoutCircle, args: [] };
        this.text = null;
        this.logTracer = null;
        this.istc = false;
    }

    set(values = []) {
        this.objects = [];
        for (let index in values) {
            this.addNode(index, values[index]);
        }
    }

    layout() {}

    addNode(id, value = undefined, visitedCount = 0, selectedCount = 0,) {
        // if (this.findNode(id)) return;
        // value = (value === undefined ? id : value);
        const key = id;
        // eslint-disable-next-line max-len
        this.objects.push({ id, value, visitedCount, selectedCount, key});
    }
}
export default ListTracer