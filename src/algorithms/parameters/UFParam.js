/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';

import { withStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';
import { successParamMsg, errorParamMsg } from './helpers/ParamHelper';


import SingleValueParam from './helpers/SingleValueParam';
import DualValueParam from './helpers/DualValueParam';

import '../../styles/Param.scss';
import { set } from 'lodash';

const N_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const DEFAULT_UNION = '5-7,8-5,9-8,3-9,5-2';
const DEFAULT_FIND = '2';

const ALGORITHM_NAME = 'Union Find';
const FIND = 'Find'
const UNION = 'Union'

const ADD_EXAMPLE = "Can only add two single digits between 1 and 10."
const FIND_EXAMPLE = 'Please follow the example provided: 2. The single digit should be between 1 and 10.';
const UNION_EXAMPLE = "Please follow the example provided: 5-7,8-5,9-8,3-9,5-2. All digits should be between 1 and 10, '-' should be used to separate the two digits, and ',' should be used to separate each union operation.";

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
  const [pathCompressionEnabled, setPathCompressionEnabled] = useState(false);

  // Toggling path compression (i.e., a boolean value).
  const handleChange = () => {
    setPathCompressionEnabled(prevState => !prevState);
  }


  // Validating input before find submission.
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
  }


  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [pathCompressionEnabled],
  );

  return (
    <>
      <div className="form">
        <DualValueParam
            name="unionFind"
            buttonName="Union"
            mode="union"
            formClassName="formLeft"
            ALGORITHM_NAME={UNION}
            DEFAULT_TEXT={DEFAULT_UNION}
            ADD_EXAMPLE={ADD_EXAMPLE}
            SUBMIT_EXAMPLE={UNION_EXAMPLE}
            setMessage={setMessage}
            validateAddInput={validatePairInput}
            validateTextInput={validateTextInput}
            // Formatting input to be added to text field. 
            inputFormatPattern={"{0}-{1}"}
            // Formatting the final output for use in algorithm.
            parseTextInput={(value) => {
              return value.split(',').map(pair => pair.split('-').map(Number));
            }}
            placeholderVal1="Set 1"
            placeholderVal2="Set 2"
            additionalTarget={pathCompressionEnabled}
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
        control={(
          <BlueRadio
            checked={pathCompressionEnabled === true}
            onChange={handleChange}
            name="on"
          />
        )}
        label="On"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={pathCompressionEnabled === false}
            onChange={handleChange}
            name="off"
          />
        )}
        label="Off"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  );
}

export default UFParam;

// For validating the add input within the DualValueParam component.
function validatePairInput(value1, value2) {

  if(!value1 || !value2) return false;
  if (isNaN(value1) || isNaN(value2)) return false;

  // checks if each value in pair is in domain
  if (!N_ARRAY.includes(value1) || !N_ARRAY.includes(value2)) return false;

  return true;
}

// For validating the text input within the DualValueParam component.
function validateTextInput(value) {
  if (!value) return false;

  // Ensuring only allowable characters.
  if (!/^[0-9,-]+$/.test(value)) return false;

  // Strips off commas at the start and end of the string.
  value = value.replace(/^,|,$/g, '');

  // Splits the string into an array of pairs.
  const pairs = value.split(',');

  // Checks if each pair is valid.
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('-');

    // Checks only two values in pair.
    if (pair.length !== 2) return false;

    // Checks if each value in pair is in domain.
    if (pair.some((val) => isNaN(val) || !N_ARRAY.includes(val))) return false;

  }
  return true;

}