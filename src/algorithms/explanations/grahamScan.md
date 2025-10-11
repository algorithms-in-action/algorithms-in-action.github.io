# Graham Scan Algorithm for Convex Hulls
---

The *convex hull* of a set of points in two dimensions is the smallest
convex polygon that contains all the points (this can be generalised
to three and more dimensions and has many applications). The polygon
is normally represented as the set of points that are the vertices of
the polygon and possibly some or all of the points that lie on the
edges but are not at vertices (for this coding some of those points
may be included).  The **Graham Scan** algorithm is a quite simple but
reasonably efficient method for computing convex hulls.

## How It Works

XXX TODO

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

**Time**: O(n log n) where n is the number of points
