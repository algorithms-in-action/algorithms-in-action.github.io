// Gift wrapping convex hull algorithm
// 
// XXX Based on DFSrec - may still be some leftover rubbish to delete.
// 
// XXX Uses EuclideanMatrixParams; need to make some changes to this:
// 1) The graphs here (initially at least) have no edges - need to change
// graph generation and adjust display accordingly. Probably best to
// have a noEdges option like we have weighted and directed as options.
// 2) The initial display is too big (and too far left) - other
// algorithms have an array display also and this affects zoom etc. Need
// to fix this display without breaking other algorithms (code seems a
// bit messy).
// 
// XXX Partially linked to pseudocode (may need more bookmarks/change
// the bookmarks in this controller code); also will need to animate a
// few more things.
// 
// XXX Currently the "wrapper" uses an edge to a node that is off the
// screen, usually. It should be off the screen always - need to work
// more on node position. If the user zooms out it is currently visible
// - that should be OK. It would be nice if moving the wrapper was done
// more smoothly.  Currently tweening only really works for nodes, not
// edges - if this couls be fixed it would be useful for AVL trees and
// other algorithms also.  Otherwise, perhaps the wrapper could be moved
// in two steps at least - the first being close to the next node and
// the second being at the next node. Or maybe the wrapper edge could
// look a bit different from the hull edges (not too different) so the
// wrapper could go through the next node at the first step then the new
// hull edge could change a bit.
//
// XXX Maybe p,q,i should be shown explicitly - currently they are all
// implicit using edges, colors etc (should at least color node i)
// 
// XXX Nice to have an option of removing all points in a quadralateral
// made up of lef, top, right and bottom points. See union-find for an
// example of such an option.  Need to fix up pseudocode for this (some
// work has been done). Probably best not give too many details in code
// or animation - mode details in explanation and/or MORE tab.
// 
// XXX a bunch more other stuff mentioned in code below
// 
// XXX Color stuff with graphs is a bit of a mess - this is a Global
// Issue to be worked in separately - communication about this and how
// merge conflicts are handed may be needed

