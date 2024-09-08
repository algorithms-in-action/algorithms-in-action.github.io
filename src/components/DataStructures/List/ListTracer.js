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
        this.labels = []
        for (let index in values) {
            this.addNode(index, values[index]);
        }
    }

    layout() {}

    addNode(id, value = undefined,
            isVisited = false, isSelected = false) {
        // if (this.findNode(id)) return;
        // eslint-disable-next-line max-len
        this.objects.push({ id, value, isVisited, isSelected, key: id});
    }

    swapElements(i, j) {
        const temp1 = this.objects[i];
        const temp2 = this.objects[j];
        const tempKey1 = this.objects[i].key;
        const tempKey2 = this.objects[j].key;

        // Swapping the index of two elements.
        this.objects[i] = temp2;
        this.objects[j] = temp1;
        this.objects[j].key = tempKey2;
        this.objects[i].key = tempKey1;
    }

    addLabel(index, label) {
        console.log(this.labels);
        this.labels.push({index, label});
    }

    setLabel(label, newIndex = null, newLabel = null) {
        const matchedLabel = this.labels.find(match => match.label === label);

        if (newIndex && matchedLabel) {
            matchedLabel.index = newIndex;
        }
        if (newLabel && matchedLabel) {
            matchedLabel.label = newLabel;
        }

    }

    select(key, label) {
        this.objects[key].isSelected = true;
    }

    clearLabels() {
        this.labels = [];
    }
}
export default ListTracer