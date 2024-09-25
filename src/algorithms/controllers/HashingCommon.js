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

// Magic character used between all 3 files
export const POINTER_VALUE = "i"
export const EMPTY_CHAR = '-';

// Color indexes
export const Colors = {
  Insert: 1,
  Pending: 2,
  Collision: 3,
};

// Graph indexes
export const HASH_GRAPH = {
  Key: 0,
  Value: 1,
  Key2: 2,
  Value2: 3
}

/**
 * First hash function
 * @param {*} chunker the chunker to step the visualized along with the calculation
 * @param {*} bookmark the bookmark for chunker step
 * @param {*} key the key to hash
 * @param {*} tableSize the size of the table
 * @returns the hashed value
 */
export function hash1(chunker, bookmark, key, tableSize) {
  let hashed = (key * PRIME) % tableSize; // Hash the key

  // Update the graph
  chunker.add(
    bookmark,
    (vis, val) => {
      vis.graph.updateNode(HASH_GRAPH.Value, val);
      vis.graph.select(HASH_GRAPH.Value);
    },
    [hashed]
  )

  return hashed; // Return hashed value
}

/**
 * Second hash function
 * @param {*} chunker the chunker to step the visualized along with the calculation
 * @param {*} bookmark the bookmark for chunker step
 * @param {*} key the key to hash
 * @param {*} tableSize the size of the table
 * @returns the hashed value
 */
export function hash2(chunker, bookmark, key, tableSize) {
  let smallishPrime = tableSize == SMALL_SIZE ? H2_SMALL_HASH_VALUE : H2_LARGE_HASH_VALUE; // This variable is to limit the increment to 3 for small table and 23 for large
  let hashed = (key * PRIME2) % smallishPrime + 1; // Hash the key

  // Update the graph
  chunker.add(
    bookmark,
    (vis, val) => {
      vis.graph.updateNode(HASH_GRAPH.Value2, val);
      vis.graph.select(HASH_GRAPH.Value2);
    },
    [hashed]
  )

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
 * @returns the calculated increment value
 */
export function setIncrement(
  chunker, bookmark, key, tableSize, collisionHandling, type
) {

  // Increment = 1 if the algo is Linear Probing, and hashed value of second hash function if its Double Hashing
  let increment;
  switch (collisionHandling) {
    case 'HashingLP':
      increment = 1;
      break;
    case 'HashingDH':
      increment = hash2(chunker, bookmark, key, tableSize);
      break;
  }

  // Show key, insertions and increment if the type is Insertion
  if (type == "Insert") {
    chunker.add(
      bookmark,
      (vis, increment) => {
        let kth = vis.array.getKth();
        vis.array.showKth({
          key: key,
          insertions: kth.insertions,
          increment: increment
        });
      },
      [increment]
    )
  }

  // Show key\ and increment if the type is Search
  else if (type == "Search") {
    chunker.add(
      bookmark,
      (vis, increment) => {
        vis.array.showKth({
          key: key,
          increment: increment
        });
      },
      [increment]
    )
  }
  return increment; // Return calculated increment
}

// Just put here for storage, will be implemented in sprint 3
export function hashDelete(
    chunker, table, key, hashValue, collisionHandling, insertions
) {

  insertions = insertions - 1;
  let i = hash1(key);
  let increment = setIncrement(chunker, key, hashValue, collisionHandling);
  while (table[i] != key) {
    i = (i + increment) % table.length;
  }
  table[i] = null;

  return insertions;
}
