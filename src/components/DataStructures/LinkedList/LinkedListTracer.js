/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
// eslint-disable-next-line import/no-unresolved
import Tracer from "../common/Tracer"; // Assume we have a renderer for linked lists
import LinkedListRenderer from './LinkedListRenderer';

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
        const list = {
            key: this.key++, listIndex: index, data: [],
            layerIndex: layerIndex, size: 0, unitShift: 0
        };
        for (let node of listData) {
            if (format === "values") {
                this.appendToList(this.createNode(node), list);
            }
            else if (format === "nodes") {
                this.appendToList(node, list);
            }
        }
        if (this.findList(listIndex, layerIndex)) {
            this.moveList(listIndex, layerIndex, listIndex + 1, 'insert');
        }
        this.lists.push(list);
    }

    createNode(value) {
        const newNode = { key: this.nodeKey++, value, next: null, patched: false, selected: false, variables: [], arrow: 0 };
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

    // set angle based on degree of rotation.
    setArrow(nodeIndex, direction) {
        console.assert(Math.abs(direction)%45===0, "Invalid arrow Direction");

        const node = this.findNode(nodeIndex);
        node.arrow = direction;
    }

    // Swaps two nodes by index within a specific list
    swapNodes(index1, index2, listIndex = 0, layerIndex = 0) {
        const list = this.findList(listIndex, layerIndex);
        if (list && index1 >= 0 && index1 < list.size && index2 >= 0 && index2 < list.size) {
            const temp = list.data[index1].value;
            list.data[index1].value = list.data[index2].value;
            list.data[index2].value = temp;
            this.syncChartTracer();
        }
    }

    sortList(node1) {
        const {listIndex, layerIndex, key, data} = this.findListbyNode(node1);
        const sortedData = [...data].sort((a, b) => a.value - b.value);

        // Delete the original list
        this.deleteList(key);

        // Add the sorted list back to the same index and layer
        this.addList(sortedData, "nodes", listIndex, layerIndex);
    }

    resetArrows(node1) {
        const list = this.findListbyNode(node1);
        for (let node of list.data) {
            this.setArrow(node.key,0);
        }
    }
    mergeLists(node1, node2) {
        const listA = this.findListbyNode(node1);
        const listB = this.findListbyNode(node2);
        if (!listA || !listB) return;

        const { listIndex: listAIndex, layerIndex: layerAIndex, key: keyA, data: dataA } = listA;
        const { key: keyB, data: dataB } = listB;

        // Combine data from both lists
        const mergedData = [...dataA, ...dataB];

        // Delete both old lists
        this.deleteList(keyA);
        this.deleteList(keyB);

        // Add the new merged list
        this.addList(mergedData, "nodes", listAIndex, layerAIndex);
    }

    splitList(nodeKey) {
        const {listIndex, layerIndex, key, data} = this.findListbyNode(nodeKey);
        if (key < 0) return;

        let nodeIndex = data.findIndex(node => node.key === nodeKey);

        const left = data.slice(0, nodeIndex);
        const right = data.slice(nodeIndex);


        // Old list
        this.deleteList(key);
        this.addList(left, "nodes", listIndex, layerIndex);
        this.addList(right, "nodes", listIndex + 1, layerIndex);
    }

    deleteList(key) {
        this.lists = this.lists.filter(list => list.key !== key);
    }

    findList(listIndex, layerIndex) {
        return this.lists.find(list => list.listIndex === listIndex && list.layerIndex === layerIndex);
    }
    findListbyNode(key) {
        for (let list of this.lists) {
            for (let node of list.data) {
                if (node.key === key) {
                    return list;
                }
            }
        }
        return null;
    }

    findNode(key) {
        for (let list of this.lists) {
            for (let node of list.data) {
                if (node.key === key) {
                    return node;
                }
            }
        }
        return null;
    }

    // Visual shift right, no change to index
    shiftRight(shiftUnits, listIndex, layerIndex) {
        const listItem = this.findList(listIndex, layerIndex);
        listItem.unitShift = listItem.unitShift + 1;
    }

    // moving index location
    moveList(oldIndex, oldLayer, newIndex, method) {
        let List = this.findList(oldIndex, oldLayer);
        if (this.findList(newIndex, 0)) {
            // if stack, place at last open layer.
            if (method === 'stack') {
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
            else if (method === 'insert') {
                this.moveList(newIndex, 0, newIndex + 1, 'insert');
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
            if (!this.findList(i, 0)) {
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
    patch(startIndex, endIndex = startIndex) {
        console.log(startIndex);
        const list = this.findListbyNode(startIndex);

        for (let node of list.data) {
            if (node.key-startIndex >= 0 && endIndex-node.key >= 0) {
                node.patched = true;
            }
        }
    }

    // Removes patch/highlight from a node (NEEDS UPDATE)
    depatch(index, listIndex = 0, layerIndex) {
        const list = this.findList(listIndex, layerIndex);
        if (list && index >= 0 && index < list.size) {
            list.data[index].patched = false;
        }
    }

    // Selects a node or a range of nodes in a specific list
    select(startIndex, endIndex = startIndex) {
        const list = this.findListbyNode(startIndex);

        for (let node of list.data) {
            if (node.key-startIndex >= 0 && endIndex-node.key >= 0) {
                node.selected = true;
            }
        }
    }

    // Deselects a node or a range of nodes in a specific list
    deselect(startIndex, endIndex = startIndex) {
        const list = this.findListbyNode(startIndex);

        for (let node of list.data) {
            if (node.key-startIndex >= 0 && endIndex-node.key >= 0) {
                node.selected = false;
            }
        }
    }

    // Clears all variables from all nodes in all lists
    clearSelect() {
        this.lists.forEach(list => {
            list.data.forEach((node) => {
                node.selected = false;
            });
        });
    }

    // Adds a variable to a specific node in a specific list
    addVariable(variable, nodeIndex, listIndex = 0, layerIndex = 0) {
        const list = this.findList(listIndex, layerIndex);
        for (let node of list.data) {
            if (node.key===nodeIndex) {
                node.variables.push(variable);
                this.syncChartTracer();
            }
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
    assignVariable(variable, nodeIndex) {
        const {listIndex, layerIndex} = this.findListbyNode(nodeIndex);
        this.removeVariable(variable);
        this.addVariable(variable, nodeIndex, listIndex, layerIndex);
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
}

export default LinkedListTracer;