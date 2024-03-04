import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification Union Find
\\Note}

\\Note{
Current version uses Union by rank and path halving for Find due to
simple coding + its easy to separate path compression

Plan is to provide button to disable path compression so
students can explore what can happen without it.

Tentative idea for visualisation is to have array view, with rows for
n, parent[n] and rank[n] (rank[n] can be blank for non-roots) plus
forest view.  The forest could have fixed width columns with one number
per column (plus rank for root nodes?). Union operation could shuffle
rightmost tree to the left until its next to the tree to be merged with,
then one tree could be moved downwards one row and new edge added.
Rank information could be elided for some levels of abstraction.
\\Note}

\\Overview{

Union Find algorithms allow us to maintain and manipulate the partitioning
of a set into (disjoint) subsets. There are two main operations supported:
Union and Find. Union takes two subsets and merges them together to form
a single subset.  Find takes and element and returns a representative
element of the subset it occurs in. It must be the case that Find(n) =
Find(m) if and only if n and m are in the same subset, but which element
is returned is left to the implementation (this flexibility allows for
simple, efficient solutions). There may also be an operation to add
an additional element in a singleton subset; here we simply initialise
the data structure with a fixed number of elements, each in a singleton
subset. It is often convenient to number the elements 1, 2, 3,... allowing
the array-based solution we present here.

Union-Find has many and varied applications.  For example, to determine
connected components of an undirected graph, we can simply call Union(a,b)
for each edge a-b in the graph, then any two nodes in the same connected
component will have have the same result returned by Find.  Kruskal's
algorithm for finding minimum spanning trees is similar.

To represent a partitioning with N subsets we use N trees, each containing
the elements of the subset. Each tree node has a "parent" pointer and a
node can have many children pointing to it (there are no pointers from
parents to children).  The root node points to itself (a bit of a trick
that makes code simpler).  Find returns the root node and Union joins two
trees together.  There are some subtle aspects to ensure the height of
the trees is kept small, so that finding the root can be done very quickly.
Extra information is maintained for each subset so Union can reduce the
height and when Find traverses a path from a node to the root, we take
the opportunity to reduce the length of the path for future calls to Find
(the tree height is reduced and the "width" is increased by having more
children for some nodes).

Interestingly, the extra information used to reduce the height is only
approximate and the method used to reduce path lengths is not as thorough
as some obvious alternatives. These shortcuts make the code quite short,
but it is still extremely effective at reducing the tree height - most
nodes point directly to the root. It has been shown that no matter how
large the set is, Find has takes very close to constant time on average
(the inverse of the Ackerman function to be precise).  In this animation
we allow path compression to be disabled so you can experiment to see
how much this aspect of the algorithm reduces tree height.

\\Overview}

\\Code{
Shorten_path
    parent[n] <- parent[parent[n]] (if enabled) // point to grandparent, not parent \\B parent[n] <- parent[parent[n]]
    \\Expl{ By replacing the parent pointer by a pointer to the
        grandparent at each step up the tree, the path length is
        halved. This turns out to be sufficient to keep paths very
        short. Note that the root node is its own parent.
        The animation allows this path compression to be disabled so
        you can compare the relative heights of the trees produced.
    \\Expl} 
\\Code} 

\\Code{
Main
Union(n, m) // merge/union the subsets containing n and m, respectively \\B Union(n, m)
\\In{
    n <- Find(n) \\B n <- Find(n)
    m <- Find(m) \\B m <- Find(m)
    if n == m // in same subset already - nothing to do \\B if n == m
        \\In{
        return \\B return
        \\In}
    swap n and m if needed to ensure m is the "taller" subtree \\Ref Maybe_swap
    parent[n] = m // add the shorter subtree (n) to the taller one (m) \\B parent[n] = m
    \\Expl{ This sometimes increases the height of the resulting tree but
            if we added the taller to the shorter the height would always
            increase.
    \\Expl} 
    adjust the "height" measure of the taller subtree (m) \\Ref Adjust_rank
    \\Expl{ The shorter subtree remains the same but the taller one
            may have grown because it had had an extra subtree added.
    \\Expl} 
\\In} 

Find(n) // return root of tree containing n \\Ref Find(n)
\\Code}

\\Code{
Maybe_swap
    if rank[n] > rank[m] \\B if rank[n] > rank[m]
        \\Expl{ We maintain a "rank" for each subset, which is an upper
                bound on the height. The actual height may be less due
                to paths being shortened in Find.
        \\Expl} 
        \\In{
        swap(n, m) \\B swap(n, m)
        \\In}
\\Code}

\\Code{
    Find(n)
    \\In{
        while n != parent[n]  // while we are not at the root \\B while n != parent[n]
        \\In{
            shorten path from n to root \\Ref Shorten_path
            \\Expl{ There are several ways of shortening the path back to the
                    root. The most obvious is to follow the path to the root
                    then follow it again, making each element point to the
                    root. The version here doesn't shorten the path as much
                    but is simpler and overall it works e xtremely well.
                    The animation allows path compression to be disabled so
                    you can compare the relative heights of the trees produced.
            \\Expl} 
            n <- parent[n]  // go up the tree one step \\B n <- parent[n]
        \\In}
        return n // return root \\B return n
    \\In} 
    \\Code}

