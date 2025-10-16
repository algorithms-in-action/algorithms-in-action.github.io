// Graham scan convex hull algorithm
// JavaScript code from geeks4geeks, modified by Lee Naish.  Pseudocode
// developed somewhat separately (with aim of simple presentation etc)
// so it's rather more ugly - one of the disadvantages of grabbing existing
// code rather than writing pseudocode then writing code based on it.
// Also, initially we didn't re-number the points in the sorting phase,
// requiring some extra complexity that could now be removed as we have
// added a small chunk of code to do the re-ordering (but not gone back to
// the original ordering a the end).
// XXX probably should highlight the nodes as well as the edges, at least at
// the end.
// XXX base case not animated yet
// 
// XXX Based on gwrap.js - see comments there also

import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import {colorsCH} from './convexHullColours';

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('graph', null, 'Points'),
        order: 0,
      },
      array: {
        instance: new ArrayTracer('array', null, 'Array H', { arrayItemMagnitudes: false }),
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

    // Graham scan convex hull algorithm
    // This code is from geeks4geeks, Modified by Lee Naish
    // XXX may want to remove duplicate points
    
    // Class to represent a point
    // id added to map to rendered graph
    // XXX may want to change this for consistency with other CH algorithms
    class Point {
        constructor(x, y, id) {
            this.x = x;
            this.y = y;
            this.id = id;
        }
    
        // Method to check equality of two points
        equals(t) {
            return this.x === t.x && this.y === t.y;
        }
    }
    
    // Function to compute orientation of the triplet (a, b, c)
    // Returns -1 for clockwise, 1 for counter-clockwise, 0 for collinear
    function orientation(a, b, c) {
        const v = a.x * (b.y - c.y) + 
                  b.x * (c.y - a.y) + 
                  c.x * (a.y - b.y);
        if (v < 0) return -1;  // clockwise
        if (v > 0) return +1;  // counter-clockwise
        return 0;              // collinear
    }
    
    // Function to compute squared distance between two points
    function distSq(a, b) {
        return (a.x - b.x) * (a.x - b.x) + 
               (a.y - b.y) * (a.y - b.y);
    }

    // Extract ids from "stack"; original JS code has the array in the
    // reverse order to the pseudocode so we reverse order and also add one
    // to each id for display purposes (displayed id of each node is
    // actually one more than internal id)
    function stToIds(st) {
      let n = st.length;
      let ids = new Array(n);
      for (let i = 0; i < n; i++)
        ids[i] = st[n-1-i].id + 1;
      return ids;
    }

    // Function to find the convex hull of a set of points
    function convexHull(points, n, E) {
        let st_ids = [' ', ' ']; // used later for hull node ids

        chunker.add(
          'start',
          (vis, edgeArray, coordsArray, ids) => {
            vis.graph.setSize(5);
            vis.array.setSize(1);
            vis.array.set(ids);
            vis.graph.directed(true);
            vis.graph.weighted(false);
            vis.graph.moveNodeFn(moveNode); // allows dragging of nodes
            vis.graph.set(edgeArray, Array.from({ length: numVertices }, (v, k) => (k + 1)),coordsArray);
            vis.graph.dimensions.defaultNodeRadius = 15;
            vis.graph.dimensions.nodeRadius = 15;
            vis.graph.setZoom(0.7);
         },
          [E, coords, st_ids], 0
        );

    
        // Convex hull is not possible if there are fewer than 3 points
        // XXX
        // if (n < 3) return [[-1]];
        if (n < 3) return points;
    
        // Convert input array to Point objects
        let a = points.map((p, i) => new Point(p[0], p[1], i));
    
        // Find the point with the lowest x-coordinate (and y if tie)
        const p0 = a.reduce((min, p) => 
            (p.x < min.x || (p.x === min.x && p.y < min.y)) ? p : min, a[0]);
    
        // a = a.filter((p) => (p.x !== p0.x || p.y != p0.y)); // remove p0
    
        // Sort the points by polar angle with respect to p0
        a.sort((a, b) => {
            const o = orientation(p0, a, b);
    
            // If collinear, place the farther point later
            // This ensures p0 comes first in the array (we could do that
            // separately) and also avoids possible extra (colinear) points
            // at the end of the array when we have finished computing the
            // hull (this could be done separately also).
            if (o === 0) {
                return distSq(p0, a) - distSq(p0, b);
                // XXX return 0;
            }
    
            // Otherwise, order based on counter-clockwise direction
            // XXX return o < 0 ? -1 : 1;
            return o < 0 ? 1 : -1;
        });

        // XXX maybe draw edges from minX point to all others plus label min
        // and max points in ordering then delete at next step
    
        // a.unshift(p0); // put p0 back at start
    
        // Remove duplicate collinear points (keep farthest one)
        // XXX not needed?
    /*
        let m = 1;
        for (let i = 1; i < a.length; i++) {
    
            // Skip closer collinear points
            while (i < a.length - 1 && orientation(p0, a[i], a[i + 1]) === 0) {
                i++;
            }
    
            // Keep current point in place
            a[m] = a[i];
            m++;
        }
    */
        let m = a.length;
        let p1 = a[0].id;

        chunker.add(
           'minX',
           (vis, id1) => {
             vis.graph.updateUpperLabel(id1, 'p1');
           },
           [p1], 0
         );

        // XXX now renumbering rendered points - best simplify other code
        let newCoords = new Array(n);
        for (let i = 0; i < n; i++) {
          newCoords[i] = new Array(2);
          newCoords[i][0] = a[i].x;
          newCoords[i][1] = a[i].y;
          a[i].id = i;
        }
        p1 = 0;

        chunker.add(
           'sort',
           (vis, edgeArray, coordsArray, a, n) => {
             vis.graph.set(edgeArray, Array.from({ length: n }, (v, k) => (k + 1)), coordsArray);
             // add some edges + min/max labels to illustrate sorting
             // (XXX could change labels like div&conq but not worth it??)
             for (let i = 1; i < n; i++) {
               vis.graph.addEdge(a[0].id, a[i].id);
               vis.graph.colorEdge(a[0].id, a[i].id, colorsCH.HULL_E);
             }
             vis.graph.updateUpperLabel(0, 'p1');
             vis.graph.updateUpperLabel(a[1].id, 'min'); // XXX Lower broken
             vis.graph.updateUpperLabel(a[n-1].id, 'max');
           },
           [E, newCoords, a, n], 0
         );
    
        // If fewer than 3 points remain, hull is not possible
        // XXX not needed? (can return all)
        if (m < 3) return [[-1]];

        // Initialize the convex hull stack with first two points
        const st = [a[0], a[1]]; // XXX order wrong in original code - fix??
        st_ids = stToIds(st);
        // st_ids[0] = a[1].id;
        // st_ids[1] = a[0].id;
        chunker.add(
           'initH',
           (vis, ids, a0, a1, a, n) => {
             // remove edges except a0->a1
             for (let i = 2; i < n; i++) {
               vis.graph.removeEdge(a[0].id, a[i].id);
             }
             vis.graph.updateUpperLabel(a[1].id, ''); // XXX Lower broken
             vis.graph.updateUpperLabel(a[n-1].id, '');
             vis.array.set(ids);
             vis.graph.addEdge(a0, a1);
             vis.graph.colorEdge(a0, a1, colorsCH.HULL_E);
           },
           [st_ids, a[0].id, a[1].id, a, n], 0
         );
    
        // Process the remaining points
        let prev_i;
        for (let i = 2; i < m; i++) {
          chunker.add(
             'forI',
             (vis, a, i, p_i, ids) => {
               if (p_i !== undefined)
                 vis.graph.updateUpperLabel(a[p_i].id, '');
               vis.graph.updateUpperLabel(a[i].id, iStr);
               // reset colors on last two edges
               vis.graph.colorEdge(ids[1]-1, ids[0]-1, colorsCH.HULL_E);
               if (ids.length > 2)
                 vis.graph.colorEdge(ids[2]-1, ids[1]-1, colorsCH.HULL_E);
             },
             [a, i, prev_i, st_ids], 0
           );
          // Add current point to stack
          st.push(a[i]);
          st_ids = stToIds(st);
          chunker.add(
             'addP',
             (vis, a, i, p_i, ids) => {
               vis.array.set(ids);
               vis.graph.addEdge(ids[1]-1, ids[0]-1);
               vis.graph.colorEdge(ids[1]-1, ids[0]-1, colorsCH.HULL_E);
             },
             [a, i, prev_i, st_ids], 0
           );
           prev_i = i;
           // While the last three points do not make a left turn, pop the middle one
           /* eslint-disable no-constant-condition */
           while (true) {
             if (st.length > 2 && orientation(st[st.length - 3], st[st.length - 2], a[i]) <= 0) {
                 // console.log('Pop ', st[st.length - 2].x, st[st.length - 2].y, st[st.length - 1].x, st[st.length - 1].y, a[i].x, a[i].y);
               chunker.add(
                  'whileNotCC',
                  (vis, a, i, p_i, ids) => {
                    vis.graph.colorEdge(ids[1]-1, ids[0]-1, colorsCH.GSCLOCKWISE_E);
                    vis.graph.colorEdge(ids[2]-1, ids[1]-1, colorsCH.GSCLOCKWISE_E);
                    vis.array.selectColor(1, colorsCH.TODELETE_A);
                    // vis.array.selectColor(1, 3);
                  },
                  [a, i, prev_i, st_ids], 0
                );
                st.splice(st.length-2, 1);
                let h2id = st_ids[1];
                st_ids = stToIds(st);
                chunker.add(
                   'removeH2',
                   (vis, a, i, ids, h2id) => {
                     vis.array.set(ids);
                     vis.graph.addEdge(ids[1]-1, ids[0]-1);
                     vis.graph.colorEdge(ids[1]-1, ids[0]-1, colorsCH.HULL_E);
                     vis.graph.removeEdge(h2id-1, ids[0]-1);
                     vis.graph.removeEdge(ids[1]-1, h2id-1);
                   },
                   [a, i, st_ids, h2id], 0
                 );
              } else if (st.length > 2) {
               chunker.add(
                  'whileNotCC',
                  (vis, a, i, p_i, ids) => {
                    vis.graph.colorEdge(ids[1]-1, ids[0]-1, colorsCH.GSANTICLOCK_E);
                    vis.graph.colorEdge(ids[2]-1, ids[1]-1, colorsCH.GSANTICLOCK_E);
                  },
                  [a, i, prev_i, st_ids], 0
                );
                break;
              } else {
               chunker.add(
                  'whileNotCC',
                  (vis) => {
                  },
                  [], 0
                );
                break;
              }
            }
        }
    
        // Final validation: if fewer than 3 points in stack, hull is not valid
        // XXX not needed? (best return all)
        // if (st.length < 3) return [[-1]];
        chunker.add(
           'returnH',
           (vis, ids, id1, a, i) => {
             vis.graph.updateUpperLabel(a[i].id, '');
             vis.graph.updateUpperLabel(id1, ''); // XXX remove earlier?
             vis.graph.updateUpperLabel(i, '');
             vis.graph.addEdge(ids[0]-1, id1);
             vis.graph.colorEdge(ids[0]-1, id1, colorsCH.HULL_E);
             // reset colors on last two edges
             vis.graph.colorEdge(ids[1]-1, ids[0]-1, colorsCH.HULL_E);
             if (ids.length > 2)
               vis.graph.colorEdge(ids[2]-1, ids[1]-1, colorsCH.HULL_E);

           },
           [st_ids, p1, a, prev_i], 0
         );
    
        // Convert hull points to [x, y] arrays
        return st.map(p => [Math.round(p.x), Math.round(p.y)]);
    }
    
    // Compute the convex hull
    // const hull = findConvexHull(points);
    const hull = convexHull(coords, coords.length, E);
    
    // Output the result to console for now
    if (hull.length === 1 && hull[0][0] === -1) {
        console.log(-1);
    } else {
        hull.forEach(point => {
            console.log(`${point[0]}, ${point[1]}`);
        });
    }

  }
  , 

};
