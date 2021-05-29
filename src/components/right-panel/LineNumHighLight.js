/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable react/button-has-type */
/* eslint-disable dot-notation */
/* eslint-disable linebreak-style */
import React, { useContext, useEffect } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DescriptionIcon from '@material-ui/icons/Description';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/LineNumHighLight.scss';
import LineExplanation from './LineExplanation';
import { setFontSize, increaseFontSize } from '../top/helper';
import { markdownKeywords } from './MarkdownKeywords';


function blockContainsBookmark(algorithm, block) {
  for (const line of algorithm.pseudocode[block]) {
    if ((line.bookmark !== undefined && line.bookmark === algorithm.bookmark)
      || (line.ref && blockContainsBookmark(algorithm, line.ref, algorithm.bookmark))) {
      if (algorithm.name === 'Quicksort' && line.bookmark && parseInt(line.bookmark, 10) === 5) {
        sessionStorage.setItem('isPivot', true);
        sessionStorage.setItem('quicksortPlay', true);
      }
      return true;
    } if (line.bookmark !== undefined && algorithm.name === 'Quicksort' && algorithm.bookmark === '5' && line.bookmark === '13') {
      sessionStorage.setItem('isPivot', true);
      sessionStorage.setItem('quicksortPlay', true);
      return false;
    }
  }
  return false;
}

