
<style>
a:link {
    color: #1e28f0;
}
a:visited{
    color: #3c1478;
}
a:hover{
    color: #1e288c;
}
</style>

## Extra Info

-----

Geeks for Geeks Link: [**Convex Hull Algorithms**][G4GLink]


[G4GLink]: https://www.geeksforgeeks.org/dsa/convex-hull-algorithm/

## Exercises/Exploration

Look up other efficient convex hull algorithms and find out about the
many different convex hull algorithms invented over the years.

The AIA code in the recursive case requires finding the top rightmost
point of the left hull and the bottom leftmost point of the right hull.
A naive approach would be to scan through both hulls to find these
points. Another possibility is for the recursive calls to return the
hull, plus the top rightmost and bottom leftmost points.  Refine this
idea and code it.

One possible representation of hulls is arrays of points.  Another
possibility, which can reduce copying of data, is "circular" lists of
points.  Have a go at refining this idea and coding it in an appropriate
programming language.

Write your own code to find upper and/or lower tangents that skips over
colinear points, so they don't have to be dealt with specially later as
the AIA code does. Watch out for infinite loops! What are the tricky
cases and how did you deal with them? Look for code online and/or get
an AI system to write code and see how the problem is solved (or not).
Other than colinear points, what other differences are there compared to
the AIA code? What are the advantages and disadvantages of the AIA
coding? Note: in developing the AIA code we were were not satisfied
with code we could find online so we used ChatGPT to write some code
then made adjustments (and fixed some bugs).

In finding the *lower* tangent, the AIA pseudocode refers to **prev(l)**.
There are cases where the previous element in the left hull has been
eliminated as a possible member of the merged hull and the **prev(l)**
label in the animation is on the **uhr** node, on the *right* hull.  Can you
find a reason why *either* the previous (eliminated) element in the left
hull *or* **uhr** could be used without affecting the algorithm? Note:
the equivalent also happens for **next(r)**.

