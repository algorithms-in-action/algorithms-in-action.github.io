// Gift wrapping convex hull algorithm
// Maybe change so we wrap counter-clockwise for consistency?
// 
// XXX Based on DFSrec code - may still be some leftover rubbish to delete.
// 
// XXX Uses EuclideanMatrixParams; need to make some changes to this:
// 1) The graphs here (initially at least) have no edges - need to change
// graph generation and adjust display accordingly. Probably best to
// have a noEdges option like we have weighted and directed as options.
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
// XXX Maybe have an option button for the Akl-Toussaint heuristic.
// See union-find for an example of such an option. Currently
// implemented for n>=10 - not too bad.
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
  // Best change parameter code + this(?)
  run(chunker, { edgeValueMatrix, coordsMatrix, startNode, endNodes, moveNode}) {
    // String Variables used in displaying algo

    // id for wrapper node - could be anything other than a small
    // integer; '@' looks a bit like a roll of paper/string...
    // It's not normally visible but may be found if someone searches
    const wrapperStr = '@';
    const pStr = 'p';
    const iStr = 'i';
    const qStr = 'q';

    const coords = [...coordsMatrix];
    const numVertices = edgeValueMatrix.length;
    // const E = [...edgeValueMatrix];
    // edge matrix is NxN matrix of edge weights, zero meaning no edge
    // Here we ignore edgeValueMatrix and create our own zero matrix
    const Zeros = new Array(numVertices).fill(0);
    const E = new Array(numVertices).fill(Zeros);

    // Flags for deleted nodes for Alk heuristic
    let deleted = new Array(numVertices).fill(false);

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

    // flag for Akl-Toussaint heuristic
    // XXX Could use extra input button; use n>= 10 for now
    let aklOpt = numVertices >= 10
    
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

    // checks if hull (h) has consecutive elements p,q
    // (currently NOT q,p)
    // (ie, an edge between the two has been added)
    function includesConsecutive(h, p, q)
    {
        for (let i = 0; i < h.length; i++) {
          if (h[i] === p & h[i+1] === q) return true;
          // if (h[i] === q & h[i+1] === p) return true;
        }
        return false;
    }


    // checks if max1->max2->k is clockwise and
    // adds appropriate chunk
    function aklCheckTurn(minX, maxX, minY, maxY, k, max1, max2) {
      if (max1 === max2) // ignore identical points
        return true;
      // could allow straight also - that would discard colinear points
      if (orientation(coords[max1], coords[max2], coords[k]) == GoClockwise) {
        chunker.add('allClockwise',
          (vis, c_minX, c_maxX, c_minY, c_maxY, c_k, m1, m2) => {
            vis.graph.removeEdge(c_maxY, c_k);
            vis.graph.removeEdge(c_maxX, c_k);
            vis.graph.removeEdge(c_minY, c_k);
            vis.graph.removeEdge(c_minX, c_maxY);
            vis.graph.removeEdge(c_maxY, c_maxX);
            vis.graph.removeEdge(c_maxX, c_minY);
            vis.graph.removeEdge(c_minY, c_minX);
            vis.graph.addEdge(m1, m2);
            vis.graph.addEdge(m2, c_k);
            vis.graph.colorEdge(m1, m2, colorsCH.CLOCKWISE_E);
            vis.graph.colorEdge(m2, c_k, colorsCH.CLOCKWISE_E);
          },
          [minX, maxX, minY, maxY, k, max1, max2], 0
        );
        return true;
      } else {
        chunker.add('allClockwise',
          (vis, c_minX, c_maxX, c_minY, c_maxY, c_k, m1, m2) => {
            vis.graph.removeEdge(c_maxY, c_k);
            vis.graph.removeEdge(c_maxX, c_k);
            vis.graph.removeEdge(c_minY, c_k);
            vis.graph.removeEdge(c_minX, c_maxY);
            vis.graph.removeEdge(c_maxY, c_maxX);
            vis.graph.removeEdge(c_maxX, c_minY);
            vis.graph.removeEdge(c_minY, c_minX);
            vis.graph.addEdge(m1, m2);
            vis.graph.addEdge(m2, c_k);
            vis.graph.colorEdge(m1, m2, colorsCH.ANTICLOCK_E);
            vis.graph.colorEdge(m2, c_k, colorsCH.ANTICLOCK_E);
          },
          [minX, maxX, minY, maxY, k, max1, max2], 0
        );
        return false;
      }
    }




    
    // Prints convex hull of a set of n coords.
    function convexHull(coords, n, E)
    {
        chunker.add(
          'start',
          (vis, edgeArray, coordsArray) => {
            // XXX directed graphs can be better for showing turns
            // but currently edges can get curved when there are hull
            // edges (could remove the hull edges temporarily and then
            // put them back or just revert to undirected)
            vis.graph.directed(true);
            vis.graph.weighted(false);
            vis.graph.moveNodeFn(moveNode); // allows dragging of nodes
            vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
            vis.graph.dimensions.defaultNodeRadius = 15;
            vis.graph.dimensions.nodeRadius = 15;
            vis.graph.setZoom(0.6);
         },
          [E, coords], 0
        );

        chunker.add('n<=3');
        if (n <= 3) {
          chunker.add('returnAll',
            (vis, n) => {
              // must be at least 1 point (currently XXX)
              vis.graph.colorNode(0, colorsCH.HULLP_N);
              if (n > 1 ) {
                vis.graph.colorNode(1, colorsCH.HULLP_N);
                vis.graph.addEdge(0, 1);
                vis.graph.colorEdge(0, 1, colorsCH.HULL_E);
                if (n > 1 ) {
                  vis.graph.colorNode(2, colorsCH.HULLP_N);
                  vis.graph.addEdge(2, 0);
                  vis.graph.addEdge(1, 2);
                  vis.graph.colorEdge(2, 0, colorsCH.HULL_E);
                  vis.graph.colorEdge(1, 2, colorsCH.HULL_E);
                }
              }
            },
            [n], 0
          );
          return;
        }
       
        // Initialize Result
        let hull = [];
       
        // Find the leftmost point minX, plus maxX, minY, maxY
        // XXX add explanation etc re possibility of minX == minY etc
        let [minX, maxX, minY, maxY] = [0, 0, 0, 0];
        for (let i = 1; i < n; i++) {
            // NOTE: if there are 2 coords with minimal x value it doesn't
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
            if (coords[i][X] < coords[minX][X])
                minX = i;
            else if (coords[i][X] === coords[minX][X] && coords[i][Y] < coords[minX][Y])
                minX = i;
            if (coords[i][X] > coords[maxX][X])
                maxX = i;
            else if (coords[i][X] === coords[maxX][X] && coords[i][Y] > coords[maxX][Y])
                maxX = i;
            if (coords[i][Y] < coords[minY][Y])
                minY = i;
            else if (coords[i][Y] === coords[minY][Y] && coords[i][X] < coords[minY][X])
                minY = i;
            if (coords[i][Y] > coords[maxY][Y])
                maxY = i;
            else if (coords[i][Y] === coords[maxY][Y] && coords[i][X] > coords[maxY][X])
                maxY = i;
        }
        // Start from (lowest) leftmost point, keep moving 
        // clockwise until reach the start point
        // again. This loop runs O(h) times where h is
        // number of coords in result or output.
        let p = minX, q, prevP;
        chunker.add(
          'minX',
          (vis, c_minX, c_maxX, c_minY, c_maxY) => {
            vis.graph.colorNode(c_minX, colorsCH.AKL_N);
            if (aklOpt) { // could pass this in
              vis.graph.colorNode(c_maxX, colorsCH.AKL_N);
              vis.graph.colorNode(c_minY, colorsCH.AKL_N);
              vis.graph.colorNode(c_maxY, colorsCH.AKL_N);
              vis.graph.addEdge(c_minX, c_maxY);
              vis.graph.colorEdge(c_minX, c_maxY, colorsCH.AKL_E);
              vis.graph.addEdge(c_maxY, c_maxX);
              vis.graph.colorEdge(c_maxY, c_maxX, colorsCH.AKL_E);
              vis.graph.addEdge(c_maxX, c_minY);
              vis.graph.colorEdge(c_maxX, c_minY, colorsCH.AKL_E);
              vis.graph.addEdge(c_minY, c_minX);
              vis.graph.colorEdge(c_minY, c_minX, colorsCH.AKL_E);
            }
          },
          [minX, maxX, minY, maxY], 0
        );
        if (aklOpt) { // optional Alk heuristic
          let prev_k;
          for (let k = 0; k < n; k++) {
            // XXX skip messy animation - add explanation in pseudocode
            if (k === minX || k === minY || k === maxX || k === maxY)
              continue;
            chunker.add(
              'forkinP',
              (vis, c_minX, c_maxX, c_minY, c_maxY, c_k, p_k) => {
                if (p_k !== undefined) {
                  vis.graph.removeNodeColor(p_k);
                }
                vis.graph.colorNode(c_k, colorsCH.AKLK_N);
              },
              [minX, maxX, minY, maxY, k, prev_k], 0
            );
            if (aklCheckTurn(minX, maxX, minY, maxY, k, minX, maxY) &&
                aklCheckTurn(minX, maxX, minY, maxY, k, maxY, maxX) &&
                aklCheckTurn(minX, maxX, minY, maxY, k, maxX, minY) &&
                aklCheckTurn(minX, maxX, minY, maxY, k, minY, minX))
            {
              // Add extra chunk that redraws polygon and removes and
              // removes any edges to k + highlight k
              chunker.add(
                'allClockwise',
                (vis, c_minX, c_maxX, c_minY, c_maxY, c_k) => {
                  vis.graph.addEdge(c_minX, c_maxY);
                  vis.graph.colorEdge(c_minX, c_maxY, colorsCH.AKL_E);
                  vis.graph.addEdge(c_maxY, c_maxX);
                  vis.graph.colorEdge(c_maxY, c_maxX, colorsCH.AKL_E);
                  vis.graph.addEdge(c_maxX, c_minY);
                  vis.graph.colorEdge(c_maxX, c_minY, colorsCH.AKL_E);
                  vis.graph.addEdge(c_minY, c_minX);
                  vis.graph.colorEdge(c_minY, c_minX, colorsCH.AKL_E);
                  vis.graph.removeEdge(c_minX, c_k);
                  vis.graph.removeEdge(c_minY, c_k);
                  vis.graph.removeEdge(c_maxX, c_k);
                  vis.graph.removeEdge(c_maxY, c_k);
                  vis.graph.colorNode(c_k, colorsCH.AKLDEL_N); // highlight k
                },
                [minX, maxX, minY, maxY, k], 0
              );
              deleted[k] = true;
              chunker.add('removek',
                (vis, c_minX, c_maxX, c_minY, c_maxY, c_k) => {
                  // smash original coords with ones from the display
                  // that are scaled etc for rendering so deleted nodes
                  // can be restored in the last chunk. NOTE: coords is
                  // an array defined in this file that is updated here
                  // *when this chunk is executed* (not when the chunk
                  // is created) because when chunks are created we
                  // don't have the proper node position with scaling
                  // etc. Thus coords is not passed as a parameter.
                  let [pX, pY] = vis.graph.getNodePosition(c_k);
                  coords[c_k][0] = pX;
                  coords[c_k][1] = pY;
                  vis.graph.removeNode(c_k);
                },
                [minX, maxX, minY, maxY, k], 0
              );
            } else {
              // Add extra chunk that redraws polygon and removes and
              // removes any edges to k
              chunker.add(
                'allClockwise',
                (vis, c_minX, c_maxX, c_minY, c_maxY, c_k) => {
                  vis.graph.addEdge(c_minX, c_maxY);
                  vis.graph.colorEdge(c_minX, c_maxY, colorsCH.AKL_E);
                  vis.graph.addEdge(c_maxY, c_maxX);
                  vis.graph.colorEdge(c_maxY, c_maxX, colorsCH.AKL_E);
                  vis.graph.addEdge(c_maxX, c_minY);
                  vis.graph.colorEdge(c_maxX, c_minY, colorsCH.AKL_E);
                  vis.graph.addEdge(c_minY, c_minX);
                  vis.graph.colorEdge(c_minY, c_minX, colorsCH.AKL_E);
                  vis.graph.removeEdge(c_minX, c_k);
                  vis.graph.removeEdge(c_minY, c_k);
                  vis.graph.removeEdge(c_maxX, c_k);
                  vis.graph.removeEdge(c_maxY, c_k);
                  vis.graph.removeNodeColor(c_k);
                },
                [minX, maxX, minY, maxY, k], 0
              );
            }
            prev_k = k;
          }
        }

        chunker.add(
          'initP',
          (vis, edgeArray, coordsArray, c_p, c_q, c_maxX, c_minY, c_maxY) => {
            if (aklOpt) {
              vis.graph.removeEdge(c_p, c_maxY);
              vis.graph.removeEdge(c_maxY, c_maxX);
              vis.graph.removeEdge(c_maxX, c_minY);
              vis.graph.removeEdge(c_minY, c_p);
              vis.graph.removeNodeColor(c_maxY);
              vis.graph.removeNodeColor(c_maxX);
              vis.graph.removeNodeColor(c_minY);
            }
            // Add special node a long way away for "wrapper"
            vis.graph.addNode(wrapperStr, wrapperStr);
            vis.graph.setNodePosition(wrapperStr, -2000, -9000); // XXX
            vis.graph.updateUpperLabel(c_p, pStr); // XXX Lower broken???
            vis.graph.addEdge(c_p, wrapperStr);
            vis.graph.colorEdge(c_p, wrapperStr, colorsCH.HULL_E);
            vis.graph.colorNode(c_p, colorsCH.NEXTQ_N);
          },
          [E, coords, p, q, maxX, minY, maxY], 0
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
                  vis.graph.addEdge(c_p, wrapperStr);
                  vis.graph.colorEdge(c_p, wrapperStr, colorsCH.HULL_E);
                  // XXX could use coordsArray
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
       
            // XX Search for a point 'q' such that 
            // orientation(p, q, x) is clockwise
            // for all coords 'x'. The idea is to keep 
            // track of last visited most clock-
            // wise point in q. If any point 'i' is more 
            // clock-wise than q, then update q.
            // Above NQR with colinear coords on hull
            // want q s.t. for no i, p->i->q is clockwise
            q = (p + 1) % n;
            while (deleted[q]) // check for deleted nodes
              q = (q + 1) % n;
              
            chunker.add('initQ',
              (vis, edgeArray, coordsArray, c_p, c_q) => {
                vis.graph.colorNode(c_q, colorsCH.NEXTQ_N);
                vis.graph.updateUpperLabel(c_q, qStr);
              },
              [E, coords, p, q], 0
            );
            let hullHasQ, hullHasI, hullHasPI, hullHasIP, hullHasIQ, hullHasQI;
            hullHasQ = hull.includes(q);
            let first_i = 0;
            // can optionally ignore p, q. It makes the animation less
            // confusing so we do so. NOTE same tests later, twice!
            // Could simplify some of the color resetting code with
            // this short-cut.
            while (first_i === p || first_i === q || deleted[first_i])
              first_i = first_i + 1;
            hullHasI  = hull.includes(first_i);
            chunker.add('assignI',
              (vis, c_p, c_q, h_i, f_i) => {
                // if (!h_i && 0 !== c_q && 0 !== c_p)
                // Currently we always color node i and change it back
                // to the old color (if any) later. A bit confusing
                // because i can be on the hull and/or p or q (no
                // longer!)
                vis.graph.colorNode(f_i, colorsCH.GWRAPI_N);
                vis.graph.updateUpperLabel(f_i, iStr);
              },
              [p, q, hullHasI, first_i], 0
            );
            for (let i = 0; i < n; i++)
            {
              if (deleted[i]) // ignore deleted nodes
                continue;
              if (i === p || i === q) // we skip i==p, i==q
                continue;
              hullHasI = hull.includes(i);
              hullHasPI = includesConsecutive(hull, p, i);
              hullHasIP = includesConsecutive(hull, i, p);
              hullHasIQ = includesConsecutive(hull, i, q);
              hullHasQI = includesConsecutive(hull, q, i);
              let old_q = q;
              // If i is more clockwise than
              // current q, then update q
              if (orientation(coords[p], coords[i], coords[q]) == GoClockwise) {
                // Note: see comment above re choice of first point in
                // colinear case
                // Here, if there are multiple coords with minimal
                // clockwiseness (if thats a word), we pick the first one
                // (min point number)
                chunker.add('piqTest',
                  (vis, edgeArray, coordsArray, c_p, c_q, c_i, h_ip, h_qi) => {
                    if (h_qi)
                      vis.graph.removeEdge(c_q, c_i);
                    if (h_ip)
                      vis.graph.removeEdge(c_i, c_p);
                    vis.graph.addEdge(c_p, c_i);
                    vis.graph.addEdge(c_i, c_q);
                    vis.graph.colorEdge(c_p, c_i, colorsCH.CLOCKWISE_E);
                    vis.graph.colorEdge(c_i, c_q, colorsCH.CLOCKWISE_E);
                  },
                  [E, coords, p, q, i, hullHasIP, hullHasQI], 0
                );
                chunker.add('q<-i',
                  (vis, edgeArray, coordsArray, c_p, c_q, c_i, h_q) => {
                    vis.graph.colorNode(c_i, colorsCH.NEXTQ_N);
                    if (h_q)
                      vis.graph.colorNode(c_q, colorsCH.HULLP_N);
                    else
                      vis.graph.removeNodeColor(c_q);
                    vis.graph.updateUpperLabel(c_q, '');
                    vis.graph.updateUpperLabel(c_i, qStr);
                  },
                  [E, coords, p, q, i, hullHasQ], 0
                );
                q = i;
                // defer recalculation of hullHasQ - we want
                // to refer to the old version of q for now
              } else {
                chunker.add('piqTest',
                  (vis, edgeArray, coordsArray, c_p, c_q, c_i, h_ip, h_qi) => {
                    if (h_qi)
                      vis.graph.removeEdge(c_q, c_i);
                    if (h_ip)
                      vis.graph.removeEdge(c_i, c_p);
                    vis.graph.addEdge(c_p, c_i);
                    vis.graph.addEdge(c_i, c_q);
                    vis.graph.colorEdge(c_p, c_i, colorsCH.ANTICLOCK_E);
                    vis.graph.colorEdge(c_i, c_q, colorsCH.ANTICLOCK_E);
                  },
                  [E, coords, p, q, i, hullHasIP, hullHasQI], 0
                );
              }
              chunker.add('assignI',
                (vis, edgeArray, coordsArray, c_p, c_q, n_q, c_i, h_i, h_pi, h_ip, h_iq, h_qi) => {
                  if (h_qi) {
                    vis.graph.addEdge(c_q, c_i);
                    vis.graph.colorEdge(c_q, c_i, colorsCH.HULL_E);
                  }
                  if (h_ip) {
                    vis.graph.addEdge(c_i, c_p);
                    vis.graph.colorEdge(c_i, c_p, colorsCH.HULL_E);
                  }
                  if (c_i === n_q)
                    vis.graph.colorNode(c_i, colorsCH.NEXTQ_N);
                  else if (c_i === c_p || h_i)
                    vis.graph.colorNode(c_i, colorsCH.HULLP_N);
                  else
                    vis.graph.removeNodeColor(c_i);
                  let next_i = c_i + 1;
                  // we skip i==p, i==q
                  while (next_i === c_p || next_i === n_q || deleted[next_i])
                    next_i = next_i + 1;
                  if (c_i !== n_q)
                    vis.graph.updateUpperLabel(c_i, '');
                  if (next_i < n) {
                    vis.graph.colorNode(next_i, colorsCH.GWRAPI_N);
                    vis.graph.updateUpperLabel(next_i, iStr);
                  } else { // about to exit for loop
                    // Move wrapper most of the way to it's next position
                    // XXX improve interpolation - best use angle
                    // somehow rather than X,Y coordinates
                    let [oX, oY] = vis.graph.getNodePosition(wrapperStr);
                    let [pX, pY] = vis.graph.getNodePosition(c_p);
                    let [qX, qY] = vis.graph.getNodePosition(n_q);
                    // XXX wrapper position should be colinear but far away
                    // Currently if p and q are close, wrapper may be too
                    // close; also need to consider case where p=q...?
                    let wX = (qX + 50 * (qX - pX))*0.9 + oX*0.1;
                    let wY = (qY + 50 * (qY - pY))*0.9 + oY*0.1;
                    vis.graph.setNodePosition(wrapperStr, wX, wY);
                  }
                  if (h_pi)
                    vis.graph.colorEdge(c_p, c_i, colorsCH.HULL_E);
                  else
                    vis.graph.removeEdge(c_p, c_i);
                  if (h_iq)
                    vis.graph.colorEdge(c_i, c_q, colorsCH.HULL_E);
                  else
                    vis.graph.removeEdge(c_i, c_q);
                },
                [E, coords, p, old_q, q, i, hullHasI, hullHasPI, hullHasIP, hullHasIQ, hullHasQI], 0
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
                vis.graph.addEdge(c_q, wrapperStr);
                vis.graph.colorEdge(c_q, wrapperStr, colorsCH.HULL_E);
                vis.graph.updateUpperLabel(c_q, '');
                vis.graph.updateUpperLabel(c_p, '');
                vis.graph.updateUpperLabel(c_q, pStr);
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
            if (p != minX) {
              chunker.add('whileP');
            } else {
              // clean up on loop exit
              chunker.add('whileP',
                (vis, edgeArray, coordsArray, c_pp, c_p) => {
                  vis.graph.colorNode(c_pp, colorsCH.HULLP_N);
                  vis.graph.colorNode(c_p, colorsCH.HULLP_N);
                  vis.graph.updateUpperLabel(c_p, '');
                  },
                  [E, coords, prevP, p], 0
              );
            }
       
        } while (p != minX);  // While we don't come to first 
                           // point
        // console.log("Reached (" + coords[p][X] + ", " + coords[p][Y] + ") again");
        chunker.add( 'returnHull',
          (vis, c_p, c_q, del, n) => {
            for (let i = 0; i < n; i++)
              // restore deleted nodes: NOTE: coords is an array defined
              // in this file that is read here, having been modified by
              // a previous chunk (possibly). coords is not passed in as
              // a parameter as that would be the version when the
              // chunks are created, not the version after some chunks
              // have been executed.
              if (del[i]) {
                vis.graph.addNode(i, i+1);
                vis.graph.setNodePosition(i, coords[i][0], coords[i][1]);
              }
            vis.graph.removeEdge(c_p, wrapperStr);
            vis.graph.removeNode(wrapperStr);
          },
          [p, q, deleted, n], 0
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
