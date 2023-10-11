import {N_ARRAY, ARRAY_COLOUR_CODES, TREE_COLOUR_CODES, N_IDX, PARENT_IDX, highlight, unhighlight} from './unionFindUnion.js';

export function notAtRoot(chunker, parentArr, n) {
  // Highlighting parent[n] for 'transition' state. 
  chunker.add(`while n != parent[n]`, (vis, n) => {
    unhighlight(vis.array, PARENT_IDX, n, true);
    highlight(vis.array, PARENT_IDX, n, ARRAY_COLOUR_CODES.ORANGE);
  }, [n]);
  return parentArr[n] != n;
}

export function shortenPath(chunker, parentArr, n) {

  chunker.add(`parent[n] <- parent[parent[n]]`, (vis, n, parent, grandparent) => {
    unhighlight(vis.array, N_IDX, n);
    unhighlight(vis.tree, n, n);
    highlight(vis.array, PARENT_IDX, n, ARRAY_COLOUR_CODES.ORANGE);
    highlight(vis.array, PARENT_IDX, parent, ARRAY_COLOUR_CODES.ORANGE);
    highlight(vis.tree, parent, parent, TREE_COLOUR_CODES.ORANGE);
    highlight(vis.tree, grandparent, grandparent, TREE_COLOUR_CODES.ORANGE);
  },[n, parentArr[n], parentArr[parentArr[n]]]);

  // If grandparent is not the parent 
  if (parentArr[n] !== n && parentArr[parentArr[n]] !== parentArr[n]) {
      
    let formerParent = parentArr[n];
      parentArr[n] = parentArr[parentArr[n]]; 

    chunker.add(`parent[n] <- parent[parent[n]]`, (vis, n, grandparent) => {
      vis.array.updateValueAt(PARENT_IDX, n, grandparent);

      vis.tree.removeEdge(formerParent.toString(), n.toString());
      vis.tree.addEdge(grandparent.toString(), n.toString());
      vis.tree.layout();
    },[n, parentArr[parentArr[n]]]);
    

    chunker.add(`parent[n] <- parent[parent[n]]`, (vis, n, formerParent, newParent) => {
      unhighlight(vis.array, PARENT_IDX, formerParent);
      unhighlight(vis.tree, formerParent, formerParent);
      unhighlight(vis.tree, newParent, newParent)
      
      highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.RED);
      highlight(vis.array, PARENT_IDX, n, ARRAY_COLOUR_CODES.RED);
      highlight(vis.tree, n, n, TREE_COLOUR_CODES.RED);
    },[n, formerParent, parentArr[n]]);

  } 
}

export function find(chunker, parentArr, n, name, m, pathCompression) {
      
  while (notAtRoot(chunker, parentArr, n)) {
          
    // Highlighting for 'fail state'. 
    chunker.add(`while n != parent[n]`, (vis, n) => {
      highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.RED);
      highlight(vis.array, PARENT_IDX, n, ARRAY_COLOUR_CODES.RED);
      highlight(vis.tree, n, n, TREE_COLOUR_CODES.RED);
    },[n]);

    if (pathCompression) {
      shortenPath(chunker, parentArr, n);
    }
    
    // Updating the value of n.
    let nTempPrev = n;
    n = parentArr[n];

    chunker.add(`n <- parent[n]`, (vis, n, m, nPrev) => {
      vis.array.assignVariable(`${name}`, N_IDX, n); // Update 'n'.
      // Union specific logic, but cannot see a way around. 
      if (n !== m && m !== null) highlight(vis.array, N_IDX, m, ARRAY_COLOUR_CODES.GREEN); 
      highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.ORANGE);
      highlight(vis.array, PARENT_IDX, nPrev, ARRAY_COLOUR_CODES.ORANGE);
      highlight(vis.tree, n, n, TREE_COLOUR_CODES.ORANGE);
      unhighlight(vis.tree, nPrev, nPrev);
    },[n, m, nTempPrev]);
  }

  // Highlighting for 'success state'.
  chunker.add(`while n != parent[n]`, (vis, n) => {
    highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.GREEN);
    highlight(vis.array, PARENT_IDX, n, ARRAY_COLOUR_CODES.GREEN);
    highlight(vis.tree, n, n, TREE_COLOUR_CODES.GREEN);
  }, [n]);

  // Returning found 'n'.
  chunker.add(`return n`, (vis, n) => {
    unhighlight(vis.array, PARENT_IDX, n);
  },[n]);

  return n;
}

export default {

    initVisualisers({visualiser}) {

        // Clearing tree from union
        for (let i = 1; i < N_ARRAY.length; i++) {
          let n = N_ARRAY[i];
          unhighlight(visualiser.tree.instance, n, n);
        }
        return {
            array: {
                instance: visualiser.array.instance,
                order: 0,
            },
            tree: {
                instance: visualiser.tree.instance,
                order: 1,
            },
        };
    },
    

    run(chunker, {visualiser, target} ) {

        let parentElems = visualiser.array.instance.data[1];
        let parentArray = parentElems.map(element => parseInt(element.value, 10));
        parentArray[0] = 'Parent[i]';

        visualiser.array.instance.set([N_ARRAY, parentArray], 'unionFind');
        
        const value = target.arg1;
        const pathCompression = target.arg2;

        // Highlighting the current n to find in tree and array. 
        chunker.add(`Find(n)`, (vis, n) => {
        vis.array.setMotion(true); // Turning on smooth transition.
        highlight(vis.array, N_IDX, n, ARRAY_COLOUR_CODES.ORANGE);
        highlight(vis.tree, n, n, TREE_COLOUR_CODES.ORANGE);
        vis.array.showKth(`Find(${n})`);

      },[value]);

        find(chunker, parentArray, value, 'n', null, pathCompression);


   }


}