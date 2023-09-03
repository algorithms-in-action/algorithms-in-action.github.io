// eslint-disable-next-line import/no-cycle

/*
 * @Author: Roden Wild
 * @Date: 2023-09-02
 * @FilePath: /src/algorithms/controllers/quickSortCollapseChunkPlugin.js
 * @Description: logic for quickSort reachability
 */

const QS_NAME = 'quickSort';

let algorithmGetter = () => null;

function getGlobalAlgorithm() {
  return algorithmGetter();
}

window.getGlobalAlgorithm = getGlobalAlgorithm;
export function initGlobalAlgorithmGetterQS(getter) {
  algorithmGetter = getter;
}

export function isPartitionExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.Partition;
}

export function isIJVarExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.init_iAndj;
}

export function isQuicksortFirstHalfExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.QuicksortFirstHalf;
}

export function isQuicksortSecondHalfExpanded() {
  const algorithm = getGlobalAlgorithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.QuicksortSecondHalf;
}
