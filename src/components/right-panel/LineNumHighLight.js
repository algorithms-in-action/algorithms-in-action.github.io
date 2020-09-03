/* eslint-disable no-loop-func */
/* eslint-disable react/button-has-type */
/* eslint-disable dot-notation */
/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/LineNumHighLight.css';
import findCodeBlock from '../../pseudocode/findCodeBlock';

function pseudocodeBlock(algorithm, dispatch, currentBookmark, blockName, lineNum) {
  let i = lineNum;
  let codeLines = [];
  for (const line of algorithm.pseudocode[blockName]) {
    i += 1;
    if (line.ref) {
      codeLines.push(
        <p
          key={i}
          className={currentBookmark === line.bookmark ? 'active' : ''}
          index={i}
          role="presentation"
        >
          <span>{i}</span>
          <span>
            <button
              className="expand-collopse-button"
              onClick={() => {
                dispatch(GlobalActions.COLLAPSE, line.ref);
              }}
            >
              {algorithm.collapse[line.ref]
                ? <ExpandMoreIcon style={{ fontSize: 12 }} />
                : <ChevronRightIcon style={{ fontSize: 12 }} />}
            </button>
          </span>
          <span>{line.code}</span>
        </p>,
      );
      if (algorithm.collapse[line.ref]) {
        const subblock = pseudocodeBlock(algorithm, dispatch, currentBookmark, line.ref, i);
        i = subblock.index;
        codeLines = codeLines.concat(subblock.cl);
      }
    } else {
      codeLines.push(
        <p
          key={i}
          className={currentBookmark === line.bookmark ? 'active' : ''}
          index={i}
          role="presentation"
        >
          <span>{i}</span>
          <span>{line.code}</span>
        </p>,
      );
    }
  }
  return { index: i, cl: codeLines };
}

const LineNumHighLight = () => {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const currentBookmark = findCodeBlock(algorithm, algorithm.bookmark);

  /* render data */

  return (
    <div className="line-light">
      <div className="code-container">
        {pseudocodeBlock(algorithm, dispatch, currentBookmark, 'Main', 0).cl}
      </div>
    </div>
  );
};

export default LineNumHighLight;
