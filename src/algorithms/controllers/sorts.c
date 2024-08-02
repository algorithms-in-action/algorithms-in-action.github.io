// heapsort/quicksort/...
// C code pretty much equivalent to pseudocode version for testing purposes

// pick ONE of the following:
// XXX redo so we can compile with -D to select algorithm
// #define HEAPSORT
// #define QUICKSORT // some version of quicksort
// #define MERGE_TD // top-down merge sort
// #define MERGE_BUP // bottom-up merge sort
// #define MSD_RADIX // radix exchange sort
#define MERGE_TD_LA // top-down merge sort for lists imp as arrays
// XXX should do top-down merge sort for lists imp with pointers - main code
// should be identical - just need to write init code for list and change
// some macro definitions

#ifdef QUICKSORT
// pick ONE of the following:
// #define QUICKSORT_S // simple version of quicksort
#define QUICKSORT_M3 // median of 3 version of quicksort
#endif // QUICKSORT

#include <stdlib.h>
#include <stdio.h>

#define False 0
#define True 1
#define Swap(a,b) {int tmp; tmp=a; a=b; b=tmp;}

#define Size 11 // number of elements to sort/size of array
int A[Size];
// int i1; // for debugging
// for (i1=1; i1 < Size; i1++) printf("%d ", A[i1]); printf("\n");

#ifdef HEAPSORT
int IndexOfLargestChild(int *A, int i, int n);
void heapsort(int A[], int n);
#endif // HEAPSORT

#ifdef QUICKSORT
int partition(int *A, int left, int right);
void quicksort(int A[], int left, int right);
#endif // QUICKSORT

#ifdef MERGE_TD
void mergesort_td(int A[], int left, int right);
#endif // MERGE_TD

#ifdef MERGE_TD_LA
int Anext[Size]; // pointers for array implementation of lists
int L = 1; // (index of) first element of list
#define head(p) A[p]
#define tail(p) Anext[p]
#define List int
#define Null 0
List mergesort_td_la(int L, int len);
#endif // MERGE_TD_LA

#ifdef MERGE_BUP
void mergesort_bup(int A[], int size);
#endif // MERGE_BUP

#ifdef MSD_RADIX
int radix_partition(int *A, int left, int right, int mask);
void msd_radix_sort(int A[], int left, int right, int mask);
#endif // MSD_RADIX


void
main() {
        int i = 1;
        // read A[1]..A[Size-1] from stdin
        while (i < Size)
                scanf("%d", &A[i++]);
#ifdef HEAPSORT
        heapsort(A, Size-1);
#endif // HEAPSORT
#ifdef QUICKSORT
        quicksort(A, 1, Size-1);
#endif // QUICKSORT
#ifdef MSD_RADIX
        // XXX Generally we want a mask with just the top-most possible bit
        // set; for testing we just something small.  For animation (and here)
        // we do a scan through the data and pick the largest used bit (or 1).
        int mask = 1;
        for (i = 1; i < Size; i++)
            if (A[i] < 0)
                printf("Positive numbers, please!\n");
            else
                while (mask*2 <= A[i])
                    mask *= 2;
        msd_radix_sort(A, 1, Size-1, mask);
#endif // MSD_RADIX
#ifdef MERGE_TD
        mergesort_td(A, 1, Size-1);
#endif // MERGE_TD
#ifdef MERGE_TD_LA
        for (i = 1; i < Size-1; i++)
            Anext[i] = i+1;
        Anext[Size-1] = Null;
        L = mergesort_td_la(L, Size-1);
#endif // MERGE_TD_LA
#ifdef MERGE_BUP
        mergesort_bup(A, Size-1);
#endif // MERGE_BUP
        for (i=1; i < Size; i++) printf("%d ", A[i]); printf("\n");
}

#ifdef HEAPSORT
void
heapsort(int A[], int n) { // sort A[1]..A[n]
        int i, j, k, heap;

        // BuildHeap
        for (k = n/2; k>=1; k--) {
                // DownHeap(A,k,n)
                i = k;
                heap = False;
                while (i<=n/2 && !heap) {
                        j = IndexOfLargestChild(A,i,n);
                        if (A[i] >= A[j])
                                heap = True;
                        else {
                                Swap(A[i], A[j])
                                i = j;
                        }
                }
        }
        // SortHeap
        while (n>1) {
                Swap(A[n], A[1])
                n = n-1;
                // DownHeap(A,1,n)
                i = 1;
                heap = False;
                while (i<=n/2 && !heap) {
                        j = IndexOfLargestChild(A,i,n);
                        if (A[i] >= A[j])
                                heap = True;
                        else {
                                Swap(A[i], A[j])
                                i = j;
                        }
                }
        }
}

