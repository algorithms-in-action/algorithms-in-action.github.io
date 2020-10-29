const KEY_CODE = 'CODE';
const KEY_INSERT = 'INSERT';
const KEY_PLAY = 'PLAY';
const KEY_SEARCH = 'SEARCH';
const KEY_SORT = 'SORT';
const KEY_RUN = 'RUN';

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
  title: 'Sorting',
  content: [
    `Click on ${KEY_CODE} on the right panel`,
    'Enter a list of numbers in the sort parameter.',
    `Click on ${KEY_SORT} to load the algorithm.`,
    `Click on ${KEY_PLAY} to watch the algorithm run.`,
  ],
}];

const graphInstructions = [{
  title: 'Graph',
  content: [
    `Click on ${KEY_CODE} on the right panel`,
    'Enter a graph in the transition matrix',
    `Click on ${KEY_RUN} to load the algorithm.`,
    `Click on ${KEY_PLAY} to watch the algorithm run.`,
  ],
}];

export const BSTInstruction = bstInstructions;
export const HSInstruction = sortInstructions;
export const QSInstruction = sortInstructions;
export const TCInstruction = graphInstructions;
export const PrimsInstruction = graphInstructions;
