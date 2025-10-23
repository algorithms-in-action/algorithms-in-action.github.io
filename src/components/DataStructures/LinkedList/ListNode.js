// Basic unit to construct Linked list
// Can be used to construct a one way linked List

// Enhanced ListNode with better visibility control + fill variant for color
export default class ListNode {
  constructor(value, key) {
    this.value = value;
    this.key = key;
    this.nextKey = null;
    this.patched = 0;
    this.selected = 0;

    // Visibility controls
    this.hidden = false;     // Completely hidden
    this.faded = false;      // Visible but dimmed
    this.ghosted = false;    // Very faded (for recursive context)

    // Selection states
    this.selected1 = false;
    this.selected2 = false;
    this.selected3 = false;
    this.selected4 = false;
    this.selected5 = false;
    this.sorted = false;

    // Variable tags shown under the node
    this.variables = [];

    // Position in the pointer canvas (center-ish coord used by renderer)
    this.pos = { x: 0, y: 0 };

    // Recursive context tracking
    this.activeInRecursion = true;
    this.recursionLevel = 0;

    // === NEW: visual fill variant used by the renderer to choose capsule color ===
    // 'gray' | 'orange' | 'blue' | 'green' | 'red' | 'grayAlt'
    this.fillVariant = 'gray';
  }
}