int
IndexOfLargestChild(int *A, int i, int n) {
        if ((2*i+1 <= n) && (A[2*i+1] > A[2*i]))
                return 2*i+1;
        else
                return 2*i;
}
#endif // HEAPSORT

#ifdef MSD_RADIX
// Sort array A[left]..A[right] in ascending order
void
msd_radix_sort(int A[], int left, int right, int mask) {
        int i;

        if (left < right && mask > 0) {
                i = radix_partition(A, left, right, mask);
printf("after radix partition %4d %4d %4d %4d: ", mask, left, right, i);
{int i; for (i=1; i < Size; i++) printf("%d ", A[i]); printf("\n");}
                mask = mask>>1;
                msd_radix_sort(A, left, i-1, mask);
                msd_radix_sort(A, i, right, mask);
        }
}

// partition A[left..right] into elements with 0 as mask bit and those
// with 1 as mask bit; return index of first element with 1 as mask bit
// (or right+1 if there are none)
int
radix_partition(int A[], int left, int right, int mask) {
        int i, j;

        // can we re-code to avoid out of bounds start?
        // note we don't have sentinel at right
        i = left-1;
        j = right+1;
        while (i < j) {
                // scan right until a "big" element or we reach j
                do {
                        i++;
                } while (j > i && !(A[i] & mask));
                // scan left until a "small" element or we reach i
                do {
                        j--;
                } while ((A[j] & mask) && j > i);
                // we avoid using "break"
                if (j > i) {
                        Swap(A[i], A[j]);
                }
        }
        return i;
}
#endif // MSD_RADIX

#ifdef QUICKSORT
// Sort array A[left]..A[right] in ascending order
void
quicksort(int A[], int left, int right) {
        int i;

        if (left < right) {
                i = partition(A, left, right);
printf("after partition %d %d returned %d:", left, right, i);
{int i; for (i=1; i < Size; i++) printf("%d ", A[i]); printf("\n");}
                quicksort(A, left, i-1);
                quicksort(A, i, right);
        }
}

int
partition(int A[], int left, int right) {
        int i, j;
        int pivot;

#ifdef QUICKSORT_S
        pivot = A[right]; // choose pivot (simple version)
        i = left-1;
        j = right;
#endif // QUICKSORT_S
#ifdef QUICKSORT_M3
    {int mid = (left+right)/2;
    if (A[left] > A[mid])
        Swap(A[left], A[mid]);
    if (A[mid] > A[right]) {
        Swap(A[right], A[mid]);
        if (A[left] > A[mid])
            Swap(A[left], A[mid]);
    }
    // now A[left] <= A[mid] <= A[right]
    Swap(A[mid], A[right-1]);
        pivot = A[right-1];
        i = left;
        j = right-1;
printf("partition %d %d with mid %d:", left, right, mid);
{int i; for (i=1; i < Size; i++) printf("%d ", A[i]); printf("\n");}
    }
#endif // QUICKSORT_M3
        // invariant:
        // A[left]..A[i] are all <= pivot
        // A[j]..A[right-1] are all >= pivot
        while (i < j) {
                do {
                        i++;
                } while (A[i] < pivot); // note A[right] acts as a sentinel
                do {
                        j--;
                } while (A[j] > pivot && j > i);
                if (j > i) {
                        Swap(A[i], A[j]);
                }
        }
#ifdef QUICKSORT_S
        Swap(A[i], A[right]);
#endif // QUICKSORT_S
#ifdef QUICKSORT_M3
        Swap(A[i], A[right-1]);
#endif // QUICKSORT_M3
        return i;
}
#endif // QUICKSORT

#ifdef MERGE_TD
int B[Size];

// Sort array A[left]..A[right] in ascending order
// I can't quite believe this compiled and ran correctly first time!
void
mergesort_td(int A[], int left, int right) {
        int ap1, ap1max, ap2, ap2max, bp, mid;

        if (left < right) {
                mid = (left + right)/2;
                mergesort_td(A, left, mid);
                mergesort_td(A, mid + 1, right);
                ap1 = left;
                ap1max = mid;
                ap2 = mid+1;
                ap2max = right;
                bp = left;
                while (ap1 <= ap1max && ap2 <= ap2max)
                        if (A[ap1] < A[ap2]) {
                                B[bp] = A[ap1];
                                ap1 = ap1+1;
                                bp = bp+1;
                        } else {
                                B[bp] = A[ap2];
                                ap2 = ap2+1;
                                bp = bp+1;
                        }
                while (ap1 <= ap1max) {
                        B[bp] = A[ap1];
                        ap1 = ap1+1;
                        bp = bp+1;
                }
                while (ap2 <= ap2max) {
                        B[bp] = A[ap2];
                        ap2 = ap2+1;
                        bp = bp+1;
                }
                for (bp = left; bp <= right; bp++)
                        A[bp] = B[bp];
        }
// if (left < right-1) { // for testing/debugging
// int i1;
// printf("Ret from ms(%d, %d): ", left, right);
// for (i1=1; i1 < Size; i1++) printf("%d ", A[i1]); printf("\n");
// }
}

