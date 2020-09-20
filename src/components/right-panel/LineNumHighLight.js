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

function blockContainsBookmark(algorithm, block) {
  for (const line of algorithm.pseudocode[block]) {
    if (line.bookmark === algorithm.bookmark
        || (line.ref && blockContainsBookmark(algorithm, line.ref, algorithm.bookmark))) {
      return true;
    }
  }
  return false;
}

function pseudocodeBlock(algorithm, dispatch, blockName, lineNum) {
  let i = lineNum;
  let codeLines = [];
  for (const line of algorithm.pseudocode[blockName]) {
    i += 1;
    const keywords = ['for', 'while', 'if', 'else', 'in', 'each',
      'repeat', 'until', 'Empty', 'Locate', 'of', 'not', 'downto', 'and', 'or'];
    const explaIndex = line.code.indexOf('//');
    const codeRexItem = [];
    if (explaIndex === -1) {
      const codeItemArray = line.code.split(' ');
      let codeItem;
      for (codeItem of codeItemArray) {
        if (keywords.includes(codeItem.trim())) {
          codeItem += ' ';
          const spanItem = <span className="keyword">{codeItem}</span>;
          codeRexItem.push(spanItem);
        } else {
          codeItem += ' ';
          const spanItem = <span>{codeItem}</span>;
          codeRexItem.push(spanItem);
        }
      }
    } else if (explaIndex === 0) {
      const spanItem = <span className="explanation">{line.code}</span>;
      codeRexItem.push(spanItem);
    } else {
      let spanItem;
      const code = line.code.substring(0, explaIndex);
      const codeItemArray = code.split(' ');
      let codeItem;
      for (codeItem of codeItemArray) {
        if (keywords.includes(codeItem.trim())) {
          codeItem += ' ';
          spanItem = <span className="keyword">{codeItem}</span>;
          codeRexItem.push(spanItem);
        } else {
          codeItem += ' ';
          spanItem = <span>{codeItem}</span>;
          codeRexItem.push(spanItem);
        }
      }
      const expla = line.code.substring(explaIndex);
      spanItem = <span className="explanation">{expla}</span>;
      codeRexItem.push(spanItem);
    }
    if (line.ref) {
      codeLines.push(
        <p
          key={i}
          className={(!algorithm.collapse[line.ref]
            && blockContainsBookmark(algorithm, line.ref)) ? 'active' : ''}
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
          {codeRexItem}
        </p>,
      );
      if (algorithm.collapse[line.ref]) {
        const subblock = pseudocodeBlock(algorithm, dispatch, line.ref, i);
        i = subblock.index;
        codeLines = codeLines.concat(subblock.cl);
      }
    } else {
      codeLines.push(
        <p
          key={i}
          className={algorithm.bookmark === line.bookmark ? 'active' : ''}
          role="presentation"
        >
          <span>{i}</span>
          {codeRexItem}
        </p>,
      );
    }
  }
  return { index: i, cl: codeLines };
}

const LineNumHighLight = () => {
  const { algorithm, dispatch } = useContext(GlobalContext);

  return (
    <div className="line-light">
      <div className="code-container">
        {pseudocodeBlock(algorithm, dispatch, 'Main', 0).cl}
      </div>
    </div>
  );
};

export default LineNumHighLight;
