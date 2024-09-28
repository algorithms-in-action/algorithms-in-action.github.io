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
  SPLIT_SIZE
} from './HashingCommon';
import { returnInputFromRange } from '../parameters/helpers/ParamHelper.js';

// Bookmarks to link chunker with pseudocode
const IBookmarks = {
  Init: 1,
  EmptyArray: 2,
  InitInsertion: 3,
  IncrementInsertions: 4,
  Hash1: 5,
  ChooseIncrement: 6,
  Probing: 7,
  Collision: 8,
  PutIn: 9,
  Done: 10,
  BulkInsert: 1,
}

// Type to use functions in HashingCommon
const TYPE = 'Insert';

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

    // Variable to keep track of insertions done
    let insertions = 0;

    /**
     * Insertion function for each key
     * @param {*} table the table to keep track of the internal and illustrated array
     * @param {*} key the key to insert
     * @param {*} prevIdx previous index of the previous key
     * @param {*} isBulkInsert whether it is bulk insert or not
     * @returns the index the key is assigned
     */
    function hashInsert(table, key, prevIdx, isBulkInsert) {
      insertions = insertions + 1; // increment insertions

      if (!isBulkInsert) {
      // Chunker step for increasing the insertion stat
        chunker.add(
          IBookmarks.IncrementInsertions,
          (vis, key, insertions, prevIdx) => {
            vis.array.showKth({key: key, insertions: insertions, increment: ""}); // Change insertion stats visually
            vis.array.unfill(INDEX, 0, undefined, SIZE - 1); // Reset any coloring of slots

            // Hide pointer
            if (SIZE === SMALL_SIZE) {
              vis.array.assignVariable("", POINTER, prevIdx, POINTER_VALUE);
            }

            // Update key value for the hashing graph and color them to emphasize hashing initialization
            vis.graph.updateNode(HASH_GRAPH.Key, key);
            vis.graph.updateNode(HASH_GRAPH.Value, ' ');
            vis.graph.select(HASH_GRAPH.Key);
            vis.graph.colorEdge(HASH_GRAPH.Key, HASH_GRAPH.Value, Colors.Pending)
            if (ALGORITHM_NAME === "HashingDH") {
              vis.graph.updateNode(HASH_GRAPH.Key2, key);
              vis.graph.updateNode(HASH_GRAPH.Value2, ' ');
              vis.graph.select(HASH_GRAPH.Key2);
              vis.graph.colorEdge(HASH_GRAPH.Key2, HASH_GRAPH.Value2, Colors.Pending)
            }
          },
          [key ,insertions, prevIdx]
        );
      }

      // Get initial hash index for current key
      let i = hash1(chunker, IBookmarks.Hash1, key, SIZE, !isBulkInsert);

      // Calculate increment for current key
      let increment = setIncrement(
        chunker, IBookmarks.ChooseIncrement, key, SIZE, ALGORITHM_NAME, TYPE, !isBulkInsert
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
      while (table[i] !== undefined && table[i] !== key) {
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
            vis.array.showKth({key: "Bulk Inserting...", insertions: insertions, increment: ""});
          }
          if (!isBulkInsert) vis.array.fill(INDEX, idx, undefined, undefined, Colors.Insert); // Fill it green, indicating successful insertion
        },
        [key, i, insertions]
      )

      // Return the insertion index
      return i;
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
              [[-5, 2], [5, 2], [-5, -2], [5, -2]]); // Node positions
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
          insertions: insertions,
          increment: "",
        });
      },
      [insertions]
    )

    // Inserting inputs
    let prevIdx;
    for (const item of inputs) {
      if (item.split('-').length == 1) {
        for (const key of returnInputFromRange(item)) {
          prevIdx = hashInsert(table, key, prevIdx, false);
        }
      }
      else {
        // Preparation for bulk insertion
        chunker.add(
          IBookmarks.BulkInsert,
          (vis, insertions, prevIdx) => {
            vis.array.unfill(INDEX, 0, undefined, SIZE - 1); // Reset any coloring of slots
            vis.array.showKth({key: "Bulk Inserting...", insertions: insertions, increment: ""});
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
        for (const key of returnInputFromRange(item)) {
          prevIdx = hashInsert(table, key, prevIdx, true);
        }
      }
    }

    // Chunker for resetting visualizers in case of new insertion cycle
    chunker.add(
      IBookmarks.Done,
      (vis) => {

        vis.array.showKth({key: "", insertions: insertions, increment: ""}) // Nullify some stats, for better UI

        // Hide pointer
        if (SIZE === SMALL_SIZE) {
          vis.array.assignVariable(POINTER_VALUE, POINTER, undefined);
        }

        vis.array.unfill(INDEX, 0, undefined, SIZE - 1); // Unfill all boxes
        
        // Reset graphs
        vis.graph.updateNode(HASH_GRAPH.Key, ' ');
        vis.graph.updateNode(HASH_GRAPH.Value, ' ');
        if (ALGORITHM_NAME === 'HashingDH') {
          vis.graph.updateNode(HASH_GRAPH.Key2, ' ');
          vis.graph.updateNode(HASH_GRAPH.Value2, ' ');
        }

        // Extract resulting array for testing
        table_result = vis.array.extractArray([1], "-")
      },
    )

    return table_result; // Return resulting array for testing
  },
};
