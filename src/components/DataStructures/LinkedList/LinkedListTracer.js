/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import { cloneDeepWith } from 'lodash';
// eslint-disable-next-line import/no-unresolved
import Tracer from "../common/Tracer"; // Assume we have a renderer for linked lists
import LinkedListRenderer from './LinkedListRenderer';

class LinkedListTracer extends Tracer{

    getRendererClass() {
        return LinkedListRenderer;
    }

    init() {
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
        const list = {listIndex:index, head: null, tail: null, data: [], layerIndex: layerIndex, size: 0, unitShift: 0};
            for (let value of listData) {
                if (format === "values") {
                    const newNode = this.createNode(value);
                    this.appendToList(newNode, list);
                }
                else if (format === "nodes") {
                    this.appendToList(value, list);
                }
        }
        if (this.findList(listIndex,layerIndex)) {
            this.moveList(listIndex,layerIndex,listIndex+1,'insert');
        }
        this.lists.push(list);
    }

    createNode(value) {
        const newNode = { value, next: null, patched: false, selected: false, variables: [] };
        return newNode;
    }

    // Appends a value to a specific linked list
    appendToList(newNode, list) {
        if (!list.head) {
            list.head = newNode;
            list.tail = newNode;
        } else {
            list.tail.next = newNode;
            list.tail = newNode;
        }
        list.data.push(newNode);
        list.size++;
    }

    // Appends a value to a specific list by index
    append(value, listIndex = 0) {
        if (listIndex >= 0 && listIndex < this.lists.length) {
            this.appendToList(value, this.lists[listIndex]);
            this.syncChartTracer();
        }
    }

    // Prepends a value to a specific list
    prepend(value, listIndex = 0) {
        if (listIndex >= 0 && listIndex < this.lists.length) {
            const list = this.lists[listIndex];
            const newNode = { value, next: list.head, variables: [] };
            list.head = newNode;
            if (!list.tail) {
                list.tail = newNode;
            }
            list.data.unshift(newNode);
            list.size++;
            this.syncChartTracer();
        }
    }

    // Removes a node at a specific index from a specific list
    removeAt(index, listIndex = 0) {
        const list = this.lists[listIndex];
        if (!list || index < 0 || index >= list.size) return;

        let current = list.head;
        if (index === 0) {
            list.head = current.next;
            list.data.shift();
        } else {
            let previous = null;
            for (let i = 0; i < index; i++) {
                previous = current;
                current = current.next;
            }
            previous.next = current.next;
            if (index === list.size - 1) {
                list.tail = previous;
            }
            list.data.splice(index, 1);
        }
        list.size--;
        this.syncChartTracer();
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

    // Patches/highlights a node at a specific index in a specific list
    patch(index, value, listIndex = 0, layerIndex = 0) {
        const list = this.findList(listIndex,  layerIndex);
        if (list && index >= 0 && index < list.size) {
            list.data[index].patched = true;
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
            if (i >= 0 && i < list.size) {
                list.data[i].selected = true;
            }
        }
    }

    // Deselects a node or a range of nodes in a specific list
    deselect(startIndex, endIndex = startIndex, listIndex = 0, layerIndex=0) {

        const list = this.findList(listIndex,  layerIndex);
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < list.size) {
                list.data[i].selected = false;
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

    // Removes a variable from all nodes in all lists
    removeVariable(variable) {
        this.lists.forEach(list => {
            list.data.forEach((node) => {
                node.variables = node.variables.filter((val) => val !== variable);
            });
        });
        this.syncChartTracer();
    }

    // Clears all variables from all nodes in all lists
    clearVariables() {
        this.lists.forEach(list => {
            list.data.forEach((node) => {
                node.variables = [];
            });
        });
        this.syncChartTracer();
    }

    // Assigns a variable to a specific node in a specific list, removing it from all others
    assignVariable(variable, nodeIndex, listIndex = 0) {
        this.removeVariable(variable);
        this.addVariable(variable, nodeIndex, listIndex);
    }

    // Synchronizes the chart tracer
    syncChartTracer() {
        if (this.chartTracer) {
            this.chartTracer.data = this.lists.map(list => list.data); // Sync all lists with the tracer
        }
    }

    // Returns a string representation of all linked lists
    stringTheContent() {
        return this.lists
            .map((list, index) => `List ${index + 1}: ${list.data.map((node) => node.value).join(' -> ')}`)
            .join('\n');
    }

    splitList(nodeIndex, listIndex=0 , layerIndex = 0) {
        const {data} = this.findList(listIndex,  layerIndex);
        const left = data.slice(0,nodeIndex);
        const right = data.slice(nodeIndex);
        // Old list
        this.deleteList(listIndex);

        this.addList(left,"nodes", listIndex, layerIndex);
        this.addList(right, "nodes", listIndex + 1, layerIndex);
    }

    deleteList(listIndex) {
        this.lists.splice(listIndex, 1);
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
                this.moveList(newIndex,0,newIndex+1, method = 'insert');
            }
        }
        // directly move
        else {
            List.layerIndex = 0;
            List.listIndex = newIndex;
        }
    }

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
}

export default LinkedListTracer;