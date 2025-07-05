# Algorithms in Action Projects

Here we describe possible projects for extending the [Algorithms in
Action](https://dev-aia.vercel.app/mainmenu) algorithm animation system
in semester 2, 2025,
with the clients [Lee Naish](https://lee-naish.github.io/) and Linda
Stern.  AIA was developed for the purposes of teaching computer science
algorithms.  It features animation, pseudocode, and textual explanations,
run in coordinated fashion. A key feature of AIA, not found in other
algorithm animations, is that students can view an algorithm at varying
levels of detail. Starting with a high level pseudocode description
of the algorithm, with accompanying high level animation and textual
explanation, students can expand sections of the pseudocode to expose more
detail. Animation and explanation are controlled in coordinate fashion,
becoming correspondingly more detailed as the pseudocode is expanded.

The current implementation is primarily written in JavaScript, using
the popular Node.js/React framework. It has been coded primarily
by students over several years and more recently Lee Naish has
done some coding also.  It is open-source with the code in a [github
repository](https://github.com/algorithms-in-action/algorithms-in-action.github.io).
The following projects aim to enhance and extend AIA.  Students
participating in these projects will be contributing to a good open-source
teaching and learning tool while getting valuable software engineering
experience.  We have had excellent feedback from previous groups who have
made contributions to AIA.  As clients, we need to have good communication
with groups.  In developing algorithm animations we don't always have a
precise idea of what will work best at the outset - often it is good to
see a prototype and then give feedback on how it can be improved. There
are also some aspects we want control over, such as the details of the
pseudocode. Finally, we want multiple projects to be merged into a single
AIA version by the end of semester, so the way things are coordinated
in the github repository throughout the semester is important.

## 1. Global Issues

This project addresses several desirable enhancements to AIA that affect
multiple algorithms. Some are related to making future development of the
code easier, for example, adding new algorithms modules.  Others concern
the function of AIA.

### Simplifying addition of new algorithms

This is the first task to tackle. The aim is to get at least a simple
version of this working quickly and committed to the repository to help
the teams that are adding new algorithms. Later it can be refined further
if needed, preferably in a way that does not impact the other teams. There
are two main components to this.  This first is to rationalise the
multiple lists of algorithms that appear in the code. The second is to
complete some simple code that helps with some tedious aspects.

#### Lists of algorithms in the code

Once in AIA there was a single master list of algorithms that had all the
required information.  Sadly, some modifications to the system resulted
in four separate lists, each with slightly different information etc,
and each of which needs to be edited for each new algorithm. The single
list design is what we want; the other lists should be generated from
the master list.

#### Reducing tedium in adding new algorithms

To add a new algorithm, several new files must be created (eg, for
the animation code, the pseudocode and extra information) and entries
must be added to numerous lists. We have prototype JavaScript code that
inputs the algorithm name and a unique identifier to be used in code and
outputs unix commands to create files, append to files and instructions
about what code to add to other files, allowing lots of copy and paste
rather than tedious typing.  This prototype should be completed.

### Algorithm menus

The main AIA page has a list of algorithms, divided into categories, but
depending on the window size and font size, some may not be visible. This
must be fixed. Also, due to the way the formatting is done, adding new
algorithms can be a nightmare.  Finally, there is a search function
that relies on algorithm names but ideally it should support keywords
associated with each algorithm.

### Colors

The way colors have been implemented in AIA has changed over time to
improve flexibility (eg, color choice) and consistency (eg, between
colors of array elements, graph/tree nodes and edges). Some primitives
have been added for flexible coloring of arrays and similar primitives
should be implemented for graphs. It may be worthwhile retro-fitting
the more flexible primitives to existing animation code and deleting
some legacy code.

A second issue is the choice of different color palettes supported in
AIA. The intention is for AIA to be accessible to those with different
color perception.  Some of the more recent color choices should be
re-visited with this in mind.  Also, there are some uses of color in AIA
that don't vary when different color palettes are selected; ideally this
should not be the case.

### Specialised URLs

AIA uses specialised URLS to allowing links to a particular algorithm with
particular input.  However, not all options etc can be specified with
URLS, similarly for the step of the algorithm execution and expansion
of pseudocode.  It would be desirable to extend the URL mechanism to
specify more information.

## 2. Binary search tree variants

XXX

## 3. Linked list merge sort

Currently AIA has algorithm animations that visualise arrays, various
forms of trees and graphs but none that visualise linked lists. This
project will add linked list visualisation to AIA, initially using a
version of merge sort. There should also be consideration of how the
code could be used or adapted to other linked list algorithms (some of
which may also be completed in this project).

### Prototype merge sort for lists

AIA has a prototype of merge sort for lists implemented (it doesn't
appear in the menus but can be found from the main page via the search
function). The pseudocode is written so it is independent of the way lists
are represented, and should not be changed in this project.  Some steps of
the execution are not animated and these need to be filled in.  However,
the main job is to change the way lists are visualised.  In the prototype,
lists are represented using two arrays: one for the data (the head of each
list) and another for the "next pointers" (the tail of each list). Thus
**head[i]** together with **tail[i]** represent the two components of a
single list cell.  Instead of a pointer to a list cell we use the index
of the arrays that represents the next list cell (so the integer **i**
represents a pointer to the list cell described above). Empty lists are
represented by "Null".

### Preferred visualisation of linked lists

Linked lists are better represented by either some symbol that represents
the empty list or an arrow that points to a box that is divided into
two parts (or two boxes that are joined). The first will contain the
list elements and the second will contain the empty list symbol or
an arrow to the next list cell. AIA contains a module that implements
graphs, including various forms of trees, and this has similar visual
elements. Extending it to support lists seems like the best solution.

### Visualisation in merge sort

Exactly how the algorithm is visualised will be determined in consultaion
with the clients, who have some ideas but these may change as prototypes
are developed.  For example, a key operation in mergesort is merging two
sorted lists **L* and **R** to form a new list **M**. The two input lists
could each be displayed horizontally, one above the other. All arrows
would point to the right. As the merge operation proceeds, the list cells
could remain in the same positions but the arrows and labels such as **L**
and **R** could change (helping illustrate that the algorithm changes pointers
but not the data in list cells). Arrows may then point right, up, down or
diagonally. At the end of the merge operation the resulting list **M**
could be re-rendered horizontally for clarity, with all arrows pointing
to the right again.



## 4. Convex Hull

Currently AIA has no geometric algorithm animations. This project will
add an animation of a two dimensional convex hull algorithm animation (or
more if time permits), which is particularly amenable to visualisation:
the "Jarvis March" or "gift wrapping" algorithm.  Given a set of points
in two dimensions, the convex hull is the smallest convex polygon that
contains all points. If you think of each point being a nail sticking
out of a board, the algorithm is analogous to tying a string to the
leftmost nail, pulling the string tight and wrapping it around the
collection of nails until it touches reaches the leftmost nail again.
In three dimensions it is like wrapping paper around the points, hence
"gift wrapping".  There are optimisations to this algorithm and several
other more efficient convex hull algorithms that could be tackled.

### Visualisation in AIA

We anticipate the existing AIA modules for visualising graphs will be
sufficient for animating conxex hull algorithms with little or no
modifications. The points can be depicted by graph nodes and the string
can be depicted by graph edges. We may want to adjust the size of nodes
and write new code to generate random inputs to the algorithm.  Also,
AIA animations currently do not do "tweening" for graph edges (smooth
movement between two different edge positions). If this could be
implemented it would be beneficial and could also be retro-fitted to
other algorithms.

## 4. Simple sorting algorithms

XXX (lowest priority - CH better???)
