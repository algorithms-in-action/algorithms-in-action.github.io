// eslint-disable-next-line import/no-cycle
import { GlobalActions } from '../../context/actions';

/*
 * @Author: huimin huang
 * @Date: 2021-10-05
 * @FilePath: /src/algorithms/controllers/transitiveClosureCollapseChunkPlugin.js
 * @Description: logic for transitiveClosure reachability
 */

const QS_NAME = 'quickSort';

let algorithmGetter = () => null;
let dispatchGetter = () => null;

function getGlobalAlgotithm() {
  return algorithmGetter();
}
function getGlobalDispatch() {
  return dispatchGetter();
}

window.getGlobalAlgotithm = getGlobalAlgotithm;
export function initGlobalAlgotithmGetterQS(getter, dispatchGetterFn) {
  algorithmGetter = getter;
  dispatchGetter = dispatchGetterFn;
}

function isInQuickSort(algorithm) {
  // eslint-disable-next-line no-param-reassign
  if (!algorithm) algorithm = getGlobalAlgotithm();
  return algorithm.id.name === QS_NAME;
}

export function isIJVarCollapsed() {
  const algorithm = getGlobalAlgotithm();
  if (!isInQuickSort(algorithm)) return false;
  // , playing, chunker
  const { bookmark, pseudocode, collapse } = algorithm;

  return collapse.quickSort.sort.Partition;
}
