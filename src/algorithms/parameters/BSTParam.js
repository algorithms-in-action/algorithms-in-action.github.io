/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';
import {
  singleNumberValidCheck,
  genRandNumList,
  successParamMsg,
  errorParamMsg,
} from './helpers/ParamHelper';

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const DEFAULT_TARGET = '2';
const INSERTION = 'insertion';
const SEARCH = 'search';
const INSERTION_EXAMPLE = 'Example: 0,1,2,3,4';
const SEARCH_EXAMPLE = 'Example: 16';

function BSTParam() {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);

  /**
   * For BST, since we need to insert nodes before run the search algorithm,
   * therefore we need some extra check to make sure the tree is not empty.
   * So we need to implement a new handle function instead of using the default one.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (singleNumberValidCheck(inputValue)) {
      const target = parseInt(inputValue, 10);
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
        <ListParam
          name="binarySearchTree"
          buttonName="Insert"
          mode="insertion"
          formClassName="formLeft"
          DEFAULT_VAL={DEFAULT_NODES}
          ALGORITHM_NAME={INSERTION}
          EXAMPLE={INSERTION_EXAMPLE}
          setMessage={setMessage}
        />

        {/* Search input */}
        <SingleValueParam
          name="binarySearchTree"
          buttonName="Search"
          mode="search"
          formClassName="formRight"
          DEFAULT_VAL={DEFAULT_TARGET}
          ALGORITHM_NAME={SEARCH}
          EXAMPLE={SEARCH_EXAMPLE}
          handleSubmit={handleSearch}
          setMessage={setMessage}
        />
      </div>

      {/* render success/error message */}
      {message}
    </>
  );
}

export default BSTParam;
