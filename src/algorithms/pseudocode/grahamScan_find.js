import parse from '../../pseudocode/parse';

export default parse(`

\\Note{
Gift wrapping/Jarvis algm for convex hull
XXX maybe change so we wrap counter-clockwise for consistency?
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
giftWrap(P, n) // return convex hull of points P[1]...P[n] in a plane \\B start
\\In{
    if n <= 3 \\B n<=3
    \\In{
        return the set of all points \\B returnAll
        \\Expl{ n < 3 could be considered an error, depending on how
          flexible our definition of convex hull is.
        \\Expl}
    \\In}
    hull <- Empty // Initialize hull to the empty set of points
    minX <- point with min. X value (optionally minY, maxX, maxY also) \\B minX
    \\Expl{ We could choose any point guaranteed to be on the convex
        hull. Here we use a point with the minimal X coordinate.  We
        scan through all points to find it. If there are multiple points
        with the minimal X coordinate we choose one with a minimal Y coordinate.
        Other choices can potentially have subtle interractions with the
        other code and potentially affect termination - see the MORE tab.
        During this scan we can optionally also find the minimal Y point
        and maximal X and Y points; here we do so if n >= 10. These
        points are also on the convex hull.
    \\Expl}
    Optionally remove points inside polygon minX, maxY, maxX, minY \\Ref RemoveQuad
    \\Expl{ If we know several points that are definitely on the
        hull, any points strictly inside this polygon can (optionally)
        be removed from consideration. This can speed up the rest of
        the algorithm. Here we enable this option if n >= 10.
    \\Expl}
    p <- minX // current point + "string" initialization \\B initP
    \\Expl{ We start with p being the (bottom) leftmost point. In the
        animation we show a line from p; you can think
        of this as a string we use to wrap around the points to form the
        convex hull. It starts stretched anywhere to the left of p and
        will gradually be wrapped around the hull (here we wrap
        clockwise; either direction works).
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
          The animation here shows the string a little before it touches
          q (which is highlighted).
          Note: going from p to q to any other point x requires a
          clockwise turn.
        \\Expl}
        p <- q \\B p<-q
        \\Expl{ The animation here shows the string touching the node.
        \\Expl}
    \\In} 
    while p != minX // stop when we get back to the first node \\B whileP
    return hull \\B returnHull
\\In} 
\\Code} 

\\Code{
NextPoint
// look for point q such that for no i, p->i->q is a clockwise turn
\\Expl{ If path p->i->q has a clockwise turn at i it means q is further
clockwise than i.  If no such i exists then q is the least clockwise
point after p.
\\Expl}
q <- a point other than p // initialise q \\B initQ
\\Expl{ Any point other than p will work.  Here we pick the next point
  in the points array (or 1, if p is the last point).
\\Expl}
for i <- point in P \\B assignI
\\Expl{ We loop over all points to find the least clockwise point from p.
Here we skip points p and q to simplify the animation (the code works
without this simplification).  Here we scan the points
in order. If there are multiple points that have the same least
clockwise direction from p the ordering of points can be significant
- see the "MORE" tab for details.
\\Expl}
\\Note{
Better to have the following??
for i <- 1 to n
\\Note}
\\In{
    if p->i->q is a clockwise turn \\Ref piqClockwise
    \\Expl{ Path p->p->q is not considered a turn.
      Geometric algorithms often have tricky cases such as this.
    \\Expl}
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
RemoveQuad
for k <- point in P // Optional loop \\B forkinP
\\Expl{ We skip the points minX, maxY, minY and maxX.
  Here we use this option if n >= 10.
\\Expl}
\\In{
    if k is inside the polygon formed by the min/max points \\Ref insidePoly
    \\In{
       remove point k // k can't be on the convex hull \\B removek
    \\In}
\\In}
\\Code} 

\\Code{
insidePoly
// Below, i and j refer to consecutive points
// on a clockwise traversal of the polygon
if i->j->k turns clockwise for each (i, j) pair \\B allClockwise
\\Expl{ There are (up to) four (i, j) pairs: (minX, maxY), (maxY, maxX),
  (maxX, minY) and (minY, minX); we skip pairs where i = j.
  If k is clockwise (to the right of)
  each of these, it must be inside all four edges of the polygon.
  To test for clockwise turns we can use the cross product of vectors.
  See the code for finding the next point in the convex hull and the
  "BACKGROUND" and "MORE" tabs for more details.
\\Expl}
\\Code} 


`);
