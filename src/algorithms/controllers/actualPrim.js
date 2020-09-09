
const SIZE = 10;
let weight = new Array(SIZE);
for (let i = 0; i < weight.length; i += 1) {
  weight[i] = new Array(SIZE);
}

const cost = new Array(SIZE);
const pending = new Array(SIZE);
const prev = new Array(SIZE);
const pq = new Array(SIZE);
let pqStart;
let n;

function PqSort() {
  let i;
  let j;
  let v;
  for (i = pqStart + 1; i <= n; i += 1) {
    v = pq[i];
    for (j = i - 1; j >= pqStart && cost[v] < cost[pq[j]]; j -= 1) {
      pq[j + 1] = pq[j];
    }
    pq[j + 1] = v;
  }
}

function PqUpdate(i) {
  let j;
  let w;
  for (j = 1; j <= n; j += 1) {
    w = weight[i][j];
    if (w > 0 && pending[j] && w < cost[j]) {
      cost[j] = w;
      PqSort();
      prev[j] = i;
    }
  }
}

function Prim(E, vertex) {
  let i;
  weight = [...E];
  n = vertex;
  for (i = 1; i <= n; i += 1) {
    cost[i] = Infinity;
    prev[i] = 0;
    pending[i] = 1;
  }
  cost[1] = 0;
  for (i = 1; i <= n; i += 1) {
    pq[i] = i;
  }
  pqStart = 1;
  while (pqStart <= n) {
    i = pq[pqStart];
    pending[i] = 0;
    pqStart += 1;
    PqUpdate(i);
  }
  // for test
  return prev;
}

export default Prim;
