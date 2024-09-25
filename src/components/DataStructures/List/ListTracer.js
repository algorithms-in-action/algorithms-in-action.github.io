/* eslint-disable import/no-unresolved */
import Tracer from '../common/Tracer';
import ListRenderer from './ListRenderer/index';

class ListTracer extends Tracer {

    init() {
        super.init();
        console.log('init called');
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

        // Store multiple lists
        this.lists = [];
        // Initialize nextListIndex to manage unique indices for lists
        this.nextListIndex = 0;
        console.log('Initialized ListTracer with empty lists and nextListIndex set to 0');
    }

    // Set values for a specific list
    set(values = [], listIndex = 0) {
        console.log('set called with values:', values, 'listIndex:', listIndex);
        this.addList(listIndex);  // Ensure list exists
        this.lists[listIndex].objects = [];  // Clear the list objects
        for (let index in values) {
            this.addNode(index, values[index], listIndex);  // Add each node to the list
        }
        console.log('Set list at index', listIndex, 'to values:', values);
    }

    // Add a new list if it doesn't exist
    addList(listIndex) {
        console.log('addList called with listIndex:', listIndex);
        if (!this.lists[listIndex]) {
            this.lists[listIndex] = {
                objects: [],
                labels: [],
            };
            console.log('Added new list at index', listIndex);
        } else {
            console.log('List at index', listIndex, 'already exists');
        }
    }

    // Add a node to a specific list
    addNode(id, value = undefined, listIndex = 0, isVisited = false, isSelected = false) {
        console.log('addNode called with id:', id, 'value:', value, 'listIndex:', listIndex, 'isVisited:', isVisited, 'isSelected:', isSelected);
        this.addList(listIndex);  // Ensure list exists
        this.lists[listIndex].objects.push({ id, value, isVisited, isSelected, key: id });
        console.log('Added node to list', listIndex, ':', { id, value, isVisited, isSelected, key: id });
    }

    // Remove a node from a specific list
    removeNode(position, listIndex = 0) {
        console.log('removeNode called with position:', position, 'listIndex:', listIndex);
        if (this.lists[listIndex] && position >= 0 && position < this.lists[listIndex].objects.length) {
            console.log('Before removal, list objects:', this.lists[listIndex].objects);
            const removedNode = this.lists[listIndex].objects.splice(position, 1);
            console.log('Removed node:', removedNode);
            console.log('After removal, list objects:', this.lists[listIndex].objects);
        } else {
            console.warn('Invalid listIndex or position. Cannot remove node.');
        }
    }

    // Search for a node by value in a specific list
    searchNode(value, listIndex = 0) {
        console.log('searchNode called with value:', value, 'listIndex:', listIndex);

        if (!this.lists[listIndex]) {
            console.warn('List at index', listIndex, 'does not exist.');
            return null;
        }

        const foundNode = this.lists[listIndex].objects.find(node => node.value === value);

        if (foundNode) {
            console.log('Node found:', foundNode);
            return foundNode;
        } else {
            console.warn('Node with value', value, 'not found in list', listIndex);
            return null;
        }
    }


    // Swap elements in a specific list
    swapElements(i, j, listIndex = 0) {
        console.log('swapElements called with i:', i, 'j:', j, 'listIndex:', listIndex);
        if (this.lists[listIndex]) {
            console.log('Before swap, list objects:', this.lists[listIndex].objects);
            const temp1 = this.lists[listIndex].objects[i];
            const temp2 = this.lists[listIndex].objects[j];
            this.lists[listIndex].objects[i] = temp2;
            this.lists[listIndex].objects[j] = temp1;
            console.log('Swapped elements at indices', i, 'and', j);
            console.log('After swap, list objects:', this.lists[listIndex].objects);
        } else {
            console.warn('List at index', listIndex, 'does not exist. Cannot swap elements.');
        }
    }

    // Reverse a specific list
    reverse(listIndex = 0) {
        console.log('reverse called with listIndex:', listIndex);
        if (this.lists[listIndex]) {
            console.log('Before reverse, list objects:', this.lists[listIndex].objects);
            this.lists[listIndex].objects.reverse();
            console.log('After reverse, list objects:', this.lists[listIndex].objects);
        } else {
            console.warn('List at index', listIndex, 'does not exist. Cannot reverse.');
        }
    }

    // Add a label to a specific list
    addLabel(index, label, listIndex = 0) {
        console.log('addLabel called with index:', index, 'label:', label, 'listIndex:', listIndex);
        this.addList(listIndex);  // Ensure list exists
        this.lists[listIndex].labels.push({ index, label });
        console.log('Added label to list', listIndex, ':', { index, label });
    }

    // Set label in a specific list
    setLabel(label, newIndex = null, newLabel = null, listIndex = 0) {
        console.log('setLabel called with label:', label, 'newIndex:', newIndex, 'newLabel:', newLabel, 'listIndex:', listIndex);
        const matchedLabel = this.lists[listIndex]?.labels.find(match => match.label === label);

        if (matchedLabel) {
            console.log('Found matching label:', matchedLabel);
            if (newIndex !== null) {
                matchedLabel.index = newIndex;
                console.log('Updated index to:', newIndex);
            }
            if (newLabel !== null) {
                matchedLabel.label = newLabel;
                console.log('Updated label to:', newLabel);
            }
        } else {
            console.warn('Label', label, 'not found in list', listIndex);
        }
    }

    // Clear all nodes and labels from a specific list
    clear(listIndex = 0) {
        console.log('clear called with listIndex:', listIndex);
        if (this.lists[listIndex]) {
            this.lists[listIndex].objects = [];
            this.lists[listIndex].labels = [];
            console.log('Cleared objects and labels in list', listIndex);
        } else {
            console.warn('List at index', listIndex, 'does not exist. Cannot clear.');
        }
    }

    // Clear all lists
    clearAll() {
        console.log('clearAll called');
        this.lists = [];
        // Reset nextListIndex
        this.nextListIndex = 0;
        console.log('Cleared all lists and reset nextListIndex to 0');
    }

    // Select a node in a specific list
    select(id, listIndex = 0) {
        console.log('select called with id:', id, 'listIndex:', listIndex);
        const node = this.lists[listIndex]?.objects.find(obj => obj.id === id);
        if (node) {
            node.isSelected = true;
            console.log('Node selected:', node);
        } else {
            console.warn('Node with id', id, 'not found in list', listIndex);
        }
    }

    // Clear all labels across all lists
    clearLabels(listIndex = 0) {
        console.log('clearLabels called with listIndex:', listIndex);
        if (this.lists[listIndex]) {
            this.lists[listIndex].labels = [];
            console.log('Cleared labels in list', listIndex);
        } else {
            console.warn('List at index', listIndex, 'does not exist. Cannot clear labels.');
        }
    }
}

export default ListTracer;