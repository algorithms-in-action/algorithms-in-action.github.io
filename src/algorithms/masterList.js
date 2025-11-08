// XXX TODO: keywords from binarySearchTree onwards, maybe add more
// earlier also, eg recursive

/*
 Use node AddNewAlgorithm.js to have the entry, files and export lines
 created for you.

 Map from algorithm ID -> metadata used across the app.

 Explaining an entry by example:

  isort: {
    name: 'Insertion Sort',
    category: 'Sort',
    noDeploy: true,
    keywords: ['N^2'],
    explanationKey: 'isort',
    paramKey: 'isort',
    instructionsKey: 'isort',
    extraInfoKey: 'isort',
    pseudocode: { sort: 'isort' },
    controller: { sort: 'isort' },
  },

  - Name on the menus will appear as "Insertion Sort".
  - It is under category "Sort" on the menus.
  - noDeploy = true, algorithm will not appear on menus but accessible through
    http://localhost:<port>/?alg=<key> (alg=isort)
    (optional; defaults to false if not specified)
  - keywords: used by the main menu search (case-insensitive).
    (optional; defaults to [])

  - explanationKey: MUST equal a named export from
    src/algorithms/explanations/index.js.
  - paramKey: MUST equal a named export from
    src/algorithms/parameters/index.js.
  - instructionsKey: MUST equal a named export in
    src/algorithms/instructions/index.js.
  - extraInfoKey: MUST equal a named export in
    src/algorithms/extra-info/index.js

  - pseudocode: object mapping MODE -> named export from
    src/algorithms/pseudocode/index.js.
      Single-mode example: { sort: 'isort' }
      Multi-mode example:  {
        insertion: 'binaryTreeInsertion',
        search: 'binaryTreeSearch',
      },

  - controller: object mapping MODE -> named export from
    src/algorithms/controllers/index.js, same rules as pseudocode.
*/

// Very Important: The key for each algorithm MUST be unique!
// Also: the key for the algorithm MUST be the same as the "name"
// of the top level Param block returned by the parameter function.
// Eg, parameters/msort_arr_td.js has
//
// function MergesortParam() {
// ...
// return (
//     // <>
//       <div className="form">
//         <ListParam
//           name="msort_arr_td"  <---- ****SAME AS KEY****
// ...

// DO NOT DELETE/MODIFY THIS COMMENT
//_MASTER_LIST_START_

