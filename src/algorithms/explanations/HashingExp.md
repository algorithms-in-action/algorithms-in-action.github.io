# Hashing

---

### Hashing Introduction

Hashing is a popular method for storing and looking up records. This
module visualises a data structure called a hash table, which utilises
hashing to enable quick insertions, searches and deletion. 

Hashing is based on the transformation of the record key via a
'Hashing Function' into a table address.

For hashing to be efficient, the hashed keys should spread out over the 
table evenly and avoid clusters from forming. To achieve this, the 
hash function should use as much of the key as possible, and the hashed 
key and the table size should be relatively prime. 
* For the small table we have chosen 11
* For the larger table we have chosen 97

### Collision

Even in sparse tables, sometimes two keys will hash to the same value.
Provisions must be taken to resolve these collisions. Two commonly used
methods for collision resolution are depicted in this module:
* Linear Probing
  * Checks the next available slot sequentially using step size 1
* Double Hashing
  * Uses a secondary hashing function to determine the sequential step size

### Time complexity and Rehashing

Hashing allows for very fast data retrieval, often achieving an O(1) 
time complexity in the average cases for insertion, searches and 
deletions. However this performance degrades quite dramatically as
the table starts to get full, particularly for unsuccessful searches 
which can effectively search the whole table. 

Due to this issue it is necessary to keep track of the number of records
in the table, and to make sure this is well below the table size. One 
tactic used is to increase the table size every time the number of 
records gets above the capacity. This strategy is called rehashing, and
it involves transforming existing keys in the table using an updated
hash function and have their new keys relocated to a larger table.