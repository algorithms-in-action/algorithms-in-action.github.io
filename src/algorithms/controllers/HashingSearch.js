import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import { hash1, setIncrement, HASH_TABLE, hashSearch } from './HashingCommon';

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
    //hashSearch(chunker, target, ); incomplete implementation
  },
};
