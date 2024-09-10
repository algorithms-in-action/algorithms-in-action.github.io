import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { hash1, setIncrement, HASH_TABLE } from './HashingCommon';

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

  run(chunker, params) {

    let target = params.target;
    let hashValue = params.hashSize;

    chunker.add('HashSearch(T, k)');
    chunker.add('HashSearch(T, k)');

    function hashSearch(table, key) {
      // index
      let i = hash1(chunker, 'HashSearch(T, k)', key, hashValue);
      let increment = setIncrement(
        chunker, 'HashSearch(T, k)', key, hashValue, params.name
      );

      while (table[i] != key) {
        i = (i + increment) % table.length;
      }
      return i;
    }
  },
};
