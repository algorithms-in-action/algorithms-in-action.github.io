const SMALL= 11;
const BIG = 97;
const BIGPRIME = 3457;
const BIGPRIME2 = 1429;

const HASH_KEY = 0;
const HASH_VALUE = 1;

export const IBookmarks = {
  Init: 1,
  EmptyArray: 2,
  IncrementInsertions: 3,
  Hash1: 4,
  ChooseIncrement: 5,
  Probing: 6,
  HandlingCollision: 7,
  PutIn: 8,
}

export function hash1(chunker, key, hashValue) {
  let hashed = (key * BIGPRIME) % hashValue;
  chunker.add(
    IBookmarks.Hash1,
    (vis, key, val) => {
      vis.graph.updateNode(HASH_KEY, key);
      vis.graph.updateNode(HASH_VALUE, val);
    },
    [key, hashed]
  )
  return hashed;
}

export function hash2(chunker, key, hashValue) {
  return (key * BIGPRIME2) % hashValue;
}

export function setIncrement(chunker, key, hashValue, collisionHandling) {
  let smallishprime = hashValue == SMALL ? 3 : 23;
  let increment;
  switch (collisionHandling) {
    case 'HashingLP':
      increment = 1;
      break;
    case 'HashingDH':
      increment = hash2(chunker, key, smallishprime);
      break;
  }
  chunker.add(
    IBookmarks.ChooseIncrement,
    (vis, increment) => {
      let insertions = vis.array.getKth();
      vis.array.showKth([insertions, increment]);
    },
    [increment]
  )
  return increment;
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
