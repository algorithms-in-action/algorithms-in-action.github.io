import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';

export default {
  initVisualisers({ visualisers }) {
    return {
      array: {
        instance: visualisers.array.instance,
        order: 0,
      },
      graph: {
        instance: visualisers.graph.instance,
        order: 1,
      },
    };
  },

  run(chunker) {
    chunker.add('HashSearch(T, k)');
    chunker.add('HashSearch(T, k)');

    // small hash, table size 11
    const SMALL= 11;
    const BIG = 97;
    const BIGPRIME = 3457;
    let mode = 0;
    let incrementType = 0;

    function hash(k) {
      return mode == 0 ? k % SMALL : k % BIG;
    }

    function setIncrement(k) {
      let smallishprime = mode == 0 ? 3 : 23;
      return incrementType == 0 ? 1 : (k*BIGPRIME) % smallishprime;
    }

    function hashSearch(table, key) {
      // index
      let i = hash(key);
      let increment = setIncrement(key);
      while (table[i] != key) {
        i = (i + increment) % table.length;
      }
      return i;
    }
  },
};
