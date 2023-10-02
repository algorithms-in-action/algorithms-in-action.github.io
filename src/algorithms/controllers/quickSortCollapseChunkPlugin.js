// eslint-disable-next-line import/no-cycle

/*
 * @Author: Roden Wild
 * @Date: 2023-09-02
 * @FilePath: /src/algorithms/controllers/quickSortCollapseChunkPlugin.js
 * @Description: logic for quickSort reachability
 */
import { GlobalActions } from '../../context/actions';

const QS_NAME = 'quickSort';

let algorithmGetter = () => null;
let dispatchGetter = () => null;

function getGlobalAlgorithm() {
  return algorithmGetter();
}

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
  return algorithm.id.name === QS_NAME;
}

export function isPartitionExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker

  // eslint-disable-next-line
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.Partition;
}

export function isQuicksortFirstHalfExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker

  // eslint-disable-next-line
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.QuicksortFirstHalf;
}

export function isQuicksortSecondHalfExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker

  // eslint-disable-next-line
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.QuicksortSecondHalf;
}

export function onCollapseStateChangeQS() {
  if (!isInQuickSort()) return false;
  const algorithm = getGlobalAlgorithm();
  GlobalActions.RUN_ALGORITHM(algorithm.state, algorithm.id);
}
