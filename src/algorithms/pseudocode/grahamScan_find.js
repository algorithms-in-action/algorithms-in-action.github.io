import parse from '../../pseudocode/parse';

export default parse(`

\\Note{
Graham scan algm for convex hull, draft
This version uses a list rather than a "stack" - a bit simpler I think
XXX use h rather than H??

Could add optional optimisation to remove points in quadralateral
but better to just have that for gift wrapping as complexity is ok here
\\Note}

\\Code{
Main
grahamScan(P, n) // return convex hull of points P[1]...P[n] in a plane \\B start
\\In{
    if n <= 3 \\B n<=3
    \\In{
        return the set of all points
        \\Expl{ n < 3 could be considered an error, depending on how
          flexible our definition of convex hull is.
        \\Expl}
    \\In}
    p1 <- point with min. X value (min. Y if there are ties) \\B minX
    \\Expl{ We scan through all points to find the lowest leftmost point.
    \\Expl}
    sort P on how "counter-clockwise" each point is from p1 \\B sort
    \\Expl{ If there are ties, points closer to p1 are put first.
      A point p, where the gradient of the line from p1 to p is small, comes
      before points where the gradient is larger. Any comparison-based
      sorting algorithm could potentially be used. P[1] will be p1.
      The animation re-numbers the points so P[i] = i, for all i.
    \\Expl}
    H <- list [P[2], p1] // hull is the first two points initially \\B initH
    \\Expl{ H contains points that form a convex hull for the first i
      points (initially i=2) in the (sorted) list of points. The most
      recently added point is at the front of the list. Here we use array
      notation to refer to elements of H, with H[1] the first element.
    \\Expl}
    for i <- 3 to n // for each remaining point \\B forI
    \\Expl{ For each remaining point P[i], in counter-clockwise order, we add
      P[i] to the convex hull H and remove any points that would not make the hull
      convex.
    \\Expl}
    \\In{
        Add P[i] to H (at the front of the list, H[1]) \\B addP
        \\Note{ Use same color for all points in H.  Best also highlight
          all points to be removed here for case where removePoints isn't
          expanded? (might require some repeated code in controller).
        \\Note}
        Remove non-convex points from H \\Ref removePoints
        \\Expl{ Adding P[i] may make one or more points just before P[i] no
          longer convex. We delete these points from H.
        \\Expl}
    \\In} 
    return H \\B returnH
\\In} 
\\Code} 

\\Code{
removePoints
while H[3]->H[2]->H[1] is not a counter-clockwise turn \\Ref whileTest
\\Expl{ The sequences of edges from p1 must have counter-clockwise turns
  at each point. If the most recent three points added are not
  counter-clockwise, the middle point is removed.
\\Expl} 
\\In{
    remove H[2] \\B removeH2
    \\Expl{ P[i] (in H[1]) stays in the hull but the previous point (H[2]) is
      removed as it is not convex.
    \\Expl}
\\In}
\\Code} 

\\Code{
whileTest
// Remove while the cross product of these two vectors is <= 0
// (or H only has 2 points)
while H length > 2 & (H[2].y-H[3].y)*(H[1].x-H[2].x) - (H[2].x-H[3].x)*(H[1].y-H[2].y) <= 0 \\B whileNotCC
\\Expl{ See the "BACKGROUND" tabs for more details. Code in
  geometric algorithms often has cryptic bits like this based on
  mathematical results from geometry. For many operations, the most
  intuitive coding involves division and is actually buggy because 
  there can be cases where the divisor is zero.
\\Expl}
\\Code} 

\\Note{
// This code is from geeks4geeks, Modified by Lee Naish
// Graham scan convex hull algorithm
// XXX may want to remove duplicate points

// Class to represent a point
// XXX may want to change this for consistency with other CH algorithms
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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

// Function to find the convex hull of a set of points
function findConvexHull(points) {
    const n = points.length;

    // Convex hull is not possible if there are fewer than 3 points
    // XXX
    // if (n < 3) return [[-1]];
    if (n < 3) return points;

    // Convert input array to Point objects
    let a = points.map(p => new Point(p[0], p[1]));

    // Find the point with the lowest y-coordinate (and leftmost if tie)
    const p0 = a.reduce((min, p) => 
        (p.y < min.y || (p.y === min.y && p.x < min.x)) ? p : min, a[0]);

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

    // If fewer than 3 points remain, hull is not possible
    // XXX not needed? (can return all)
    if (m < 3) return [[-1]];

    // Initialize the convex hull stack with first two points
    const st = [a[0], a[1]];

    // Process the remaining points
    for (let i = 2; i < m; i++) {

        // While the last three points do not make a left turn, pop the middle one
        // XXX while (st.length > 1 && orientation(st[st.length - 2], st[st.length - 1], a[i]) >= 0) {
        while (st.length > 1 && orientation(st[st.length - 2], st[st.length - 1], a[i]) <= 0) {
            console.log('Pop ', st[st.length - 2].x, st[st.length - 2].y, st[st.length - 1].x, st[st.length - 1].y, a[i].x, a[i].y);
            st.pop();
        }

        // Add current point to stack
        st.push(a[i]);
    }

    // Final validation: if fewer than 3 points in stack, hull is not valid
    // XXX not needed? (can return all)
    if (st.length < 3) return [[-1]];

    // Convert hull points to [x, y] arrays
    return st.map(p => [Math.round(p.x), Math.round(p.y)]);
}

// Test case
/*
const points = [
     [0, 0], [1, -4], [-1, -5], [-5, -3], [-3, -1],
    [-1, -3], [-2, -2], [-1, -1], [-2, -1], [-1, 1]
];
*/
// a few cases where there are ties in the sorting - all work without
// removing points 
const points = [
     // [2, 1], [0, 0], [4, 0], [5, 0], [1, 0], [6, 0], [3, 5],
     // [3, 7], [0, 0], [2, 2], [5, 5], [1, 0], [6, 6], [4, 4],
     [3, 7], [0, 0], [0, 2], [5, 5], [0, 2], [0, 1], [0, 3], [0, 6], [0, 4],
    [1, 2], [2, 4]
];

// Compute the convex hull
const hull = findConvexHull(points);

// Output the result
if (hull.length === 1 && hull[0][0] === -1) {
    console.log(-1);
} else {
    hull.forEach(point => {
        console.log(point[0], point[1]);
    });
}
\\Note}


`);
