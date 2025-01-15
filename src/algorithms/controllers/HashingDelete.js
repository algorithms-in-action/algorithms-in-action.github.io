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
  newCycle,
  EMPTY_CHAR,
  EMPTY_CHAR_CH
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
  Pending: 20,
  CheckFull: 21,
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
  const SIZE = table.length; // Hash Modulo being used in the table

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

  /** This part is for Linear Probing and Double Hashing */
  if (ALGORITHM_NAME !== 'HashingCH') {
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

    let explored = 0;
    // Search for the target key, checking each probed position
    while (table[i] !== key && table[i] !== undefined && explored < SIZE) {
      // Chunker for not matching
      explored += 1;
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

  /** This part is for Chaining */
  else {

/*
    chunker.add(
      IBookmarks.Pending,
      (vis, idx) => {
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending); // Fill pending slots with yellow
      },
      [i]
    );
*/

    if (table[i].includes(key)) {
      const index = table[i].indexOf(key);
      if (index > -1) table[i].splice(index, 1); // 2nd parameter means remove one item only

      chunker.add(
        IBookmarks.Found,
        (vis, idx, table) => {
          // Modify the floating array
          const popper = document.getElementById('float_box_' + idx);
          popper.innerHTML = table[idx];

          let chainLength = table[idx].length;
          // let firstItemOfChain = table[idx][0];
          // if (firstItemOfChain === undefined)
          if (chainLength === 0)
            vis.array.updateValueAt(VALUE, idx, EMPTY_CHAR_CH);
          else if (chainLength === 1)
            vis.array.updateValueAt(VALUE, idx, '[' + table[idx][0] + ']');
          else
            vis.array.updateValueAt(VALUE, idx, '[' + table[idx][0] + '..');

          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Found); // Fill the slot with green, indicating that the key is found
        },
        [i, table]
      );

      return total - 1; // Decrement total
    }
    else {
      chunker.add(
        // IBookmarks.NotFound, // delete code no longer expanded
        IBookmarks.Found,
        (vis, idx) => {
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.NotFound); // Fill the slot with green, indicating that the key is found
        },
        [i]
      )

      return total; // Since the deletion key is not found, nothing is deleted
    }
  }
}
