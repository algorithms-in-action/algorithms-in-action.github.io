/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
// eslint-disable-next-line import/named
import { GlobalContext } from '../context/GlobalState';
import findLineNum from '../pseudocode/findLineNum';
import '../styles/LineNumHighLight.css';

export const Global = {
  PAINT_CODELINE: (lineOfCode1, currentIndex) => {
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
  },
};

const LineNumHighLight = () => {
  const { algorithm } = useContext(GlobalContext);
  const lineOfCode = [];
  for (const line of algorithm.pseudocode) {
    lineOfCode.push(line.code);
  }
  const currentIndex = findLineNum(algorithm.pseudocode, algorithm.bookmark);

  /* render data */

  return (
    <div className="line-light">
      <div className="code-container">
        {Global.PAINT_CODELINE(lineOfCode, currentIndex)}
      </div>
    </div>
  );
};

export default LineNumHighLight;
