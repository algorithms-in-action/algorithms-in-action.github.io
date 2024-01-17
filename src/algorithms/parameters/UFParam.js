/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';

import { withStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';
import { successParamMsg, errorParamMsg } from './helpers/ParamHelper';

import SingleValueParam from './helpers/SingleValueParam';
import ListParam from './helpers/ListParam';

import '../../styles/Param.scss';

const N_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const DEFAULT_UNION = ['1-2', '3-4', '2-4', '1-5', '6-8', '3-6'];
const DEFAULT_FIND = '2';

const ALGORITHM_NAME = 'Union Find';
const FIND = 'Find';
const UNION = 'Union';

const FIND_EXAMPLE =
  'Please follow the example provided: 2. The single digit should be between 1 and 10.';
const UNION_EXAMPLE =
  "Please follow the example provided: 5-7,8-5,9-8,3-9,5-2. All digits should be between 1 and 10, '-' should be used to separate the two digits, and ',' should be used to separate each union operation.";

// button styling
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

function UFParam() {
  const [message, setMessage] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [unions, setUnions] = useState(DEFAULT_UNION);
  const [pathCompressionEnabled, setPathCompressionEnabled] = useState(true);

  // toggling path compression (i.e., a boolean value)
  const handleChange = () => {
    setPathCompressionEnabled((prevState) => !prevState);
  };

  // validating input before find submission
  const handleFind = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    // eslint-disable-next-line no-restricted-globals
    if (!(isNaN(inputValue) || !N_ARRAY.includes(inputValue))) {
      const target = {
        arg1: parseInt(inputValue, 10),
        arg2: pathCompressionEnabled,
      };

      const visualiser = algorithm.chunker.visualisers;
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'unionFind',
        mode: 'find',
        visualiser,
        target,
      });
      setMessage(successParamMsg(ALGORITHM_NAME));
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, FIND_EXAMPLE));
    }
  };

  const handleUnion = (e) => {
    e.preventDefault();

    const textInput = e.target[0].value.replace(/\s+/g, '');

    if (validateTextInput(textInput)) {
      const target = {
        arg1: textInput
          .split(',')
          .map((pair) => pair.trim().split('-').map(Number)),
        arg2: pathCompressionEnabled,
      };

      // running animation
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'unionFind',
        mode: 'union',
        target,
      });

      setMessage(successParamMsg(ALGORITHM_NAME));
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, UNION_EXAMPLE));
    }
  };

  useEffect(() => {
    document.getElementById('startBtnGrp').click();
  }, [pathCompressionEnabled]);

  return (
    <>
      <div className="form">
        <ListParam
          name="unionFind"
          buttonName="Union"
          mode="union"
          formClassName="formLeft"
          DEFAULT_VAL={unions}
          SET_VAL={setUnions}
          handleSubmit={handleUnion}
          REFRESH_FUNCTION={() => DEFAULT_UNION}
          ALGORITHM_NAME={UNION}
          EXAMPLE={UNION_EXAMPLE}
          setMessage={setMessage}
        />

        <SingleValueParam
          name="unionFind"
          buttonName="Find"
          mode="find"
          formClassName="formRight"
          DEFAULT_VAL={DEFAULT_FIND}
          ALGORITHM_NAME={FIND}
          EXAMPLE={FIND_EXAMPLE}
          handleSubmit={handleFind}
          setMessage={setMessage}
        />
      </div>

      <span className="generalText">Path compression: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={
          <BlueRadio
            checked={pathCompressionEnabled === true}
            onChange={handleChange}
            name="on"
          />
        }
        label="On"
        className="checkbox"
      />
      <FormControlLabel
        control={
          <BlueRadio
            checked={pathCompressionEnabled === false}
            onChange={handleChange}
            name="off"
          />
        }
        label="Off"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  );
}

export default UFParam;

/**
 * Validate the text input within the DualValueParam component.
 * @param {String} value The text input.
 * @returns {Boolean} Whether the text input is valid.
 */
function validateTextInput(value) {
  if (!value) return false;

  // ensuring only allowable characters
  if (!/^[0-9,-\s]+$/.test(value)) return false;

  // splits the string into an array of pairs
  const pairs = value.split(',').map((pair) => pair.trim());

  // checks if each pair is valid
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('-');

    // checks only two values in pair
    if (pair.length !== 2) return false;

    // checks if each value in pair is in domain
    if (pair.some((val) => isNaN(val) || !N_ARRAY.includes(val))) return false;
  }
  return true;
}
