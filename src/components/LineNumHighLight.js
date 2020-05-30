/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
// eslint-disable-next-line import/named
import { GlobalContext } from '../context/GlobalState';
import findLineNum from '../pseudocode/findLineNum';
import '../styles/LineNumHighLight.css';

const LineNumHighLight = () => {
  const { algorithm } = useContext(GlobalContext);
  const lineOfCode = [];
  for (const line of algorithm.pseudocode) {
    lineOfCode.push(line.code);
  }

  /* render data */
  const paintCodeLine = (lineOfCode1) => {
    const currentIndex = findLineNum(algorithm.pseudocode, algorithm.bookmark);
    const codeLines = [];
    for (let i = 0; i < lineOfCode1.length; i += 1) {
      codeLines.push(
        <p
          key={i}
          // eslint-disable-next-line react/destructuring-assignment
          className={currentIndex === i ? 'active' : ''}
          index={i}
          role="presentation"
        >
          <span>{i + 1}</span>
          <span>{lineOfCode1[i]}</span>
        </p>,
      );
    }
    return codeLines;
  };

  return (
    <div className="line-light">
      <div className="code-container">
        {paintCodeLine(lineOfCode)}
      </div>
    </div>
  );
};
export default LineNumHighLight;