import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import {colorsCH} from './convexHullColours';

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('graph', null, 'Points'),
        order: 0,
      },
    };
  },

  // XXX don't need startNode, endNodes, edgeValueMatrix
  // Nest parameter code(?)
  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes, moveNode}) {
    // String Variables used in displaying algo

    // id for wrapper node - could be anything other than a small
    // integer; '@' looks a bit like a roll of paper/string...
    // It's not normally visible but may be found if someone searches
    const wrapperStr = '@';

    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;
    // const E = [...edgeValueMatrix];
    // edge matrix is NxN matrix of edge weights, zero meaning no edge
    // Here we ignore edgeValueMatrix and create our own zero matrix
    const Zeros = new Array(numVertices).fill(0);
    const E = new Array(numVertices).fill(Zeros);

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
        chunker.add(
          'start',
          (vis, edgeArray, coordsArray) => {
            vis.graph.directed(false);
            vis.graph.weighted(false);
            vis.graph.moveNodeFn(moveNode);
            vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
            vis.graph.dimensions.defaultNodeRadius = 15;
            vis.graph.dimensions.nodeRadius = 15;
            vis.graph.setZoom(0.6);
         },
          [E, coords], 0
        );

        // There must be at least 3 coords
        // XXX highlight all here if n < 3
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
        let p = l, q, prevP;
        chunker.add(
          'initP',
          (vis, edgeArray, coordsArray, c_p, c_q) => {
            // Add special node a long way away for "wrapper"
            vis.graph.addNode(wrapperStr, wrapperStr);
            vis.graph.setNodePosition(wrapperStr, 10, -2000);
            vis.graph.colorNode(c_p, colorsCH.NEXTQ_N);
            vis.graph.addEdge(wrapperStr, c_p);
            vis.graph.colorEdge(c_p, wrapperStr, colorsCH.HULL_E);
          },
          [E, coords, p, q], 0
        );
        do
        {
        
            chunker.add('addP',
              (vis, edgeArray, coordsArray, c_pp, c_p) => {
                vis.graph.colorNode(c_p, colorsCH.HULLP_N);
                // Nice to do this in a couple of steps if possible
                // Move wrapper close then final position with node
                // colour change?
                if (c_pp) { // first time around c_pp is undefined
                  vis.graph.addEdge(c_pp, c_p);
                  vis.graph.colorEdge(c_pp, c_p, colorsCH.HULL_E);
                  vis.graph.colorNode(c_p, colorsCH.HULLP_N);
                  // redo "wrapping" edge
                  vis.graph.removeEdge(c_pp, wrapperStr);
                  vis.graph.addEdge(wrapperStr, c_p);
                  vis.graph.colorEdge(c_p, wrapperStr, colorsCH.HULL_E);
                  let [pX, pY] = vis.graph.getNodePosition(c_pp);
                  let [qX, qY] = vis.graph.getNodePosition(c_p);
                  // XXX wrapper position should be colinear but far away
                  // Currently if p and q are close, wrapper may be too
                  // close; also need to consider case where p=q...?
                  let wX = qX + 50 * (qX - pX);
                  let wY = qY + 50 * (qY - pY);
                  vis.graph.setNodePosition(wrapperStr, wX, wY);
                }
              },
              [E, coords, prevP, p], 0
            );
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
              
            chunker.add('initQ',
              (vis, edgeArray, coordsArray, c_p, c_q) => {
                vis.graph.colorNode(c_q, colorsCH.NEXTQ_N);
              },
              [E, coords, p, q], 0
            );
            let hullHasQ, hullHasI, hullHasPI, hullHasQI;
            hullHasQ = hull.includes(q);
            chunker.add('assignI');
            for (let i = 0; i < n; i++)
            {
              hullHasI = hull.includes(i);
              hullHasPI = includesConsecutive(hull, p, i);
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
                chunker.add('piqTest',
                  (vis, edgeArray, coordsArray, c_p, c_q, c_i) => {
                    vis.graph.addEdge(c_p, c_i);
                    vis.graph.addEdge(c_q, c_i);
                    vis.graph.colorEdge(c_p, c_i, colorsCH.CLOCKWISE_E);
                    vis.graph.colorEdge(c_q, c_i, colorsCH.CLOCKWISE_E);
                  },
                  [E, coords, p, q, i], 0
                );
                chunker.add('q<-i',
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
                // defer recalculation of hullHasQ - we want
                // to refer to the old version of q for now
              } else {
                chunker.add('piqTest',
                  (vis, edgeArray, coordsArray, c_p, c_q, c_i) => {
                    vis.graph.addEdge(c_p, c_i);
                    vis.graph.addEdge(c_q, c_i);
                    vis.graph.colorEdge(c_p, c_i, colorsCH.ANTICLOCK_E);
                    vis.graph.colorEdge(c_q, c_i, colorsCH.ANTICLOCK_E);
                  },
                  [E, coords, p, q, i], 0
                );
              }
              chunker.add('assignI',
                (vis, edgeArray, coordsArray, c_p, c_q, c_i, h_pi, h_qi) => {
                  if (h_pi)
                    vis.graph.colorEdge(c_p, c_i, colorsCH.HULL_E);
                  else
                    vis.graph.removeEdge(c_p, c_i);
                  if (h_qi)
                    vis.graph.colorEdge(c_q, c_i, colorsCH.HULL_E);
                  else
                    vis.graph.removeEdge(c_q, c_i);
                },
                [E, coords, p, old_q, i, hullHasPI, hullHasQI], 0
              );
              // now update hullHasQ in case q changed above
              hullHasQ = hull.includes(q);
            }
       
            chunker.add('p<-q',
              (vis, edgeArray, coordsArray, c_p, c_q) => {
                // Nice to do this in a couple of steps if possible
                // Move wrapper close then final position with node
                // colour change?
                vis.graph.addEdge(c_p, c_q);
                vis.graph.colorEdge(c_p, c_q, colorsCH.HULL_E);
                // vis.graph.colorNode(c_q, colorsCH.HULLP_N);
                // redo "wrapping" edge
                vis.graph.removeEdge(c_p, wrapperStr);
                vis.graph.addEdge(wrapperStr, c_q);
                vis.graph.colorEdge(c_q, wrapperStr, colorsCH.HULL_E);
                let [pX, pY] = vis.graph.getNodePosition(c_p);
                let [qX, qY] = vis.graph.getNodePosition(c_q);
                // XXX wrapper position should be colinear but far away
                // Currently if p and q are close, wrapper may be too
                // close; also need to consider case where p=q...?
                let wX = qX + 50 * (qX - pX);
                let wY = qY + 50 * (qY - pY);
                vis.graph.setNodePosition(wrapperStr, wX, wY);
              },
              [E, coords, p, q], 0
            );
            // Now q is the most clockwise with
            // respect to p. Set p as q for next iteration, 
            // so that q is added to result 'hull'
            prevP = p;
            p = q;
            if (p != l) {
              chunker.add('whileP');
            } else {
              // clean up on loop exit
              chunker.add('whileP',
                (vis, edgeArray, coordsArray, c_pp, c_p) => {
                  vis.graph.colorNode(c_pp, colorsCH.HULLP_N);
                  vis.graph.colorNode(c_p, colorsCH.HULLP_N);
                  },
                  [E, coords, prevP, p], 0
              );
            }
       
        } while (p != l);  // While we don't come to first 
                           // point
        // console.log("Reached (" + coords[p][X] + ", " + coords[p][Y] + ") again");
        chunker.add( 'returnHull',
          (vis, edgeArray, coordsArray, c_p, c_q) => {
            vis.graph.removeEdge(c_p, wrapperStr);
            vis.graph.removeNode(wrapperStr);
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
    
    


    convexHull(coords, coords.length, E);

  }
  , 

};
