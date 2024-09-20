import React from 'react';
import '../../styles/InsertSearchAlgorithms.scss'; 

const insertSearchAlgorithms = [
  { name: 'Binary Search Tree', url: 'http://localhost:3000/' },
  { name: '2-3-4 Tree', url: 'http://localhost:3000/' },
];

const InsertSearchAlgorithms = () => {
  return (
    <div className="insertSearch-container">
      <h2 className="category">Insert/Search</h2>
      {insertSearchAlgorithms.map((algorithm, index) => (
        <a key={index} href={algorithm.url} className="insertSearch-link">
          {algorithm.name}
        </a>
      ))}
    </div>
  );
};

export default InsertSearchAlgorithms;