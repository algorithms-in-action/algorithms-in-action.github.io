// minimal mods from BST- chould change some names XXX
// XXX radio button behaviour could still be improved
/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import { GlobalContext } from '../../context/GlobalState';
import { URLContext } from '../../context/urlState';
import { GlobalActions } from '../../context/actions';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';
import { singleNumberValidCheck } from './helpers/InputValidators';
import { genUniqueRandNumList, balanceBSTArray, shuffleArray } from './helpers/InputBuilders';
import { errorParamMsg } from './helpers/ParamMsg';

import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

// import useParam from '../../context/useParam';

const DEFAULT_NODES = genUniqueRandNumList(12, 1, 100);
const DEFAULT_TARGET = '2';
const INSERTION = 'insertion';
const SEARCH = 'search';
const INSERTION_EXAMPLE = 'Duplicate-free list of non-negative integers please: 0,1,2,3,4';
const SEARCH_EXAMPLE = 'Please follow the example provided: 16';
const UNCHECKED = {
  random: false,
  sorted: false,
  balanced: false,
};

const BlueRadio = withStyles({
  root: {
    color: '#2289ff',
    '&$checked': {
      color: '#027aff',
    },
  },
  checked: {},
  // eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Radio {...props} />);

function TTFTParam({ mode, list, value }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [localNodes, setlocalNodes] = useState(list || DEFAULT_NODES);
  const { setNodes, setSearchValue } = useContext(URLContext);
  const [bstCase, setBSTCase] = useState({
    random: false,
    sorted: false,
    balanced: false,
  });
  const [localValue, setLocalValue] = useState(DEFAULT_TARGET);

  useEffect(() => {
    setNodes(localNodes);
    setSearchValue(localValue);
    // If input nodes are manually edited, we want to uncheck the case.
    // This also unchecks the case when sorted and balanced are selected
    // but (for some unknown reason) not when random is selected. This
    // isn't ideal XXX but is not too bad.
    setBSTCase(UNCHECKED);
  }, [localNodes, localValue, setNodes, setSearchValue]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'random':
        setlocalNodes(shuffleArray(localNodes));
        break;
      case 'sorted':
        setlocalNodes([...localNodes].sort((a, b) => a - b));
        break;
      case 'balanced':
        setlocalNodes(balanceBSTArray([...localNodes].sort((a, b) => a - b)));
        break;
      default:
    }

    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
  };
  /**
   * For 234 tree, we don't support duplicate keys (XXX could just ignore)
   * therefore we need some extra check to make sure the tree is not empty.
   * So we need to implement a new handle function instead of using the default one.
   */
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
    } else {
      setMessage(errorParamMsg('2-3-4 Trees', INSERTION_EXAMPLE));
    }
  };

  /**
   * For BST, since we need to insert nodes before run the search algorithm,
   * therefore we need some extra check to make sure the tree is not empty.
   * So we need to implement a new handle function instead of using the default one.
   */
const handleSearch = (e) => {
  e.preventDefault();
  const inputValue = e.target[0].value;
  setLocalValue(inputValue);

  const check = singleNumberValidCheck(inputValue);

  if (check.valid) {
    const target = parseInt(inputValue, 10);

    // Make sure the tree is not empty
    if (
      algorithm.hasOwnProperty('visualisers') &&
      !algorithm.visualisers.tree.instance.isEmpty()
    ) {
      const visualiser = algorithm.chunker.visualisers;

      // Run search animation
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'TTFTree',
        mode: 'search',
        visualiser,
        target,
      });
    } else {
      // Tree is empty
      setMessage(
        errorParamMsg(
          SEARCH,
          undefined,
          'Please fully build the tree before running a search.',
        ),
      );
    }
  } else {
    // Invalid input
    setMessage(errorParamMsg(SEARCH, SEARCH_EXAMPLE, check.error));
  }
};


  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [bstCase],
  );

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
        <SingleValueParam
          name="TTFTree"
          buttonName="Search"
          mode="search"
          formClassName="formRight"
          DEFAULT_VAL={value || localValue}
          ALGORITHM_NAME={SEARCH}
          EXAMPLE={SEARCH_EXAMPLE}
          handleSubmit={handleSearch}
          setMessage={setMessage}
        />
      </div>
      <span className="generalText">Re-order input: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.random}
            onChange={handleChange}
            name="random"
          />
        )}
        label="Random"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.sorted}
            onChange={handleChange}
            name="sorted"
          />
        )}
        label="Sorted"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.balanced}
            onChange={handleChange}
            name="balanced"
          />
        )}
        label="Balanced"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
TTFTParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default withAlgorithmParams(TTFTParam); // Export with the wrapper for URL Params

// XXX rename and put in ./helpers/ParamHelper
function validateListInput(input) {
  const inputArr = input.split(',');
  const inputSet = new Set(inputArr);
  return (
    inputArr.length === inputSet.size // no duplicates
    && inputArr.every((num) => singleNumberValidCheck(num))
  );
}

