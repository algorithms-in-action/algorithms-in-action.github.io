/* eslint-disable no-nested-ternary */
/* eslint-disable dot-notation */
/* eslint-disable max-len */
import algorithms from '../algorithms';
import Chunker from './chunker';
import findBookmark from '../pseudocode/findBookmark';
import { onCollapseStateChange } from '../algorithms/controllers/transitiveClosureCollapseChunkPlugin';
import { unionFindToggleRank } from '../algorithms/controllers/unionFindUnion';

const DEFAULT_ALGORITHM = 'heapSort';
const DEFAULT_MODE = 'sort';
// const DEFAULT_ALGORITHM = 'binarySearchTree';
// const DEFAULT_MODE = 'insertion';

let previousState = [];

/**
 *
 * @param {*} blockName
 * @param {*} pseudocode
 * @param {*} acc
 * @returns
 */
function getChildren(blockName, pseudocode, acc) {
  let accumulator;
  const current = pseudocode[blockName].filter((val) => val.ref !== undefined);
  if (current.length === 0 || blockName === 'Main') {
    return [];
  }
  for (let i = 0; i < current.length; i += 1) {
    accumulator = acc
      .concat(getChildren(current[i].ref, pseudocode, []))
      .concat([current[i].ref]);
  }
  return accumulator;
}

/**
 * Looks at the parent for a pseudocode node, and recursively builds the tree of enclosed code paths (i.e. all the children of all the parents up to Main)
 * @param {*} blockName
 * @param {*} collapse
 * @param {*} pseudocode
 * @param {*} acc - array to [] results
 * @returns
 */
// XXX collapse not used, acc not really used properly either - whoever
// wrote this had heard of accumulators but didn't understand them, and if
// we were concerned about efficiency a data structure should be bbe built
// once instead of this relentless searching all the time... XXX
// It's possible this and some other old functions are no longer used XXX
function getFullPseudocodeTree(blockName, collapse, pseudocode, acc) {
  if (blockName === undefined || blockName === 'Main') {
    return [];
  }
  for (const name of Object.keys(pseudocode)) {
    for (let i = 0; i < pseudocode[name].length; i += 1) {
      if (
        Object.prototype.hasOwnProperty.call(pseudocode[name][i], 'ref') !==
          undefined &&
        pseudocode[name][i].ref === blockName
      ) {
        return acc
          .concat(
            [name].concat(
              // (?)repeating acc here leads to unwanted multiple occcurrences
              // Some multiple occurrences happen anyway for some reason
              // getFullPseudocodeTree(name, collapse, pseudocode, acc)
              getFullPseudocodeTree(name, collapse, pseudocode, [])
            )
          )
          .concat(getChildren(name, pseudocode, []));
      }
    }
  }
  return [];
}

// Given some pseudocode and a block collapse state, is bookmark visible on screen?
// Note: this uses and sets previousState
// Original design was WRONG:
// When called from NEXT_LINE it would return true for the first bookmark
// in a collapsed block of code and subsequently return false for the
// other bookmarks in this block of code. This is a BUG XXX - for a
// collapsed line of code it should stop at the *last* executed bookmark
// in the collapsed code, not the first.
// When called from PREV_LINE the code repeatedly calls prev() (which is
// an O(currentChunk) operation as it starts from the beginning, making
// PREV_LINE a O(currentChunk^2) operation - not great but acceptable I
// guess). Working backwards into the execution of a collapsed block is
// potentially a reasonable way of finding the last line executed, which
// is where we want to stop. However, previousState does not seem to be
// (re)set appropriately so we can end up going back too far:(
// Possible fix: for NEXT_LINE, search forward until we have gone past
// the possibly collapsed block/line then choose the previous line.
// For PREV_LINE, search backwards until we have found a line that is not
// the currently line/collapsed block.
function isBookmarkVisible(pseudocode, collapse, bookmark) {
  // collapse contains names of the sections and their collapsed state
  let containingBlock = false;
  for (const blockName of Object.keys(pseudocode)) {
    for (let i = 0; i < pseudocode[blockName].length; i += 1) {
      // looking at all the pseudocode elements
      if (pseudocode[blockName][i].bookmark === bookmark) {
        containingBlock = blockName;
        if (collapse[containingBlock]) {
          // i.e. if this node is open, then we need to step into its children for highlighting purposes once again
          console.log(['Vis1', containingBlock, bookmark]);
          previousState = [];
          return true;
        }
        const children = getChildren(containingBlock, pseudocode, []);
        const result = getFullPseudocodeTree(
          containingBlock,
          collapse,
          pseudocode,
          [containingBlock]
        );
        console.log(['PCTree'].concat(result));
        // console.log(collapse["BuildHeap"]);
        const newState = [
          ...new Set(previousState.concat(result).concat(children)),
        ];
        console.log(['Vis', containingBlock, bookmark]);
        console.log(previousState);
        if (previousState.includes(containingBlock)) {
          previousState = newState;
          return false; // already visited
        }
        previousState = newState;
        return true;
      }
    }
  }
  throw new Error(`Cannot find bookmark ${bookmark}`);
}

