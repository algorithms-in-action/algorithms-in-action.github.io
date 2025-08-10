const KEY_CODE = 'CODE';
const KEY_INSERT = 'INSERT';
const KEY_PLAY = 'PLAY';
const KEY_PAUSE = 'PAUSE';
const KEY_BACK = 'BACK';
const KEY_FORWARD = 'FORWARD';
const KEY_SEARCH = 'SEARCH';
const KEY_PROGRESS = 'PROGRESS';
const KEY_SORT = 'RESET/SORT'; // XXX change more algs to RESET
const KEY_LOAD = 'START';
const KEY_FIND = 'FIND STRING';
const KEY_UF_UNION = 'UNION';
const KEY_UF_FIND = 'FIND';
const KEY_UF_PC_ON = 'ON';
const KEY_UF_PC_OFF = 'OFF';
const KEY_INSDEL = 'INSERT/DELETE';

export const KEY_WORDS = [
  KEY_CODE, KEY_INSERT, KEY_PLAY, KEY_SEARCH, KEY_SORT, KEY_LOAD, KEY_INSDEL
];

const PLAY_INSTRUCTIONS = `Click on ${KEY_PLAY} to watch the algorithm run. The speed may be adjusted using the speed slider. You can also pause, single step forwards and backwards and use the progress bar slider. The level of detail can be increased by clicking the ">" on lines of pseudocode; clicking "?" pops up an explanation for the line of code.`;

const bstInstructions = [
  {
    title: 'Insert Mode', // Specify BST Insertion as Insert mode
    content: [
      `Click on ${KEY_CODE} on the right panel`,
      'Enter a list of nodes in the insert parameter.',
      `Click on ${KEY_INSERT} or hit return to enter insert mode and load the data.`,
      PLAY_INSTRUCTIONS,
    ],
  },
  {
    title: 'Search Mode', // Specify BST Searching as Search mode
    content: [
      `Click on ${KEY_CODE} on the right panel`,
      'Enter a node in the search parameter.',
      `Click on ${KEY_SEARCH} or hit return to enter search mode and load the data.`,
      PLAY_INSTRUCTIONS,
    ],
  },
];



const stringInstructions = [{
  title: 'Searching Strings',
  content: [
    `Click on ${KEY_CODE} on the right panel`,
    'Enter a string to search followed by a string to search for, seperated by a comma',
    `Click on ${KEY_FIND} or hit return to load the data.`,
      PLAY_INSTRUCTIONS,
  ],
}];

// Now covers chaining as well as LP/DH
const hashingInstructions = [
  {
    title: 'Insert/Delete Mode',
    content: [
    `Click on ${KEY_CODE} on the right panel. Some code lines can be
expanded for more detail and explanations are available.`,
    `Select small or larger table via the radio buttons and, if small is
selected you can enable the dynamic size option. These buttons are below
the ${KEY_INSDEL} box; you may need to drag the "..." up to make them
visible.`,
    `Enter or edit the list of integers to insert/delete.

    **Valid inputs**:

     - x : Insert x into table.
     - x - y: Bulk insert of integers from x to y.
     - x - y - z: Bulk insert of integers from x to y in steps of z.
     - -x: Delete x from table.

    Bulk insert is not animated to the same degree as single inserts; it
allows you to pre-fill some of the table quickly.`,

    `Click on ${KEY_INSDEL} or hit return to enter Insert mode and load the data.`,
      PLAY_INSTRUCTIONS,
    'For hashing with chaining, when a chain is not displayed completely it can be revealed by hovering the mouse over the table slot.'
    ],
  },
  {
    title: 'Search Mode',
    content: [
    'Make sure table has inserted values before searching.',
    `Click on ${KEY_CODE} on the right panel.`,
    'Enter an Integer in the Search parameter.',
    `Click on ${KEY_SEARCH} or hit return to enter Search mode and load the data.`,
      PLAY_INSTRUCTIONS,
    ],
  },
];


const sortInstructions = [{
  title: 'Sorting Numbers',
  content: [
    `Click on ${KEY_CODE} on the right panel to show the code.`,
    PLAY_INSTRUCTIONS,
    `The list of numbers to be sorted can be edited; click on ${KEY_SORT} or hit return to load the new data.`,
    `The order of the input data can be changed with the radio buttons (below the data input; you may need to drag the "..." up to make this visible)`,
  ],
}];

