const SMALL_SIZE = 11;
const LARGE_SIZE = 97;
const PRIME = 3457;
const PRIME2 = 1429;
const H2_SMALL_HASH_VALUE = 3;
const H2_LARGE_HASH_VALUE = 23
export const SMALL_TABLE = 11;
export const LARGE_TABLE = 97;

export const EMPTY_CHAR = '-';

export const Colors = {
  Insert: 1,
  Pending: 2,
  Collision: 3,
};

export const HASH_TABLE = {
  Key: 0,
  Value: 1,
  Key2: 2,
  Value2: 3
}

export function hash1(chunker, bookmark, key, tableSize) {
  let hashed = (key * PRIME) % tableSize;
  chunker.add(
    bookmark,
    (vis, val) => {
      vis.graph.updateNode(HASH_TABLE.Value, val);
    },
    [hashed]
  )
  return hashed;
}

export function hash2(chunker, bookmark, key, tableSize) {
  let smallishPrime = tableSize == SMALL_SIZE ? H2_SMALL_HASH_VALUE : H2_LARGE_HASH_VALUE;
  let hashed = (key * PRIME2) % smallishPrime + 1;
  chunker.add(
    bookmark,
    (vis, val) => {
      vis.graph.updateNode(HASH_TABLE.Value2, val);
    },
    [hashed]
  )
  return hashed;
}


export function setIncrement(
  chunker, bookmark, key, tableSize, collisionHandling, type
) {
  let increment;
  switch (collisionHandling) {
    case 'HashingLP':
      increment = 1;
      break;
    case 'HashingDH':
      increment = hash2(chunker, bookmark, key, tableSize);
      break;
  }
  if (type == "Insert") {
      chunker.add(
        bookmark,
        (vis, increment) => {
          let insertions = vis.array.getKth();
          vis.array.showKth([insertions, increment]);
        },
        [increment]
      )
  }
  else if (type == "Search") {
    chunker.add(
        bookmark,
        (vis, increment) => {
            vis.array.showKth(['N/A', increment])
        },
        [increment]
    )
  }
  return increment;
}


export function hashSearch(
    chunker, table, key, hashValue, collisionHandling
) {

  // index
  let i = hash1(chunker, 'HashSearch(T, k)', key, hashValue);
  let increment = setIncrement(
    chunker, 'HashSearch(T, k)', key, hashValue, collisionHandling
  );

  while (table[i] != key) {
    i = (i + increment) % table.length;
  }
  return i;
}

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
