/* eslint-disable import/no-unresolved */
import Tracer from '../common/Tracer';
import ListRenderer from './ListRenderer/index';


class ListTracer extends Tracer {
    getRendererClass() {
        return ListRenderer;
    }

    init() {
        super.init();
        this.dimensions = {
            baseWidth: 480,
            baseHeight: 480,
            padding: 32,
            defaultNodeRadius: 33,
            nodeRadius: 33,
            arrowGap: 4,
            nodeWeightGap: 4,
            edgeWeightGap: 4,
        };
        this.isDirected = true;
        this.isWeighted = false;
        this.callLayout = { method: this.layoutCircle, args: [] };
        this.text = null;
        this.logTracer = null;
        this.istc = false;
    }

    set(values = []) {
        for (let i = 0; i < values.length; i++) {
            const nodeValue = values[i] ? values[i] : i;
            this.addNode(i, nodeValue);
        }
        super.set();
    }


    addNode(id, value = undefined, shape = 'circle', color = 'blue', weight = null,
            x = 0, y = 0, visitedCount = 0, selectedCount = 0, visitedCount1 = 0,
            isPointer = 0, pointerText = '') {
        value = (value === undefined ? id : value);
        const key = id;
        // eslint-disable-next-line max-len
        this.nodes.push({
            id,
            value,
            shape,
            color,
            weight,
            x,
            y,
            visitedCount,
            selectedCount,
            key,
            visitedCount1,
            isPointer,
            pointerText
        });
        this.layout();
    }

    layout() {}
}
export default ListTracer