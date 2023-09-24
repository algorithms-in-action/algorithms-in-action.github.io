
const N_GRAPH = ['0','1','2','3','4','5','6','7','8','9','10'];
const N_ARRAY = ["i", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ORANGE = '4';
const GREEN = '1';
const RED = '5';

const N_ARRAY_IDX = 0;
const PARENT_ARRAY_IDX = 1;

export default {

    initVisualisers({visualiser}) {
        // Clearing array from union
        visualiser.array.instance.deselectRow(0, 0, 10);
        visualiser.array.instance.deselectRow(1, 0, 10);
        visualiser.array.instance.showKth(' ');
        visualiser.array.instance.clearVariables();

        // Clearing tree from union
        visualiser.tree.instance.clearHighlights();


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

    notAtRoot(chunker, parentArr, n, nTempPrev, nConst) {

        chunker.add('while n != parent[n]', (vis) => {
    
          vis.array.assignVariable('n', N_ARRAY_IDX, n);
          vis.array.select(N_ARRAY_IDX, n, undefined, undefined, ORANGE);
    
          if (nTempPrev != n) {
            // Maintain orange highlight (assignVariable effectively deselects).
            vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, ORANGE);
          } 
        });
    
        chunker.add(`while n != parent[n]`, (vis) => {
    
          vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, ORANGE);
          
          vis.array.deselect(PARENT_ARRAY_IDX, 0, undefined, n-1)
          vis.array.deselect(PARENT_ARRAY_IDX, n+1, undefined, 10)
          
        });
        if (parentArr[n] != n) {
          return true;
        }
        return false;
      },

      shortenPath(chunker, parentArr, n) {
        const parent = parentArr[n];
        const grandparent = parentArr[parent];
        // highlight parent[n] in parent array
        chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
          vis.array.deselect(N_ARRAY_IDX, n);
          vis.array.deselect(PARENT_ARRAY_IDX, n);
          vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, ORANGE);
        });
    
        // highlight n's parent in the n array
        chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
          vis.array.select(N_ARRAY_IDX, parent, undefined, undefined, ORANGE);
        });
        
        // highlight the grandparent
        chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
          vis.array.deselect(N_ARRAY_IDX, parent);
          vis.array.select(PARENT_ARRAY_IDX, parent, undefined, undefined, ORANGE);
        });
        // change parent[n] into the grandparent's value
        parentArr[n] = grandparent;
    
        chunker.add(`parent[n] <- parent[parent[n]]`, (vis) => {
          vis.array.set([N_ARRAY, parentArr], 'unionFind', ' ');
          vis.array.assignVariable('n', N_ARRAY_IDX, n);
          vis.array.deselect(PARENT_ARRAY_IDX, parent);
          vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, ORANGE);
        });
    
      },

    find(chunker, parentArr, n, pathCompression, nodesArray, nConst) {

           
        // 'while n != parent[n]'
        let nTempPrev = n;
        
        while (this.notAtRoot(chunker, parentArr, n, nTempPrev, nConst)) {    
          
            nTempPrev = n;
          
          chunker.add(`while n != parent[n]`, (vis,n) => {
    
            vis.array.deselect(N_ARRAY_IDX, nTempPrev);
            vis.array.deselect(PARENT_ARRAY_IDX, nTempPrev);
    
            vis.array.select(N_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
            vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
            
            vis.tree.visit1(n.toString(),n.toString(),2);
          },[nTempPrev]);
          
        if (pathCompression === true) {
            this.shortenPath(chunker, parentArr, nTempPrev);
        }
    
          // 'n <- parent[n]'
          n = parentArr[n];
          chunker.add(`n <- parent[n]`, (vis,nPrev) => {
          
    
            vis.array.deselect(N_ARRAY_IDX, nTempPrev);
            vis.array.deselect(PARENT_ARRAY_IDX, nTempPrev);
    
            vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, ORANGE);
            vis.tree.leave1(n.toString(),n.toString(),2);
            
          }, [nTempPrev]);
        }
        
        // 'return n'
        chunker.add(`while n != parent[n]`, (vis) => {
    
          vis.array.deselect(N_ARRAY_IDX, n);
          vis.array.deselect(PARENT_ARRAY_IDX, n);
          
          vis.array.select(N_ARRAY_IDX, n, undefined, undefined, GREEN);
          vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, GREEN);
          
          vis.tree.visit1(n.toString(),n.toString(),2);
        }, [n]);
    
        chunker.add(`return n`, (vis) => {
    
          vis.array.deselect(PARENT_ARRAY_IDX, n);
          vis.tree.leave1(n.toString(), n.toString(),2);
          vis.tree.select(n.toString(), n.toString());
        },[n]);

        return n;

    },
    

    run(chunker, {visualiser, target} ) {

        // Removing rank array:
        let parentElems = visualiser.array.instance.data[1];
        let parentArray = parentElems.map(element => parseInt(element.value, 10));
        parentArray[0] = 'Parent[i]';

        visualiser.array.instance.set([N_ARRAY, parentArray], 'unionFind');
        const value = target.arg1;
        const pathCompression = target.arg2;
        const nodesArray = N_GRAPH.map(id => visualiser.tree.instance.findNode(id));

        this.find(chunker, parentArray, value, pathCompression, nodesArray, value);

   }

}