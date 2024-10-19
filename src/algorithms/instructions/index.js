const KEY_CODE = 'CODE';
const KEY_INSERT = 'INSERT';
const KEY_PLAY = 'PLAY';
const KEY_PAUSE = 'PAUSE';
const KEY_BACK = 'BACK';
const KEY_FORWARD = 'FORWARD';
const KEY_SEARCH = 'SEARCH';
const KEY_PROGRESS = 'PROGRESS';
const KEY_SORT = 'SORT';
const KEY_LOAD = 'START';
const KEY_FIND = 'FIND STRING';
const KEY_UF_UNION = 'UNION';
const KEY_UF_FIND = 'FIND';
const KEY_UF_PC_ON = 'ON';
const KEY_UF_PC_OFF = 'OFF';

export const KEY_WORDS = [
  KEY_CODE, KEY_INSERT, KEY_PLAY, KEY_SEARCH, KEY_SORT, KEY_LOAD,
];

const bstInstructions = [
  {
    title: 'Insert Mode', // Specify BST Insertion as Insert mode
    content: [
      `Click on ${KEY_CODE} on the right panel`,
      'Enter a list of nodes in the insert parameter.',
      `Click on ${KEY_INSERT} to enter insert mode and load the algorithm.`,
      `Click on ${KEY_PLAY} to watch the algorithm run.`,
    ],
  },
  {
    title: 'Search Mode', // Specify BST Searching as Search mode
    content: [
      `Click on ${KEY_CODE} on the right panel`,
      'Enter a node in the search parameter.',
      `Click on ${KEY_SEARCH} to enter search mode and load the algorithm.`,
      `Click on ${KEY_PLAY} to watch the algorithm run.`,
    ],
  },
];



const stringInstructions = [{
  title: 'Searching Strings',
  content: [
    `Click on ${KEY_CODE} on the right panel`,
    'Enter a string to search followed by a string to search for, seperated by a comma',
    `Click on ${KEY_FIND} to load the algorithm.`,
    `Click on ${KEY_PLAY} to watch the algorithm run.`,
  ],
}];

const sortInstructions = [{
  title: 'Sorting Numbers',
  content: [
    `Click on ${KEY_CODE} on the right panel`,
    'Enter a list of numbers in the sort parameter.',
    `Click on ${KEY_SORT} to load the algorithm.`,
    `Click on ${KEY_PLAY} to watch the algorithm run.`,
  ],
}];

const graphInstructions = [
  { title: 'To Run Animation',
  content: [
    `Click on ${KEY_CODE} at the top of the right-hand panel`,
    `Either step through the algorithm (click on ${KEY_FORWARD}) or play continuously (click on ${KEY_PLAY}). Code and animation will follow in lockstep.`,
    `The graph can be chosen (see below; default Graph 1 is shown initially)`,
    `Athoer algorithm parameters can be chosen below the
${KEY_PROGRESS} bar; this will reset the animation to the start`,
    `Screen layout can be altered (depending on your browser/platform):
the left panel can be rendered invisible by clicking
on the arrow in its middle, the right and bottom panels can be enlarged or shrunk by dragging the ellipsis ("..."), and you can zoom in/out and drag elements in the animation panel`,
  ]},
  { title: 'To Choose Graph',
  content: [
    `The graph input panel is at the bottom and may need to be revealed
by dragging the "..." up temporarily`,
    `Under the ${KEY_PLAY} button, toggle between sample graphs (eg Graph 1) and random graphs, or`,
    'edit text for X-Y node coordinates (this can change the graph size) and edges/weights (weights are ignored for unweighted graph algorithms), or',
    'enter X-Y node coordinates and edges/weights in tables below, or',
    'change X-Y node coordinates by selecting a node with the mouse and dragging it.',
    `The graph size can also be explicitly increased/decreased - this generates a new random graph.`,
    `Edge weights (for weighted graph algorithms) can be toggled between Euclidean, Manhattan and as defined explicitly in the input.`,
  ]},
];

const graphInstructionsTC = [{
  title: 'Create Graph ',
  content: [
    `Click on ${KEY_CODE} on the right panel`,
    'Enter a graph in the transition matrix',
    `Click on ${KEY_LOAD} to load the algorithm.`,
    `Click on ${KEY_PLAY} to watch the algorithm run.`,
    'All nodes are SELF-REACHABLE => All diagonal elements are ones and NOT allowed to be edited.',
  ],
}];

const unionFindInstructions = [{
  title: ' ',
  content: [
    `Open the right ${KEY_CODE} panel to view the algorithm code as it runs.`,
    `Use the panel in the lower centre of the screen to control the algorithm visualisation:`,
    `Select nodes to union by entering a list of union operations in the left input box and click ${KEY_UF_UNION}.`,
    `Click ${KEY_UF_PC_ON} or ${KEY_UF_PC_OFF} to toggle path compression.`,
    `Click on ${KEY_PLAY}, ${KEY_PAUSE}, or the ${KEY_BACK} and ${KEY_FORWARD} arrows to watch the algorithm run.`,
    `Enter a node in the right input box and click ${KEY_UF_FIND} and then ${KEY_PLAY} to search for the node's set representative.`,
  ]
}];

export const BSTInstruction = bstInstructions;
export const HSInstruction = sortInstructions;
export const QSInstruction = sortInstructions;
export const msort_arr_td = sortInstructions;
export const RadixSortInstruction = sortInstructions;
export const msort_lista_td = sortInstructions;
export const TCInstruction = graphInstructionsTC;
export const Prims_oldInstruction = graphInstructions;
export const PrimsInstruction = graphInstructions;
export const KruskalInstruction = graphInstructions;
export const BFSSInstruction = stringInstructions;
export const HSSInstruction = stringInstructions;
export const UFInstruction = unionFindInstructions;
export const TTFInstruction = bstInstructions;
export const DIJKInstruction = graphInstructions;
export const ASTARInstruction = graphInstructions;
export const BFSInstruction = graphInstructions;
export const DFSInstruction = graphInstructions;
export const DFSrecInstruction = graphInstructions;
