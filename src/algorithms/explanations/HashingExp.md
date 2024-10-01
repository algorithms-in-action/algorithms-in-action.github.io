# Hashing

---

--New Temp--

Hashing is a method for storing and looking up records that when set up
correctly can be very efficient. It is based on the arithmetic
transformation of the record key into a table address.

Hashing allows for an efficient quick search, providing that certain
conditions are observed.

In particular, the hashed keys should spread out over the table as evenly
as possible. To achieve this, the hash function should use as much of the
key as possible, and the hashed key and the table size should be relatively
prime. This last can be achieved by making the table size prime. For the 
small table we use 11, and the larger table we use 97.

Additionally, even in sparse tables sometimes two keys will hash to the 
same value (eg: 22 and 33 using 11). Provision mst be taken to resolve
these collisions. Two commonly used methods for collision resolution
can be seen in the Hashing module: Linear probing and Double hashing.

While the average case for search is quite fast for hash, performance
degrades quite dramatically as the table starts to get full, particularly
for unsuccessful searches, which must effectively search the whole table.
This it is necessary to keep track of the number of records in the table,
and to make sure this is well below the size of the table. One tactic
used to increase the table size every time the number of records gets
above the capacity is called rehashing. Previously inserted records
have their keys rehashed and relocated to a larger table. 


--End new temp--

--Old--

Hashing is a method for storing and looking up records that can be very
effiient.  It is based on the arithmetic transformation of the record
key into a table address.

Hashing provides a good quick search, providing that certain conditions
are observed.

In particular, the hashed keys should spread out over the table as evenly
as possible.  To achieve this, the hash function should use as much
of the key as possible, and the hashed key and the table size should
be be relatively prime.  This last can be achieved by making the table
size prime.
XXX Here we use 97.

Additionally, even in sparse tables, sometimes two keys will hash to the
same value. Provision must be taken to resolve collisions, as there is
always the chance resolve these collisions. Three commonly used methods
for collision resolution common and are shown in this XXX module: linear
probing, double hashing, and chaining.

While the average case for search is quite fast for hash, performance
degrades quite dramatically as the table starts to get full, particularly
for unsuccessful searches, which must effecively search the whole
table XXX.  It is necessary to keep track of the number of records in
the table, and to make sure this is well below the size of the table.
One tactic used is to increase the table size every time the number of
records gets above the capacity; previously inserted records need to
have their keys rehashed and relocated in the larger table.

--Old--