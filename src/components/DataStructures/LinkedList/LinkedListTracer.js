/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-mixed-operators */
/* eslint-disable arrow-parens */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
// eslint-disable-next-line import/no-unresolved
import Tracer from "../common/Tracer"; // Assume we have a renderer for linked lists
import LinkedListRenderer from './LinkedListRenderer';

class LinkedListTracer extends Tracer{


class LinkedListTracer extends Tracer {
    getRendererClass() {
        return LinkedListRenderer;
    }

    init() {
        this.key = 0;
        this.nodeKey = 0;
        this.chartTracer = null;
        this.lists = [];
    }

    // Sets multiple linked lists
    addList(listData = [], format = "values", listIndex = -1, layerIndex = 0) {
        const index = listIndex >= 0 ? listIndex : this.lists.length;
        if (!this.lists) {
            this.lists();
        }

        // Generating a list
        const list = {key: this.key++, listIndex:index, data: [],
            layerIndex: layerIndex, size: 0, unitShift: 0};
            for (let node of listData) {
                if (format === "values") {
                    this.appendToList(this.createNode(node), list);
                }
                else if (format === "nodes") {
                    this.appendToList(node, list);
                }
        }
        if (this.findList(listIndex,layerIndex)) {
            this.moveList(listIndex,layerIndex,listIndex+1,'insert');
        }
        this.lists.push(list);
    }

    createNode(value) {
        const newNode = {key: this.nodeKey++, value, next: null, patched: false, selected: false, variables: [], arrow: 0 };
        return newNode;
    }

    // Appends a value to a specific linked list
    appendToList(newNode, list) {
        list.data.push(newNode);
        list.size++;
    }

    // TO DO Appends a value to a specific list by index
    addToList(value, listIndex = 0) {
        // TO DO
    }

    // TO DO Removes a node at a specific index from a specific list
    removeAt(index, listIndex = 0) {
        // REWRITE
        const list = this.lists[listIndex];
        if (list && nodeIndex >= 0 && nodeIndex < list.length) {
            list[nodeIndex].sorted = true;
        }
    }

