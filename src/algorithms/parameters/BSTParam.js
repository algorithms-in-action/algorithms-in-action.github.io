/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';
import ControlButton from '../../components/common/ControlButton';
import ParamForm from './ParamForm';
import '../../styles/Param.scss';
import {
  commaSeparatedNumberListValidCheck,
  singleNumberValidCheck,
  genRandNumList,
  successParamMsg,
  errorParamMsg,
} from './ParamHelper';
import { ReactComponent as RefreshIcon } from '../../resources/icons/refresh.svg';

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const DEFAULT_TARGET = '2';
const INSERTION = 'insertion';
const SEARCH = 'search';
const INSERTION_EXAMPLE = 'Example: 0,1,2,3,4';
const SEARCH_EXAMPLE = 'Example: 16';

function BSTParam() {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const disabled = algorithm.hasOwnProperty('visualisers') && algorithm.playing;
  const [insertionVal, setInsertionVal] = useState(DEFAULT_NODES);
  const [searchVal, setSearchVal] = useState(DEFAULT_TARGET);
  const [message, setMessage] = useState(null);

  const handleInsert = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (commaSeparatedNumberListValidCheck(inputValue)) {
      const nodes = inputValue.split`,`.map((x) => +x);
      setInsertionVal(nodes);
      // run insertion animation
      // NOTE: must use 'nodes' instead of 'insertionVal' because setInsertionVal() is asynchronous
      dispatch(GlobalActions.RUN_ALGORITHM, { name: 'binarySearchTree', mode: 'insertion', nodes });
      setMessage(successParamMsg(INSERTION));
    } else {
      setMessage(errorParamMsg(INSERTION, INSERTION_EXAMPLE));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (singleNumberValidCheck(inputValue)) {
      const target = parseInt(inputValue, 10);
      setSearchVal(target);
      // make sure the tree is not empty
      if (algorithm.hasOwnProperty('visualisers') && !algorithm.visualisers.graph.instance.isEmpty()) {
        const visualiser = algorithm.chunker.visualisers;
        // run search animation
        dispatch(GlobalActions.RUN_ALGORITHM, {
          name: 'binarySearchTree', mode: 'search', visualiser, target,
        });
        setMessage(successParamMsg(SEARCH));
      } else {
        // when the tree is empty
        setMessage(errorParamMsg(SEARCH, undefined, 'Please insert nodes first.'));
      }
    } else {
      // when the input cannot be converted to a number
      setMessage(errorParamMsg(SEARCH, SEARCH_EXAMPLE));
    }
  };

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ParamForm
          formClassName="formLeft"
          name={INSERTION}
          value={insertionVal}
          onChange={(e) => setInsertionVal(e.target.value)}
          handleSubmit={handleInsert}
        >
          <ControlButton
            icon={<RefreshIcon />}
            className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
            id={INSERTION}
            disabled={disabled}
            onClick={() => {
              const list = genRandNumList(10, 1, 100);
              // clear any message
              setMessage(null);
              setInsertionVal(list);
            }}
          />
          <ControlButton
            className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
            type="submit"
            disabled={disabled}
          >
            Insert
          </ControlButton>
        </ParamForm>

        {/* Search input */}
        <ParamForm
          formClassName="formRight"
          name={SEARCH}
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          handleSubmit={handleSearch}
        >
          <ControlButton
            className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
            type="submit"
            disabled={disabled}
          >
            Search
          </ControlButton>
        </ParamForm>
      </div>

      {/* render success/error message */}
      {message}
    </>
  );
}

export default BSTParam;
