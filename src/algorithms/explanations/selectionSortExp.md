# Selection Sort

---

Selection sort is a simple comparison-based sorting algorithm.  It finds
the smallest element in the array ***A*** and puts it in ***A[1]***,
then the next smallest is put in ***A[2]*** and so on until the whole
array is sorted (assuming array indices start from 1). At each stage the
minimum element is moved using a *swap* operation so the original value
of the array element is not lost. Throughout the execution there will be
a sorted region at the left of the array.  At each stage the remainder of
the array is scanned to find the minimum and it is swapped into position,
extending the sorted region.  To find the minimum we keep track of the
index of the minimum seen so far in the scan and update this whenever
a smaller element is found.

Selection sort is simple but rather inefficient, with O(n<sup>2</sup>)
time complexity, even in the best case. Also, it is not *stable*.
One advantage is that has only O(n) swap operations, so less data is
moved than in most sorting algorithms.

