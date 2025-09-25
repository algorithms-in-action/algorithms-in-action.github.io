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

// remove duplicate points from *sorted* list
function uniquePoints(points) {
  if (points.length === 0) return [];

  const unique = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = unique[unique.length - 1];
    const curr = points[i];
    if (curr.x !== prev.x || curr.y !== prev.y) {
      unique.push(curr);
    }
  }
  return unique;
}


// ---------- Tangent finding ----------

function findUpperTangent(HL, HR, depth) {
  let l = rightmostIndex(HL);
  let r = leftmostIndex(HR);
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
  while (orientation(HL[l], HR[r], HR[(r - 1 + HR.length) % HR.length]) > 0
        || orientation(HR[r], HL[l], HL[(l + 1) % HL.length]) < 0) {
    if (orientation(HL[l], HR[r], HR[(r - 1 + HR.length) % HR.length]) > 0)
      r = (r - 1 + HR.length) % HR.length;
    if (orientation(HR[r], HL[l], HL[(l + 1) % HL.length]) < 0)
      l = (l + 1) % HL.length;
  }
  return [l, r];
}

function findLowerTangent(HL, HR, depth) {
  let l = rightmostIndex(HL);
  let r = leftmostIndex(HR);

  while (orientation(HL[l], HR[r], HR[(r + 1 + HR.length) % HR.length]) < 0
        || orientation(HR[r], HL[l], HL[(l - 1 + HL.length) % HL.length]) > 0) {
    if (orientation(HR[r], HL[l], HL[(l - 1 + HL.length) % HL.length]) > 0)
      l = (l - 1 + HL.length) % HL.length;
    if (orientation(HL[l], HR[r], HR[(r + 1 + HR.length) % HR.length]) < 0)
      r = (r + 1 + HR.length) % HR.length;
  }

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

function convexHull(points) {

  // Sort by x-coordinate (and y for ties)
  points.sort((a, b) => a.x - b.x || a.y - b.y);
  points = uniquePoints(points); // we assume unique points in a couple of places
  // For the animation we add an id to each point, the index of the
  // point in the original array, starting at 1.  We create various new
  // arrays (eg convex hulls of subsets of the points) and use the id
  // fields to map to the animation. We do this after sorting etc; the
  // sorting basically renumbers the points left to right.
  for (let i = 0; i < points.length; i++)
    points[i].id = i + 1;
  return convexHullDC(points, 0);
}

function convexHullDC(points, depth) {
  if (points.length <= 3) {
    // Base case: sort on counterclockwise from points[0] (lowest left-most)
    // + delete mid point if colinear
    let ccPoints = points.slice().sort((a, b) => -orientation(points[0], a, b));
    if (ccPoints.length < 3 || orientation(ccPoints[0], ccPoints[1], ccPoints[2]))
      return ccPoints;
    else { // three colinear points - remove middle one
      // Assumes no duplicate points
      return [ccPoints[0], ccPoints[2]];
    }
  }

  const mid = Math.floor(points.length / 2);
  const leftHull = convexHullDC(points.slice(0, mid), depth + 1);
  const rightHull = convexHullDC(points.slice(mid), depth + 1);

  let h = mergeHulls(leftHull, rightHull, depth);
  return h;
}

function mergeHulls(HL, HR, depth) {

  // Find upper and lower tangents
  const [ui, uj] = findUpperTangent(HL, HR, depth);
  const [li, lj] = findLowerTangent(HL, HR, depth);

  let hull = [];
  if (ui == li) {
    // special case when ui == li (and lj == uj) - *all* points are
    // colinear, with HL and HR both having two points
    // Assumes no duplicate points
    hull.push(HL[(ui + 1) % HL.length]);
    hull.push(HR[(uj + 1) % HR.length]);
  } else {
    let i = ui;
    let iLast = li;
    let j = lj;
    let jLast = uj;
    // deal with other colinear cases:
    // HR[uj], HL[ui], HL[ui+1] colinlear -> skip ui
    // HR[lj], HL[li], HL[li-1] colinlear -> skip li
    // HL[ui], HR[uj], HR[uj-1] colinlear -> skip uj
    // HL[li], HR[lj], HR[lj+1] colinlear -> skip lj
    if (!orientation(HR[uj], HL[ui], HL[(ui + 1) % HL.length])) {
      i = (i + 1) % HL.length;
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
    while (i !== iLast) {
      i = (i + 1) % HL.length;
      hull.push(HL[i]);
    }
  
    // Collect hull points from HR between j -> jLast
    hull.push(HR[j]);
    while (j !== jLast) {
      j = (j + 1) % HR.length;
      hull.push(HR[j]);
    }
  }

// console.log('merged ', hull);
  return hull;
}

// ---------- Test data ----------

const points = [
/*
  {x: 0, y: 0},
  {x: 1, y: 2},
  {x: 2, y: 1},
  {x: 2, y: 4},
  {x: 3, y: 3},
  {x: 4, y: 0},
  {x: 5, y: 2},
  {x: 3, y: -1},
  {x: 1, y: -2}
*/
    // Tricky case with multiple points with x=2
    // (breaks ChatGPT versions)
    {x: 0, y:  4},
    {x: 0, y:  5},
    {x: 0, y:  0},
    {x: 0, y:  3},
    {x: 0, y:  1},
    {x: 0, y:  2},
    {x: 2, y:  3},
    {x: 2, y:  2},
    {x: 2, y:  1},
    {x: 2, y:  4},
    {x: 2, y:  5},
    {x: 2, y:  0},
    {x: 2, y:  6},
    {x: 3, y:  3},
    {x: 3, y:  3},
    {x: 3, y:  3},
/*
    // potentialy colinear after joining
    {x: 0, y:  0},
    {x: 0, y:  4},
    {x: 1, y:  4},
    {x: 3, y:  0},
    {x: 3, y:  4},
    {x: 4, y:  4},
*/
/*
    // all colinear, vertical
    {x: 3, y:  1},
    {x: 3, y:  2},
    {x: 3, y:  3},
    {x: 3, y:  4},
    {x: 3, y:  5},
    {x: 3, y:  6},
*/
/*
    // all colinear, diagonal
    {x: 1, y:  1},
    {x: 2, y:  2},
    {x: 3, y:  3},
    {x: 4, y:  4},
*/
/*
    // 4 colinear triples in last merge
    {x: 3, y:  1},
    {x: 3, y:  2},
    {x: 4, y:  1},
    {x: 4, y:  2},
    {x: 6, y:  1},
    {x: 6, y:  2},
    {x: 7, y:  1},
    {x: 7, y:  2},
*/

];


const hull = convexHull(points);
console.log("Convex Hull:");
console.log(hull);
