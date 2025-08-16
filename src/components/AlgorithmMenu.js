import React, { useState } from "react";
import "../styles/AlgorithmMenu.scss";

// AlgorithmMenu.js

// Get the base URL dynamically
const baseUrl = window.location.origin;

const algorithms = {
  Sort: {
    Heapsort: `${baseUrl}/?alg=heapSort&mode=sort`,
    Quicksort: `${baseUrl}/?alg=quickSort&mode=sort`,
    'Quicksort (Median of 3)': `${baseUrl}/?alg=quickSortM3&mode=sort`,
    'Merge Sort': `${baseUrl}/?alg=msort_arr_td&mode=sort`,
    'Merge Sort (Bottom-up)': `${baseUrl}/?alg=msort_arr_bup&mode=sort`,
    'Merge Sort (Natural)': `${baseUrl}/?alg=msort_arr_nat&mode=sort`,
    'Radix Sort (MSD/Exchange)': `${baseUrl}/?alg=radixSortMSD&mode=sort`,
    'Radix Sort (LSD/Straight)': `${baseUrl}/?alg=radixSortStraight&mode=sort`,
  },
  Graph: {
    'Depth First Search': `${baseUrl}/?alg=DFSrec&mode=find`,
    'DFS (iterative)': `${baseUrl}/?alg=DFS&mode=find`,
    'Breadth First Search': `${baseUrl}/?alg=BFS&mode=find`,
    "Dijkstra's (shortest path)": `${baseUrl}/?alg=dijkstra&mode=find`,
    'A* (heuristic search)': `${baseUrl}/?alg=aStar&mode=find`,
    "Prim's (min. spanning tree)": `${baseUrl}/?alg=prim&mode=find`,
    // "Prim's (simpler code)": `${baseUrl}/?alg=prim_old&mode=find`,
    "Kruskal's (min. spanning tree)": `${baseUrl}/?alg=kruskal&mode=find`,
    "Warshall's (transitive closure)": `${baseUrl}/?alg=transitiveClosure&mode=tc`,
  },
  Set: {
    'Union Find': `${baseUrl}/?alg=unionFind&mode=find`,
  },
  'Insert/Search': {
    'Binary Search Tree': `${baseUrl}/?alg=binarySearchTree&mode=search`,
    'AVL Tree': `${baseUrl}/?alg=AVLTree&mode=search`, //Done?: update URL stuff to include menu changes
    '2-3-4 Tree': `${baseUrl}/?alg=TTFTree&mode=search`,
    'Hashing (Linear Probing)': `${baseUrl}/?alg=HashingLP&mode=insertion`,
    'Hashing (Double Hashing)': `${baseUrl}/?alg=HashingDH&mode=insertion`,
    'Hashing (Chaining)': `${baseUrl}/?alg=HashingCH&mode=insertion`,
  },
  StringSearch: {
    'Brute Force': `${baseUrl}/?alg=bruteForceStringSearch&mode=search`,
    "Horspool's": `${baseUrl}/?alg=horspoolStringSearch&mode=search`,
  },
};
  
// TODO: I dont understand why this breaks everything, I used this import
// in MainMenu.js with no issue.
// Circular imports (npx madge src/components/AlgorithmMenu.js --circular)
// but MainMenu.js (npx madge src/components/MainMenu.js --circular)
// has the exact same circular imports???
// import { DeployedAlgorithms } from '../algorithms';

// This works but prod build doesnt allow top level await
// so we can not commit this.
// const { DeployedAlgorithms } = await import('../algorithms');

// Dynamically create URLs in algorithm menu from master list (src/algorithms/index.js).
// Only entries with noDeploy=false are included.
// const algorithms = Object.fromEntries(
//   DeployedAlgorithms.map(({ category, algorithms }) => [
//     category,
//     Object.fromEntries(
//       algorithms.map(({ name, shorthand, mode }) => [
//         name,
//         `${baseUrl}/?alg=${shorthand}&mode=${mode}`,
//       ]),
//     ),
//   ]),
// );

function AlgorithmMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="algorithm-menu">
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && (
        <div className="dropdown">
          {Object.entries(algorithms).map(([category, algs]) => (
            <div
              key={category}
              className="category"
              onMouseEnter={() => setActiveCategory(category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {category}
              {activeCategory === category && (
                <div className="subcategory">
                  {Object.entries(algs).map(([alg, url]) => (
                    <a key={alg} href={url || "#"}>
                      {alg}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlgorithmMenu;
