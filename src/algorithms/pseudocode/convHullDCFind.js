import parse from '../../pseudocode/parse';

export default parse(`

\\Note{
divide and conquer algm for convex hull
Some tricky cases with co-linear points for this algorithm!

Animation:
Can use scheme like top down merge sort:
Recursivve call -> color just nodes for this call
split -> two colors (+ maybe line separating halves if not clear???)
left recursive call -> hull in same color
right recursive call -> hull in same color
merge -> hull in apple

Use directed graphs to show counter-clockwise orientation of hull


XXX can we get upper and lower tangents to skip over colinear points ok
if we *first* test for all points colinear?  That would save the four
extra colinear checks.
Hmm, still get some tricky cases such as
{ x: 2, y: 4 }, { x: 2, y: 5 },   { x: 2, y: 6 }, { x: 3, y: 3 }
where we want to avoid { x: 2, y: 5 } in the hull returned.

Could add optional optimisation to remove points in quadralateral
but better to just have that for gift wrapping as complexity is ok here

Exercises etc

What goes wrong with co-linear points if we don't handle them specially?
...

Repeated scanning to find leftmost and rightmost points can be avoiding
if the recursive hull function returns the hull plus the leftmost and
rightmost points. Sketch (or fully implement) this algorithm.

The merge operation requires us to find the next clockwise and
counter-clockwise point and iterates through all points to construct the
merged hull. Suppose we represent a hull as a circular doubly linked list
instead of an array. This would allow the hull to be constructed without
scanning all points.  Revise the pseudo-code expansion for adding points
uhl...lhl and lhr...uhr (or fully implement) this variation.

\\Note}

\\Code{
Main
convexHull(P, n) // return convex hull of points P[1]...P[n] in a plane \\B start
\\In{
  sort P on x coordinates and remove duplicates \\B sortP
  \\Expl{ We break ties by comparing y coordinates. When the array is
    split in two, all points in the first half will be to the left of (or
    below) those in the right half.
  \\Expl}
  return convexHullDC(P, n) \\B returnHull
\\In}
// ==== main code ====
convexHullDC(P, n) // As above using divide and conquer, for sorted points \\B CHDC
\\In{
    if n <= 3 // base case \\B n<=3
    \\In{
        sort P in counter-clockwise order \\B sortP3
        \\Expl{ The merge operation after recursive calls assumes each hull
          is returned in counter-clockwise order.
          We can sort the points in the same was as the Graham Scan algorithm,
          using the cross product operation.
        \\Expl} 
        if there are three co-linear points, delete the middle one
        \\Expl{ We just retain the two outer points.  The hulls we return
          have the minimum number of points necessary; this is important
          for the merge operation.
        \\Expl} 
        return P \\B returnHullBase
    \\In}
    else // recursive case
    \\In{
      mid <- middle index of P \\B mid
      \\Expl{ This is used to distinguish the left and right halves. For
        odd numbers of nodes, here the right "half" has one more node
        than the left (it doesn't matter which side has the extra node).
      \\Expl} 
      hl <- convex hull of left half of P \\Ref RecCall1
      hr <- convex hull of right half of P \\Ref RecCall2
      h <- merge hl hr \\Ref merge
      \\Expl{ hl and hr will be non-intersecting convex hulls; this
        operation merges them together to form a single convex hull,
        typically with fewer points.
      \\Expl} 
      return h \\B returnHullRec
    \\In}
\\In} 
\\Code} 

\\Code{
RecCall1
// *Recursively* compute left hull: \\B preRecursiveL
hl <- convexHullDC(P[1]...P[mid], mid) \\B recursiveL
\\Code} 

\\Code{
RecCall2
// *Recursively* compute right hull: \\B preRecursiveR
hr <- convexHullDC(P[mid+1]...P[n], n-mid) \\B recursiveR
\\Code} 

\\Code{
merge
(uhl, uhr) <- the points on the "upper tangent" of hl and hr \\Ref UpperT
\\Expl{ The upper tangent is the line that touches the upper parts of
  hl and hr but doesn't cut through either polygon. uhl is a point on hl
  and uhr is a point on hr.
\\Expl} 
(lhl, lhr) <- the points on the "lower tangent" of hl and hr \\Ref LowerT
\\Expl{ The lower tangent is the line that touches the lower parts of
  hl and hr but doesn't cut through either polygon. lhl is a point on hl
  and lhr is a point on hr.
\\Expl} 
deal with co-linear points (if needed) \\Ref colinearMerge
\\Expl{ At this stage there may be colinear points on the hull, which we
  remove. If all points are colinear we remove the inner points and
  return the two outer points.
\\Expl} 
h <- points uhl...lhl \\Ref addLpoints
\\Expl{ This is the points in hl from uhl to lhl, going counter-clockwise.
\\Expl} 
add points lhr...uhr to h \\Ref addRpoints
\\Expl{ Add the points in hr from lhr to uhr, going counter-clockwise.
\\Expl} 
\\Code} 

\\Code{
UpperT
l <- top rightmost point of hl \\B assignLU
r <- bottom leftmost point of hr \\B assignRU
while path prev(r)->r->l->next(l) turns clockwise at r or l \\B upperWhile
\\Expl{ Here prev(r) means the point just before (clockwise of) r in hr
  and next(l) means the point just after (counter-clockwise of) l in hl.
  A clockwise turn would make the hull concave if this point was
  included in the hull so we skip the point and try the previous/next one.
  l will move up/left and r will move up/right until they form the tangent.
  Checking the direction of turns can be done using the cross product
  of vectors - see the simpler convex hull algorithms such as gift
  wrapping for more details.
\\Expl}
\\In{
  if prev(r)->r->l turns clockwise \\B prev(r)->r->l
  \\In{
    r <- prev(r) \\B r<-prev(r)
    \\Expl{ Move r up/right to the previous point on hr.
    \\Expl} 
  \\In}
  if r->l->next(l) turns clockwise \\B r->l->next(l)
  \\In{
    l <- next(l) \\B l<-next(l)
    \\Expl{ Move l up/left to the next point on hl.
    \\Expl} 
  \\In}
\\In}
(uhl, uhl) <- (l, r) // Upper Hull found \\B AssignUhlUhr

\\Code} 

\\Code{
LowerT
l <- top rightmost point of hl \\B assignLL
r <- bottom leftmost point of hr \\B assignRL
while path prev(l)->l->r->next(r) turns clockwise at l or r \\B lowerWhile
\\Expl{ Here prev(l) means the point just before (clockwise of) l in hl
  and next(r) means the point just after (counter-clockwise of) r in hr.
  A clockwise turn would make the hull concave if this point was
  included in the hull so we skip the point and try the previous/next one.
  l will move down/left and r will move down/right until they form the tangent.
  Checking the direction of turns can be done using the cross product
  of vectors - see the simpler convex hull algorithms such as gift
  wrapping for more details.
\\Expl}
\\In{
  if prev(l)->l->r turns clockwise \\B prev(l)->l->r
  \\In{
    l <- prev(l) \\B l<-prev(l)
    \\Expl{ Move l down/left to the previous point on hl (if this point has
      been eliminated when finding the upper hull we show the upper point
      on hr).
    \\Expl} 
  \\In}
  if l->r->next(r) turns clockwise \\B l->r->next(r)
  \\In{
    r <- next(r) \\B r<-next(r)
    \\Expl{ Move r down/right to the next point on hr (if this point has
      been eliminated when finding the upper hull we show the upper point
      on hl).
    \\Expl} 
  \\In}
\\In}
(lhl, lhl) <- (l, r) // Lower Hull found \\B AssignLhlLhr
\\Code} 

\\Code{
addLpoints
h <- [uhl] // start hull with uhl \\B initH
\\Expl{
  We add other points in counter-clockwise order.
\\Expl}
while uhl != lhl // add other hl points, up to lhl \\B whileUhl
\\In{
  uhl <- next counter-clockwise point in hl \\B uhlNext
  \\Expl{ If hl is represented as an array we need to wrap around at
    the end.
  \\Expl}  
  add uhl to h \\B addUhl
\\In}
\\Code} 

\\Code{
addRpoints
add uhr to h // add uhr \\B addUhr0
while lhr != uhr // add other hr points, up to uhr \\B whileUhr
\\In{
  lhr <- next counter-clockwise point in hr \\B uhrNext
  \\Expl{ If hr is represented as an array we need to wrap around at
    the end.
  \\Expl}
  add lhr to h \\B addUhr
\\In}
\\Code} 

\\Code{
colinearMerge
if all points in hl and hr are co-linear \\B allColinear
  \\Expl{ It is possible that hl and hr each contain two points, all
    these points are co-linear and the upper and lower tangents are
    the same.  In this case we return the lowest leftmost point of hl and the
    highest rightmost point of hr.
  \\Expl}
\\In{
  return the outer two points \\B return2outer
\\In}
if uhr, uhl and next(uhl) are co-linear \\B colinearRLN
\\Expl{ Here next(uhl) is the point just after (counter-clockwise of) uhl.
  We don't want to add the middle point (uhl) to the hull so we move
  set uhl to the outer point.
\\Expl}
\\In{
  uhl <- next(uhl) \\B updateRLN
\\In}
if prev(uhr), uhr and uhl are co-linear \\B colinearLRP
\\Expl{ Here prev(uhr) is the point just before (clockwise of) uhr.
  We don't want to add the middle point (uhr) to the hull so we move
  set uhr to the outer point.
\\Expl}
\\In{
  uhr <- prev(uhr) \\B updateLRP
\\In}
if lhl, lhr and next(lhr) are co-linear \\B colinearLRN
\\Expl{ Here next(lhr) is the point just after (counter-clockwise of) lhr.
  We don't want to add the middle point (lhr) to the hull so we move
  set lhr to the outer point.
\\Expl}
\\In{
  lhr <- next(lhr) \\B updateLRN
\\In}
if prev(lhl), lhl and lhr are co-linear \\B colinearRLP
\\Expl{ Here prev(lhl) is the point just before (clockwise of) lhl.
  We don't want to add the middle point (lhl) to the hull so we move
  set lhl to the outer point.
\\Expl}
\\In{
  lhl <- prev(lhl) \\B updateRLP
\\In}
\\Code} 

`);
