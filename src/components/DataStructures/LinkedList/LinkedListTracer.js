/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import { cloneDeepWith } from 'lodash';
import LinkedListRenderer from './LinkedListRenderer'; // Assume we have a renderer for linked lists

class LinkedListTracer {
    constructor() {
        this.lists = []; // Array of linked lists
        this.chartTracer = null;
    }

    getRendererClass() {
        return LinkedListRenderer;
    }

    init() {
        this.chartTracer = null;
        this.lists = [];
    }

    // Sets multiple linked lists
    set(listsData = []) {
        this.init();
        listsData.forEach((listData) => {
            const list = { head: null, tail: null, size: 0, data: [] };
            listData.forEach((value) => this.appendToList(value, list));
            this.lists.push(list);
        });
        this.syncChartTracer();
    }

    // Appends a value to a specific linked list
    appendToList(value, list) {
        const newNode = { value, next: null, variables: [] };
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
    swapNodes(index1, index2, listIndex = 0) {
        const list = this.lists[listIndex];
        if (list && index1 >= 0 && index1 < list.size && index2 >= 0 && index2 < list.size) {
            const temp = list.data[index1].value;
            list.data[index1].value = list.data[index2].value;
            list.data[index2].value = temp;
            this.syncChartTracer();
        }
    }

    // Patches/highlights a node at a specific index in a specific list
    patch(index, value, listIndex = 0) {
        const list = this.lists[listIndex];
        if (list && index >= 0 && index < list.size) {
            list.data[index].value = value;
        }
    }

    // Removes patch/highlight from a node
    depatch(index, listIndex = 0) {
        const list = this.lists[listIndex];
        if (list && index >= 0 && index < list.size) {
            list.data[index].value = list.data[index].originalValue;
        }
    }

    // Selects a node or a range of nodes in a specific list
    select(startIndex, endIndex = startIndex, listIndex = 0) {
        const list = this.lists[listIndex];
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < list.size) {
                list.data[i].selected = true;
            }
        }
    }

    // Deselects a node or a range of nodes in a specific list
    deselect(startIndex, endIndex = startIndex, listIndex = 0) {
        const list = this.lists[listIndex];
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < list.size) {
                list.data[i].selected = false;
            }
        }
    }

    // Adds a variable to a specific node in a specific list
    addVariable(variable, nodeIndex, listIndex = 0) {
        const list = this.lists[listIndex];
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
        this.clearVariables();
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
}

export default LinkedListTracer;




// old code supporting only one list

// /* eslint-disable class-methods-use-this */
// /* eslint-disable consistent-return */
// /* eslint-disable no-plusplus */
// /* eslint-disable max-len */
// import { cloneDeepWith } from 'lodash';
// import LinkedListRenderer from './LinkedListRenderer'; // Assume we have a renderer for linked lists

// class LinkedListTracer {
//     constructor() {
//         this.head = null;
//         this.tail = null;
//         this.size = 0;
//         this.data = [];
//         this.chartTracer = null;
//     }

//     getRendererClass() {
//         return LinkedListRenderer;
//     }

//     init() {
//         this.chartTracer = null;
//         this.data = [];
//         this.head = null;
//         this.tail = null;
//         this.size = 0;
//     }

//     // Sets the linked list data structure
//     set(linkedList = [], algo) {
//         this.init();
//         linkedList.forEach((value) => this.append(value));
//         this.syncChartTracer();
//     }

//     // Appends a value to the linked list
//     append(value) {
//         const newNode = { value, next: null, variables: [] };
//         if (!this.head) {
//             this.head = newNode;
//             this.tail = newNode;
//         } else {
//             this.tail.next = newNode;
//             this.tail = newNode;
//         }
//         this.data.push(newNode);
//         this.size++;
//     }

//     // Prepends a value to the linked list
//     prepend(value) {
//         const newNode = { value, next: this.head, variables: [] };
//         this.head = newNode;
//         if (!this.tail) {
//             this.tail = newNode;
//         }
//         this.data.unshift(newNode);
//         this.size++;
//     }

//     // Removes a node at a specific index
//     removeAt(index) {
//         if (index < 0 || index >= this.size) return;
//         let current = this.head;
//         if (index === 0) {
//             this.head = current.next;
//             this.data.shift();
//         } else {
//             let previous = null;
//             for (let i = 0; i < index; i++) {
//                 previous = current;
//                 current = current.next;
//             }
//             previous.next = current.next;
//             if (index === this.size - 1) {
//                 this.tail = previous;
//             }
//             this.data.splice(index, 1);
//         }
//         this.size--;
//     }

//     // Patches/highlights a node
//     patch(index, value) {
//         if (index >= 0 && index < this.size) {
//             this.data[index].value = value;
//         }
//     }

//     // Removes patch/highlight
//     depatch(index) {
//         if (index >= 0 && index < this.size) {
//             this.data[index].value = this.data[index].originalValue;
//         }
//     }

//     // Selects a node or a range of nodes
//     select(startIndex, endIndex = startIndex) {
//         for (let i = startIndex; i <= endIndex; i++) {
//             if (i >= 0 && i < this.size) {
//                 this.data[i].selected = true;
//             }
//         }
//     }

//     // Deselects a node or a range of nodes
//     deselect(startIndex, endIndex = startIndex) {
//         for (let i = startIndex; i <= endIndex; i++) {
//             if (i >= 0 && i < this.size) {
//                 this.data[i].selected = false;
//             }
//         }
//     }

//     // Swaps two nodes by index
//     swapNodes(index1, index2) {
//         if (index1 >= 0 && index1 < this.size && index2 >= 0 && index2 < this.size) {
//             const temp = this.data[index1].value;
//             this.data[index1].value = this.data[index2].value;
//             this.data[index2].value = temp;
//         }
//     }

//     // Adds a variable to a specific node
//     addVariable(variable, index) {
//         if (index >= 0 && index < this.size) {
//             this.data[index].variables.push(variable);
//         }
//     }

//     // Removes a variable from all nodes
//     removeVariable(variable) {
//         this.data.forEach((node) => {
//             node.variables = node.variables.filter((val) => val !== variable);
//         });
//     }

//     // Clears all variables from the linked list
//     clearVariables() {
//         this.data.forEach((node) => {
//             node.variables = [];
//         });
//     }

//     // Assigns a variable to a specific node, removing it from all others
//     assignVariable(variable, index) {
//         this.clearVariables();
//         if (index >= 0 && index < this.size) {
//             this.addVariable(variable, index);
//         }
//     }

//     // Synchronizes the chart tracer
//     syncChartTracer() {
//         if (this.chartTracer) this.chartTracer.data = this.data;
//     }

//     // Returns a string representation of the linked list
//     stringTheContent() {
//         return this.data.map((node) => node.value).join(' -> ');
//     }
// }

// export default LinkedListTracer;
