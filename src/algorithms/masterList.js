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
    // === OLD INSERTION SORT (legacy) ===
    isort: {
        name: 'Insertion Sort (Legacy)',
        category: 'Sort',
        noDeploy: true,
        keywords: ['O(N^2)', 'O(N)', 'adaptive', 'comparison', 'stable'],
        explanationKey: 'isort',
        paramKey: 'isort',
        instructionsKey: 'isort',
        extraInfoKey: 'isort',
        pseudocode: { sort: 'isort' },
        controller: { sort: 'isort' },
    },

    // === NEW INSERTION SORT ===
    insertionSort: {
        name: 'Insertion Sort',
        category: 'Sort',
        noDeploy: false,
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

    // === REMAINING SORTS ===
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

    // --- Rest of algorithms remain unchanged (trees, graphs, hashing, etc.) ---

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

    // ... 下面保持你原来文件中的所有条目 (AVLTree, DFS, BFS, etc.) 不变 ...
};
//_MASTER_LIST_END_

// === Utility Exports ===
export const getDefaultMode = (key) => Object.keys(algorithmMetadata[key].pseudocode)[0];
export const getCategory = (key) => algorithmMetadata[key].category;

const generateAlgorithmCategoryList = (deployOnly = false) => {
    const src = deployOnly
        ? Object.fromEntries(Object.entries(algorithmMetadata).filter(a => !a[1].noDeploy))
        : algorithmMetadata;

    const alCatList = [];
    let categoryNum = 0;

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

const generateAlgorithmList = (deployOnly = false) => {
    const src = deployOnly
        ? Object.fromEntries(Object.entries(algorithmMetadata).filter(a => !a[1].noDeploy))
        : algorithmMetadata;

    const alList = [];
    let alNum = 0;

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