import {
  hash1,
  setIncrement,
  HASH_TABLE,
  EMPTY_CHAR,
  Colors
} from './HashingCommon.js';

const IBookmarks = {
  Init: 1,
  ApplyHash: 2,
  ChooseIncrement: 3,
  WhileNot: 4,
  Increment: 5,
  CheckValue: 6,
  Found: 7,
  NotFound: 8,
}

const TYPE = 'Search';

export default {
  initVisualisers({ visualisers }) {
    return {
      array: {
        instance: visualisers.array.instance,
        order: 0,
      },
      graph: {
        instance: visualisers.graph.instance,
        order: 1,
      },
    };
  },

  run(chunker, params) {
    const ALGORITHM_NAME = params.name;
    const TARGET = params.target; // Target value we are searching for
    const SIZE = params.hashSize; // Hash Modulo being used in the table
    let table = params.visualisers.array.instance.extractArray(1, EMPTY_CHAR); // The table with inserted values

    const INDEX = 0;
    const POINTER = 2;
    const POINTER_VALUE = "i";

    let found = true;

    // Clear previous stuff and set start value to target value
    // Currently has a bug where if you search for a different number, the previous one remains on the screen
    chunker.add(
      IBookmarks.Init,
      (vis, target) => {

        vis.array.showKth(["N/A", ""]);

        vis.graph.updateNode(HASH_TABLE.Key, target);
        vis.graph.updateNode(HASH_TABLE.Value, ' ');
        vis.graph.select(HASH_TABLE.Key);
        vis.graph.colorEdge(HASH_TABLE.Key, HASH_TABLE.Value, Colors.Pending)

        if (ALGORITHM_NAME === "HashingDH") {
          vis.graph.updateNode(HASH_TABLE.Key2, target);
          vis.graph.updateNode(HASH_TABLE.Value2, ' ');
          vis.graph.select(HASH_TABLE.Key2);
          vis.graph.colorEdge(HASH_TABLE.Key2, HASH_TABLE.Value2, Colors.Pending)
        }

        for (let i = 0; i < SIZE; i++) {
          vis.array.assignVariable("", POINTER, i, POINTER_VALUE);
          vis.array.unfill(INDEX, 0, undefined, SIZE - 1)
        }
      },
      [TARGET]
    );

    // Hashing the search value
    let i = hash1(chunker, IBookmarks.ApplyHash, TARGET, SIZE); // Target value after being hashed

    // Fix later, should have different line of Pseudocode
    let increment = setIncrement(chunker, IBookmarks.ChooseIncrement, TARGET, SIZE, params.name, TYPE);

    // Highlight initial search position
    chunker.add(
      IBookmarks.WhileNot,
      (vis, idx) => {
        vis.array.assignVariable(POINTER_VALUE, POINTER, idx);
        vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending);
        vis.graph.deselect(HASH_TABLE.Key);
        vis.graph.deselect(HASH_TABLE.Value);
        vis.graph.removeEdgeColor(HASH_TABLE.Key, HASH_TABLE.Value);
        if (ALGORITHM_NAME == "HashingDH") {
          vis.graph.deselect(HASH_TABLE.Key2);
          vis.graph.deselect(HASH_TABLE.Value2);
          vis.graph.removeEdgeColor(HASH_TABLE.Key2, HASH_TABLE.Value2);
        }
      },
      [i]
    );

    // Search for the target key, checking each probed position
    while (table[i] !== TARGET && table[i] !== undefined) {

      // Highlight the position with Red since not a match
      chunker.add(
        IBookmarks.WhileNot,
        (vis, idx) => {
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Collision);
        },
        [i]
      );

      // Move to the next index based on collision handling
      i = (i + increment) % SIZE;

      // Move number to next position based on Increment
      chunker.add(
        IBookmarks.Increment,
        (vis, idx) => {
          vis.array.assignVariable(POINTER_VALUE, POINTER, idx);
        },
        [i]
      );

      // Changes colour for pending search status
      chunker.add(
        IBookmarks.WhileNot,
        (vis, idx) => {
            vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending);
        },
        [i]
      );
    }
    // If target has been found in search
    if (table[i] === TARGET) {
      chunker.add(
        IBookmarks.Found,
        (vis, idx) => {
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Insert); // Indicate that the key is found
        },
        [i]
      );
    }

    // If target is not found in the list
    else {
      chunker.add(
        IBookmarks.NotFound,
        (vis, idx) => {
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Collision);
          found = false;
        },
        [i]
      );
    }
    return found;
  },
};
