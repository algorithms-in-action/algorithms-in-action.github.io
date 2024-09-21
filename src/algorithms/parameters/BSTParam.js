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
import {
  singleNumberValidCheck,
  genRandNumList,
  successParamMsg,
  errorParamMsg,
  balanceBSTArray,
  shuffleArray,
} from './helpers/ParamHelper';

import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

// import useParam from '../../context/useParam';

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const DEFAULT_TARGET = '2';
const INSERTION = 'insertion';
const SEARCH = 'search';
const INSERTION_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';
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

function BSTParam({ mode, list, value }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [localNodes, setlocalNodes] = useState(list || DEFAULT_NODES);
  const { setNodes, setSearchValue } = useContext(URLContext);
  const [bstCase, setBSTCase] = useState({
    random: true,
    sorted: false,
    balanced: false,
  });
  const [localValue, setLocalValue] = useState(DEFAULT_TARGET);

  useEffect(() => {
    setNodes(localNodes);
    setSearchValue(localValue);
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
   * For BST, since we need to insert nodes before run the search algorithm,
   * therefore we need some extra check to make sure the tree is not empty.
   * So we need to implement a new handle function instead of using the default one.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    setLocalValue(inputValue);

    if (singleNumberValidCheck(inputValue)) {
      const target = parseInt(inputValue, 10);
      // make sure the tree is not empty
      if (
        algorithm.hasOwnProperty('visualisers')
        && !algorithm.visualisers.graph.instance.isEmpty()
      ) {
        const visualiser = algorithm.chunker.visualisers;
        // run search animation
        dispatch(GlobalActions.RUN_ALGORITHM, {
          name: 'binarySearchTree',
          mode: 'search',
          visualiser,
          target,
        });
        setMessage(successParamMsg(SEARCH));
      } else {
        // when the tree is &nbsp;&nbsp;empty
        setMessage(
          errorParamMsg(
            SEARCH,
            undefined,
            'Please fully build the tree before running a search.',
          ),
        );
      }
    } else {
      // when the input cannot be converted to a number
      setMessage(errorParamMsg(SEARCH, SEARCH_EXAMPLE));
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
          name="binarySearchTree"
          buttonName="Insert"
          mode="insertion"
          formClassName="formLeft"
          DEFAULT_VAL={(() => {
            if (bstCase.balanced) {
              return balanceBSTArray([...localNodes].sort((a, b) => a - b));
            } if (bstCase.sorted) {
              return [...localNodes].sort((a, b) => a - b);
            }
            return localNodes;
          })()}
          SET_VAL={setlocalNodes}
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
          DEFAULT_VAL={value || localValue}
          ALGORITHM_NAME={SEARCH}
          EXAMPLE={SEARCH_EXAMPLE}
          handleSubmit={handleSearch}
          setMessage={setMessage}
        />
      </div>
      <span className="generalText">Choose type of tree: &nbsp;&nbsp;</span>
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
BSTParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default withAlgorithmParams(BSTParam); // Export with the wrapper for URL Params
