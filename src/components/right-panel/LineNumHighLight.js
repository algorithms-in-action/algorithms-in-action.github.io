/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-loop-func */
/* eslint-disable react/button-has-type */
/* eslint-disable dot-notation */
/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
// eslint-disable-next-line import/named
import '../../styles/LineNumHighLight.css';
import findRef from '../../pseudocode/findRef';
import findCodeBlock from '../../pseudocode/findCodeBlock';

let codeBlocks = {};


function addIndentation(json, name) {
  const codeBlock = {};
  let pseaudo = '';
  json[name].forEach((line) => {
    if (line['ref'].length > 0) {
      pseaudo = '\xa0\xa0\xa0\xa0'.repeat(line['indentation']) + line['code'];
      codeBlock[pseaudo] = line['bookmark'];
      addIndentation(json, line['ref'], line['indentation']);
    } else {
      pseaudo = '\xa0\xa0\xa0\xa0'.repeat(line['indentation']) + line['code'];
      codeBlock[pseaudo] = line['bookmark'];
    }
  });
  codeBlocks[name] = codeBlock;
}

const addCollapse = (algorithm1, dispatch1, codeBlocks1, currentBookmark, blockName, lineNum) => {
  let i = lineNum;
  let codeLines = [];
  for (const [key, value] of Object.entries(codeBlocks1[blockName])) {
    const ref = findRef(value);
    if (ref.length > 0) {
      codeLines.push(
        <p
          key={i}
          // eslint-disable-next-line react/destructuring-assignment
          className={currentBookmark === value ? 'active' : ''}
          index={i}
          role="presentation"
        >
          <span>{i + 1}</span>
          <span>
            <button className="expand-collopse-button" onClick={() => { dispatch1(GlobalActions.COLLAPSE, ref); }}>
              {algorithm1.collapse[ref] ? <ChevronRightIcon style={{ fontSize: 12 }} />
                : <ExpandMoreIcon style={{ fontSize: 12 }} />}
            </button>
          </span>
          <span>{key}</span>
        </p>,
      );
      i += 1;
      const temp = addCollapse(algorithm1, dispatch1, codeBlocks1, currentBookmark, ref, i);
      if (algorithm1.collapse[ref]) {
        codeLines = codeLines.concat(temp.cl);
        i = temp.index;
      }
    } else {
      codeLines.push(
        <p
          key={i}
          // eslint-disable-next-line react/destructuring-assignment
          className={currentBookmark === value ? 'active' : ''}
          index={i}
          role="presentation"
        >
          <span>{i + 1}</span>
          <span>{key}</span>
        </p>,
      );
      i += 1;
    }
  }
  return { index: i, cl: codeLines };
};

const LineNumHighLight = () => {
  const { algorithm, dispatch } = useContext(GlobalContext);
  codeBlocks = {};
  addIndentation(algorithm.pseudocode, 'Main');
  const currentBookmark = findCodeBlock(algorithm, algorithm.bookmark);

  /* render data */

  return (
    <div className="line-light">
      <div className="code-container">
        {addCollapse(algorithm, dispatch, codeBlocks, currentBookmark, 'Main', 0).cl}
      </div>
    </div>
  );
};

export default LineNumHighLight;
