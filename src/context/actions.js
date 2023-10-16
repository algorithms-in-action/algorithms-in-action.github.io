/* eslint-disable no-nested-ternary */
/* eslint-disable dot-notation */
/* eslint-disable max-len */
import algorithms from '../algorithms';
import Chunker from './chunker';
import findBookmark from '../pseudocode/findBookmark';
import {onCollapseStateChange} from '../algorithms/controllers/transitiveClosureCollapseChunkPlugin';

const DEFAULT_ALGORITHM = 'binarySearchTree';
const DEFAULT_MODE = 'insertion';

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
    accumulator = acc.concat(getChildren(current[i].ref, pseudocode, [])).concat([current[i].ref]);
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
function getFullPseudocodeTree(blockName, collapse, pseudocode, acc) {
  if (blockName === undefined || blockName === 'Main') {
    return [];
  }
  for (const name of Object.keys(pseudocode)) {
    for (let i = 0; i < pseudocode[name].length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(pseudocode[name][i], 'ref') !== undefined && pseudocode[name][i].ref === blockName) {
        return acc.concat([name].concat(getFullPseudocodeTree(name, collapse, pseudocode, acc))).concat(getChildren(name, pseudocode, []));
      }
    }
  }
  return [];
}

// Given some pseudocode and a block collapse state, is bookmark visible on screen?
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
          previousState = [];
          return true;
        }
        const children = getChildren(containingBlock, pseudocode, []);
        const result = getFullPseudocodeTree(containingBlock, collapse, pseudocode, [containingBlock]);
        const newState = [...new Set(previousState.concat(result).concat(children))];
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
    for (const modeName of Object.keys(procedureAlgorithms[algorithmName].pseudocode)) {
      algorithmCollapseController[modeName] = getCollapseControllerForSinglePseudocode(
        procedureAlgorithms[algorithmName].pseudocode[modeName],
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
    const {
      param, name, explanation, extraInfo, pseudocode, instructions,
    } = data;
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
      collapse: state === undefined || state.collapse === undefined ? getCollapseController(algorithms) : state.collapse,
      lineExplanation: '',
    };
  },

  // run an algorithm by executing the algorithm
  RUN_ALGORITHM: (state, params) => {
    const data = algorithms[params.name];
    const {
      param, controller, name, explanation, extraInfo, pseudocode, instructions,
    } = data;
    const procedurePseudocode = pseudocode[params.mode];

    // here we pass a function reference to Chunker() because we may want to initialise
    // a visualiser using a previous one
    const chunker = new Chunker(() => controller[params.mode].initVisualisers(params));
    controller[params.mode].run(chunker, params);
    const bookmarkInfo = chunker.next();
    const firstLineExplan = findBookmark(procedurePseudocode, bookmarkInfo.bookmark).explanation;
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
      collapse: state === undefined || state.collapse === undefined ? getCollapseController(algorithms) : state.collapse,
      playing: false,
      lineExplanation: firstLineExplan,
    };
  },

  // run next line of code
  NEXT_LINE: (state, playing) => {
    let result;

    let triggerPauseInCollapse = false;
    if(typeof playing === 'object'){
      triggerPauseInCollapse = playing.triggerPauseInCollapse;
      playing = playing.playing;
    }

    do {
      result = state.chunker.next(triggerPauseInCollapse);
      if(!triggerPauseInCollapse){
        result.pauseInCollapse = false;
      }
    } while (
      !result.pauseInCollapse &&
      !result.finished && 
      !isBookmarkVisible(state.pseudocode, state.collapse[state.id.name][state.id.mode], result.bookmark)
    );
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
  PREV_LINE: (state, playing) => {
    let result;
    do {
      result = state.chunker.prev();
    } while (!isBookmarkVisible(state.pseudocode, state.collapse[state.id.name][state.id.mode], result.bookmark));

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
    const result = state.collapse;

    if (expandOrCollapase === undefined) {
      result[state.id.name][state.id.mode][codeblockname] = !result[state.id.name][state.id.mode][codeblockname];
    } else if (expandOrCollapase) {
      result[state.id.name][state.id.mode][codeblockname] = true; // expand
    } else {
      result[state.id.name][state.id.mode][codeblockname] = false; // collapase
    }

    onCollapseStateChange();

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
  return GlobalActions.LOAD_ALGORITHM(undefined, { name: DEFAULT_ALGORITHM, mode: DEFAULT_MODE });
}
