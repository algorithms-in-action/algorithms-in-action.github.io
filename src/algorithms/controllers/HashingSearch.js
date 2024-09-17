import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import {
  hash1,
  setIncrement,
  HASH_TABLE,
  EMPTY_CHAR,
  Colors
} from './HashingCommon.js';

//TEMP
const IBookmarks = {
  Init: 1,
  ApplyHash: 2,
  CheckValue: 3,
  Increment: 4,
  Found: 5,
  NotFound: 6,
  WhileNot: 7,
}

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

    let target = params.target; // Target value we are searching for
    let hashValue = params.hashSize; // Hash Modulo being used in the table
    let hashed = target % hashValue; // Target value after being hashed
    let table = params.visualisers.array.instance.extractArray(1, EMPTY_CHAR); // The table with inserted values

    const INDEX = 0;
    const VALUE = 1;
    const VAR = 2;

    // Clear previous stuff and set start value to target value
    chunker.add(
      1,
      (vis, val) => {
        vis.array.unfill(INDEX, 0, undefined, hashValue - 1);
        vis.graph.updateNode(HASH_TABLE.Key, val);
        vis.graph.updateNode(HASH_TABLE.Value, ' ');

      },
      [target]
    );

    // Hashing the search value
    chunker.add(
        2,
        (vis, val) => {
            vis.graph.updateNode(1, val);
        },
        [hashed]
    );

    let i = hashed

    // Fix later, should have different line of Pseudocode
    let increment = setIncrement(chunker, IBookmarks.WhileNot, target, hashValue, params.name);

    // Highlight initial search position
    chunker.add(
      IBookmarks.WhileNot,
      (vis, key, idx) => {
        vis.array.assignVariable(key, VAR, idx);
        vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending);
      },
      [target, i]
    );

    // Search for the target key, checking each probed position
    while (table[i] !== target && table[i] !== undefined) {
      let prevI = i;

      // Highlight the position with Red since not a match
      chunker.add(
        IBookmarks.WhileNot,
        (vis, idx) => {
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Collision);
        },
        [prevI]
      );

      // Move to the next index based on collision handling
      i = (i + increment) % hashValue;

      // Move number to next position based on Increment
      chunker.add(
        IBookmarks.Increment,
        (vis, key, idx) => {
          vis.array.assignVariable(key, VAR, idx);
        },
        [target, i]
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
    if (table[i] === target) {
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
        //vis.graph.updateNode(HASH_TABLE.Key, 'Not Found'); // Just placebolder until something else
        },
        [i]
      );
    }

  },
};
