import React from 'react';
import '../../styles/SortingAlgorithms.scss'; 


const baseUrl = window.location.origin;
const sortingAlgorithms = [
  { name: 'Heapsort', url: `${baseUrl}/?alg=heapSort&mode=sort` },
  { name: 'Quicksort', url: `${baseUrl}/?alg=quickSort&mode=sort` },
  { name: 'Quicksort (Median of 3)', url: `${baseUrl}/?alg=quickSortM3&mode=sort` },
  { name: 'Merge Sort', url: `${baseUrl}/?alg=msort_arr_td&mode=sort` }
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