// Return block name for bookmark
function bookmarkBlock(bookmark, pseudocode) {
  // Need to search through the blocks to find the bookmark:( - would be
  // nice if there were more data structures built when pseudocode was read
  // to assist in operations such as this, and navigating the tree
  // structure of blocks XXX
  for (const blockName of Object.keys(pseudocode)) {
    for (let i = 0; i < pseudocode[blockName].length; i += 1) {
      // looking at all the pseudocode elements
      if (pseudocode[blockName][i].bookmark === bookmark) {
        return blockName;
      }
    }
  }
  throw new Error(`Cannot find bookmark ${bookmark}`);
}

// Returns list of ancestors blocks, from Main (first) down to blockName
function ancestorBlocks(blockName, pseudocode) {
  if (blockName === 'Main') {
    return ['Main'];
  }
  for (const name of Object.keys(pseudocode)) {
    for (let i = 0; i < pseudocode[name].length; i += 1) {
      if (
        // is such a complex mess required? If so, it reeks of poor design:(
        Object.prototype.hasOwnProperty.call(pseudocode[name][i], 'ref') !==
          undefined &&
        pseudocode[name][i].ref === blockName
      ) {
        return ancestorBlocks(name, pseudocode).concat([blockName]);
      }
    }
  }
  return [];  // couldn't find ref to block:(
}

// Find the chunk number to step to next, dependent on what is collapsed etc
// XXX BUG with recursive algorithms - we really need dynamic info (eg,
// recursion level) to deal with recursion properly. Should look at
// quicksort, which has problems currently as is, including the
// pseudocode being changed by students. Need to fix this, keep track of
// a bit more info for quicksort expansion perhaps and probably add a
// recursion depth field to the chunks. Quicksort does keep track of
// recursion depth as last of list of values in state - maybe it should 
// should be stored in a more standard spot for all recursive algorithms
// since it affects stepping forwards/back
function findNext(chunks, chunkNum, pseudocode, collapse) {
  if (chunkNum >= chunks.length-1) { // if at end, don't move
    return chunks.length-1;
  }
  chunkNum += 1; // go to next chunk
  let bookmark = chunks[chunkNum].bookmark;
  let block = bookmarkBlock(bookmark, pseudocode);
  console.log(["findNext", chunkNum, bookmark, block]);
  if (collapse[block]) { // code line is fully expanded -> stop at this chunk
    return chunkNum;
  }
  // find the outermost ancestor of 'block' where collapse===false
  // - this will block of the pseudocode line that is displayed
  // Eg, for a fully collapsed Heapsort we will find BuildHeap, and the code
  // of Main has a call to BuildHeap
  // XXX also need something like:
  // let recDepth = recursionDepth(chunkNum);
  let ancestors = ancestorBlocks(block, pseudocode);
  let index = ancestors.findIndex(
          (currentValue, index, arr) => !collapse[currentValue]);
  // This is the block we need to skip to the end of
  let blockToSkip = ancestors[index];
  console.log(ancestors.concat([blockToSkip]));
  console.log(ancestors.map(i => collapse[i]));
  // We skip forward until we find a chunk that is not in this ancestor
  // block, then go back one step (we want the last chunk in this block)
  // eg, we search until we find a point which doesn't have BuildHeap as an
  // ancestor and return the block immediately before that - the last step
  // of BuildHeap
  // XXX should check recursion depth also - keep going if recursion
  // depth is greater than saved depth
  do {
    if (chunkNum >= chunks.length-1) { // check we don't run off the end
      return chunks.length-1;
    }
    chunkNum += 1;
    bookmark = chunks[chunkNum].bookmark;
    block = bookmarkBlock(bookmark, pseudocode);
    ancestors = ancestorBlocks(block, pseudocode);
    console.log(ancestors.concat([chunkNum, bookmark, block]));
  } while (ancestors.includes(blockToSkip));
  // XXX ADD || recDepth < recursionDepth(chunkNum)
  return chunkNum-1;
}

