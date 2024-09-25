import { array } from 'prop-types';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { HashingExp } from '../explanations';
import {
  hash1,
  setIncrement,
  HASH_TABLE,
  EMPTY_CHAR,
  Colors
} from './HashingCommon';
import { returnInputFromRange } from '../parameters/helpers/ParamHelper.js';


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
  BulkInsert: 11
}

const TYPE = 'Insert';

export default {
  explanation: HashingExp,
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

  run(chunker, params) {
    const ALGORITHM_NAME = params.name;
    let inputs = params.values;
    let hashValue = params.hashSize;
    let indexArr = Array.from({ length: hashValue }, (_, i) => i);
    let valueArr = Array(hashValue).fill(EMPTY_CHAR);
    let nullArr = Array(hashValue).fill('');
    let table_result;

    const INDEX = 0;
    const VALUE = 1;
    const POINTER = 2;
    const POINTER_VALUE = "i"
    const SMALL = 11;
    const BIG = 97;
    const SPLIT_SIZE = 17;

    let insertions = 0;

    function hashInsert(table, key, prevIdx) {
      insertions = insertions + 1;
      chunker.add(
        IBookmarks.IncrementInsertions,
        (vis, key, insertions, prevIdx) => {
          vis.array.showKth({key: key, insertions: insertions});
          vis.array.unfill(INDEX, 0, undefined, hashValue - 1);

          // change variable value
          if (hashValue === SMALL) {
            vis.array.assignVariable("", POINTER, prevIdx, POINTER_VALUE);
          }

          // update key value
          vis.graph.updateNode(HASH_TABLE.Key, key);
          vis.graph.updateNode(HASH_TABLE.Value, ' ');
          vis.graph.select(HASH_TABLE.Key);
          vis.graph.colorEdge(HASH_TABLE.Key, HASH_TABLE.Value, Colors.Pending)

          if (ALGORITHM_NAME === "HashingDH") {
            vis.graph.updateNode(HASH_TABLE.Key2, key);
            vis.graph.updateNode(HASH_TABLE.Value2, ' ');
            vis.graph.select(HASH_TABLE.Key2);
            vis.graph.colorEdge(HASH_TABLE.Key2, HASH_TABLE.Value2, Colors.Pending)
          }
        },
        [insertions, prevIdx]
      );
      // get initial hash index
      let i = hash1(chunker, IBookmarks.Hash1, key, hashValue);
      let increment = setIncrement(
        chunker, IBookmarks.ChooseIncrement, key, hashValue, ALGORITHM_NAME, TYPE
      );

      chunker.add(
        IBookmarks.Probing,
        (vis, idx) => {
          if (hashValue === SMALL) {
            vis.array.assignVariable(POINTER_VALUE, POINTER, idx);
          }
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
      )
      while (table[i] !== undefined && table[i] !== key) {
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
          (vis, idx) => {
            if (hashValue === SMALL) {
              vis.array.assignVariable(POINTER_VALUE, POINTER, idx);
            }
            vis.array.fill(INDEX, idx, undefined, undefined, Colors.Pending);
          },
          [i]
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
        // increase Array2D visualizer render space
        if (hashValue >= BIG) {
          vis.array.setSize(3);
        }

        vis.array.set(array,
          params.name,
          '',
          {
            rowLength: hashValue === BIG ? SPLIT_SIZE : SMALL,
            rowHeader: ['Index', 'Value', '']
          }
        );
        vis.array.hideArrayAtIndex([VALUE, POINTER]);

        vis.graph.weighted(true);
        switch (ALGORITHM_NAME) {
          case "HashingLP" :
            vis.graph.set([[0, 'Hash'], [0, 0]], [' ', ' '], [[-5, 0], [5, 0]]);
            break;
          case "HashingDH" :
            vis.graph.set([
              [0, 'Hash1', 0, 0], [0, 0, 0, 0], [0, 0, 0, 'Hash2'], [0, 0, 0, 0]],
              [' ', ' ', ' ', ' '],
              [[-5, 2], [5, 2], [-5, -2], [5, -2]]);
            break;
        }
      },
      [hashValue === SMALL ?
        [indexArr, valueArr, nullArr] :
        [indexArr, valueArr]
      ]
    );

    chunker.add(
      IBookmarks.EmptyArray,
      (vis) => {
        // Show the value row
        vis.array.hideArrayAtIndex(POINTER);
      },
    );

    chunker.add(
      IBookmarks.InitInsertion,
      (vis) => {
        vis.array.showKth([0, ""]);
      }
    )

    let prevIdx;
    for (const item of inputs) {
      for (const key of returnInputFromRange(item)) {
        prevIdx = hashInsert(table, key, prevIdx);
      }
    }

    chunker.add(
      IBookmarks.Done,
      (vis) => {
        if (hashValue === SMALL) {
          vis.array.assignVariable(POINTER_VALUE, POINTER, undefined);
        }
        vis.array.unfill(INDEX, 0, undefined, hashValue - 1);

        vis.graph.updateNode(HASH_TABLE.Key, ' ');
        vis.graph.updateNode(HASH_TABLE.Value, ' ');
        if (ALGORITHM_NAME === 'HashingDH') {
          vis.graph.updateNode(HASH_TABLE.Key2, ' ');
          vis.graph.updateNode(HASH_TABLE.Value2, ' ');
        }
        table_result = vis.array.extractArray([1], "x")
      },
    )

    return table_result;
  },
};
