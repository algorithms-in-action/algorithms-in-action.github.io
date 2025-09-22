import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { HashingExp } from '../explanations';
import {
  hash1,
  HASH_GRAPH,
  EMPTY_CHAR,
  EMPTY_CHAR_CH,
  Colors,
  INDEX,
  POINTER,
  POINTER_VALUE,
  SMALL_SIZE,
  VALUE,
  LARGE_SIZE,
  SPLIT_SIZE,
  HASH_TYPE,
  PRIMES,
  POINTER_CUT_OFF,
  newCycle
} from './HashingCommon';
import { translateInput } from '../parameters/helpers/InputBuilders';
import HashingDelete from './HashingDelete';
import { createPopper } from '@popperjs/core';

// Bookmarks to link chunker with pseudocode
const IBookmarks = {
  Init: 1,
  EmptyArray: 1, // XXX delete init code
  InitInsertion: 3,
  NewInsertion: 4,
  Hash1: 5,
  Pending: 7,
  PutIn: 9,
  Done: 10,
  BulkInsert: 1,
}

// text to display after key in table to indicate there are more keys
// XXX MUST be the same in function extractArray in Array2DTracer.js
const ETC = "..";

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
    let valueArr = Array(SIZE).fill(EMPTY_CHAR_CH);
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
     * @returns the index the key is assigned
     */
    function hashInsert(table, key) {

    chunker.add(
        IBookmarks.NewInsertion,
        (vis, total) => {
            vis.array.showKth({
                key: key,
                type: HASH_TYPE.Insert
            })
            newCycle(vis, table.length, key, ALGORITHM_NAME); // New insert cycle
        },
        [total]
    )

      insertions++; // Increment insertions
      total++; // Increment total

      // Get initial hash index for current key
      let i = hash1(chunker, IBookmarks.Hash1, key, table.length, true);

    // Chunker for first pending slot
    chunker.add(
        IBookmarks.Pending,
        (vis, idx) => {

        // Pointer only appear for small table
        if (table.length <= PRIMES[POINTER_CUT_OFF]) {
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

      // Internally assign the key to the index
      table[i].unshift(key);

      // Chunker for placing the key
      chunker.add(
        IBookmarks.PutIn,
        (vis, val, idx, insertions, table) => {
            if (table[idx].length > 1) {
                const popper = document.getElementById('float_box_' + idx);
                if (table[idx].length == 2) {
                    const slot = document.getElementById('chain_' + idx);
                    floatingBoxes[idx] = createPopper(slot, popper, {
                        placement: "right-start",
                        strategy: "fixed",
                        modifiers: [
                            {
                                name: 'preventOverflow',
                                options: {
                                  boundary: document.getElementById('popper_boundary'),
                                },
                            },
                        ]
                    });
                    // vis.array.setPopper(idx, floatingBoxes[idx]);
                }
                popper.innerHTML = table[idx];
              } 

            let slotCurValue = vis.array.getValueAt(VALUE, idx);
            if (slotCurValue === EMPTY_CHAR_CH)
              // Update value of that index when the slot is empty
              vis.array.updateValueAt(VALUE, idx, '[' + val + ']');
            else
              // / Update value of that index when the slot is not empty
              vis.array.updateValueAt(VALUE, idx, '[' + val + '..');
            vis.array.fill(INDEX, idx, undefined, undefined, Colors.Insert);

/*
            let slotCurValue = vis.array.getValueAt(VALUE, idx);
            if (slotCurValue === EMPTY_CHAR) vis.array.updateValueAt(VALUE, idx, val); // Update value of that index when the slot is empty
            else vis.array.updateValueAt(VALUE, idx, slotCurValue + (table[idx].length == 2 ? ETC : "")); // Update value of that index when the slot is not empty
            vis.array.showKth({key: vis.array.getKth().key, type: HASH_TYPE.BulkInsert, insertions: insertions});
            vis.array.fill(INDEX, idx, undefined, undefined, Colors.Insert); // Fill it green, indicating successful insertion
*/
        },
        [key, i, insertions, table]
      )

      // Return the insertion index
      return i;
    }


    /**
     * Function for bulk insertion
     * @param {*} table the table to keep track of the internal and illustrated array
     * @param {*} keys the keys to insert
     * @returns the index the last key is assigned
     */
    function hashBulkInsert(table, keys) {
      let lastHash;
      let inserts = {};
      let bulkInsertions = 0;
      for (const key of keys) {

        bulkInsertions++;

        // hashed value
        let i = hash1(null, null, key, table.length, false);

        table[i].unshift(key);
        inserts[key] = i;
        lastHash = i;
      }

      insertions += bulkInsertions;
      total += bulkInsertions;
      chunker.add(
        IBookmarks.PutIn,
        (vis, keys, inserts, insertions, table) => {
          for (const key of keys) {
            if (table[inserts[key]].length > 1) {
                const popper = document.getElementById('float_box_' + inserts[key]);
                if (table[inserts[key]][2] !== null) {
                    const slot = document.getElementById('chain_' + inserts[key]);
                    floatingBoxes[inserts[key]] = createPopper(slot, popper, {
                        placement: "right-start",
                        strategy: "absolute",
                        modifiers: [
                            {
                                name: 'preventOverflow',
                                options: {
                                  boundary: document.getElementById('popper_boundary'),
                                },
                            },
                        ]
                    });
                }
                popper.innerHTML = table[inserts[key]];
              } 

            let slotCurValue = vis.array.getValueAt(VALUE, inserts[key]);
            console.log(typeof(slotCurValue), key, slotCurValue, table[inserts[key]]);
            if (slotCurValue === EMPTY_CHAR_CH)
              // Update value of that index when the slot is empty
              vis.array.updateValueAt(VALUE, inserts[key], '[' + key + ']');
            else
              // / Update value of that index when the slot is not empty
              vis.array.updateValueAt(VALUE, inserts[key], '[' + key + '..');
            vis.array.fill(INDEX, inserts[key], undefined, undefined, Colors.Insert);
          }
          vis.array.showKth({key: vis.array.getKth().key, type: HASH_TYPE.BulkInsert, insertions: insertions});
        },
        [keys, inserts, insertions, table]
      )

      return lastHash;
    }


    // Inserting inputs
    let prevIdx;

    let floatingBoxes = new Array(SIZE); // List of all popper instances
    floatingBoxes.fill(null);

    // Init hash table with dynamic array in each slot
    let table = new Array(SIZE);
    for (var i = 0; i < SIZE; i++) {
        table[i] = [];
      }

      prevIdx = null;

      // Chunker step for the inital loading state
      chunker.add(
        IBookmarks.Init,
        (vis, size, array) => {
          // Increase Array2D visualizer render space
        if (SIZE === LARGE_SIZE) {
          vis.array.setSize(3);
          vis.array.setZoom(0.7);
          vis.graph.setZoom(1.5);
        } else {
          vis.array.setZoom(1);
          vis.graph.setZoom(1);
        }

          // Initialize the array
          vis.array.set(array,
            params.name,
            '',
            INDEX,
            {
              rowLength: size > SMALL_SIZE ? SPLIT_SIZE : SMALL_SIZE,
              rowHeader: ['Index', 'Chain', '']
            }
          );

          // vis.array.hideArrayAtIndex([VALUE, POINTER]); // Hide value and pointer row intially
          vis.array.hideArrayAtIndex([POINTER]); // Hide pointer row intially
          // destroy existing poppers, replace with null
          floatingBoxes.forEach((p) => {
            if (p !== null) {
              console.log('destroy', p.state);
              p.state.elements.popper.innerHTML = ""; // reset HTML
              p.destroy();                            // remove popper
              return null;                            // array el. = null
            }
          });
          // vis.array.setPoppers(floatingBoxes); // init with no poppers

          vis.graph.weighted(true);

          // Intialize the graphs
          switch (ALGORITHM_NAME) {
            case "HashingLP" :
              vis.graph.set([[0, 'Hash'], [0, 0]], [' ', ' '], [[-5, 0], [5, 0]]);
              break;
            case "HashingCH" :
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
        [table.length,
          table.length <= PRIMES[POINTER_CUT_OFF] ?
            [indexArr, valueArr, nullArr] :
            [indexArr, valueArr]
        ]
      );

      // Chunker to initialize empty array visually
/*
      chunker.add(
        IBookmarks.Init,
        (vis) => {
          // Show the value row
          vis.array.hideArrayAtIndex(POINTER);
        },
      );

      // Chunker for intializing insertion stat
      chunker.add(
        IBookmarks.EmptyArray,
        (vis, insertions) => {
          vis.array.showKth({
              key: "",
              type: EMPTY_CHAR,
              insertions: insertions,
              increment: "",
            }
          );
        },
        [insertions]
      )
*/

      // Magic numbers for length of splitting a postive integer string by "-", the index of "", and the number to delete when a negative integer is split by "-"
      const POS_INTEGER_SPLIT_LENGTH = 1;
      const EMPTY_DELETE_SPLIT_INDEX = 0;
      const NUMBER_DELETE_SPLIT_INDEX = 1;

      for (const item of inputs) {

        // Different cases of insertion and deletion
        let split_arr = item.split("-");
        if (split_arr.length == POS_INTEGER_SPLIT_LENGTH) { // When the input is a positive integer -> normal insert
          for (const key of translateInput(item, "Array")) {
            prevIdx = hashInsert(table, key, false);
          }
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
                vis.array.unfill(INDEX, 0, undefined, table.length - 1); // Reset any coloring of slots
                vis.array.showKth({key: item, type: HASH_TYPE.BulkInsert, insertions: insertions, increment: ""});
                if (table.length <= PRIMES[POINTER_CUT_OFF])
                  vis.array.assignVariable("", POINTER, prevIdx, POINTER_VALUE); // Hide pointer

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
        if (table.length <= PRIMES[POINTER_CUT_OFF]) {
          vis.array.assignVariable(POINTER_VALUE, POINTER, undefined);
        }

        vis.array.unfill(INDEX, 0, undefined, table.length - 1); // Unfill all boxes

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
