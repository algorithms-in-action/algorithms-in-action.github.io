# Merge Sort (Natural, for arrays)

---

Natural merge sort is a variation of the merge sort algorithm that 
takes advantage of the natural order present in the input array. 
Natural merge sort scans through the array to identify naturally 
occurring sorted sequences (runs) and merges consecutive pairs of 
runs, until a single run remains.

The merge operation is not in-place - it requires O(n) extra space.  
A simple solution (used here) is to merge the two sorted sub-arrays 
to a temporary array then copy them back to the original array. 
Merge uses three pointers/indices that scan from left to right; 
one for each of the input sub-arrays and one for the output array.  
At each stage the minimum input array element is copied to the 
output array and the indices for those two arrays are incremented. 
When one input array has been completely copied, any additional 
elements in the other input array are copied to the output array. 

Natural merge sort is stable meaning the relative order of equal 
elements is preserved. In the bottom-up merge sort, shown elsewhere, 
the starting point assumes each run is one item long. In practice, 
random input data will have many short runs that just happen to be 
sorted. In the typical case, the natural merge sort may not need 
as many passes because there are fewer runs to merge.
