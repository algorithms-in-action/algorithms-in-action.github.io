import {
  hash1,
  setIncrement,
  HASH_GRAPH,
  Colors,
  INDEX,
  POINTER,
  POINTER_VALUE,
  SMALL_SIZE,
  VALUE,
  DELETE_CHAR,
  HASH_TYPE,
  newCycle
} from './HashingCommon';

// Bookmarks to link chunker with pseudocode
const IBookmarks = {
  ApplyHash: 16,
  ChooseIncrement: 17,
  InitDelete: 11,
  WhileNot: 12,
  MoveThrough: 13,
  Found: 14,
  Delete: 15,
  NotFound: 18,
}

/**
 * Running function for chunker of delete, using the key provided
 * @param {*} chunker the chunker for deletion
 * @param {*} params parameters for deletion algorithm, e.g. name, key, insertion visualizer instances,...
 * @returns whether the key is found or not
 */
export default function HashingDelete(
  chunker, params, key, table, total
) {

  // Assigning parameter values to local variables
  const ALGORITHM_NAME = params.name;
  const SIZE = params.hashSize; // Hash Modulo being used in the table

  // Chunker for intial state of visualizers
  chunker.add(
    IBookmarks.InitDelete,
    (vis, target) => {

      vis.array.showKth({key: target, insertions: vis.array.getKth().insertions, type: HASH_TYPE.Delete}); // Show stats
      
      newCycle(vis, SIZE, key, ALGORITHM_NAME); // New delete cycle
    },
    [key]
  );

  // Hashing the key
  let i = hash1(chunker, IBookmarks.ApplyHash, key, SIZE, true); // Target value after being hashed

  // Calculate increment for key
  let increment = setIncrement(chunker, IBookmarks.ChooseIncrement, key, SIZE, params.name, HASH_TYPE.Delete, true);

  // Chunker for initial slot
  chunker.add(
    IBookmarks.WhileNot,
    (vis, idx) => {
      if (SIZE === SMALL_SIZE) {
        vis.array.assignVariable(POINTER_VALUE, POINTER, idx); // Pointer only shows for small tables
      }
      vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending); // Highlight initial search position

      // Uncoloring the graphs
      vis.graph.deselect(HASH_GRAPH.Key);
      vis.graph.deselect(HASH_GRAPH.Value);
      vis.graph.removeEdgeColor(HASH_GRAPH.Key, HASH_GRAPH.Value);
      if (ALGORITHM_NAME == "HashingDH") {
        vis.graph.deselect(HASH_GRAPH.Key2);
        vis.graph.deselect(HASH_GRAPH.Value2);
        vis.graph.removeEdgeColor(HASH_GRAPH.Key2, HASH_GRAPH.Value2);
      }
    },
    [i]
  );

  // Search for the target key, checking each probed position
  while (table[i] !== key && table[i] !== undefined) {

    // Chunker for not matching
    chunker.add(
      IBookmarks.WhileNot,
      (vis, idx) => {
        vis.array.fill(INDEX, idx, undefined, undefined, Colors.NotFound); // Fill the slot with red if the slot does not match key
      },
      [i]
    );

    // Move to the next index based on collision handling
    i = (i + increment) % SIZE;

    // Chunker for probing
    chunker.add(
      IBookmarks.MoveThrough,
      (vis, idx) => {
        if (SIZE === SMALL_SIZE) {
          vis.array.assignVariable(POINTER_VALUE, POINTER, idx); // Pointer is only shown for small tables
        }
      },
      [i]
    );

    // Chunker for searching the slots based on increment
    chunker.add(
      IBookmarks.WhileNot,
      (vis, idx) => {
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending); // Fill pending slots with yellow
      },
      [i]
    );
  }

  // Chunker for found
  if (table[i] === key) {
    chunker.add(
      IBookmarks.Found,
      (vis, idx) => {
        vis.array.fill(INDEX, idx, undefined, undefined, Colors.Found); // Fill the slot with green, indicating that the key is found
      },
      [i]
    );
    // Replace found element with x
      table[i] = DELETE_CHAR;
      chunker.add(
        IBookmarks.Delete,
        (vis, val, idx) => {
          vis.array.updateValueAt(VALUE, idx, val);
        },
        [DELETE_CHAR, i]
      )

      return total - 1; // Decrement total
  }
  else {
    chunker.add(
      IBookmarks.NotFound,
      (vis, idx) => {
        vis.array.fill(INDEX, idx, undefined, undefined, Colors.NotFound); // Fill the slot with green, indicating that the key is found
      },
      [i]
    )

    return total; // Since the deletion key is not found, nothing is deleted
  }
}