#endif // MERGE_TD

#ifdef MERGE_TD_LA

// Sort list L (represented with A[]+Anext[]) of length len (by
// rearranginging next pointers/indices)
// Designed so code is the same, independent of list implementation
List
mergesort_td_la(int L, int len) {
        int i, mid;
        List Lmid, R, M, E;

        if (len > 1) {
                // determine Lmid, the mid point of L
                mid = len/2;
                Lmid = L;
                for (i = 1; i < mid; i++)
                    Lmid = tail(Lmid);
                // split L into lists L and R at (after) mid point
                R = tail(Lmid);
                tail(Lmid) = Null;

                L = mergesort_td_la(L, mid);
                R = mergesort_td_la(R, len - mid);

            // XXX rather verbose - should change output code at end
            printf("   Merging: ");
            for (Lmid = L; Lmid != Null; Lmid = tail(Lmid))
                printf(" %d", head(Lmid));
            printf("\n");
            printf("   With: ");
            for (Lmid = R; Lmid != Null; Lmid = tail(Lmid))
                printf(" %d", head(Lmid));
            printf("\n");

                // Merge lists L and R to produce list M
                // merge is nicer if we use pointers to pointers but
                // some folk find that confusing and most imperative
                // languages don't help abstract things:(

                // Result list M starts with the minimum of the two input lists
                if (head(L) <= head(R)) {
                    M = L;
                    L = tail(L);
                } else {
                    M = R;
                    R = tail(R);
                }
                // scan through adding elements to the end of M
                E = M;
                while (L != Null && R != Null) {
                    if (head(L) <= head(R)) {
                        tail(E) = L;
                        E = L;
                        L = tail(L);
                    } else {
                        tail(E) = R;
                        E = R;
                        R = tail(R);
                    }
                }
                // add any elements not scanned to the end of M
                if (L == Null)
                    tail(E) = R;
                else
                    tail(E) = L;
            printf("Merged: ");
            for (Lmid = M; Lmid != Null; Lmid = tail(Lmid))
                printf(" %d", head(Lmid));
            printf("\n");
            
            return M;
        } else
            return L;
// if (left < right-1) { // for testing/debugging
// int i1;
// printf("Ret from ms(%d, %d): ", left, right);
// for (i1=1; i1 < Size; i1++) printf("%d ", A[i1]); printf("\n");
// }
}

#endif // MERGE_TD_LA

#ifdef MERGE_BUP
// XXX could reduce duplication with MERGE_TD
int B[Size];

int
minimum(int i, int j) {
        if (i <= j)
                return i;
        else
                return j;
}

// Sort array A[1]..A[size] in ascending order
void
mergesort_bup(int A[], int size) {
        int runlength, left, mid, right;
        int ap1, ap1max, ap2, ap2max, bp;

        runlength = 1; // each element is a (sorted) run of length 1
        while (runlength < size) {
                left = 1;
                while (left + runlength < size) {
                        mid = left + runlength - 1; // first run is A[left..mid]
                        right = minimum(mid+runlength, size); // next is A[mid+1..right]
printf("Merging %d %d %d - %d\n", left, mid, right, runlength);
                        ap1 = left;
                        ap1max = mid;
                        ap2 = mid+1;
                        ap2max = right;
                        bp = left;
                        while (ap1 <= ap1max && ap2 <= ap2max)
                                if (A[ap1] < A[ap2]) {
                                        B[bp] = A[ap1];
                                        ap1 = ap1+1;
                                        bp = bp+1;
                                } else {
                                        B[bp] = A[ap2];
                                        ap2 = ap2+1;
                                        bp = bp+1;
                                }
                        while (ap1 <= ap1max) {
                                B[bp] = A[ap1];
                                ap1 = ap1+1;
                                bp = bp+1;
                        }
                        while (ap2 <= ap2max) {
                                B[bp] = A[ap2];
                                ap2 = ap2+1;
                                bp = bp+1;
                        }
                        for (bp = left; bp <= right; bp++)
                                A[bp] = B[bp];
                        left = left + runlength * 2;
                }
                runlength = runlength * 2; // merging pairs doubles the run length
        }
// if (left < right-1) { // for testing/debugging
// int i1;
// printf("Ret from ms(%d, %d): ", left, right);
// for (i1=1; i1 < Size; i1++) printf("%d ", A[i1]); printf("\n");
// }
}

#endif // MERGE_BUP
