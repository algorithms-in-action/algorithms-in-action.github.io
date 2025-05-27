import React from 'react';
import '../../styles/InsertSearchAlgorithms.scss';

// Get the base URL dynamically
const baseUrl = window.location.origin;

const insertSearchAlgorithms = [
  { name: 'Binary Search Tree', url: `${baseUrl}/?alg=binarySearchTree&mode=search` },
  { name: 'AVL Tree', url: `${baseUrl}/?alg=AVLTree&mode=search` },
  { name: '2-3-4 Tree', url: `${baseUrl}/?alg=TTFTree&mode=search` },
  { name: 'Hashing (Linear Probing)', url: `${baseUrl}/?alg=HashingLP&mode=insertion` },
  { name: 'Hashing (Double Hashing)', url: `${baseUrl}/?alg=HashingDH&mode=insertion` },
  { name: 'Hashing (Chaining)', url: `${baseUrl}/?alg=HashingCH&mode=insertion` },
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