const radixSortInstructions = [{
  title: 'Sorting Numbers',
  content: [
    `Click on ${KEY_CODE} on the right panel to show the code.`,
    PLAY_INSTRUCTIONS,
     'Hover the mouse over an element of array A to display the value in binary (and base 4 for straight radix sort).',
    `The list of numbers to be sorted can be edited; click on ${KEY_SORT} or hit return to load the new data.`,
    `The order of the input data can be changed with the radio buttons (below the data input; you may need to drag the "..." up to make this visible)`,
  ],
}];

const graphInstructions = [
  {
    title: 'To Run Animation',
    content: [
      `Click on ${KEY_CODE} at the top of the right-hand panel`,
      PLAY_INSTRUCTIONS,
      `The graph can be chosen (see below; default Graph 1 is shown initially unless the graph is specified via the URL)`,
      `Other algorithm parameters can be chosen below the
${KEY_PROGRESS} bar; this will reset the animation to the start`,
      `Screen layout can be altered (depending on your browser/platform): the right and bottom panels can be enlarged or shrunk by dragging the ellipsis ("..."), and you can zoom in/out and drag elements in the animation panel`,
    ]
  },
  {
    title: 'To Choose Graph',
    content: [
      `The graph input panel is at the bottom and may need to be revealed
by dragging the "..." up temporarily`,
      `Under the ${KEY_PLAY} button, toggle between sample graphs (eg Graph 1) and random graphs, or`,
      'Edit text for X-Y node coordinates (this can change the graph size) and edges/weights (weights are ignored for unweighted graph algorithms), or',
      'Enter X-Y node coordinates and edges/weights in tables below, or',
      'Change X-Y node coordinates by selecting a node with the mouse and dragging it.',
      `The graph size can also be explicitly increased/decreased - this generates a new random graph.`,
      `Edge weights (for weighted graph algorithms) can be toggled between Euclidean, Manhattan and as defined explicitly in the input.`,
    ]
  },
  {
    title: `Note for transitive closure algorithm`,
    content: [`Each node is considered reachable from itself so the leading diagonal of the edge matrix contains all ones and cannot be edited.`]
  },
];

// XXX best just add TC note for this case
const graphInstructionsTC =
    graphInstructions;

const unionFindInstructions = [{
  title: ' ',
  content: [
    `Open the right ${KEY_CODE} panel to view the algorithm code as it runs.`,
    `Use the panel in the lower centre of the screen to control the algorithm visualisation:`,
    `Select nodes to union by entering a list of union operations in the left input box and click ${KEY_UF_UNION}.`,
    `Click ${KEY_UF_PC_ON} or ${KEY_UF_PC_OFF} to toggle path compression (below the data input; you may need to drag the "..." up to make this visible).`,
      PLAY_INSTRUCTIONS,
    `Enter a node in the right input box and click ${KEY_UF_FIND} and then ${KEY_PLAY} to search for the node's set representative.`,
  ]
}];

export const BSTInstruction = bstInstructions;
export const HSInstruction = sortInstructions;
export const QSInstruction = sortInstructions;
export const msort_arr_td = sortInstructions;
export const msort_arr_bup = sortInstructions;
export const msort_arr_nat = sortInstructions;
export const RadixSortInstruction = radixSortInstructions;
export const msort_lista_td = sortInstructions;
export const TCInstruction = graphInstructionsTC;
export const Prims_oldInstruction = graphInstructions;
export const PrimsInstruction = graphInstructions;
export const KruskalInstruction = graphInstructions;
export const BFSSInstruction = stringInstructions;
export const HSSInstruction = stringInstructions;
export const UFInstruction = unionFindInstructions;
export const TTFInstruction = bstInstructions;
export const AVLInstruction = bstInstructions;
export const DIJKInstruction = graphInstructions;
export const ASTARInstruction = graphInstructions;
export const BFSInstruction = graphInstructions;
export const DFSInstruction = graphInstructions;
export const DFSrecInstruction = graphInstructions;
export const HashingLPDHInstruction = hashingInstructions;
export const HashingCHInstruction = hashingInstructions;
export const isort = sortInstructions;
export const BSTrec = sortInstructions;
export const msort_list_td = sortInstructions;
export const gwrap = graphInstructions; // XXX refine this?
