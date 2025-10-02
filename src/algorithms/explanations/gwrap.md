# Convex Hull Gift Wrapping Algorithm (or Jarvis March)
---

The *convex hull* of a set of points in two dimensions is the smallest
convex polygon that contains all the points (this can be generalised
to three and more dimensions and has many applications). The polygon
is normally represented as the set of points that are the vertices
of the polygon and possibly some or all of the points that lie on the
edges but are not at vertices (for this coding some of those points may
be included).  The **Gift Wrapping Algorithm** (also called **Jarvis
March**) is conceptually the simplest of many algorithms for computing
convex hulls.

It’s called *gift wrapping* because the process is like stretching
a piece of string around the outside of the points — as if you were
wrapping a gift.  Here we wrap the string in a clockwise
direction.

## How It Works

1. **Start with the leftmost point**  
   This must be part of the convex hull.  Conceptually, attach the string to this point and pull it anywhere to the left.

2. **Pick the next hull point**  
   Conceptually, rotate the string clockwise until it touches the next point, making a line from the current point to the next point.  No points will be to the left of this line.  From the current point, the next point is the *most counterclockwise* relative to all others.  The next point is found by looping over all the points, keeping track of most counterclockwise point found so far.

3. **Repeat**  
   Move to the newly found point and repeat the selection until you return to the starting point.

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


## The Akl-Toussaint heuristic

The **Akl-Toussaint heuristic** is an additional step that can be added
to the start of any convex hull algorithm to eliminate some of the points
(and potentially speed up the algorithm).  Here it is used when there
are at least 10 points. The idea is to quickly find several points that
are defintely on the convex hull and delete all points that are strictly
inside the polygon formed by these hull points. The simplest version
(used here) picks the leftmost, rightmost, top and bottom points.
Points are inside this polygon if they are to the right/clockwise of
each edge as we scan the polygon in a clockwise direction.


---

## Complexity

- **Time**: O(nh) where:
  - n = number of points
  - h = number of points on the hull
- **Worst case time**: O(n²) (if most points are on the hull)


