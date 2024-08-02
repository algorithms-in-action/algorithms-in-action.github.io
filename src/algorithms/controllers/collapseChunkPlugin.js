// Stuff to access what chunks are collapsed, so animation can depend on
// that (eg show less/more information). There was an accumulation
// of different versions of this for different algorithms. This is a
// more generic one that requires some extra some code in algorithm files.
// Possibly should be put elsewhere, eg, src/context/
// NOTE: any algorithm controller file that imports this must be listed
// below, otherwise hooks into what happens when blocks are expanded or
// contracted are not enabled.
const importsThis = ['quickSort', 'quickSortM3', 'msort_arr_td',
  'transitiveClosure', 'heapSort', 'msort_lista_td'];

// eslint-disable-next-line import/no-cycle
// See also accompanying mods/hooks in src/context/GlobalState.js and
// src/context/actions.js 
import { GlobalActions } from '../../context/actions';

// not sure if finding the running algorithm needs such complex code, but this
// seems to work...
let algorithmGetter = () => null;

function getGlobalAlgorithm() {
  return algorithmGetter();
}

window.getGlobalAlgorithm = getGlobalAlgorithm;
export function initGlobalAlgorithmGetter(getter) {
  algorithmGetter = getter;
}

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
  return blocks.reduce((acc, curr) =>
     (acc && collapse[alg_name].sort[curr]), true);
}

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
  const alg_name = algorithm.id.name;
  if (!importsThis.includes(alg_name)) return;
  chunker.refresh();
}

