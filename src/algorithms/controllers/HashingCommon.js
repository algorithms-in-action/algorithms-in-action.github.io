// Magic numbers used between all 3 files
export const SMALL_SIZE = 11;
export const LARGE_SIZE = 97;
const PRIME = 3457;
const PRIME2 = 1429;
const H2_SMALL_HASH_VALUE = 3;
const H2_LARGE_HASH_VALUE = 23
export const INDEX = 0;
export const VALUE = 1;
export const POINTER = 2;
export const SPLIT_SIZE = 17;
export const FULL_SIGNAL = -1;

// Magic character used between all 3 files
export const POINTER_VALUE = 'i'
export const EMPTY_CHAR = '-';
export const DELETE_CHAR = 'X';

// Color indexes
export const Colors = {
  Insert: 1,
  Pending: 2,
  Collision: 3,
  Found: 1,
  NotFound: 3,
};

// Graph indexes
export const HASH_GRAPH = {
  Key: 0,
  Value: 1,
  Key2: 2,
  Value2: 3
}

export const HASH_TYPE = {
  Insert: 'I',
  Search: 'S',
  Delete: 'D',
  BulkInsert: 'BI'
}

// list of primes each roughly two times larger than previous
export const PRIMES = [
  11, 23, 47, 97, 197, 397
];

// which table size in PRIMES array to allow pointer
export const POINTER_CUT_OFF = 1;

/**
 * First hash function
 * @param {*} chunker the chunker to step the visualized along with the calculation
 * @param {*} bookmark the bookmark for chunker step
 * @param {*} key the key to hash
 * @param {*} tableSize the size of the table
 * @param {*} toggleAnimate whether animation is carried out or not
 * @returns the hashed value
 */
export function hash1(chunker, bookmark, key, tableSize, toggleAnimate) {
  let hashed = (key * PRIME) % tableSize; // Hash the key

  if (toggleAnimate) {
    // Update the graph
    chunker.add(
      bookmark,
      (vis, val) => {
        vis.graph.updateNode(HASH_GRAPH.Value, val);
        vis.graph.select(HASH_GRAPH.Value);
      },
      [hashed]
    )
  }

  return hashed; // Return hashed value
}

/**
 * Second hash function
 * @param {*} chunker the chunker to step the visualized along with the calculation
 * @param {*} bookmark the bookmark for chunker step
 * @param {*} key the key to hash
 * @param {*} tableSize the size of the table
 * @param {*} toggleAnimate whether animation is carried out or not
 * @returns the hashed value
 */
export function hash2(chunker, bookmark, key, tableSize, toggleAnimate) {
  let smallishPrime = tableSize == SMALL_SIZE ? H2_SMALL_HASH_VALUE : H2_LARGE_HASH_VALUE; // This variable is to limit the increment to 3 for small table and 23 for large
  let hashed = (key * PRIME2) % smallishPrime + 1; // Hash the key

  if (toggleAnimate) {
    // Update the graph
    chunker.add(
      bookmark,
      (vis, val) => {
        vis.graph.updateNode(HASH_GRAPH.Value2, val);
        vis.graph.select(HASH_GRAPH.Value2);
      },
      [hashed]
    )
  }

  return hashed; // Return hashed value
}

/**
 * Calculate the increment for the key
 * @param {*} chunker chunker to step the visualizer along with the calculations
 * @param {*} bookmark bookmark to step chunker
 * @param {*} key key to calculate the increment
 * @param {*} tableSize size of the table
 * @param {*} collisionHandling name of the algorithm, representing how collision is handled
 * @param {*} type either search or insert because they have different stat updates
 * @param {*} toggleAnimate whether animation is carried out or not
 * @returns the calculated increment value
 */
export function setIncrement(
  chunker, bookmark, key, tableSize, collisionHandling, type, toggleAnimate
) {

  // Increment = 1 if the algo is Linear Probing, and hashed value of second hash function if its Double Hashing
  let increment;
  switch (collisionHandling) {
    case 'HashingLP':
      increment = 1;
      break;
    case 'HashingDH':
      increment = hash2(chunker, bookmark, key, tableSize, toggleAnimate);
      break;
  }

  if (toggleAnimate) {
    // Show key, insertions and increment if the type is Insertion
    if (type == HASH_TYPE.Insert || type == HASH_TYPE.Delete) {
      chunker.add(
        bookmark,
        (vis, increment) => {
          let kth = vis.array.getKth();
          vis.array.showKth({
            key: key,
            type,
            insertions: kth.insertions,
            increment: increment
          });
        },
        [increment]
      )
    }

    // Show key\ and increment if the type is Search
    else if (type == HASH_TYPE.Search) {
      chunker.add(
        bookmark,
        (vis, increment) => {
          vis.array.showKth({
            key: key,
            type,
            increment: increment
          });
        },
        [increment]
      )
    }
  }
  return increment; // Return calculated increment
}

/**
 * Reset the visualizations for a new cycle of either insertion, deletion or search
 * @param {*} vis the visualzisers to reset
 * @param {*} size table size
 * @param {*} key key to insert/search/delete
 * @param {*} name name of the algorithm/collision handling
 */
export function newCycle(vis, size, key, name) {
  vis.array.unfill(INDEX, 0, undefined, size - 1); // Reset any coloring of slots

  if (size <= PRIMES[POINTER_CUT_OFF]) {
    vis.array.resetVariable(POINTER); // Reset pointer
  }

  // Update key value for the hashing graph and color them to emphasize hashing initialization
  vis.graph.updateNode(HASH_GRAPH.Key, key);
  vis.graph.updateNode(HASH_GRAPH.Value, ' ');
  vis.graph.select(HASH_GRAPH.Key);
  vis.graph.colorEdge(HASH_GRAPH.Key, HASH_GRAPH.Value, Colors.Pending)
  if (name === "HashingDH") {
    vis.graph.updateNode(HASH_GRAPH.Key2, key);
    vis.graph.updateNode(HASH_GRAPH.Value2, ' ');
    vis.graph.select(HASH_GRAPH.Key2);
    vis.graph.colorEdge(HASH_GRAPH.Key2, HASH_GRAPH.Value2, Colors.Pending)
  }
}
