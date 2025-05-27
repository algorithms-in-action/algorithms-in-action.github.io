# Hashing

---

### Introduction

Hashing is a popular method for storing and looking up records. It
uses a space/time tradeoff - using more space to achieve lower times.
This module (and two related ones) visualises a data structure called
a hash table, which utilizes hashing to enable very fast insertions,
searches and deletion (on average).

Hashing is based on the transformation of the record key via a
'Hashing Function' into a table address.

For hashing to be efficient, the hashed keys should spread out over the
table evenly and avoid clusters from forming. Often, the key is mapped to
a large integer range then this value is taken modulo the hash table size
to get the table address. Here we multiply integer keys by a large prime
number and also choose the table size to be a prime. This works well in
most cases (though not when there are many keys that are multiples of
the table size - the worst case scenario is always bad with hashing).

### Collision

Sometimes two (or more) keys will hash to the same value.
Provisions must be taken to resolve these collisions. So called "open
addressing" methods store keys in different slots when there is a
collision. Two commonly used methods are supported here:
* Linear Probing
  * Checks the next available slot sequentially using step size 1
* Double Hashing
  * Uses a secondary hashing function to determine the sequential step size

An alternative is to use chaining, where each table slot contains a
linked list of keys that hash to that slot (this uses more space, for the
lists).

Searching mirrors the insertion process.  For chaining, the appropriate
linked list is searched sequentially.  For open addressing the table is
searched using the step size until the key is found or an empty slot is
encountered (an unsuccessful search).

### Deletion

Deletion in chaining is simple - the key is deleted from the linked
list. For open addressing we can't simply remove keys from the table due
to the way collisions are handled with insertion and search.  Instead,
the table slot is just marked as deleted.  A subsequent insertion may
occupy the slot but search must continue, as if the slot was occupied.

### Time complexity and Rehashing

Hashing can be very fast, achieving an O(1)
time complexity in the average cases for insertion, searches and
deletions. However, for open addressing, this performance degrades
quite dramatically as the table starts to get full, particularly for
unsuccessful searches which can effectively search the whole table.

Due to this issue it is necessary to keep track of the number of records
plus deleted slots in the table, and to make sure this is well below the
table size. One tactic used is to increase the table size every time
the number of records gets above the capacity. This strategy is called
rehashing, and it involves reinserting existing keys into the new table
(this also eliminates slots marked as deleted).  For chaining,
increasing the table size and rehashing is less important but can still
improve performance.

