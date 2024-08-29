// Prim's MST algorithm; code copied+modified from Dijkstra's shortest
// path algorithm animation (might some junk code left over)
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import {colors} from './graphSearchColours';

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('graph', null, 'Graph view'),
        order: 0,
      },
      array: {
        instance: new Array2DTracer('array', null, 'Parent array & Priority Queue'),
        order: 1,
      },
    };
  },

  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes, moveNode}) {
    // String Variables used in displaying algo
    const algNameStr = 'kruskal';
    const etcStr = '...';
    const totalStrs = ['Cost', 'Tot.', ' = '];

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;
    const nodes = [];  
    const findD = [];  
    const selectedD = [];  
    const costD = [];  
    const edgesD = [];  
    const finalCosts = []; 

    // Display has table [i, find(i),...]
    // and display code indexes into this table; we define the indices here
    const NODE = 0;
    const FIND = 1;
    const SELECTED = 2;
    const COST = 3;
    const EDGES = 4;

  /**
   * Finds the root of the current node.
   * @param {Array} ufParent The parent array.
   * @param n The element to find.
   * @returns {number} The root of the current node.
   */
  const find = (ufParent, n) => {
    while (ufParent[n] != n) {
      ufParent[n] = ufParent[ufParent[n]]; // shorten path
      n = ufParent[n];
    }
    return n;
  }

  /**
   * Union two nodes together.
   * @param {Array} ufParent the parent array.
   * @param {Array} ufRank the rank array.
   * @param {Number} n the first node to union.
   * @param {Number} m the second node to union.
   */
  const union = (ufParent, ufRank, n, m) => {

    // finding representative of first node
    let root1 = find(ufParent, n);
    // finding representative of second node
    let root2 = find(ufParent, m);

    // if in same set, return
    if (root1 === root2) {
      return;
    }

    if (ufRank[root1] > ufRank[root2]) {
      // swap n and m so smaller subtree is joined to larger
      const tempRoot1 = root1;
      root1 = root2;
      root2 = tempRoot1;
    }
    // joining the two nodes
    ufParent[root1] = root2;
    // updating rank
    if (ufRank[root1] == ufRank[root2]) {
      ufRank[root2] += 1;
      ufRank[root1] = null;
    } else {
      ufRank[root1] = null;
    }
  }

  // recompute findD, edgesD
  const setfindDedgesD = () => {
      for (let i = 1; i <= numVertices; i += 1) {
        findD[i] = (find(nodeSets, i-1)+1); // + '';
        // if there are fewer than numVertices edges, fill with ''
        if (i-1 < edges.length)
          edgesD[i] = (edges[i-1].node1+1)+'-'+(edges[i-1].node2+1);
        else
          edgesD[i] = '';
      }
      // if there are more then numVertices edges, use etcStr at end
      if (edges.length > numVertices) {
        edgesD[numVertices] = etcStr;
      }
  }

    ////////////// start of animation
    chunker.add(
      'Kruskal(G)',
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
        vis.graph.moveNodeFn(moveNode);
        vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
      },
      [E, coords]
    );

    // init edges + Union-find parent+rank arrays
    let edges = [];    // sorted array of edges (*with weights also*)
    let nodeSets = []; // parents for UF
    let ufRank = [];   // ranks for UF
    for (let i = 0; i < numVertices; i += 1) {
      nodeSets.push(i);  // nodeSets[i] = i
      ufRank.push(0);    // ufRank[i] = 0
      for (let j = 0; j < numVertices; j += 1) {
        if (E[i][j] > 0 && i < j) // avoid duplicated edges a-b & b-a
          edges.push({weight: E[i][j], node1:i, node2:j})
      }
    }
    edges.sort((a, b) => a.weight - b.weight);

    nodes.push('i'); // initialize the display
    findD.push('find(i)');
    selectedD.push('Selected');
    costD.push('Cost');
    edgesD.push('Edges');
     
    // Initialize the table
    for (let i = 0; i < numVertices; i += 1) {
      nodes[i + 1] = i + 1;
      selectedD.push('');
      findD.push(''); 
      costD.push('');
      // if there are fewer than numVertices edges, fill with ''
      if (i < edges.length)
        edgesD.push((edges[i].node1+1)+'-'+(edges[i].node2+1));
      else
        edgesD.push('');
    }
    // if there are more then numVertices edges, use etcStr at end
    if (edgesD.length > numVertices) {
      edgesD.pop();
      edgesD.push(etcStr);
    }
    

    chunker.add(
      'initEdges',
      (vis, v) => {
        vis.array.set(v, algNameStr);
      },
      [[nodes, findD, selectedD, costD, edgesD], 0]
    );

    // no change in animation but we stop for line of code
    chunker.add(
      'SelectedEmpty',
      (vis, v) => {
      },
      [[nodes, findD, selectedD, costD, edgesD], 0]
    );


    let gsize = numVertices;
    // let selected = []; // set of selected edges (*with weights also*)
    let nselected = 0; // selected.length

    // Fill table
    for (let i = 1; i <= numVertices; i += 1) {
      findD[i] = find(nodeSets, i-1)+1;
    }
    chunker.add(
      'initNodeSets',
      (vis, v) => {
        vis.array.set(v, algNameStr);
      },
      [[nodes, findD, selectedD, costD, edgesD], 0]
    );


    // while edges !== [] && nselected < gsize - 1
    // extra chunk before break to make loop termination clearer
    /* eslint-disable no-constant-condition */
    while (true) {
      setfindDedgesD();
      if (edges.length > numVertices) {
        edgesD[numVertices] = etcStr;
      }
      chunker.add(
        'while',
        (vis, v, c_sel) => {
          vis.array.set(v, algNameStr);
            // unhighlight all nodes
            for (let i = 0; i < numVertices; i++) {
              vis.graph.removeNodeColor(i);
            }
          if (c_sel < gsize - 1)
            vis.array.select(EDGES, 1, EDGES, 1, colors.FRONTIER_A);
          else
            vis.array.select(SELECTED, 0, SELECTED, 0, colors.FRONTIER_A);
        },
        [[nodes, findD, selectedD, costD, edgesD], nselected]
      );

      // test for while loop exit
      if (!(edges.length !== 0 && nselected < gsize - 1)) break;

      let e = edges.shift();
      let n1 = e.node1;
      let n2 = e.node2;
      setfindDedgesD();

      // highlight the two nodes, the edge and the tree(s).
      // Use findD rather than find - fast and avoids any
      // side-effects of find (find should be ok also)
      chunker.add(
        'RemoveMin',
        (vis, v, c_n1, c_n2) => {
          vis.array.set(v, algNameStr);
          // vis.array.select(EDGES, 1, EDGES, 1, colors.FRONTIER_A);
          vis.graph.colorEdge(c_n1, c_n2, colors.FRONTIER_E);
          vis.array.select(NODE, c_n1 + 1, NODE, c_n1 + 1, colors.FRONTIER_A);
          // highlight all nodes connected to n1 by selected edges
          for (let i = 0; i < numVertices; i++) {
            if (v[FIND][i+1] === v[FIND][c_n1+1]) {
              vis.graph.removeNodeColor(i);
              vis.graph.colorNode(i, colors.FRONTIER_N);
            }
          }
          // same for n2, if n1 and n2 are not connected
          if (v[FIND][c_n1+1] !== v[FIND][c_n2+1]) {
            for (let i = 0; i < numVertices; i++) {
              if (v[FIND][i+1] === v[FIND][c_n2+1]) {
                vis.graph.removeNodeColor(i);
                vis.graph.colorNode(i, colors.FINALISED_N);
              }
            }
            vis.array.select(NODE, c_n2 + 1, NODE, c_n2 + 1, colors.FINALISED_A);
          } else {
            // highlight n2 with same color as n1
            vis.array.select(NODE, c_n2 + 1, NODE, c_n2 + 1, colors.FRONTIER_A);
          }
        },
        [[nodes, findD, selectedD, costD, edgesD], n1, n2]
      );

      // highlight find array (XXX possibly skip if not expanded)
      chunker.add(
        'DifferentTrees',
        (vis, v, c_n1, c_n2) => {
          vis.array.set(v, algNameStr);
          vis.array.select(NODE, c_n1 + 1, NODE, c_n1 + 1, colors.FRONTIER_A);
          vis.array.select(FIND, c_n1 + 1, FIND, c_n1 + 1, colors.FRONTIER_A);
          // highlight all nodes connected to n1 by selected edges
          for (let i = 0; i < numVertices; i++) {
            if (v[FIND][i+1] === v[FIND][c_n1+1]) {
              vis.graph.removeNodeColor(i);
              vis.graph.colorNode(i, colors.FRONTIER_N);
            }
          }
          // same for n2, if n1 and n2 are not connected
          if (v[FIND][c_n1+1] !== v[FIND][c_n2+1]) {
            for (let i = 0; i < numVertices; i++) {
              if (v[FIND][i+1] === v[FIND][c_n2+1]) {
                vis.graph.removeNodeColor(i);
                vis.graph.colorNode(i, colors.FINALISED_N);
              }
            }
            vis.array.select(NODE, c_n2 + 1, NODE, c_n2 + 1, colors.FINALISED_A);
            vis.array.select(FIND, c_n2 + 1, FIND, c_n2 + 1, colors.FINALISED_A);
          } else {
            // highlight n2 with same color as n1
            vis.array.select(NODE, c_n2 + 1, NODE, c_n2 + 1, colors.FRONTIER_A);
            vis.array.select(FIND, c_n2 + 1, FIND, c_n2 + 1, colors.FRONTIER_A);
          }
        },
        [[nodes, findD, selectedD, costD, edgesD], n1, n2]
      );


     

      if (find(nodeSets, n1) != find(nodeSets, n2)) {
        nselected++;
        selectedD[nselected] = (e.node1+1)+'-'+(e.node2+1)
        costD[nselected] = e.weight;

        setfindDedgesD();
        chunker.add(
          'addSelected',
          (vis, v, c_n1, c_n2, c_sel) => {
            vis.array.set(v, algNameStr);
            vis.array.select(NODE, c_n1 + 1, NODE, c_n1 + 1, colors.FRONTIER_A);
            vis.array.select(FIND, c_n1 + 1, FIND, c_n1 + 1, colors.FRONTIER_A);
            vis.array.select(NODE, c_n2 + 1, NODE, c_n2 + 1, colors.FINALISED_A);
            vis.array.select(FIND, c_n2 + 1, FIND, c_n2 + 1, colors.FINALISED_A);
            vis.array.select(COST, c_sel, COST, c_sel, colors.FRONTIER_A);
            vis.array.select(SELECTED, c_sel, SELECTED, c_sel, colors.FRONTIER_A);
            // unhighlight all nodes
            for (let i = 0; i < numVertices; i++) {
              vis.graph.removeNodeColor(i);
            }
            vis.graph.removeEdgeColor(n1, n2);
            vis.graph.colorEdge(n1, n2, colors.SUCCESS_E);
          },
          [[nodes, findD, selectedD, costD, edgesD], n1, n2, nselected]
        );

        union(nodeSets, ufRank, n1, n2);
        setfindDedgesD();
        chunker.add(
          'union',
          (vis, v, c_n1, c_n2) => {
            vis.array.set(v, algNameStr);
            vis.array.select(NODE, c_n1 + 1, NODE, c_n1 + 1, colors.FRONTIER_A);
            vis.array.select(NODE, c_n2 + 1, NODE, c_n2 + 1, colors.FRONTIER_A);
            vis.array.select(FIND, c_n1 + 1, FIND, c_n1 + 1, colors.FRONTIER_A);
            vis.array.select(FIND, c_n2 + 1, FIND, c_n2 + 1, colors.FRONTIER_A);
          },
          [[nodes, findD, selectedD, costD, edgesD], n1, n2]
        );
      }
    }
    // compute total cost and finish
    chunker.add(
      'return',
      (vis, v, c_sel) => {
        vis.array.set(v, algNameStr);
        let totCost = 0;
        for (let i = 1; i <= c_sel; i++) {
          totCost += v[COST][i];
        }
        vis.array.assignVariable(totalStrs[0], 2, 0);
        vis.array.assignVariable(totalStrs[1], 2, 1);
        vis.array.assignVariable(totalStrs[2], 2, 2);
        vis.array.assignVariable(totCost, 2, 3);
      },
      [[nodes, findD, selectedD, costD, edgesD], nselected]
    );

  }, 

};
