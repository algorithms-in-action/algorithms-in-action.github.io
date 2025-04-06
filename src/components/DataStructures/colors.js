// XXX move to ./common ???
// Attempt at making colors for different data structure components less
// crazy.  We have intuitive names for a selection of colors and in the
// default colour scheme these are rendered as expected (apple = red,
// leaf = green, etc), but if a differnt golobal color scheme is chosen
// under settings these can change (apples are not always green, etc).
// Existing code has numbers (0-5) or strings ('0'-'5') and things like
// selected, selected3, sorted, verRed and patched that map to different
// colors (and there was/is no consistency between the mappings in 1D
// arrays and 2D arrays, let alone graphs/trees).
// Here we map between names for global colors and integers, that can be
// used to hook into existing code without too much pain.  In the
// future, maybe these names should migrate into the code more plus more
// colors should be added. Ideally, the mappings between different
// representations should be eliminated eventually. If we want a
// consistent colour for "sorted" things across different algorithms,
// that can be done on top of colors, eg, define color_sorted to be a
// particular named color.
// We include color 6 (stone/grey), which is mapped to sorted in the
// low level color selection code - there is no selected6
// See src/components/DataStructures/Array/Array2DTracer.js
// Numbers (etc) are mapped back to color names in files such as
// src/components/DataStructures/Array/Array1DRenderer/Array1DRenderer.module.scss
// There is also a mapping from JS to HTML in files such as
// src/components/DataStructures/Array/Array2DRenderer/index.js
// The colors are defined in
// src/styles/global.scss

export const colors = {
  sky: 0,    // (in default scheme) blue
  leaf: 1,   // (in default scheme) green
  apple: 2,  // (in default scheme) red
  peach: 3,  // (in default scheme) orange
  plum: 4,  // (in default scheme) purple
  wood: 5,  // (in default scheme) brown
  stone: 6  // (in default scheme) grey (see note above)
  // current code for arrays has "selected", "selected1",... "selected5"
  // plus "sorted", "patched",...
  // XXX add ink (black), darker/lighter versions of other colors, ...
};

