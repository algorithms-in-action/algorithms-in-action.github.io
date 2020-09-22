/* eslint-disable no-loop-func */
/* eslint-disable react/button-has-type */
/* eslint-disable dot-notation */
/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/LineNumHighLight.scss';

function blockContainsBookmark(algorithm, block) {
  for (const line of algorithm.pseudocode[block]) {
    if (line.bookmark === algorithm.bookmark
        || (line.ref && blockContainsBookmark(algorithm, line.ref, algorithm.bookmark))) {
      return true;
    }
  }
  return false;
}

function codeFormatting(codeArray) {
  const keywords = ['for', 'while', 'if', 'else', 'in', 'each', 'do',
    'repeat', 'until', 'Empty', 'Locate', 'of', 'not', 'downto', 'and', 'or'];
  let spanItem;
  let codeItem;
  const codeRexItem = [];
  for (codeItem of codeArray) {
    let arrayIndex = 0;
    const arrayLength = codeArray.length;
    if (keywords.includes(codeItem.trim())) {
      if (arrayIndex < arrayLength - 1) {
        codeItem += '\xa0';
      }
      spanItem = <span className="keyword">{codeItem}</span>;
      codeRexItem.push(spanItem);
    } else if (codeItem.indexOf('(') !== -1) {
      let func = codeItem;
      while (func.indexOf('(') !== -1) {
        const funcName = func.substring(0, func.indexOf('('));
        spanItem = <span className="function">{funcName}</span>;
        codeRexItem.push(spanItem);
        spanItem = <span>(</span>;
        codeRexItem.push(spanItem);
        const funcContent = func.substring(func.indexOf('(') + 1);
        func = funcContent;
      }
      if (arrayIndex < arrayLength - 1) {
        func += '\xa0';
      }
      spanItem = <span>{func}</span>;
      codeRexItem.push(spanItem);
    } else {
      if (arrayIndex < arrayLength - 1) {
        codeItem += '\xa0';
      }
      spanItem = <span>{codeItem}</span>;
      codeRexItem.push(spanItem);
    }
    arrayIndex += 1;
  }
  return codeRexItem;
}

function pseudocodeBlock(algorithm, dispatch, blockName, lineNum) {
  let i = lineNum;
  let codeLines = [];
  for (const line of algorithm.pseudocode[blockName]) {
    i += 1;
    // Pseudocode Formatting
    const explaIndex = line.code.indexOf('//');
    let pseudoceArary = [];
    if (explaIndex === -1) {
      const codeItemArray = line.code.split(' ');
      pseudoceArary = [...codeFormatting(codeItemArray)];
    } else if (explaIndex === 0) {
      const spanItem = <span className="explanation">{line.code}</span>;
      pseudoceArary.push(spanItem);
    } else {
      const code = line.code.substring(0, explaIndex);
      const codeItemArray = code.split(' ');
      pseudoceArary = [...codeFormatting(codeItemArray)];
      const expla = line.code.substring(explaIndex);
      const spanItem = <span className="explanation">{expla}</span>;
      pseudoceArary.push(spanItem);
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
          {pseudoceArary}
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
          {pseudoceArary}
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
