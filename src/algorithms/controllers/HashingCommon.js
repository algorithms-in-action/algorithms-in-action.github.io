const SMALL= 11;
const BIG = 97;
const BIGPRIME = 3457;
const BIGPRIME2 = 1429;

const HASH_KEY = 0;
const HASH_VALUE = 1;


export function hash1(chunker, bookmark, key, hashValue) {
  let hashed = (key * BIGPRIME) % hashValue;
  chunker.add(
    bookmark,
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
      increment = hash2(chunker, key, smallishprime);
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
