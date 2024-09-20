import React from 'react';
import '../../styles/StringSearchAlgorithms.scss';

const stringSearchAlgorithms = [
  { name: 'Brute Force', url: 'http://localhost:3000/' },
  { name: "Horspool's", url: 'http://localhost:3000/' }
];

const StringSearchAlgorithms = () => {
  return (
    <div className="stringSearch-container">
      <h2 className="category">StringSearch</h2>
      {stringSearchAlgorithms.map((algorithm, index) => (
        <a key={index} href={algorithm.url} className="stringSearch-link">
          {algorithm.name}
        </a>
      ))}
    </div>
  );
};

export default StringSearchAlgorithms;