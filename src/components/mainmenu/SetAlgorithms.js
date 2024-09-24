import React from 'react';
import '../../styles/SetAlgorithms.scss';

// Get the base URL dynamically
const baseUrl = window.location.origin;

const setAlgorithms = [
  { name: 'Union Find', url: `${baseUrl}/alg=unionFind&mode=find` }
];

const SetAlgorithms = () => {
  return (
    <div className="set-container">
      <h2 className="category">Set</h2>
      {setAlgorithms.map((algorithm, index) => (
        <a key={index} href={algorithm.url} className="set-link">
          {algorithm.name}
        </a>
      ))}
    </div>
  );
};

export default SetAlgorithms;