// Find the chunk number to step back to, dependent on what is collapsed etc
// XXX BUG with recursive algorithms - see findNext comments
function findPrev(chunks, chunkNum, pseudocode, collapse) {
  if (chunkNum <= 0) { // if at start, don't move
    return 0;
  }
  // chunkNum += 1; // go to next chunk
  let bookmark = chunks[chunkNum].bookmark;
  let block = bookmarkBlock(bookmark, pseudocode);
  console.log(["findPrev", chunkNum, bookmark, block]);
  if (collapse[block]) { // code line is fully expanded -> back 1 step
    return chunkNum-1;
  }
  // find the outermost ancestor of 'block' where collapse===false
  // - this will block of the pseudocode line that is displayed
  // Eg, for a fully collapsed Heapsort we will find SortHeap, and the code of
  // Main has a call to SortHeap
  // XXX also need something like:
  // let recDepth = recursionDepth(chunkNum);
  let ancestors = ancestorBlocks(block, pseudocode);
  let index = ancestors.findIndex(
          (currentValue, index, arr) => !collapse[currentValue]);
  // This is the block we need skip over
  // (SortHeap in the example above)
  let blockToSkip = ancestors[index];
  console.log(ancestors.concat([blockToSkip]));
  // We skip back until we find a chunk that is not in this ancestor
  // block
  // eg, we search until we find a point which doesn't have SortHeap as an
  // ancestor - the last step of BuildHeap
  // XXX should check recursion depth also - keep going if recursion
  // depth is greater than saved depth
  do {
    if (chunkNum <= 0) { // check we don't run off the end
      return 0;
    }
    chunkNum -= 1;
    bookmark = chunks[chunkNum].bookmark;
    block = bookmarkBlock(bookmark, pseudocode);
    ancestors = ancestorBlocks(block, pseudocode);
    console.log(ancestors.concat([chunkNum, bookmark, block]));
  } while (ancestors.includes(blockToSkip));
  // XXX ADD || recDepth < recursionDepth(chunkNum)
  return chunkNum;
}


/**
 * Setup initial collapse state for each pseudocode
 * @param {object} procedurePseudocode
 */
function getCollapseControllerForSinglePseudocode(procedurePseudocode) {
  const collapseController = {};
  for (const codeBlockName of Object.keys(procedurePseudocode)) {
    if (codeBlockName === 'Main') {
      collapseController[codeBlockName] = true;
    } else {
      collapseController[codeBlockName] = false;
    }
  }
  return collapseController;
}

// get the collapse controller for all the algorithms and all the modes
function getCollapseController(procedureAlgorithms) {
  const collapseController = {};
  for (const algorithmName of Object.keys(procedureAlgorithms)) {
    const algorithmCollapseController = {};
    for (const modeName of Object.keys(
      procedureAlgorithms[algorithmName].pseudocode
    )) {
      algorithmCollapseController[modeName] =
        getCollapseControllerForSinglePseudocode(
          procedureAlgorithms[algorithmName].pseudocode[modeName]
        );
    }
    collapseController[algorithmName] = algorithmCollapseController;
  }
  return collapseController;
}

function addLineExplanation(procedurePseudocode) {
  let index = 0;
  for (const codeBlockName of Object.keys(procedurePseudocode)) {
    for (const line of procedurePseudocode[codeBlockName]) {
      if (line.explanation.length > 0) {
        line['lineExplanButton'] = { id: index, state: false };
        index += 1;
      }
    }
  }
}

