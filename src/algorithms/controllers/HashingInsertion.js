import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { HashingExp } from '../explanations';


const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const arr2 = ['', '', '', '', '', '', '', '', '', '', ''];

export default {
  explanation: HashingExp,
  initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Hash Table'),
        order: 0,
      },
    };
  },

  run(chunker) {
    chunker.add('HashInit(T)');
    chunker.add(
      'HashInit(T)',
      (vis, array) => {
        vis.array.set(array, 'HashingLP');
      },
      [[arr1, arr2]]
    );

    const SMALL= 11;
    const BIG = 97;
    const BIGPRIME = 3457;
    let mode = 0;
    let incrementType = 0;
    let insertions = 0;
    function hashInit() {
      let tableSize = mode == 0 ? SMALL : BIG;
      let table = new Array(tableSize);

      return table;
    }

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
