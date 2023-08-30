/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState} from 'react';
import '../../../styles/Param.scss';
import { GlobalActions } from '../../../context/actions';
import DualValueForm from './DualValueForm';
import useParam from '../../../context/useParam';
import { successParamMsg, errorParamMsg } from './ParamHelper';

// find someway to import this more nicely?? so can change in multiple places
const N_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

// to-do:
// manual editing: maybe we shouldnt allow them to type characters? or continue to type if input is correct? overall, should not be checking validation at the end, as they will have to go back through their text carefully - quite annoying. 
// with the manual ediitng real-time validaiton, could like colour the border red if invalid? or stop them from typing?
// could have more targeted error (e.g., out of bounds value, incorrect syntax, etc.)

function DualValueParam({
  name, buttonName, mode, DEFAULT_VAL, ALGORITHM_NAME,
  EXAMPLE, formClassName, handleSubmit, setMessage,
}) {
  const {
    dispatch,
    disabled,
    paramVal,
    setParamVal,
  } = useParam(DEFAULT_VAL);


  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const handleAdd = () => {

    const trimmedInput1 = input1.trim();
    const trimmedInput2 = input2.trim();

    if(validateNumberInput(trimmedInput1, trimmedInput2)) {

      const formatInput = `${trimmedInput1}-${trimmedInput2}`;
      if (paramVal) {
        setParamVal(prev => `${prev},${formatInput}`);
      } else {
          setParamVal(formatInput);
      }
      setInput1('');
      setInput2('');
      setMessage(successParamMsg(ALGORITHM_NAME));

    }
    else {
      setMessage(errorParamMsg(ALGORITHM_NAME, "Can only add two single digits between 1 and 10."));
    }
  };

  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.elements.unionTextInput.value;

    if (validateTextInput(inputValue)) {
      const target = inputValue.split(',').map(pair => pair.split('-').map(Number));

      // run animation
      dispatch(GlobalActions.RUN_ALGORITHM, { name, mode, target });

      setMessage(successParamMsg(ALGORITHM_NAME));
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    }
    
  };

  return (
    <DualValueForm
      formClassName={formClassName}
      name={ALGORITHM_NAME}
      buttonName={buttonName}
      input1={{value: input1, onChange: (e) => setInput1(e.target.value)}}
      input2={{value: input2, onChange: (e) => setInput2(e.target.value)}}
      textInput={{value: paramVal, onChange: (e) => setParamVal(e.target.value)}}
      onAdd={handleAdd}
      onChangeText={(e) => setParamVal(e.target.value)}
      disabled={disabled}
      handleSubmit={
        handleSubmit && typeof handleSubmit === 'function'
          ? handleSubmit
          : handleDefaultSubmit
      }
    />
  );
}

export default DualValueParam;

function validateTextInput(value) {
  if (!value) return false;

  // ensuring only allowable characters
  if (!/^[0-9,-]+$/.test(value)) return false;

  // strips of commas at the start and end of the string
  value = value.replace(/^,|,$/g, '');

  // splits the string into an array of pairs
  const pairs = value.split(',');

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

function validateNumberInput(value1, value2) {

  if(!value1 || !value2) return false;
  if (isNaN(value1) || isNaN(value2)) return false;

  // checks if each value in pair is in domain
  if (!N_ARRAY.includes(value1) || !N_ARRAY.includes(value2)) return false;

  return true;
}