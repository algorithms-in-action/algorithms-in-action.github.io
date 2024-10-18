import React, { useState } from 'react';
import '../styles/AlgorithmMenu.scss';

// Get the base URL dynamically
const baseUrl = window.location.origin;

const algorithms = {
  Sort: {
    'Heapsort': `${baseUrl}/?alg=heapSort&mode=sort`,
    'Quicksort': `${baseUrl}/?alg=quickSort&mode=sort`,
    'Quicksort (Median of 3)': `${baseUrl}/?alg=quickSortM3&mode=sort`,
    'Merge Sort': `${baseUrl}/?alg=msort_arr_td&mode=sort`
  },
  Graph: {
    'Depth First Search': `${baseUrl}/?alg=DFSrec&mode=find`,
    'DFS (iterative)': `${baseUrl}/?alg=DFS&mode=find`,
    'Breadth First Search': `${baseUrl}/?alg=BFS&mode=find`,
    "Dijkstra's (shortest path)": `${baseUrl}/?alg=dijkstra&mode=find`,
    'A* (heuristic search)': `${baseUrl}/?alg=aStar&mode=find`,
    "Prim's (min. spanning tree)": `${baseUrl}/?alg=prim&mode=find`,
    "Prim's (simpler code)": `${baseUrl}/?alg=prim_old&mode=find`,
    "Kruskal's (min. spanning tree)": `${baseUrl}/?alg=kruskal&mode=find`,
    "Warshall's (transitive closure)": `${baseUrl}/?alg=transitiveClosure&mode=tc`
  },
  Set: {
    'Union Find': `${baseUrl}/?alg=unionFind&mode=find`
  },
  'Insert/Search': {
    'Binary Search Tree': `${baseUrl}/?alg=binarySearchTree&mode=search`,
    '2-3-4 Tree': `${baseUrl}/?alg=TTFTree&mode=search`
  },
  StringSearch: {
    'Brute Force': `${baseUrl}/?alg=bruteForceStringSearch&mode=search`,
    "Horspool's": `${baseUrl}/?alg=horspoolStringSearch&mode=search`
  }
};

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
                    <a key={alg} href={url || '#'}>{alg}</a>
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