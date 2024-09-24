// DO NOT MERGE TO OTHER BRANCHES!
// This is a hacked version of the BST insertion code to play around with
// node rotations for AVL trees and the like.  It simpler to smash the BST
// code than create a new algorithm and the AVL tree code isn't in the main
// repo yet.

/* eslint-disable no-plusplus */
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array1DTracer from '../../components/DataStructures/Array/Array1DTracer';

export default {
  initVisualisers() {
    return {
      array: {
        instance: new Array1DTracer('array', null, 'Keys to insert', { arrayItemMagnitudes: true }),
        order: 0,
      },
      graph: {
        instance: new GraphTracer('bst', null, 'Binary tree'),
        order: 1,
      },
    };
  },

  /**
   *
   * @param {object} chunker
   * @param {array} nodes array of numbers needs to be inserted
   */
  run(chunker, { nodes }) {
    if (nodes.length === 0) return;
    let parent;
    let prev = null;
    let visitedList = [null];
    const tree = {};
    const root = nodes[0];
    tree[root] = {};

    // populate the ArrayTracer using nodes
    chunker.add(
      '1',
      (vis, elements) => {
        vis.array.set(elements);
        // vis.array.select(0); // the index of root element is 0
      },
      [nodes],
    );
    chunker.add('1', (vis) => {
      vis.array.select(0); // the index of root element is 0
    });
    chunker.add(2);
    chunker.add(
      3,
      (vis, r) => {
        vis.graph.addNode(r);
        vis.graph.layoutBST(r, true);
        vis.graph.select(r, null);
      },
      [root],
    );
    chunker.add(4);
    chunker.add(5);
    chunker.add(6);
    chunker.add(7);
    chunker.add(8);
    for (let i = 1; i < nodes.length; i++) {
      chunker.add(
        2,
        (vis, index, visited) => {
          vis.array.deselect(index - 1);
          vis.array.select(index);
          for (let j = 1; j < visited.length; j++) {
            vis.graph.leave(visited[j], visited[j - 1]);
          }
          if (nodes[index - 1] !== visited[visited.length - 1]) {
            vis.graph.deselect(nodes[index - 1], visited[visited.length - 1]);
          }
        },
        [i, visitedList],
      );
      visitedList = [null];
      const element = nodes[i];
      chunker.add(3);
      chunker.add(4);
      chunker.add(5);
      chunker.add(6);
      chunker.add(7);
      chunker.add(13);
      let ptr = tree;
      parent = root;
      while (ptr) {
// messing around with right rotation code
// Code not great, and insertion is broken etc but demonstrates the
// basic idea of incrementally moving the nodes around and rearranging
// pointers. Minor mods to src/components/DataStructures/Graph/GraphTracer.js
// to support this
// Sample input: 60,30,40,20,10,25,5 - see what happend with insert 5
// rightRotate(t6)
//   t2 <- left(t6)
//   t4 <- right(t2)
//   t2.right <- t6
//   t6.left <- t4
//   return (pointer to) t2 // new root
if (prev != null
    && tree[parent].left !== undefined
    && tree[parent].right !== undefined
    && tree[tree[parent].left].left !== undefined // not needed
    && tree[tree[parent].left].right !== undefined // not needed
   ) {
// rightRotate(t6)
  let t6 = parent;
  chunker.add('RotateR1', (vis, t, tt6) => {
      console.log([t[tt6].left, tt6, t]);
      vis.graph.setPointerNode(tt6, 't6');
      vis.graph.select(tt6, null);
      vis.graph.select(t[tt6].left, null);
    }, [tree, t6]);
//   t2 <- left(t6)
  let t2 = tree[t6].left;
  chunker.add('RotateR2', (vis, t, tt6, tt2) => {
      vis.graph.setPointerNode(tt2, 't2');
      vis.graph.removeEdge(tt2, tt2.right);
      console.log([tt2, tt6, t]);
      let pNode = vis.graph.findNode(tt6);
      let lNode = vis.graph.findNode(tt2);
      let newY = (pNode.y+lNode.y)/2;
      vis.graph.setNodePosition(tt6, pNode.x, newY);
      vis.graph.setNodePosition(tt2, lNode.x, newY);
    }, [tree, t6, t2]);
//   t4 <- right(t2)
  let t4 = tree[t2].right;
  chunker.add('RotateR3', (vis, t, tt6, tt2, tt4) => {
      vis.graph.setPointerNode(tt4, 't4');
      let pNode = vis.graph.findNode(tt6);
      let lNode = vis.graph.findNode(tt2);
      let rNode = vis.graph.findNode(t[tt6].right);
      // let newXp = (pNode.+lNode.y)/2;
      let newY = (pNode.y+lNode.y)/2; // positions reset somewhere???
      vis.graph.setNodePosition(tt6, pNode.x, newY);
      // vis.graph.setNodePosition(tt2, lNode.x, pNode.y);
      console.log(['x-y 1', lNode.x, lNode.y]);
      vis.graph.setPauseLayout(true);
      vis.graph.setNodePosition(tt2, (lNode.x*2+pNode.x)/3, pNode.y+lNode.y-rNode.y);
      // vis.graph.setNodePosition(tt6, pNode.x+15, pNode.y);
    }, [tree, t6, t2, t4]);
//   t2.right <- t6
  chunker.add('RotateR4', (vis, t, tt2, tt6, tt4) => {
      vis.graph.removeEdge(tt6, tt2);
      let lNode = vis.graph.findNode(tt2);
      console.log(['x-y 1', lNode.x, lNode.y]);
      vis.graph.removeEdge(tt2, tt4);
      vis.graph.addEdge(tt2, tt6);
      let pNode = vis.graph.findNode(tt6);
      lNode = vis.graph.findNode(tt2);
      console.log(['x-y 2', lNode.id, lNode.x, lNode.y]);
      let newY = (pNode.y+lNode.y)/2; // positions reset somewhere???
      // vis.graph.setNodePosition(tt2, lNode.x, pNode.y);
    }, [tree, t2, t6, t4]);
  chunker.add('RotateR5', (vis, t, tt2, tt6, tt4) => {
      let lNode = vis.graph.findNode(tt2);
      console.log(['x-y 1', lNode.id, lNode.x, lNode.y]);
      vis.graph.addEdge(tt6, tt4);
      // vis.graph.removeEdge(tt6, tt2);
      let pNode = vis.graph.findNode(tt6);
      lNode = vis.graph.findNode(tt2);
      console.log(['x-y 2', lNode.id, lNode.x, lNode.y]);
      let newY = (pNode.y+lNode.y)/2; // positions reset somewhere???
      // vis.graph.setNodePosition(tt2, lNode.x, pNode.y);
    }, [tree, t2, t6, t4]);
//   t6.left <- t4
  // chunker.add('RotateR5', (vis, t, tt2, tt6, tt4) => {
    // }, [tree, t2, t6, t4]);
//   return (pointer to) t2 // new root
  chunker.add('RotateR6', (vis, t, pprev, tt6, tt2) => {
      vis.graph.removeEdge(pprev, tt6);
      vis.graph.addEdge(pprev, tt2);
    }, [tree, prev, t6, t2]);
  chunker.add('RotateR6', (vis, t, pprev, tt6, tt2) => {
      vis.graph.setPauseLayout(false);
      vis.graph.layout();
    }, [tree, prev, t6, t2]);
}
/////////////////////////////////// end of rotate stuff

        visitedList.push(parent);
        chunker.add(14, (vis, c, p) => vis.graph.visit(c, p), [parent, prev]);
        chunker.add(15);
        if (element < parent) {
          chunker.add(16);
          chunker.add(18);
          if (tree[parent].left !== undefined) {
            // if current node has left child
            prev = parent;
            parent = tree[parent].left;
            ptr = tree[parent];
          } else {
            chunker.add(9);
            tree[parent].left = element;
            tree[element] = {};
            chunker.add(
              10,
              (vis, e, p) => {
                vis.graph.addNode(e);
                vis.graph.addEdge(p, e);
                vis.graph.select(e, p);
              },
              [element, parent],
            );
            break;
          }
        } else if (element > parent) {
          chunker.add(17);
          chunker.add(18);
          if (tree[parent].right !== undefined) {
            // if current node has right child
            prev = parent;
            parent = tree[parent].right;
            ptr = tree[parent];
          } else {
            chunker.add(9);
            tree[parent].right = element;
            tree[element] = {};
            chunker.add(
              11,
              (vis, e, p) => {
                vis.graph.addNode(e);
                vis.graph.addEdge(p, e);
                vis.graph.select(e, p);
              },
              [element, parent],
            );
            break;
          }
        } else {
          break;
        }
      }
    }
    // deselect the last element in the array
    chunker.add(
      2,
      (vis, index, visited) => {
        vis.array.deselect(index);
        for (let j = 1; j < visited.length; j++) {
          vis.graph.leave(visited[j], visited[j - 1]);
        }
        if (nodes[index] !== visited[visited.length - 1]) {
          vis.graph.deselect(nodes[index], visited[visited.length - 1]);
        }
      },
      [nodes.length - 1, visitedList],
    );
    // for test
    // eslint-disable-next-line consistent-return
    return tree;
  },
};
