/* eslint-disable react/no-array-index-key */
import React, { useContext } from 'react';
// eslint-disable-next-line import/named
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/LineNumHighLight.css';

const LineNumHighLight = () => {
  const { algorithm } = useContext(GlobalContext);
  const lineOfCode = {};
  for (const line of algorithm.pseudocode) {
    lineOfCode[line.code] = line.bookmark;
  }

  return (
    <div className="line-light">
      <div className="code-container">
        {algorithm.pseudocode.map((line, index) => (
          <p
            key={index}
            className={algorithm.bookmark === line.bookmark ? 'active' : ''}
            role="presentation"
          >
            <span>{index + 1}</span>
            <span>{line.code}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default LineNumHighLight;
