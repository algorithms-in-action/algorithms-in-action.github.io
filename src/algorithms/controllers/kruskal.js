// Prim's MST algorithm; code copied+modified from Dijkstra's shortest
// path algorithm animation
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

  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes}) {
    // String Variables used in displaying algo
    const algNameStr = 'kruskal';
    const dashStr = '-';
    const emptyStr = '';
    const etcStr = '...';
    const minStr = 'Min'; 
    const nStr = 'n';
    const mStr = 'm';
    const totalStrs = ['Cost', 'Tot.', ' = '];
    const infinityStr = '∞';
    const lessThanStr = '<';
    const notLessThanStr = '≮';

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;
    const minCosts = [];
    const parents = [];
    const nodes = [];  
    const findD = [];  
    const selectedD = [];  
    const costD = [];  
    const edgesD = [];  
    const finalCosts = []; 
    const start = startNode - 1; 
    const end = endNodes[0] - 1;
    let totalCost = 0;

    // Display has table [nodes, parents, minCosts, finalCosts]
    // and display code indexes into this table; we define the indices here
    const NODE = 0;
    const PAR = 1;
    const MCOST = 2;
    const FCOST = 3;
    
    // Create a set to keep track of visited vertices
    const visited = new Set();  
    let miniIndex = start;  
    let last = [null, null]; // keep track of the last neighbour we visited
    // initialize each element of array Cost to infinity
    const cost = Array(numVertices).fill(Infinity);

      
    const findMinimum = () => {
      let minCost = Infinity;
      miniIndex = null;
      for (let i = numVertices - 1; i >= 0; i--) {
        if (!visited.has(i) && cost[i] <= minCost) {
          minCost = cost[i];
          miniIndex = i;
        }
      } 
    };

    // If the node cost is a number, the node is in the PQ but not Infinity
    // (can be null, Infinity or some expression for comparison) - used
    // for checking if a node is in the frontier
    const isNumber = (value) =>
    {
       return typeof value === 'number' && isFinite(value);
    }

    // refresh display.  Ideally one would think we could do incremental
    // changes but there are all kinds of subtelties like what triggers
    // re-rendering, some selected colors vanishing with some apparently
    // unrelated operations, etc.  For sanity, and to avoid code thats
    // duplicated countless times, we put lots of it here. And we name
    // the parameters something more readable than x,y,z,z1,a,b,c etc...
    // c_nodes_etc: 2D array with node number, parents etc
    // c_Min: miniIndex
    // c_cV: currentVertex
    // c_m: m (neighbour of currentVertex)
    // c_Total: total cost (at end)
    const refresh = (vis, c_nodes_etc, c_Min, c_cV, c_m, c_Total = null) => {
      vis.array.set(c_nodes_etc, algNameStr);
      // XXX Hack to display total cost near left of array
      // aligned near the left of the array if c_Total != null and
      // room permits; otherwise we set and display n, m, Min as required
      // XXX could do similar for other algorithms to display 'Path'
      // 'Len.' ' = ' ...
      if (c_Total != null && c_nodes_etc[MCOST].length > 3) {
        // vis.array.assignVariable('Tot. Cost', 2, 0); 
        vis.array.assignVariable(totalStrs[0], 2, 0); 
        vis.array.assignVariable(totalStrs[1], 2, 1); 
        vis.array.assignVariable(totalStrs[2], 2, 2); 
        vis.array.assignVariable(c_Total, 2, 3); 
      } else {
        let c_m1 = (c_m === null? null: c_m+1);
        let c_cV1 = (c_cV === null? null: c_cV+1);
        let c_Min1 = (c_Min === null? null: c_Min+1);
        let c_Total1 = (c_Total === null? null: c_Total);
        vis.array.assignVariable(nStr, 2, c_cV1);
        vis.array.assignVariable(mStr, 2, c_m1);
        vis.array.assignVariable(minStr, 2, c_Min1); 
      }

      // highlight nodes as finalised/frontier in array
      for (let i = 0; i < numVertices; i++) {
        if (c_nodes_etc[MCOST][i+1] === null) {
          vis.array.select(NODE, i + 1, NODE, i + 1, colors.FINALISED_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FINALISED_N);
        } else if (isNumber(c_nodes_etc[MCOST][i+1])) {
          vis.array.select(NODE, i + 1, NODE, i + 1, colors.FRONTIER_A);
          vis.graph.removeNodeColor(i);
          vis.graph.colorNode(i, colors.FRONTIER_N);
        }
      }

      // color Min in PQ
      if (c_Min != null)
        vis.array.select(MCOST, c_Min + 1, MCOST, c_Min + 1, colors.PQ_MIN_A);
    }
//////////////////////////////////////////////////////////////////
// START OF KRUSKAL CODE
//////////////////////////////////////////////////////////////////
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

    chunker.add(
      'Kruskal(G)',
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(true);
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
    // let tmp = edges.shift();
    // console.log([tmp.weight, tmp.node1-1, tmp.node2-1]);
    // console.log(edges);
    console.log(nodeSets);
    console.log(ufRank);

    nodes.push('i'); // initialize the display
    findD.push('find(i)');
    selectedD.push('Selected');
    costD.push('Cost');
    edgesD.push('Edges');
     
    // Initialize the table
    for (let i = 0; i < numVertices; i += 1) {
      nodes[i + 1] = i + 1;
      selectedD.push(emptyStr);
      findD.push(emptyStr); 
      costD.push(emptyStr);
      // if there are fewer than numVertices edges, fill with emptyStr
      if (i < edges.length)
        edgesD.push((edges[i].node1+1)+'-'+(edges[i].node2+1));
      else
        edgesD.push(emptyStr);
    }
    // if there are more then numVertices edges, use etcStr at end
    if (edgesD.length > numVertices) {
      edgesD.pop();
      edgesD.push(etcStr);
    }
    

    // XXX split init into more chunks
    chunker.add(
      'initEdges',
      (vis, v) => {
        vis.array.set(v, algNameStr);
      },
      [[nodes, findD, selectedD, costD, edgesD], 0]
    );


    let gsize = numVertices;
    // let selected = []; // set of selected edges (*with weights also*)
    let nselected = 0; // selected.length

    // XXX split init into more chunks?
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
      // recompute findD, edgesD
      for (let i = 1; i <= numVertices; i += 1) {
        findD[i] = (find(nodeSets, i-1)+1) + '';
        // if there are fewer than numVertices edges, fill with emptyStr
        if (i-1 < edges.length)
          edgesD[i] = (edges[i-1].node1+1)+'-'+(edges[i-1].node2+1);
        else
          edgesD[i] = emptyStr;
      }
      // if there are more then numVertices edges, use etcStr at end
      if (edges.length > numVertices) {
        edgesD[numVertices] = etcStr;
      }
      chunker.add(
        'while',
        (vis, v) => {
          vis.array.set(v, algNameStr);
          let nodes = v[0];
          let findD = v[1];
          let selectedD = v[2];
          let costD = v[3];
          let edgesD = v[4];
console.log('In while chunk');
console.log(nodes); console.log(findD); console.log(selectedD); console.log(costD); console.log(edgesD);
        },
        [[nodes, findD, selectedD, costD, edgesD]]
      );

      // test for while loop exit
      if (!(edges.length !== 0 && nselected < gsize - 1)) break;

      let e = edges.shift();
      let n1 = e.node1;
      let n2 = e.node2;

      if (find(nodeSets, n1) != find(nodeSets, n2)) {
        console.log(['selecting', e.weight, e.node1+1, e.node2+1]);
        nselected++;
        selectedD[nselected] = (e.node1+1)+'-'+(e.node2+1)
        costD[nselected] = e.weight;
        union(nodeSets, ufRank, n1, n2);


// XXX put in function
      // recompute findD, edgesD
      for (let i = 1; i <= numVertices; i += 1) {
        findD[i] = (find(nodeSets, i-1)+1) + '';
        // if there are fewer than numVertices edges, fill with emptyStr
        if (i-1 < edges.length)
          edgesD[i] = (edges[i-1].node1+1)+'-'+(edges[i-1].node2+1);
        else
          edgesD[i] = emptyStr;
      }
      // if there are more then numVertices edges, use etcStr at end
      if (edges.length > numVertices) {
        edgesD[numVertices] = etcStr;
      }

        chunker.add(
          'addSelected',
          (vis, v, c_n1, c_n2) => {
            vis.array.set(v, algNameStr);
            // vis.graph.removeEdgeColor(n1, n2);
            vis.graph.colorEdge(n1, n2, colors.SUCCESS_E);
          },
          [[nodes, findD, selectedD, costD, edgesD], n1, n2]
        );
      }
    }

  }, 

};
