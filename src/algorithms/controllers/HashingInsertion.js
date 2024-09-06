import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { HashingExp } from '../explanations';



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
    let hashTable = ['Hash Index', ...Array.from({ length: hashValue - 1 }, (_, i) => i + 1)];
    let nullArr = ['', ...Array(hashValue - 1).fill('')];

    const SMALL= 11;
    const BIG = 97;
    const BIGPRIME = 3457;
    let mode = 0;
    let incrementType = 0;
    let insertions = 0;

    chunker.add(
      'HashInit(T)',
      (vis, array) => {
        vis.array.set(array, 'HashingLP');
      },
      [[hashTable]]
    );

    function hashInit() {
      let tableSize = mode == 0 ? SMALL : BIG;
      let table = new Array(tableSize);

      chunker.add(
        'Initialize to Empty',
        (vis, array) => {
          vis.array.set(array, 'HashingLP');
          vis.array.hideArrayAtIndex(2);

          vis.graph.weighted(true);
          vis.graph.set([[0, 'Hash'], [0, 0]], [1, 2], [[-5, 0], [5, 0]]);
        },
        [[hashTable, nullArr, nullArr]]
      );

      return table;
    }

    hashInit();

    function hash(k) {
      if (mode == 0) {
        return k*BIGPRIME % SMALL;
      }
      return (k*BIGPRIME) % BIG;
    }

    function setIncrement(k) {
      let smallishprime = mode == 0 ? 3 : 23;
      return incrementType == 0 ? 1 : (k*BIGPRIME) % smallishprime;
    }

    function changeMode() {
      mode = mode == 0 ? 1 : 0;
    }

    function changeIncrementType() {
      incrementType = incrementType == 0 ? 1 : 0;
    }

    function hashInsert(table, key) { // add mode parameter with case for
      insertions = insertions + 1;
      // get initial hash index
      let i = hash(key);

      let increment = setIncrement(key);
      // linear probing collision handling
      while (typeof table[i] !== 'undefined' && table[i] !== null) {
        i = (i + increment) % table.length;

      }
      table[i] = key;

    }

    function hashDelete(table, key) {
      insertions = insertions - 1;
      let i = hash(key);
      let increment = setIncrement(key);
      while (table[i] != key) {
        i = (i + increment) % table.length;
      }
      table[i] = null;
    }
  },
};
