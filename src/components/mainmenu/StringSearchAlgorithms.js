import React from 'react';
import '../../styles/StringSearchAlgorithms.scss';

// Get the base URL dynamically
const baseUrl = window.location.origin;

const stringSearchAlgorithms = [
  { name: 'Brute Force', url: `${baseUrl}/?alg=bruteForceStringSearch&mode=search` },
  { name: "Horspool's", url: `${baseUrl}/?alg=horspoolStringSearch&mode=search` }
];

const StringSearchAlgorithms = () => {
  return (
    <div className="stringSearch-container">
      <h2 className="category">String Search</h2>
      {stringSearchAlgorithms.map((algorithm, index) => (
        <a key={index} href={algorithm.url} className="stringSearch-link">
          {algorithm.name}
        </a>
      ))}
    </div>
  );
};

export default StringSearchAlgorithms;
