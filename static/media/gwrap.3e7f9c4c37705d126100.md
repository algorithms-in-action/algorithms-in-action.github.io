
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

Geeks for Geeks Link: [**Convex Hull (Gift wrapping)**][G4GLink]


[G4GLink]: https://www.geeksforgeeks.org/XXX/

## Exercises/Exploration

What happens with this coding when there are multiple co-linear points
on the hull? How could the coding be changed so the computed hull
always contains the maximum/minimum number of points?

The current coding starts by finding the left-most point (minimum x
coordinate value). If there are multiple such points, the one with the
minimum y coordinate value is chosen - what could go wrong if this was
not done?

Consider the cases early in the scan where the "next" node is to the
right of the current node. The choice of next node will maximise the
gradient of the line between the current and next nodes. Use this to
derive a formula to choose between two candidates for the next node. How
does your formula compare with the formula used in the algorithm? What
could go wrong if a formula based on gradients was used?
