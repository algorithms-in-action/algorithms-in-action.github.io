import React from 'react';
import '../../styles/SortingAlgorithms.scss'; 

const sortingAlgorithms = [
  { name: 'Heapsort', url: 'http://localhost:3000/' },
  { name: 'Quicksort', url: 'http://localhost:3000/' },
  { name: 'Quicksort (Median of 3)', url: 'http://localhost:3000/' },
  { name: 'Merge Sort', url: 'http://localhost:3000/' }
];

const SortingAlgorithms = () => {
  return (
    <div className="sorting-container">
      <h2 className="category">Sort</h2>
      {sortingAlgorithms.map((algorithm, index) => (
        <a key={index} href={algorithm.url} className="sorting-link">
          {algorithm.name}
        </a>
      ))}
    </div>
  );
};

export default SortingAlgorithms;