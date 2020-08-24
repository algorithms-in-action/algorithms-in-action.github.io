/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';

const DEFAULT_NODES = '5,8,10,3,1,6,9,7,2,0,4';
const DEFAULT_TARGET = '2';

function BSTParam() {
  const [insertionVal, setInsertionVal] = useState(DEFAULT_NODES);
  const [searchVal, setSearchVal] = useState(DEFAULT_TARGET);
  const INSERTION = 'insertion';
  const SEARCH = 'search';
  const EXCEPTION = 'exception';
  const [logTagCol, setLogTagCol] = useState('');
  const [logTagText, setLogTagText] = useState('');
  const [logText, setLogText] = useState('');

  const { algorithm, dispatch } = useContext(GlobalContext);

  const commaSeparatedNumberListValidCheck = (t) => {
    const regex = /^[0-9]+(,[0-9]+)*$/g;
    return t.match(regex);
  };

  const singleNumberValidCheck = (t) => {
    const regex = /^\d+$/g;
    return t.match(regex);
  };

  const updateParamStatus = (type, val, success) => {
    const warningCol = '#DC0707';
    const successCol = '#40980B';

    if (success) {
      setLogTagText(`${type} success!`);
      setLogTagCol(successCol);
      setLogText(`Input for ${type} algorithm is valid.`);
    } else {
      setLogTagText(`${type} failure!`);
      setLogTagCol(warningCol);

      let warningText = '';
      if (type === EXCEPTION) {
        warningText = 'Please insert nodes first.';
      } else {
        warningText += `Input for ${type} algorithm is not valid. `;
        if (type === INSERTION) {
          warningText += 'Example: 0,1,2,3,4';
        } else {
          warningText += 'Example: 16';
        }
      }

      setLogText(warningText);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const evtName = evt.target[0].name;
    const evtVal = evt.target[0].value;

    switch (evtName) {
      case INSERTION:
        if (commaSeparatedNumberListValidCheck(evtVal)) {
          setInsertionVal(evtVal.split`,`.map((x) => +x));
          updateParamStatus(INSERTION, insertionVal, true);

          const nodes = typeof insertionVal === 'string'
            ? insertionVal.split(',').map((x) => parseInt(x, 10))
            : insertionVal;
          // run insertion animation
          dispatch(GlobalActions.RUN_ALGORITHM, { name: 'binarySearchTree', mode: 'insertion', nodes });
        } else {
          updateParamStatus(INSERTION, insertionVal, false);
        }

        break;
      case SEARCH:
        if (singleNumberValidCheck(evtVal)) {
          setSearchVal(parseInt(evtVal, 10));

          const target = parseInt(searchVal, 10);

          // make sure the tree is not empty
          if (algorithm.hasOwnProperty('visualisers') && !algorithm.visualisers.instance.isEmpty()) {
            // run search animation
            const visualiser = algorithm.chunker.visualisers;
            dispatch(GlobalActions.RUN_ALGORITHM, {
              name: 'binarySearchTree', mode: 'search', visualiser, target,
            });
            updateParamStatus(SEARCH, searchVal, true);
          } else {
            updateParamStatus(EXCEPTION, searchVal, false);
          }
        } else {
          updateParamStatus(SEARCH, searchVal, false);
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="BSTForm">

        <form className="insertionForm" onSubmit={handleSubmit}>
          <div className="outerInput">
            <label>
              <input
                name={INSERTION}
                className="inputText"
                type="text"
                value={insertionVal}
                data-testid="insertionText"
                placeholder="e.g. 4,2,3,1,2,3,4,5"
                onChange={(e) => setInsertionVal(e.target.value)}
              />
            </label>
            <input
              className="inputSubmit"
              type="submit"
              value="Insert"
              data-testid="insertionSubmit"
            />
          </div>
        </form>

        <form className="searchForm" onSubmit={handleSubmit}>
          <div className="outerInput">
            <label>
              <input
                name={SEARCH}
                className="inputText"
                type="text"
                value={searchVal}
                data-testid="searchText"
                placeholder="e.g. 17"
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </label>
            <input

              className="inputSubmit"
              type="submit"
              value="Search"
              data-testid="searchSubmit"
            />
          </div>
        </form>
      </div>

      {logText
        ? (
          <div className="logContainer">
            <span
              className="logTag"
              data-testid="logTag"
              style={{ color: logTagCol }}
            >
              { logTagText }
            </span>
            <span className="logText">{ logText }</span>
          </div>
        )
        : ''}
    </>
  );
}

export default BSTParam;
