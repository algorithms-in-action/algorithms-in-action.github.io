# Convex Hull Gift Wrapping Algorithm (Jarvis March)
---

XXX chatGPT version - best review and enhance
best case time complexity wrong?
Should define convex hull, discuss vector products etc for clockwise
turns etc.

The **Gift Wrapping Algorithm** (also called **Jarvis March**) is a method for finding the **convex hull** of a set of points in 2D.  

It’s called *gift wrapping* because the process is like stretching a piece of string around the outside of the points — as if you were wrapping a gift — to enclose them all with the smallest convex polygon.

---

## How It Works

1. **Start with the leftmost point**  
   This must be part of the convex hull.

2. **Pick the next hull point**  
   From the current point, choose the point that is the most counterclockwise relative to all others.  
   In other words, for any other candidate point, it should always be to the left of the line from the current point to that candidate.

3. **Repeat**  
   Move to the newly found point and repeat the selection until you return to the starting point.

---

## Complexity

- **Time**: O(nh) where:
  - n = number of points
  - h = number of points on the hull
- **Worst case**: O(n²) (if most points are on the hull)
- **Best case**: O(n log n) for small h




## Akl-Toussaint heuristic

XXX Describe this; currently enabled for 10 or more points
