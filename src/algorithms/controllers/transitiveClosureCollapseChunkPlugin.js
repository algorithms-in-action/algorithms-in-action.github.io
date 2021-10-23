// eslint-disable-next-line import/no-cycle
import { GlobalActions } from '../../context/actions';

/*
 * @Author: huimin huang
 * @Date: 2021-10-05
 * @FilePath: /src/algorithms/controllers/transitiveClosureCollapseChunkPlugin.js
 * @Description: logic for transitiveClosure reachability
 */

const TC_NAME = 'transitiveClosure';

let algorithmGetter = () => null;
let dispatchGetter = () => null;

function getGlobalAlgotithm() {
  return algorithmGetter();
}
function getGlobalDispatch() {
  return dispatchGetter();
}

window.getGlobalAlgotithm = getGlobalAlgotithm;
export function initGlobalAlgotithmGetter(getter, dispatchGetterFn) {
  algorithmGetter = getter;
  dispatchGetter = dispatchGetterFn;
}

function isInTransitiveClosure(algorithm) {
  // eslint-disable-next-line no-param-reassign
  if (!algorithm) algorithm = getGlobalAlgotithm();
  return algorithm.id.name === TC_NAME;
}

export function isCurrentLineInCollapseState() {
  const algorithm = getGlobalAlgotithm();
  if (!isInTransitiveClosure(algorithm)) return false;
  // , playing, chunker
  const { bookmark, pseudocode, collapse } = algorithm;
  if (collapse.transitiveClosure.tc.Reachable) return false;
  const { Reachable } = pseudocode;
  return typeof Reachable.find((item) => item.bookmark === bookmark) !== 'undefined';
}
// window.isCurrentLineInCollapseState = isCurrentLineInCollapseState;

export function isInCollapseState() {
  const algorithm = getGlobalAlgotithm();
  if (!isInTransitiveClosure(algorithm)) return false;
  return !algorithm.collapse.transitiveClosure.tc.Reachable;
}

let chunkCache = [];
let inCollapseStateFlag = false;
let initedHideJTag = false;

function getJTagDom() {
  return document.querySelectorAll('[j-tag=transitive_closure]')[0];
}

function setJTagVisible(visible = true) {
  const jTagDom = getJTagDom();
  if (jTagDom) {
    jTagDom.style.opacity = visible ? 1 : 0;
  }
}

export function runChunkWithCheckCollapseState(chunkFn) {
  if (isInCollapseState()) {
    chunkCache.push(chunkFn);
  } else {
    chunkFn();
  }
  if (!initedHideJTag) {
    initedHideJTag = true;
    setJTagVisible(false);
  }
}

// eslint-disable-next-line consistent-return
export function onCollapseStateChange() {
  if (!isInTransitiveClosure()) return false;
  const collapseState = isInCollapseState();
  setJTagVisible(!collapseState);
  const algorithm = getGlobalAlgotithm();
  algorithm.chunker.refresh();
}

export function releaseChunkCache() {
  chunkCache.forEach((fn) => { fn(); });
  chunkCache = [];
  inCollapseStateFlag = false;
}

export function runChunkWithEnterCollapse() {
  if (isInCollapseState()) {
    const algorithm = getGlobalAlgotithm();
    const dispatch = getGlobalDispatch();
    // const algorithm = getGlobalAlgotithm();
    // algorithm.chunker.next();
    if (!algorithm.chunker._inPrevState && !inCollapseStateFlag) {
      setTimeout(() => {
        dispatch(GlobalActions.NEXT_LINE, {
          triggerPauseInCollapse: true,
          playing: algorithm.playing,
        });
      });
    }
    inCollapseStateFlag = true;
  }
}

function getKthDom() {
  return document.querySelectorAll('[kth-tag=transitive_closure]')[0];
}

export function setKthVisible(visible = true) {
  const kthDom = getKthDom();
  if (kthDom) {
    kthDom.style.opacity = visible ? 1 : 0;
  }
}