    select(listIndex, startIndex, endIndex = startIndex) {
        const list = this.lists[listIndex];
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < list.length) {
                list[i].selected++;
            }
        }
    }

    deselect(listIndex, startIndex, endIndex = startIndex) {
        const list = this.lists[listIndex];
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < list.length) {
                list[i].selected = false;
            }
        }
    }

    // set angle based on degree of rotation.
    setArrow(nodeIndex, listIndex, layerIndex, direction) {
        console.assert(Math.abs(direction)===45, "Invalid arrow Direction");

        const node = this.findList(listIndex,  layerIndex).data[nodeIndex];
        node.arrow = direction;

    }

    // Swaps two nodes by index within a specific list
    swapNodes(index1, index2, listIndex = 0, layerIndex = 0) {
        const list = this.findList(listIndex,  layerIndex);
        if (list && index1 >= 0 && index1 < list.size && index2 >= 0 && index2 < list.size) {
            const temp = list.data[index1].value;
            list.data[index1].value = list.data[index2].value;
            list.data[index2].value = temp;
            this.syncChartTracer();
        }
    }

    splitList(nodeIndex, listIndex=0 , layerIndex = 0) {
        const {key, data} = this.findList(listIndex,  layerIndex);
        if (key<0) return;

        const left = data.slice(0,nodeIndex);
        const right = data.slice(nodeIndex);


        // Old list
        this.deleteList(key);

        this.addList(left,"nodes", listIndex, layerIndex);
        this.addList(right, "nodes", listIndex + 1, layerIndex);
    }

    deleteList(key) {
        this.lists = this.lists.filter(list => list.key !== key);
    }

    findList(listIndex, layerIndex) {
        return this.lists.find(list => list.listIndex === listIndex && list.layerIndex === layerIndex);
    }

    // Visual shift right, no change to index
    shiftRight(shiftUnits, listIndex, layerIndex) {
        const listItem = this.findList(listIndex,  layerIndex);
        listItem.unitShift = listItem.unitShift + 1;
    }

    // moving index location
    moveList(oldIndex,oldLayer,newIndex, method) {
        let List = this.findList(oldIndex,oldLayer);
        if (this.findList(newIndex, 0)) {
            // if stack, place at last open layer.
            if (method==='stack') {
                console.log('stacking');
                let i = 0;
                while (this.findList(newIndex, i)) {
                    i++;
                }
                List.layerIndex = i;
                List.listIndex = newIndex;

                // Stacking may result in empty indices
                this.updateIndices();
            }

            // if insert, shift all to right.
            else if (method==='insert') {
                console.log('inserting');
                this.moveList(newIndex,0,newIndex+1, 'insert');
                List.layerIndex = 0;
                List.listIndex = newIndex;
            }
        }
        // directly move
        else {
            List.layerIndex = 0;
            List.listIndex = newIndex;
        }
    }

    // Theoretically unproblematic code::

    // Shifting indices to account for empty indices
    updateIndices() {
        const maxIndex = this.getMaxIndex();
        let emptyIndex;
        for (let i = 0; i <= maxIndex; i++) {
            if(!this.findList(i,0)) {
                emptyIndex = i;
                break;
            }
        }
        for (let list of this.lists) {
            if (list.listIndex > emptyIndex) {
                list.listIndex = list.listIndex - 1;
            }
        }
    }

    getMaxIndex() {
        let maxIndex = 0;

        for (let i = 0; i < this.lists.length; i++) {
            if (this.lists[i].listIndex > maxIndex) {
                maxIndex = this.lists[i].listIndex;
            }
        }
        return maxIndex;
    }

    getMaxSize() {
        let maxSize = 0;

        for (let i = 0; i < this.lists.length; i++) {
            if (this.lists[i].size > maxSize) {
                maxSize = this.lists[i].size;
            }
        }
        return maxSize;
    }
    // Patches/highlights a node at a specific index in a specific list
    patch(nodeIndex, listIndex = 0, layerIndex = 0) {
        const list = this.findList(listIndex,  layerIndex);
        if (list && nodeIndex >= 0 && nodeIndex < list.size) {
            list.data[nodeIndex].patched = true;
            list.data[nodeIndex].selected = false;
        }
    }

    // Removes patch/highlight from a node
    depatch(index, listIndex = 0, layerIndex) {
        const list = this.findList(listIndex,  layerIndex);
        if (list && index >= 0 && index < list.size) {
            list.data[index].patched = false;
        }
    }

    // Selects a node or a range of nodes in a specific list
    select(startIndex, endIndex = startIndex, listIndex = 0, layerIndex = 0) {
        const list = this.findList(listIndex,  layerIndex);
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < list.length) {
                list[i].faded = true;
            }
        }
    }

    // Deselects a node or a range of nodes in a specific list
    deselect(startIndex, endIndex = startIndex, listIndex = 0, layerIndex=0) {
        const list = this.findList(listIndex,  layerIndex);
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < list.length) {
                list[i].faded = false;
            }
        }
    }


    // Adds a variable to a specific node in a specific list
    addVariable(variable, nodeIndex, listIndex = 0, layerIndex = 0) {
        const list = this.findList(listIndex,  layerIndex);
        if (list && nodeIndex >= 0 && nodeIndex < list.size) {
            list.data[nodeIndex].variables.push(variable);
            this.syncChartTracer();
        }
    }

    syncChartTracer() {
        if (this.chartTracer) {
            this.chartTracer.data = this.lists.map(list => list);
        }
    }

    swap(listIndex, nodeIndex1, nodeIndex2) {
        const list = this.lists[listIndex];
        if (nodeIndex1 < 0 || nodeIndex1 >= list.length || nodeIndex2 < 0 || nodeIndex2 >= list.length) {
            return;
        }

        const tempValue = list[nodeIndex1].value;
        list[nodeIndex1].value = list[nodeIndex2].value;
        list[nodeIndex2].value = tempValue;

        this.syncChartTracer();
    }

    reverse(listIndex) {
        let prev = null;
        let current = this.lists[listIndex][0];
        while (current) {
            let next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        this.lists[listIndex][0] = prev;
        this.syncChartTracer();
    }

    // Assigns a variable to a specific node in a specific list, removing it from all others
    assignVariable(variable, nodeIndex, listIndex = 0) {
        this.removeVariable(variable);
        this.addVariable(variable, nodeIndex, listIndex);

    }

    split(listIndex, nodeIndex) {
        const list = this.lists[listIndex];
        if (nodeIndex < 0 || nodeIndex >= list.length) {
            return;
        }

        const newList = list.splice(nodeIndex + 1);
        list[nodeIndex].next = null;
        this.lists.push(newList);
        this.syncChartTracer();
    }

    clear(listIndex) {
        this.lists[listIndex] = [];
        this.syncChartTracer();
    }

    setList(array) {
        if (array) {
            this.lists = array.map(listData =>
                listData.map(value => new Element(value))
            );
        } else {
            this.lists = [];
        }
    }

    getKth() {
        return this.kth; // Ensure `this.kth` is defined somewhere if you want to track this
    }

    showKth(k = '0') {
        this.kth = k; // Define `this.kth` in your class constructor if you need it
    }
}

export default LinkedListTracer;