\\Code{
    Adjust_rank
        if rank[n] == rank[m] \\B if rank[n] == rank[m]
            \\Expl{  If we are adding a strictly shorter subtree to m the height
                    doesn't change, but if the heights were equal the new height
            \\Expl}
            \\In{
                rank[m] <- rank[m] + 1 \\B rank[m] <- rank[m] + 1
                \\In}
            \\Note{ Should we use ++ or "increment"???
            \\Note}
    \\Code}

\\Code{
Initialise
    \\Note{ No need to animate this?? We just have this as the initial
        state of the animation.
    \\Note}
      parent[i] = i and rank[i] = 0 for all elements i in the set \\B parent[i] = i and rank[i] = 0 for all elements i in the set
    \\Expl{ Initially, each element i is in its own singleton subset. If
            the array has free space, extra elements can be added and
            initialised in the same way.
    \\Expl} 
\\Code}

\\Note{
// Union Find: simple implementation for testing animation specification
// Sample test:
/*
% cat << END > test1
f 2
u 2 3
f 2
u 1 3
p
u 5 4
u 3 4
f 2
p
u 1 0
p
END
% ./a.out < test1
Found 2 from 2
Merged 2 and 3
Found 3 from 2
Merged 1 and 3
n           0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
parent[n]   0  3  3  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
rank[n]     0  0  0  1  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0
Merged 5 and 4
Merged 3 and 4
Found 4 from 2
n           0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
parent[n]   0  3  4  4  4  4  6  7  8  9 10 11 12 13 14 15 16 17 18 19
rank[n]     0  0  0  1  2  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0
Merged 1 and 0
n           0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
parent[n]   4  4  4  4  4  4  6  7  8  9 10 11 12 13 14 15 16 17 18 19
rank[n]     0  0  0  1  2  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0

*/
#include<stdio.h>
#include<stdlib.h>

#define demand(fact, remark)\
    {   if (!(fact))\
        {   fprintf(stderr, "%s\n", remark); exit(1);   }\
    }

#define SIZE 20    // (max) size of set we are partitioning
int parent[SIZE];  // parent for each node
int rank[SIZE];    // rank for each node
#ifdef NOCOMPRESS       
int compresspaths = 0;
#else
int compresspaths = 1;
#endif

// add operation; here we add all the elements in the array
// at the start, don't keep track whats in the set and don't
// expand the array
// Might be better to store max, and have int add(void)
void
add(int n) {
    demand(n < SIZE, "too big!");
    parent[n] = n;
    rank[n] = 0;
}

// find operation
int
find(int n) {
    while (parent[n] != n){
        // we want to compress paths in some way, eg path halving as
        // done here but might want the option of avoiding it so
        // students can see what happens without it
        if (compresspaths)
                parent[n] = parent[parent[n]];
        n = parent[n];
    }
    return n;
}

// union operation, called merge since union is a C keyword
void
merge(int n, int m) {
    n = find(n);
    m = find(m);
    if (n == m) // in same set - nothing to do
        return;
    if (rank[n] > rank[m]) { // if n a larger tree, swap n and m
        int tmp = m;
        m = n;
        n = tmp;
    }
    parent[n] = m; // make smaller tree (n) a subtree of larger (m)
    if (rank[n] == rank[m]) // adjust size (rank) of new root
        rank[m]++;
    return;
}

int
main() {
    int c, n1, n2;
    for (n1 = 0; n1 < SIZE; n1++)
        add(n1);
    // we have find, union + print commands
    // could have add + toggle path compression
    while ((c = getchar()) != EOF) {
        if (c == 'f') {    // find element; print root
            scanf("%d", &n1);
            demand(n1 < SIZE, "too big!");
            n2 = find(n1);
            printf("Found %d from %d\n", n2, n1);
        } else if (c == 'u') { // union/merge two sets
            scanf("%d %d", &n1, &n2);
            demand(n1 < SIZE, "too big!");
            demand(n2 < SIZE, "too big!");
            merge(n1, n2);
            printf("Merged %d and %d\n", n1, n2);
        } else if (c == 'p') { // print current state
            printf("n         ");
            for (n1 = 0; n1 < SIZE; n1++)
                printf("%3d", n1);
            printf("\n");
            printf("parent[n] ");
            for (n1 = 0; n1 < SIZE; n1++)
                printf("%3d", parent[n1]);
            printf("\n");
            printf("rank[n]   ");
            for (n1 = 0; n1 < SIZE; n1++)
                printf("%3d", rank[n1]);
            printf("\n");
        }
    }
    return 0;
}

/* Example of test


*/
\\Note} 

\\Note{
Handy things to copy/paste in vim for editing this file:
(mostly in my .exrc now)
:set ts=4 et

\\In{
\\In}

\\Note}
`);
