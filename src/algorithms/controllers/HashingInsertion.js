import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { HashingExp } from '../explanations';
import { hash1, setIncrement, HASH_TABLE } from './HashingCommon';


const IBookmarks = {
  Init: 1,
  EmptyArray: 2,
  IncrementInsertions: 3,
  Hash1: 4,
  ChooseIncrement: 5,
  Probing: 6,
  HandlingCollision: 7,
  PutIn: 8,
  Done: 9,
}

export default {
  explanation: HashingExp,
  initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Hash Table'),
        order: 0,
      },
      graph: {
        instance: new GraphTracer('graph', null, 'Hash'),
        order: 1,
      },
    };
  },

  run(chunker, params) {
    let inputs = params.values;
    let hashValue = params.hashSize;
    let indexArr = Array.from({ length: hashValue }, (_, i) => i);
    let valueArr = Array(hashValue).fill('-');
    let nullArr = Array(hashValue).fill('');

    let insertions = 0;

    function hashInsert(table, key, prevKey, prevIdx) {
      if (insertions == table.length -1) {
        console.log("Table is full"); // fix so it displays on site
      }
      else {
          insertions = insertions + 1;
          chunker.add(
            IBookmarks.IncrementInsertions,
            (vis, key, insertions, prevKey, prevIdx) => {
              vis.array.showKth(insertions);

              // change variable value
              vis.array.assignVariable(key, 2, prevIdx, prevKey);

              // update key value
              vis.graph.updateNode(HASH_TABLE.Key, key);
              vis.graph.updateNode(HASH_TABLE.Value, ' ');
            },
            [key, insertions, prevKey, prevIdx]
          );
          // get initial hash index
          let i = hash1(chunker, IBookmarks.Hash1, key, hashValue);
          let increment = setIncrement(
            chunker, IBookmarks.ChooseIncrement, key, hashValue, params.name
          );

          chunker.add(
            IBookmarks.Probing,
            (vis, key, idx) => {
              vis.array.assignVariable(key, 2, idx);
            },
            [key, i]
          )
          while (typeof table[i] !== 'undefined' && table[i] !== null && table[i] !== key) {
            i = (i + increment) % table.length;
            chunker.add(
              IBookmarks.HandlingCollision,
            )

            chunker.add(
              IBookmarks.Probing,
              (vis, key, idx) => {
                vis.array.assignVariable(key, 2, idx);
              },
              [key, i]
            )
          }

          table[i] = key;
          chunker.add(
            IBookmarks.PutIn,
            (vis, val, idx) => {
              vis.array.updateValueAt(1, idx, val);
            },
            [key, i]
          )

          return [key, i];
      }
    }

    // Init hash table
    // Hide third row to show assigned variables
    let table = new Array(hashValue);
    chunker.add(
      IBookmarks.Init,
      (vis, array) => {
        vis.array.set(array, 'HashingLP', '', { rowLength: 20, rowHeader: ['Index', 'Value', ''] });
        vis.array.hideArrayAtIndex([1, 2]);
      },
      [[indexArr, valueArr, nullArr]]
    );

    chunker.add(
      IBookmarks.EmptyArray,
      (vis) => {
        // Show the value row
        vis.array.hideArrayAtIndex(2);

        // Init hashing animation
        vis.graph.weighted(true);
        vis.graph.set([[0, 'Hash'], [0, 0]], [' ', ' '], [[-5, -7], [5, -7]]);
      },
    );

    let prevKey = null;
    let prevIdx = null;
    for (const key of inputs) {
      [prevKey, prevIdx] = hashInsert(table, key, prevKey, prevIdx);
    }

    chunker.add(
      IBookmarks.Done,
      (vis, key) => {
        vis.array.assignVariable(key, 2, undefined);

       vis.graph.updateNode(HASH_TABLE.Key, ' ');
       vis.graph.updateNode(HASH_TABLE.Value, ' ');
      },
      [prevKey]
    )
  },
};
