// eslint-disable-next-line import/no-cycle

/*
 * @Author: Roden Wild
 * @Date: 2023-09-02
 * @FilePath: /src/algorithms/controllers/quickSortCollapseChunkPlugin.js
 * @Description: logic for quickSort reachability
 */

const QS_NAME = 'quickSort';

let algorithmGetter = () => null;

function getGlobalAlgotithm() {
  return algorithmGetter();
}

window.getGlobalAlgotithm = getGlobalAlgotithm;
export function initGlobalAlgotithmGetterQS(getter) {
  algorithmGetter = getter;
}

export function isIJVarVisible() {
  const algorithm = getGlobalAlgotithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.Partition;
}

export function isIJVarExpanded() {
  const algorithm = getGlobalAlgotithm();
  if (algorithm.id.name !== QS_NAME) return false;
  // , playing, chunker
  const { bookmark, pseudocode, collapse } = algorithm;
  return collapse.quickSort.sort.init_iAndj;
}
