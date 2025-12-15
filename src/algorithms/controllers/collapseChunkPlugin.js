// Stuff to access what chunks are collapsed, so animation can depend on
// that (eg show less/more information). There was an accumulation
// of different versions of this for different algorithms. This is a
// more generic one that requires some extra some code in algorithm files.
// There is still another one for transitiveClosure
// Possibly should be put elsewhere, eg, src/context/
// NOTE: any algorithm controller file that imports this must be listed
// below, otherwise hooks into what happens when blocks are expanded or
// contracted are not enabled.
const importsThis = ['quickSort', 'quickSortM3', 'msort_arr_td',
  'heapSort', 'msort_lista_td', 'msort_arr_bup', 'msort_arr_nat',
  'msort_list_td', 'radixSortStraight', 'radixSortMSD', 'AVLTree',
  'BSTrec', 'isort'];

// eslint-disable-next-line import/no-cycle
// See also accompanying mods/hooks in src/context/GlobalState.js and
// src/context/actions.js
// import { GlobalActions } from '../../context/actions';

// not sure if finding the running algorithm needs such complex code, but this
// seems to work...
// XXX can grab name+mode from URL it seems
let algorithmGetter = () => null;

function getGlobalAlgorithm() {
  return algorithmGetter();
}

window.getGlobalAlgorithm = getGlobalAlgorithm;
export function initGlobalAlgorithmGetter(getter) {
  algorithmGetter = getter;
}

// Possible new version of areExpanded that gets alg_name and mode from URL:
// Advantages:
// 1) bypasses getGlobalAlgorithm() magic that is obscure
// 2) works with different modes with no problem (old version worked just
//    for sort mode - only used for sorting algorithms initially)
// Disadvantages:
// 1) May be incompatible with other URL-related changes
//
// Old version below, hacked awfully to support AVL trees - there should be
// a way to get the mode in a similar way to the alg_name, using something
// like initGlobalAlgorithmGetter for the mode and add code in
// src/context/GlobalState.js to call it.  Avoiding that for now - enough
// merge conflicts etc already!
// XXX now changing mode doesn't change URL so this doesn't work for
// search etc:(
// XXX For now we pass it in as an argument from the controller (should
// know algorithm and mode there) with default from URL
export function areExpanded(blocks, mode = null) {
  const currentUrl = new URL(window.location.href);
  const algorithm = getGlobalAlgorithm();
  const alg_name = algorithm.id.name;
  const { bookmark, pseudocode, collapse } = algorithm;
  if (mode === null)
      mode = currentUrl.searchParams.get('mode');
  return blocks.reduce((acc, curr) =>
    (acc && collapse[alg_name][mode][curr]), true);
}

/*
// Checks if list of pseudocode blocks are all currently expanded.  Note
// that "inner" blocks can be expanded even when "outer" ones are not, eg,
// for msort_arr_td has block Merge inside MergeCopy.  To check if Merge
// code is visible (so certain variables should be displayed), we should
// check both Merge and MergeCopy are expanded.  Hopefully, using a list
// of blocks in this interface will help remind programmers to include the
// block we are interested in *plus enclosing blocks* (Main is always
// expanded so that is not needed).
export function areExpanded(blocks) {
  const algorithm = getGlobalAlgorithm();
  const alg_name = algorithm.id.name;
  const { bookmark, pseudocode, collapse } = algorithm;
  if (alg_name === 'AVLTree') // XXX TEMPORARY HACK; FIX ME SOON PLEASE!
    return blocks.reduce((acc, curr) =>
      (acc && collapse[alg_name].insertion[curr]), true);
  return blocks.reduce((acc, curr) =>
    (acc && collapse[alg_name].sort[curr]), true);
}
*/

// Trigger refresh of display when code is expanded/collapsed.
// Not so efficient - runs through all the chunks from the start. XXX
// However, it seems to work fine and is pretty general.
// Added a shortcut for algorithms that never change display
// depending on what blocks are collapsedi, which requires algorithms
// that use this code to be explicitly listed at the start of this file
// (could invert the selection and list tose that don't need it, to be
// more robust).
export function onCollapseChange(chunker) {
  const algorithm = getGlobalAlgorithm();
  const alg_name = algorithm.id.name;  // XXX better to get from URL??
  if (!importsThis.includes(alg_name)) return;
  chunker.refresh();
}
