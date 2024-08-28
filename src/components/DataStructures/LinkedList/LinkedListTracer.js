/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import { cloneDeepWith } from 'lodash';
import LinkedListRenderer from './LinkedListRenderer'; // Assume we have a renderer for linked lists

class LinkedListTracer {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.data = [];
        this.chartTracer = null;
    }

    getRendererClass() {
        return LinkedListRenderer;
    }

    init() {
        this.chartTracer = null;
        this.data = [];
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // Sets the linked list data structure
    set(linkedList = [], algo) {
        this.init();
        linkedList.forEach((value) => this.append(value));
        this.syncChartTracer();
    }

    // Appends a value to the linked list
    append(value) {
        const newNode = { value, next: null, variables: [] };
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.data.push(newNode);
        this.size++;
    }

    // Prepends a value to the linked list
    prepend(value) {
        const newNode = { value, next: this.head, variables: [] };
        this.head = newNode;
        if (!this.tail) {
            this.tail = newNode;
        }
        this.data.unshift(newNode);
        this.size++;
    }

    // Removes a node at a specific index
    removeAt(index) {
        if (index < 0 || index >= this.size) return;
        let current = this.head;
        if (index === 0) {
            this.head = current.next;
            this.data.shift();
        } else {
            let previous = null;
            for (let i = 0; i < index; i++) {
                previous = current;
                current = current.next;
            }
            previous.next = current.next;
            if (index === this.size - 1) {
                this.tail = previous;
            }
            this.data.splice(index, 1);
        }
        this.size--;
    }

    // Patches/highlights a node
    patch(index, value) {
        if (index >= 0 && index < this.size) {
            this.data[index].value = value;
        }
    }

    // Removes patch/highlight
    depatch(index) {
        if (index >= 0 && index < this.size) {
            this.data[index].value = this.data[index].originalValue;
        }
    }

    // Selects a node or a range of nodes
    select(startIndex, endIndex = startIndex) {
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < this.size) {
                this.data[i].selected = true;
            }
        }
    }

    // Deselects a node or a range of nodes
    deselect(startIndex, endIndex = startIndex) {
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < this.size) {
                this.data[i].selected = false;
            }
        }
    }

    // Swaps two nodes by index
    swapNodes(index1, index2) {
        if (index1 >= 0 && index1 < this.size && index2 >= 0 && index2 < this.size) {
            const temp = this.data[index1].value;
            this.data[index1].value = this.data[index2].value;
            this.data[index2].value = temp;
        }
    }

    // Adds a variable to a specific node
    addVariable(variable, index) {
        if (index >= 0 && index < this.size) {
            this.data[index].variables.push(variable);
        }
    }

    // Removes a variable from all nodes
    removeVariable(variable) {
        this.data.forEach((node) => {
            node.variables = node.variables.filter((val) => val !== variable);
        });
    }

    // Clears all variables from the linked list
    clearVariables() {
        this.data.forEach((node) => {
            node.variables = [];
        });
    }

    // Assigns a variable to a specific node, removing it from all others
    assignVariable(variable, index) {
        this.clearVariables();
        if (index >= 0 && index < this.size) {
            this.addVariable(variable, index);
        }
    }

    // Synchronizes the chart tracer
    syncChartTracer() {
        if (this.chartTracer) this.chartTracer.data = this.data;
    }

    // Returns a string representation of the linked list
    stringTheContent() {
        return this.data.map((node) => node.value).join(' -> ');
    }
}

export default LinkedListTracer;
