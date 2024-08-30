import React from 'react';
import '../../styles/SetAlgorithms.scss';

const setAlgorithms = [
  { name: 'Union Find', url: 'http://localhost:3000/' }
];

const SetAlgorithms = () => {
  return (
    <div className="set-container">
      <h1 className="category">Set</h1>
      {setAlgorithms.map((algorithm, index) => (
        <a key={index} href={algorithm.url} className="set-link">
          {algorithm.name}
        </a>
      ))}
    </div>
  );
};

export default SetAlgorithms;