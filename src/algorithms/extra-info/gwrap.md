
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

What happens with this coding when there are multiple co-linear points
on the hull? How could the coding be changed so the computed hull
always contains the maximum/minimum number of points?

The current coding starts by finding the left-most point (minimum x
coordinate value). If there are multiple such points, the one with the
minimum y coordinate value is chosen - what could go wrong if an
arbitrary one of these points was chosen?  Similarly, when choosing the
next point, there can be multiple points with the same minimal clockwise
rotation from the current point. The current code picks the one with the
smallest point/node number; what could happen if another choice was
made?

Consider the cases early in the scan where the "next" node is to the
right of the current node, **p**. The choice of next node will maximise the
gradient of the line between the current and next nodes. Use this to
derive a test to choose between nodes **i** and **q** for the next node.
Does your test make sense in the later parts of the scan where the next
node is to the left of **p**?
How does your test compare with the test used in the algorithm? What
could go wrong if a formula based on gradients was used?

Some versions of the Akl-Toussaint heuristic use an octagon instead of a
quadralateral.  What extra points could be used? Could this idea be
extended further and, if so, what are the advantages and disadvantages?

For the Akl-Toussaint heuristic implemented here, we skip (i,j) pairs
where i = j (for example, when the leftmost point is also the highest
point). What are the consequences of not doing this? What is done with
colinear points and what alternatives are there?