function codeFormatting(codeArray) {
  let spanItem;
  let codeItem;
  const codeRexItem = [];
  let key = 0;
  for (codeItem of codeArray) {
    let flag = true;
    let arrayIndex = 0;
    key++;
    const arrayLength = codeArray.length;
    for (const markdownKeyword of Object.keys(markdownKeywords)) {
      if (markdownKeywords[markdownKeyword].includes(codeItem.trim())) {
        if (arrayIndex < arrayLength - 1) {
          codeItem += '\xa0';
        }
        spanItem = <span key={key} className={markdownKeyword}>{codeItem}</span>;
        codeRexItem.push(spanItem);
        flag = false;
        break;
      }
    }
    if (flag) {
      if (codeItem.indexOf('(') !== -1) {
        let func = codeItem;
        while (func.indexOf('(') !== -1) {
          key++;
          const funcName = func.substring(0, func.indexOf('('));
          spanItem = <span key={key} className="function">{funcName}</span>;
          codeRexItem.push(spanItem);
          key++;
          spanItem = <span key={key}>(</span>;
          codeRexItem.push(spanItem);
          const funcContent = func.substring(func.indexOf('(') + 1);
          func = funcContent;
        }
        if (arrayIndex < arrayLength - 1) {
          func += '\xa0';
        }
        key++;
        spanItem = <span key={key}>{func}</span>;
        codeRexItem.push(spanItem);
      } else {
        if (arrayIndex < arrayLength - 1) {
          codeItem += '\xa0';
        }
        key++;
        spanItem = <span key={key}>{codeItem}</span>;
        codeRexItem.push(spanItem);
      }
    }
    arrayIndex += 1;
  }
  return codeRexItem;
}


function getAllBlocksToCollapse(algorithm, parent) {
  if (parent) {
    let results = [parent];
    const line = algorithm.pseudocode[parent];
    for (let i = 0; i < line.length; i++) {
      const result = getAllBlocksToCollapse(algorithm, line[i]['ref']);
      if (result) {
        results = results.concat(result);
      }
    }
    return results;
  }
  return null;
}


function pseudocodeBlock(algorithm, dispatch, blockName, lineNum) {
  let i = lineNum;
  let codeLines = [];
  const key = 0;
  for (const line of algorithm.pseudocode[blockName]) {
    i += 1;
    // Pseudocode Formatting
    const explaIndex = line.code.indexOf('//');
    let pseudoceArary = [];
    if (explaIndex === -1) {
      if (line.ref && algorithm.collapse[algorithm.id.name][algorithm.id.mode][line.ref]) {
        const spanItem = <span key={key} className="explanation">{`//${line.code}`}</span>;
        pseudoceArary.push(spanItem);
      } else {
        const codeItemArray = line.code.split(' ');
        pseudoceArary = [...codeFormatting(codeItemArray)];
      }
    } else if (explaIndex === 0) {
      const spanItem = <span key={key} className="explanation">{line.code}</span>;
      pseudoceArary.push(spanItem);
    } else {
      const code = line.code.substring(0, explaIndex);
      const codeItemArray = code.split(' ');
      pseudoceArary = [...codeFormatting(codeItemArray)];
      const expla = line.code.substring(explaIndex);
      const spanItem = <span key={key} className="explanation">{expla}</span>;
      pseudoceArary.push(spanItem);
    }

    let lineExplanButton = null;
    if (algorithm.collapse[algorithm.id.name][algorithm.id.mode][blockName] && line.lineExplanButton !== undefined) {
      lineExplanButton =
        <button
          className={line.explanation === algorithm.lineExplanation ? 'line-explanation-button-active' : 'line-explanation-button-negative'}
          onClick={() => { dispatch(GlobalActions.LineExplan, line.explanation); }}
        >
          <DescriptionIcon style={{ fontSize: 10 }} />
        </button>;
    }

    if (line.ref) {
      codeLines.push(
        <p
          key={i}
          className={(!algorithm.collapse[algorithm.id.name][algorithm.id.mode][line.ref]
            && blockContainsBookmark(algorithm, line.ref)) ? 'active' : ''}
          role="presentation"
        >
          <span>{i}</span>
          <span>
            <button
              className={algorithm.collapse[algorithm.id.name][algorithm.id.mode][line.ref] ? 'expand-collapse-button-active' : 'expand-collopse-button'}
              onClick={() => {
                // If the block needs to collapse, get reference for all sub-blocks (recursively) and collapse the sub-blocks
                if (algorithm.collapse[algorithm.id.name][algorithm.id.mode][line.ref]) {
                  const blocksToCollapse = getAllBlocksToCollapse(algorithm, line.ref);
                  for (let l = 0; l < blocksToCollapse.length; l++) {
                    dispatch(GlobalActions.COLLAPSE, { codeblockname: blocksToCollapse[l], expandOrCollapase: false });
                  }
                } else {
                  dispatch(GlobalActions.COLLAPSE, { codeblockname: line.ref });
                }
              }}
            >
              {algorithm.collapse[algorithm.id.name][algorithm.id.mode][line.ref]
                ? <ExpandMoreIcon style={{ fontSize: 12 }} />
                : <ChevronRightIcon style={{ fontSize: 12 }} />}
            </button>
          </span>
          <span>{lineExplanButton}</span>
          {pseudoceArary}
        </p>,
      );
      if (algorithm.collapse[algorithm.id.name][algorithm.id.mode][line.ref]) {
        const subblock = pseudocodeBlock(algorithm, dispatch, line.ref, i);
        i = subblock.index;
        codeLines = codeLines.concat(subblock.cl);
      }
    } else {
      codeLines.push(
        <p
          key={i}
          className={(line.bookmark !== undefined && algorithm.bookmark === line.bookmark) ? 'active' : ''}
          role="presentation"
        >
          <span>{i}</span>
          <span>{null}</span>
          <span>{lineExplanButton}</span>
          {pseudoceArary}
        </p>,
      );
    }
  }
  return { index: i, cl: codeLines };
}

const pseudoCodePadding = (lineNum, limit) => {
  const codeLines = [];

  for (let i = lineNum; i < (lineNum + limit); i++) {
    codeLines.push(
      <p
        key={i}
        role="presentation"
      >
        <span>{i}</span>
      </p>,
    );
  }

  return codeLines;
};

const PADDING_LINE = 2;

const LineNumHighLight = ({ fontSize, fontSizeIncrement }) => {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const fontID = 'code-container';

  useEffect(() => {
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [fontSizeIncrement, fontSize]);

  const { index, cl } = pseudocodeBlock(algorithm, dispatch, 'Main', 0);
  const pseudoCodePad = pseudoCodePadding(index + 1, PADDING_LINE);

  return (
    <div className="line-light">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap" rel="stylesheet" />
      <div className="code-container" id={fontID}>
        {cl}
        {pseudoCodePad}
      </div>
      { algorithm.lineExplanation ? (
        <LineExplanation
          explanation={algorithm.lineExplanation}
          fontSize={fontSize}
          fontSizeIncrement={fontSizeIncrement}
        />
      ) : ''}
    </div>
  );
};

export default LineNumHighLight;
LineNumHighLight.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
