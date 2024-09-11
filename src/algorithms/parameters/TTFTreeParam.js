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
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

// import useParam from '../../context/useParam';

const ALGORITHM_NAME = '2-3-4 Trees';
const INSERTION = 'Insertion';
const SEARCH = 'Search';

// DEFAULT input - enough for a tree with a few levels
// Should be the same as in REFRESH_FUNCTION
const DEFAULT_NODES = genUniqueRandNumList(12, 1, 100);
const DEFAULT_TARGET = '2';

const INSERTION_EXAMPLE = 'Please follow the example provided: 1,2,3,4. Values should also be unique.';
const SEARCH_EXAMPLE = 'Please follow the example provided: 16.';
const NO_TREE_ERROR = 'Please build a tree before running search.';

function TTFTreeParam({ mode, list, value }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [localNodes, setlocalNodes] = useState(list || DEFAULT_NODES);
  const { setNodes, setSearchValue } = useContext(GlobalContext);

  useEffect(() => {
    setNodes(localNodes); // sync with global state
    setSearchValue(DEFAULT_TARGET);
  }, [localNodes, setNodes, setSearchValue]);

  const handleInsertion = (e) => {
    e.preventDefault();
    const list = e.target[0].value;

    if (validateListInput(list)) {
      let localNodes = list.split(',').map(Number);
      // run search animation
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'TTFTree',
        mode: 'insertion',
        localNodes,
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
          DEFAULT_VAL={localNodes}
          handleSubmit={handleInsertion}
          SET_VAL={setlocalNodes}
          REFRESH_FUNCTION={(() => genUniqueRandNumList(12, 1, 100))}
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
          DEFAULT_VAL={value || DEFAULT_TARGET}
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

// Define the prop types for URL Params
TTFTreeParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default withAlgorithmParams(TTFTreeParam); // Export with the wrapper for URL Params

function validateListInput(input) {
  const inputArr = input.split(',');
  const inputSet = new Set(inputArr);
  return (
    inputArr.length === inputSet.size
    && inputArr.every((num) => singleNumberValidCheck(num))
  );
}