// At any time the app may call dispatch(action, params), which will trigger one of
// the following functions. Each comment shows the expected properties in the
// params argument.
export const GlobalActions = {
  // load an algorithm by returning its relevant components
  LOAD_ALGORITHM: (state, params) => {
    const data = algorithms[params.name];
    const { param, name, explanation, extraInfo, pseudocode, instructions } =
      data;
    previousState = [];
    const procedurePseudocode = pseudocode[params.mode];
    addLineExplanation(procedurePseudocode);

    return {
      id: params,
      name,
      explanation,
      instructions,
      extraInfo,
      param,
      pseudocode: procedurePseudocode,
      collapse:
        state === undefined || state.collapse === undefined
          ? getCollapseController(algorithms)
          : state.collapse,
      lineExplanation: '',
    };
  },

  // run an algorithm by executing the algorithm
  RUN_ALGORITHM: (state, params) => {
    const data = algorithms[params.name];
    const {
      param,
      controller,
      name,
      explanation,
      extraInfo,
      pseudocode,
      instructions,
    } = data;
    const procedurePseudocode = pseudocode[params.mode];

    // here we pass a function reference to Chunker() because we may want to initialise
    // a visualiser using a previous one
    const chunker = new Chunker(() =>
      controller[params.mode].initVisualisers(params)
    );
    controller[params.mode].run(chunker, params);
    const bookmarkInfo = chunker.next();
    //const firstLineExplan = findBookmark(procedurePseudocode, bookmarkInfo.bookmark).explanation;
    const firstLineExplan = null;
    previousState = [];

    return {
      ...state,
      id: params,
      name,
      explanation,
      extraInfo,
      instructions,
      param,
      pseudocode: procedurePseudocode,
      ...bookmarkInfo, // sets bookmark & finished fields
      chunker,
      visualisers: chunker.visualisers,
      collapse:
        state === undefined || state.collapse === undefined
          ? getCollapseController(algorithms)
          : state.collapse,
      playing: false,
      lineExplanation: firstLineExplan,
    };
  },

  // run next line of code
  // main logic was in isBookmarkVisible but that has a
  // BUG with collapsed code.  We want to step forward one line if next
  // line of code is expanded.  If it is not, we want to step until the
  // *last* line of execution of that collapsed block (old code did
  // *first* line). If next chunk's block is collapsed, we want to find
  // the outermost collapsed block B containing it and pick the last
  // chunk in that block or a block contained (transitively) in that block.
  // Not sure about the triggerPauseInCollapse stuff (was added for
  // transitiveClosure code which has bugs anyway)
  // Not sure about playing either - just pass it through as before
  // except for triggerPauseInCollapse apparent hack.
  NEXT_LINE: (state, playing) => {
    let result;

    let triggerPauseInCollapse = false;
    if (typeof playing === 'object') {
      triggerPauseInCollapse = playing.triggerPauseInCollapse;
      playing = playing.playing;
    }

    console.log(['NEXT_LINE', playing, triggerPauseInCollapse]);
    // figure out what chunk we need to stop at
    let stopAt = findNext(state.chunker.chunks, state.chunker.currentChunk, state.pseudocode, state.collapse[state.id.name][state.id.mode]);
    // step forward until we are at stopAt, or last chunk, or some weird
    // pauseInCollapse stuff (for Warshall's?) I don't really understand:( XXX
    do {
      result = state.chunker.next(triggerPauseInCollapse);
      if (!triggerPauseInCollapse) {
        result.pauseInCollapse = false;
      }
      console.log(['chunker.next', state.chunker.currentChunk, result.pauseInCollapse, result.finished, state.id.name, state.id.mode, result.bookmark]);
    } while (
      !result.pauseInCollapse &&
      !result.finished &&
      state.chunker.currentChunk < stopAt
    );
    console.log('NEXT_LINE DONE');
    if (result.finished) {
      previousState = [];
    }
    // const lineExplan = findBookmark(state.pseudocode, result.bookmark).explanation;

    return {
      ...state,
      ...result,
      playing,
      // lineExplanation: lineExplan,
    };
  },

  // run previous line of code
  // BUG with collapsed code.  We want to step back one line if current
  // line of code is expanded.  If it is not, we want to step until the
  // first line of execution before that collapsed block; ie, the first
  // line not (transitively) in that block.
  // Not sure about the triggerPauseInCollapse stuff (was added for
  // transitiveClosure code which has bugs anyway)
  PREV_LINE: (state, playing) => {
    let stopAt = findPrev(state.chunker.chunks, state.chunker.currentChunk, state.pseudocode, state.collapse[state.id.name][state.id.mode])
    let result1 = {bookmark:"", chunk: state.chunker.currentChunk};
/*
    do {
      // XXX changed to avoid O(N^2) and test I know what I'm doing
      // result = state.chunker.prev();
      result1 = state.chunker.prevChunk(result1.chunk); // returns prev chunkNum+bookmark
    } while (
      !isBookmarkVisible(
        state.pseudocode,
        state.collapse[state.id.name][state.id.mode],
        result1.bookmark
      )
    );
*/
    const result = state.chunker.goBackTo(stopAt); // changes state

    // const lineExplan = findBookmark(state.pseudocode, result.bookmark).explanation;

    return {
      ...state,
      ...result,
      playing,
      // lineExplanation: lineExplan,
    };
  },

  TOGGLE_PLAY: (state, playing) => ({
    ...state,
    playing,
  }),

  COLLAPSE: (state, { codeblockname, expandOrCollapase }) => {
    // for (const k of Object.keys(state.pseudocode)) {
      // console.log(["COLLAPSE", k, state.collapse[state.id.name][state.id.mode][k]]);
    // }
    const result = state.collapse;

    if (expandOrCollapase === undefined) {
      result[state.id.name][state.id.mode][codeblockname] =
        !result[state.id.name][state.id.mode][codeblockname];
    } else if (expandOrCollapase) {
      result[state.id.name][state.id.mode][codeblockname] = true; // expand
    } else {
      result[state.id.name][state.id.mode][codeblockname] = false; // collapase
    }

    onCollapseStateChange();
    unionFindToggleRank(state);

    return {
      ...state,
      collapse: result,
    };
  },

  LineExplan: (state, updateLineExplan) => ({
    ...state,
    lineExplanation: updateLineExplan,
  }),
};

export function dispatcher(state, setState) {
  return (action, params) => {
    setState(action(state, params));
  };
}

export function initialState() {
  return GlobalActions.LOAD_ALGORITHM(undefined, {
    name: DEFAULT_ALGORITHM,
    mode: DEFAULT_MODE,
  });
}
