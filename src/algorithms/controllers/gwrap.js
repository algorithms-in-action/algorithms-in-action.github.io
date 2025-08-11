// Gift wrapping convex hull algorithm (based on DFSrec)
// but code is simpler and has different structure of course.
// XXX iterative version ends up with fewer "fontier" edges because if
// you add the node to the frontier again, the previous edge reverts - that
// should probably be changed??  Not sure about BFS etc
// Copied and modified from dijkstra.js (nicer code than DFS)
// Might be some leftover bit from dijkstra.js that could be cleaned up
// further.
// XXX add support for multiple end nodes
import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';
import {colorsCH} from './convexHullColours';
import {colors} from './graphSearchColours'; // XX

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('graph', null, 'Graph view'),
        order: 0,
      },
    };
  },

  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes, moveNode}) {
    // String Variables used in displaying algo
    const algNameStr = 'DFSrec';
    const nStr = 'n';
    const mStr = 'm';

    const E = [...edgeValueMatrix];
    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;
    const unassigned = ' '; // unassigned parent
    const parents = []; // parent of each node; initially unassigned
    const seen = []; // neighbours of finalised node
    const nodes = [];  
    const start = startNode - 1; 
    const end = endNodes[0] - 1;

    // Javascript to find convex hull of a set of coords. Refer 
    // https://www.geeksforgeeks.org/dsa/orientation-3-ordered-coords/
    // for explanation of orientation()
    // This code is contributed by avanitrachhadiya2155
    // Modified by Lee Naish
    
    // Coordinates are represented by [X, Y] arrays; define constants
    // for the indices
    let X = 0;
    let Y = 1;
    
    // constants for colinear/Clockwise/Counterclockwise
    let GoStraight = 0;
    let GoClockwise = 1;
    let GoCounterCW = 2;
    
    // To find orientation of ordered triplet (p, q, r).
        // The function returns following values
        // GoStraight --> p, q and r are colinear
        // GoClockwise --> Clockwise
        // GoCounterCW --> Counterclockwise
    function orientation(p, q, r)
    {
        let val = (q[Y] - p[Y]) * (r[X] - q[X]) - (q[X] - p[X]) * (r[Y] - q[Y]);
        if (val == 0) return GoStraight;
        return (val > 0)? GoClockwise: GoCounterCW;
    }

    // checks if hull (h) has consecutive elements p,q (or q,p)
    // (ie, an edge between the two has been added)
    function includesConsecutive(h, p, q)
    {
        for (let i = 0; i < h.length; i++) {
          if (h[i] === p & h[i+1] === q) return true;
          if (h[i] === q & h[i+1] === p) return true;
        }
        return false;
    }
    
    // Prints convex hull of a set of n coords.
    function convexHull(coords, n, E)
    {
        // There must be at least 3 coords
        // XXX highlight all
        if (n < 3) return;
       
        // Initialize Result
        let hull = [];
       
        // Find the leftmost point
        let l = 0;
        for (let i = 1; i < n; i++)
            if (coords[i][X] < coords[l][X])
                l = i;
            // XXX if there are 2 coords with minimal x value it doesn't
            // matter which we pick. If there are 3 such coords then
            // potentially it may make a difference. We may be fussy about
            // what hull we should return with colinear coords. Also the
            // termination condition and code for finding the next point
            // interracts with this - potentially the next point code could
            // miss the point chosen here (and choose a colinear one
            // instead), causing a loop.
            // Here we break ties by picking the min y coordinate value
            // Delete the else below to get the first minimal point and
            // change < to <= to get the last
            else if (coords[i][X] === coords[l][X] && coords[i][Y] < coords[l][Y])
                l = i;
       
        // Start from (lowest) leftmost point, keep moving 
        // clockwise until reach the start point
        // again. This loop runs O(h) times where h is
        // number of coords in result or output.
        let p = l, q;
        chunker.add(
          'start',
          (vis, edgeArray, coordsArray, c_p, c_q) => {
            // XXX Graph too big and too far left...
            // vis.graph.setZoom(0.5);
            vis.graph.colorNode(c_p, colorsCH.HULLP_N);
            vis.graph.addEdge('W', c_p);
            vis.graph.colorEdge(c_p, 'W', colorsCH.HULL_E);
          },
          [E, coords, p, q], 0
        );
        do
        {
        
            // Add current point to result
            hull.push(p);
            
            // console.log("(" + coords[p][X] + ", " + coords[p][Y] + ")", hull);
       
            // Search for a point 'q' such that 
            // orientation(p, q, x) is clockwise
            // for all coords 'x'. The idea is to keep 
            // track of last visited most clock-
            // wise point in q. If any point 'i' is more 
            // clock-wise than q, then update q.
            // XXX above NQR with colinear coords on hull
            // want q s.t. for no i, p->i->q is clockwise
            q = (p + 1) % n;
              
            chunker.add('start',
              (vis, edgeArray, coordsArray, c_p, c_q) => {
                vis.graph.colorNode(c_q, colorsCH.NEXTQ_N);
              },
              [E, coords, p, q], 0
            );
            let hullHasQ, hullHasI, hullHasPQ, hullHasQI;
            hullHasQ = hull.includes(q);
            hullHasPQ = includesConsecutive(hull, p, q);
            for (let i = 0; i < n; i++)
            {
              hullHasI = hull.includes(i);
              hullHasQI = includesConsecutive(hull, i, q);
              let old_q = q;
              // If i is more clockwise than
              // current q, then update q
              if (orientation(coords[p], coords[i], coords[q]) == GoClockwise) {
                // XXX see comment above re choice of first point in
                // colinear case
                // Here, if there are multiple coords with minimal
                // clockwiseness (if thats a word), we pick the first one
                // (min point number)
                chunker.add('start',
                  (vis, edgeArray, coordsArray, c_p, c_q, c_i) => {
                    vis.graph.addEdge(c_p, c_q);
                    vis.graph.addEdge(c_q, c_i);
                    vis.graph.colorEdge(c_p, c_q, colorsCH.CLOCKWISE_E);
                    vis.graph.colorEdge(c_q, c_i, colorsCH.CLOCKWISE_E);
                  },
                  [E, coords, p, q, i], 0
                );
                chunker.add('start',
                  (vis, edgeArray, coordsArray, c_p, c_q, c_i, h_q) => {
                    vis.graph.colorNode(c_i, colorsCH.NEXTQ_N);
                    if (h_q)
                      vis.graph.colorNode(c_q, colorsCH.HULLP_N);
                    else
                      vis.graph.removeNodeColor(c_q);
                  },
                  [E, coords, p, q, i, hullHasQ], 0
                );
                q = i;
                // defer recalculation of hullHasQ, hullHasPQ - we want
                // them to refere to the old version of q for now
              } else {
                chunker.add('start',
                  (vis, edgeArray, coordsArray, c_p, c_q, c_i) => {
                    vis.graph.addEdge(c_p, c_q);
                    vis.graph.addEdge(c_q, c_i);
                    vis.graph.colorEdge(c_p, c_q, colorsCH.ANTICLOCK_E);
                    vis.graph.colorEdge(c_q, c_i, colorsCH.ANTICLOCK_E);
                  },
                  [E, coords, p, q, i], 0
                );
              }
              chunker.add('start',
                (vis, edgeArray, coordsArray, c_p, c_q, c_i, h_pq, h_qi) => {
                  if (h_pq)
                    vis.graph.colorEdge(c_p, c_q, colorsCH.HULL_E);
                  else
                    vis.graph.removeEdge(c_p, c_q);
                  if (h_qi)
                    vis.graph.colorEdge(c_q, c_i, colorsCH.HULL_E);
                  else
                    vis.graph.removeEdge(c_q, c_i);
                },
                [E, coords, p, old_q, i, hullHasPQ, hullHasQI], 0
              );
              // now update hullHasQ, hullHasPQ in case q changed above
              hullHasQ = hull.includes(q);
              hullHasPQ = includesConsecutive(hull, p, q);
            }
       
            chunker.add( 'start',
              (vis, edgeArray, coordsArray, c_p, c_q) => {
                // Nice to do this in a couple of steps if possile
                // Move wrapper close then final position with node
                // colour change?
                vis.graph.addEdge(c_p, c_q);
                vis.graph.colorEdge(c_p, c_q, colorsCH.HULL_E);
                vis.graph.colorNode(c_q, colorsCH.HULLP_N);
                // redo "wrapping" edge
                vis.graph.removeEdge(c_p, 'W');
                vis.graph.addEdge('W', c_q);
                vis.graph.colorEdge(c_q, 'W', colorsCH.HULL_E);
                let [pX, pY] = vis.graph.getNodePosition(c_p);
                let [qX, qY] = vis.graph.getNodePosition(c_q);
                let wX = qX + 5 * (qX - pX); // XXX
                let wY = qY + 5 * (qY - pY);
                vis.graph.setNodePosition('W', wX, wY);
              },
              [E, coords, p, q], 0
            );
            // Now q is the most clockwise with
            // respect to p. Set p as q for next iteration, 
            // so that q is added to result 'hull'
            p = q;
       
        } while (p != l);  // While we don't come to first 
                           // point
        // console.log("Reached (" + coords[p][X] + ", " + coords[p][Y] + ") again");
        chunker.add( 'start',
          (vis, edgeArray, coordsArray, c_p, c_q) => {
            vis.graph.removeEdge(c_p, 'W');
            vis.graph.removeNode('W');
          },
          [E, coords, p, q], 0
        );
       
        // Print Result
        // for (let temp of hull.values())
            // console.log("(" + temp[X] + ", " + temp[Y] + ")");
    }
    
    /* Driver program to test above function */
/*
    let coords = new Array(7);
    // coords[0] = new Point(0, 3);
    coords[0] = new Point(0, 1);
    coords[1] = new Point(2, 3);
    // coords[1] = new Point(2, 3);
    coords[2] = new Point(1, 1);
    coords[3] = new Point(2, 1);
    coords[4] = new Point(3, 0);
    coords[5] = new Point(0, 0);
    coords[6] = new Point(0, 2);
    
    let n = coords.length;
    convexHull(coords, n);
*/
    
    

    chunker.add(
      'start',
      (vis, edgeArray, coordsArray) => {
        vis.graph.directed(false);
        vis.graph.weighted(false);
        vis.graph.moveNodeFn(moveNode);
        vis.graph.dimensions.defaultNodeRadius = 15;
        vis.graph.dimensions.nodeRadius = 15;
        vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
        // vis.graph.edges = []
        // Add special node a long way away for "wrapper"
        vis.graph.addNode('W', 'W');
        vis.graph.setNodePosition('W', 10, -900);
      },
      [E, coords], 0
    );

    convexHull(coords, coords.length, E);

  }
  , 

};
