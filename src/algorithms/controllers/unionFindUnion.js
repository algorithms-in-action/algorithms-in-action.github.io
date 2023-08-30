import { UFExp } from '../explanations';
// import GraphTracerRect from '../../components/DataStructures/Graph/GraphTracerRect';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

const N_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default {
  explanation: UFExp,

  initVisualisers() {
    return {
      array: {
        instance: new Array2DTracer('array', null, 'Array View'),
        order: 0,
      },
      // insert tree here

    };
  },


  
  run(chunker, params) {
    const unionOperations = params.target;
    
    // initialise parent array
    let parentArray = [...N_ARRAY]
    
    // setting up the arrays
    chunker.add('1', (vis, array) => {
      vis.array.set(array);
    }, [[N_ARRAY, parentArray]]); // will add a third array for rank here

    // applying union operations
    for (let i = 0; i < unionOperations.length; i++) {
      union(chunker, parentArray, unionOperations[i][0], unionOperations[i][1]);
    }


  },

};

function find(chunker, parentArr, n) {

  // there is a bug here
  chunker.add('1', (vis) => {
    vis.array.select(1, n-1);
  },);

  while (parentArr[n-1] !== n) {

      n = parentArr[n-1];
  }

  return n;
}

function union(chunker, parentArray, x, y) {


  let root1 = find(chunker, parentArray, x);
  let root2 = find(chunker, parentArray, y);


  chunker.add('1', (vis) => {
      vis.array.select(1, root1-1);
      vis.array.select(1, root2-1); // is there a way to avoid -1 here?
  },);

  if (root1 !== root2) {

    parentArray[root2-1] = root1;

    // update array
    chunker.add('1', (vis, array) => {
      vis.array.set(array);
    }, [[N_ARRAY, parentArray]]);
  }

}


