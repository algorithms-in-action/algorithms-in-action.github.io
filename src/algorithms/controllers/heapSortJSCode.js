/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
function HeapSort(A, n) {
  let i;
  let heap;
  let swap;

  for (let k = Math.floor(n / 2); k >= 0; k -= 1) {
    let j;
    heap = false;
    i = k;

    while (!(i > (n - 1) / 2 || heap)) {
      if (2 * i < n && A[2 * i] < A[2 * i + 1]) {
        j = 2 * i + 1;
      } else {
        j = 2 * i;
      }

      if (A[i] >= A[j]) {
        heap = true;
      } else {
        swap = A[i];
        A[i] = A[j];
        A[j] = swap;
        i = j;
      }
    }
  }

  while (n > 0) {
    let j;
    swap = A[n];
    A[n] = A[0];
    A[0] = swap;

    n -= 1;
    i = 0;
    heap = false;

    while (!(i > (n - 1) / 2 || heap)) {
      if (2 * i < n && A[2 * i] < A[2 * i + 1]) {
        j = 2 * i + 1;
      } else {
        j = 2 * i;
      }

      if (A[i] >= A[j]) {
        heap = true;
      } else {
        swap = A[i];
        A[i] = A[j];
        A[j] = swap;
        i = j;
      }
    }
  }
}

export default HeapSort;
