
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

    notAtRoot(chunker, parentArr, n, nTempPrev) {

        chunker.add('while n != parent[n]', (vis,n) => {
    
          vis.array.assignVariable('n', N_ARRAY_IDX, n);
          vis.array.select(N_ARRAY_IDX, n, undefined, undefined, ORANGE);
          //vis.tree.visit1(n.toString(),n.toString(),2);

          if (nTempPrev != n) {
            // Maintain orange highlight (assignVariable effectively deselects).
            vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, ORANGE);
          } 
        }, [n]);
    
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

      shortenPath(chunker, parentArr, n, nodesArray) {
        const parent = parentArr[n];
        const grandparent = parentArr[parent];

        const parentNode = nodesArray[n].parent;
        const grandparentNode = parentNode.parent;
        

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
        let gp = null;
        let p = parentNode.id;
        parentArr[n] = grandparent;
        if (grandparentNode != null){
          let index = parentNode.children.indexOf(nodesArray[n]);
          parentNode.children.splice(nodesArray[n],1);
          nodesArray[n].parent = grandparentNode;
          gp = grandparentNode.id;
        }
    
        chunker.add(`parent[n] <- parent[parent[n]]`, (vis, n, p, gp) => {
          vis.array.set([N_ARRAY, parentArr], 'unionFind', ' ');
          vis.array.assignVariable('n', N_ARRAY_IDX, n);

          if (gp != null){
            console.log(n, p, gp);
            vis.tree.removeEdge(p.toString(), n.toString());
            vis.tree.addEdge(gp.toString(), n.toString());
            vis.tree.layout();
          }

          vis.array.deselect(PARENT_ARRAY_IDX, parent);
          vis.array.select(PARENT_ARRAY_IDX, n, undefined, undefined, ORANGE);
        },[nodesArray[n].id,p, gp]);
    
      },

    find(chunker, parentArr, n, pathCompression, nodesArray) {

           
        // 'while n != parent[n]'
        let nTempPrev = n;
        
        while (this.notAtRoot(chunker, parentArr, n, nTempPrev)) {    
          
            nTempPrev = n;
          
          chunker.add(`while n != parent[n]`, (vis,n) => {
    
            vis.array.deselect(N_ARRAY_IDX, nTempPrev);
            vis.array.deselect(PARENT_ARRAY_IDX, nTempPrev);
    
            vis.array.select(N_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
            vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
            
            vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, RED);
            vis.tree.leave1(n.toString(),n.toString(),2);
            vis.tree.visit(n.toString(), n.toString());
            
            
          },[nTempPrev]);
          
        if (pathCompression === true) {
            this.shortenPath(chunker, parentArr, nTempPrev, nodesArray);
        }
    
          // 'n <- parent[n]'
          n = parentArr[n];
          chunker.add(`n <- parent[n]`, (vis,nPrev) => {
          
    
            vis.array.deselect(N_ARRAY_IDX, nTempPrev);
            vis.array.deselect(PARENT_ARRAY_IDX, nTempPrev);
    
            vis.array.select(PARENT_ARRAY_IDX, nTempPrev, undefined, undefined, ORANGE);
            vis.tree.leave(n.toString(),n.toString());
            
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

    getNodesArray(treeStruct, orderList) {
      const nodeMap = {};
      const queue = [treeStruct.tree];  // Start with the root
  
      // Populate nodeMap using BFS
      while (queue.length) {
          const current = queue.shift();
          nodeMap[current.id] = current;
          queue.push(...current.children);
      }
  
      // Create the ordered nodesArray using N_GRAPH
      const nodesArray = orderList.map(id => nodeMap[id]);
      
      return nodesArray;
  },
    

    run(chunker, {visualiser, target} ) {

        // Removing rank array:
        let parentElems = visualiser.array.instance.data[1];
        let parentArray = parentElems.map(element => parseInt(element.value, 10));
        parentArray[0] = 'Parent[i]';

        visualiser.array.instance.set([N_ARRAY, parentArray], 'unionFind');
        const value = target.arg1;
        const pathCompression = target.arg2;

        let treeStruct = visualiser.tree.instance.getNTree();
        const nodesArray = this.getNodesArray(treeStruct, N_GRAPH);

        for (let i = 1; i < nodesArray.length; i++) {
          if (nodesArray[i].parent.id === nodesArray[i].id){
            console.log(nodesArray[i].parent.id);
            //visualiser.tree.instance.addSelfLoop(nodesArray[i].id);
          } 
        }

        console.log(nodesArray[1]);


        this.find(chunker, parentArray, value, pathCompression, nodesArray, value);


   }


}