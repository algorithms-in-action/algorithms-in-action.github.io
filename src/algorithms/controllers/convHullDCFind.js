// Divide and conquer convex hull algorithm
// - adapting gift wrapping convex hull algorithm code XXX
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
    // Could remove/add labels using un/setPointerNode??
    // (Best add resetPointerNode?? XXX)
    // Currently use updateHeight also but that has some unfortunate
    // special cases (eg strings containing 't') so we use upper case
    // for now
    let lStr = 'L';
    let rStr = 'R';
    let nextlStr = 'NEXT(L)'; // could omit args??
    let nextrStr = 'NEXT(R)';
    let prevlStr = 'PREV(L)';
    let prevrStr = 'PREV(R)';

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

    function findUpperTangent(HL, HR, depth) {
// XXX add similar chunks for LowerTangent
      let l = rightmostIndex(HL);
      chunker.add('assignLU',
         (vis, pl) => {
           vis.graph.updateHeight(pl, lStr);
        },
       [HL[l].id], depth
      );
      let r = leftmostIndex(HR);
      chunker.add('assignRU',
         (vis, pl, pr) => {
           vis.graph.updateHeight(pr, rStr);
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
           vis.graph.updateHeight(pl1, nextlStr);
           vis.graph.updateHeight(pr1, prevrStr);
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
               vis.graph.updateHeight(pro, '');
               vis.graph.updateHeight(pr, rStr);
               vis.graph.updateHeight(pr1, prevrStr);
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
               vis.graph.updateHeight(plo, '');
               vis.graph.updateHeight(pl, lStr);
               vis.graph.updateHeight(pl1, nextlStr);
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
             vis.graph.updateHeight(pl, lStr); // l or r changed; reset both
             vis.graph.updateHeight(pr, rStr);
             vis.graph.updateHeight(pl1, nextlStr);
             vis.graph.updateHeight(pr1, prevrStr);
             // vis.graph.removeEdgeColor(pr, pl);
             vis.graph.removeEdgeColor(pl, plo);
             // XXX color now moved earlier
             vis.graph.colorEdge(pr1, pr, colorsCH.DCTANGENT_E);
             vis.graph.colorEdge(pr, pl, colorsCH.DCTANGENT_E);
             vis.graph.colorEdge(pl, pl1, colorsCH.DCTANGENT_E);
             // vis.graph.colorEdge(pl, pl1, colorsCH.DCTANGENT_E);
          },
         [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id, HL[lold].id], depth
        );
      }
      chunker.add('AssignUhlUhr',
         (vis, pl, pr, pl1, pr1) => {
           vis.graph.updateHeight(pl, '');
           vis.graph.updateHeight(pl1, '');
           vis.graph.updateHeight(pr, '');
           vis.graph.updateHeight(pr1, '');
           vis.graph.removeEdgeColor(pr1, pr);
           vis.graph.removeEdgeColor(pr, pl);
           vis.graph.removeEdgeColor(pl, pl1);
        },
       [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id], depth
      );
      return [l, r];
    }

    function findLowerTangent(HL, HR, depth) {
      let l = rightmostIndex(HL);
      let r = leftmostIndex(HR);
    
      chunker.add('lowerWhile',
         (vis, pl, pr) => {
           vis.graph.addEdge(pl, pr);
           vis.graph.colorEdge(pl, pr, colorsCH.HULL_E);
        },
       [HL[l].id, HR[r].id], depth
      );
      while (orientation(HL[l], HR[r], HR[(r + 1 + HR.length) % HR.length]) < 0
            || orientation(HR[r], HL[l], HL[(l - 1 + HL.length) % HL.length]) > 0) {
        let l1 = (l - 1 + HL.length) % HL.length;
        if (orientation(HR[r], HL[l], HL[(l - 1 + HL.length) % HL.length]) > 0) {
          chunker.add('prev(l)->l->r',
             (vis, pl, pr, pl1) => {
               vis.graph.colorEdge(pl1, pl, colorsCH.DCCLOCKWISE_E);
               vis.graph.colorEdge(pl, pr, colorsCH.DCCLOCKWISE_E);
            },
           [HL[l].id, HR[r].id, HL[l1].id], depth
          );
          chunker.add('l<-prev(l)',
             (vis, pl, pr, pl1) => {
               vis.graph.removeEdge(pl, pr);
               vis.graph.addEdge(pl1, pr);
               vis.graph.colorEdge(pl1, pr, colorsCH.HULL_E);
               // XXX better remove this later, not here
               vis.graph.removeEdge(pl1, pl);
            },
           [HL[l].id, HR[r].id, HL[l1].id], depth
          );
          l = l1;
        } else {
          chunker.add('prev(l)->l->r',
             (vis, pl, pr, pl1) => {
               vis.graph.colorEdge(pl1, pl, colorsCH.DCANTICLOCK_E);
               vis.graph.colorEdge(pl, pr, colorsCH.DCANTICLOCK_E);
            },
           [HL[l].id, HR[r].id, HL[l1].id], depth
          );
        }
        let r1 = (r + 1 + HR.length) % HR.length;
        if (orientation(HL[l], HR[r], HR[(r + 1 + HR.length) % HR.length]) < 0) {
          chunker.add('l->r->next(r)',
             (vis, pl, pr, pl1, pr1) => {
               vis.graph.removeEdgeColor(pl1, pl);
               vis.graph.removeEdgeColor(pl, pr);
               vis.graph.colorEdge(pl, pr, colorsCH.DCCLOCKWISE_E);
               vis.graph.colorEdge(pr, pr1, colorsCH.DCCLOCKWISE_E);
            },
           [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id], depth
          );
          chunker.add('r<-next(r)',
             (vis, pl, pr, pr1) => {
               vis.graph.removeEdge(pl, pr);
               vis.graph.addEdge(pl, pr1);
               vis.graph.colorEdge(pl, pr1, colorsCH.HULL_E);
               // XXX better remove this later, not here
               vis.graph.removeEdge(pr, pr1);
            },
           [HL[l].id, HR[r].id, HR[r1].id], depth
          );
          r = r1;
        } else {
          chunker.add('l->r->next(r)',
             (vis, pl, pr, pl1, pr1) => {
               vis.graph.removeEdgeColor(pl1, pl);
               vis.graph.removeEdgeColor(pl, pr);
               vis.graph.colorEdge(pl, pr, colorsCH.DCANTICLOCK_E);
               vis.graph.colorEdge(pr, pr1, colorsCH.DCANTICLOCK_E);
            },
           [HL[l].id, HR[r].id, HL[l1].id, HR[r1].id], depth
          );
        }
        chunker.add('lowerWhile',
           (vis, pl, pr, pr1) => {
             vis.graph.removeEdgeColor(pr, pr1);
             vis.graph.colorEdge(pl, pr, colorsCH.HULL_E);
          },
         [HL[l].id, HR[r].id, HR[r1].id], depth
        );
      }
      // XXX avoid this extra chunk - need to reset color somewhere though
        chunker.add('lowerWhile',
           (vis, pl, pr) => {
             vis.graph.removeEdgeColor(pl, pr);
          },
         [HL[l].id, HR[r].id], depth
        );
    
    /*
      // original code
      let done = false;
    
      while (!done) {
        done = true;
    
        // Move j counterclockwise on HR
        while (orientation(HL[i], HR[j], HR[(j + 1 + HR.length) % HR.length]) < 0) {
          j = (j + 1 + HR.length) % HR.length;
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
    
    // ---------- Convex hull core ----------
   
    function mergeHulls(HL, HR, depth) {
    
      // Find upper and lower tangents
      const [ui, uj] = findUpperTangent(HL, HR, depth);
      const [li, lj] = findLowerTangent(HL, HR, depth);
    
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
          },
         [HL[ui].id, HR[uj].id, HL[inext].id, HR[jnext].id], depth
        );
        return hull;
      } else {
        let i = ui;
        let iLast = li;
        let j = lj;
        let jLast = uj;
        let col;
        // deal with other colinear cases:
        // HR[uj], HL[ui], HL[ui+1] colinlear -> skip ui
        // HR[lj], HL[li], HL[li-1] colinlear -> skip li
        // HL[ui], HR[uj], HR[uj-1] colinlear -> skip uj
        // HL[li], HR[lj], HR[lj+1] colinlear -> skip lj
        col = (i + 1) % HL.length;
        if (!orientation(HR[uj], HL[ui], HL[col])) {
          // XXX duplicate for other three cases
          chunker.add('colinearRLN',
             (vis, pl, pr, pc) => {
               vis.graph.colorEdge(pr, pl, colorsCH.DCCOLINEAR_E);
               vis.graph.colorEdge(pl, pc, colorsCH.DCCOLINEAR_E);
            },
           [HL[i].id, HR[jLast].id, HL[col].id], depth
          );
          chunker.add('updateRLN',
             (vis, pl, pr, pc) => {
               vis.graph.removeEdge(pr, pl);
               vis.graph.removeEdge(pl, pc);
               vis.graph.addEdge(pr, pc);
            },
           [HL[i].id, HR[jLast].id, HL[col].id], depth
          );
          i = col;
        }
        if (!orientation(HR[lj], HL[li], HL[(li - 1 + HL.length) % HL.length])) {
          iLast = (li - 1 + HL.length) % HL.length;
        }
        if (!orientation(HL[ui], HR[uj], HR[(uj - 1 + HR.length) % HR.length])) {
          jLast = (uj - 1 + HR.length) % HR.length;
        }
        if (!orientation(HL[li], HR[lj], HR[(lj + 1) % HR.length])) {
          j = (j + 1) % HR.length;
        }
        // Collect hull points from HL between i -> iLast
        hull.push(HL[i]);
        chunker.add('initH',
           (vis, cp, nv) => {
             for (let i = 0; i < nv; i++)
               vis.graph.colorNode(i, undefined); // overkill
             vis.graph.colorNode(cp, colorsCH.DCHULL_N);
          },
         [HL[i].id, numVertices], depth
        );
        while (i !== iLast) {
          i = (i + 1) % HL.length;
          hull.push(HL[i]);
          chunker.add('addUhl',
             (vis, cp) => {
               vis.graph.colorNode(cp, colorsCH.DCHULL_N);
            },
           [HL[i].id], depth
          );
        }
      
        // Collect hull points from HR between j -> jLast
        hull.push(HR[j]);
        chunker.add('addUhr0',
           (vis, cp) => {
             vis.graph.colorNode(cp, colorsCH.DCHULL_N);
          },
         [HR[j].id], depth
        );
        while (j !== jLast) {
          j = (j + 1) % HR.length;
          hull.push(HR[j]);
          chunker.add('addUhr',
             (vis, cp) => {
               vis.graph.colorNode(cp, colorsCH.DCHULL_N);
            },
           [HR[j].id], depth
          );
        }
      }

/*
     // XXX should be able to delete this chunk when other chunks
     // color things properly
     chunker.add('whileUhr',
        (vis, hl, hr, h, nv) => {
          for (let i = 0; i < nv; i++)
            vis.graph.colorNode(i, undefined); // overkill
          // colorNodes(vis, hl, 0, hl.length-1, undefined);
          // colorNodes(vis, hr, 0, hr.length-1, undefined);
          colorNodes(vis, h, 0, h.length-1, colorsCH.DCHULL_N);
       },
      [HL, HR, hull, numVertices], depth
     );
*/
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
               // XXX curved edges - not ideal??
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
               // XXX curved edges - not ideal??
               vis.graph.addEdge(pts[0].id, pts[2].id);
               vis.graph.addEdge(pts[2].id, pts[0].id);
            },
           [ccPoints], depth
          );
          return [ccPoints[0], ccPoints[2]];
        }
      }
    
      // XXX NQR re pseudocode
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
           // XXX directed graphs can be better for showing turns
           // but currently edges can get curved when there are hull
           // edges (could remove the hull edges temporarily and then
           // put them back or just revert to undirected)
           vis.graph.directed(true);
           vis.graph.weighted(false);
           vis.graph.moveNodeFn(moveNode); // allows dragging of nodes
           vis.graph.set(edgeArray, Array.from({ length: n }, (v, k) => (k + 1)),coordsArray);
           vis.graph.dimensions.defaultNodeRadius = 15;
           vis.graph.dimensions.nodeRadius = 15;
           // XXX best avoid zoom if we can to avoid labels getting too
           // small etc(?)
           vis.graph.setZoom(0.6);
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
