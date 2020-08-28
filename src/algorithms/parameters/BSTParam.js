/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';
import ParamMsg from './ParamMsg';
import '../../styles/Param.scss';
import { commaSeparatedNumberListValidCheck, singleNumberValidCheck, genRandNumList } from './ParamHelper';
import { ReactComponent as RefreshIcon } from '../../resources/icons/refresh.svg';

const DEFAULT_NODES = '5,8,10,3,1,6,9,7,2,0,4';
const DEFAULT_TARGET = '2';
const INSERTION = 'insertion';
const SEARCH = 'search';
const EXCEPTION = 'exception';

function BSTParam() {
  const [insertionVal, setInsertionVal] = useState(DEFAULT_NODES);
  const [searchVal, setSearchVal] = useState(DEFAULT_TARGET);
  const [logWarning, setLogWarning] = useState(false);
  const [logTag, setLogTag] = useState('');
  const [logMsg, setLogMsg] = useState('');

  const { algorithm, dispatch } = useContext(GlobalContext);

  const updateParamStatus = (type, val, success) => {
    if (success) {
      setLogTag(`${type} success!`);
      setLogWarning(false);
      setLogMsg(`Input for ${type} algorithm is valid.`);
    } else {
      setLogTag(`${type} failure!`);
      setLogWarning(true);

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

      setLogMsg(warningText);
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
            <button
              className="btn refresh"
              type="button"
              id={INSERTION}
              onClick={() => {
                const list = genRandNumList(10, 1, 100);
                setInsertionVal(list);
              }}
            >
              <RefreshIcon />
            </button>
            <button
              className="btn insertion"
              type="submit"
            >
              Insert
            </button>
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

      {logMsg
        ? <ParamMsg logWarning={logWarning} logTag={logTag} logMsg={logMsg} />
        : ''}
    </>
  );
}

export default BSTParam;
