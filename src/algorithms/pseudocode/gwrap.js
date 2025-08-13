import parse from '../../pseudocode/parse';

export default parse(`

\\Note{
Gift wrapping/Jarvis algm for convex hull
XXX probably needs more bookmarks

Includes sketch of optional optimisation - ignore initially, maybe fill in
later and have option selected like path compression in union find algm.

Should be able to use graph package (disable edge input; maybe make
nodes smaller); add/delete edges during algorithm execution.
For hull/wrapper/"string", create extra temp node far away so it's invisible
with normal zoom and move it around so its colinear with most recently added
edge (at first step it will be far above the leftmost point)
\\Note}

\\Code{
Main
giftWrap(P, n) // return convex hull of points P[0]...P[n-1] in a plane \\B start
\\In{
    if n <= 3
    \\In{
        return the set of all points // n < 3 could be considered an error \\B returnAll
    \\In}
    hull <- Empty // Initialize hull to the empty set of points
    minX <-  point with min. X value \\B minX
    \\Expl{ We could choose any point guaranteed to be on the convex
        hull. Here we use a point with the minimal X coordinate.  We
        scan through all points to find it. If there are multiple points
        with the minimal X coordinate we choose one with a minimal Y coordinate.
    \\Expl}
    p <- minX // initialize current point; "string" points left/up \\B initP
    \\Expl{ In the animation we show a line from p; you can think
        of this as a string we use to wrap around the points to form the
        convex hull.
    \\Expl}
    do
    \\In{
        add p to hull \\B addP
        \\Note{ Use color of p to indicate membership of hull.  Also q
          and i (not sure if two vars are equal or q/i are on hull...).
          Should also display vars next to (or in?) nodes. Should we
          also display their value elsewhere or is the graph enough?
        \\Note}
        q <- next point in clockwise "string" rotation \\Ref NextPoint
        \\Expl{ Keeping tension on the string, we rotate it clockwise
          around all the points until it touches the next point, q.
          Note: going from p to q to any other point x requires a clockwise
          turn.
        \\Expl}
        p <- q \\B p<-q
    \\In} 
    while p != minX // stop when we get back to the first node \\B whileP
    return hull \\B returnHull
\\In} 
\\Code} 

\\Note{ Alternative version of minX <-  point with min. X value
    (should be able to put this note above but parser is rubbish)
    Find point with min. X value (and optionally max X, min Y, max Y also)
    \\Expl{ We could choose any point guaranteed to be on the convex
        hull. Here we use a point with the minimal X coordinate.  We
        scan through all points to find it. During
        this scan we can optionally find other points guaranteed to be
        on the hull; here we choose points with extreme X or Y
        coordinates.
        If there are multiple points with the same extreme X or Y coordinates
        then the other coordinate is used to break the tie.
    \\Expl}
    Optionally remove points inside quadrilateral minX, maxY, maxX, minY \\Ref RemoveQuad
    \\Expl{ If we know several points that are definitely on the
        hull, any points strictly inside this polygon can be removed
        from consideration. This can speed up the rest of the algorithm.
    \\Expl}
\\Note}

\\Code{
NextPoint
// look for point q such that for no i, p->i->q is a clockwise turn
\\Expl{ If path p->i->q has a clockwise turn at i it means q is further
clockwise than i.  If no such i exists then q is the least clockwise
point after p.
\\Expl}
q <- (p + 1) mod n // initialise q to a point other than p \\B initQ
\\Expl{ Any point other than p will work.  Here we pick the next point
  in the array (or 0 if p is the last point).
\\Expl}
for i <- point in P \\B assignI
\\Expl{ We loop over all points. We could ignore point p but it
does no harm. The path p->p->q is considered straight. Geometric
algorithms often have tricky cases such as this.  Another subtlety is
the ordering of the points - see the "MORE" tab for details.
\\Expl}
\\Note{
Better to have the following??
for i <- 0 to n-1
\\Note}
\\In{
    if p->i->q is a clockwise turn \\Ref piqClockwise
    \\In{
        q <- i \\B q<-i
        \\Expl{ i is less clockwise than q, so we update q.
        \\Expl}
    \\In}
\\In}
\\Code}

\\Code{
piqClockwise
// check if the cross product of vectors pi and pq is positive
if (i.y-p.y)*(q.x-i.x) - (i.x-p.x)*(q.y-i.y) > 0 \\B piqTest
\\Expl{ See the "BACKGROUND" and "MORE" tabs for more details. Code in
  geometric algorithms often has cryptic bits like this based on
  mathematical results from geometry. For many operations, the most
  intuitive coding involves division and is actually buggy because 
  there can be cases where the divisor is zero.
\\Expl}
\\Code}

\\Code{
removeQuad
XXX
for i <- point in P
\\In{
    if XXX
    \\In{
       remove point i
    \\In}
\\In}
if (i.y-p.y)*(q.x-i.x) - (i.x-p.x)*(q.y-i.y) > 0
\\Expl{ See the "BACKGROUND" and "MORE" tabs for more details. Code in
  geometric algorithms often has cryptic bits like this based on
  mathematical results from geometry. For many operations, the most
  intuitive coding involves division and is actually buggy because 
  there can be cases where the divisor is zero.
\\Expl}
\\Code} 

\\Note{
// Javascript program to find convex hull of a set of points. Refer 
// https://www.geeksforgeeks.org/dsa/orientation-3-ordered-points/
// for explanation of orientation()

class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

// constants for collinear/Clockwise/Counterclockwise
let GoStraight = 0;
let GoClockwise = 1;
let GoCounterCW = 2;

// To find orientation of ordered triplet (p, q, r).
    // The function returns following values
    // GoStraight --> p, q and r are collinear
    // GoClockwise --> Clockwise
    // GoCounterCW --> Counterclockwise
function orientation(p, q, r)
{
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val == 0) return GoStraight;
    return (val > 0)? GoClockwise: GoCounterCW;
}

// Prints convex hull of a set of n points.
function convexHull(points, n)
{
    // There must be at least 3 points
        if (n < 3) return;
       
        // Initialize Result
        let hull = [];
       
        // Find the leftmost point
        let l = 0;
        for (let i = 1; i < n; i++)
            if (points[i].x < points[l].x)
                l = i;
            // XXX if there are 2 points with minimal x value it doesn't
            // matter which we pick. If there are 3 such points then
            // potentially it may make a difference. We may be fussy about
            // what hull we should return with colinear points. Also the
            // termination condition and code for finding the next point
            // interracts with this - potentially the next point code could
            // miss the point chosen here (and choose a colinear one
            // instead), causing a loop.
            // Here we break ties by picking the min y coordinate value
            else if (points[i].x === points[l].x && points[i].y < points[l].y)
                l = i;
       
        // Start from (lowest) leftmost point, keep moving 
        // clockwise until reach the start point
        // again. This loop runs O(h) times where h is
        // number of points in result or output.
        let p = l, q;
        do
        {
        
            // Add current point to result
            hull.push(points[p]);
       
            // Search for a point 'q' such that 
            // orientation(p, q, x) is clockwise
            // for all points 'x'. The idea is to keep 
            // track of last visited most clock-
            // wise point in q. If any point 'i' is more 
            // clock-wise than q, then update q.
            // XXX above NQR with colinear points on hull
            // want q s.t. for no i, p->i->q is clockwise
            q = (p + 1) % n;
              
            for (let i = 0; i < n; i++)
            {
               // If i is more clockwise than
               // current q, then update q
               if (orientation(points[p], points[i], points[q])
                                                   == GoClockwise)
                   // XXX see comment above re choice of first point in
                   // colinear case
                   // Here, if there are multiple points with minimal
                   // clockwiseness (if thats a word), we pick the first one
                   // (min point number)
                   q = i;
            }
       
            // Now q is the most clockwise with
            // respect to p. Set p as q for next iteration, 
            // so that q is added to result 'hull'
            p = q;
       
        } while (p != l);  // While we don't come to first 
                           // point
       
        // Print Result
        for (let temp of hull.values())
            console.log("(" + temp.x + ", " +
                                temp.y + ")");
}

/* Driver program to test above function */
let points = new Array(7);
// points[0] = new Point(0, 3);
points[0] = new Point(0, 2);
points[1] = new Point(2, 3);
// points[1] = new Point(2, 3);
points[2] = new Point(1, 1);
points[3] = new Point(2, 1);
points[4] = new Point(3, 0);
points[5] = new Point(0, 0);
points[6] = new Point(3, 3);

let n = points.length;
convexHull(points, n);

// This code is contributed by avanitrachhadiya2155
// Modified by Lee Naish
\\Note}


`);
