import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';
import {
  singleNumberValidCheck,
  genUniqueRandNumList,
  successParamMsg,
  errorParamMsg,
} from './helpers/ParamHelper';

// import useParam from '../../context/useParam';

const ALGORITHM_NAME = '2-3-4 Trees';
const INSERTION = 'Insertion';
const SEARCH = 'Search';

const DEFAULT_NODES = genUniqueRandNumList(10, 1, 100);
const DEFAULT_TARGET = '2';

const INSERTION_EXAMPLE = 'Please follow the example provided: 1,2,3,4. Values should also be unique.';
const SEARCH_EXAMPLE = 'Please follow the example provided: 16.';
const NO_TREE_ERROR = 'Please build a tree before running search.';

function TTFTreeParam() {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [nodes, setNodes] = useState(DEFAULT_NODES);


  const handleInsertion = (e) => {
    e.preventDefault();
    const list = e.target[0].value;

    if (validateListInput(list)) {
      let nodes = list.split(',').map(Number);
      // run search animation
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'TTFTree',
        mode: 'insertion',
        nodes,
      });
      setMessage(successParamMsg(ALGORITHM_NAME));
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, INSERTION_EXAMPLE));
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (singleNumberValidCheck(inputValue)) {
      const target = parseInt(inputValue, 10);

      if (
        Object.prototype.hasOwnProperty.call(algorithm, 'visualisers')
        && !algorithm.visualisers.tree.instance.isEmpty()
      ) {
        const visualiser = algorithm.chunker.visualisers;
        dispatch(GlobalActions.RUN_ALGORITHM, {
          name: 'TTFTree',
          mode: 'search',
          visualiser,
          target,
        });
        setMessage(successParamMsg(ALGORITHM_NAME));
      } else {
        setMessage(errorParamMsg(ALGORITHM_NAME, NO_TREE_ERROR));
      }
    }
    else {
      setMessage(errorParamMsg(ALGORITHM_NAME, SEARCH_EXAMPLE));
    }
  };

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ListParam
          name="TTFTree"
          buttonName="Insert"
          mode="insertion"
          formClassName="formLeft"
          DEFAULT_VAL={nodes}
          handleSubmit={handleInsertion}
          SET_VAL={setNodes}
          REFRESH_FUNCTION={(() => genUniqueRandNumList(10, 1, 100))}
          ALGORITHM_NAME={INSERTION}
          EXAMPLE={INSERTION_EXAMPLE}
          setMessage={setMessage}
        />

        {/* Search input */}
        {<SingleValueParam
          name="TTFTree"
          buttonName="Search"
          mode="search"
          formClassName="formRight"
          handleSubmit={handleSearch}
          DEFAULT_VAL={DEFAULT_TARGET}
          ALGORITHM_NAME={SEARCH}
          EXAMPLE={SEARCH_EXAMPLE}
          setMessage={setMessage}
        />}
      </div>
      {/* render success/error message */}
      {message}
    </>
  );
}

export default TTFTreeParam;

function validateListInput(input) {
  const inputArr = input.split(',');
  const inputSet = new Set(inputArr);
  return (
    inputArr.length === inputSet.size
    && inputArr.every((num) => singleNumberValidCheck(num))
  );
}