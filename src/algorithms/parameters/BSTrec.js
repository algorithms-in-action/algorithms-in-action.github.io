// minimal mods from AVLTree - switched to BSTrec
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
import { 
  genUniqueRandNumList,
  balanceBSTArray,
  shuffleArray
} from './helpers/InputBuilders';

import { errorParamMsg } from './helpers/ParamMsg';

import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers';
import { ERRORS, EXAMPLES } from './helpers/ErrorExampleStrings';

const DEFAULT_NODES = genUniqueRandNumList(12, 1, 100);
const DEFAULT_TARGET = '2';

const INSERTION = 'insertion';
const SEARCH = 'search';

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
})((props) => <Radio {...props} />);

function BSTrecParam({ mode, list, value }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [localNodes, setLocalNodes] = useState(list || DEFAULT_NODES);
  const { setNodes, setSearchValue } = useContext(URLContext);
  const [bstCase, setBSTCase] = useState(UNCHECKED);
  const [localValue, setLocalValue] = useState(DEFAULT_TARGET);

  useEffect(() => {
    setNodes(localNodes);
    setSearchValue(localValue);
    setBSTCase(UNCHECKED); // reset when nodes/values change
  }, [localNodes, localValue, setNodes, setSearchValue]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'random':
        setLocalNodes(shuffleArray(localNodes));
        break;
      case 'sorted':
        setLocalNodes([...localNodes].sort((a, b) => a - b));
        break;
      case 'balanced':
        setLocalNodes(balanceBSTArray([...localNodes].sort((a, b) => a - b)));
        break;
      default:
    }
    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
  };

  /**
   * Custom search handler for BSTrec — checks tree is not empty first.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    setLocalValue(inputValue);

    const { valid, error } = singleNumberValidCheck(inputValue);

    if (valid) {
      const target = parseInt(inputValue, 10);

      if (
        algorithm.hasOwnProperty('visualisers') &&
        !algorithm.visualisers.graph.instance.isEmpty()
      ) {
        const visualiser = algorithm.chunker.visualisers;

        dispatch(GlobalActions.RUN_ALGORITHM, {
          name: 'BSTrec',
          mode: 'search',
          visualiser,
          target,
        });

        setMessage(null);
      } else {
        setMessage(errorParamMsg(ERRORS.GEN_EMPTY_TREE_ERROR));
      }
    } else {
      setMessage(errorParamMsg(error, EXAMPLES.GEN_SINGLE_INT));
    }
  };

  useEffect(() => {
    document.getElementById('startBtnGrp').click();
  }, [bstCase]);

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ListParam
          name="BSTrec"
          buttonName="Insert"
          mode="insertion"
          formClassName="formLeft"
          DEFAULT_VAL={localNodes}
          SET_VAL={setLocalNodes}
          REFRESH_FUNCTION={() => genUniqueRandNumList(12, 1, 100)}
          ALGORITHM_NAME={INSERTION}
          EXAMPLE={EXAMPLES.GEN_LIST_PARAM}
          setMessage={setMessage}
        />

        {/* Search input */}
        <SingleValueParam
          name="BSTrec"
          buttonName="Search"
          mode="search"
          formClassName="formRight"
          DEFAULT_VAL={value || localValue}
          ALGORITHM_NAME={SEARCH}
          EXAMPLE={EXAMPLES.GEN_LIST_PARAM}
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
      {message}
    </>
  );
}

BSTrecParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default withAlgorithmParams(BSTrecParam);
