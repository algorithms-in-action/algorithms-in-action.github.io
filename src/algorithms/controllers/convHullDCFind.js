// Divide and conquer convex hull algorithm
// - adapted from gift wrapping convex hull algorithm
// Note: some bugs corrected from javascript code without animation
// test all points colinear in merge, duplicate points(??)
// XXX original code best be fixed
// 
// XXX Color stuff with graphs is a bit of a mess

// Animation colors etc (suggestion for now)
// Base on mergesort (similar structure):
// Start of (recursive) call: current nodes peach
// After split, left is peach and right is sky
// After left recursion left is peach with hull computed, right is sky
// After right recursion left/right is peach/sky with hull computed
// After merge all leaf with hull computed
//
// Need to color nodes at start and split as we have no edges
// Eventually want edges leaf as they are the clearest view of hull;
// can also have nodes leaf.
//
// During merge we have the tangent edges/nodes being computed. Maybe
// have these nodes apple; might run out of colors for edges?? Could
// just color edges apple for concave turns and label nodes; leave OK
// turns without color change(?). As we move the tangent, remove color
// from edges that will be removed. Color edges leaf as we construct
// hull at end and delete unwanted edges before/after these steps.
// Should tangent edge be colored during or at end of computation or is
// coloring the nodes sufficient?

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
    // Currently use updateUpperLabel (+ Lower); allows one label - in
    // some cases (eg with 3 points on the hull) we get collisions and
    // just live with it for now.
    let lStr = 'l';
    let rStr = 'r';
    let nextlStr = 'next(l)'; // could omit args??
    let nextrStr = 'next(r)';
    let prevlStr = 'prev(l)';
    let prevrStr = 'prev(r)';
    let uhlStr = 'uhl';
    let uhrStr = 'uhr';
    let lhlStr = 'lhl';
    let lhrStr = 'lhr';

    const coords = [...coordsMatrix];
    let numVertices = edgeValueMatrix.length; // aka n
    // const E = [...edgeValueMatrix];

    // color nodes in points[min...max] - called inside chunker
    function colorNodes(vis, points, min, max, color) {
      for (let i = min; i <= max; i++) {
        vis.graph.colorNode(points[i].id, color);
      }
    }

    // Convex Hull Divide and Conquer algorithm
    // Based on ChatGPT code, with bug fixes and improvements by Lee Naish
    // 
    // The loops for finding upper and lower tangents and related merge code
    // are *awfully* tricky with colinear points. Here we exit the loops early,
    // not going past colinear points, and deal with them later (there are four
    // cases for the four tangent end points, plus the case where all points are
    // colinear so the upper and lower tangents are the same. We also eliminate
    // duplicate points at the start and always return a hull with the minimal
    // number of points.
    
    // ---------- Geometry helpers ----------
    
    // Cross product orientation test
    // >0 = left turn, <0 = right turn, 0 = collinear
    function orientation(a, b, c) {
      return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }

    // Get index of (lowest) leftmost point
    function leftmostIndex(hull) {
      let idx = 0;
      for (let i = 1; i < hull.length; i++) {
        if (hull[i].x < hull[idx].x ||
           (hull[i].x === hull[idx].x && hull[i].y < hull[idx].y)) {
          idx = i;
        }
      }
      return idx;
    }
    
    // Get index of (highest) rightmost point
    function rightmostIndex(hull) {
      let idx = 0;
      for (let i = 1; i < hull.length; i++) {
        if (hull[i].x > hull[idx].x ||
           (hull[i].x === hull[idx].x && hull[i].y > hull[idx].y)) {
          idx = i;
        }
      }
      return idx;
    }

    // remove duplicates from *sorted* coordinate list
    function uniquePoints(points) {
      if (points.length === 0) return [];
    
      const unique = [points[0]];
      for (let i = 1; i < points.length; i++) {
        const prev = unique[unique.length - 1];
        const curr = points[i];
        if (curr[0] !== prev[0] || curr[1] !== prev[1]) {
          unique.push(curr);
        }
      }
      return unique;
    }
    
    
    // ---------- Tangent finding ----------

    // return l and r points on upper tangent
    // We don't skip over co-linear point but return the innermost tangent
    // points (there are some subtle termination issues otherwise)
    function findUpperTangent(HL, HR, depth) {
      let l = rightmostIndex(HL);
      chunker.add('assignLU',
         (vis, pl) => {
           vis.graph.updateUpperLabel(pl, lStr);
        },
       [HL[l].id], depth
      );
      let r = leftmostIndex(HR);
      chunker.add('assignRU',
         (vis, pl, pr) => {
           vis.graph.updateUpperLabel(pr, rStr);
           vis.graph.addEdge(pr, pl);
           vis.graph.colorEdge(pr, pl, colorsCH.DCTANGENT_E);
        },
       [HL[l].id, HR[r].id], depth
      );
    /*
      // original code
      let done = false;
    
      while (!done) {
        done = true;
    
        // Move j clockwise on HR
        // while i->j-k is counterclockwise
        while (orientation(HL[i], HR[j], HR[(j - 1 + HR.length) % HR.length]) > 0
               ) {
          j = (j - 1 + HR.length) % HR.length;
          done = false;
        }
    
        // Move i counterclockwise on HL
        while (orientation(HR[j], HL[i], HL[(i + 1) % HL.length]) < 0) {
          i = (i + 1) % HL.length;
          done = false;
        }
      }
    */
      // simpler code (possibly more repeated tests); inner ifs could be whiles
 
      // r1/l1 are the next/previous nodes; we also need to old
      // versions of r/l these for cleaning up colors etc
      let r1 = (r - 1 + HR.length) % HR.length;
      let rold = r;
      let l1 = (l + 1) % HL.length;
      let lold = l;
      chunker.add('upperWhile',
         (vis, pl, pr, pl1, pr1) => {
           // vis.graph.addEdge(pr, pl);
           // vis.graph.colorEdge(pr, pl, colorsCH.DCTANGENT_E);
           vis.graph.colorEdge(pr1, pr, colorsCH.DCTANGENT_E);
           vis.graph.updateUpperLabel(pl1, nextlStr);
           vis.graph.updateUpperLabel(pr1, prevrStr);
           vis.graph.colorEdge(pl, pl1, colorsCH.DCTANGENT_E);
        },
       [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id], depth
      );
      while (orientation(HL[l], HR[r], HR[(r - 1 + HR.length) % HR.length]) > 0
            || orientation(HR[r], HL[l], HL[(l + 1) % HL.length]) < 0) {
        if (orientation(HL[l], HR[r], HR[(r - 1 + HR.length) % HR.length]) > 0) {
          chunker.add('prev(r)->r->l',
             (vis, pl, pr, pr1) => {
               vis.graph.colorEdge(pr1, pr, colorsCH.DCCLOCKWISE_E);
               vis.graph.colorEdge(pr, pl, colorsCH.DCCLOCKWISE_E);
            },
           [HL[l].id, HR[r].id, HR[r1].id], depth
          );
          rold = r;
          r = r1;
          r1 = (r - 1 + HR.length) % HR.length;
          chunker.add('r<-prev(r)',
             (vis, pl, pr, pr1, pro) => {
               vis.graph.removeEdge(pr, pro);
               vis.graph.removeEdge(pro, pl);
               vis.graph.updateUpperLabel(pro, '');
               vis.graph.updateUpperLabel(pr, rStr);
               vis.graph.updateUpperLabel(pr1, prevrStr);
               vis.graph.addEdge(pr, pl);
               vis.graph.removeEdgeColor(pr, pro);
               vis.graph.colorEdge(pr, pl, colorsCH.DCTANGENT_E);
               vis.graph.colorEdge(pr1, pr, colorsCH.DCTANGENT_E);
            },
           [HL[l].id, HR[r].id, HR[r1].id, HR[rold].id], depth
          );
        } else {
          chunker.add('prev(r)->r->l',
             (vis, pl, pr, pr1) => {
               vis.graph.colorEdge(pr1, pr, colorsCH.DCANTICLOCK_E);
               vis.graph.colorEdge(pr, pl, colorsCH.DCANTICLOCK_E);
            },
           [HL[l].id, HR[r].id, HR[r1].id], depth
          );
        }
        if (orientation(HR[r], HL[l], HL[(l + 1) % HL.length]) < 0) {
          chunker.add('r->l->next(l)',
             (vis, pl, pr, pl1, pr1, pro) => {
               vis.graph.removeEdgeColor(pro, pr);
               vis.graph.colorEdge(pr1, pr, colorsCH.DCTANGENT_E);
               vis.graph.colorEdge(pr, pl, colorsCH.DCCLOCKWISE_E);
               vis.graph.colorEdge(pl, pl1, colorsCH.DCCLOCKWISE_E);
            },
           [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id, HR[rold].id], depth
          );
          lold = l;
          l = l1;
          l1 = (l + 1) % HL.length;
          chunker.add('l<-next(l)',
             (vis, pl, pr, pl1, plo) => {
               vis.graph.updateUpperLabel(plo, '');
               vis.graph.updateUpperLabel(pl, lStr);
               vis.graph.updateUpperLabel(pl1, nextlStr);
               vis.graph.removeEdge(pr, plo);
               vis.graph.removeEdge(plo, pl);
               vis.graph.addEdge(pr, pl);
               vis.graph.colorEdge(pr, pl, colorsCH.DCTANGENT_E);
               vis.graph.colorEdge(pl, pl1, colorsCH.DCTANGENT_E);
            },
           [HL[l].id, HR[r].id, HL[l1].id, HL[lold].id], depth
          );
        } else {
          chunker.add('r->l->next(l)',
             (vis, pl, pr, pl1, pr1, pro) => {
               vis.graph.removeEdgeColor(pro, pr);
               vis.graph.colorEdge(pr1, pr, colorsCH.DCTANGENT_E);
               vis.graph.colorEdge(pr, pl, colorsCH.DCANTICLOCK_E);
               vis.graph.colorEdge(pl, pl1, colorsCH.DCANTICLOCK_E);
            },
           [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id, HR[rold].id], depth
          );
        }
        chunker.add('upperWhile',
           (vis, pl, pr, pl1, pr1, plo) => {
             vis.graph.updateUpperLabel(pl, lStr); // l or r changed; reset both
             vis.graph.updateUpperLabel(pr, rStr);
             vis.graph.updateUpperLabel(pl1, nextlStr);
             vis.graph.updateUpperLabel(pr1, prevrStr);
             vis.graph.removeEdgeColor(pl, plo);
             vis.graph.colorEdge(pr1, pr, colorsCH.DCTANGENT_E);
             vis.graph.colorEdge(pr, pl, colorsCH.DCTANGENT_E);
             vis.graph.colorEdge(pl, pl1, colorsCH.DCTANGENT_E);
          },
         [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id, HL[lold].id], depth
        );
      }
      chunker.add('AssignUhlUhr',
         (vis, pl, pr, pl1, pr1) => {
           vis.graph.updateUpperLabel(pl, uhlStr);
           vis.graph.updateUpperLabel(pl1, '');
           vis.graph.updateUpperLabel(pr, uhrStr);
           vis.graph.updateUpperLabel(pr1, '');
           vis.graph.removeEdgeColor(pr1, pr);
           vis.graph.removeEdgeColor(pr, pl);
           vis.graph.removeEdgeColor(pl, pl1);
        },
       [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id], depth
      );
      return [l, r];
    }

    // return l and r points on lower tangent
    // We don't skip over co-linear point but return the innermost tangent
    // points (there are some subtle termination issues otherwise)
    // Points on upper tangent are passed in so animation is more
    // intuitive (eg, next(r) in the animation may be point upperL in
    // the left hull because the actual next(r) has been eliminated from
    // the hull in the upper tangent calculation)
    function findLowerTangent(HL, HR, upperL, upperR, depth) {
      let r1id; // used with upperL/upperR fudge
      let l1id;
      let l = rightmostIndex(HL);
      chunker.add('assignLL',
         (vis, pl) => {
           vis.graph.updateLowerLabel(pl, lStr);
        },
       [HL[l].id], depth
      );

      let r = leftmostIndex(HR);
      chunker.add('assignRL',
         (vis, pl, pr) => {
           vis.graph.updateLowerLabel(pr, rStr);
           vis.graph.addEdge(pl, pr);
           vis.graph.colorEdge(pl, pr, colorsCH.DCTANGENT_E);
        },
       [HL[l].id, HR[r].id], depth
      );

    
      // r1/l1 are the next/previous nodes; we also need to old
      // versions of r/l these for cleaning up colors etc
      let r1 = (r + 1) % HR.length;
      let rold = r;
      let l1 = (l - 1 + HL.length) % HL.length;
      let lold = l;
      l1id = HL[l1].id;
      r1id = HR[r1].id;
      chunker.add('lowerWhile',
         (vis, pl, pr, pl1, pr1) => {
           vis.graph.colorEdge(pr, pr1, colorsCH.DCTANGENT_E);
           vis.graph.updateLowerLabel(pl1, prevlStr);
           vis.graph.updateLowerLabel(pr1, nextrStr);
           vis.graph.colorEdge(pl1, pl, colorsCH.DCTANGENT_E);
        },
       [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id], depth
      );
      while (orientation(HL[l], HR[r], HR[(r + 1) % HR.length]) < 0
            || orientation(HR[r], HL[l], HL[(l - 1 + HL.length) % HL.length]) > 0) {
        if (orientation(HR[r], HL[l], HL[(l - 1 + HL.length) % HL.length]) > 0) {
          chunker.add('prev(l)->l->r',
             (vis, pl, pr, pl1) => {
               vis.graph.colorEdge(pl1, pl, colorsCH.DCCLOCKWISE_E);
               vis.graph.colorEdge(pl, pr, colorsCH.DCCLOCKWISE_E);
            },
           [HL[l].id, HR[r].id, HL[l1].id], depth
          );
          lold = l;
          l = l1;
          l1 = (l - 1 + HL.length) % HL.length;
          // see comment for r1 case below
          if (l === upperL)
            l1id = HR[upperR].id;
          else
            l1id = HL[l1].id;
          chunker.add('l<-prev(l)',
             (vis, pl, pr, pl1, plo) => {
               vis.graph.removeEdge(plo, pr);
               vis.graph.removeEdge(pl, plo);
               vis.graph.updateLowerLabel(plo, '');
               vis.graph.updateLowerLabel(pl, lStr);
               vis.graph.updateLowerLabel(pl1, prevlStr);
               vis.graph.addEdge(pl, pr);
               vis.graph.removeEdgeColor(pl, plo);
               vis.graph.colorEdge(pl, pr, colorsCH.DCTANGENT_E);
               vis.graph.colorEdge(pl1, pl, colorsCH.DCTANGENT_E);
            },
           [HL[l].id, HR[r].id, l1id, HL[lold].id], depth
          );
        } else {
          l1id = HL[l1].id;
          chunker.add('prev(l)->l->r',
             (vis, pl, pr, pl1) => {
               vis.graph.colorEdge(pl1, pl, colorsCH.DCANTICLOCK_E);
               vis.graph.colorEdge(pl, pr, colorsCH.DCANTICLOCK_E);
            },
           [HL[l].id, HR[r].id, l1id], depth
          );
        }
        if (orientation(HL[l], HR[r], HR[(r + 1) % HR.length]) < 0) {
          chunker.add('l->r->next(r)',
             (vis, pl, pr, pl1, pr1, plo) => {
               vis.graph.removeEdgeColor(plo, pl);
               vis.graph.colorEdge(pl1, pl, colorsCH.DCTANGENT_E);
               vis.graph.colorEdge(pl, pr, colorsCH.DCCLOCKWISE_E);
               vis.graph.colorEdge(pr, pr1, colorsCH.DCCLOCKWISE_E);
            },
           [HL[l].id, HR[r].id, l1id, HR[r1].id, HL[lold].id], depth
          );
          rold = r;
          r = r1;
          r1 = (r + 1) % HR.length;
          // above (and similar l1 case above) may be
          // tricky - this r1 may have been eliminated from the hull
          // (when finding the upper tangent), so r1 should be
          // really be the first point added to the hull from L. This
          // can only happen(?) when we have found the final r value so
          // it's not an issue for correctness, but it does affect the
          // animation. The directed edges suggest next(r) should be a
          // point on L, so we go with that.
          if (r === upperR)
            r1id = HL[upperL].id;
          else
            r1id = HR[r1].id;
          chunker.add('r<-next(r)',
             (vis, pl, pr, pr1, pro) => {
               vis.graph.updateLowerLabel(pro, '');
               vis.graph.updateLowerLabel(pr, rStr);
               vis.graph.updateLowerLabel(pr1, nextrStr);
               vis.graph.removeEdge(pl, pro);
               vis.graph.removeEdge(pro, pr);
               vis.graph.addEdge(pl, pr);
               vis.graph.colorEdge(pl, pr, colorsCH.DCTANGENT_E);
               vis.graph.colorEdge(pr, pr1, colorsCH.DCTANGENT_E);
            },
           [HL[l].id, HR[r].id, r1id, HR[rold].id], depth
          );
        } else {
          r1id = HR[r1].id;
          chunker.add('l->r->next(r)',
             (vis, pl, pr, pl1, pr1, plo) => {
               vis.graph.removeEdgeColor(plo, pl);
               vis.graph.colorEdge(pl1, pl, colorsCH.DCTANGENT_E);
               vis.graph.colorEdge(pl, pr, colorsCH.DCANTICLOCK_E);
               vis.graph.colorEdge(pr, pr1, colorsCH.DCANTICLOCK_E);
            },
           [HL[l].id, HR[r].id, l1id, r1id, HL[lold].id], depth
          );
        }
        chunker.add('lowerWhile',
           (vis, pl, pr, pl1, pr1, plo) => {
             vis.graph.updateLowerLabel(pl, lStr); // l or r changed; reset both
             vis.graph.updateLowerLabel(pr, rStr);
             vis.graph.updateLowerLabel(pl1, prevlStr);
             vis.graph.updateLowerLabel(pr1, nextrStr);
             // vis.graph.removeEdgeColor(pr, pl);
             // vis.graph.removeEdgeColor(pro, pr);
             vis.graph.colorEdge(pl1, pl, colorsCH.DCTANGENT_E);
             vis.graph.colorEdge(pl, pr, colorsCH.DCTANGENT_E);
             vis.graph.colorEdge(pr, pr1, colorsCH.DCTANGENT_E);
          },
         [HL[l].id, HR[r].id, l1id, r1id, HL[lold].id], depth
        );
      }
      chunker.add('AssignLhlLhr',
         (vis, pl, pr, pl1, pr1, pul, pur) => {
           vis.graph.updateLowerLabel(pl, lhlStr);
           vis.graph.updateLowerLabel(pl1, '');
           vis.graph.updateLowerLabel(pr, lhrStr);
           vis.graph.updateLowerLabel(pr1, '');
           vis.graph.removeEdgeColor(pr, pr1);
           vis.graph.removeEdgeColor(pl, pr);
           vis.graph.removeEdgeColor(pl1, pl);
        },
       [HL[l].id, HR[r].id, l1id, r1id, HL[upperL].id, HR[upperR].id], depth
      );

    /*
      // original code
      let done = false;
    
      while (!done) {
        done = true;
    
        // Move j counterclockwise on HR
        while (orientation(HL[i], HR[j], HR[(j + 1) % HR.length]) < 0) {
          j = (j + 1) % HR.length;
          done = false;
        }
    
        // Move i clockwise on HL
        while (orientation(HR[j], HL[i], HL[(i - 1 + HL.length) % HL.length]) > 0) {
          i = (i - 1 + HL.length) % HL.length;
          done = false;
        }
      }
    */
    
      return [l, r];
    }

    // add chunks for dealing with three colinear points
    // points must be in hull (counterclockwise) order!
    // str2 is the label on p2; it gets moved to p3 if label3 is true
    // otherwise it gets moved to p1
    function colinChunks(p1, p2, p3, label3, str2, bookmark1, bookmark2, isUpper, depth) {
      chunker.add(bookmark1,
         (vis, p1, p2, p3) => {
           vis.graph.colorEdge(p1, p2, colorsCH.DCCOLINEAR_E);
           vis.graph.colorEdge(p2, p3, colorsCH.DCCOLINEAR_E);
        },
       [p1, p2, p3], depth
      );
      chunker.add(bookmark2,
         (vis, p1, p2, p3, l3, upper) => {
           vis.graph.removeEdge(p1, p2);
           vis.graph.removeEdge(p2, p3);
           vis.graph.addEdge(p1, p3);
           if (upper) {
             vis.graph.updateUpperLabel(p2, '');
             if (l3)
               vis.graph.updateUpperLabel(p3, str2);
             else
               vis.graph.updateUpperLabel(p1, str2);
           } else {
             vis.graph.updateLowerLabel(p2, '');
             if (l3)
               vis.graph.updateLowerLabel(p3, str2);
             else
               vis.graph.updateLowerLabel(p1, str2);
           }
        },
       [p1, p2, p3, label3, isUpper], depth
      );
    }
    
    // ---------- Convex hull core ----------
   
    function mergeHulls(HL, HR, depth) {
    
      // Find upper and lower tangents
      const [ui, uj] = findUpperTangent(HL, HR, depth);
      const [li, lj] = findLowerTangent(HL, HR, ui, uj, depth);
    
      let hull = [];
      if (ui === li && lj === uj) {
        // special case when ui == li and lj == uj - *all* points are
        // colinear, with HL and HR both having two points
        // Assumes no duplicate points
        let inext = (ui + 1) % HL.length;
        let jnext = (uj + 1) % HR.length;
        hull.push(HL[inext]);
        hull.push(HR[jnext]);
        chunker.add('allColinear',
           (vis, pl, pr, pl1, pr1) => {
             // vis.graph.removeEdgeColor(pr, pr1);
             vis.graph.colorNode(pl, colorsCH.DCHULL_N);
             vis.graph.colorNode(pr, colorsCH.DCHULL_N);
             vis.graph.colorNode(pl1, colorsCH.DCHULL_N);
             vis.graph.colorNode(pr1, colorsCH.DCHULL_N);
             vis.graph.colorEdge(pl, pr, colorsCH.HULL_E);
          },
         [HL[ui].id, HR[uj].id, HL[inext].id, HR[jnext].id], depth
        );
        chunker.add('return2outer',
           (vis, pl, pr, pl1, pr1) => {
             vis.graph.removeEdge(pr, pr1);
             vis.graph.removeEdge(pr1, pr);
             vis.graph.removeEdge(pl, pl1);
             vis.graph.removeEdge(pl1, pl);
             vis.graph.removeEdge(pr, pl);
             vis.graph.removeEdge(pl, pr);
             vis.graph.colorNode(pl, undefined);
             vis.graph.colorNode(pr, undefined);
             vis.graph.addEdge(pl1, pr1);
             vis.graph.addEdge(pr1, pl1);
             vis.graph.updateUpperLabel(pl, '');
             vis.graph.updateUpperLabel(pr, '');
             vis.graph.updateUpperLabel(pl1, '');
             vis.graph.updateUpperLabel(pr1, '');
             vis.graph.updateLowerLabel(pl, '');
             vis.graph.updateLowerLabel(pr, '');
             vis.graph.updateLowerLabel(pl1, '');
             vis.graph.updateLowerLabel(pr1, '');
          },
         [HL[ui].id, HR[uj].id, HL[inext].id, HR[jnext].id], depth
        );
        return hull;
      } else {
        let i = ui;
        let iLast = li;
        let j = lj;
        let jLast = uj;
        let colin; // Colin the colinear point
        // deal with other colinear cases:
        // HR[uj], HL[ui], HL[ui+1] colinlear -> skip ui
        // HR[lj], HL[li], HL[li-1] colinlear -> skip li
        // HL[ui], HR[uj], HR[uj-1] colinlear -> skip uj
        // HL[li], HR[lj], HR[lj+1] colinlear -> skip lj
        colin = (i + 1) % HL.length;
        if (!orientation(HR[uj], HL[ui], HL[colin])) {
          colinChunks(HR[uj].id, HL[ui].id, HL[colin].id,
                      true, uhlStr, 'colinearRLN', 'updateRLN', true, depth);
          i = colin;
        }
        colin = (uj - 1 + HR.length) % HR.length;
        if (!orientation(HL[ui], HR[uj], HR[colin])) {
          colinChunks(HR[colin].id, HR[uj].id, HL[i].id,
                      false, uhrStr, 'colinearLRP', 'updateLRP', true, depth);
          jLast = colin;
        }
        colin = (lj + 1) % HR.length;
        if (!orientation(HL[li], HR[lj], HR[colin])) {
          colinChunks(HL[li].id, HR[lj].id, HR[colin].id,
                      true, lhrStr, 'colinearLRN', 'updateLRN', false, depth);
          j = colin;
        }
        colin = (li - 1 + HL.length) % HL.length;
        if (!orientation(HR[lj], HL[li], HL[colin])) {
          colinChunks(HL[colin].id, HL[li].id, HR[j].id,
                      false, lhlStr, 'colinearRLP', 'updateRLP', false, depth);
          iLast = colin;
        }
        // Collect hull points from HL between i -> iLast
        hull.push(HL[i]);
        chunker.add('initH',
           (vis, cp, nv) => {
             vis.graph.colorNode(cp, colorsCH.DCHULL_N);
               vis.graph.updateUpperLabel(cp, '');
               vis.graph.updateLowerLabel(cp, '');
          },
         [HL[i].id, numVertices], depth
        );
        while (i !== iLast) {
          i = (i + 1) % HL.length;
          hull.push(HL[i]);
          chunker.add('addUhl',
             (vis, cp) => {
               vis.graph.colorNode(cp, colorsCH.DCHULL_N);
               vis.graph.updateLowerLabel(cp, '');
            },
           [HL[i].id], depth
          );
        }
      
        // Collect hull points from HR between j -> jLast
        hull.push(HR[j]);
        if (j !== jLast) { // not the last point added
          chunker.add('addUhr0',
             (vis, cp) => {
               vis.graph.colorNode(cp, colorsCH.DCHULL_N);
               vis.graph.updateLowerLabel(cp, '');
            },
           [HR[j].id], depth
          );
        } else {
          chunker.add('addUhr0',
             (vis, cp, h, nv) => {
               vis.graph.updateLowerLabel(cp, '');
               vis.graph.updateUpperLabel(cp, '');
               for (let i = 0; i < nv; i++)
                 if (!h.some((p) => p.id === i))
                   vis.graph.colorNode(i, undefined);
               vis.graph.colorNode(cp, colorsCH.DCHULL_N);
            },
           [HR[j].id, hull, numVertices], depth
          );
        }
        while (j !== jLast) {
          j = (j + 1) % HR.length;
          hull.push(HR[j]);
          if (j !== jLast) { // not the last point added
            chunker.add('addUhr',
               (vis, cp) => {
                 vis.graph.updateUpperLabel(cp, '');
                 vis.graph.colorNode(cp, colorsCH.DCHULL_N);
              },
             [HR[j].id], depth
            );
          } else { // last point: remove colours of nodes not in hull
            chunker.add('addUhr',
               (vis, cp, h, nv) => {
                 vis.graph.updateUpperLabel(cp, '');
                 for (let i = 0; i < nv; i++)
                   if (!h.some((p) => p.id === i))
                     vis.graph.colorNode(i, undefined);
                 vis.graph.colorNode(cp, colorsCH.DCHULL_N);
              },
             [HR[j].id, hull, numVertices], depth
            );
          }
        }
      }

    // console.log('merged ', hull);
      chunker.add('returnHullRec',
         (vis) => {
        },
       [], depth
      );
      return hull;
    }

    // divide and conquer recursive main function
    function convexHullDC(points, depth) {
      chunker.add('CHDC',
         (vis, pts) => {
           colorNodes(vis, pts, 0, pts.length - 1, colorsCH.DCLEFT_N);
        },
       [points], depth
      );

      if (points.length <= 3) {
        // Base case: sort on counterclockwise from points[0] (lowest left-most)
        // + delete mid point if colinear
        let ccPoints = points.slice().sort((a, b) => -orientation(points[0], a, b));
        if (ccPoints.length === 1) {
          chunker.add('n<=3',
            (vis, pts) => {
              colorNodes(vis, pts, 0, pts.length - 1, colorsCH.DCHULL_N);
           },
           [ccPoints], depth
          );
          return ccPoints;
        } else if (ccPoints.length === 2) {
          chunker.add('n<=3',
             (vis, pts) => {
               // XX curved edges - not ideal?? nothing better?
               vis.graph.addEdge(pts[0].id, pts[1].id);
               vis.graph.addEdge(pts[1].id, pts[0].id);
               colorNodes(vis, pts, 0, pts.length - 1, colorsCH.DCHULL_N);
            },
           [ccPoints], depth
          );
          return ccPoints;
        } else if (orientation(ccPoints[0], ccPoints[1], ccPoints[2])) {
          chunker.add('n<=3',
             (vis, pts) => {
               vis.graph.addEdge(pts[0].id, pts[1].id);
               vis.graph.addEdge(pts[1].id, pts[2].id);
               vis.graph.addEdge(pts[2].id, pts[0].id);
               colorNodes(vis, pts, 0, pts.length - 1, colorsCH.DCHULL_N);
            },
           [ccPoints], depth
          );
          return ccPoints;
        } else { // three colinear points - remove middle one
          // Assumes no duplicate points
          chunker.add('n<=3',
             (vis, pts) => {
               // XX curved edges - not ideal?? nothing better?
               vis.graph.addEdge(pts[0].id, pts[2].id);
               vis.graph.addEdge(pts[2].id, pts[0].id);
            },
           [ccPoints], depth
          );
          return [ccPoints[0], ccPoints[2]];
        }
      }
    
      const mid = Math.floor(points.length / 2);
      chunker.add('mid',
         (vis, pts, m) => {
           colorNodes(vis, pts, m, pts.length - 1, colorsCH.DCRIGHT_N);
        },
       [points, mid], depth
      );
      chunker.add('preRecursiveL',
         (vis, pts, m) => {
           // undefined removes color
           colorNodes(vis, pts, m, pts.length - 1, undefined);
        },
       [points, mid], depth
      );
      const leftHull = convexHullDC(points.slice(0, mid), depth + 1);
      chunker.add('recursiveL',
         (vis, pts, m) => {
           colorNodes(vis, pts, m, pts.length - 1, colorsCH.DCRIGHT_N);
        },
       [points, mid], depth
      );
      chunker.add('preRecursiveR',
         (vis, pts, m) => {
           colorNodes(vis, pts, 0, m-1, undefined);
        },
       [points, mid], depth
      );
      const rightHull = convexHullDC(points.slice(mid), depth + 1);
      chunker.add('recursiveR',
         (vis, pts, m) => {
           colorNodes(vis, pts, 0, m-1, colorsCH.DCLEFT_N);
           colorNodes(vis, pts, m, pts.length - 1, colorsCH.DCRIGHT_N);
        },
       [points, mid], depth
      );
    
      let h = mergeHulls(leftHull, rightHull, depth);
      return h;
    }
    
    // top level function - calls recursive function
    function convexHull(coords, n) {
// console.log('initial coords', coords);
      // edge matrix is NxN matrix of edge weights, zero meaning no edge
      // Here we ignore edgeValueMatrix and create our own zero matrix
      let Zeros = new Array(n).fill(0);
      let E = new Array(n).fill(Zeros);
      let depth = 0;
      chunker.add('start',
         (vis, edgeArray, coordsArray) => {
           // directed graphs can be better for showing turns
           // but currently edges can get curved when there are hull
           // edges - seems OK though?
           vis.graph.directed(true);
           vis.graph.weighted(false);
           vis.graph.moveNodeFn(moveNode); // allows dragging of nodes
           vis.graph.set(edgeArray, Array.from({ length: n }, (v, k) => (k + 1)),coordsArray);
           vis.graph.dimensions.defaultNodeRadius = 12;
           vis.graph.dimensions.nodeRadius = 12;
           // XXX best avoid zoom if we can to avoid labels getting too
           // small etc(?)
           vis.graph.setZoom(0.7);
        },
         [E, coords], depth
        );

      // Sort by x-coordinate (and y for ties)
      // XXX currently nodes move; best turn off tweening, just
      // recompute numbering rather than swap points or whatever
      coords.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      coords = uniquePoints(coords); // we assume unique points in a couple of places
      if (n !== coords.length) {
        // duplicates -> better recompute some things!
        n = coords.length;
        numVertices = n;
        Zeros = new Array(n).fill(0);
        E = new Array(n).fill(Zeros);
      }
// console.log('unique coords', coords);
      chunker.add('sortP',
         (vis, edgeArray, coordsArray) => {
           vis.graph.set(edgeArray, Array.from({ length: n }, (v, k) => (k + 1)),coordsArray);
        },
         [E, coords], depth
        );

      // for the convex hull code we use arrays of points with x and y
      // coordinates plus an id (the index into the coords array, which
      // is *one less than* the displayed id)  XXX rename
      let points = new Array(n);
      for (let i = 0; i < n; i++) {
        points[i] = {x:coords[i][0], y:coords[i][1], id:i};
      }
      let h = convexHullDC(points, 0);
// console.log('FINAL CONVEX HULL', h);
      return h;
    }
    
    convexHull(coords, coords.length);

  }
  , 

};
