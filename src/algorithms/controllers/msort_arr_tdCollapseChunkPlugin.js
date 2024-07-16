// XXX Based on Quicksort version

// eslint-disable-next-line import/no-cycle
// See also accompanying mods/hooks in src/context/GlobalState.js and
// src/context/actions.js 

/*
 * @Author: Roden Wild
 * @Date: 2023-09-02
 * @FilePath: /src/algorithms/controllers/msort_arr_tdCollapseChunkPlugin.js
 * @Description: logic for msort_arr_td reachability
 */
import { GlobalActions } from '../../context/actions';
import { triggerButtonClick } from '../parameters/ButtonClickTrigger.js';

// XXX
const MS_NAME = 'msort_arr_td';

let algorithmGetter = () => null;
let dispatchGetter = () => null;

function getGlobalAlgorithm() {
  return algorithmGetter();
}

// eslint-disable-next-line
function getGlobalDispatch() {
  return dispatchGetter();
}

window.getGlobalAlgorithm = getGlobalAlgorithm;
export function initGlobalAlgorithmGettermsort_arr_td(getter, dispatchGetterFn) {
  algorithmGetter = getter;
  dispatchGetter = dispatchGetterFn;
}

function isInmsort_arr_td(algorithm) {
  // eslint-disable-next-line no-param-reassign
  if (!algorithm) algorithm = getGlobalAlgorithm();
  return algorithm.id.name === MS_NAME;
}

export function isMergeCopyExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (!isInmsort_arr_td()) return false;
  // eslint-disable-next-line
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.msort_arr_td.sort.MergeCopy;
}

export function isMergeExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (!isInmsort_arr_td()) return false;
  // eslint-disable-next-line
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.msort_arr_td.sort.Merge;
}

// checks if either QS recursive call is expanded (needed to determine if i
// should be displayed)
export function isRecursionExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (!isInmsort_arr_td()) return false;
  // , playing, chunker

  // eslint-disable-next-line
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.msort_arr_td.sort.MergesortL ||
              collapse.msort_arr_td.sort.MergesortR;
}

// Trigger refresh of display when code is expanded/collapsed.
// Not so efficient - runs through all the chunks from the start. XXX
// However, it seems to work and is pretty general - could possibly use it for
// other algorithms rather than have specific triggers for each algorithm.
export function onCollapseStateChangemsort_arr_td(chunker) {
  if (!isInmsort_arr_td()) return false;
  const algorithm = getGlobalAlgorithm();
  chunker.refresh();
  //triggerButtonClick();
  //GlobalActions.RUN_ALGORITHM(algorithm.state, algorithm.id);
}
