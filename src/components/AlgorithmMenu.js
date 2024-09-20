import React, { useState } from 'react';
import '../styles/AlgorithmMenu.scss';

const algorithms = {
  Sort: {
    'Heapsort': 'http://localhost:3000/',
    'Quicksort': 'http://localhost:3000/',
    'Quicksort (Median of 3)': 'http://localhost:3000/',
    'Merge Sort': 'http://localhost:3000/'
  },
  Graph: {
    'Depth First Search': 'http://localhost:3000/',
    'DFS (iterative)': 'http://localhost:3000/',
    'Breadth First Search': 'http://localhost:3000/',
    "Dijkstra's (shortest path)": 'http://localhost:3000/',
    'A* (heuristic search)': 'http://localhost:3000/',
    "Prim's (min. spanning tree)": 'http://localhost:3000/',
    "Prim's (simpler code)": 'http://localhost:3000/',
    "Kruskal's (min. spanning tree)": 'http://localhost:3000/',
    "Warshall's (transitive closure)": 'http://localhost:3000/'
  },
  Set: {
    'Union Find': 'http://localhost:3000/'
  },
  'Insert/Search': {
    'Binary Search Tree': 'http://localhost:3000/',
    '2-3-4 Tree': 'http://localhost:3000/'
  },
  StringSearch: {
    'Brute Force': 'http://localhost:3000/',
    "Horspool's": 'http://localhost:3000/'
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