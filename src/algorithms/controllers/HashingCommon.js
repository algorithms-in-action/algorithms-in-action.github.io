const SMALL= 11;
const BIG = 97;
const BIGPRIME = 3457;
const BIGPRIME2 = 1429;


export const EMPTY_CHAR = '-';
export const Colors = {
  Insert: 1,
  Pending: 2,
  Collision: 3,
}
export const HASH_TABLE = {
  Key: 0,
  Value: 1,
}

export function hash1(chunker, bookmark, key, hashValue) {
  let hashed = (key * BIGPRIME) % hashValue;
  chunker.add(
    bookmark,
    (vis, val) => {
      vis.graph.updateNode(HASH_TABLE.Value, val);
    },
    [hashed]
  )
  return hashed;
}

export function hash2(chunker, bookmark, key, hashValue) {
  let hashed = (key * BIGPRIME2) % hashValue + 1;
  chunker.add(
    bookmark,
    (vis, val) => {
      vis.graph.updateNode(HASH_TABLE.Value, val);
    },
    [hashed]
  )
  return hashed;
}

export function setIncrement(
  chunker, bookmark, key, hashValue, collisionHandling
) {
  let smallishprime = hashValue == SMALL ? 3 : 23;
  let increment;
  switch (collisionHandling) {
    case 'HashingLP':
      increment = 1;
      break;
    case 'HashingDH':
      increment = hash2(chunker, bookmark, key, smallishprime);
      break;
  }
  chunker.add(
    bookmark,
    (vis, increment) => {
      let insertions = vis.array.getKth();
      vis.array.showKth([insertions, increment]);
    },
    [increment]
  )
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
