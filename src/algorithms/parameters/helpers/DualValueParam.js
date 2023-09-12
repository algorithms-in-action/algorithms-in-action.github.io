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

/**
 * This dual value component can be used where two input values are progressively
 * combined into a formatted sequence. This sequence can be manually edited or submitted as-is.
 *
 * @param {function} validateAddInput - A function that takes two arguments and returns true if
 * the arguments are valid, false otherwise. This function is used to validate the input values
 * before they are added to the sequence.
 * @param {function} validateTextInput - A function that takes a string and returns true if the
 * string is valid, false otherwise. This function is used to validate the sequence before
 * it is submitted.
 * @param {string} inputFormatPattern - A string that is used to format the input values before
 * they are added to the sequence. The string should contain two placeholders, '{0}' and '{1}',
 * which will be replaced by the input values.
 * @param {function} parseTextInput - A function that takes a string and returns some value
 * (for example, an array) that is ready for processing within algorithm controller.
 * @param {string} placeholderVal1 - A string to be used as the placeholder for the first input value.
 * @param {string} placeholderVal2 - A string that is used as the placeholder for the second input value.
 * @param {*} additionalTarget - An optional value that is passed to the algorithm controller along with the sequence. For example, could be the value of a toggle. If included, can access within controller by using target.arg2.
 */
function DualValueParam({
  name, buttonName, mode, DEFAULT_TEXT, ALGORITHM_NAME,
  ADD_EXAMPLE, SUBMIT_EXAMPLE, setMessage, formClassName, handleSubmit, handleAdd,
  placeholderVal1 = 'Val 1',
  placeholderVal2 = 'Val 2',
  additionalTarget = null,
  // Must either implement the following, or override the handleDefaultAdd and handleDefaultSubmit functions. 
  validateAddInput = () => true,
  validateTextInput = () => true,
  inputFormatPattern = '{0}{1}',
  parseTextInput = (value) => value,
}) {
  const {
    dispatch,
    disabled,
    paramVal,
    setParamVal,
  } = useParam(DEFAULT_TEXT);

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const handleDefaultAdd = () => {

    if(validateAddInput(input1, input2)) {

      const formatInput = formatUsingPattern(inputFormatPattern, input1, input2);
      if (paramVal) {
        setParamVal(prev => `${prev},${formatInput}`);
      } else {
          setParamVal(formatInput);
      }

      // Resetting the input fields.
      setInput1('');
      setInput2('');

      setMessage(successParamMsg(ALGORITHM_NAME));

    }
    else {
      setMessage(errorParamMsg(ALGORITHM_NAME, ADD_EXAMPLE));
    }
  };

  const handleDefaultSubmit = (e) => {
    e.preventDefault();

    // Getting text from field in form.
    const textInput = e.target.elements.textInput.value;

    if (validateTextInput(textInput)) {
      
      let target;

      // Can add a second argument (e.g., value of a toggle).
      if (additionalTarget !== null) {
        target = {
          arg1: parseTextInput(textInput),
          arg2: additionalTarget,
        };
      }
      else {
        target = parseTextInput(textInput);
      }

      // Running animation.
      dispatch(GlobalActions.RUN_ALGORITHM, { name, mode, target });

      setMessage(successParamMsg(ALGORITHM_NAME));

    } else {

      setMessage(errorParamMsg(ALGORITHM_NAME, SUBMIT_EXAMPLE));
    }
    
  };
    

  return (
    <DualValueForm
      formClassName={formClassName}
      name={ALGORITHM_NAME}
      buttonName={buttonName}
      // Setting input values and handling trimming of whitespace.
      input1={{value: input1, onChange: (e) => setInput1(e.target.value.trim())}}
      input2={{value: input2, onChange: (e) => setInput2(e.target.value.trim())}}
      placeholderVal1={placeholderVal1}
      placeholderVal2={placeholderVal2}
      textInput={{value: paramVal, onChange: (e) => setParamVal(e.target.value)}}
      onAdd={
        handleAdd && typeof handleAdd === 'function'
          ? handleAdd
          : handleDefaultAdd
      }
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

const formatUsingPattern = (pattern, input1, input2) => {
  return pattern.replace('{0}', input1).replace('{1}', input2);
};
