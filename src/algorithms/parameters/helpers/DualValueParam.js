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

// will need a validity check for union find... can add to ParamHelper.js.
// to-do:
// input accumulation check (i.e., check for numbers, shouldnt be able to add non-numbers or invalid (not in set) numbers)
// manual editing: maybe we shouldnt allow them to type characters? or continue to type if input is correct? overall, should not be checking validation at the end, as they will have to go back through their text carefully - quite annoying. 
// with the manual ediitng real-time validaiton, could like colour the border red if invalid? or stop them from typing?

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
    const formatInput = `${input1}-${input2}`;
    if (paramVal) {
      setParamVal(prev => `${prev},${formatInput}`);
    } else {
        setParamVal(formatInput);
    }
    setInput1('');
    setInput2('');
  };

  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    const textInput = paramVal;

    // will need parse/check logic here:
    const validateInput = true;

    if (validateInput) {
      // need to fix :)
      // need to parse input here xoxo
      const target = textInput;

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