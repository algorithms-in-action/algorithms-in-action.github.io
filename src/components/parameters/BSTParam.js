/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';

function BSTParam() {
  const [insertionVal, setInsertionVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [deletionVal, setDeletionVal] = useState('');
  const INSERTION = 'insertion';
  const SEARCH = 'search';
  const DELETION = 'deletion';
  const [logTagCol, setLogTagCol] = useState('');
  const [logTagText, setLogTagText] = useState('');
  const [logText, setLogText] = useState('');

  const { dispatch } = useContext(GlobalContext);

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
      setLogTagText('success!');
      setLogTagCol(successCol);
      setLogText(`Input for ${type} algorithm is valid.`);
    } else {
      setLogTagText('failure!');
      setLogTagCol(warningCol);
      let warningText = `Input for ${type} algorithm is not valid. `;
      if (type === INSERTION) {
        warningText += 'Example: 0,1,2,3,4';
      } else {
        warningText += 'Example: 16';
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

          const nodes = insertionVal.split(',').map((x) => parseInt(x, 10));
          // run insertion animation
          dispatch(GlobalActions.LOAD_ALGORITHM, { name: 'binaryTreeInsertion' }, nodes);
        } else {
          updateParamStatus(INSERTION, insertionVal, false);
        }

        break;
      case SEARCH:
        if (singleNumberValidCheck(evtVal)) {
          setSearchVal(parseInt(evtVal, 10));
          updateParamStatus(SEARCH, searchVal, true);

          const target = parseInt(searchVal, 10);
          // run search animation
          dispatch(GlobalActions.LOAD_ALGORITHM, { name: 'binarySearchTree' }, insertionVal, target);
        } else {
          updateParamStatus(SEARCH, searchVal, false);
        }

        break;
      case DELETION:
        if (singleNumberValidCheck(evtVal)) {
          setDeletionVal(parseInt(evtVal, 10));
          updateParamStatus(DELETION, deletionVal, true);
        } else {
          updateParamStatus(DELETION, deletionVal, false);
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
          <label>
            <div>Insertion</div>
            <input
              name={INSERTION}
              className="inputText"
              type="text"
              value={insertionVal}
              data-testid="insertionText"
              onChange={(e) => setInsertionVal(e.target.value)}
            />
          </label>
          <input
            className="inputSubmit"
            type="submit"
            value="Run Insertion"
            data-testid="insertionSubmit"
          />
        </form>

        <form className="searchForm" onSubmit={handleSubmit}>
          <label>
            <div>Search</div>
            <input
              name={SEARCH}
              className="inputText"
              type="text"
              value={searchVal}
              data-testid="searchText"
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </label>
          <input
            className="inputSubmit"
            type="submit"
            value="Run Search"
            data-testid="searchSubmit"
          />
        </form>

        <form className="deletionForm" onSubmit={handleSubmit}>
          <label>
            <div>Deletion</div>
            <input
              name={DELETION}
              className="inputText"
              type="text"
              value={deletionVal}
              data-testid="deletionText"
              onChange={(e) => setDeletionVal(e.target.value)}
            />
          </label>
          <input
            className="inputSubmit"
            type="submit"
            value="Run Deletion"
            data-testid="deletionSubmit"
          />
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