const algorithmMetadata = {
  // === INSERTION SORT (new, improved) ===
  isort: {
    name: 'Insertion Sort',
    category: 'Sort',
    noDeploy: false,
    keywords: ['O(N^2)', 'O(N)', 'adaptive', 'comparison', 'stable'],
    explanationKey: 'isort',
    paramKey: 'isort',
    instructionsKey: 'isort',
    extraInfoKey: 'isort',
    pseudocode: { sort: 'isort' },
    controller: { sort: 'isort' },
  },

  // === INSERTION SORT (new) ===
  insertionSort: {
    name: 'Insertion Sort (initial student version)',
    category: 'Sort',
    noDeploy: true,
    keywords: ['O(N^2)', 'O(N)', 'stable', 'adaptive', 'comparison'],
    explanationKey: 'insertionSortExp',
    paramKey: 'insertionSortParam',
    instructionsKey: 'insertionSortInstruction',
    extraInfoKey: 'insertionSortInfo',
    pseudocode: { sort: 'insertionSort' },
    controller: { sort: 'insertionSort' },
  },

  // === NEW SELECTION SORT ===
  selectionSort: {
    name: 'Selection Sort',
    category: 'Sort',
    noDeploy: false,
    keywords: ['O(N^2)', 'selection', 'in-place'],
    explanationKey: 'selectionSortExp',
    paramKey: 'selectionSortParam',
    instructionsKey: 'selectionSortInstruction',
    extraInfoKey: 'selectionSortInfo',
    pseudocode: { sort: 'selectionSort' },
    controller: { sort: 'selectionSort' },
  },

  heapSort: {
    noDeploy: false,
    name: 'Heapsort',
    category: 'Sort',
    keywords: ['O(NlogN)', 'binary tree', 'array'],
    explanationKey: 'HSExp',
    paramKey: 'HSParam',
    instructionsKey: 'HSInstruction',
    extraInfoKey: 'HSInfo',
    pseudocode: { sort: 'heapSort' },
    controller: { sort: 'heapSort' },
  },

  quickSort: {
    name: 'Quicksort',
    category: 'Sort',
    keywords: ['O(N^2)', 'O(NlogN)', 'comparison', 'partition', 'divide and conquer'],
    explanationKey: 'QSExp',
    paramKey: 'QSParam',
    instructionsKey: 'QSInstruction',
    extraInfoKey: 'QSInfo',
    pseudocode: { sort: 'quickSort' },
    controller: { sort: 'quickSort' },
  },

  quickSortM3: {
    name: 'Quicksort (Median of 3)',
    category: 'Sort',
    keywords: ['O(N^2)', 'O(NlogN)', 'comparison', 'partition', 'divide and conquer'],
    explanationKey: 'QSM3Exp',
    paramKey: 'QSM3Param',
    instructionsKey: 'QSInstruction',
    extraInfoKey: 'QSM3Info',
    pseudocode: { sort: 'quickSortM3' },
    controller: { sort: 'quickSortM3' },
  },

  radixSortMSD: {
    name: 'MSD Radix Sort',
    category: 'Sort',
    keywords: ['O(N)', 'exchange', 'partition', 'divide and conquer', 'bits'],
    explanationKey: 'MSDRadixSortExp',
    paramKey: 'MSDRadixSortParam',
    instructionsKey: 'RadixSortInstruction',
    extraInfoKey: 'MSDRadixSortInfo',
    pseudocode: { sort: 'MSDRadixSort' },
    controller: { sort: 'MSDRadixSort' },
  },

  radixSortStraight: {
    name: 'Straight Radix Sort',
    category: 'Sort',
    keywords: ['O(N)', 'distribution', 'counting', 'digits', 'stable'],
    explanationKey: 'StraightRadixSortExp',
    paramKey: 'StraightRadixSortParam',
    instructionsKey: 'RadixSortInstruction',
    extraInfoKey: 'StraightRadixSortInfo',
    pseudocode: { sort: 'straightRadixSort' },
    controller: { sort: 'straightRadixSort' },
  },

  msort_arr_td: {
    name: 'Merge Sort (top down)',
    category: 'Sort',
    keywords: ['O(NlogN)', 'comparison', 'divide and conquer', 'stable'],
    noDeploy: false,
    explanationKey: 'msort_arr_td',
    paramKey: 'msort_arr_td',
    instructionsKey: 'msort_arr_td',
    extraInfoKey: 'msort_arr_td',
    pseudocode: { sort: 'msort_arr_td' },
    controller: { sort: 'msort_arr_td' },
  },

  msort_arr_bup: {
    name: 'Merge Sort (bottom up)',
    category: 'Sort',
    keywords: ['O(NlogN)', 'comparison', 'stable'],
    noDeploy: false,
    explanationKey: 'msort_arr_bup',
    paramKey: 'msort_arr_bup',
    instructionsKey: 'msort_arr_bup',
    extraInfoKey: 'msort_arr_bup',
    pseudocode: { sort: 'msort_arr_bup' },
    controller: { sort: 'msort_arr_bup' },
  },

  msort_arr_nat: {
    name: 'Merge Sort (natural)',
    category: 'Sort',
    keywords: ['O(NlogN)', 'adaptive', 'stable'],
    noDeploy: false,
    explanationKey: 'msort_arr_nat',
    paramKey: 'msort_arr_nat',
    instructionsKey: 'msort_arr_nat',
    extraInfoKey: 'msort_arr_nat',
    pseudocode: { sort: 'msort_arr_nat' },
    controller: { sort: 'msort_arr_nat' },
  },

  msort_list_td: {
    name: 'Merge Sort (for lists)',
    category: 'Sort',
    keywords: ['O(NlogN)', 'stable', 'top down'],
    noDeploy: false,
    explanationKey: 'msort_list_td',
    paramKey: 'msort_list_td',
    instructionsKey: 'msort_list_td',
    extraInfoKey: 'msort_list_td',
    pseudocode: { sort: 'msort_list_td' },
    controller: { sort: 'msort_list_td' },
  },

  msort_lista_td: {
    name: 'Merge Sort (for linked lists)',
    category: 'Sort',
    keywords: ['O(NlogN)', 'stable', 'top down'],
    noDeploy: false,
    explanationKey: 'msort_lista_td',
    paramKey: 'msort_lista_td',
    instructionsKey: 'msort_lista_td',
    extraInfoKey: 'msort_lista_td',
    pseudocode: { sort: 'msort_lista_td' },
    controller: { sort: 'msort_lista_td' },
  },

  binarySearchTree: {
    name: 'Binary Search Tree',
    category: 'Insert/Search',
    noDeploy: false,
    explanationKey: 'BSTExp',
    paramKey: 'BSTParam',
    instructionsKey: 'BSTInstruction',
    extraInfoKey: 'BSTInfo',
    pseudocode: {
      insertion: 'binaryTreeInsertion',
      search: 'binaryTreeSearch',
    },
    controller: {
      insertion: 'binaryTreeInsertion',
      search: 'binaryTreeSearch',
    },
  },

  BSTrec: {
    name: 'Binary Search Tree (recursive)',
    category: 'Insert/Search',
    noDeploy: false,
    explanationKey: 'BSTrec',
    paramKey: 'BSTrec',
    instructionsKey: 'BSTrec',
    extraInfoKey: 'BSTrec',
    pseudocode: { 
      insertion: 'BSTrecInsertion',
      search: 'AVLTreeSearch',
    },
    controller: { 
      insertion: 'BSTrecInsertion',
      search: 'AVLTreeSearch', 
    },
  },

  AVLTree: {
    name: 'AVL Tree',
    category: 'Insert/Search',
    keywords: ['O(logN)', 'balanced', 'binary', 'rotation', 'height'],
    explanationKey: 'AVLExp',
    paramKey: 'AVLTreeParam',
    instructionsKey: 'AVLInstruction',
    extraInfoKey: 'AVLInfo',
    pseudocode: {
      insertion: 'AVLTreeInsertion',
      search: 'AVLTreeSearch',
    },
    controller: {
      insertion: 'AVLTreeInsertion',
      search: 'AVLTreeSearch',
    },
  },

  TTFTree: {
    name: '2-3-4 Tree',
    category: 'Insert/Search',
    explanationKey: 'TTFExp',
    paramKey: 'TTFTreeParam',
    instructionsKey: 'TTFInstruction',
    extraInfoKey: 'TTFInfo',
    pseudocode: {
      insertion: 'TTFTreeInsertion',
      search: 'TTFTreeSearch',
    },
    controller: {
      insertion: 'TTFTreeInsertion',
      search: 'TTFTreeSearch',
    },
  },

  HashingLP: {
    name: 'Hashing (Linear Probing)',
    category: 'Insert/Search',
    explanationKey: 'HashingExp',
    paramKey: 'HashingLPParam',
    instructionsKey: 'HashingLPDHInstruction',
    extraInfoKey: 'HashingInfo',
    pseudocode: {
      insertion: 'linearProbing',
      search: 'linearSearch',
    },
    controller: {
      insertion: 'HashingInsertion',
      search: 'HashingSearch',
    },
  },

  HashingDH: {
    name: 'Hashing (Double Hashing)',
    category: 'Insert/Search',
    explanationKey: 'HashingExp',
    paramKey: 'HashingDHParam',
    instructionsKey: 'HashingLPDHInstruction',
    extraInfoKey: 'HashingInfo',
    pseudocode: {
      insertion: 'doubleHashing',
      search: 'doubleSearch',
    },
    controller: {
      insertion: 'HashingInsertion',
      search: 'HashingSearch',
    },
  },

  HashingCH: {
    name: 'Hashing (Chaining)',
    category: 'Insert/Search',
    explanationKey: 'HashingExp',
    paramKey: 'HashingCHParam',
    instructionsKey: 'HashingCHInstruction',
    extraInfoKey: 'HashingInfo',
    pseudocode: {
      insertion: 'chaining',
      search: 'chainingSearch',
    },
    controller: {
      insertion: 'HashingChainingInsertion',
      search: 'HashingSearch',
    },
  },

  DFSrec: {
    name: 'Depth First Search',
    category: 'Graph',
    explanationKey: 'DFSrecExp',
    paramKey: 'DFSrecParam',
    instructionsKey: 'DFSrecInstruction',
    extraInfoKey: 'DFSrecInfo',
    pseudocode: { find: 'DFSrec' },
    controller: { find: 'DFSrec' },
  },

  DFS: {
    name: 'DFS (iterative)',
    category: 'Graph',
    explanationKey: 'DFSExp',
    paramKey: 'DFSParam',
    instructionsKey: 'DFSInstruction',
    extraInfoKey: 'DFSInfo',
    pseudocode: { find: 'DFS' },
    controller: { find: 'DFS' },
  },

  BFS: {
    name: 'Breadth First Search',
    category: 'Graph',
    explanationKey: 'BFSExp',
    paramKey: 'BFSParam',
    instructionsKey: 'BFSInstruction',
    extraInfoKey: 'BFSInfo',
    pseudocode: { find: 'BFS' },
    controller: { find: 'BFS' },
  },

  dijkstra: {
    name: "Dijkstra's (shortest path)",
    category: 'Graph',
    explanationKey: 'DIJKExp',
    paramKey: 'DIJKParam',
    instructionsKey: 'DIJKInstruction',
    extraInfoKey: 'DIJKInfo',
    pseudocode: { find: 'dijkstra' },
    controller: { find: 'dijkstra' },
  },

  aStar: {
    name: 'A* (heuristic search)',
    category: 'Graph',
    explanationKey: 'ASTARExp',
    paramKey: 'ASTARParam',
    instructionsKey: 'ASTARInstruction',
    extraInfoKey: 'ASTARInfo',
    pseudocode: { find: 'AStar' },
    controller: { find: 'AStar' },
  },

  prim: {
    name: "Prim's (min. spanning tree)",
    category: 'Graph',
    noDeploy: false,
    explanationKey: 'PrimsExp',
    paramKey: 'PrimsParam',
    instructionsKey: 'PrimsInstruction',
    extraInfoKey: 'PrimsInfo',
    pseudocode: { find: 'prim' },
    controller: { find: 'prim' },
  },

  prim_old: {
    name: "Prim's (simpler code)",
    category: 'Graph',
    noDeploy: true,
    explanationKey: 'Prims_oldExp',
    paramKey: 'Prims_oldParam',
    instructionsKey: 'Prims_oldInstruction',
    extraInfoKey: 'Prims_oldInfo',
    pseudocode: { find: 'prim_old' },
    controller: { find: 'prim_old' },
  },

  kruskal: {
    name: "Kruskal's (min. spanning tree)",
    category: 'Graph',
    noDeploy: false,
    explanationKey: 'KruskalExp',
    paramKey: 'KruskalParam',
    instructionsKey: 'KruskalInstruction',
    extraInfoKey: 'KruskalInfo',
    pseudocode: { find: 'kruskal' },
    controller: { find: 'kruskal' },
  },

  transitiveClosure: {
    name: "Warshall's (transitive closure)",
    category: 'Graph',
    explanationKey: 'TCExp',
    paramKey: 'TCParam',
    instructionsKey: 'TCInstruction',
    extraInfoKey: 'TCInfo',
    pseudocode: { tc: 'transitiveClosure' },
    controller: { tc: 'transitiveClosure' },
  },

  gwrap: {
    name: 'Gift Wrapping (convex hull)',
    category: 'Geometric',
    noDeploy: false,
    explanationKey: 'gwrap',
    paramKey: 'gwrap',
    instructionsKey: 'gwrap',
    extraInfoKey: 'gwrap',
    pseudocode: { find: 'gwrap' },
    controller: { find: 'gwrap' },
  },

  convHullDC: {
    name: "Convex Hull (divide and conquer)",
    category: "Geometric",
    noDeploy: false,
    keywords: [
      "O(NlogN)"
    ],
    explanationKey: "convHullDC",
    paramKey: "convHullDC",
    instructionsKey: "convHullDC",
    extraInfoKey: "convHullDC",
    pseudocode: {
      "find": "convHullDCFind"
    },
    controller: {
      "find": "convHullDCFind"
    }
  },

  grahamScan: {
    name: "Graham Scan (convex hull)",
    category: "Geometric",
    noDeploy: false,
    keywords: [
      "O(NlogN)"
    ],
    controller: { "find": "grahamScan_find"},
    pseudocode: { "find": "grahamScan_find"},
    paramKey: "grahamScan",
    explanationKey: "grahamScan",
    extraInfoKey: "grahamScan",
    instructionsKey: "grahamScan"
  },

  unionFind: {
    name: 'Union Find',
    category: 'Set',
    explanationKey: 'UFExp',
    paramKey: 'UFParam',
    instructionsKey: 'UFInstruction',
    extraInfoKey: 'UFInfo',
    pseudocode: {
      union: 'unionFindUnion',
      find: 'unionFindFind',
    },
    controller: {
      union: 'unionFindUnion',
      find: 'unionFindFind',
    },
  },

  bruteForceStringSearch: {
    name: 'Brute Force',
    category: 'String Search',
    noDeploy: false,
    explanationKey: 'BFSSExp',
    paramKey: 'BFSSParam',
    instructionsKey: 'BFSSInstruction',
    extraInfoKey: 'BFSSInfo',
    pseudocode: { search: 'bruteForceStringSearch' },
    controller: { search: 'bruteForceStringSearch' },
  },

  horspoolStringSearch: {
    name: "Horspool's",
    category: 'String Search',
    noDeploy: false,
    explanationKey: 'HSSExp',
    paramKey: 'HSSParam',
    instructionsKey: 'HSSInstruction',
    extraInfoKey: 'HSSInfo',
    pseudocode: { search: 'horspoolStringSearching' },
    controller: { search: 'horspoolStringSearch' },
  },

  hsortNewColors: {
    name: "Heap Sort Alternate Colour API",
    category: "Insert/Search",
    noDeploy: true,
    keywords: [],
    controller: {
      "sort": "hsortNewColors"
    },
    pseudocode: {
      "sort": "hsortNewColors"
    },
    paramKey: "hsortNewColors",
    explanationKey: "hsortNewColors",
    extraInfoKey: "hsortNewColors",
    instructionsKey: "hsortNewColors"
  },
};
//_MASTER_LIST_END_

