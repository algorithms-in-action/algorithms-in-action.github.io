# Graham Scan Algorithm for Convex Hulls
---

The *convex hull* of a set of points in two dimensions is the smallest
convex polygon that contains all the points (this can be generalised
to three and more dimensions and has many applications). The polygon
is normally represented as the set of points that are the vertices of
the polygon and possibly some or all of the points that lie on the
edges but are not at vertices (for this coding some of those points
may be included).  The **Graham Scan** algorithm is a quite simple
but reasonably efficient method for computing convex hulls.  It works
by **sorting points by angle** and then constructing the hull by adding
the points to the hull in sorted order, removing non-convex points using
stack-like operations.

## How It Works

1. **Find the anchor point**  
   Choose the point with the lowest x-coordinate (and lowest y if there’s a tie).  
   This point is guaranteed to be on the hull.

2. **Sort points by polar angle**  
   Sort the remaining points by the angle they make with the anchor point
and the x-axis.  The points will be considered in this order, resulting in a
counter-clockwise scan.

3. **Traverse and build the hull**  
   Use a list of points to keep track of the hull vertices, starting the the lowest angle point plus the anchor point.
   For each point:
   - Add the point to the front of the list
   - If the front of the list has three points that are not **convex** (a counter-clockwise scan doesn't result in a **left turn**), delete the middle point from the list and repeat this step.

4. **Complete the hull**  
   When all points are processed, the list contains the vertices of the convex hull in counter-clockwise order, starting with the anchor point.


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
subtle cases involving colinear points - see the MORE tab for details.


---

## Complexity

- **Time**: O(n log n) — dominated by the sorting step  
- **Space**: O(n) for the stack

