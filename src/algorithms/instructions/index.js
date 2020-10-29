const KEY_CODE = 'CODE';
const KEY_INSERT = 'INSERT';
const KEY_PLAY = 'PLAY';
const KEY_SEARCH = 'SEARCH';
const KEY_SORT = 'SORT';
const KEY_LOAD = 'LOAD';

export const KEY_WORDS = [
  KEY_CODE, KEY_INSERT, KEY_PLAY, KEY_SEARCH, KEY_SORT, KEY_LOAD,
];

const bstInstructions = [
  {
    title: 'Inserting Nodes',
    content: [
      `Click on ${KEY_CODE} on the right panel`,
      'Enter a list of nodes in the insert parameter.',
      `Click on ${KEY_INSERT} to load the algorithm.`,
      `Click on ${KEY_PLAY} to watch the algorithm run.`,
    ],
  },
  {
    title: 'Searching Nodes',
    content: [
      `Click on ${KEY_CODE} on the right panel`,
      'Enter a node in the search parameter.',
      `Click on ${KEY_SEARCH} to load the algorithm.`,
      `Click on ${KEY_PLAY} to watch the algorithm run.`,
    ],
  },
];

const sortInstructions = [{
  title: 'Sorting Numbers',
  content: [
    `Click on ${KEY_CODE} on the right panel`,
    'Enter a list of numbers in the sort parameter.',
    `Click on ${KEY_SORT} to load the algorithm.`,
    `Click on ${KEY_PLAY} to watch the algorithm run.`,
  ],
}];

const graphInstructions = [{
  title: 'Create Graph ',
  content: [
    `Click on ${KEY_CODE} on the right panel`,
    'Enter a graph in the transition matrix',
    `Click on ${KEY_LOAD} to load the algorithm.`,
    `Click on ${KEY_PLAY} to watch the algorithm run.`,
  ],
}];

export const BSTInstruction = bstInstructions;
export const HSInstruction = sortInstructions;
export const QSInstruction = sortInstructions;
export const TCInstruction = graphInstructions;
export const PrimsInstruction = graphInstructions;