export const getDefaultMode = (key) => Object.keys(algorithmMetadata[key].pseudocode)[0];

export const getCategory = (key) => algorithmMetadata[key].category;

const generateAlgorithmCategoryList = (deployOnly=false) => {
  const src = deployOnly
  ? Object.fromEntries(Object.entries(algorithmMetadata).filter(a => !a[1].noDeploy))
  : algorithmMetadata;

  const alCatList = [];
  let categoryNum = 0;

  // Get all the categories
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(src)) {
    if (!alCatList.some((al) => al.category === value.category)) {
      alCatList.push({
        category: value.category,
        id: categoryNum,
        algorithms: [],
      });
      categoryNum += 1;
    }
  }

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(src)) {
    const algo = alCatList.find((al) => al.category === value.category);
    algo.algorithms.push({
      name: value.name,
      shorthand: key,
      mode: getDefaultMode(key),
      keywords: value.keywords,
    });
  }

  return alCatList;
};

// This function generates a list of algorithms classed by categories
const generateAlgorithmList = (deployOnly = false) => {
  const src = deployOnly
    ? Object.fromEntries(Object.entries(algorithmMetadata).filter((a) => !a[1].noDeploy))
    : algorithmMetadata;

  const alList = [];
  let alNum = 0;

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(src)) {
    alList.push({
      name: value.name,
      shorthand: key,
      id: alNum,
      mode: getDefaultMode(key),
    });
    alNum += 1;
  }

  return alList;
};

export default algorithmMetadata;
export const DeployedAlgorithmCategoryList = generateAlgorithmCategoryList(true);
export const AlgorithmCategoryList = generateAlgorithmCategoryList();
export const AlgorithmList = generateAlgorithmList();
export const AlgorithmNum = generateAlgorithmList().length;
export const visibleAlgorithmMetadata = Object.fromEntries(
  Object.entries(algorithmMetadata).filter((a) => !a[1].noDeploy)
);
