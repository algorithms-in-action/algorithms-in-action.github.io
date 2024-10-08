import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { HashingExp } from '../explanations';
import {
  hash1,
  setIncrement,
  HASH_GRAPH,
  EMPTY_CHAR,
  Colors,
  INDEX,
  POINTER,
  POINTER_VALUE,
  SMALL_SIZE,
  VALUE,
  LARGE_SIZE,
  SPLIT_SIZE,
  DELETE_CHAR,
  HASH_TYPE,
  FULL_SIGNAL,
  newCycle
} from './HashingCommon';
import { translateInput } from '../parameters/helpers/ParamHelper';
import HashingDelete from './HashingDelete';

// Bookmarks to link chunker with pseudocode
const IBookmarks = {
  Init: 1,
  EmptyArray: 2,
  InitInsertion: 3,
  // IncrementInsertions: 4,
  Hash1: 5,
  ChooseIncrement: 6,
  Probing: 7,
  Collision: 8,
  PutIn: 9,
  Done: 10,
  BulkInsert: 1,
  CheckTableFull: 19,
}

export default {
  explanation: HashingExp,

  // Initialize visualizers
  initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Hash Table'),
        order: 0,
      },
      graph: {
        instance: new GraphTracer('graph', null, 'Hashing Functions'),
        order: 1,
      },
    };
  },

  /**
   * Run function for insertion, using the user input to display the illustration through chunker
   * @param {*} chunker the chunker for the illustrations
   * @param {*} params different parameters of the algorithm insertion mode e.g. name, array size,...
   * @returns a table of concluding array to serve testing purposes
   */
  run(chunker, params) {

    // Storing algorithms parameters as local variables
    const ALGORITHM_NAME = params.name;
    let inputs = params.values;
    const SIZE = params.hashSize;

    // Initialize arrays
    let indexArr = Array.from({ length: SIZE }, (_, i) => i);
    let valueArr = Array(SIZE).fill(EMPTY_CHAR);
    let nullArr = Array(SIZE).fill('');

    // For return
    let table_result;

    // Variable to keep track of insertions done and total inputs hashed into the table
    let insertions = 0;
    let total = 0;

    /**
     * Insertion function for each key
     * @param {*} table the table to keep track of the internal and illustrated array
     * @param {*} key the key to insert
     * @param {*} prevIdx previous index of the previous key
     * @param {*} isBulkInsert whether it is bulk insert or not
     * @returns the index the key is assigned
     */
    function hashInsert(table, key, isBulkInsert) {
      // Chunker for when table is full
      if (total == SIZE - 1) {
        chunker.add(
          IBookmarks.CheckTableFull,
          (vis, total) => {
            vis.array.showKth({fullCheck: "Table is filled " + total + "/" + SIZE + " -> Table is full, stopping insertion..."});
          },
          [total]
        )
        return FULL_SIGNAL;
      }

      // Chunker for when the table is not full
      else {
        if (!isBulkInsert) { // Only show when the table is full in bulk insert mode
          chunker.add(
            IBookmarks.CheckTableFull,
            (vis, total) => {
              newCycle(vis, SIZE, key, ALGORITHM_NAME); // New insert cycle
              vis.array.showKth({fullCheck: "Table is filled " + total + "/" + SIZE + " -> Table is not full, continuing..."});
            },
            [total]
          )
        }
      }

      insertions = insertions + 1; // Increment insertions
      total = total + 1; // Increment total

      // if (!isBulkInsert) {
      // // Chunker step for increasing the insertion stat
      //   chunker.add(
      //     IBookmarks.IncrementInsertions,
      //     (vis, key, insertions) => {
      //       vis.array.showKth({key: key, type: HASH_TYPE.Insert, insertions: insertions, increment: ""}); // Change insertion stats visually
      //     },
      //     [key ,insertions]
      //   );
      // }

      // Get initial hash index for current key
      let i = hash1(chunker, IBookmarks.Hash1, key, SIZE, !isBulkInsert);

      // Calculate increment for current key
      let increment = setIncrement(
        chunker, IBookmarks.ChooseIncrement, key, SIZE, ALGORITHM_NAME, HASH_TYPE.Insert, !isBulkInsert
      );

      if (!isBulkInsert) {
        // Chunker for first pending slot
        chunker.add(
          IBookmarks.Probing,
          (vis, idx) => {

            // Pointer only appear for small table
            if (SIZE === SMALL_SIZE) {
              vis.array.assignVariable(POINTER_VALUE, POINTER, idx);
            }

            vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending); // Color pending slot

            // Uncolor the hashing graph
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
        )
      }

      // Internal code for probing, while loop indicates finding an empty slot for insertion
      while (table[i] !== undefined && table[i] !== key && table[i] !== DELETE_CHAR) {
        let prevI = i;
        i = (i + increment) % SIZE; // This is to ensure the index never goes over table size

        if (!isBulkInsert) {
          // Chunker for collision
          chunker.add(
            IBookmarks.Collision,
            (vis, idx) => {
              vis.array.fill(INDEX, idx, undefined, undefined, Colors.Collision); // Fill the slot with red, indicating collision
            },
            [prevI]
          )

          // Chunker for Probing
          chunker.add(
            IBookmarks.Probing,
            (vis, idx) => {

              // Pointer only appears for small tables
              if (SIZE === SMALL_SIZE) {
                vis.array.assignVariable(POINTER_VALUE, POINTER, idx);
              }
              vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending); // Filling the pending slot with yellow
            },
            [i]
          )
        }
      }

      // Internally assign the key to the index
      table[i] = key;

      // Chunker for placing the key
      chunker.add(
        IBookmarks.PutIn,
        (vis, val, idx, insertions) => {
          vis.array.updateValueAt(VALUE, idx, val); // Update value of that index
          if (isBulkInsert) {
            vis.array.showKth({key: vis.array.getKth().key, type: HASH_TYPE.BulkInsert, insertions: insertions});
          }
          if (!isBulkInsert) vis.array.fill(INDEX, idx, undefined, undefined, Colors.Insert); // Fill it green, indicating successful insertion
        },
        [key, i, insertions]
      )

      // Return the insertion index
      return i;
    }

    function hashBulkInsert(table, keys) {
      let lastHash;
      let inserts = {};
      for (const key of keys) {
        if (total == table.length - 1) {
          inserts[key] = FULL_SIGNAL;
          lastHash = FULL_SIGNAL;
          break;
        }

        insertions++;
        total++;

        // hashed value
        let i = hash1(null, null, key, table.length, false);

        // increment for probing
        let increment = setIncrement(
          null,
          null,
          key,
          table.length,
          ALGORITHM_NAME,
          HASH_TYPE.Insert,
          false
        );

        while (table[i] !== undefined) {
          i = (i + increment) % table.length; // This is to ensure the index never goes over table size
        }

        table[i] = key;
        inserts[key] = i;
        lastHash = i;
      }

      chunker.add(
        IBookmarks.PutIn,
        (vis, keys, inserts, insertions) => {
          for (const key of keys) {
            if (inserts[key] === FULL_SIGNAL) break;
            vis.array.updateValueAt(VALUE, inserts[key], key); // Update value of that index
            vis.array.fill(INDEX, inserts[key], undefined, undefined, Colors.Insert);
          }
          vis.array.showKth({key: vis.array.getKth().key, type: HASH_TYPE.BulkInsert, insertions: insertions});
        },
        [keys, inserts, insertions]
      )

      return lastHash;
    }

    // Init hash table
    let table = new Array(SIZE);
    chunker.add(
      IBookmarks.Init,
      (vis, array) => {
        // Increase Array2D visualizer render space
        if (SIZE >= LARGE_SIZE) {
          vis.array.setSize(3);
        }

        // Initialize the array
        vis.array.set(array,
          params.name,
          '',
          INDEX,
          {
            rowLength: SIZE === LARGE_SIZE ? SPLIT_SIZE : SMALL_SIZE,
            rowHeader: ['Index', 'Value', '']
          }
        );

        vis.array.hideArrayAtIndex([VALUE, POINTER]); // Hide value and pointer row intially

        vis.graph.weighted(true);

        // Intialize the graphs
        switch (ALGORITHM_NAME) {
          case "HashingLP" :
            vis.graph.set([[0, 'Hash'], [0, 0]], [' ', ' '], [[-5, 0], [5, 0]]);
            break;
          case "HashingDH" :
            vis.graph.set([
              [0, 'Hash1', 0, 0], [0, 0, 0, 0], [0, 0, 0, 'Hash2'], [0, 0, 0, 0]], // Node edges
              [' ', ' ', ' ', ' '], // Node values
              [[-13, 0], [-3, 0], [3, 0], [13, 0]]); // Node positions
            break;
        }
      },
      [SIZE === SMALL_SIZE ?
        [indexArr, valueArr, nullArr] :
        [indexArr, valueArr]
      ]
    );

    // Chunker to initialize empty array visually
    chunker.add(
      IBookmarks.EmptyArray,
      (vis) => {
        // Show the value row
        vis.array.hideArrayAtIndex(POINTER);
      },
    );

    // Chunker for intializing insertion stat
    chunker.add(
      IBookmarks.InitInsertion,
      (vis, insertions) => {
        vis.array.showKth({
          key: "",
          type: EMPTY_CHAR,
          insertions: insertions,
          increment: "",
        });
      },
      [insertions]
    )

    // Magic numbers for length of splitting a postive integer string by "-", the index of "", and the number to delete when a negative integer is split by "-"
    const POS_INTEGER_SPLIT_LENGTH = 1;
    const EMPTY_DELETE_SPLIT_INDEX = 0;
    const NUMBER_DELETE_SPLIT_INDEX = 1;

    // Inserting inputs
    let prevIdx;
    for (const item of inputs) {
      if (prevIdx == FULL_SIGNAL) break; // Stop insertion when the table is full

      // Different cases of insertion and deletion
      let split_arr = item.split("-");
      if (split_arr.length === POS_INTEGER_SPLIT_LENGTH) { // When the input is a positive integer -> normal insert
        prevIdx = hashInsert(table, parseInt(item), false);
      }
      else {
        if (split_arr[EMPTY_DELETE_SPLIT_INDEX] === "") { // When the input is a negative integer -> delete
          let key = Number(split_arr[NUMBER_DELETE_SPLIT_INDEX]);
          total = HashingDelete(chunker, params, key, table, total);
        }
        else { // When the input is a range -> bulk insert
          // Preparation for bulk insertion
          chunker.add(
            IBookmarks.BulkInsert,
            (vis, insertions, prevIdx) => {
              vis.array.unfill(INDEX, 0, undefined, SIZE - 1); // Reset any coloring of slots
              vis.array.showKth({key: item, type: HASH_TYPE.BulkInsert, insertions: insertions, increment: ""});
              if (SIZE === SMALL_SIZE) vis.array.assignVariable("", POINTER, prevIdx, POINTER_VALUE); // Hide pointer

              // Empty graphs
              vis.graph.updateNode(HASH_GRAPH.Key, ' ');
              vis.graph.updateNode(HASH_GRAPH.Value, ' ');
              if (ALGORITHM_NAME === "HashingDH") {
                vis.graph.updateNode(HASH_GRAPH.Key2, ' ');
                vis.graph.updateNode(HASH_GRAPH.Value2, ' ');
              }
            },
            [insertions, prevIdx]
          )
          prevIdx = hashBulkInsert(table, translateInput(item, "Array"));
        }
      }
    }

    // Chunker for resetting visualizers in case of new insertion cycle
    chunker.add(
      IBookmarks.Done,
      (vis) => {

        vis.array.showKth({key: "", type: EMPTY_CHAR, insertions: insertions, increment: ""}) // Nullify some stats, for better UI

        // Hide pointer
        if (SIZE === SMALL_SIZE) {
          vis.array.assignVariable(POINTER_VALUE, POINTER, undefined);
        }

        vis.array.unfill(INDEX, 0, undefined, SIZE - 1); // Unfill all boxes

        // Reset graphs and uncolor the graph if needed
        vis.graph.updateNode(HASH_GRAPH.Key, ' ');
        vis.graph.updateNode(HASH_GRAPH.Value, ' ');
        if (ALGORITHM_NAME === 'HashingDH') {
          vis.graph.updateNode(HASH_GRAPH.Key2, ' ');
          vis.graph.updateNode(HASH_GRAPH.Value2, ' ');
        }

        // Extract resulting array for testing
        table_result = vis.array.extractArray([1], EMPTY_CHAR)
      },
    )

    return table_result; // Return resulting array for testing
  },
};
