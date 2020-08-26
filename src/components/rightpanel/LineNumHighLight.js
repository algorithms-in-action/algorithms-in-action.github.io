/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
// eslint-disable-next-line import/named
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/LineNumHighLight.css';

export const Global = {
  PAINT_CODELINE: (lineOfCode, currentBookmark) => {
    const codeLines = [];
    let i = 0;
    for (const [key, value] of Object.entries(lineOfCode)) {
      codeLines.push(
        <p
          key={i}
          // eslint-disable-next-line react/destructuring-assignment
          className={currentBookmark.step === value ? 'active' : ''}
          index={i}
          role="presentation"
        >
          <span>{i + 1}</span>
          <span>{key}</span>
        </p>,
      );
      i += 1;
    }
    return codeLines;
  },
};

const LineNumHighLight = () => {
  const { algorithm } = useContext(GlobalContext);
  const lineOfCode = {};
  for (const line of algorithm.pseudocode) {
    lineOfCode[line.code] = line.bookmark;
  }
  const currentBookmark = algorithm.bookmark;

  /* render data */

  return (
    <div className="line-light">
      <div className="code-container">
        {Global.PAINT_CODELINE(lineOfCode, currentBookmark)}
      </div>
    </div>
  );
};

export default LineNumHighLight;
