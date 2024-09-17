import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { HashingExp } from '../explanations';
import {
  hash1,
  setIncrement,
  HASH_TABLE,
  EMPTY_CHAR,
  Colors
} from './HashingCommon.js';


const IBookmarks = {
  Init: 1,
  EmptyArray: 2,
  IncrementInsertions: 3,
  Hash1: 4,
  ChooseIncrement: 5,
  Probing: 6,
  Collision: 7,
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
    let valueArr = Array(hashValue).fill(EMPTY_CHAR);
    let nullArr = Array(hashValue).fill('');

    const INDEX = 0;
    const VALUE = 1;
    const VAR = 2;

    let insertions = 0;

    function hashInsert(table, key, prevKey, prevIdx) {
      insertions = insertions + 1;
      chunker.add(
        IBookmarks.IncrementInsertions,
        (vis, key, insertions, prevKey, prevIdx) => {
          vis.array.showKth(insertions);
          vis.array.unfill(INDEX, 0, undefined, hashValue - 1);

          // change variable value
          vis.array.assignVariable(key, VAR, prevIdx, prevKey);

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
          vis.array.assignVariable(key, VAR, idx);
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending);
        },
        [key, i]
      )
      while (table[i] !== undefined) {
        let prevI = i;
        i = (i + increment) % hashValue;
        chunker.add(
          IBookmarks.Collision,
          (vis, idx) => {
            vis.array.fill(INDEX, idx, undefined, undefined, Colors.Collision);
          },
          [prevI]
        )

        chunker.add(
          IBookmarks.Probing,
          (vis, key, idx) => {
            vis.array.assignVariable(key, VAR, idx);
            vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending);
          },
          [key, i]
        )
      }

      table[i] = key;
      chunker.add(
        IBookmarks.PutIn,
        (vis, val, idx) => {
          vis.array.updateValueAt(VALUE, idx, val);
          vis.array.fill(INDEX, idx, undefined, undefined, Colors.Insert);
        },
        [key, i]
      )

      return i;
    }

    // Init hash table
    // Hide third row to show assigned variables
    let table = new Array(hashValue);
    chunker.add(
      IBookmarks.Init,
      (vis, array) => {
        vis.array.set(array, params.name, '', { rowLength: 20, rowHeader: ['Index', 'Value', ''] });
        vis.array.hideArrayAtIndex([VALUE, VAR]);
      },
      [[indexArr, valueArr, nullArr]]
    );

    chunker.add(
      IBookmarks.EmptyArray,
      (vis) => {
        // Show the value row
        vis.array.hideArrayAtIndex(VAR);

        // Init hashing animation
        vis.graph.weighted(true);
        vis.graph.set([[0, 'Hash'], [0, 0]], [' ', ' '], [[-5, 0], [5, 0]]);
      },
    );

    let prevKey;
    let prevIdx;
    for (const key of inputs) {
      prevIdx = hashInsert(table, key, prevKey, prevIdx);
      prevKey = key;
    }

    chunker.add(
      IBookmarks.Done,
      (vis, key) => {
        vis.array.assignVariable(key, VAR, undefined);
        vis.array.unfill(INDEX, 0, undefined, hashValue - 1);

        vis.graph.updateNode(HASH_TABLE.Key, ' ');
        vis.graph.updateNode(HASH_TABLE.Value, ' ');
      },
      [prevKey]
    )
  },
};
