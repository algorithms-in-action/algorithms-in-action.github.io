/* eslint-disable dot-notation */
/* eslint-disable max-len */
import algorithms from '../algorithms';
import Chunker from './chunker';
import findBookmark from '../pseudocode/findBookmark';

const DEFAULT_ALGORITHM = 'binarySearchTree';
const DEFAULT_MODE = 'insertion';


// Given some pseudocode and a block collapse state, is bookmark visible on screen?
function isBookmarkVisible(pseudocode, collapse, bookmark) {
  let containingBlock = false;
  for (const blockName of Object.keys(pseudocode)) {
    for (let i = 0; i < pseudocode[blockName].length; i += 1) {
      if (pseudocode[blockName][i].bookmark === bookmark) {
        containingBlock = blockName;
        if (i === 0) {
          return true;
        }
        return collapse[containingBlock];
      }
    }
  }
  throw new Error(`Cannot find bookmark ${bookmark}`);
}

/**
 * Setup initial collapse state
 * @param {object} procedurePseudocode
 */
function getCollapseController(procedurePseudocode) {
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
      param, name, explanation, extraInfo, pseudocode,
    } = data;

    const procedurePseudocode = pseudocode[params.mode];
    const collapseController = getCollapseController(procedurePseudocode);
    addLineExplanation(procedurePseudocode);

    return {
      id: params.name,
      name,
      explanation,
      extraInfo,
      param,
      pseudocode: procedurePseudocode,
      collapse: collapseController,
      lineExplanation: '',
    };
  },

  // run an algorithm by executing the algorithm
  RUN_ALGORITHM: (state, params) => {
    const data = algorithms[params.name];
    const {
      param, controller, name, explanation, extraInfo, pseudocode,
    } = data;
    const procedurePseudocode = pseudocode[params.mode];
    const collapseController = getCollapseController(procedurePseudocode);

    // here we pass a function reference to Chunker() because we may want to initialise
    // a visualiser using a previous one
    const chunker = new Chunker(() => controller[params.mode].initVisualisers(params));
    controller[params.mode].run(chunker, params);
    const bookmarkInfo = chunker.next();
    const firstLineExplan = findBookmark(procedurePseudocode, bookmarkInfo.bookmark).explanation;


    return {
      ...state,
      id: params.name,
      name,
      explanation,
      extraInfo,
      param,
      pseudocode: procedurePseudocode,
      ...bookmarkInfo, // sets bookmark & finished fields
      chunker,
      visualisers: chunker.visualisers,
      collapse: collapseController,
      playing: false,
      lineExplanation: firstLineExplan,
    };
  },

  // run next line of code
  NEXT_LINE: (state, playing) => {
    let result;
    do {
      result = state.chunker.next();
    } while (!result.finished && !isBookmarkVisible(state.pseudocode, state.collapse, result.bookmark));

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
    } while (!isBookmarkVisible(state.pseudocode, state.collapse, result.bookmark));

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
      result[codeblockname] = !result[codeblockname];
    } else if (expandOrCollapase) {
      result[codeblockname] = true; // expand
    } else {
      result[codeblockname] = false; // collapase
    }
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
