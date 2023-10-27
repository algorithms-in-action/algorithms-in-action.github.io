// eslint-disable-next-line import/no-cycle

/*
 * @Author: Roden Wild
 * @Date: 2023-09-02
 * @FilePath: /src/algorithms/controllers/quickSortCollapseChunkPlugin.js
 * @Description: logic for quickSort reachability
 */
import { GlobalActions } from '../../context/actions';
import { triggerButtonClick } from '../parameters/ButtonClickTrigger.js';

const QS_NAME = 'quickSort';
const QS_M3_NAME = 'quickSortM3';

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
export function initGlobalAlgorithmGetterQS(getter, dispatchGetterFn) {
  algorithmGetter = getter;
  dispatchGetter = dispatchGetterFn;
}

function isInQuickSort(algorithm) {
  // eslint-disable-next-line no-param-reassign
  if (!algorithm) algorithm = getGlobalAlgorithm();
  return algorithm.id.name === QS_NAME || algorithm.id.name === QS_M3_NAME;
}

export function isPartitionExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (!isInQuickSort()) return false;
  // , playing, chunker

  // eslint-disable-next-line
  const { bookmark, pseudocode, collapse } = algorithm;
  return algorithm.id.name === QS_NAME
    ? collapse.quickSort.sort.Partition
    : collapse.quickSortM3.sort.Partition;
}

export function isRecursionExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (!isInQuickSort()) return false;
  // , playing, chunker

  // eslint-disable-next-line
  const { bookmark, pseudocode, collapse } = algorithm;
  return algorithm.id.name === QS_NAME
    ? collapse.quickSort.sort.QuicksortBoth
    : collapse.quickSortM3.sort.QuicksortBoth;
}

export function onCollapseStateChangeQS() {
  if (!isInQuickSort()) return false;
  const algorithm = getGlobalAlgorithm();
  triggerButtonClick();
  GlobalActions.RUN_ALGORITHM(algorithm.state, algorithm.id);
}
