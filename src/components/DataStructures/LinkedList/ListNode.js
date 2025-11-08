// Basic ListNode class used by pointer-only LinkedListTracer

export default class ListNode {
  constructor(value, key) {
    this.value = value;
    this.key = key;

    // Pointers
    this.nextKey = null;

    // Variable tags shown under the node
    this.variables = [];

    // Position used by renderer
    this.pos = { x: 0, y: 0 };

    // Visibility
    this.hidden = false;

    // Rendering color variant
    this.fillVariant = 'gray';
  }
}
