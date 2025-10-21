# Divide and Conquer Convex Hull Algorithm
---

The *convex hull* of a set of points in two dimensions is the smallest
convex polygon that contains all the points (this can be generalised
to three and more dimensions and has many applications). The polygon
is normally represented as the set of points that are the vertices
of the polygon and possibly some or all of the points that lie on the
edges but are not at vertices (for this coding only the vertices
are included).  Convex hulls can be computed efficiently using a *divide
and conquer* approach presented here.

## How It Works

1. **Preprocessing: Sort the points**  
   Points are first sorted on their *x* coordinate value. This is so we can easily divide the set of points into two in the recursive process described below.

2. **Base case: three or fewer points**  
   If there are three or fewer points the hull is computed directly and returned.

3. **Recursively find hulls for two subsets**  
   For more than three points, we divide the points as evenly as possible into those on the left and those on the right (based on the *x* coordinate values). The hulls of these two sets of points are computed recursively.  Note the two hulls will not intersect.

4. **Merge the two hulls**  
   The two hulls are merged by finding upper and lower "tangent" edges that connect the two hulls - lines that touch both hulls but do not intersect with either.  To find the upper tangent, the rightmost point of the left hull and leftmost point of the right hull are joined with an edge. If this edge is not the tangent, the next anticlockwise point on the left hull and/or next clockwise point on the right hull is chosen instead, until the edge is the tangent. The new upper part of the hull is then convex - a right to left scan of these edges has no clockwise turns. A similar process is used for the lower tangent.

## Checking for clockwise turns using vector products

One of the key operations compares three points, *a*, *b* and *c*,
to check if *c* is more clockwise than *b*, relative to *a*.  In other
words, if we go from *a* to *b*, do we turn right/clockwise to get to *c*
(alternatively, we may turn left/counterclockwise or the three points
may be colinear).  This can be done by using the *vector product* of the
two vectors *ab* and *ac*, defined as follows:

*(b.y-a.y) × (c.x-b.x) - (b.x-a.x) × (c.y-b.y)*

This is positive for a clockwise turn, negative for a counterclockwise
turn and zero for colinear points.  Note that many geometric algorithms
use mathematical concepts such as this. Ad hoc coding based on intuition
and typical examples is often buggy.  For example, code that uses division
is almost always incorrect because some special case leads to division
by zero. Even using vector products, convex hull code often has
subtle cases involving colinear points - see the CODE and MORE tab for details.


---

## Complexity

**Worst case**: O(n log n)


