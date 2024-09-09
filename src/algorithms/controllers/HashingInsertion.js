import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { HashingExp } from '../explanations';
import { hash1, setIncrement, IBookmarks } from './HashingCommon';


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

    function hashInsert(table, key) {
      insertions = insertions + 1;
      chunker.add(
        IBookmarks.IncrementInsertions,
        (vis, insertions) => {
          vis.array.showKth(insertions);
        },
        [insertions]
      );
      // get initial hash index
      let i = hash1(chunker, key, hashValue);
      let increment = setIncrement(chunker, key, hashValue, params.name);

      chunker.add(
        IBookmarks.Probing,
        (vis, index) => {
          vis.array.assignVariable('i', 2, index);
        },
        [i]
      )
      while (typeof table[i] !== 'undefined' && table[i] !== null) {
        i = (i + increment) % table.length;
        chunker.add(
          IBookmarks.HandlingCollision,
        )

        chunker.add(
          IBookmarks.Probing,
          (vis, index) => {
            vis.array.assignVariable('i', 2, index);
          },
          [i]
        )
      }

      table[i] = key;
      chunker.add(
        IBookmarks.PutIn,
        (vis, idx, val) => {
          vis.array.updateValueAt(1, idx, val);
        },
        [i + 1, key]
      )
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

    for (const item of inputs) {
      hashInsert(table, item);
    }
  },
};
