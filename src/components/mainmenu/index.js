import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // add this line
import '../../styles/mainmenu.scss';
import logo from '../../assets/logo.svg';
import SortingAlgorithms from './SortingAlgorithms';
import InsertSearchAlgorithms from './InsertSearchAlgorithms';
import GraphAlgorithms from './GraphAlgorithms';
import SetAlgorithms from './SetAlgorithms';
import StringSearchAlgorithms from './StringSearchAlgorithms';

// Get the base URL dynamically
const baseUrl = window.location.origin;

// XXX should have algorithms just listed in one place
// (eg src/algorithms/index.js)
// and filtered appropriately rather
// than have multiple algorithm lists (here, above, SortingAlgorithms.js,
// InsertSearchAlgorithms.js etc), as was done previously...
// XXX also fix display code (see XXX elsewhere)
const allAlgorithms = [
    { name: 'Brute Force', url: `${baseUrl}/?alg=bruteForceStringSearch&mode=search` },
    { name: "Horspool's", url: `${baseUrl}/?alg=horspoolStringSearch&mode=search` },
    { name: 'Depth First Search', url: `${baseUrl}/?alg=DFSrec&mode=find` },
    { name: 'DFS (iterative)', url: `${baseUrl}/?alg=DFS&mode=find` },
    { name: 'Breadth First Search', url: `${baseUrl}/?alg=BFS&mode=find` },
    { name: "Dijkstra's (shortest path)", url: `${baseUrl}/?alg=dijkstra&mode=find` },
    { name: 'A* (heuristic search)', url: `${baseUrl}/?alg=aStar&mode=find` },
    { name: "Prim's (min. spanning tree)", url: `${baseUrl}/?alg=prim&mode=find` },
    { name: "Prim's (simpler code)", url: `${baseUrl}/?alg=prim_old&mode=find` },
    { name: "Kruskal's (min. spanning tree)", url: `${baseUrl}/?alg=kruskal&mode=find` },
    { name: "Warshall's (transitive closure)", url: `${baseUrl}/?alg=transitiveClosure&mode=tc` },
    { name: 'Binary Search Tree', url: `${baseUrl}/?alg=binarySearchTree&mode=search` },
    { name: '2-3-4 Tree', url: `${baseUrl}/?alg=TTFTree&mode=search` },
    { name: 'AVL Tree', url: `${baseUrl}/?alg=AVLTree&mode=search` },
    { name: 'Union Find', url: `${baseUrl}/?alg=unionFind&mode=find` },
    { name: 'Heapsort', url: `${baseUrl}/?alg=heapSort&mode=sort` },
    { name: 'Quicksort', url: `${baseUrl}/?alg=quickSort&mode=sort` },
    { name: 'Quicksort (Median of 3)', url: `${baseUrl}/?alg=quickSortM3&mode=sort` },
    { name: 'Merge Sort', url: `${baseUrl}/?alg=msort_arr_td&mode=sort` }, // don't include list mergesort?
    { name: 'Radix Sort (MSD/Exchange)', url: `${baseUrl}/?alg=radixSortMSD&mode=sort` },
    { name: 'Radix Sort (LSD/Straight)', url: `${baseUrl}/?alg=radixSortStraigh&mode=sort` },
  ];

// const allAlgorithms = [
//   { name: 'Brute Force', url: 'alg=bruteForceStringSearch&mode=search' },
//   { name: "Horspool's", url: 'alg=horspoolStringSearch&mode=search' },
//   { name: 'Depth First Search', url: 'alg=DFSrec&mode=find' },
//   { name: 'DFS (iterative)', url: 'alg=DFS&mode=find' },
//   { name: 'Breadth First Search', url: 'alg=BFS&mode=find' },
//   { name: "Dijkstra's (shortest path)", url: 'alg=dijkstra&mode=find' },
//   { name: 'A* (heuristic search)', url: 'alg=aStar&mode=find' },
//   { name: "Prim's (min. spanning tree)", url: 'alg=prim&mode=find' },
//   { name: "Prim's (simpler code)", url: 'alg=prim_old&mode=find' },
//   { name: "Kruskal's (min. spanning tree)", url: 'alg=kruskal&mode=find' },
//   { name: "Warshall's (transitive closure)", url: 'alg=transitiveClosure&mode=tc' },
//   { name: 'Binary Search Tree', url: 'alg=binarySearchTree&mode=search' },
//   { name: '2-3-4 Tree', url: 'alg=TTFTree&mode=search' },
//   { name: 'Union Find', url: 'alg=unionFind&mode=find' },
//   { name: 'Heapsort', url: 'alg=heapSort&mode=sort' },
//   { name: 'Quicksort', url: 'alg=quickSort&mode=sort' },
//   { name: 'Quicksort (Median of 3)', url: 'alg=quickSortM3&mode=sort' },
//   { name: 'Merge Sort', url: 'alg=msort_arr_td&mode=sort' } // don't include list mergesort?
// ];

const Mainmenu = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

    const filteredAlgorithms = allAlgorithms.filter(algorithm =>
    algorithm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="mainmenu-container">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">
          <span className="algorithm">Algorithms</span>
          <span className="in-action">In Action</span>
        </h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for algorithm"
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
        <Link to="/about" className="about-link">About</Link>
      </div>
      <div className="main-content">
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
