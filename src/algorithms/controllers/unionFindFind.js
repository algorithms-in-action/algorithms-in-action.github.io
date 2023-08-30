
export default {
   
    initVisualisers({visualiser}) {
        // clearing row from previous find
        visualiser.array.instance.deselectRow(1, 0, 9);

        return {
            array: {
                instance: visualiser.array.instance,
                order: 0,
            },
        };
    },

    run(chunker, {visualiser, target} ) {
        
        // getting parent awway
        const elemArray = visualiser.array.instance.data[1]
        const parentArray = elemArray.map(element => parseInt(element.value, 10));
        
        // running find
        find(chunker, parentArray, target);

   }

}

function find(chunker, parentArr, n) {

    // visualising - there is a BUG here
    chunker.add('1', (vis) => {
      vis.array.select(1, n-1);
    },);
  
    while (parentArr[n-1] !== n) {
        n = parentArr[n-1];
    }
  
    return n;
  }