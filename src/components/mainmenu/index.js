import React, { useState } from 'react';
import '../../styles/title.scss';
import SortingAlgorithms from './SortingAlgorithms';
import InsertSearchAlgorithms from './InsertSearchAlgorithms';
import GraphAlgorithms from './GraphAlgorithms';
import SetAlgorithms from './SetAlgorithms';
import StringSearchAlgorithms from './StringSearchAlgorithms';
const allAlgorithms = [
    { name: 'Brute Force', url: 'http://localhost:3000/' },
    { name: "Horspool's", url: 'http://localhost:3000/' },
    { name: 'Depth First Search', url: 'http://localhost:3000/' },
    { name: 'DFS (iterative)', url: 'http://localhost:3000/' },
    { name: 'Breadth First Search', url: 'http://localhost:3000/' },
    { name: "Dijkstra's (shortest path)", url: 'http://localhost:3000/' },
    { name: 'A* (heuristic search)', url: 'http://localhost:3000/' },
    { name: "Prim's (min. spanning tree)", url: 'http://localhost:3000/' },
    { name: "Prim's (simpler code)", url: 'http://localhost:3000/' },
    { name: "Kruskal's (min. spanning tree)", url: 'http://localhost:3000/' },
    { name: "Warshall's (transitive closure)", url: 'http://localhost:3000/' },
    { name: 'Binary Search Tree', url: 'http://localhost:3000/' },
    { name: '2-3-4 Tree', url: 'http://localhost:3000/' },
    { name: 'Union Find', url: 'http://localhost:3000/' },
    { name: 'Heapsort', url: 'http://localhost:3000/' },
    { name: 'Quicksort', url: 'http://localhost:3000/' },
    { name: 'Quicksort (Median of 3)', url: 'http://localhost:3000/' },
    { name: 'Merge Sort', url: 'http://localhost:3000/' }
  ];
const Mainmenu = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

    const filteredAlgorithms = allAlgorithms.filter(algorithm =>
    algorithm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="container">
      <h1 className="title">
        <span className="algorithm">Algorithm</span>
        &nbsp;
        <span className="in-action">In Action</span>
      </h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Algorithms"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        {searchTerm && (
          <div className="search-results">
            {filteredAlgorithms.length > 0 ? (
              filteredAlgorithms.map((algorithm, index) => (
                <a key={index} href={algorithm.url} className="search-result-link">
                  {algorithm.name}
                </a>
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        )}
      </div>
      <div>
        <SortingAlgorithms />
        <InsertSearchAlgorithms />
        <GraphAlgorithms />
        <SetAlgorithms />
        <StringSearchAlgorithms />
      </div>
    </div>
  );
};

export default Mainmenu;